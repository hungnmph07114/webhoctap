import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Grade } from '../../types/curriculum';
import { audioService } from '../../services/audioService';

interface SpeedMathGameProps {
  grade: Grade;
  onFinishGame: (earnedStars: number, earnedXp: number, score: number) => void;
  onBack: () => void;
}

interface MathProblem {
  question: string;
  options: number[];
  answer: number;
}

function generateProblem(grade: Grade): MathProblem {
  let a = 0;
  let b = 0;
  let op = '+';
  let answer = 0;

  if (grade === 1) {
    op = Math.random() > 0.5 ? '+' : '-';
    if (op === '+') {
      a = Math.floor(Math.random() * 9) + 1;
      b = Math.floor(Math.random() * 9) + 1;
      answer = a + b;
    } else {
      a = Math.floor(Math.random() * 10) + 5;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
    }
  } else if (grade === 2 || grade === 3) {
    const ops = ['+', '-', 'x'];
    op = ops[Math.floor(Math.random() * ops.length)];
    if (op === 'x') {
      a = Math.floor(Math.random() * 8) + 2;
      b = Math.floor(Math.random() * 9) + 1;
      answer = a * b;
    } else if (op === '+') {
      a = Math.floor(Math.random() * 40) + 10;
      b = Math.floor(Math.random() * 40) + 10;
      answer = a + b;
    } else {
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * 20) + 5;
      answer = a - b;
    }
  } else {
    // Grade 4-5
    const ops = ['x', ':', '+', '-'];
    op = ops[Math.floor(Math.random() * ops.length)];
    if (op === ':') {
      b = Math.floor(Math.random() * 8) + 2;
      const quotient = Math.floor(Math.random() * 10) + 2;
      a = b * quotient;
      answer = quotient;
    } else if (op === 'x') {
      a = Math.floor(Math.random() * 12) + 4;
      b = Math.floor(Math.random() * 12) + 3;
      answer = a * b;
    } else if (op === '+') {
      a = Math.floor(Math.random() * 80) + 20;
      b = Math.floor(Math.random() * 80) + 20;
      answer = a + b;
    } else {
      a = Math.floor(Math.random() * 100) + 30;
      b = Math.floor(Math.random() * 50) + 10;
      answer = a - b;
    }
  }

  // Generate 2 distinct distractors (with safety limit to avoid infinite loop)
  const distractors = new Set<number>();
  let attempts = 0;
  while (distractors.size < 2 && attempts < 40) {
    attempts++;
    const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
    const candidate = answer + offset;
    if (candidate >= 0 && candidate !== answer) {
      distractors.add(candidate);
    }
  }
  // Fallback: deterministic distractors when random generation fails (e.g., answer near 0)
  if (distractors.size < 2) {
    for (let d = 1; distractors.size < 2; d++) {
      if (answer + d !== answer) distractors.add(answer + d);
    }
  }

  const options = [answer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

  return {
    question: `${a} ${op === 'x' ? '×' : op === ':' ? '÷' : op} ${b} = ?`,
    options,
    answer
  };
}

export const SpeedMathGame: React.FC<SpeedMathGameProps> = ({ grade, onFinishGame, onBack }) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<MathProblem>(() => generateProblem(grade));
  const [selectedLane, setSelectedLane] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isGameOver, setIsGameOver] = useState(false);
  const [carPosition, setCarPosition] = useState(1); // 0 = Left, 1 = Center, 2 = Right

  const isGameOverRef = useRef(false);
  isGameOverRef.current = isGameOver;

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsGameOver(true);
      audioService.playSuccess();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (index: number, val: number) => {
    if (isGameOver || feedback !== 'idle') return;

    setSelectedLane(index);
    setCarPosition(index);

    if (val === currentProblem.answer) {
      // Correct!
      audioService.playPop();
      setFeedback('correct');
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((m) => Math.max(m, nextCombo));
      const points = 10 + nextCombo * 2;
      setScore((s) => s + points);

      if (nextCombo % 5 === 0) {
        audioService.playCoin();
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      }

      setTimeout(() => {
        setFeedback('idle');
        setSelectedLane(null);
        setCurrentProblem(generateProblem(grade));
      }, 400);
    } else {
      // Wrong!
      audioService.playWrong();
      setFeedback('wrong');
      setCombo(0);

      setTimeout(() => {
        setFeedback('idle');
        setSelectedLane(null);
      }, 500);
    }
  };

  const calculateRewards = (s: number) => {
    const earnedStars = s >= 120 ? 5 : s >= 80 ? 4 : s >= 40 ? 3 : s >= 20 ? 2 : s > 0 ? 1 : 0;
    const earnedXp = Math.round(s * 0.8);
    return { earnedStars, earnedXp };
  };

  const handleFinish = () => {
    const { earnedStars, earnedXp } = calculateRewards(score);
    onFinishGame(earnedStars, earnedXp, score);
  };

  if (isGameOver) {
    const { earnedStars, earnedXp } = calculateRewards(score);

    return (
      <div className="game-over-screen">
        <div className="game-over-trophy">🏁</div>
        <h2 className="game-over-title">Về Đích Thành Công!</h2>
        <p className="game-over-subtitle">Chú Cú Bibo đã phóng hết mình trên đường đua!</p>

        <div className="game-stats-grid">
          <div className="game-stat-card">
            <span className="stat-label">Điểm Số</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="game-stat-card">
            <span className="stat-label">Combo Tối Đa</span>
            <span className="stat-value">🔥 {maxCombo}x</span>
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
              setTimeLeft(45);
              setScore(0);
              setCombo(0);
              setMaxCombo(0);
              setIsGameOver(false);
              setFeedback('idle');
              setCurrentProblem(generateProblem(grade));
            }}
          >
            🔄 Đua Lại Lần Nữa
          </button>
          <button className="btn-game-claim" onClick={handleFinish}>
            🎁 Nhận Thưởng & Về Trang Chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="speed-math-game">
      {/* Game Header Bar */}
      <div className="game-header-bar">
        <button className="btn-game-back" onClick={onBack}>
          ← Thoát
        </button>
        <div className="game-timer-pill">
          ⏰ <strong>{timeLeft}s</strong>
        </div>
        <div className="game-score-pill">
          🏎️ Điểm: <strong>{score}</strong>
        </div>
        {combo > 1 && (
          <div className="game-combo-pill">
            🔥 Combo <strong>{combo}x</strong>
          </div>
        )}
      </div>

      {/* Race Track Arena */}
      <div className="racer-arena">
        {/* Road Stripes */}
        <div className="road-surface">
          <div className="lane-divider divider-1" />
          <div className="lane-divider divider-2" />

          {/* Question Banner in Sky */}
          <div className="race-question-box">
            <span className="question-text">{currentProblem.question}</span>
          </div>

          {/* Racer Mascot Car */}
          <div className={`racer-car lane-${carPosition} ${feedback}`}>
            <span className="car-body">🏎️</span>
            <span className="car-driver">🦉</span>
            {feedback === 'correct' && <span className="turbo-flame">🔥</span>}
          </div>
        </div>
      </div>

      {/* 3 Answer Lanes Buttons */}
      <div className="lanes-selection-area">
        {currentProblem.options.map((option, idx) => {
          const isSelected = selectedLane === idx;
          const btnStatus =
            isSelected && feedback === 'correct'
              ? 'correct'
              : isSelected && feedback === 'wrong'
              ? 'wrong'
              : '';

          return (
            <button
              key={idx}
              className={`lane-btn lane-btn-${idx} ${btnStatus}`}
              onClick={() => handleSelectOption(idx, option)}
            >
              <span className="lane-indicator">Làn {idx + 1}</span>
              <span className="lane-val">{option}</span>
            </button>
          );
        })}
      </div>
      <p className="game-hint-sub">Bấm chọn làn có đáp án đúng để tăng tốc chiếc xe nhé!</p>
    </div>
  );
};
