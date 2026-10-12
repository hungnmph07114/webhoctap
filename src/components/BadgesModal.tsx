import React, { useState } from 'react';
import { ALL_BADGES, Badge } from '../types/gamification';
import { audioService } from '../services/audioService';

interface BadgesModalProps {
  unlockedBadgeIds: string[];
  isOpen: boolean;
  onClose: () => void;
}

type BadgeCategoryTab = 'all' | Badge['category'];

export const BadgesModal: React.FC<BadgesModalProps> = ({
  unlockedBadgeIds,
  isOpen,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategoryTab>('all');

  if (!isOpen) return null;

  const totalCount = ALL_BADGES.length;
  const unlockedCount = ALL_BADGES.filter(b => unlockedBadgeIds.includes(b.id)).length;
  const pct = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = selectedCategory === 'all'
    ? ALL_BADGES
    : ALL_BADGES.filter(b => b.category === selectedCategory);

  const CATEGORY_LABELS: { id: BadgeCategoryTab; label: string }[] = [
    { id: 'all', label: `Tất Cả (${totalCount})` },
    { id: 'learning', label: 'Học Tập 📚' },
    { id: 'streak', label: 'Chuỗi Ngày 🔥' },
    { id: 'pet', label: 'Thú Cưng 🦉' },
    { id: 'mastery', label: 'Kỹ Năng ⭐' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="badges-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close-modal" onClick={onClose}>
          ✕
        </button>

        <div className="badges-header">
          <h2>🎖️ Tủ Huy Hiệu Vinh Danh Của Bé</h2>
          <p>Thu thập đủ các huy hiệu rực rỡ bằng sự chăm chỉ và cố gắng mỗi ngày nhé!</p>

          {/* Thanh Tiến Độ Hoàn Thành Huy Hiệu */}
          <div className="badges-progress-wrap">
            <div className="badges-progress-info">
              <span>Tiến độ bộ sưu tập:</span>
              <strong>{unlockedCount}/{totalCount} Huy hiệu ({pct}%)</strong>
            </div>
            <div className="badges-progress-track">
              <div className="badges-progress-bar" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Tab Lọc Danh Mục */}
        <div className="badges-category-tabs">
          {CATEGORY_LABELS.map((tab) => (
            <button
              key={tab.id}
              className={`badge-tab-btn ${selectedCategory === tab.id ? 'active' : ''}`}
              onClick={() => {
                audioService.playPop();
                setSelectedCategory(tab.id);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lưới Huy Hiệu */}
        <div className="badges-grid-view">
          {filteredBadges.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`badge-item-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="badge-icon-wrap">
                  <span className="badge-emoji">{badge.icon}</span>
                  {!isUnlocked && <span className="lock-overlay">🔒</span>}
                </div>
                <h4 className="badge-title">{badge.title}</h4>
                <p className="badge-desc">{badge.description}</p>
                <span className={`badge-status-pill ${isUnlocked ? 'achieved' : 'pending'}`}>
                  {isUnlocked ? '✓ Đã Đạt Được' : 'Đang Cố Gắng'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
