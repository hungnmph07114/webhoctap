import { describe, expect, it } from 'vitest';
import { ALL_LESSONS } from '../data/curriculumData';
import { isAcceptedShortAnswer, normalizeShortAnswer } from './answerValidation';

describe('short-answer validation', () => {
  it('accepts equivalent spacing around a measurement unit', () => {
    expect(isAcceptedShortAnswer('200cm', ['200 cm'])).toBe(true);
    expect(isAcceptedShortAnswer('200 cm.', ['200 cm'])).toBe(true);
    expect(isAcceptedShortAnswer('  2.5 kg  ', ['2.5kg'])).toBe(true);
    expect(isAcceptedShortAnswer('25 %', ['25%'])).toBe(true);
  });

  it('normalizes Unicode composition but preserves Vietnamese spelling and word boundaries', () => {
    expect(normalizeShortAnswer('tiếng Việt')).toBe('tiếng việt');
    expect(isAcceptedShortAnswer('tieng viet', ['tiếng Việt'])).toBe(false);
    expect(isAcceptedShortAnswer('anapple', ['an apple'])).toBe(false);
  });

  it('accepts the written unit form for the 2 m conversion question', () => {
    const question = ALL_LESSONS
      .flatMap((lesson) => lesson.questions)
      .find((item) => item.prompt.includes('Một đoạn ruy băng dài 2 m'));

    expect(question).toBeDefined();
    expect(isAcceptedShortAnswer('200cm', question?.interactiveData?.blanks ?? [])).toBe(true);
    expect(isAcceptedShortAnswer('200 cm', question?.interactiveData?.blanks ?? [])).toBe(true);
    expect(isAcceptedShortAnswer('200', question?.interactiveData?.blanks ?? [])).toBe(true);
  });
});
