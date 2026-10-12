import { describe, it, expect } from 'vitest';
import { ALL_LESSONS } from './curriculumData';

describe('Curriculum Data Integrity Audit', () => {
  it('has unique lesson IDs', () => {
    const lessonIds = new Set<string>();
    const duplicates: string[] = [];
    for (const lesson of ALL_LESSONS) {
      if (lessonIds.has(lesson.id)) {
        duplicates.push(lesson.id);
      }
      lessonIds.add(lesson.id);
    }
    expect(duplicates, `Duplicate lesson IDs found: ${duplicates.join(', ')}`).toEqual([]);
  });

  it('has unique question IDs within each lesson', () => {
    const duplicates: { lessonId: string; questionId: string }[] = [];
    for (const lesson of ALL_LESSONS) {
      const qIds = new Set<string>();
      for (const q of lesson.questions) {
        if (qIds.has(q.id)) {
          duplicates.push({ lessonId: lesson.id, questionId: q.id });
        }
        qIds.add(q.id);
      }
    }
    expect(duplicates, `Duplicate question IDs within lessons found: ${JSON.stringify(duplicates)}`).toEqual([]);
  });

  it('has no duplicate option texts within any question', () => {
    const duplicates: { lessonId: string; questionId: string; duplicateText: string }[] = [];
    for (const lesson of ALL_LESSONS) {
      for (const q of lesson.questions) {
        if (q.options) {
          const texts = new Set<string>();
          for (const opt of q.options) {
            const norm = (opt.text ?? '').trim().toLowerCase();
            if (norm && texts.has(norm)) {
              duplicates.push({ lessonId: lesson.id, questionId: q.id, duplicateText: opt.text ?? '' });
            }
            if (norm) texts.add(norm);
          }
        }
      }
    }
    expect(duplicates, `Duplicate option texts found: ${JSON.stringify(duplicates)}`).toEqual([]);
  });

  it('has no leaked checkmarks or answers in option texts', () => {
    const leaked: { lessonId: string; questionId: string; text: string }[] = [];
    for (const lesson of ALL_LESSONS) {
      for (const q of lesson.questions) {
        if (q.options) {
          for (const opt of q.options) {
            const t = opt.text ?? '';
            if (t.includes('✓') || t.includes('✔')) {
              leaked.push({ lessonId: lesson.id, questionId: q.id, text: t });
            }
          }
        }
      }
    }
    expect(leaked, `Leaked checkmarks in option texts: ${JSON.stringify(leaked)}`).toEqual([]);
  });

  it('verifies simple arithmetic answers in math lessons', () => {
    const mathErrors: { lessonId: string; questionId: string; prompt: string; expected: number; markedAnswer: string }[] = [];
    const mathLessons = ALL_LESSONS.filter((l) => l.subject === 'math');

    for (const lesson of mathLessons) {
      for (const q of lesson.questions) {
        // Only match strictly 2-operand problems: e.g. "12 + 15 = ?" or "2,5 × 4 = ?"
        const match = q.prompt.match(/^([^+\-×*÷:\d]*)\s*(\d+(?:,\d+)?)\s*([+\-×*÷:])\s*(\d+(?:,\d+)?)\s*=\s*\?/);
        if (match) {
          const num1 = parseFloat(match[2].replace(',', '.'));
          const op = match[3];
          const num2 = parseFloat(match[4].replace(',', '.'));
          let expected: number | null = null;
          if (op === '+') expected = Math.round((num1 + num2) * 100) / 100;
          else if (op === '-') expected = Math.round((num1 - num2) * 100) / 100;
          else if (op === '×' || op === '*') expected = Math.round((num1 * num2) * 100) / 100;
          else if (op === '÷' || op === ':') expected = Math.round((num1 / num2) * 100) / 100;

          if (expected !== null) {
            if (q.type === 'multiple_choice' || q.type === 'image_choice') {
              const correctOpt = q.options?.find((o) => o.isCorrect);
              if (correctOpt) {
                const optText = correctOpt.text ?? '';
                const optNum = parseFloat(optText.replace(',', '.').replace(/[^\d.-]/g, ''));
                if (!isNaN(optNum) && Math.abs(optNum - expected) > 0.01) {
                  mathErrors.push({
                    lessonId: lesson.id,
                    questionId: q.id,
                    prompt: q.prompt,
                    expected,
                    markedAnswer: optText
                  });
                }
              }
            } else if (q.type === 'fill_in_the_blank') {
              const blanks = q.interactiveData?.blanks;
              if (blanks && blanks.length > 0) {
                const hasExpected = blanks.some((b) => {
                  const bNum = parseFloat(b.replace(',', '.').replace(/[^\d.-]/g, ''));
                  return !isNaN(bNum) && Math.abs(bNum - expected!) <= 0.01;
                });
                if (!hasExpected) {
                  mathErrors.push({
                    lessonId: lesson.id,
                    questionId: q.id,
                    prompt: q.prompt,
                    expected,
                    markedAnswer: blanks.join(', ')
                  });
                }
              }
            }
          }
        }
      }
    }
    expect(mathErrors, `Math arithmetic errors found: ${JSON.stringify(mathErrors)}`).toEqual([]);
  });

  it('validates prerequisiteLessonId references', () => {
    const allIds = new Set(ALL_LESSONS.map((l) => l.id));
    const brokenRefs: { lessonId: string; prereqId: string }[] = [];
    for (const lesson of ALL_LESSONS) {
      if (lesson.prerequisiteLessonId && !allIds.has(lesson.prerequisiteLessonId)) {
        brokenRefs.push({ lessonId: lesson.id, prereqId: lesson.prerequisiteLessonId });
      }
    }
    expect(brokenRefs, `Broken prerequisiteLessonId: ${JSON.stringify(brokenRefs)}`).toEqual([]);
  });

  it('validates every question structure and correctness', () => {
    const errors: string[] = [];

    for (const lesson of ALL_LESSONS) {
      if (!lesson.questions || lesson.questions.length === 0) {
        errors.push(`Lesson ${lesson.id} has no questions`);
        continue;
      }

      lesson.questions.forEach((q, idx) => {
        const prefix = `[Lesson ${lesson.id} Q${idx + 1} (${q.id}, type: ${q.type})]`;

        if (!q.prompt || !q.prompt.trim()) {
          errors.push(`${prefix} has empty prompt`);
        }

        if (q.type === 'multiple_choice' || q.type === 'image_choice') {
          if (!q.options || q.options.length < 2) {
            errors.push(`${prefix} has fewer than 2 options`);
          } else {
            const correctCount = q.options.filter((o) => o.isCorrect).length;
            if (correctCount !== 1) {
              errors.push(`${prefix} has ${correctCount} correct options (expected exactly 1)`);
            }
          }
        } else if (q.type === 'multi_select') {
          if (!q.options || q.options.length < 2) {
            errors.push(`${prefix} has fewer than 2 options`);
          } else {
            const correctCount = q.options.filter((o) => o.isCorrect).length;
            if (correctCount < 1) {
              errors.push(`${prefix} has ${correctCount} correct options (expected at least 1)`);
            }
          }
        } else if (q.type === 'true_false') {
          if (q.options && q.options.length > 0) {
            const correctCount = q.options.filter((o) => o.isCorrect).length;
            if (correctCount !== 1) {
              errors.push(`${prefix} true_false has ${correctCount} correct options (expected exactly 1)`);
            }
          } else if (q.correctAnswer === undefined) {
            errors.push(`${prefix} true_false missing both options and correctAnswer`);
          }
        } else if (q.type === 'fill_in_the_blank') {
          const blanks = q.interactiveData?.blanks;
          const hasAnswer = (blanks && blanks.length > 0 && blanks.some((b) => b.trim() !== '')) || (q.correctAnswer !== undefined && String(q.correctAnswer).trim() !== '');
          if (!hasAnswer) {
            errors.push(`${prefix} fill_in_the_blank missing blanks answer and correctAnswer`);
          }
        } else if (q.type === 'drag_and_drop') {
          const targetCount = q.interactiveData?.basketTargetCount;
          const items = q.interactiveData?.draggableItems;
          if (!targetCount || targetCount <= 0) {
            errors.push(`${prefix} drag_and_drop invalid basketTargetCount: ${targetCount}`);
          }
          if (!items || items.length < (targetCount || 0)) {
            errors.push(`${prefix} drag_and_drop draggableItems (${items?.length}) less than basketTargetCount (${targetCount})`);
          }
        } else if (q.type === 'word_match') {
          const pairs = q.interactiveData?.matchingPairs;
          if (!pairs || pairs.length < 2) {
            errors.push(`${prefix} word_match has fewer than 2 matchingPairs`);
          } else {
            pairs.forEach((p, pIdx) => {
              if (!p.left || !p.right) {
                errors.push(`${prefix} word_match pair ${pIdx} missing left or right`);
              }
            });
          }
        } else if (q.type === 'ordering') {
          const orderItems = q.interactiveData?.orderItems;
          if (!orderItems || orderItems.length < 2) {
            errors.push(`${prefix} ordering has fewer than 2 orderItems`);
          } else {
            const indices = orderItems.map((item) => item.correctIndex).sort((a, b) => a - b);
            const expected = orderItems.map((_, i) => i);
            if (JSON.stringify(indices) !== JSON.stringify(expected)) {
              errors.push(`${prefix} ordering correctIndex not 0..${orderItems.length - 1}: got ${indices.join(',')}`);
            }
          }
        }
      });
    }

    expect(errors, `Curriculum structure errors found:\n${errors.join('\n')}`).toEqual([]);
  });
});
