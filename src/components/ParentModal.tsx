import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserProgressMap } from '../types/user';
import { Lesson } from '../types/curriculum';
import { ALL_LESSONS } from '../data/curriculumData';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';
import { firebaseSyncService } from '../services/firebaseSyncService';
import { createParentModalDefaultState } from '../services/sessionState';

interface ParentModalProps {
  profile: UserProfile;
  progress: UserProgressMap;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onRestoreBackupData?: (profile: UserProfile, progress: UserProgressMap, mascot: any, customLessons?: any[]) => void;
  onResetProgress?: () => void;
  onOpenTeacherPortal?: () => void;
  onStartReviewLesson?: (lesson: Lesson) => void;
  onOpenCertificate?: () => void;
}

export const ParentModal: React.FC<ParentModalProps> = ({
  profile,
  progress,
  isOpen,
  onClose,
  onUpdateProfile,
  onRestoreBackupData,
  onResetProgress,
  onOpenTeacherPortal,
  onStartReviewLesson,
  onOpenCertificate
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathChallenge, setMathChallenge] = useState({ num1: 14, num2: 6 });
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const pinSuccessTimerRef = useRef<number | null>(null);
  const [googleUser, setGoogleUser] = useState<{ email: string | null; name: string | null } | null>(
    firebaseSyncService.getGoogleUser()
  );
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const unsub = firebaseSyncService.subscribeGoogleUser((info) => {
      setGoogleUser(info);
    });
    return unsub;
  }, []);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setToastMessage('');
    try {
      const res = await firebaseSyncService.parentSignInWithGoogle();
      if (res) {
        // Đọc riêng hồ sơ bé hiện tại trong tài khoản phụ huynh.
        const cloudData = await firebaseSyncService.loadFromCloudForGoogle(res.uid, profile.userId);
        if (cloudData && onRestoreBackupData) {
          onRestoreBackupData(
            cloudData.profile || profile,
            cloudData.progress || progress,
            cloudData.mascot || storageService.getMascot(),
            cloudData.customLessons || storageService.getCustomLessons()
          );
          setToastMessage(`Đã liên kết Google (${res.email}) & đồng bộ tiến độ học từ đám mây!`);
        } else {
          const cloudProfiles = await firebaseSyncService.loadChildProfilesForGoogle(res.uid);
          const profilesById = new Map(storageService.getAllProfiles().map((kid) => [kid.userId, kid]));
          cloudProfiles.forEach((cloudProfile) => {
            const localProfile = profilesById.get(cloudProfile.userId);
            profilesById.set(cloudProfile.userId, {
              ...cloudProfile,
              parentPin: localProfile?.parentPin || profile.parentPin
            });
          });
          storageService.saveAllProfiles(Array.from(profilesById.values()));

          if (cloudProfiles.length > 0) {
            setToastMessage(
              `Đã liên kết Google (${res.email}) và tìm thấy ${cloudProfiles.length} hồ sơ trên đám mây. Đóng cửa sổ này, mở danh sách hồ sơ bé rồi chọn đúng bé để tải tiến độ.`
            );
          } else {
            const saved = await firebaseSyncService.autoSyncFromLocalStorage();
            setToastMessage(saved
              ? `Đã liên kết Google (${res.email}) & lưu hồ sơ bé lên đám mây!`
              : 'Đã liên kết Google nhưng chưa đồng bộ được hồ sơ. Hãy kiểm tra kết nối và thử đồng bộ lại.');
          }
        }
        setIsUnlocked(true);
        audioService.playSuccess();
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      let msg = err?.message || 'Không thể đăng nhập Google';
      if (err?.code === 'auth/popup-closed-by-user') {
        msg = 'Cửa sổ đăng nhập Google đã bị đóng.';
      } else if (err?.code === 'auth/configuration-not-found' || err?.code === 'auth/operation-not-allowed') {
        msg = 'Chưa bật đăng nhập Google trong Firebase Console. Xin vào Authentication -> Sign-in method -> Bật Google.';
      } else if (err?.code === 'auth/credential-already-in-use') {
        msg = 'Tài khoản Google này đã được liên kết với một hồ sơ khác. Hãy đăng nhập bằng tài khoản đó để tải dữ liệu.';
      }
      setToastMessage(msg);
      audioService.playWrong();
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    setIsGoogleLoading(true);
    try {
      await firebaseSyncService.parentSignOut();
      setToastMessage('Đã đăng xuất tài khoản Google.');
      audioService.playPop();
    } catch (err: any) {
      setToastMessage('Lỗi đăng xuất: ' + err.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleManualSyncToCloud = async () => {
    setIsGoogleLoading(true);
    try {
      const ok = await firebaseSyncService.autoSyncFromLocalStorage();
      if (ok) {
        setToastMessage('Đã đồng bộ toàn bộ dữ liệu của bé lên đám mây thành công!');
        audioService.playSuccess();
      } else {
        setToastMessage('Đồng bộ thất bại, xin kiểm tra kết nối mạng!');
      }
    } catch (err: any) {
      setToastMessage('Lỗi đồng bộ: ' + (err?.message || 'Thất bại'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleManualPullFromCloud = async () => {
    setIsGoogleLoading(true);
    try {
      const cloudData = await firebaseSyncService.loadFromCloud();
      if (cloudData && onRestoreBackupData) {
        onRestoreBackupData(
          cloudData.profile || profile,
          cloudData.progress || progress,
          cloudData.mascot || storageService.getMascot(),
          cloudData.customLessons || storageService.getCustomLessons()
        );
        setToastMessage('Đã tải và phục hồi tiến độ học từ đám mây về máy này thành công!');
        audioService.playSuccess();
      } else {
        setToastMessage('Không tìm thấy dữ liệu cũ hơn trên đám mây để phục hồi.');
      }
    } catch (err: any) {
      setToastMessage('Lỗi tải dữ liệu: ' + (err?.message || 'Thất bại'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      const defaults = createParentModalDefaultState();
      setIsUnlocked(defaults.isUnlocked);
      setPinInput(defaults.pinInput);
      setErrorMsg(defaults.errorMsg);
      setMathAnswer(defaults.mathAnswer);
      setIsConfirmingReset(defaults.isConfirmingReset);
      setNewPin(defaults.newPin);
      setPinSuccessMsg(defaults.pinSuccessMsg);
      setToastMessage(defaults.toastMessage);
      if (pinSuccessTimerRef.current) {
        window.clearTimeout(pinSuccessTimerRef.current);
        pinSuccessTimerRef.current = null;
      }
      return;
    }

    const defaults = createParentModalDefaultState();
    setIsUnlocked(defaults.isUnlocked);
    setPinInput(defaults.pinInput);
    setErrorMsg(defaults.errorMsg);
    setMathAnswer(defaults.mathAnswer);
    setIsConfirmingReset(defaults.isConfirmingReset);
    setNewPin(defaults.newPin);
    setPinSuccessMsg(defaults.pinSuccessMsg);
    setToastMessage(defaults.toastMessage);
    setMathChallenge({
      num1: Math.floor(Math.random() * 9) + 6,
      num2: Math.floor(Math.random() * 8) + 3
    });
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (pinSuccessTimerRef.current) {
        window.clearTimeout(pinSuccessTimerRef.current);
      }
    };
  }, []);

  // Câu đố toán người lớn (Chặn trẻ nhỏ)
  const { num1, num2 } = mathChallenge;
  const expectedMath = num1 * num2;

  if (!isOpen) return null;

  const handleVerifyPin = () => {
    if (pinInput === profile.parentPin || (mathAnswer.trim() !== '' && Number(mathAnswer) === expectedMath)) {
      audioService.playSuccess();
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      audioService.playWrong();
      setErrorMsg('Mã PIN hoặc đáp án chưa đúng, xin phụ huynh kiểm tra lại!');
    }
  };

  const handleTimeLimitChange = (minutes: number) => {
    audioService.playPop();
    onUpdateProfile({
      ...profile,
      dailyTimeLimitMinutes: minutes
    });
  };

  const handleToggleEyeCare = () => {
    audioService.playPop();
    onUpdateProfile({
      ...profile,
      eyeCareMode: !profile.eyeCareMode
    });
  };

  const handleChangePin = () => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setErrorMsg('Mã PIN mới phải gồm đúng 4 chữ số!');
      return;
    }
    onUpdateProfile({
      ...profile,
      parentPin: newPin
    });
    setNewPin('');
    setPinSuccessMsg('Đã đổi mã PIN thành công!');
    if (pinSuccessTimerRef.current) {
      window.clearTimeout(pinSuccessTimerRef.current);
    }
    pinSuccessTimerRef.current = window.setTimeout(() => setPinSuccessMsg(''), 3000);
  };

  const completedCount = Object.keys(progress).length;
  const totalStarsEarned = Object.values(progress).reduce((acc, curr) => acc + curr.stars, 0);

  // Thống kê theo từng môn
  let mathLessons = 0;
  let vietnameseLessons = 0;
  let englishLessons = 0;
  Object.keys(progress).forEach((id) => {
    if (id.includes('_m_')) mathLessons++;
    else if (id.includes('_v_')) vietnameseLessons++;
    else if (id.includes('_e_')) englishLessons++;
  });

  // Dữ liệu học tập 7 ngày gần nhất
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const todayDate = new Date();
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(todayDate.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const dayLabel = dayNames[d.getDay()];
    const count = Object.values(progress).filter(p => {
      const ts = p.completedAt || p.lastPlayed;
      return ts ? new Date(ts).toDateString() === dateStr : false;
    }).length;
    return {
      label: dayLabel,
      count,
      isToday: d.toDateString() === todayDate.toDateString()
    };
  });
  const maxDailyCount = Math.max(1, ...last7Days.map(d => d.count));

  const totalSubj = mathLessons + vietnameseLessons + englishLessons;
  const mPct = totalSubj > 0 ? (mathLessons / totalSubj) * 100 : 33.3;
  const vPct = totalSubj > 0 ? (vietnameseLessons / totalSubj) * 100 : 33.3;
  const donutGradient = totalSubj === 0 
    ? '#E2E8F0' 
    : `conic-gradient(#10AC84 0% ${mPct}%, #FF6B6B ${mPct}% ${mPct + vPct}%, #0984E3 ${mPct + vPct}% 100%)`;

  let strongestSubject = 'Toán Học';
  let focusSubject = 'Tiếng Việt';
  if (vietnameseLessons >= mathLessons && vietnameseLessons >= englishLessons) {
    strongestSubject = 'Tiếng Việt';
    focusSubject = mathLessons <= englishLessons ? 'Toán Học' : 'Tiếng Anh';
  } else if (englishLessons >= mathLessons && englishLessons >= vietnameseLessons) {
    strongestSubject = 'Tiếng Anh';
    focusSubject = mathLessons <= vietnameseLessons ? 'Toán Học' : 'Tiếng Việt';
  } else {
    strongestSubject = 'Toán Học';
    focusSubject = vietnameseLessons <= englishLessons ? 'Tiếng Việt' : 'Tiếng Anh';
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="parent-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose}>
          ✕
        </button>

        {!isUnlocked ? (
          /* CỔNG BẢO VỆ PHỤ HUYNH (PARENTAL GATE) */
          <div className="parent-gate-lock-screen">
            <div className="gate-lock-icon">🔒</div>
            <h2>Cổng Bảo Mật Dành Cho Phụ Huynh</h2>
            <p className="gate-desc">
              Khu vực cài đặt và xem báo cáo dành riêng cho cha mẹ. Vui lòng nhập mã PIN hoặc giải bài toán bên dưới:
            </p>

            {/* ĐĂNG NHẬP GOOGLE NHANH (TIỆN ĐỔI MÁY) */}
            <div style={{
              background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
              border: '2px solid #A5B4FC',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '20px',
              width: '100%',
              maxWidth: '460px',
              textAlign: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.1)'
            }}>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#3730A3', marginBottom: '6px' }}>
                ☁️ Đăng Nhập Google Để Đồng Bộ & Đổi Máy
              </div>
              <p style={{ fontSize: '13px', color: '#4338CA', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                Đổi sang iPad, máy tính, điện thoại khác sẽ tự động tải lại 100% tiến trình của con mà không cần nhớ mã PIN:
              </p>
              <button
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px 24px',
                  background: '#FFFFFF',
                  border: '2px solid #C7D2FE',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '15px',
                  color: '#1E293B',
                  cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(67, 56, 202, 0.15)',
                  width: '100%',
                  transition: 'transform 0.1s'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27A7.054 7.054 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                {isGoogleLoading ? 'Đang kết nối Google...' : 'Đăng Nhập Bằng Tài Khoản Google'}
              </button>
            </div>

            <div className="auth-divider" style={{ margin: '0 0 16px 0', width: '100%', maxWidth: '460px', color: '#94A3B8', fontWeight: 700 }}>
              HOẶC DÙNG MÃ PIN / PHÉP TÍNH
            </div>

            <div className="gate-auth-boxes">
              <div className="auth-option-box">
                <label>Cách 1: Nhập Mã PIN phụ huynh</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  className="pin-input"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyPin()}
                />
              </div>

              <div className="auth-divider">HOẶC</div>

              <div className="auth-option-box">
                <label>Cách 2: Phép tính người lớn: <strong>{num1} x {num2} = ?</strong></label>
                <input
                  type="number"
                  placeholder="Nhập kết quả"
                  className="math-input"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyPin()}
                />
              </div>
            </div>

            {errorMsg && <div className="gate-error-banner">⚠️ {errorMsg}</div>}
            {toastMessage && (
              <div className="gate-error-banner" style={
                toastMessage.startsWith('⚠️') || toastMessage.startsWith('Không') || toastMessage.startsWith('Cửa sổ') || toastMessage.startsWith('Chưa') || toastMessage.startsWith('Tài khoản') || toastMessage.startsWith('Lỗi')
                  ? { background: '#FEF2F2', color: '#B91C1C', borderColor: '#FECACA' }
                  : { background: '#DCFCE7', color: '#166534', borderColor: '#86EFAC' }
              }>
                {toastMessage.startsWith('Đã') ? '✓ ' : '⚠️ '}{toastMessage}
              </div>
            )}

            <button className="btn-unlock-gate" onClick={handleVerifyPin}>
              Mở Khóa Bảng Phụ Huynh ➔
            </button>
          </div>
        ) : (
          /* BẢNG ĐIỀU KHIỂN BÁO CÁO VÀ CÀI ĐẶT */
          <div className="parent-dashboard-content">
            <div className="dashboard-header">
              <h2>👨‍👩‍👧 Báo Cáo Học Tập Của {profile.displayName}</h2>
              <span className="safe-tag">🛡️ Chuẩn Bảo Vệ Trẻ Em COPPA</span>
            </div>

            {/* Nút Soạn Đề — chỉ hiện sau khi nhập PIN */}
            {onOpenTeacherPortal && (
              <div className="parent-setting-section" style={{ paddingBottom: '4px' }}>
                <h3>🎓 Cổng Giáo Viên & Quản Lý</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    className="btn-teacher-access"
                    onClick={() => {
                      audioService.playPop();
                      onOpenTeacherPortal();
                    }}
                  >
                    <span style={{ fontSize: '28px' }}>📝</span>
                    <div>
                      <div>Soạn Đề & Quản Lý Bài Học</div>
                      <div className="teacher-access-desc">Thêm, sửa, xóa bài học tùy chỉnh · Xuất bản lên thư viện chung</div>
                    </div>
                  </button>
                  {onOpenCertificate && (
                    <button
                      className="btn-teacher-access"
                      style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', borderColor: '#FCD34D' }}
                      onClick={() => {
                        audioService.playPop();
                        onOpenCertificate();
                      }}
                    >
                      <span style={{ fontSize: '28px' }}>🏆</span>
                      <div>
                        <div>Phiếu Khen Thưởng</div>
                        <div className="teacher-access-desc">Xuất ảnh phiếu khen thành tích của bé · In hoặc chia sẻ Zalo</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}


            {/* Thống kê nhanh */}
            <div className="parent-metrics-grid">
              <div className="metric-box">
                <span className="metric-title">Số Bài Đã Học</span>
                <span className="metric-val">{completedCount} bài</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Tổng Sao Đạt Được</span>
                <span className="metric-val">⭐ {totalStarsEarned}</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Chuỗi Ngày Học</span>
                <span className="metric-val">🔥 {profile.currentStreak} ngày</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Thời Gian Hôm Nay</span>
                <span className="metric-val">⏱️ {profile.screenTimeTodayMinutes} phút</span>
              </div>
            </div>

            {/* Biểu đồ hoạt động 7 ngày gần nhất */}
            <div className="parent-setting-section">
              <h3>📊 Tần Suất Hoàn Thành Bài Học (7 Ngày Gần Nhất)</h3>
              <p className="setting-desc">Biểu đồ thể hiện số lượng bài tập bé đã hoàn thành mỗi ngày:</p>
              <div className="weekly-chart">
                {last7Days.map((day, idx) => {
                  const heightPct = Math.max(8, Math.round((day.count / maxDailyCount) * 100));
                  return (
                    <div key={idx} className="chart-bar">
                      <span className="chart-bar-count">{day.count > 0 ? day.count : ''}</span>
                      <div
                        className={`chart-bar-fill ${day.isToday ? 'today' : ''}`}
                        style={{ height: `${heightPct}%` }}
                        title={`${day.label}: ${day.count} bài học`}
                      />
                      <span className="chart-bar-label">{day.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phân Tích Năng Lực & Tỷ Lệ Môn */}
            <div className="parent-setting-section">
              <h3>🎯 Phân Tích Năng Lực & Đề Xuất Học Tập</h3>
              <div className="subject-donut-wrap">
                <div 
                  className="subject-donut" 
                  style={{ background: donutGradient }}
                  title="Tỷ lệ phân bố bài học các môn"
                >
                  <div className="subject-donut-hole">
                    <span>{totalSubj} bài</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <span className="subject-strength-tag strength">
                      💪 Điểm sáng: {strongestSubject}
                    </span>
                    <span className="subject-strength-tag focus">
                      🎯 Khuyến khích thêm: {focusSubject}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                    Cha mẹ nên khích lệ bé học đều cả 3 môn để phát triển tư duy logic toán học, ngôn ngữ tiếng Việt và phản xạ tiếng Anh tự nhiên.
                  </p>
                </div>
              </div>
            </div>

            {/* Tiến độ phân môn chi tiết */}
            <div className="parent-setting-section">
              <h3>📚 Chi Tiết Tiến Trình Theo Từng Môn Học</h3>
              <div className="subject-progress-bars-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '10px' }}>
                <div style={{ background: '#E8F8F5', padding: '12px', borderRadius: '12px', border: '1px solid #A3E4D7' }}>
                  <strong style={{ color: '#10AC84' }}>🧮 Toán Học</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Đã hoàn thành: <strong>{mathLessons} bài</strong></p>
                </div>
                <div style={{ background: '#FFEAEA', padding: '12px', borderRadius: '12px', border: '1px solid #FFC9C9' }}>
                  <strong style={{ color: '#FF6B6B' }}>📖 Tiếng Việt</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Đã hoàn thành: <strong>{vietnameseLessons} bài</strong></p>
                </div>
                <div style={{ background: '#EAF9FE', padding: '12px', borderRadius: '12px', border: '1px solid #B8E8FC' }}>
                  <strong style={{ color: '#0984E3' }}>🌍 Tiếng Anh</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Đã hoàn thành: <strong>{englishLessons} bài</strong></p>
                </div>
              </div>
            </div>

            {/* Giới hạn thời gian màn hình (Screen Time Control) */}
            <div className="parent-setting-section">
              <h3>⏱️ Giới Hạn Giờ Học Trong Ngày (Bảo Vệ Thị Lực)</h3>
              <p className="setting-desc">Hệ thống sẽ tự động nhắc nhở khi bé học đủ thời gian đã chọn:</p>
              <div className="time-limit-buttons">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    className={`btn-time-choice ${profile.dailyTimeLimitMinutes === mins ? 'active' : ''}`}
                    onClick={() => handleTimeLimitChange(mins)}
                  >
                    {mins} Phút
                  </button>
                ))}
              </div>
            </div>

            {/* Chế độ bảo vệ mắt (Eye Care Mode) */}
            <div className="parent-setting-section">
              <div className="toggle-row">
                <div>
                  <h3>🌙 Chế Độ Bảo Vệ Mắt (Eye-Care Mode)</h3>
                  <p className="setting-desc">Tự động làm ấm tông màu và giảm chói vào buổi tối.</p>
                </div>
                <button
                  className={`btn-toggle-switch ${profile.eyeCareMode ? 'on' : 'off'}`}
                  onClick={handleToggleEyeCare}
                >
                  {profile.eyeCareMode ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                </button>
              </div>
            </div>

            {/* Đổi mã PIN phụ huynh */}
            <div className="parent-setting-section">
              <h3>🔑 Đổi Mã PIN Phụ Huynh</h3>
              <p className="setting-desc">Nhập 4 chữ số mới để bảo vệ cài đặt:</p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Mã PIN 4 số"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '120px', fontSize: '16px' }}
                />
                <button
                  style={{ padding: '8px 16px', background: '#2e86de', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                  onClick={handleChangePin}
                >
                  Lưu PIN Mới
                </button>
              </div>
              {pinSuccessMsg && <p style={{ color: '#10AC84', fontSize: '13px', margin: '4px 0 0 0' }}>✓ {pinSuccessMsg}</p>}
            </div>

            {/* Xóa / Đặt lại tiến trình học */}
            {onResetProgress && (
              <div className="parent-setting-section" style={{ borderTop: '1px solid #fee2e2', paddingTop: '16px' }}>
                <h3 style={{ color: '#dc2626' }}>⚠️ Đặt Lại Tiến Trình Học</h3>
                <p className="setting-desc">Dùng khi phụ huynh muốn bé luyện tập lại từ đầu hoặc cho bé khác học.</p>
                {!isConfirmingReset ? (
                  <button
                    style={{ padding: '8px 16px', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => setIsConfirmingReset(true)}
                  >
                    🔄 Xóa & Đặt Lại Tiến Trình
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#b91c1c', fontWeight: 600 }}>Bạn có chắc chắn không?</span>
                    <button
                      style={{ padding: '8px 14px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                      onClick={() => {
                        onResetProgress();
                        setIsConfirmingReset(false);
                        audioService.playPop();
                      }}
                    >
                      Đồng Ý Đặt Lại
                    </button>
                    <button
                      style={{ padding: '8px 14px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={() => setIsConfirmingReset(false)}
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TÀI KHOẢN PHỤ HUYNH & ĐỒNG BỘ GOOGLE (ĐỔI THIẾT BỊ) */}
            <div className="parent-setting-section" style={{
              background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
              border: '2px solid #BFDBFE',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>☁️</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '17px', color: '#1E3A8A' }}>Tài Khoản Phụ Huynh & Đồng Bộ Google</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                      Lưu trữ đám mây · Tự động đồng bộ khi đổi sang máy tính, iPad, điện thoại khác
                    </p>
                  </div>
                </div>
                {googleUser ? (
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #86EFAC'
                  }}>
                    🟢 ĐÃ LIÊN KẾT GOOGLE
                  </span>
                ) : (
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #FCD34D'
                  }}>
                    ⚪ CHƯA LIÊN KẾT
                  </span>
                )}
              </div>

              {googleUser ? (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                      color: '#FFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {(googleUser.name || googleUser.email || 'P')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '14px' }}>
                        {googleUser.name || 'Phụ Huynh'}
                      </div>
                      <div style={{ color: '#64748B', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {googleUser.email}
                      </div>
                    </div>
                    <button
                      onClick={handleGoogleSignOut}
                      disabled={isGoogleLoading}
                      style={{
                        padding: '7px 14px',
                        background: '#F1F5F9',
                        color: '#475569',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Đăng Xuất
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 12px 0', lineHeight: 1.6 }}>
                    ✅ <strong>Dữ liệu của bé đã được bảo vệ trên đám mây:</strong> Khi chuyển sang thiết bị khác, phụ huynh chỉ cần bấm đăng nhập với tài khoản Google này là toàn bộ số sao ⭐, đá quý 💎, thú cưng Bibo 🦉 và bài tập đã làm sẽ tự động tải về đầy đủ.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleManualSyncToCloud}
                      disabled={isGoogleLoading}
                      style={{
                        padding: '9px 16px',
                        background: '#2563EB',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      ☁️ {isGoogleLoading ? 'Đang xử lý...' : 'Đồng Bộ Máy Này Lên Đám Mây'}
                    </button>
                    <button
                      onClick={handleManualPullFromCloud}
                      disabled={isGoogleLoading}
                      style={{
                        padding: '9px 16px',
                        background: '#0D9488',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      📥 {isGoogleLoading ? 'Đang tải...' : 'Tải Tiến Độ Từ Đám Mây Về'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.6 }}>
                    Đăng nhập Google để con đổi sang máy tính bảng, iPad hoặc điện thoại khác <strong>không lo mất kết quả học tập</strong>:
                  </p>

                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 20px',
                      background: '#FFFFFF',
                      border: '2px solid #E2E8F0',
                      borderRadius: '12px',
                      color: '#1E293B',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27A7.054 7.054 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    {isGoogleLoading ? 'Đang kết nối Google...' : 'Đăng Nhập Với Tài Khoản Google'}
                  </button>

                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748B' }}>
                    🔒 <strong>Bảo mật gia đình:</strong> Phụ huynh đăng nhập 1 lần, hệ thống tự đồng bộ âm thầm mà không làm phiền bé học.
                  </div>
                </div>
              )}
            </div>

            {/* Đề Xuất Ôn Tập Thông Minh */}
            {(() => {
              const recommendations = storageService.getWeaknessRecommendations(progress, ALL_LESSONS);
              if (recommendations.length === 0) return null;
              return (
                <div className="parent-setting-section" style={{
                  background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                  border: '2px solid #FCD34D',
                  borderRadius: '16px',
                  padding: '18px 20px'
                }}>
                  <h3 style={{ margin: '0 0 4px 0', color: '#92400E' }}>
                    🎯 Đề Xuất Ôn Tập Thông Minh
                  </h3>
                  <p className="setting-desc" style={{ color: '#78350F' }}>
                    Hệ thống phát hiện {recommendations.length} bài bé cần củng cố thêm dựa trên câu trả lời sai:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                    {recommendations.map(({ lesson, wrongCount, score }) => (
                      <div
                        key={lesson.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          background: '#FFFFFF',
                          border: '1px solid #FDE68A',
                          borderRadius: '12px',
                          padding: '12px 14px',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '160px' }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E293B' }}>
                            {lesson.icon || '📚'} {lesson.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                            {wrongCount > 0 && (
                              <span style={{ color: '#DC2626', marginRight: '10px' }}>
                                ❌ {wrongCount} câu sai
                              </span>
                            )}
                            <span style={{ color: score >= 80 ? '#15803D' : '#B45309' }}>
                              Điểm: {score}%
                            </span>
                          </div>
                        </div>
                        {onStartReviewLesson && (
                          <button
                            style={{
                              padding: '8px 14px',
                              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                            }}
                            onClick={() => {
                              audioService.playPop();
                              onClose();
                              onStartReviewLesson(lesson);
                            }}
                          >
                            Ôn Bài Ngay 🎯
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Sao lưu ngoại tuyến dự phòng qua File JSON */}
            <div className="parent-setting-section">
              <h3>💾 Sao Lưu Dự Phòng Ngoại Tuyến (Offline Backup)</h3>
              <p className="setting-desc">Trường hợp không dùng mạng, phụ huynh có thể tải file sao lưu về máy tính hoặc chuyển file sang máy khác:</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                <button
                  style={{ padding: '9px 16px', background: '#10ac84', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    const mascot = storageService.getMascot();
                    firebaseSyncService.exportBackupFile(profile, progress, mascot);
                    audioService.playPop();
                  }}
                >
                  📤 Tải Bản Sao Lưu (JSON)
                </button>
                <label
                  style={{ padding: '9px 16px', background: '#4834d4', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  📥 Phục Hồi Từ File
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const pkg = await firebaseSyncService.importBackupFile(file);
                        if (onRestoreBackupData) {
                          onRestoreBackupData(pkg.profile, pkg.progress, pkg.mascot, pkg.customLessons || []);
                        } else {
                          onUpdateProfile(pkg.profile);
                        }
                        audioService.playSuccess();
                        setToastMessage('Đã phục hồi dữ liệu cho bé ' + pkg.profile.displayName + '!');
                        e.target.value = '';
                      } catch (err: any) {
                        setToastMessage('Lỗi phục hồi file: ' + err.message);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Cam kết bảo mật */}
            <div className="privacy-pledge-box">
              <strong>🔒 Cam Kết Không Thu Thập Thông Tin Nhạy Cảm</strong>
              <p>
                Hệ thống hoàn toàn KHÔNG thu thập họ tên thật, định vị GPS, camera hay dữ liệu cá nhân của con.
                Mọi dữ liệu tiến trình học được lưu trữ an toàn trên thiết bị và cơ sở dữ liệu bảo mật.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
