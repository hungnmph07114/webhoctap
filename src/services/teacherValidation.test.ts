import { describe, it, expect } from 'vitest';
import { validateLessonForPublishing } from './teacherValidation';

describe('teacherValidation', () => {
  it('rejects multiple choice questions with blank option text even when one option is marked correct', () => {
    const result = validateLessonForPublishing({
      title: 'Bài kiểm tra rỗng',
      subject: 'math',
      grade: 2,
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: '1 + 1 = ?',
          options: [
            { id: 'a', text: '', isCorrect: false },
            { id: 'b', text: '2', isCorrect: true },
          ],
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.message).toContain('không được để trống');
  });

  it('accepts a fully valid lesson', () => {
    const result = validateLessonForPublishing({
      title: 'Bài toán cơ bản',
      subject: 'math',
      grade: 3,
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: '2 + 3 = ?',
          options: [
            { id: 'a', text: '4', isCorrect: false },
            { id: 'b', text: '5', isCorrect: true },
          ],
        },
      ],
    });

    expect(result.valid).toBe(true);
  });

  it('rejects duplicate question ids', () => {
    const result = validateLessonForPublishing({
      title: 'Bài trùng mã câu hỏi',
      subject: 'math',
      grade: 3,
      questions: [
        { id: 'q1', type: 'writing_practice', prompt: 'Viết số 1' },
        { id: 'q1', type: 'writing_practice', prompt: 'Viết số 2' },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.message).toContain('id duy nhất');
  });

  it('rejects duplicate word-match pair ids', () => {
    const result = validateLessonForPublishing({
      title: 'Bài nối cặp trùng mã',
      subject: 'english',
      grade: 3,
      questions: [
        {
          id: 'q1',
          type: 'word_match',
          prompt: 'Nối từ',
          interactiveData: {
            matchingPairs: [
              { id: 'p1', left: 'Cat', right: 'Mèo' },
              { id: 'p1', left: 'Dog', right: 'Chó' },
            ],
          },
        },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.message).toContain('id duy nhất');
  });

  it('rejects invalid question points', () => {
    const result = validateLessonForPublishing({
      title: 'Bài có điểm không hợp lệ',
      subject: 'math',
      grade: 3,
      questions: [
        { id: 'q1', type: 'writing_practice', prompt: 'Viết số 1', points: 0 },
      ],
    });

    expect(result.valid).toBe(false);
    expect(result.message).toContain('Điểm của mỗi câu');
  });

  it('accepts a multi-select question with multiple correct options', () => {
    const result = validateLessonForPublishing({
      title: 'Bài chọn nhiều đáp án',
      subject: 'math',
      grade: 3,
      questions: [
        {
          id: 'q1',
          type: 'multi_select',
          prompt: 'Chọn các số chẵn',
          options: [
            { id: 'a', text: '2', isCorrect: true },
            { id: 'b', text: '3', isCorrect: false },
            { id: 'c', text: '4', isCorrect: true },
          ],
        },
      ],
    });

    expect(result.valid).toBe(true);
  });
});
