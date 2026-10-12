// ================================================================
// DỊCH VỤ ĐỒNG BỘ ĐÁM MÂY & SAO LƯU DỮ LIỆU (FIREBASE SYNC SERVICE)
// Dự án Firebase: gochoctap-aaa4a
// Thiết kế tối ưu hóa gói miễn phí (Spark Free Tier) của Firebase:
// - Đọc tối đa 50,000 lượt/ngày
// - Ghi tối đa 20,000 lượt/ngày
// - Tận dụng Local Cache để giảm 95% lượt truy vấn lên máy chủ
// - COPPA compliant: Không thu thập email, bảo mật danh tính trẻ nhỏ
// ================================================================

import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs, limit, query, where, orderBy } from 'firebase/firestore';
import { db, ensureAnonymousAuth, signInWithGoogle, signOutGoogle } from './firebase';
import { UserProfile, UserProgressMap, MascotState, LeaderboardEntry } from '../types/user';
import { Lesson, Grade } from '../types/curriculum';
import { defaultMascot, defaultProfile, storageService } from './storageService';
import { isValidLessonImport } from './teacherValidation';

export interface BackupDataPackage {
  version: string;
  exportedAt: string;
  profile: UserProfile;
  progress: UserProgressMap;
  mascot: MascotState;
  customLessons?: Lesson[];
}

export interface CloudKidData {
  profile: UserProfile;
  progress: UserProgressMap;
  mascot: MascotState;
  customLessons: Lesson[];
}

function childDocumentId(userId: string): string {
  return encodeURIComponent(userId);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseBackupData(value: unknown): BackupDataPackage {
  if (!isRecord(value) || value.version !== '1.0.0' || !isRecord(value.profile) || !isRecord(value.progress)) {
    throw new Error('File sao lưu không đúng định dạng hoặc phiên bản không được hỗ trợ.');
  }

  const profile = value.profile;
  if (typeof profile.userId !== 'string' || !profile.userId.trim()
    || typeof profile.displayName !== 'string' || !profile.displayName.trim()
    || !Number.isInteger(profile.currentGrade) || Number(profile.currentGrade) < 1 || Number(profile.currentGrade) > 5
    || !Number.isFinite(profile.stars) || Number(profile.stars) < 0
    || !Number.isFinite(profile.gems) || Number(profile.gems) < 0
    || !Array.isArray(profile.unlockedBadges)) {
    throw new Error('Hồ sơ trong file sao lưu không hợp lệ.');
  }

  for (const [lessonId, rawProgress] of Object.entries(value.progress)) {
    if (!lessonId || !isRecord(rawProgress)
      || !Number.isFinite(rawProgress.score) || Number(rawProgress.score) < 0 || Number(rawProgress.score) > 100
      || !Number.isInteger(rawProgress.stars) || Number(rawProgress.stars) < 0 || Number(rawProgress.stars) > 3
      || !Number.isInteger(rawProgress.attempts) || Number(rawProgress.attempts) < 0
      || typeof rawProgress.completedAt !== 'string') {
      throw new Error(`Tiến độ bài học "${lessonId}" trong file sao lưu không hợp lệ.`);
    }
  }

  let mascot = defaultMascot;
  if (value.mascot !== undefined) {
    if (!isRecord(value.mascot) || typeof value.mascot.name !== 'string'
      || !Number.isInteger(value.mascot.level) || Number(value.mascot.level) < 1
      || !Number.isFinite(value.mascot.currentXp) || Number(value.mascot.currentXp) < 0
      || !Number.isFinite(value.mascot.xpToNextLevel) || Number(value.mascot.xpToNextLevel) <= 0) {
      throw new Error('Dữ liệu thú cưng trong file sao lưu không hợp lệ.');
    }
    mascot = { ...defaultMascot, ...value.mascot } as MascotState;
  }

  const customLessons = value.customLessons ?? [];
  if (!Array.isArray(customLessons) || customLessons.length > 500
    || !customLessons.every((lesson) => isValidLessonImport(lesson) && typeof lesson.id === 'string' && lesson.id.trim())) {
    throw new Error('Danh sách bài học tự tạo trong file sao lưu không hợp lệ.');
  }

  return {
    version: '1.0.0',
    exportedAt: typeof value.exportedAt === 'string' ? value.exportedAt : new Date().toISOString(),
    profile: { ...defaultProfile, ...profile } as unknown as UserProfile,
    progress: value.progress as UserProgressMap,
    mascot,
    customLessons: customLessons as Lesson[]
  };
}

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

class FirebaseSyncService {
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private currentStatus: SyncStatus = 'idle';
  private listeners: ((status: SyncStatus) => void)[] = [];
  private currentUid: string | null = null;
  private authUnavailable = false;
  private authInitPromise: Promise<string | null> | null = null;
  private googleUserEmail: string | null = null;
  private googleUserName: string | null = null;
  private googleListeners: ((info: { email: string | null; name: string | null } | null) => void)[] = [];
  private queuedSync: {
    profile: UserProfile;
    progress: UserProgressMap;
    mascot: MascotState;
    customLessons?: Lesson[];
  } | null = null;
  private syncTimer: number | null = null;
  private isSyncing = false;

  private withTimeout<T>(operation: Promise<T>, timeoutMs = 10000): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error('Firebase request timed out'));
      }, timeoutMs);

      operation.then(
        (value) => {
          window.clearTimeout(timer);
          resolve(value);
        },
        (error) => {
          window.clearTimeout(timer);
          reject(error);
        }
      );
    });
  }

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.setStatus('syncing');
        this.autoSyncFromLocalStorage();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.setStatus('offline');
      });
    }
    // Kiểm tra trạng thái đăng nhập Google lưu trong localStorage
    const savedEmail = localStorage.getItem('parent_google_email');
    const savedName = localStorage.getItem('parent_google_name');
    const savedUid = localStorage.getItem('parent_google_uid');
    if (savedEmail && savedUid) {
      this.googleUserEmail = savedEmail;
      this.googleUserName = savedName;
      this.currentUid = savedUid;
    }
  }

  // ==== Google Auth listeners ====
  public subscribeGoogleUser(listener: (info: { email: string | null; name: string | null } | null) => void): () => void {
    this.googleListeners.push(listener);
    // Gọi ngay với trạng thái hiện tại
    listener(this.googleUserEmail ? { email: this.googleUserEmail, name: this.googleUserName } : null);
    return () => { this.googleListeners = this.googleListeners.filter(l => l !== listener); };
  }

  private notifyGoogleListeners() {
    const info = this.googleUserEmail ? { email: this.googleUserEmail, name: this.googleUserName } : null;
    this.googleListeners.forEach(l => l(info));
  }

  public getGoogleUser(): { email: string | null; name: string | null } | null {
    if (!this.googleUserEmail) return null;
    return { email: this.googleUserEmail, name: this.googleUserName };
  }

  // Đăng nhập Google cho phụ huynh → sync đa thiết bị
  public async parentSignInWithGoogle(): Promise<{ uid: string; email: string; name: string } | null> {
    try {
      const user = await signInWithGoogle();
      this.currentUid = user.uid;
      this.googleUserEmail = user.email;
      this.googleUserName = user.displayName;
      // Reset authInitPromise để các lần gọi initAuth() tiếp theo dùng đúng Google UID
      this.authInitPromise = null;
      // Lưu vào localStorage để restore khi reload
      localStorage.setItem('parent_google_uid', user.uid);
      localStorage.setItem('parent_google_email', user.email || '');
      localStorage.setItem('parent_google_name', user.displayName || '');
      this.notifyGoogleListeners();
      return { uid: user.uid, email: user.email || '', name: user.displayName || '' };
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      throw err;
    }
  }

  // Đăng xuất khỏi Google
  public async parentSignOut(): Promise<void> {
    try {
      await signOutGoogle();
    } catch (_) {}
    this.currentUid = null;
    this.googleUserEmail = null;
    this.googleUserName = null;
    localStorage.removeItem('parent_google_uid');
    localStorage.removeItem('parent_google_email');
    localStorage.removeItem('parent_google_name');
    this.notifyGoogleListeners();
    this.setStatus('idle');
  }


  public subscribeStatus(listener: (status: SyncStatus) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentStatus);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private setStatus(status: SyncStatus) {
    this.currentStatus = status;
    this.listeners.forEach(l => l(status));
  }

  public getStatus(): SyncStatus {
    return this.currentStatus;
  }

  public getNetworkStatus(): boolean {
    return this.isOnline;
  }

  public getCurrentUid(): string | null {
    return this.currentUid;
  }

  private normalizeCloudKidData(childId: string, value: unknown): CloudKidData | null {
    if (!isRecord(value) || !isRecord(value.profile) || value.profile.userId !== childId) {
      return null;
    }

    const profileFields = Object.fromEntries(
      Object.entries(value.profile).filter(([key]) => key !== 'parentPin')
    );
    const customLessons = Array.isArray(value.customLessons)
      ? value.customLessons.filter(isValidLessonImport) as Lesson[]
      : [];

    return {
      profile: { ...defaultProfile, ...profileFields, userId: childId } as UserProfile,
      progress: isRecord(value.progress) ? value.progress as UserProgressMap : {},
      mascot: isRecord(value.mascot)
        ? { ...defaultMascot, ...value.mascot } as MascotState
        : { ...defaultMascot },
      customLessons
    };
  }

  private async readChildData(uid: string, childId: string): Promise<CloudKidData | null> {
    if (!childId.trim() || childId.length > 500) return null;

    const childRef = doc(db, 'users', uid, 'children', childDocumentId(childId));
    const childSnapshot = await this.withTimeout(getDoc(childRef));
    if (childSnapshot.exists()) {
      return this.normalizeCloudKidData(childId, childSnapshot.data());
    }

    // Migrate the former single-child document only when its profile ID matches.
    const familyRef = doc(db, 'users', uid);
    const familySnapshot = await this.withTimeout(getDoc(familyRef));
    if (!familySnapshot.exists()) return null;

    const legacyData = familySnapshot.data();
    const migrated = this.normalizeCloudKidData(childId, legacyData);
    if (!migrated) return null;

    const cloudProfile = Object.fromEntries(
      Object.entries(migrated.profile).filter(([key]) => key !== 'parentPin')
    );
    await this.withTimeout(setDoc(childRef, {
      ...legacyData,
      profile: cloudProfile,
      migratedFromSingleProfile: true
    }));
    return migrated;
  }

  public scheduleSync(
    profile: UserProfile,
    progress: UserProgressMap,
    mascot: MascotState,
    customLessons?: Lesson[]
  ): void {
    this.queuedSync = {
      profile,
      progress,
      mascot,
      customLessons: customLessons || []
    };

    if (this.syncTimer !== null) {
      return;
    }

    this.syncTimer = window.setTimeout(() => {
      this.syncTimer = null;
      void this.flushQueuedSync();
    }, 300);
  }

  private async flushQueuedSync(): Promise<boolean> {
    if (!this.queuedSync || this.isSyncing) {
      return false;
    }

    const payload = this.queuedSync;
    this.queuedSync = null;
    this.isSyncing = true;

    try {
      const ok = await this.syncToCloud(
        payload.profile,
        payload.progress,
        payload.mascot,
        payload.customLessons
      );
      if (!ok && this.queuedSync) {
        void this.flushQueuedSync();
      }
      return ok;
    } finally {
      this.isSyncing = false;
    }
  }

  // Khởi tạo và liên kết ẩn danh
  public async initAuth(): Promise<string | null> {
    if (this.authUnavailable) {
      this.setStatus('offline');
      return null;
    }

    if (this.authInitPromise) return this.authInitPromise;

    const authInitPromise = this.performAuthInit();
    this.authInitPromise = authInitPromise;
    void authInitPromise.then(
      () => {
        if (this.authInitPromise === authInitPromise) this.authInitPromise = null;
      },
      () => {
        if (this.authInitPromise === authInitPromise) this.authInitPromise = null;
      }
    );
    return authInitPromise;
  }

  private async performAuthInit(): Promise<string | null> {
    // Nếu đã đăng nhập Google thì giữ nguyên Google UID, không tạo anonymous mới
    if (this.currentUid && this.googleUserEmail) {
      return this.currentUid;
    }
    try {
      const user = await ensureAnonymousAuth();
      // Chỉ gán UID ẩn danh khi chưa có Google UID
      if (!this.googleUserEmail) {
        this.currentUid = user.uid;
      }
      return this.currentUid || user.uid;
    } catch (err) {
      const errorCode = (err as { code?: string })?.code;
      if (errorCode === 'auth/admin-restricted-operation' || errorCode === 'auth/operation-not-allowed') {
        this.authUnavailable = true;
        this.setStatus('offline');
        console.info('Firebase Anonymous Auth chưa được bật; ứng dụng tiếp tục ở chế độ cục bộ.');
      } else {
        console.warn('Lỗi xác thực ẩn danh Firebase:', err);
      }
      return null;
    }
  }

// Đồng bộ dữ liệu riêng của từng bé lên Firestore (users/{parentUid}/children/{childId})
  public async syncToCloud(
    profile: UserProfile,
    progress: UserProgressMap,
    mascot: MascotState,
    customLessons?: Lesson[]
  ): Promise<boolean> {
    if (!this.isOnline) {
      this.setStatus('offline');
      return false;
    }

    try {
      this.setStatus('syncing');
      const uid = await this.initAuth();
      if (!uid) {
        this.setStatus('error');
        return false;
      }

      if (!profile.userId.trim() || profile.userId.length > 500) {
        throw new Error('Mã hồ sơ bé không hợp lệ để đồng bộ.');
      }
      const userDocRef = doc(db, 'users', uid, 'children', childDocumentId(profile.userId));
      // PIN chỉ dùng trên thiết bị của gia đình; không đồng bộ lên cloud.
      const cloudProfile = Object.fromEntries(
        Object.entries(profile).filter(([key]) => key !== 'parentPin')
      );
      await this.withTimeout(setDoc(userDocRef, {
        profile: cloudProfile,
        progress,
        mascot,
        customLessons: customLessons || [],
        updatedAt: serverTimestamp(),
        deviceInfo: {
          platform: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          lastSyncTime: new Date().toISOString()
        }
      }));

      this.setStatus('synced');
      return true;
    } catch (err) {
      console.error('Lỗi khi lưu dữ liệu lên Firebase Firestore:', err);
      this.setStatus('error');
      return false;
    }
  }

  // Tải dữ liệu từ Firestore và merge với LocalStorage
  public async loadFromCloud(): Promise<{
    profile?: UserProfile;
    progress?: UserProgressMap;
    mascot?: MascotState;
    customLessons?: Lesson[];
  } | null> {
    if (!this.isOnline) {
      this.setStatus('offline');
      return null;
    }

    try {
      this.setStatus('syncing');
      const uid = await this.initAuth();
      if (!uid) {
        this.setStatus('idle');
        return null;
      }

      const cloudData = await this.readChildData(uid, storageService.getUserProfile().userId);

      if (cloudData) {
        this.setStatus('synced');
        return cloudData;
      }
      this.setStatus('idle');
      return null;
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu từ Firestore:', err);
      this.setStatus('error');
      return null;
    }
  }

  // Tải đúng hồ sơ bé trong tài khoản phụ huynh, không đọc nhầm hồ sơ anh/chị/em.
  public async loadFromCloudForGoogle(googleUid: string, childId: string): Promise<CloudKidData | null> {
    if (!this.isOnline || !googleUid) {
      this.setStatus('offline');
      return null;
    }

    try {
      this.setStatus('syncing');
      const cloudData = await this.readChildData(googleUid, childId);
      if (cloudData) {
        this.setStatus('synced');
        return cloudData;
      }
      this.setStatus('idle');
      return null;
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu Google từ Firestore:', err);
      this.setStatus('error');
      return null;
    }
  }

  public async loadChildFromCurrentAccount(childId: string): Promise<CloudKidData | null> {
    if (!this.isOnline) {
      this.setStatus('offline');
      return null;
    }
    try {
      const uid = await this.initAuth();
      return uid ? await this.readChildData(uid, childId) : null;
    } catch (err) {
      console.warn('Không thể tải hồ sơ bé từ đám mây:', err);
      this.setStatus('error');
      return null;
    }
  }

  public async loadChildProfilesForGoogle(googleUid: string): Promise<UserProfile[]> {
    if (!this.isOnline || !googleUid) return [];
    try {
      // Chuyển tài liệu cũ sang hồ sơ riêng trước khi liệt kê các bé trong gia đình.
      const familySnapshot = await this.withTimeout(getDoc(doc(db, 'users', googleUid)));
      if (familySnapshot.exists()) {
        const legacyProfile = familySnapshot.data().profile;
        if (isRecord(legacyProfile) && typeof legacyProfile.userId === 'string') {
          await this.readChildData(googleUid, legacyProfile.userId);
        }
      }

      const childrenSnapshot = await this.withTimeout(getDocs(collection(db, 'users', googleUid, 'children')));
      return childrenSnapshot.docs
        .map((childSnapshot) => this.normalizeCloudKidData(
          String(childSnapshot.data().profile?.userId || ''),
          childSnapshot.data()
        )?.profile)
        .filter((profile): profile is UserProfile => Boolean(profile));
    } catch (err) {
      console.warn('Không thể tải danh sách hồ sơ từ đám mây:', err);
      this.setStatus('error');
      return [];
    }
  }

  // Tự động đồng bộ từ LocalStorage lên Cloud
  public async autoSyncFromLocalStorage(): Promise<boolean> {
    const profile = storageService.getUserProfile();
    const progress = storageService.getProgress();
    const mascot = storageService.getMascot();
    const customLessons = storageService.getCustomLessons();
    return this.syncToCloud(profile, progress, mascot, customLessons);
  }

  // Tạo mã ngắn dễ nhớ cho học sinh (Ví dụ: DE-8291)
  private generateShortCode(): string {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `DE-${randomDigits}`;
  }

  // Chia sẻ bài học giáo viên soạn lên kho đề chung (public_lessons/{lessonId}) kèm mã ngắn
  public async publishLessonWithShortCode(
    lesson: Lesson,
    teacherName: string = 'Thầy Cô'
  ): Promise<{ success: boolean; shortCode: string; lessonId: string }> {
    try {
      const uid = this.currentUid || (await this.initAuth());
      const shortCode = this.generateShortCode();
      const lessonRef = doc(db, 'public_lessons', lesson.id);

      await setDoc(lessonRef, {
        ...lesson,
        shortCode,
        createdByUid: uid || 'anonymous',
        createdByName: teacherName,
        isPublished: true,
        createdAt: serverTimestamp()
      }, { merge: true });

      return { success: true, shortCode, lessonId: lesson.id };
    } catch (err) {
      console.error('Lỗi xuất bản bài học lên đám mây:', err);
      return { success: false, shortCode: '', lessonId: lesson.id };
    }
  }

  // Alias cho publishLessonToCloud
  public async publishLessonToCloud(lesson: Lesson, teacherName: string = 'Giáo viên'): Promise<{ success: boolean; lessonId: string }> {
    const res = await this.publishLessonWithShortCode(lesson, teacherName);
    return { success: res.success, lessonId: res.lessonId };
  }

  // Tìm và tải bài học từ Firebase qua Mã Bài Học (Short Code hoặc Lesson ID)
  public async fetchLessonByCode(code: string): Promise<Lesson | null> {
    if (!this.isOnline || !code) return null;
    const cleanCode = code.trim().toUpperCase();

    try {
      // 1. Thử tìm theo Document ID chính xác
      const directDocRef = doc(db, 'public_lessons', code.trim());
      const directSnap = await getDoc(directDocRef);
      if (directSnap.exists()) {
        return directSnap.data() as Lesson;
      }

      // 2. Thử tìm theo field shortCode (Ví dụ DE-1234)
      const lessonsCol = collection(db, 'public_lessons');
      const q = query(lessonsCol, where('shortCode', '==', cleanCode), limit(1));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const foundDoc = querySnap.docs[0];
        return foundDoc.data() as Lesson;
      }

      return null;
    } catch (err) {
      console.error('Lỗi tìm bài học bằng mã:', err);
      return null;
    }
  }

  // Tải danh sách bài học giáo viên cộng đồng chia sẻ từ Firestore
  public async fetchPublicLessonsFromCloud(): Promise<Lesson[]> {
    if (!this.isOnline) return [];
    try {
      const lessonsCol = collection(db, 'public_lessons');
      const q = query(lessonsCol, limit(50));
      const snapshot = await getDocs(q);
      const list: Lesson[] = [];

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data && data.id && data.title && data.questions) {
          list.push(data as Lesson);
        }
      });
      return list;
    } catch (err) {
      console.warn('Không thể tải bài học chia sẻ từ Firestore:', err);
      return [];
    }
  }

  // Cập nhật thành tích bé lên Bảng Xếp Hạng Firestore (/leaderboard/{userId})
  public async updateLeaderboard(profile: UserProfile, mascot: MascotState): Promise<void> {
    if (!this.isOnline) return;
    try {
      const entryRef = doc(db, 'leaderboard', profile.userId);
      await setDoc(entryRef, {
        userId: profile.userId,
        displayName: profile.displayName,
        avatarId: profile.avatarId,
        currentGrade: profile.currentGrade,
        stars: profile.stars,
        gems: profile.gems,
        currentStreak: profile.currentStreak,
        mascotLevel: mascot.level,
        unlockedBadgeCount: (profile.unlockedBadges || []).length,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn('Cập nhật bảng xếp hạng:', e);
    }
  }

  // Tải danh sách Bảng Xếp Hạng từ Firestore kèm bạn học mô phỏng nếu chưa có đủ
  public async fetchLeaderboard(currentProfile: UserProfile, gradeFilter?: Grade): Promise<LeaderboardEntry[]> {
    const list: LeaderboardEntry[] = [];

    // Luôn đưa bé hiện tại vào bảng
    const currentEntry: LeaderboardEntry = {
      userId: currentProfile.userId,
      displayName: currentProfile.displayName,
      avatarId: currentProfile.avatarId,
      currentGrade: currentProfile.currentGrade,
      stars: currentProfile.stars,
      gems: currentProfile.gems,
      currentStreak: currentProfile.currentStreak,
      mascotLevel: 2,
      unlockedBadgeCount: (currentProfile.unlockedBadges || []).length,
      isCurrentKid: true
    };

    if (this.isOnline) {
      try {
        const lbCol = collection(db, 'leaderboard');
        let q;
        if (gradeFilter) {
          q = query(lbCol, where('currentGrade', '==', gradeFilter), limit(30));
        } else {
          q = query(lbCol, orderBy('stars', 'desc'), limit(30));
        }
        const snap = await getDocs(q);
        snap.forEach(docSnap => {
          const data = docSnap.data();
          if (data.userId !== currentProfile.userId) {
            list.push({
              userId: data.userId || docSnap.id,
              displayName: data.displayName || 'Bạn nhỏ bí ẩn',
              avatarId: data.avatarId || 'owl_avatar',
              currentGrade: data.currentGrade || 1,
              stars: data.stars || 0,
              gems: data.gems || 0,
              currentStreak: data.currentStreak || 1,
              mascotLevel: data.mascotLevel || 1,
              unlockedBadgeCount: data.unlockedBadgeCount || 0,
              isCurrentKid: false
            });
          }
        });
      } catch (err) {
        console.warn('Lỗi tải Bảng xếp hạng từ Firestore:', err);
      }
    }

    // Nếu danh sách cloud chưa có nhiều người, bổ sung các bạn nhỏ thi đua vui tươi
    const simulatedFriends: LeaderboardEntry[] = [
      { userId: 'sim_1', displayName: 'Bé Sóc Nhanh Nhẹn', avatarId: 'fox_avatar', currentGrade: (gradeFilter || 1) as Grade, stars: 110, gems: 25, currentStreak: 7, mascotLevel: 4, unlockedBadgeCount: 6 },
      { userId: 'sim_2', displayName: 'Bé Thỏ Thông Thái', avatarId: 'rabbit_avatar', currentGrade: (gradeFilter || 1) as Grade, stars: 85, gems: 18, currentStreak: 5, mascotLevel: 3, unlockedBadgeCount: 4 },
      { userId: 'sim_3', displayName: 'Bé Gấu Chăm Chỉ', avatarId: 'panda_avatar', currentGrade: (gradeFilter || 2) as Grade, stars: 65, gems: 12, currentStreak: 4, mascotLevel: 2, unlockedBadgeCount: 3 },
      { userId: 'sim_4', displayName: 'Bé Sư Tử Dũng Cảm', avatarId: 'lion_avatar', currentGrade: (gradeFilter || 3) as Grade, stars: 45, gems: 8, currentStreak: 3, mascotLevel: 2, unlockedBadgeCount: 2 }
    ];

    simulatedFriends.forEach(sf => {
      if (!list.some(it => it.displayName === sf.displayName)) {
        if (!gradeFilter || sf.currentGrade === gradeFilter) {
          list.push(sf);
        }
      }
    });

    if (!gradeFilter || currentEntry.currentGrade === gradeFilter) {
      list.push(currentEntry);
    }

    // Sắp xếp theo số sao giảm dần
    list.sort((a, b) => b.stars - a.stars);
    return list;
  }

  // Xuất gói dữ liệu sao lưu thành file JSON tải về máy
  public exportBackupFile(profile: UserProfile, progress: UserProgressMap, mascot: MascotState, customLessons?: Lesson[]): void {
    const backup: BackupDataPackage = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      progress,
      mascot,
      customLessons: customLessons || []
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    const safeName = profile.displayName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];

    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tieu_hoc_backup_${safeName}_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Nhập dữ liệu từ file JSON sao lưu
  public importBackupFile(file: File): Promise<BackupDataPackage> {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File sao lưu vượt quá giới hạn 5 MB.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = parseBackupData(JSON.parse(content) as unknown);

          // Lưu trực tiếp vào storageService
          storageService.saveUserProfile(parsed.profile);
          storageService.saveProgress(parsed.progress);
          storageService.saveMascot(parsed.mascot);
          if (parsed.customLessons && Array.isArray(parsed.customLessons)) {
            parsed.customLessons.forEach(l => storageService.saveCustomLesson(l));
          }

          // Đồng bộ luôn lên Cloud
          this.syncToCloud(parsed.profile, parsed.progress, parsed.mascot, parsed.customLessons);

          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Không thể đọc file'));
      reader.readAsText(file);
    });
  }
}

export const firebaseSyncService = new FirebaseSyncService();
