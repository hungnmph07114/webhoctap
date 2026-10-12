import { Grade } from './curriculum';

export interface MascotState {
  petId: 'owl' | 'dragon' | 'cat';
  name: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  hungerPercent: number; // 0 - 100
  lastFedAt: string;
  equippedHat?: string;
  equippedAccessory?: string;
  unlockedItems?: string[];
}

export interface LessonProgress {
  score: number;
  stars: number; // 1, 2, hoặc 3 sao
  completedAt: string;
  attempts: number;
  lastPlayed?: string;
  lastScore?: number;
  wrongQuestionIds?: string[]; // Danh sách ID các câu từng làm sai
  masteredQuestionIds?: string[]; // Danh sách ID các câu đã làm đúng hoàn hảo
}

export interface UserProfile {
  userId: string;
  displayName: string;
  avatarId: string;
  currentGrade: Grade;
  stars: number;
  gems: number;
  currentStreak: number;
  maxStreak: number;
  lastActiveDate: string;
  streakFrozen: boolean;
  streakFreezeCount?: number; // Số khiên bảo vệ chuỗi ngày học đang có (tối đa 2 khiên)
  unlockedBadges: string[];
  // Cài đặt phụ huynh (Parental Gate)
  parentPin: string; // Mã PIN 4 số
  dailyTimeLimitMinutes: number;
  screenTimeTodayMinutes: number;
  screenTimeDate: string;
  eyeCareMode: boolean;
}

export interface UserProgressMap {
  [lessonId: string]: LessonProgress;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarId: string;
  currentGrade: Grade;
  stars: number;
  gems: number;
  currentStreak: number;
  mascotLevel: number;
  unlockedBadgeCount: number;
  isCurrentKid?: boolean;
}

export const AVATAR_OPTIONS = [
  { id: 'owl_avatar', name: 'Cú Bibo', icon: '🦉' },
  { id: 'fox_avatar', name: 'Cáo Thông Thái', icon: '🦊' },
  { id: 'panda_avatar', name: 'Gấu Trúc Trí Tuệ', icon: '🐼' },
  { id: 'lion_avatar', name: 'Sư Tử Dũng Mãnh', icon: '🦁' },
  { id: 'rabbit_avatar', name: 'Thỏ Nhanh Nhẹn', icon: '🐰' },
  { id: 'cat_avatar', name: 'Mèo Lém Lỉnh', icon: '🐱' },
  { id: 'unicorn_avatar', name: 'Kỳ Lân Kỳ Diệu', icon: '🦄' },
  { id: 'dragon_avatar', name: 'Rồng Con Lửa', icon: '🐲' }
];
