import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Grade, SubjectId, Lesson } from './types/curriculum';
import { UserProfile, UserProgressMap, MascotState } from './types/user';
import { storageService } from './services/storageService';
import { audioService } from './services/audioService';
import { computeScreenTimeTick } from './services/timeUtils';
import { ALL_LESSONS } from './data/curriculumData';

import { Header } from './components/Header';
import { GradeSelector } from './components/GradeSelector';
import { SubjectSelector } from './components/SubjectSelector';
import { LessonList } from './components/LessonList';
import { LessonRunner } from './components/LessonRunner';
import { MascotWidget } from './components/MascotWidget';
import { ParentModal } from './components/ParentModal';
import { BadgesModal } from './components/BadgesModal';
import { ScreenTimeAlertModal } from './components/ScreenTimeAlertModal';
import { TeacherPortalModal } from './components/TeacherPortalModal';
import { ProfileModal } from './components/ProfileModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { QuickStats } from './components/QuickStats';
import { DailyChallenge } from './components/DailyChallenge';
import { MiniGamesModal } from './components/games/MiniGamesModal';
import { AchievementCertificate } from './components/AchievementCertificate';
import { pwaService } from './services/pwaService';
import { firebaseSyncService, SyncStatus } from './services/firebaseSyncService';
import { mergeCustomLessons, mergeMascot, mergeProfile, mergeProgress } from './services/cloudMerge';

export function App() {
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getUserProfile());
  const [progress, setProgress] = useState<UserProgressMap>(() => storageService.getProgress());
  const [mascot, setMascot] = useState<MascotState>(() => storageService.getMascot());
  const [customLessons, setCustomLessons] = useState<Lesson[]>(() => storageService.getCustomLessons());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  const [currentGrade, setCurrentGrade] = useState<Grade>(profile.currentGrade || 1);
  const [currentSubject, setCurrentSubject] = useState<SubjectId>('math');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeRewardMultiplier, setActiveRewardMultiplier] = useState(1);
  const [activeIsDailyChallenge, setActiveIsDailyChallenge] = useState(false);

  const [isMascotOpen, setIsMascotOpen] = useState(false);
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState(false);
  const [isScreenTimeAlertOpen, setIsScreenTimeAlertOpen] = useState(false);
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isMiniGamesOpen, setIsMiniGamesOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [canInstallPwa, setCanInstallPwa] = useState(() => pwaService.isInstallable());
  const [isOnline, setIsOnline] = useState(() => pwaService.isOnline());
  const [soundEnabled, setSoundEnabled] = useState(true);


  // Snooze: lưu thời điểm (ms) được phép hiện lại modal nghỉ ngơi
  const snoozeUntilRef = useRef<number>(0);

  // Đăng ký theo dõi trạng thái đồng bộ Firebase
  useEffect(() => {
    const unsubscribe = firebaseSyncService.subscribeStatus((status) => {
      setSyncStatus(status);
    });
    return unsubscribe;
  }, []);

  // Tải dữ liệu từ Firebase Firestore khi khởi động (nếu có)
  useEffect(() => {
    let isMounted = true;
    const loadCloudData = async () => {
      try {
        const cloudData = await firebaseSyncService.loadFromCloud();
        if (cloudData && isMounted) {
          const isSameChild = !cloudData.profile?.userId || cloudData.profile.userId === profile.userId;
          const mergedProfile = cloudData.profile ? mergeProfile(profile, cloudData.profile) : profile;
          // Không gộp tiến độ/thú cưng của hai hồ sơ khác nhau vào cùng một bé.
          const mergedProgress = cloudData.progress
            ? isSameChild ? mergeProgress(progress, cloudData.progress) : cloudData.progress
            : progress;
          const mergedMascot = cloudData.mascot
            ? isSameChild ? mergeMascot(mascot, cloudData.mascot) : cloudData.mascot
            : mascot;
          const mergedLessons = cloudData.customLessons
            ? mergeCustomLessons(customLessons, cloudData.customLessons)
            : customLessons;

          setProfile(mergedProfile);
          setProgress(mergedProgress);
          setMascot(mergedMascot);
          setCustomLessons(mergedLessons);
          storageService.saveUserProfile(mergedProfile);
          storageService.saveProgress(mergedProgress);
          storageService.saveMascot(mergedMascot);
          mergedLessons.forEach((l) => storageService.saveCustomLesson(l));
          firebaseSyncService.scheduleSync(mergedProfile, mergedProgress, mergedMascot, mergedLessons);
        }
      } catch (e) {
        console.warn('Khởi tạo đám mây Firebase:', e);
      }
    };
    loadCloudData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Bộ đếm thời gian màn hình & Cảnh báo nghỉ ngơi bảo vệ mắt
  useEffect(() => {
    let lastTickTime = Date.now();

    const tickScreenTime = () => {
      const now = Date.now();
      // Chống cộng dồn phút liên tục khi chuyển đổi tab (visibilitychange)
      if (now - lastTickTime < 50000) {
        return;
      }
      lastTickTime = now;

      // Snooze chỉ ẩn cảnh báo; thời gian dùng ứng dụng vẫn tiếp tục được ghi nhận.
      const snoozed = now < snoozeUntilRef.current;

      setProfile((prev) => {
        const isVisible = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;
        const { nextMinutes, shouldAlert } = computeScreenTimeTick({
          currentMinutes: prev.screenTimeTodayMinutes || 0,
          dailyLimitMinutes: prev.dailyTimeLimitMinutes || 30,
          isVisible
        });

        if (nextMinutes === (prev.screenTimeTodayMinutes || 0)) {
          return prev;
        }

        const updated = { ...prev, screenTimeTodayMinutes: nextMinutes };
        storageService.saveUserProfile(updated);

        if (shouldAlert && !snoozed) {
          setIsScreenTimeAlertOpen(true);
        }

        return updated;
      });
    };

    const timer = setInterval(tickScreenTime, 60000);
    document.addEventListener('visibilitychange', tickScreenTime);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tickScreenTime);
    };
  }, []);

  // Đồng bộ chế độ bảo vệ mắt (Eye-Care Mode)
  useEffect(() => {
    if (profile.eyeCareMode) {
      document.body.classList.add('eye-care-mode');
    } else {
      document.body.classList.remove('eye-care-mode');
    }
  }, [profile.eyeCareMode]);

  // Cập nhật khối lớp
  const handleSelectGrade = (grade: Grade) => {
    setCurrentGrade(grade);
    const updated = { ...profile, currentGrade: grade };
    setProfile(updated);
    storageService.saveUserProfile(updated);
  };

  // Đổi trạng thái âm thanh
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audioService.setSoundEnabled(next);
    if (next) audioService.playPop();
  };

  // Toàn bộ ngân hàng bài học (Cố định + Do giáo viên biên soạn)
  const allCurriculumLessons = [...ALL_LESSONS, ...customLessons];

  // Lọc bài học theo Khối Lớp và Môn Học hiện tại
  const filteredLessons = allCurriculumLessons.filter(
    (l) => l.grade === currentGrade && l.subject === currentSubject
  );

  // Đếm số bài học của từng môn trong khối lớp hiện tại
  const availableLessonsCount = {
    math: allCurriculumLessons.filter((l) => l.grade === currentGrade && l.subject === 'math').length,
    vietnamese: allCurriculumLessons.filter((l) => l.grade === currentGrade && l.subject === 'vietnamese').length,
    english: allCurriculumLessons.filter((l) => l.grade === currentGrade && l.subject === 'english').length
  };

  // Xử lý hoàn thành bài học
  const handleLessonComplete = (
    score: number,
    stars: number,
    wrongIds?: string[],
    masteredIds?: string[]
  ): number => {
    if (!activeLesson) return 0;

    const { updatedProfile, updatedProgress, updatedMascot, earnedStars } =
      storageService.recordLessonCompletion(
        activeLesson.id,
        score,
        stars,
        currentGrade,
        wrongIds,
        masteredIds,
        activeRewardMultiplier,
        activeLesson.difficulty,
        activeLesson.xpReward
      );


    setProfile(updatedProfile);
    setProgress(updatedProgress);
    setMascot(updatedMascot);

    if (activeIsDailyChallenge) {
      storageService.markDailyChallengeCompleted(activeLesson.id);
    }

    // Tự động đồng bộ lên Firebase Cloud Firestore (Dự án gochoctap-aaa4a)
    firebaseSyncService.scheduleSync(updatedProfile, updatedProgress, updatedMascot, customLessons);
    firebaseSyncService.updateLeaderboard(updatedProfile, updatedMascot);
    setActiveRewardMultiplier(1);
    setActiveIsDailyChallenge(false);
    return earnedStars;
  };

  // Chuyển đổi tài khoản giữa các bé
  const handleSwitchProfile = (userId: string) => {
    const res = storageService.switchKidProfile(userId);
    if (res) {
      setProfile(res.profile);
      setProgress(res.progress);
      setMascot(res.mascot);
      setActiveLesson(null);
      setActiveRewardMultiplier(1);
      setActiveIsDailyChallenge(false);
      setCurrentGrade(res.profile.currentGrade || 1);
      setIsProfileOpen(false);

      void (async () => {
        const cloudData = await firebaseSyncService.loadChildFromCurrentAccount(userId);
        // Ignore an older network response if the parent switched profiles again meanwhile.
        if (!cloudData || storageService.getUserProfile().userId !== userId) return;

        const localProfile = storageService.getUserProfile();
        const mergedProfile = mergeProfile(localProfile, cloudData.profile);
        const mergedProgress = mergeProgress(storageService.getProgress(), cloudData.progress);
        const mergedMascot = mergeMascot(storageService.getMascot(), cloudData.mascot);
        const mergedLessons = mergeCustomLessons(customLessons, cloudData.customLessons);

        storageService.saveUserProfile(mergedProfile);
        storageService.saveProgress(mergedProgress);
        storageService.saveMascot(mergedMascot);
        mergedLessons.forEach((lesson) => storageService.saveCustomLesson(lesson));
        setProfile(mergedProfile);
        setProgress(mergedProgress);
        setMascot(mergedMascot);
        setCustomLessons(mergedLessons);
        setCurrentGrade(mergedProfile.currentGrade || 1);
        firebaseSyncService.scheduleSync(mergedProfile, mergedProgress, mergedMascot, mergedLessons);
      })();
    }
  };

  // Tạo hồ sơ cho bé mới
  const handleProfileCreated = (newKid: UserProfile) => {
    setProfile(newKid);
    setProgress({});
    setMascot(storageService.getMascot());
    setActiveLesson(null);
    setActiveRewardMultiplier(1);
    setActiveIsDailyChallenge(false);
    setCurrentGrade(newKid.currentGrade || 1);
    setIsProfileOpen(false);
    firebaseSyncService.scheduleSync(newKid, {}, storageService.getMascot(), customLessons);
    firebaseSyncService.updateLeaderboard(newKid, storageService.getMascot());
  };

  const handleRestoreBackupData = (
    restoredProfile: UserProfile,
    restoredProgress: UserProgressMap,
    restoredMascot: MascotState,
    restoredCustomLessons: Lesson[] = []
  ) => {
    const profileToRestore = restoredProfile.userId === profile.userId
      ? { ...restoredProfile, parentPin: profile.parentPin }
      : restoredProfile;
    setProfile(profileToRestore);
    setProgress(restoredProgress || {});
    setMascot(restoredMascot || storageService.getMascot());
    setCustomLessons(restoredCustomLessons);
    setCurrentGrade(profileToRestore.currentGrade || 1);
    storageService.saveUserProfile(profileToRestore);
    storageService.saveProgress(restoredProgress || {});
    storageService.saveMascot(restoredMascot || storageService.getMascot());
    restoredCustomLessons.forEach((lesson) => storageService.saveCustomLesson(lesson));
    firebaseSyncService.scheduleSync(profileToRestore, restoredProgress || {}, restoredMascot || storageService.getMascot(), restoredCustomLessons);
    firebaseSyncService.updateLeaderboard(profileToRestore, restoredMascot || storageService.getMascot());
  };

  // Cho Bibo ăn
  const handleFeedMascot = () => {
    const result = storageService.feedMascot(5);
    if (result.success) {
      setMascot({ ...result.mascot });
      setProfile({ ...result.profile });
      firebaseSyncService.scheduleSync(result.profile, progress, result.mascot, customLessons);
      firebaseSyncService.updateLeaderboard(result.profile, result.mascot);
    }
  };

  // Mua trang phục phụ kiện cho Bibo bằng Kim Cương
  const handleBuyMascotItem = (itemId: string, costGems: number) => {
    const result = storageService.buyMascotItem(itemId, costGems);
    if (result.success) {
      setMascot({ ...result.mascot });
      setProfile({ ...result.profile });
      firebaseSyncService.scheduleSync(result.profile, progress, result.mascot, customLessons);
    }
  };

  // Mặc hoặc tháo phụ kiện cho Bibo
  const handleEquipMascotItem = (slot: 'hat' | 'accessory', itemId: string | null) => {
    const updated = storageService.equipMascotItem(slot, itemId);
    setMascot({ ...updated });
    firebaseSyncService.scheduleSync(profile, progress, updated, customLessons);
  };

  // Quản lý đề thi của giáo viên
  const handleSaveCustomLesson = (newLesson: Lesson) => {
    const updated = storageService.saveCustomLesson(newLesson);
    setCustomLessons(updated);
    firebaseSyncService.scheduleSync(profile, progress, mascot, updated);
    // Xuất bản bài học lên thư viện chung nếu cần
    firebaseSyncService.publishLessonToCloud(newLesson, profile.displayName);
  };

  const handleDeleteCustomLesson = (lessonId: string) => {
    const updated = storageService.deleteCustomLesson(lessonId);
    setCustomLessons(updated);
    firebaseSyncService.scheduleSync(profile, progress, mascot, updated);
  };

  // Cập nhật cài đặt phụ huynh
  const handleUpdateParentProfile = (updated: UserProfile) => {
    setProfile(updated);
    storageService.saveUserProfile(updated);
    firebaseSyncService.scheduleSync(updated, progress, mascot, customLessons);
    firebaseSyncService.updateLeaderboard(updated, mascot);
  };

  // Theo dõi PWA install & network status
  useEffect(() => {
    const unsubInstall = pwaService.onInstallableChange((canInstall) => {
      setCanInstallPwa(canInstall);
    });
    const unsubNetwork = pwaService.onNetworkChange((online) => {
      setIsOnline(online);
    });
    return () => {
      unsubInstall();
      unsubNetwork();
    };
  }, []);

  const handleInstallApp = async () => {
    if (pwaService.isIOS()) {
      alert('Để cài đặt ứng dụng trên iPhone/iPad:\n1. Bấm nút Chia sẻ (biểu tượng mũi tên hướng lên ở Safari)\n2. Chọn "Thêm vào Màn hình chính" (Add to Home Screen) ➕');
      return;
    }
    await pwaService.promptInstall();
  };

  const handleClaimGameRewards = (earnedStars: number, earnedXp: number) => {
    const updatedProfile = { ...profile, stars: profile.stars + earnedStars };
    const updatedMascot = { ...mascot };
    updatedMascot.currentXp += earnedXp;
    while (updatedMascot.currentXp >= updatedMascot.xpToNextLevel && updatedMascot.xpToNextLevel > 0) {
      updatedMascot.level += 1;
      updatedMascot.currentXp -= updatedMascot.xpToNextLevel;
      updatedMascot.xpToNextLevel = Math.round(updatedMascot.xpToNextLevel * 1.4);
    }
    setProfile(updatedProfile);
    setMascot(updatedMascot);
    storageService.saveUserProfile(updatedProfile);
    storageService.saveMascot(updatedMascot);
    firebaseSyncService.scheduleSync(updatedProfile, progress, updatedMascot, customLessons);
    firebaseSyncService.updateLeaderboard(updatedProfile, updatedMascot);
  };

  return (
    <div className="app-layout">
      {/* Cảnh báo Ngoại tuyến (Offline) */}
      {!isOnline && (
        <div className="offline-network-banner">
          📶 Đang ở chế độ Ngoại Tuyến (Offline). Bé vẫn có thể học bài và chơi game bình thường!
        </div>
      )}

      {/* Thanh trạng thái Header */}
      <Header
        profile={profile}
        mascot={mascot}
        syncStatus={syncStatus}
        onOpenParentGate={() => setIsParentGateOpen(true)}
        onOpenBadges={() => setIsBadgesOpen(true)}
        onOpenMascot={() => setIsMascotOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenMiniGames={() => setIsMiniGamesOpen(true)}
        onInstallApp={handleInstallApp}
        canInstall={canInstallPwa}
      />

      <main className="app-main-content">
        {/* Banner Chào Mừng Vui Tươi */}
        <section className="welcome-hero">
          <div className="hero-content">
            <h1 className="hero-title">Chào {profile.displayName}! 👋</h1>
            <p className="hero-subtitle">
              Hôm nay bé muốn cùng chú Cú Bibo khám phá bài học thú vị nào? Hãy chọn khối lớp và môn học bên dưới nhé!
            </p>
          </div>
          <div className="hero-sparkles">🦉✨🎈</div>
          <div className="hero-wave" />
        </section>

        {/* Thống kê nhanh Widget */}
        <QuickStats profile={profile} progress={progress} />

        {/* Thử Thách Mỗi Ngày - Nhân đôi phần thưởng (Ưu tiên theo khối lớp của bé) */}
        <DailyChallenge
          lessons={(() => {
            const gradeLessons = allCurriculumLessons.filter((l) => l.grade === currentGrade);
            return gradeLessons.length > 0 ? gradeLessons : allCurriculumLessons;
          })()}
          onStartChallenge={(lesson) => {
            setActiveRewardMultiplier(2);
            setActiveIsDailyChallenge(true);
            setActiveLesson(lesson);
          }}
          completedLessonIds={(() => {
            const completion = storageService.getDailyChallengeCompletion();
            const today = new Date().toISOString().split('T')[0];
            return completion?.date === today ? [completion.lessonId] : [];
          })()}
          onProfileUpdated={(updatedProf) => {
            setProfile(updatedProf);
            firebaseSyncService.scheduleSync(updatedProf, progress, mascot, customLessons);
            firebaseSyncService.updateLeaderboard(updatedProf, mascot);
          }}
        />

        {/* Banner Khu Vui Chơi Mini-Games */}
        <div
          className="mini-games-entry-banner"
          onClick={() => {
            audioService.playPop();
            setIsMiniGamesOpen(true);
          }}
          role="button"
          tabIndex={0}
        >
          <div className="entry-banner-left">
            <span className="entry-banner-icon">🎮</span>
            <div className="entry-banner-text">
              <div className="entry-banner-tag">MỚI RA MẮT ✨</div>
              <h3 className="entry-banner-title">Khu Vui Chơi Mini-Games Phản Xạ</h3>
              <p className="entry-banner-subtitle">
                Đua xe phép tính tốc độ & Lật thẻ trí nhớ Song Ngữ nhận thêm nhiều Sao ⭐ và XP!
              </p>
            </div>
          </div>
          <button className="btn-entry-banner">Khám Phá Ngay 🚀</button>
        </div>

        {/* Bộ Chọn Khối Lớp 1 - 5 */}

        <GradeSelector
          currentGrade={currentGrade}
          onSelectGrade={handleSelectGrade}
          progress={progress}
          lessons={allCurriculumLessons}
        />

        {/* Bộ Chọn Môn Học (Toán, Tiếng Việt, Tiếng Anh) */}
        <SubjectSelector
          currentSubject={currentSubject}
          onSelectSubject={(subj) => setCurrentSubject(subj)}
          availableLessonsCount={availableLessonsCount}
        />

        {/* Danh Sách Bài Học Của Môn */}
        <LessonList
          lessons={filteredLessons}
          progress={progress}
          totalUserStars={profile.stars}
          onStartLesson={(lesson) => {
            setActiveRewardMultiplier(1);
            setActiveLesson(lesson);
          }}
        />
      </main>

      {/* Động Cơ Chạy Bài Học Tương Tác */}
      {activeLesson && (
        <LessonRunner
          lesson={activeLesson}
          previousWrongIds={progress[activeLesson.id]?.wrongQuestionIds || []}
          onExit={() => {
            setActiveRewardMultiplier(1);
            setActiveIsDailyChallenge(false);
            setActiveLesson(null);
          }}
          onComplete={handleLessonComplete}
        />
      )}

      {/* Cửa Sổ Phòng Nuôi Thú Cưng Bibo */}
      <MascotWidget
        mascot={mascot}
        profile={profile}
        isOpen={isMascotOpen}
        onClose={() => setIsMascotOpen(false)}
        onFeedMascot={handleFeedMascot}
        onBuyItem={handleBuyMascotItem}
        onEquipItem={handleEquipMascotItem}
      />

      {/* Cửa Sổ Cổng Phụ Huynh & Báo Cáo */}
      <ParentModal
        profile={profile}
        progress={progress}
        isOpen={isParentGateOpen}
        onClose={() => setIsParentGateOpen(false)}
        onUpdateProfile={handleUpdateParentProfile}
        onRestoreBackupData={handleRestoreBackupData}
        onOpenTeacherPortal={() => {
          setIsParentGateOpen(false);
          setIsTeacherPortalOpen(true);
        }}
        onResetProgress={() => {
          const res = storageService.resetAllProgress();
          setProfile(res.profile);
          setProgress(res.progress);
          setMascot(res.mascot);
          setActiveLesson(null);
        }}
        onStartReviewLesson={(lesson) => {
          setIsParentGateOpen(false);
          setActiveRewardMultiplier(1);
          setActiveIsDailyChallenge(false);
          setActiveLesson(lesson);
        }}
        onOpenCertificate={() => {
          setIsParentGateOpen(false);
          setIsCertificateOpen(true);
        }}
      />

      {/* Cửa Sổ Tủ Huy Hiệu Danh Dự */}
      <BadgesModal
        unlockedBadgeIds={profile.unlockedBadges}
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
      />

      {/* Cửa Sổ Cảnh Báo Giới Hạn Màn Hình (Bảo Vệ Mắt Bé) */}
      <ScreenTimeAlertModal
        isOpen={isScreenTimeAlertOpen && !isParentGateOpen && !isMascotOpen && !isTeacherPortalOpen && !isProfileOpen && !isLeaderboardOpen && activeLesson === null}
        limitMinutes={profile.dailyTimeLimitMinutes || 30}
        onTakeBreak={() => {
          // Snooze 15 phút: không hiện lại modal trong 15 phút tới
          snoozeUntilRef.current = Date.now() + 15 * 60 * 1000;
          setIsScreenTimeAlertOpen(false);
        }}
        onOpenParentGate={() => {
          setIsScreenTimeAlertOpen(false);
          setIsParentGateOpen(true);
        }}
      />

      {/* Cổng Soạn Đề Cho Giáo Viên & Quản Lý */}
      <TeacherPortalModal
        isOpen={isTeacherPortalOpen}
        onClose={() => setIsTeacherPortalOpen(false)}
        customLessons={customLessons}
        onSaveLesson={handleSaveCustomLesson}
        onDeleteLesson={handleDeleteCustomLesson}
        onTestLesson={(lesson) => {
          setActiveRewardMultiplier(1);
          setActiveLesson(lesson);
        }}
      />

      {/* Cửa Sổ Chọn / Đổi Hồ Sơ Bé Học */}
      <ProfileModal
        isOpen={isProfileOpen}
        currentProfile={profile}
        onClose={() => setIsProfileOpen(false)}
        onSwitchProfile={handleSwitchProfile}
        onProfileCreated={handleProfileCreated}
      />

      {/* Cửa Sổ Bảng Vàng Thi Đua & Đấu Trường */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        profile={profile}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      {/* Cửa Sổ Khu Vui Chơi Mini-Games */}
      <MiniGamesModal
        isOpen={isMiniGamesOpen}
        onClose={() => setIsMiniGamesOpen(false)}
        grade={currentGrade}
        onRewardClaimed={handleClaimGameRewards}
      />

      {/* Phiếu Khen Thưởng Xuất Ảnh */}
      <AchievementCertificate
        profile={profile}
        mascot={mascot}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />
    </div>
  );
}


export default App;
