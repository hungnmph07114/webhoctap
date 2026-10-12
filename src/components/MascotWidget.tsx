import React, { useState } from 'react';
import { MascotState, UserProfile } from '../types/user';
import { audioService } from '../services/audioService';
import { getMascotEvolution } from './AchievementCertificate';

interface MascotWidgetProps {
  mascot: MascotState;
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onFeedMascot: () => void;
  onBuyItem: (itemId: string, costGems: number) => void;
  onEquipItem: (slot: 'hat' | 'accessory', itemId: string | null) => void;
}

export interface WardrobeItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  type: 'hat' | 'accessory';
}

export const WARDROBE_ITEMS: WardrobeItem[] = [
  // Mũ
  { id: 'hat_grad', name: 'Mũ Cử Nhân', icon: '🎓', cost: 3, type: 'hat' },
  { id: 'hat_crown', name: 'Vương Miện', icon: '👑', cost: 5, type: 'hat' },
  { id: 'hat_cowboy', name: 'Mũ Cao Bồi', icon: '🤠', cost: 3, type: 'hat' },
  { id: 'hat_party', name: 'Mũ Lễ Hội', icon: '🥳', cost: 2, type: 'hat' },
  // Phụ kiện
  { id: 'acc_glasses', name: 'Kính Thông Thái', icon: '👓', cost: 2, type: 'accessory' },
  { id: 'acc_sunglasses', name: 'Kính Râm Ngầu', icon: '🕶️', cost: 3, type: 'accessory' },
  { id: 'acc_bow', name: 'Nơ Quý Tộc', icon: '🎀', cost: 2, type: 'accessory' },
  { id: 'acc_cape', name: 'Áo Choàng', icon: '🦸', cost: 4, type: 'accessory' }
];

const ENCOURAGING_QUOTES = [
  'Bé ơi, học thêm một bài học nữa cùng Bibo nhé!',
  'Hôm nay bé làm bài rất xuất sắc, Bibo rất tự hào về bé!',
  'Bibo thích ăn táo đỏ lắm, bé hãy làm đúng nhiều câu để thưởng cho Bibo nha!',
  'Nét chữ nết người - Bé nhớ nắn nót từng nét viết nha!',
  'Chăm chỉ mỗi ngày sẽ giúp bé trở thành thủ khoa đấy!'
];

export const MascotWidget: React.FC<MascotWidgetProps> = ({
  mascot,
  profile,
  isOpen,
  onClose,
  onFeedMascot,
  onBuyItem,
  onEquipItem
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'wardrobe'>('status');

  if (!isOpen) return null;

  const xpPercent = Math.min(100, Math.round((mascot.currentXp / mascot.xpToNextLevel) * 100));
  const equippedHatItem = WARDROBE_ITEMS.find((it) => it.id === mascot.equippedHat);
  const equippedAccItem = WARDROBE_ITEMS.find((it) => it.id === mascot.equippedAccessory);

  const currentHour = new Date().getHours();
  let mood: 'hungry' | 'sleepy' | 'excited' | 'happy' = 'happy';
  let moodText = 'Vui vẻ';
  let moodEmoji = '😊';

  if (mascot.hungerPercent < 30) {
    mood = 'hungry';
    moodText = 'Đang đói bụng';
    moodEmoji = '🤤';
  } else if (currentHour >= 21 || currentHour < 6) {
    mood = 'sleepy';
    moodText = 'Buồn ngủ';
    moodEmoji = '😴';
  } else if (mascot.hungerPercent >= 80) {
    mood = 'excited';
    moodText = 'Tràn đầy năng lượng!';
    moodEmoji = '⚡';
  }

  const handleTapMascot = () => {
    audioService.playPop();
    setIsBouncing(true);
    const nextIdx = (quoteIdx + 1) % ENCOURAGING_QUOTES.length;
    setQuoteIdx(nextIdx);
    audioService.speakVietnamese(ENCOURAGING_QUOTES[nextIdx]);
    setTimeout(() => setIsBouncing(false), 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="mascot-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose}>
          ✕
        </button>

        <div className="mascot-room-header">
          <h2>🏡 Phòng Thú Cưng Của Bé</h2>
          <p>Chăm sóc chú Cú Bibo thông thái để cùng nhau lớn khôn!</p>
        </div>

        {/* Khu vực nhân vật Bibo */}
        <div className="mascot-avatar-area">
          {/* Bong bóng trò chuyện với tâm trạng */}
          <div 
            className={`mascot-speech-bubble mood-${mood}`} 
            onClick={handleTapMascot} 
            style={{ cursor: 'pointer' }}
            title="Bấm để Bibo nói câu khác"
          >
            <span>💬 "{ENCOURAGING_QUOTES[quoteIdx]}" 🔊</span>
          </div>

          <div className={`mascot-care-indicator ${mascot.hungerPercent < 30 ? 'hungry' : 'happy'}`}>
            <span>{moodEmoji}</span>
            <span>Tâm trạng: {moodText} • No bụng: {mascot.hungerPercent}%</span>
          </div>

          {/* Linh vật Bibo với trang phục đã trang bị */}
          <div
            className={`mascot-big-emoji ${isBouncing ? 'bounce-active' : ''}`}
            onClick={handleTapMascot}
            title="Bấm vào Bibo để trò chuyện và nghe giọng nói"
            style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
          >
            {equippedHatItem && (
              <span
                style={{
                  position: 'absolute',
                  top: '-24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '44px',
                  zIndex: 2,
                  animation: 'floatSlow 2s ease-in-out infinite'
                }}
              >
                {equippedHatItem.icon}
              </span>
            )}
            🦉
            {equippedAccItem && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  right: '-10px',
                  fontSize: '36px',
                  zIndex: 2
                }}
              >
                {equippedAccItem.icon}
              </span>
            )}
          </div>
          <span className="mascot-tap-hint">👉 Chạm vào Bibo để nghe giọng nói dặn dò!</span>
        </div>

        {/* Thanh chuyển tab: Thông tin Bibo & Tủ đồ phụ kiện */}
        {/* Thanh chuyển tab: Thông tin Bibo & Tủ đồ phụ kiện - Apple Segmented Control */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.05)', padding: '5px', borderRadius: '14px', marginBottom: '18px' }}>
          <button
            style={{
              flex: 1,
              padding: '10px 14px',
              background: activeTab === 'status' ? '#ffffff' : 'transparent',
              color: activeTab === 'status' ? '#1E293B' : '#64748B',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: activeTab === 'status' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
            onClick={() => {
              audioService.playPop();
              setActiveTab('status');
            }}
          >
            🍗 Trạng Thái & Cho Ăn
          </button>
          <button
            style={{
              flex: 1,
              padding: '10px 14px',
              background: activeTab === 'wardrobe' ? '#ffffff' : 'transparent',
              color: activeTab === 'wardrobe' ? '#1E293B' : '#64748B',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: activeTab === 'wardrobe' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
            onClick={() => {
              audioService.playPop();
              setActiveTab('wardrobe');
            }}
          >
            🎩 Tủ Đồ (💎 {profile.gems})
          </button>
        </div>

        {activeTab === 'status' ? (
          <>
            <div className="mascot-stats-panel">
              <div className="mascot-name-level">
                <h3 className="mascot-name">{mascot.name}</h3>
                <span className="mascot-level-badge">Cấp Độ {mascot.level}</span>
              </div>

              {/* Thanh Kinh Nghiệm XP */}
              <div className="progress-group">
                <div className="progress-label">
                  <span>🌟 Kinh Nghiệm Lên Cấp</span>
                  <span>{mascot.currentXp} / {mascot.xpToNextLevel} XP ({xpPercent}%)</span>
                </div>
                <div className="progress-track">
                  <div className="progress-bar-xp" style={{ width: `${xpPercent}%` }} />
                </div>
              </div>

              {/* Thanh No / Năng Lượng */}
              <div className="progress-group">
                <div className="progress-label">
                  <span>🍗 Độ No Bụng</span>
                  <span>{mascot.hungerPercent}%</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-bar-hunger"
                    style={{
                      width: `${mascot.hungerPercent}%`,
                      backgroundColor: mascot.hungerPercent > 40 ? '#10AC84' : '#EE5253'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tiến Hóa Bibo */}
            {(() => {
              const evo = getMascotEvolution(mascot.level);
              const MILESTONES = [1, 3, 5, 8];
              const nextMilestone = MILESTONES.find(m => m > mascot.level) || null;
              return (
                <div style={{
                  background: evo.aura,
                  border: '2px solid rgba(245,158,11,0.4)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  marginBottom: '14px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#92400E', letterSpacing: '2px', marginBottom: '6px' }}>
                    🔮 GIAI ĐOẠN TIẾN HÓA
                  </div>
                  <div style={{ fontSize: '40px', marginBottom: '4px' }}>{evo.emoji}</div>
                  <div style={{ fontWeight: 900, fontSize: '16px', color: '#1E293B', marginBottom: '4px' }}>
                    {evo.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: nextMilestone ? '10px' : 0 }}>
                    {evo.description}
                  </div>
                  {nextMilestone && (
                    <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 600 }}>
                      🚀 Đến Level {nextMilestone} để Bibo tiến hóa lên hình thái tiếp theo!
                    </div>
                  )}
                </div>
              );
            })()}



            <div className="mascot-actions">
              <button
                className="btn-feed-mascot"
                disabled={profile.stars < 5}
                onClick={() => {
                  audioService.playCoin();
                  onFeedMascot();
                }}
              >
                <span className="feed-icon">🍎</span>
                <div className="feed-text">
                  <strong>Cho Bibo Ăn Táo (+25% No, +15 XP)</strong>
                  <small>Chi phí: 5 ⭐ (Hiện có: {profile.stars} ⭐)</small>
                </div>
              </button>
            </div>

          </>
        ) : (
          /* TAB TỦ ĐỒ VÀ PHỤ KIỆN */
          <div className="mascot-wardrobe-panel" style={{ maxHeight: '280px', overflowY: 'auto' }}>
            <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 12px 0' }}>
              Dùng <strong>Kim Cương 💎</strong> (nhận khi đạt 100 điểm bài thi) để sắm mũ và phụ kiện siêu ngầu cho Bibo!
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
              {WARDROBE_ITEMS.map((item) => {
                const isUnlocked = mascot.unlockedItems?.includes(item.id);
                const isEquipped = mascot.equippedHat === item.id || mascot.equippedAccessory === item.id;
                const canAfford = profile.gems >= item.cost;

                return (
                  <div
                    key={item.id}
                    style={{
                      border: isEquipped ? '2px solid #10AC84' : '1px solid #e2e8f0',
                      background: isEquipped ? '#E8F8F5' : '#ffffff',
                      borderRadius: '12px',
                      padding: '10px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{item.icon}</span>
                    <strong style={{ fontSize: '13px', color: '#2d3748' }}>{item.name}</strong>
                    
                    {isUnlocked ? (
                      <button
                        style={{
                          marginTop: '4px',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          background: isEquipped ? '#10AC84' : '#edf2f7',
                          color: isEquipped ? '#ffffff' : '#4a5568'
                        }}
                        onClick={() => {
                          audioService.playPop();
                          if (isEquipped) {
                            onEquipItem(item.type, null);
                          } else {
                            onEquipItem(item.type, item.id);
                          }
                        }}
                      >
                        {isEquipped ? '✓ Đang Mặc' : 'Mặc Ngay'}
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        style={{
                          marginTop: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          borderRadius: '8px',
                          border: 'none',
                          cursor: canAfford ? 'pointer' : 'not-allowed',
                          background: canAfford ? '#6C5CE7' : '#cbd5e0',
                          color: '#ffffff'
                        }}
                        onClick={() => {
                          audioService.playCoin();
                          onBuyItem(item.id, item.cost);
                        }}
                      >
                        Mua 💎 {item.cost}
                      </button>
                    )}
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
