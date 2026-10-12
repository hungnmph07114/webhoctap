import { describe, expect, it } from 'vitest';
import { mergeCustomLessons, mergeMascot, mergeProfile, mergeProgress } from './cloudMerge';
import { UserProfile } from '../types/user';

const profile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  userId: 'kid-1',
  displayName: 'Bé A',
  avatarId: 'owl_avatar',
  currentGrade: 1,
  stars: 0,
  gems: 0,
  currentStreak: 1,
  maxStreak: 1,
  lastActiveDate: '2026-09-12',
  streakFrozen: false,
  unlockedBadges: [],
  parentPin: '5678',
  dailyTimeLimitMinutes: 30,
  screenTimeTodayMinutes: 0,
  screenTimeDate: '2026-09-12',
  eyeCareMode: false,
  ...overrides
});

describe('cloudMerge', () => {
  it('keeps the highest lesson score and combines question memory', () => {
    const merged = mergeProgress(
      {
        lesson: {
          score: 90, stars: 2, completedAt: '2026-09-12T10:00:00Z', attempts: 2,
          wrongQuestionIds: ['q1'], masteredQuestionIds: []
        }
      },
      {
        lesson: {
          score: 80, stars: 3, completedAt: '2026-09-13T10:00:00Z', attempts: 1,
          wrongQuestionIds: ['q2'], masteredQuestionIds: ['q1']
        }
      }
    );

    expect(merged.lesson.score).toBe(90);
    expect(merged.lesson.stars).toBe(3);
    expect(merged.lesson.wrongQuestionIds).toEqual(['q2']);
    expect(merged.lesson.masteredQuestionIds).toEqual(['q1']);
  });

  it('merges same-profile rewards without lowering local data', () => {
    const merged = mergeProfile(
      profile({ stars: 20, gems: 2, unlockedBadges: ['a'] }),
      profile({ stars: 15, gems: 4, unlockedBadges: ['b'] })
    );

    expect(merged.stars).toBe(20);
    expect(merged.gems).toBe(4);
    expect(merged.unlockedBadges).toEqual(['a', 'b']);
  });

  it('does not merge data from a different profile', () => {
    const local = profile({ stars: 20 });
    const cloud = profile({ userId: 'kid-2', stars: 5 });

    expect(mergeProfile(local, cloud)).toEqual(cloud);
  });

  it('keeps the stronger mascot and unions custom lessons by id', () => {
    const mascot = mergeMascot(
      { petId: 'owl', name: 'Cú', level: 2, currentXp: 50, xpToNextLevel: 100, hungerPercent: 50, lastFedAt: '2026-09-12' },
      { petId: 'owl', name: 'Cú', level: 3, currentXp: 10, xpToNextLevel: 140, hungerPercent: 40, lastFedAt: '2026-09-13' }
    );
    const lesson = (id: string, title: string) => ({ id, title } as never);

    expect(mascot.level).toBe(3);
    expect(mergeCustomLessons([lesson('a', 'Local')], [lesson('b', 'Cloud')])).toHaveLength(2);
  });

  it('handles missing or invalid date strings in latestDate safely', () => {
    const valid = '2026-09-15T12:00:00Z';
    expect(mergeProgress(
      { lesson: { score: 80, stars: 2, completedAt: valid, attempts: 1 } },
      { lesson: { score: 80, stars: 2, completedAt: '' as any, attempts: 1 } }
    ).lesson.completedAt).toBe(valid);
  });
});
