import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audioService } from '../../services/audioService';

interface MemoryCardsGameProps {
  onFinishGame: (earnedStars: number, earnedXp: number, moves: number) => void;
  onBack: () => void;
}

interface CardItem {
  id: string;
  pairId: string;
  text: string;
  subText?: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  lang?: 'en' | 'vi';
}

const VOCAB_POOL = [
  { pairId: 'apple', en: 'Apple', vi: 'Quả Táo', emoji: '🍎' },
  { pairId: 'dog', en: 'Dog', vi: 'Chú Chó', emoji: '🐶' },
  { pairId: 'cat', en: 'Cat', vi: 'Bé Mèo', emoji: '🐱' },
  { pairId: 'sun', en: 'Sun', vi: 'Mặt Trời', emoji: '☀️' },
  { pairId: 'book', en: 'Book', vi: 'Quyển Sách', emoji: '📖' },
  { pairId: 'car', en: 'Car', vi: 'Xe Ô Tô', emoji: '🚗' },
  { pairId: 'tree', en: 'Tree', vi: 'Cây Xanh', emoji: '🌳' },
  { pairId: 'fish', en: 'Fish', vi: 'Con Cá', emoji: '🐟' }
];

function generateCards(): CardItem[] {
  // Select 6 random pairs
  const selectedPairs = [...VOCAB_POOL].sort(() => Math.random() - 0.5).slice(0, 6);
  const cards: CardItem[] = [];

  selectedPairs.forEach((pair) => {
    // English card
    cards.push({
      id: `${pair.pairId}_en`,
      pairId: pair.pairId,
      text: pair.en,
      subText: 'English',
      emoji: pair.emoji,
      isFlipped: false,
      isMatched: false,
      lang: 'en'
    });
    // Vietnamese card
    cards.push({
      id: `${pair.pairId}_vi`,
      pairId: pair.pairId,
      text: pair.vi,
      subText: 'Tiếng Việt',
      emoji: pair.emoji,
      isFlipped: false,
      isMatched: false,
      lang: 'vi'
    });
  });

  return cards.sort(() => Math.random() - 0.5);
}

export const MemoryCardsGame: React.FC<MemoryCardsGameProps> = ({ onFinishGame, onBack }) => {
  const [cards, setCards] = useState<CardItem[]>(() => generateCards());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Timer
  useEffect(() => {
    if (isWon) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isWon]);

  // Check win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      setIsWon(true);
      audioService.playSuccess();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    }
  }, [cards]);

  const handleCardClick = (index: number) => {
    if (isLocked || isWon) return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;

    audioService.playPop();

    // Read English pronunciation
    if (card.lang === 'en') {
      audioService.speakEnglish(card.text);
    }

    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c)));

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsLocked(true);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        setTimeout(() => {
          audioService.playCoin();
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 400);
      } else {
        // Not matched
        setTimeout(() => {
          audioService.playWrong();
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFinish = () => {
    const earnedStars = moves <= 8 ? 5 : moves <= 12 ? 4 : 3;
    const earnedXp = Math.max(30, 80 - moves * 2);
    onFinishGame(earnedStars, earnedXp, moves);
  };

  if (isWon) {
    const earnedStars = moves <= 8 ? 5 : moves <= 12 ? 4 : 3;
    const earnedXp = Math.max(30, 80 - moves * 2);

    return (
      <div className="game-over-screen">
        <div className="game-over-trophy">🎉</div>
        <h2 className="game-over-title">Trí Nhớ Siêu Phàm!</h2>
        <p className="game-over-subtitle">Bé đã tìm đúng tất cả cặp từ vựng Song Ngữ!</p>

        <div className="game-stats-grid">
          <div className="game-stat-card">
            <span className="stat-label">Thời Gian</span>
            <span className="stat-value">⏱ {formatTime(seconds)}</span>
          </div>
          <div className="game-stat-card">
            <span className="stat-label">Số Lượt Lật</span>
            <span className="stat-value">🎯 {moves} lượt</span>
          </div>
          <div className="game-stat-card">
            <span className="stat-label">Phần Thưởng</span>
            <span className="stat-value" style={{ color: '#F59E0B' }}>
              +{earnedStars}⭐ · +{earnedXp} XP
            </span>
          </div>
        </div>

        <div className="game-actions">
          <button
            className="btn-game-replay"
            onClick={() => {
              setCards(generateCards());
              setFlippedIndices([]);
              setMoves(0);
              setSeconds(0);
              setIsWon(false);
            }}
          >
            🔄 Chơi Ván Mới
          </button>
          <button className="btn-game-claim" onClick={handleFinish}>
            🎁 Nhận Thưởng & Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-cards-game">
      {/* Header bar */}
      <div className="game-header-bar">
        <button className="btn-game-back" onClick={onBack}>
          ← Thoát
        </button>
        <div className="game-timer-pill">
          ⏱ <strong>{formatTime(seconds)}</strong>
        </div>
        <div className="game-score-pill">
          🎯 Lượt lật: <strong>{moves}</strong>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="memory-grid">
        {cards.map((card, idx) => {
          const isOpen = card.isFlipped || card.isMatched;

          return (
            <div
              key={card.id}
              className={`memory-card-wrap ${isOpen ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => handleCardClick(idx)}
            >
              <div className="memory-card-inner">
                {/* Back side (hidden) */}
                <div className="card-face card-back">
                  <span className="card-back-icon">🦉</span>
                  <span className="card-back-pattern">★</span>
                </div>

                {/* Front side (revealed) */}
                <div className="card-face card-front">
                  <span className="card-emoji">{card.emoji}</span>
                  <span className="card-text">{card.text}</span>
                  <span className="card-subtext">{card.subText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="game-hint-sub">Hãy lật và ghép đúng cặp từ tiếng Anh cùng nghĩa tiếng Việt nhé!</p>
    </div>
  );
};
