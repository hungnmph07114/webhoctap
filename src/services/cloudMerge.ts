import { Lesson } from '../types/curriculum';
import { MascotState, UserProfile, UserProgressMap } from '../types/user';

export function latestDate(first?: string, second?: string): string {
  if (!first && !second) return new Date().toISOString();
  if (!first) return second!;
  if (!second) return first;
  const t1 = Date.parse(first);
  const t2 = Date.parse(second);
  if (isNaN(t1) && isNaN(t2)) return first;
  if (isNaN(t1)) return second;
  if (isNaN(t2)) return first;
  return t1 >= t2 ? first : second;
}

export function mergeProgress(local: UserProgressMap, cloud: UserProgressMap): UserProgressMap {
  const merged: UserProgressMap = { ...local };

  Object.entries(cloud).forEach(([lessonId, cloudProgress]) => {
    const localProgress = merged[lessonId];
    if (!localProgress) {
      merged[lessonId] = cloudProgress;
      return;
    }

    const bestScore = Math.max(localProgress.score, cloudProgress.score);
    const bestStars = Math.max(localProgress.stars, cloudProgress.stars);
    const masteredQuestionIds = Array.from(new Set([
      ...(localProgress.masteredQuestionIds || []),
      ...(cloudProgress.masteredQuestionIds || [])
    ]));
    const masteredIds = new Set(masteredQuestionIds);

    merged[lessonId] = {
      ...localProgress,
      ...cloudProgress,
      score: bestScore,
      stars: bestStars,
      attempts: Math.max(localProgress.attempts, cloudProgress.attempts),
      completedAt: latestDate(localProgress.completedAt, cloudProgress.completedAt),
      wrongQuestionIds: Array.from(new Set([
        ...(localProgress.wrongQuestionIds || []),
        ...(cloudProgress.wrongQuestionIds || [])
      ])).filter((questionId) => !masteredIds.has(questionId)),
      masteredQuestionIds
    };
  });

  return merged;
}

export function mergeProfile(local: UserProfile, cloud: UserProfile): UserProfile {
  if (local.userId !== cloud.userId) return cloud;

  const sameScreenTimeDate = local.screenTimeDate === cloud.screenTimeDate;
  const latestActivityDate = latestDate(local.lastActiveDate, cloud.lastActiveDate);
  const latestActivityProfile = local.lastActiveDate === latestActivityDate ? local : cloud;

  return {
    ...cloud,
    ...local,
    stars: Math.max(local.stars, cloud.stars),
    gems: Math.max(local.gems, cloud.gems),
    streakFreezeCount: Math.max(local.streakFreezeCount || 0, cloud.streakFreezeCount || 0),
    currentStreak: latestActivityProfile.currentStreak,
    maxStreak: Math.max(local.maxStreak, cloud.maxStreak),
    lastActiveDate: latestActivityDate,
    unlockedBadges: Array.from(new Set([
      ...(local.unlockedBadges || []),
      ...(cloud.unlockedBadges || [])
    ])),
    screenTimeTodayMinutes: sameScreenTimeDate
      ? Math.max(local.screenTimeTodayMinutes, cloud.screenTimeTodayMinutes)
      : latestDate(local.screenTimeDate, cloud.screenTimeDate) === local.screenTimeDate
        ? local.screenTimeTodayMinutes
        : cloud.screenTimeTodayMinutes,
    screenTimeDate: latestDate(local.screenTimeDate, cloud.screenTimeDate)
  };
}

export function mergeMascot(local: MascotState, cloud: MascotState): MascotState {
  const localIsHigher = local.level > cloud.level
    || (local.level === cloud.level && local.currentXp >= cloud.currentXp);
  const higher = localIsHigher ? local : cloud;

  return {
    ...cloud,
    ...higher,
    hungerPercent: Math.max(local.hungerPercent, cloud.hungerPercent),
    lastFedAt: latestDate(local.lastFedAt, cloud.lastFedAt),
    unlockedItems: Array.from(new Set([
      ...(local.unlockedItems || []),
      ...(cloud.unlockedItems || [])
    ]))
  };
}

export function mergeCustomLessons(local: Lesson[], cloud: Lesson[]): Lesson[] {
  const byId = new Map(local.map((lesson) => [lesson.id, lesson]));
  cloud.forEach((lesson) => byId.set(lesson.id, lesson));
  return Array.from(byId.values());
}
