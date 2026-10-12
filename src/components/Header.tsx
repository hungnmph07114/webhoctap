import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, MascotState } from '../types/user';
import { audioService } from '../services/audioService';

import { WARDROBE_ITEMS } from './MascotWidget';

import { firebaseSyncService, SyncStatus } from '../services/firebaseSyncService';

interface HeaderProps {
  profile: UserProfile;
  mascot: MascotState;
  syncStatus?: SyncStatus;
  onOpenParentGate: () => void;
  onOpenBadges: () => void;
  onOpenMascot: () => void;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenMiniGames: () => void;
  onInstallApp?: () => void;
  canInstall?: boolean;
  onBuyStreakShield?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  mascot,
  syncStatus = 'synced',
  onOpenParentGate,
  onOpenBadges,
  onOpenMascot,
  onOpenProfile,
  onOpenLeaderboard,
  soundEnabled,
  onToggleSound,
  onOpenMiniGames,
  onInstallApp,
  canInstall = false,
  onBuyStreakShield
}) => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ email: string | null; name: string | null } | null>(
    firebaseSyncService.getGoogleUser()
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const equippedHatItem = WARDROBE_ITEMS.find((it) => it.id === mascot.equippedHat);

  useEffect(() => {
    return firebaseSyncService.subscribeGoogleUser((info) => {
      setGoogleUser(info);
    });
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const syncDot = syncStatus === 'synced' ? '#22C55E'
    : syncStatus === 'syncing' ? '#F59E0B'
    : syncStatus === 'offline' ? '#94A3B8'
    : '#EF4444';

  const syncLabel = syncStatus === 'synced' ? '☁️ Đã lưu'
    : syncStatus === 'syncing' ? '🔄 Đang lưu...'
    : syncStatus === 'offline' ? '📶 Ngoại tuyến'
    : '⚠️ Cục bộ';

  const xpPct = mascot.xpToNextLevel > 0
    ? Math.max(4, Math.min(100, Math.round((mascot.currentXp / mascot.xpToNextLevel) * 100)))
    : 0;

  return (
    <header className="app-header">
      {/* ===== LEFT: Brand + Profile ===== */}
      <div className="header-left">
        <button
          className="header-brand-btn"
          onClick={() => { audioService.playPop(); onOpenMascot(); }}
          title="Phòng thú cưng Bibo"
        >
          <span className="header-mascot-emoji" style={{ position: 'relative', display: 'inline-flex' }}>
            {equippedHatItem && (
              <span style={{ position: 'absolute', top: '-10px', left: '-2px', fontSize: '13px' }}>
                {equippedHatItem.icon}
              </span>
            )}
            🦉
          </span>
          <div className="header-brand-text">
            <span className="header-student-name">{profile.displayName}</span>
            <span className="header-grade-line">
              Lớp {profile.currentGrade}
              <span
                className="header-sync-dot"
                style={{ background: syncDot }}
                title={googleUser ? `${syncLabel} · Google: ${googleUser.email}` : syncLabel}
              />
            </span>
          </div>
        </button>

        {onOpenProfile && (
          <button
            className="header-switch-btn"
            onClick={() => { audioService.playPop(); onOpenProfile(); }}
            title="Đổi tài khoản bé"
          >
            👤
          </button>
        )}
      </div>

      {/* ===== CENTER: Key Stats ===== */}
      <div className="header-stats">
        <div className="stat-pill streak-pill" title={`Chuỗi ${profile.currentStreak} ngày`}>
          <span className="fire-animated">🔥</span>
          <span className="stat-value">{profile.currentStreak}</span>
        </div>

        {/* Khiên bảo vệ chuỗi ngày học */}
        <button
          className="stat-pill shield-pill"
          onClick={() => {
            audioService.playPop();
            if (onBuyStreakShield) onBuyStreakShield();
          }}
          title={`Khiên bảo vệ chuỗi: ${profile.streakFreezeCount || 0}/2 khiên. Bấm để đổi thêm bằng 50 ⭐`}
          style={{ cursor: 'pointer' }}
        >
          <span>🛡️</span>
          <span className="stat-value">{profile.streakFreezeCount || 0}</span>
        </button>

        <div className="stat-pill star-pill" title="Tổng sao đạt được">
          <span>⭐</span>
          <span className="stat-value">{profile.stars}</span>
        </div>

        <div className="stat-pill gem-pill" title="Kim cương">
          <span>💎</span>
          <span className="stat-value">{profile.gems}</span>
        </div>

        <button
          className="stat-pill mascot-pill"
          onClick={() => { audioService.playPop(); onOpenMascot(); }}
          title={`Bibo Cấp ${mascot.level} · ${mascot.currentXp}/${mascot.xpToNextLevel} XP`}
        >
          <span>🍗</span>
          <span className="stat-value">Cấp {mascot.level}</span>
        </button>
      </div>

      {/* ===== RIGHT: Actions ===== */}
      <div className="header-actions">
        {/* Nút Mini-Games */}
        <button
          className="btn-icon-header btn-mini-games-header"
          onClick={() => { audioService.playPop(); onOpenMiniGames(); }}
          title="Khu vui chơi Mini-Games"
        >
          🎮
        </button>

        {/* Nút Cài đặt App (PWA) nếu có thể cài */}
        {canInstall && onInstallApp && (
          <button
            className="btn-icon-header btn-pwa-install-header"
            onClick={() => { audioService.playPop(); onInstallApp(); }}
            title="Cài đặt ứng dụng về máy"
          >
            📲
          </button>
        )}

        <button
          className={`btn-icon-header ${soundEnabled ? 'sound-on' : 'sound-off'}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* Dropdown Menu — Bảng vàng, Huy hiệu */}
        <div className="header-menu-wrap" ref={menuRef}>
          <button
            className="btn-icon-header"
            onClick={() => { audioService.playPop(); setMenuOpen((v) => !v); }}
            title="Thêm"
            aria-expanded={menuOpen}
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="header-dropdown">
              <button
                className="header-dropdown-item"
                onClick={() => { audioService.playPop(); setMenuOpen(false); onOpenMiniGames(); }}
              >
                🎮 Mini-Games
              </button>
              <button
                className="header-dropdown-item mobile-menu-sound"
                onClick={() => { audioService.playPop(); setMenuOpen(false); onToggleSound(); }}
              >
                {soundEnabled ? '🔇 Tắt âm thanh' : '🔊 Bật âm thanh'}
              </button>
              {onOpenLeaderboard && (
                <button
                  className="header-dropdown-item"
                  onClick={() => { audioService.playPop(); setMenuOpen(false); onOpenLeaderboard(); }}
                >
                  🏆 Bảng Vàng
                </button>
              )}
              <button
                className="header-dropdown-item"
                onClick={() => { audioService.playPop(); setMenuOpen(false); onOpenBadges(); }}
              >
                🏅 Huy Hiệu
              </button>
              <button
                className="header-dropdown-item"
                onClick={() => {
                  audioService.playPop();
                  setMenuOpen(false);
                  if (onBuyStreakShield) onBuyStreakShield();
                }}
              >
                🛡️ Khiên Bảo Vệ ({profile.streakFreezeCount || 0}/2)
              </button>
              {canInstall && onInstallApp && (
                <button
                  className="header-dropdown-item"
                  onClick={() => { audioService.playPop(); setMenuOpen(false); onInstallApp(); }}
                  style={{ color: '#059669', fontWeight: 700 }}
                >
                  📲 Cài Đặt App
                </button>
              )}
            </div>
          )}
        </div>


        {/* Nút Phụ Huynh: gộp trạng thái Google Login vào trong */}
        <button
          className={`btn-parent-gate${googleUser ? ' btn-parent-gate--linked' : ''}`}
          onClick={() => { audioService.playPop(); onOpenParentGate(); }}
          title={googleUser ? `Phụ huynh · Google: ${googleUser.email}` : 'Cổng phụ huynh & Cài đặt'}
        >
          {googleUser ? (
            <span className="parent-gate-avatar">
              {(googleUser.name || googleUser.email || 'G')[0].toUpperCase()}
            </span>
          ) : (
            <span className="lock-icon">🔒</span>
          )}
          <span className="parent-text">
            {googleUser
              ? (googleUser.name ? googleUser.name.split(' ').slice(-1)[0] : 'Phụ Huynh')
              : 'Phụ Huynh'}
          </span>
          {googleUser && <span className="parent-gate-cloud">☁️</span>}
        </button>
      </div>

      {/* ===== XP BAR ===== */}
      {xpPct > 0 && (
        <div
          className="header-xp-bar-wrap"
          title={`Bibo XP: ${mascot.currentXp}/${mascot.xpToNextLevel} (${xpPct}%)`}
        >
          <div className="header-xp-bar-fill" style={{ width: `${xpPct}%` }} />
        </div>
      )}
    </header>
  );
};
