import { UserProfile, UserProgressMap, MascotState } from '../types/user';
import { Grade, Lesson, DifficultyLevel } from '../types/curriculum';
import { DailyQuest, DailyQuestState } from '../types/gamification';

const USER_PROFILE_KEY = 'tieu_hoc_user_profile_v1';
const PROGRESS_KEY = 'tieu_hoc_progress_v1';
const MASCOT_KEY = 'tieu_hoc_mascot_v1';
const CUSTOM_LESSONS_KEY = 'tieu_hoc_custom_lessons_v1';
const createParentPin = () => String(Math.floor(1000 + Math.random() * 9000));
const createLocalProfileId = () => `kid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

interface DailyChallengeCompletion {
  date: string;
  lessonId: string;
}

export const defaultProfile: UserProfile = {
  userId: 'student_local_default',
  displayName: 'Bé Bắp Lém Lỉnh',
  avatarId: 'owl_avatar',
  currentGrade: 1,
  stars: 0,
  gems: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastActiveDate: '',
  streakFrozen: false,
  streakFreezeCount: 0,
  unlockedBadges: [],
  parentPin: createParentPin(),
  dailyTimeLimitMinutes: 30,
  screenTimeTodayMinutes: 0,
  screenTimeDate: new Date().toISOString().split('T')[0],
  eyeCareMode: false
};

export const defaultMascot: MascotState = {
  petId: 'owl',
  name: 'Cú Bibo',
  level: 1,
  currentXp: 0,
  xpToNextLevel: 100,
  hungerPercent: 100,
  lastFedAt: new Date().toISOString()
};

export const defaultProgress: UserProgressMap = {};

class StorageService {
  private readJson<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed === null ? fallback : parsed;
    } catch {
      return fallback;
    }
  }

  private migrateLegacyProfileData(userId: string): void {
    const scopedProgressKey = `tieu_hoc_progress_v1_${userId}`;
    const scopedMascotKey = `tieu_hoc_mascot_v1_${userId}`;
    const profiles = this.readJson<UserProfile[] | null>('tieu_hoc_profiles_list_v1', null);

    if (profiles && profiles.length > 1) return;

    if (!localStorage.getItem(scopedProgressKey) && localStorage.getItem(PROGRESS_KEY)) {
      localStorage.setItem(scopedProgressKey, localStorage.getItem(PROGRESS_KEY)!);
    }

    if (!localStorage.getItem(scopedMascotKey) && localStorage.getItem(MASCOT_KEY)) {
      localStorage.setItem(scopedMascotKey, localStorage.getItem(MASCOT_KEY)!);
    }
  }

  public getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(USER_PROFILE_KEY);
      if (data) {
        const profile = { ...defaultProfile, ...JSON.parse(data) } as UserProfile;
        const today = new Date().toISOString().split('T')[0];
        if (profile.screenTimeDate !== today) {
          profile.screenTimeTodayMinutes = 0;
          profile.screenTimeDate = today;
          localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
        }
        return profile;
      }
    } catch {
      // Fallback
    }
    const profile = { ...defaultProfile, userId: createLocalProfileId() };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    return profile;
  }

  public saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      // Cập nhật đồng bộ trong danh sách tất cả các bé
      const all = this.getAllProfiles();
      const idx = all.findIndex(p => p.userId === profile.userId);
      if (idx >= 0) {
        all[idx] = profile;
      } else {
        all.push(profile);
      }
      this.saveAllProfiles(all);
    } catch {
      // Storage full
    }
  }

  public getAllProfiles(): UserProfile[] {
    try {
      const data = localStorage.getItem('tieu_hoc_profiles_list_v1');
      if (data) {
        const list: UserProfile[] = JSON.parse(data);
        if (list && list.length > 0) return list;
      }
    } catch {}
    const current = this.getUserProfile();
    return [current];
  }

  public saveAllProfiles(profiles: UserProfile[]): void {
    try {
      localStorage.setItem('tieu_hoc_profiles_list_v1', JSON.stringify(profiles));
    } catch {}
  }

  public createKidProfile(displayName: string, grade: Grade, avatarId: string): UserProfile {
    const normalizedName = displayName.trim();
    if (!normalizedName) {
      throw new Error('Tên bé không được để trống');
    }

    const duplicate = this.getAllProfiles().some(
      (profile) => profile.displayName.trim().toLowerCase() === normalizedName.toLowerCase()
    );

    if (duplicate) {
      throw new Error('Tên bé đã tồn tại');
    }

    const newKid: UserProfile = {
      ...defaultProfile,
      userId: 'kid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      displayName: normalizedName,
      currentGrade: grade,
      avatarId: avatarId || 'owl_avatar',
      parentPin: createParentPin(),
      stars: 0,
      gems: 0,
      currentStreak: 0,
      maxStreak: 0,
      lastActiveDate: '',
      unlockedBadges: []
    };

    const profiles = this.getAllProfiles();
    const updated = [...profiles, newKid];
    this.saveAllProfiles(updated);

    // Chuyển sang profile mới
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newKid));
    const newProgress: UserProgressMap = {};
    const newMascot: MascotState = {
      ...defaultMascot,
      petId: 'owl',
      name: `Cú của ${newKid.displayName}`,
      level: 1,
      currentXp: 0
    };
    this.saveProgress(newProgress);
    this.saveMascot(newMascot);

    return newKid;
  }

  public switchKidProfile(profileId: string): { profile: UserProfile; progress: UserProgressMap; mascot: MascotState } | null {
    const profiles = this.getAllProfiles();
    const target = profiles.find(p => p.userId === profileId);
    if (!target) return null;

    // Lưu cache của bé hiện tại trước khi đổi
    const current = this.getUserProfile();
    const currentProg = this.getProgress();
    const currentMascot = this.getMascot();

    try {
      localStorage.setItem(`tieu_hoc_prog_${current.userId}`, JSON.stringify(currentProg));
      localStorage.setItem(`tieu_hoc_mascot_${current.userId}`, JSON.stringify(currentMascot));
      localStorage.setItem(`tieu_hoc_progress_v1_${current.userId}`, JSON.stringify(currentProg));
      localStorage.setItem(`tieu_hoc_mascot_v1_${current.userId}`, JSON.stringify(currentMascot));
    } catch {}

    // Nạp dữ liệu của bé mới
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(target));

    let nextProg: UserProgressMap = {};
    let nextMascot: MascotState = {
      ...defaultMascot,
      name: `Cú của ${target.displayName}`,
      level: 1
    };

    try {
      const savedProg = localStorage.getItem(`tieu_hoc_progress_v1_${target.userId}`)
        || localStorage.getItem(`tieu_hoc_prog_${target.userId}`);
      if (savedProg) nextProg = JSON.parse(savedProg);
      const savedMascot = localStorage.getItem(`tieu_hoc_mascot_v1_${target.userId}`)
        || localStorage.getItem(`tieu_hoc_mascot_${target.userId}`);
      if (savedMascot) nextMascot = JSON.parse(savedMascot);
    } catch {}

    this.saveProgress(nextProg);
    this.saveMascot(nextMascot);

    return { profile: this.getUserProfile(), progress: nextProg, mascot: nextMascot };
  }

  public getProgress(): UserProgressMap {
    const currentUserId = this.getUserProfile().userId;
    const profileKey = `tieu_hoc_progress_v1_${currentUserId}`;
    this.migrateLegacyProfileData(currentUserId);

    const stored = this.readJson<UserProgressMap | null>(profileKey, null);
    if (stored) {
      return stored;
    }

    const legacyData = this.readJson<UserProgressMap | null>(PROGRESS_KEY, null);
    if (legacyData) {
      localStorage.setItem(profileKey, JSON.stringify(legacyData));
      return legacyData;
    }

    return { ...defaultProgress };
  }

  public saveProgress(progress: UserProgressMap): void {
    const currentUserId = this.getUserProfile().userId;
    const profileKey = `tieu_hoc_progress_v1_${currentUserId}`;
    try {
      localStorage.setItem(profileKey, JSON.stringify(progress));
    } catch {
      // Storage full
    }
  }

  public getMascot(): MascotState {
    const currentUserId = this.getUserProfile().userId;
    const profileKey = `tieu_hoc_mascot_v1_${currentUserId}`;
    this.migrateLegacyProfileData(currentUserId);

    const stored = this.readJson<MascotState | null>(profileKey, null);
    if (stored) {
      return { ...defaultMascot, ...stored };
    }

    const legacyData = this.readJson<MascotState | null>(MASCOT_KEY, null);
    if (legacyData) {
      localStorage.setItem(profileKey, JSON.stringify(legacyData));
      return { ...defaultMascot, ...legacyData };
    }

    return { ...defaultMascot };
  }

  public saveMascot(mascot: MascotState): void {
    const currentUserId = this.getUserProfile().userId;
    const profileKey = `tieu_hoc_mascot_v1_${currentUserId}`;
    try {
      localStorage.setItem(profileKey, JSON.stringify(mascot));
    } catch {
      // Storage full
    }
  }

  public getDailyChallengeCompletion(): DailyChallengeCompletion | null {
    const userId = this.getUserProfile().userId;
    return this.readJson<DailyChallengeCompletion | null>(
      `tieu_hoc_daily_challenge_v1_${userId}`,
      null
    );
  }

  public markDailyChallengeCompleted(lessonId: string): void {
    const userId = this.getUserProfile().userId;
    const date = new Date().toISOString().split('T')[0];
    localStorage.setItem(
      `tieu_hoc_daily_challenge_v1_${userId}`,
      JSON.stringify({ date, lessonId })
    );
  }

  public getDailyQuests(): DailyQuest[] {
    const userId = this.getUserProfile().userId;
    const today = new Date().toISOString().split('T')[0];
    const key = `tieu_hoc_daily_quests_v1_${userId}`;
    const stored = this.readJson<DailyQuestState | null>(key, null);
    if (stored && stored.date === today && Array.isArray(stored.quests) && stored.quests.length > 0) {
      return stored.quests;
    }
    const newQuests: DailyQuest[] = [
      {
        id: 'quest_lessons',
        title: 'Học Giả Chăm Chỉ',
        description: 'Hoàn thành 2 bài học bất kỳ trong ngày',
        icon: '📚',
        target: 2,
        current: 0,
        rewardStars: 10,
        completed: false,
        claimed: false
      },
      {
        id: 'quest_perfect',
        title: 'Điểm 10 Xuất Sắc',
        description: 'Đạt điểm tối đa 100/100 ở một bài học',
        icon: '💯',
        target: 1,
        current: 0,
        rewardStars: 5,
        rewardGems: 1,
        completed: false,
        claimed: false
      },
      {
        id: 'quest_challenge',
        title: 'Chinh Phục Thử Thách',
        description: 'Vượt qua bài học có độ khó Trung Bình trở lên',
        icon: '🔥',
        target: 1,
        current: 0,
        rewardStars: 15,
        completed: false,
        claimed: false
      }
    ];
    localStorage.setItem(key, JSON.stringify({ date: today, quests: newQuests }));
    return newQuests;
  }

  public saveDailyQuests(quests: DailyQuest[]): void {
    const userId = this.getUserProfile().userId;
    const today = new Date().toISOString().split('T')[0];
    const key = `tieu_hoc_daily_quests_v1_${userId}`;
    localStorage.setItem(key, JSON.stringify({ date: today, quests }));
  }

  public updateDailyQuestProgress(type: 'lesson_completed' | 'perfect_score' | 'hard_lesson', amount: number = 1): DailyQuest[] {
    const quests = this.getDailyQuests();
    let changed = false;
    const questIdMap: Record<string, string> = {
      lesson_completed: 'quest_lessons',
      perfect_score: 'quest_perfect',
      hard_lesson: 'quest_challenge'
    };
    const targetQuestId = questIdMap[type];
    const updated = quests.map(q => {
      if (q.id === targetQuestId && !q.completed) {
        const nextVal = Math.min(q.target, q.current + amount);
        if (nextVal !== q.current) {
          changed = true;
          return {
            ...q,
            current: nextVal,
            completed: nextVal >= q.target
          };
        }
      }
      return q;
    });
    if (changed) {
      this.saveDailyQuests(updated);
    }
    return updated;
  }

  public claimDailyQuestReward(questId: string): { success: boolean; stars: number; gems: number; quests: DailyQuest[]; profile: UserProfile } {
    const profile = this.getUserProfile();
    const quests = this.getDailyQuests();
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) {
      return { success: false, stars: 0, gems: 0, quests, profile };
    }
    quest.claimed = true;
    profile.stars += quest.rewardStars || 0;
    profile.gems += quest.rewardGems || 0;
    this.saveDailyQuests(quests);
    this.saveProfile(profile);
    return {
      success: true,
      stars: quest.rewardStars || 0,
      gems: quest.rewardGems || 0,
      quests,
      profile
    };
  }

  public recordLessonCompletion(
    lessonId: string,
    score: number,
    starsEarned: number,
    _grade?: Grade,
    wrongQuestionIds?: string[],
    masteredQuestionIds?: string[],
    rewardMultiplier: number = 1,
    difficulty: DifficultyLevel = 1,
    customXpReward?: number
  ): {
    updatedProfile: UserProfile;
    updatedProgress: UserProgressMap;
    updatedMascot: MascotState;
    earnedStars: number;
  } {
    const profile = this.getUserProfile();
    const progress = this.getProgress();
    const mascot = this.getMascot();

    // 1. Cập nhật tiến trình bài học và bộ nhớ câu sai/đúng
    const existing = progress[lessonId];
    const prevStars = existing ? existing.stars : 0;
    const isFirstCompletion = !existing || existing.stars === 0;
    const newStarsDiff = Math.max(0, starsEarned - prevStars);

    // Tính toán câu sai còn tồn đọng: nếu câu từng sai nay đã làm đúng thì gỡ khỏi danh sách sai
    const prevWrong = new Set(existing?.wrongQuestionIds || []);
    const prevMastered = new Set(existing?.masteredQuestionIds || []);

    if (masteredQuestionIds) {
      masteredQuestionIds.forEach(id => {
        prevMastered.add(id);
        prevWrong.delete(id); // Đã làm đúng thành công -> xóa khỏi danh sách sai
      });
    }

    if (wrongQuestionIds) {
      wrongQuestionIds.forEach(id => {
        if (!masteredQuestionIds?.includes(id)) {
          prevWrong.add(id);
        }
      });
    }

    const completedAt = existing && score < existing.score
      ? existing.completedAt
      : new Date().toISOString();

    progress[lessonId] = {
      score: Math.max(existing?.score || 0, score),
      stars: Math.max(prevStars, starsEarned),
      completedAt,
      attempts: (existing?.attempts || 0) + 1,
      wrongQuestionIds: Array.from(prevWrong),
      masteredQuestionIds: Array.from(prevMastered)
    };

    // 2. Thưởng sao và kinh nghiệm (Chặn farm sao vô hạn)
    let earnedStars = 0;
    if (isFirstCompletion && starsEarned > 0) {
      const difficultyBonus = difficulty >= 4 ? 3 : difficulty === 3 ? 2 : difficulty === 2 ? 1 : 0;
      earnedStars = newStarsDiff * 5 * rewardMultiplier + 2 + difficultyBonus;
    } else if (newStarsDiff > 0) {
      earnedStars = newStarsDiff * 5 * rewardMultiplier;
    }

    profile.stars += earnedStars; // Thưởng sao
    const wasAlreadyPerfect = existing?.score === 100;
    if (score === 100 && !wasAlreadyPerfect) {
      profile.gems += 1; // Đạt 100 điểm lần đầu thưởng 1 kim cương (chống farm)
    }

    // Chỉ nối streak khi lần học trước là đúng ngày hôm qua hoặc dùng khiên bảo vệ
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== today) {
      const todayTime = Date.parse(`${today}T00:00:00Z`);
      const lastActiveTime = Date.parse(`${profile.lastActiveDate}T00:00:00Z`);
      const daysSinceLastActive = Number.isFinite(lastActiveTime)
        ? Math.floor((todayTime - lastActiveTime) / 86400000)
        : Number.NaN;
      if (daysSinceLastActive === 1) {
        profile.currentStreak += 1;
        profile.streakFrozen = false;
      } else if (daysSinceLastActive === 2 && (profile.streakFreezeCount || 0) > 0) {
        // Kích hoạt Khiên bảo vệ chuỗi
        profile.streakFreezeCount = (profile.streakFreezeCount || 0) - 1;
        profile.currentStreak += 1;
        profile.streakFrozen = true;
      } else {
        profile.currentStreak = 1;
        profile.streakFrozen = false;
      }
      profile.maxStreak = Math.max(profile.maxStreak, profile.currentStreak);
      profile.lastActiveDate = today;
    }

    // 3. Cho thú cưng nhận XP (tính theo điểm số, thưởng theo độ khó và xpReward của bài)
    const diffXpMultiplier = difficulty === 4 ? 2 : difficulty === 3 ? 1.5 : difficulty === 2 ? 1.2 : 1;
    const baseXp = customXpReward ? Math.round(customXpReward * (score / 100)) : Math.round(score * 0.5);
    const gainedXp = Math.round(baseXp * diffXpMultiplier);
    mascot.currentXp += gainedXp;
    while (mascot.currentXp >= mascot.xpToNextLevel && mascot.xpToNextLevel > 0) {
      mascot.level += 1;
      mascot.currentXp -= mascot.xpToNextLevel;
      mascot.xpToNextLevel = Math.round(mascot.xpToNextLevel * 1.4);
    }

    // 4. Tự động kiểm tra và mở khóa 15 huy hiệu (Badges)
    const unlocked = new Set(profile.unlockedBadges || []);
    const passedLessonCount = Object.values(progress).filter(p => p.stars > 0).length;
    if (passedLessonCount >= 1) unlocked.add('first_lesson');
    if (score === 100) unlocked.add('perfect_100');
    if (profile.currentStreak >= 3) unlocked.add('streak_3');
    if (profile.currentStreak >= 7) unlocked.add('streak_7');
    if ((profile.streakFreezeCount || 0) > 0) unlocked.add('streak_shield');
    if (mascot.level >= 5) unlocked.add('mascot_scholar');

    let math3Stars = 0;
    let mathCount = 0;
    let vietnameseCount = 0;
    let englishCount = 0;
    let writingCount = 0;
    Object.entries(progress).forEach(([lid, p]) => {
      if (p.stars > 0) {
        if (lid.includes('_m_')) {
          mathCount++;
          if (p.stars === 3) math3Stars++;
        }
        if (lid.includes('_v_')) vietnameseCount++;
        if (lid.includes('_e_')) englishCount++;
        if (lid.includes('_w_') || lid.includes('writing')) writingCount++;
      }
    });

    if (math3Stars >= 3) unlocked.add('math_star_g1');
    if (vietnameseCount >= 3) unlocked.add('spelling_bee');
    if (englishCount >= 3) unlocked.add('english_explorer');
    if (mathCount > 0 && vietnameseCount > 0 && englishCount > 0) unlocked.add('tri_subject_champ');
    if (writingCount >= 1) unlocked.add('writing_artisan');

    profile.unlockedBadges = Array.from(unlocked);

    // 5. Cập nhật tiến độ nhiệm vụ hàng ngày (Daily Quests)
    if (starsEarned > 0) {
      this.updateDailyQuestProgress('lesson_completed', 1);
      if (score === 100) {
        this.updateDailyQuestProgress('perfect_score', 1);
      }
      if (difficulty >= 2) {
        this.updateDailyQuestProgress('hard_lesson', 1);
      }
    }

    // Lưu lại bộ nhớ cục bộ
    this.saveProfile(profile);
    this.saveProgress(progress);
    this.saveMascot(mascot);

    return {
      updatedProfile: profile,
      updatedProgress: progress,
      updatedMascot: mascot,
      earnedStars
    };
  }


  public feedMascot(costInStars: number = 5): { success: boolean; mascot: MascotState; profile: UserProfile } {
    const profile = this.getUserProfile();
    const mascot = this.getMascot();

    if (profile.stars < costInStars) {
      return { success: false, mascot, profile };
    }

    profile.stars -= costInStars;
    mascot.hungerPercent = Math.min(100, mascot.hungerPercent + 25);
    mascot.currentXp += 15;
    mascot.lastFedAt = new Date().toISOString();

    while (mascot.currentXp >= mascot.xpToNextLevel && mascot.xpToNextLevel > 0) {
      mascot.level += 1;
      mascot.currentXp -= mascot.xpToNextLevel;
      mascot.xpToNextLevel = Math.round(mascot.xpToNextLevel * 1.4);

      // Thưởng huy hiệu bạn thân Bibo & Bibo học giả
      const unlocked = new Set(profile.unlockedBadges || []);
      unlocked.add('pet_friend');
      if (mascot.level >= 5) {
        unlocked.add('mascot_scholar');
      }
      profile.unlockedBadges = Array.from(unlocked);
    }

    this.saveProfile(profile);
    this.saveMascot(mascot);

    return { success: true, mascot, profile };
  }

  public buyMascotItem(itemId: string, costGems: number): { success: boolean; mascot: MascotState; profile: UserProfile } {
    const profile = this.getUserProfile();
    const mascot = this.getMascot();

    if (profile.gems < costGems) {
      return { success: false, mascot, profile };
    }

    profile.gems -= costGems;
    const unlocked = new Set(mascot.unlockedItems || []);
    unlocked.add(itemId);
    mascot.unlockedItems = Array.from(unlocked);

    this.saveProfile(profile);
    this.saveMascot(mascot);
    return { success: true, mascot, profile };
  }

  public equipMascotItem(slot: 'hat' | 'accessory', itemId: string | null): MascotState {
    const mascot = this.getMascot();
    if (slot === 'hat') {
      mascot.equippedHat = itemId || undefined;
    } else {
      mascot.equippedAccessory = itemId || undefined;
    }
    this.saveMascot(mascot);
    return mascot;
  }

  public resetAllProgress(): { profile: UserProfile; progress: UserProgressMap; mascot: MascotState } {
    const currentProfile = this.getUserProfile();
    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem(`tieu_hoc_daily_challenge_v1_${currentProfile.userId}`);
    localStorage.removeItem(`tieu_hoc_daily_quests_v1_${currentProfile.userId}`);
    const newProfile: UserProfile = {
      ...defaultProfile,
      userId: currentProfile.userId,
      displayName: currentProfile.displayName,
      avatarId: currentProfile.avatarId,
      currentGrade: currentProfile.currentGrade,
      parentPin: currentProfile.parentPin,
      dailyTimeLimitMinutes: currentProfile.dailyTimeLimitMinutes,
      eyeCareMode: currentProfile.eyeCareMode,
      stars: 0,
      gems: 0,
      currentStreak: 0,
      maxStreak: 0,
      unlockedBadges: [],
      lastActiveDate: '',
      screenTimeTodayMinutes: 0,
      screenTimeDate: today
    };
    const newProgress: UserProgressMap = {};
    const newMascot: MascotState = {
      ...defaultMascot,
      level: 1,
      currentXp: 0,
      xpToNextLevel: 100,
      hungerPercent: 60
    };

    this.saveProfile(newProfile);
    this.saveProgress(newProgress);
    this.saveMascot(newMascot);

    return { profile: newProfile, progress: newProgress, mascot: newMascot };
  }

  public getCustomLessons(): Lesson[] {
    try {
      const data = localStorage.getItem(CUSTOM_LESSONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public saveCustomLesson(lesson: Lesson): Lesson[] {
    const current = this.getCustomLessons();
    const existingIdx = current.findIndex(l => l.id === lesson.id);
    let updated: Lesson[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = lesson;
    } else {
      updated = [lesson, ...current];
    }
    try {
      localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(updated));
    } catch {
      // Storage error
    }
    return updated;
  }

  public deleteCustomLesson(lessonId: string): Lesson[] {
    const current = this.getCustomLessons();
    const updated = current.filter(l => l.id !== lessonId);
    try {
      localStorage.setItem(CUSTOM_LESSONS_KEY, JSON.stringify(updated));
    } catch {}
    return updated;
  }

  public buyStreakFreeze(costStars: number = 50): {
    success: boolean;
    profile: UserProfile;
    message: string;
  } {
    const profile = this.getUserProfile();
    const currentCount = profile.streakFreezeCount || 0;

    if (currentCount >= 2) {
      return {
        success: false,
        profile,
        message: 'Bé đã sở hữu tối đa 2 Khiên bảo vệ chuỗi rồi!'
      };
    }

    if (profile.stars < costStars) {
      return {
        success: false,
        profile,
        message: `Bé cần ${costStars} ⭐ để đổi Khiên bảo vệ chuỗi (hiện có ${profile.stars} ⭐).`
      };
    }

    profile.stars -= costStars;
    profile.streakFreezeCount = currentCount + 1;

    const unlocked = new Set(profile.unlockedBadges || []);
    unlocked.add('streak_shield');
    profile.unlockedBadges = Array.from(unlocked);

    this.saveProfile(profile);
    return {
      success: true,
      profile,
      message: 'Chúc mừng bé đã trang bị Khiên bảo vệ chuỗi thành công! 🛡️'
    };
  }

  public recordScratchpadUsed(): { profile: UserProfile; newlyUnlocked: boolean } {
    const profile = this.getUserProfile();
    const unlocked = new Set(profile.unlockedBadges || []);
    const wasUnlocked = unlocked.has('scratchpad_genius');
    unlocked.add('scratchpad_genius');
    profile.unlockedBadges = Array.from(unlocked);
    this.saveProfile(profile);
    return { profile, newlyUnlocked: !wasUnlocked };
  }

  public recordMiniGameBadge(gameType: 'speed_math' | 'memory_cards'): { profile: UserProfile; newlyUnlocked: boolean } {
    const profile = this.getUserProfile();
    const unlocked = new Set(profile.unlockedBadges || []);
    const badgeId = gameType === 'speed_math' ? 'speed_racer' : 'memory_master';
    const wasUnlocked = unlocked.has(badgeId);
    unlocked.add(badgeId);
    profile.unlockedBadges = Array.from(unlocked);
    this.saveProfile(profile);
    return { profile, newlyUnlocked: !wasUnlocked };
  }

  public getWeaknessRecommendations(
    progress: UserProgressMap,
    allLessons: Lesson[]
  ): { lesson: Lesson; wrongCount: number; score: number }[] {
    const recommendations: { lesson: Lesson; wrongCount: number; score: number }[] = [];
    allLessons.forEach((lesson) => {
      const p = progress[lesson.id];
      if (p) {
        const wrongCount = p.wrongQuestionIds?.length || 0;
        if (wrongCount > 0 || (p.score < 80 && p.score > 0)) {
          recommendations.push({
            lesson,
            wrongCount,
            score: p.score
          });
        }
      }
    });

    return recommendations.sort((a, b) => {
      if (b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount;
      return a.score - b.score;
    }).slice(0, 5);
  }

  private saveProfile(p: UserProfile) {
    this.saveUserProfile(p);
  }
}

export const storageService = new StorageService();
