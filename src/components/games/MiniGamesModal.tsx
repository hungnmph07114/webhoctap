import React, { useState } from 'react';
import { Grade } from '../../types/curriculum';
import { audioService } from '../../services/audioService';
import { SpeedMathGame } from './SpeedMathGame';
import { MemoryCardsGame } from './MemoryCardsGame';
import { SpellingBeeGame } from './SpellingBeeGame';

interface MiniGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: Grade;
  onRewardClaimed: (stars: number, xp: number) => void;
}

export const MiniGamesModal: React.FC<MiniGamesModalProps> = ({
  isOpen,
  onClose,
  grade,
  onRewardClaimed
}) => {
  const [activeGame, setActiveGame] = useState<'hub' | 'speed_math' | 'memory_cards' | 'spelling_bee'>('hub');

  if (!isOpen) return null;

  const handleFinish = (stars: number, xp: number) => {
    onRewardClaimed(stars, xp);
    setActiveGame('hub');
  };

  return (
    <div className="mini-games-overlay">
      <div className={`mini-games-modal ${activeGame !== 'hub' ? 'in-game-mode' : ''}`}>
        {/* Top bar */}
        <div className="mini-games-topbar">
          <div className="topbar-title-wrap">
            <span className="topbar-icon">🎮</span>
            <h2 className="topbar-heading">
              {activeGame === 'speed_math'
                ? '🏎️ Đua Xe Phép Tính'
                : activeGame === 'memory_cards'
                ? '🎴 Lật Thẻ Trí Nhớ'
                : activeGame === 'spelling_bee'
                ? '🐝 Ong Tìm Chữ'
                : 'Khu Vui Chơi Mini-Games'}
            </h2>
          </div>
          <button
            className="btn-modal-close-apple"
            onClick={() => {
              audioService.playPop();
              setActiveGame('hub');
              onClose();
            }}
            title="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="mini-games-body">
          {activeGame === 'hub' && (
            <div className="games-hub-view">
              <p className="games-hub-intro">
                Vừa rèn luyện phản xạ tính toán, ghi nhớ từ vựng vừa kiếm thêm nhiều Sao ⭐ và kinh nghiệm XP cho chú Cú Bibo nhé!
              </p>

              <div className="games-cards-grid">
                {/* Game 1: Speed Math */}
                <div
                  className="game-choice-card card-speed-math"
                  onClick={() => {
                    audioService.playPop();
                    setActiveGame('speed_math');
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="game-card-icon">🏎️</div>
                  <div className="game-card-content">
                    <span className="game-card-badge">Toán Học Phản Xạ</span>
                    <h3 className="game-card-title">Đua Xe Phép Tính</h3>
                    <p className="game-card-desc">
                      Lái xe vượt chướng ngại vật bằng cách giải nhanh phép tính trong 45 giây! Phù hợp Lớp {grade}.
                    </p>
                    <div className="game-card-rewards">
                      <span>⭐ Thưởng đến 5 sao</span>
                      <span>🦉 +100 XP</span>
                    </div>
                  </div>
                  <button className="btn-play-game">Vào Chơi 🚀</button>
                </div>

                {/* Game 2: Memory Cards */}
                <div
                  className="game-choice-card card-memory-cards"
                  onClick={() => {
                    audioService.playPop();
                    setActiveGame('memory_cards');
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="game-card-icon">🎴</div>
                  <div className="game-card-content">
                    <span className="game-card-badge" style={{ background: '#E0E7FF', color: '#4338CA' }}>
                      Tiếng Anh & Ghi Nhớ
                    </span>
                    <h3 className="game-card-title">Lật Thẻ Trí Nhớ</h3>
                    <p className="game-card-desc">
                      Lật và ghép đúng cặp từ vựng Song Ngữ kèm giọng đọc chuẩn bản ngữ từ chú Cú Bibo!
                    </p>
                    <div className="game-card-rewards">
                      <span>⭐ Thưởng đến 5 sao</span>
                      <span>🦉 +80 XP</span>
                    </div>
                  </div>
                  <button className="btn-play-game">Vào Chơi 🚀</button>
                </div>

                {/* Game 3: Spelling Bee */}
                <div
                  className="game-choice-card card-spelling-bee"
                  onClick={() => {
                    audioService.playPop();
                    setActiveGame('spelling_bee');
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="game-card-icon">🐝</div>
                  <div className="game-card-content">
                    <span className="game-card-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>
                      Tiếng Anh &amp; Đánh Vần
                    </span>
                    <h3 className="game-card-title">Ong Tìm Chữ</h3>
                    <p className="game-card-desc">
                      Nghe chú ong đọc từ vựng rồi ghép đúng chữ cái! Luyện phản xạ đánh vần Tiếng Anh.
                    </p>
                    <div className="game-card-rewards">
                      <span>⭐ Thưởng đến 5 sao</span>
                      <span>🦉 +120 XP</span>
                    </div>
                  </div>
                  <button className="btn-play-game">Vào Chơi 🚀</button>
                </div>
              </div>
            </div>
          )}

          {activeGame === 'speed_math' && (
            <SpeedMathGame
              grade={grade}
              onFinishGame={handleFinish}
              onBack={() => setActiveGame('hub')}
            />
          )}

          {activeGame === 'memory_cards' && (
            <MemoryCardsGame
              onFinishGame={handleFinish}
              onBack={() => setActiveGame('hub')}
            />
          )}

          {activeGame === 'spelling_bee' && (
            <SpellingBeeGame
              onFinishGame={handleFinish}
              onBack={() => setActiveGame('hub')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
