import React, { useState, useEffect } from 'react';
import { UserProfile, LeaderboardEntry } from '../types/user';
import { AVATAR_OPTIONS } from '../types/user';
import { firebaseSyncService } from '../services/firebaseSyncService';
import { audioService } from '../services/audioService';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'myGrade'>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const filterGrade = activeTab === 'myGrade' ? profile.currentGrade : undefined;
        const list = await firebaseSyncService.fetchLeaderboard(profile, filterGrade);
        if (isMounted) {
          setEntries(list);
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('Lỗi tải bảng xếp hạng:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [isOpen, activeTab, profile]);

  if (!isOpen) return null;

  const getAvatarIcon = (avatarId: string) => {
    const found = AVATAR_OPTIONS.find(a => a.id === avatarId);
    return found ? found.icon : '🦉';
  };

  const top1 = entries[0];
  const top2 = entries[1];
  const top3 = entries[2];
  const restEntries = entries.slice(3);

  // Tìm thứ hạng của bé hiện tại
  const myRank = entries.findIndex(e => e.userId === profile.userId) + 1;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="parent-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button className="btn-close-modal" onClick={onClose}>✕</button>

        {/* Tiêu đề Đấu Trường Vinh Danh */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '4px' }}>🏆</span>
          <h2 style={{ fontSize: '24px', color: '#1E293B', margin: '0 0 6px 0', fontWeight: 800 }}>
            Bảng Vàng Thi Đua Tiểu Học
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
            Cùng Bibo và các bạn nhỏ thi đua tích lũy Ngôi Sao ⭐ & Chuỗi ngày học 🔥
          </p>
        </div>

        {/* Bộ Lọc Khối Lớp */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => {
              audioService.playPop();
              setActiveTab('all');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'all' ? '#ffffff' : 'transparent',
              color: activeTab === 'all' ? '#1E293B' : '#64748B',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === 'all' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            🌍 Toàn Trường (Lớp 1 - 5)
          </button>
          <button
            onClick={() => {
              audioService.playPop();
              setActiveTab('myGrade');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'myGrade' ? '#ffffff' : 'transparent',
              color: activeTab === 'myGrade' ? '#1E293B' : '#64748B',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === 'myGrade' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            🎓 Khối Của Bé (Lớp {profile.currentGrade})
          </button>
        </div>

        {/* Thẻ Vị Trí Hiện Tại Của Bé */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: '2px solid #F59E0B',
            borderRadius: '12px',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>{getAvatarIcon(profile.avatarId)}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ color: '#78350F', fontSize: '15px' }}>{profile.displayName}</strong>
                <span style={{ background: '#F59E0B', color: '#fff', fontSize: '11px', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>
                  Bạn
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#92400E' }}>
                Hạng hiện tại: <strong>#{myRank || '—'}</strong> • Lớp {profile.currentGrade}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#B45309' }}>
              ⭐ {profile.stars}
            </span>
            <div style={{ fontSize: '12px', color: '#78350F', fontWeight: 600 }}>
              🔥 {profile.currentStreak} ngày
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>⏳</span>
            Đang tải bảng vàng thi đua từ đám mây...
          </div>
        ) : (
          <div>
            {/* BỤC VINH DANH TOP 1 - TOP 2 - TOP 3 (PODIUM) */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '12px', marginBottom: '24px' }}>
              {/* TOP 2 BẠC */}
              {top2 && (
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '26px', marginBottom: '-6px' }}>🥈</div>
                  <div style={{ fontSize: '36px', marginBottom: '4px' }}>{getAvatarIcon(top2.avatarId)}</div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {top2.displayName}
                  </div>
                  <span style={{ color: '#475569', fontSize: '12px', fontWeight: 700 }}>⭐ {top2.stars}</span>
                  <div style={{ background: '#E2E8F0', height: '60px', borderRadius: '10px 10px 0 0', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#475569' }}>
                    #2
                  </div>
                </div>
              )}

              {/* TOP 1 VÀNG */}
              {top1 && (
                <div style={{ flex: 1.2, textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '-6px' }}>👑 🥇</div>
                  <div style={{ fontSize: '44px', marginBottom: '4px' }}>{getAvatarIcon(top1.avatarId)}</div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#B45309', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {top1.displayName}
                  </div>
                  <span style={{ color: '#D97706', fontSize: '14px', fontWeight: 800 }}>⭐ {top1.stars}</span>
                  <div style={{ background: 'linear-gradient(180deg, #FDE68A, #F59E0B)', height: '85px', borderRadius: '12px 12px 0 0', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '20px', color: '#78350F' }}>
                    #1
                  </div>
                </div>
              )}

              {/* TOP 3 ĐỒNG */}
              {top3 && (
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '26px', marginBottom: '-6px' }}>🥉</div>
                  <div style={{ fontSize: '36px', marginBottom: '4px' }}>{getAvatarIcon(top3.avatarId)}</div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {top3.displayName}
                  </div>
                  <span style={{ color: '#92400E', fontSize: '12px', fontWeight: 700 }}>⭐ {top3.stars}</span>
                  <div style={{ background: '#FED7AA', height: '45px', borderRadius: '10px 10px 0 0', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#9A3412' }}>
                    #3
                  </div>
                </div>
              )}
            </div>

            {/* DANH SÁCH THỨ HẠNG 4 - 30 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {restEntries.map((item, index) => {
                const rankNumber = index + 4;
                const isMe = item.userId === profile.userId;

                return (
                  <div
                    key={item.userId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: isMe ? '#FEF3C7' : '#F8FAFC',
                      border: isMe ? '2px solid #F59E0B' : '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#64748B', width: '28px' }}>
                        #{rankNumber}
                      </span>
                      <span style={{ fontSize: '24px' }}>{getAvatarIcon(item.avatarId)}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong style={{ fontSize: '14px', color: '#1E293B' }}>{item.displayName}</strong>
                          {isMe && (
                            <span style={{ background: '#F59E0B', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>
                              Bạn
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>
                          Lớp {item.currentGrade} • 🔥 Chuỗi {item.currentStreak} ngày • 🍗 Cấp {item.mascotLevel}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#D97706' }}>
                        ⭐ {item.stars}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
