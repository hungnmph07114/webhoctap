import React, { useState } from 'react';
import { UserProfile } from '../types/user';
import { Grade } from '../types/curriculum';
import { AVATAR_OPTIONS } from '../types/user';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';

interface ProfileModalProps {
  isOpen: boolean;
  currentProfile: UserProfile;
  onClose: () => void;
  onSwitchProfile: (userId: string) => void;
  onProfileCreated: (newProfile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  currentProfile,
  onClose,
  onSwitchProfile,
  onProfileCreated
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [selectedAvatarId, setSelectedAvatarId] = useState('owl_avatar');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (!isOpen) {
      setIsCreatingNew(false);
      setNameInput('');
      setSelectedGrade(1);
      setSelectedAvatarId('owl_avatar');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allProfiles = storageService.getAllProfiles();

  const handleCreateKid = () => {
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setErrorMsg('Vui lòng nhập tên thân mật của bé (Ví dụ: Bé Bắp)!');
      return;
    }

    try {
      const newKid = storageService.createKidProfile(trimmedName, selectedGrade, selectedAvatarId);
      audioService.playSuccess();
      onProfileCreated(newKid);
      setIsCreatingNew(false);
      setNameInput('');
      setSelectedGrade(1);
      setSelectedAvatarId('owl_avatar');
      setErrorMsg('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể tạo hồ sơ bé mới';
      setErrorMsg(message);
    }
  };

  const getAvatarIcon = (avatarId: string) => {
    const found = AVATAR_OPTIONS.find(a => a.id === avatarId);
    return found ? found.icon : '🦉';
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="parent-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <button className="btn-close-modal" onClick={onClose}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '42px', display: 'block', marginBottom: '6px' }}>
            {isCreatingNew ? '✨' : '👨‍👩‍👧‍👦'}
          </span>
          <h2 style={{ fontSize: '22px', color: '#1E293B', margin: '0 0 6px 0' }}>
            {isCreatingNew ? 'Thêm Hồ Sơ Bé Mới' : 'Chọn Tài Khoản Bé Học'}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            {isCreatingNew 
              ? 'Tạo riêng góc học tập cho bé với số sao và thú cưng độc lập'
              : 'Gia đình có nhiều bé có thể chuyển đổi hồ sơ nhanh chóng'}
          </p>
        </div>

        {!isCreatingNew ? (
          <div>
            {/* Danh sách các bé trong gia đình */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {allProfiles.map((p) => {
                const isCurrent = p.userId === currentProfile.userId;
                return (
                  <div
                    key={p.userId}
                    onClick={() => {
                      if (!isCurrent) {
                        audioService.playPop();
                        onSwitchProfile(p.userId);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: isCurrent ? '2px solid #2563EB' : '1px solid #E2E8F0',
                      background: isCurrent ? '#EFF6FF' : '#ffffff',
                      cursor: isCurrent ? 'default' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '32px' }}>{getAvatarIcon(p.avatarId)}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '16px', color: '#1E293B' }}>{p.displayName}</strong>
                          {isCurrent && (
                            <span style={{ background: '#2563EB', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                              Đang học
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                          Khối Lớp {p.currentGrade} • ⭐ {p.stars} Sao • 💎 {p.gems} Kim cương • 🔥 {p.currentStreak} ngày
                        </p>
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        style={{
                          padding: '6px 14px',
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '13px',
                          color: '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        Chọn bé
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Nút thêm bé mới */}
            <button
              onClick={() => {
                audioService.playPop();
                setIsCreatingNew(true);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#4F46E5',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>➕ Thêm Bé Mới (Tài Khoản Thứ 2, 3...)</span>
            </button>
          </div>
        ) : (
          /* Form Tạo Bé Mới */
          <div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Tên bé hoặc biệt danh dễ thương:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Bé Nhím, Bin Bướng Bỉnh, My My..."
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setErrorMsg('');
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '15px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Bé đang học Lớp mấy?
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrade(g as Grade)}
                    style={{
                      flex: 1,
                      padding: '8px 0',
                      borderRadius: '8px',
                      border: selectedGrade === g ? '2px solid #4F46E5' : '1px solid #CBD5E1',
                      background: selectedGrade === g ? '#EEF2FF' : '#ffffff',
                      color: selectedGrade === g ? '#4F46E5' : '#475569',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Lớp {g}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Chọn hình đại diện con vật yêu thích:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {AVATAR_OPTIONS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedAvatarId(a.id)}
                    style={{
                      padding: '8px 6px',
                      borderRadius: '10px',
                      border: selectedAvatarId === a.id ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                      background: selectedAvatarId === a.id ? '#EEF2FF' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '26px' }}>{a.icon}</span>
                    <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>{a.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <p style={{ color: '#DC2626', fontSize: '13px', marginBottom: '12px', fontWeight: 600 }}>
                ⚠️ {errorMsg}
              </p>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleCreateKid}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#10AC84',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ✓ Hoàn Tất & Bắt Đầu Học
              </button>
              <button
                onClick={() => setIsCreatingNew(false)}
                style={{
                  padding: '12px 18px',
                  background: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Quay lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
