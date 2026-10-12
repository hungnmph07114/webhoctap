import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Lesson } from '../types/curriculum';
import { DailyQuest } from '../types/gamification';
import { UserProfile } from '../types/user';
import { audioService } from '../services/audioService';
import { storageService } from '../services/storageService';

interface DailyChallengeProps {
  lessons: Lesson[];
  onStartChallenge: (lesson: Lesson) => void;
  completedLessonIds: string[];
  onProfileUpdated?: (profile: UserProfile) => void;
}

// Chọn bài thử thách dựa theo ngày trong năm (thay đổi mỗi ngày)
function getDailyLesson(lessons: Lesson[]): Lesson | null {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  if (lessons.length === 0) return null;
  const idx = dayOfYear % lessons.length;
  return lessons[idx] || null;
}

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}g ${m}p`;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  lessons,
  onStartChallenge,
  completedLessonIds,
  onProfileUpdated
}) => {
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  const [quests, setQuests] = useState<DailyQuest[]>(() => storageService.getDailyQuests());
  const lesson = getDailyLesson(lessons);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
      setQuests(storageService.getDailyQuests());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Đồng bộ lại quests khi danh sách bài hoàn thành thay đổi
  useEffect(() => {
    setQuests(storageService.getDailyQuests());
  }, [completedLessonIds]);

  if (!lesson) return null;

  const isDone = completedLessonIds.includes(lesson.id);

  const SUBJECT_ICONS: Record<string, string> = {
    math: '🧮',
    vietnamese: '📖',
    english: '🌍',
  };

  const handleClaim = (questId: string) => {
    const res = storageService.claimDailyQuestReward(questId);
    if (res.success) {
      audioService.playCoin();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
      setQuests([...res.quests]);
      if (onProfileUpdated) {
        onProfileUpdated(res.profile);
      }
    }
  };

  return (
    <div className="daily-challenge-section">
      {/* Banner Thử Thách Tiêu Điểm x2 Thưởng */}
      <div
        className="daily-challenge-banner"
        onClick={() => {
          if (!isDone) {
            audioService.playPop();
            onStartChallenge(lesson);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="challenge-icon-area">
          {SUBJECT_ICONS[lesson.subject] || '🎯'}
        </div>

        <div className="challenge-info">
          <div className="challenge-label">
            ⚡ THỬ THÁCH TIÊU ĐIỂM HÔM NAY
          </div>
          <h3 className="challenge-title">{lesson.title}</h3>
          <div className="challenge-subtitle">
            Lớp {lesson.grade} • {lesson.questions.length} câu hỏi • Điểm chuẩn {lesson.passingScore || 60}% • Phần thưởng 2× sao
          </div>
          <div className="challenge-countdown">
            ⏰ Còn {countdown} để nhận thưởng
          </div>
        </div>

        <div className="challenge-reward-badge">
          <span style={{ fontSize: 22 }}>⭐×2</span>
          <span style={{ fontSize: 11, opacity: 0.85 }}>Bonus</span>
        </div>

        {isDone ? (
          <div className="challenge-done-badge">
            ✅ Đã hoàn thành!
          </div>
        ) : (
          <button
            className="challenge-btn"
            onClick={(e) => {
              e.stopPropagation();
              audioService.playPop();
              onStartChallenge(lesson);
            }}
          >
            🚀 Nhận thử thách
          </button>
        )}
      </div>

      {/* Nhiệm Vụ Hàng Ngày (Daily Quests) */}
      <div className="daily-quests-container">
        <div className="daily-quests-header">
          <div className="daily-quests-title">
            <span>🎯 Nhiệm Vụ Hàng Ngày</span>
            <span className="quests-count-badge">
              {quests.filter(q => q.completed).length}/{quests.length} xong
            </span>
          </div>
          <span className="quests-reset-time">Làm mới lúc 00:00</span>
        </div>

        <div className="daily-quests-grid">
          {quests.map((quest) => {
            const pct = Math.min(100, Math.round((quest.current / quest.target) * 100));
            return (
              <div
                key={quest.id}
                className={`daily-quest-card ${quest.completed ? 'completed' : ''} ${quest.claimed ? 'claimed' : ''}`}
              >
                <div className="quest-icon">{quest.icon}</div>
                <div className="quest-info">
                  <div className="quest-title-row">
                    <span className="quest-title">{quest.title}</span>
                    <div className="quest-reward-tag">
                      {quest.rewardStars > 0 && <span>+{quest.rewardStars}⭐</span>}
                      {quest.rewardGems && quest.rewardGems > 0 && <span>+{quest.rewardGems}💎</span>}
                    </div>
                  </div>
                  <div className="quest-desc">{quest.description}</div>
                  
                  <div className="quest-progress-track">
                    <div
                      className="quest-progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="quest-footer">
                    <span className="quest-progress-text">
                      Tiến độ: <strong>{quest.current}/{quest.target}</strong>
                    </span>
                    {quest.claimed ? (
                      <span className="quest-claimed-tag">✓ Đã nhận</span>
                    ) : quest.completed ? (
                      <button
                        className="quest-claim-btn"
                        onClick={() => handleClaim(quest.id)}
                      >
                        🎁 Nhận thưởng!
                      </button>
                    ) : (
                      <span className="quest-status-ongoing">Đang thực hiện</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

