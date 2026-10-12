import { Lesson, Question } from '../types/curriculum';

export interface ValidationResult {
  valid: boolean;
  message: string;
}

const validSubjects = new Set(['math', 'vietnamese', 'english']);

function validateQuestion(question: Partial<Question>): string | null {
  if (!question || !question.id || !question.type || !question.prompt || !question.prompt.trim()) {
    return 'Mỗi câu hỏi phải có id, loại câu hỏi và nội dung đề bài.';
  }

  if (question.points !== undefined && (!Number.isFinite(question.points) || question.points <= 0 || question.points > 100)) {
    return 'Điểm của mỗi câu phải lớn hơn 0 và không vượt quá 100.';
  }

  switch (question.type) {
    case 'multiple_choice':
    case 'multi_select':
    case 'image_choice':
    case 'true_false': {
      const options = Array.isArray(question.options) ? question.options : [];
      if (options.length < 2) {
        return 'Câu hỏi trắc nghiệm phải có ít nhất 2 phương án.';
      }

      const optionIds = options.map((option) => option?.id?.trim() || '');
      if (optionIds.some((id) => !id) || new Set(optionIds).size !== optionIds.length) {
        return 'Các phương án phải có id duy nhất và không được để trống.';
      }

      const hasBlankText = options.some((option) => !option?.text || !String(option.text).trim());
      if (hasBlankText) {
        return 'Các phương án trả lời không được để trống.';
      }

      const correctCount = options.filter((option) => option?.isCorrect).length;
      if (correctCount === 0) {
        return 'Câu hỏi trắc nghiệm phải có ít nhất 1 đáp án đúng.';
      }
      if (question.type === 'multi_select' && correctCount < 2) {
        return 'Câu chọn nhiều đáp án phải có ít nhất 2 đáp án đúng.';
      }
      if (question.type !== 'multi_select' && correctCount !== 1) {
        return 'Câu hỏi chỉ được có đúng 1 đáp án đúng.';
      }
      return null;
    }
    case 'fill_in_the_blank': {
      const blanks = question.interactiveData?.blanks;
      if (!Array.isArray(blanks) || blanks.length === 0 || !blanks.some((value) => typeof value === 'string' && value.trim().length > 0)) {
        return 'Câu điền vào chỗ trống phải có ít nhất 1 đáp án đúng.';
      }
      return null;
    }
    case 'drag_and_drop': {
      const items = question.interactiveData?.draggableItems || [];
      if (items.length === 0) {
        return 'Câu kéo thả phải có danh sách vật phẩm để chọn.';
      }
      const ids = items.map((item) => item.id?.trim() || '');
      if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
        return 'Vật phẩm kéo thả phải có id duy nhất và không được để trống.';
      }
      const targetCount = question.interactiveData?.basketTargetCount;
      if (!Number.isInteger(targetCount) || targetCount! < 1 || targetCount! > items.length) {
        return 'Số vật phẩm cần chọn phải nằm trong danh sách vật phẩm.';
      }
      return null;
    }
    case 'word_match': {
      const pairs = question.interactiveData?.matchingPairs || [];
      if (pairs.length === 0) {
        return 'Câu nối cặp phải có ít nhất 1 cặp tương ứng.';
      }
      const pairIds = pairs.map((pair) => pair.id.trim());
      if (pairIds.some((id) => !id) || new Set(pairIds).size !== pairIds.length) {
        return 'Các cặp nối phải có id duy nhất và không được để trống.';
      }
      return null;
    }
    case 'ordering': {
      const items = question.interactiveData?.orderItems || [];
      if (items.length < 2) {
        return 'Câu sắp xếp phải có ít nhất 2 mục để sắp xếp.';
      }
      const ids = items.map((item) => item.id?.trim() || '');
      const indexes = items.map((item) => item.correctIndex);
      if (ids.some((id) => !id) || new Set(ids).size !== ids.length
        || indexes.some((index) => !Number.isInteger(index) || index < 0 || index >= items.length)
        || new Set(indexes).size !== items.length) {
        return 'Các mục sắp xếp phải có id duy nhất và thứ tự đúng hợp lệ.';
      }
      return null;
    }
    case 'writing_practice': {
      return null;
    }
    default:
      return `Loại câu hỏi không hợp lệ: ${String(question.type)}`;
  }
}

export function validateLessonForPublishing(lesson: Partial<Lesson>): ValidationResult {
  if (!lesson || !lesson.title || !lesson.title.trim()) {
    return { valid: false, message: 'Tiêu đề bài học không được để trống.' };
  }

  if (!lesson.subject || !validSubjects.has(lesson.subject)) {
    return { valid: false, message: 'Môn học phải là Toán, Tiếng Việt hoặc Tiếng Anh.' };
  }

  if (!lesson.grade || lesson.grade < 1 || lesson.grade > 5) {
    return { valid: false, message: 'Khối lớp phải nằm trong khoảng từ 1 đến 5.' };
  }

  if (!Array.isArray(lesson.questions) || lesson.questions.length === 0) {
    return { valid: false, message: 'Bài học phải có ít nhất 1 câu hỏi.' };
  }

  if (lesson.passingScore !== undefined && (!Number.isFinite(lesson.passingScore) || lesson.passingScore < 0 || lesson.passingScore > 100)) {
    return { valid: false, message: 'Điểm đạt chuẩn phải nằm trong khoảng 0 đến 100.' };
  }

  if (lesson.difficulty !== undefined && ![1, 2, 3, 4].includes(lesson.difficulty)) {
    return { valid: false, message: 'Độ khó của bài học không hợp lệ.' };
  }

  if (lesson.questions.length > 100) {
    return { valid: false, message: 'Mỗi bài học chỉ được có tối đa 100 câu hỏi.' };
  }

  const questionIds = lesson.questions.map((question) => question.id?.trim() || '');
  if (questionIds.some((id) => !id) || new Set(questionIds).size !== questionIds.length) {
    return { valid: false, message: 'Các câu hỏi phải có id duy nhất và không được để trống.' };
  }

  for (const [index, question] of lesson.questions.entries()) {
    const issue = validateQuestion(question as Partial<Question>);
    if (issue) {
      return {
        valid: false,
        message: `Câu hỏi số ${index + 1}: ${issue}`,
      };
    }
  }

  return {
    valid: true,
    message: 'Bài học hợp lệ.',
  };
}

export function isValidLessonImport(value: unknown): value is Lesson {
  if (!value || typeof value !== 'object') return false;
  const lesson = value as Partial<Lesson>;
  return validateLessonForPublishing(lesson).valid;
}
