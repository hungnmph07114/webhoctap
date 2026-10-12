import React from 'react';
import { UserProfile, UserProgressMap } from '../types/user';

interface QuickStatsProps {
  profile: UserProfile;
  progress: UserProgressMap;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ profile, progress }) => {
  const totalCompleted = Object.values(progress).filter(p => p.stars > 0).length;

  // Tính điểm trung bình
  const scores = Object.values(progress).map(p => p.score ?? p.lastScore).filter((s): s is number => typeof s === 'number');
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // Bài học hoàn thành hôm nay
  const today = new Date().toDateString();
  const todayCount = Object.values(progress).filter(p => {
    const played = p.completedAt || p.lastPlayed;
    if (!played) return false;
    return new Date(played).toDateString() === today;
  }).length;

  return (
    <div className="quick-stats-widget">
      <div className="stat-widget-card streak-card">
        <span className="stat-widget-icon">🔥</span>
        <span className="stat-widget-value">{profile.currentStreak}</span>
        <span className="stat-widget-label">Ngày liên tiếp</span>
      </div>

      <div className="stat-widget-card today-card">
        <span className="stat-widget-icon">📚</span>
        <span className="stat-widget-value">{todayCount}</span>
        <span className="stat-widget-label">Bài hôm nay</span>
      </div>

      <div className="stat-widget-card score-card">
        <span className="stat-widget-icon">⭐</span>
        <span className="stat-widget-value">{avgScore > 0 ? `${avgScore}%` : '--'}</span>
        <span className="stat-widget-label">Điểm trung bình</span>
      </div>

      <div className="stat-widget-card progress-card">
        <span className="stat-widget-icon">🎯</span>
        <span className="stat-widget-value">{totalCompleted}</span>
        <span className="stat-widget-label">Bài đã hoàn thành</span>
      </div>
    </div>
  );
};
