import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from './storageService';

const createMemoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
};

describe('storageService profile creation', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createMemoryStorage(),
      configurable: true,
    });
  });

  it('starts a new install without sample rewards or phantom lesson progress', () => {
    const profile = storageService.getUserProfile();

    expect(profile.userId).not.toBe('student_local_default');
    expect(profile.stars).toBe(0);
    expect(profile.gems).toBe(0);
    expect(profile.currentStreak).toBe(0);
    expect(profile.maxStreak).toBe(0);
    expect(profile.unlockedBadges).toEqual([]);
    expect(storageService.getProgress()).toEqual({});
  });

  it('creates an independent profile ID after local data is cleared', () => {
    const firstId = storageService.getUserProfile().userId;
    localStorage.clear();

    const secondId = storageService.getUserProfile().userId;

    expect(secondId).not.toBe(firstId);
  });

  it('rejects duplicate kid names regardless of casing', () => {
    storageService.createKidProfile('Bé Bắp', 1, 'owl_avatar');

    expect(() => storageService.createKidProfile('bé bắp', 2, 'fox_avatar')).toThrow(
      'Tên bé đã tồn tại'
    );
  });

  it('keeps progress separate between child profiles', () => {
    const firstKid = storageService.createKidProfile('Bé A', 1, 'owl_avatar');
    const secondKid = storageService.createKidProfile('Bé B', 2, 'fox_avatar');

    storageService.saveProgress({ 'math_1': { score: 100, stars: 3, completedAt: '2024-01-01', attempts: 1 } });
    storageService.switchKidProfile(firstKid.userId);
    storageService.saveProgress({ 'math_1': { score: 80, stars: 2, completedAt: '2024-01-02', attempts: 1 } });
    storageService.switchKidProfile(secondKid.userId);
    storageService.saveProgress({ 'math_2': { score: 90, stars: 3, completedAt: '2024-01-03', attempts: 1 } });

    storageService.switchKidProfile(firstKid.userId);
    expect(storageService.getProgress()['math_1'].score).toBe(80);

    storageService.switchKidProfile(secondKid.userId);
    expect(storageService.getProgress()['math_2'].score).toBe(90);
  });

  it('resets the streak after missing more than one day', () => {
    const profile = storageService.getUserProfile();
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    storageService.saveUserProfile({ ...profile, currentStreak: 5, maxStreak: 5, lastActiveDate: twoDaysAgo });
    storageService.saveProgress({});

    const result = storageService.recordLessonCompletion('streak_test', 80, 2);

    expect(result.updatedProfile.currentStreak).toBe(1);
  });

  it('resets screen time when the stored date is no longer today', () => {
    const profile = storageService.getUserProfile();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    localStorage.setItem(
      'tieu_hoc_user_profile_v1',
      JSON.stringify({ ...profile, screenTimeTodayMinutes: 29, screenTimeDate: yesterday })
    );

    const refreshed = storageService.getUserProfile();

    expect(refreshed.screenTimeTodayMinutes).toBe(0);
    expect(refreshed.screenTimeDate).toBe(new Date().toISOString().split('T')[0]);
  });

  it('does not give a new profile another profile\'s legacy progress', () => {
    const firstKid = storageService.createKidProfile('Bé C', 1, 'owl_avatar');
    storageService.saveProgress({ first_only: { score: 100, stars: 3, completedAt: '2024-01-01', attempts: 1 } });
    const secondKid = storageService.createKidProfile('Bé D', 1, 'fox_avatar');

    storageService.switchKidProfile(secondKid.userId);

    expect(storageService.getProgress()).toEqual({});
    expect(firstKid.userId).not.toBe(secondKid.userId);
  });

  it('doubles the star portion of a daily challenge reward', () => {
    const profile = storageService.createKidProfile('Bé E', 1, 'owl_avatar');

    const result = storageService.recordLessonCompletion('daily_test', 100, 3, profile.currentGrade, [], [], 2);

    expect(result.earnedStars).toBe(32);
    expect(result.updatedProfile.stars).toBe(32);
  });

  it('stores daily challenge completion separately from lesson progress', () => {
    storageService.saveProgress({});
    storageService.markDailyChallengeCompleted('daily_lesson');

    expect(storageService.getDailyChallengeCompletion()).toEqual({
      date: new Date().toISOString().split('T')[0],
      lessonId: 'daily_lesson',
    });
    expect(storageService.getProgress()).toEqual({});
  });

  it('clears the daily challenge when all progress is reset', () => {
    storageService.markDailyChallengeCompleted('daily_lesson');

    storageService.resetAllProgress();

    expect(storageService.getDailyChallengeCompletion()).toBeNull();
  });

  it('prevents star farming when replaying without improving stars', () => {
    storageService.createKidProfile('Bé Farm', 1, 'owl_avatar');
    // First completion gives stars
    const first = storageService.recordLessonCompletion('lesson_farm_1', 80, 2);
    expect(first.earnedStars).toBe(12); // 2*5 + 2 = 12

    // Replaying with same 2 stars awards 0 stars
    const replaySame = storageService.recordLessonCompletion('lesson_farm_1', 80, 2);
    expect(replaySame.earnedStars).toBe(0);

    // Replaying with improved 3 stars awards difference: (3 - 2) * 5 = 5 stars
    const replayBetter = storageService.recordLessonCompletion('lesson_farm_1', 100, 3);
    expect(replayBetter.earnedStars).toBe(5);
  });

  it('awards difficulty bonus for higher difficulty lessons', () => {
    storageService.createKidProfile('Bé Hard', 1, 'owl_avatar');
    // Difficulty 4 gives +3 bonus stars on first completion
    const hardResult = storageService.recordLessonCompletion('lesson_hard_1', 100, 3, 1, [], [], 1, 4);
    expect(hardResult.earnedStars).toBe(3 * 5 + 2 + 3); // 20 stars
  });

  it('tracks and claims daily quests progress', () => {
    storageService.createKidProfile('Bé Quest', 1, 'owl_avatar');
    const questsBefore = storageService.getDailyQuests();
    expect(questsBefore).toHaveLength(3);
    expect(questsBefore[0].current).toBe(0);

    // Complete a lesson with score 100 on difficulty 3
    storageService.recordLessonCompletion('quest_lesson_1', 100, 3, 1, [], [], 1, 3);
    const questsAfter = storageService.getDailyQuests();

    // lesson_completed quest should have 1/2
    expect(questsAfter.find(q => q.id === 'quest_lessons')?.current).toBe(1);
    // perfect_score quest should be completed (1/1)
    const perfectQuest = questsAfter.find(q => q.id === 'quest_perfect');
    expect(perfectQuest?.completed).toBe(true);

    // Claim reward for perfect quest
    const claimRes = storageService.claimDailyQuestReward('quest_perfect');
    expect(claimRes.success).toBe(true);
    expect(claimRes.gems).toBe(1);
    expect(claimRes.profile.gems).toBeGreaterThan(0);
  });
});

