import { Lesson, SubjectMeta } from '../types/curriculum';
import { MATH_LESSONS } from './mathLessons';
import { VIETNAMESE_LESSONS } from './vietnameseLessons';
import { ENGLISH_LESSONS } from './englishLessons';
import { SUPPLEMENTAL_LESSONS } from './supplementalLessons';
import { EXPANDED_PRACTICE_LESSONS } from './expandedPracticeLessons';
import { MATH_EXPANSION_LESSONS } from './mathExpansionLessons';

export const SUBJECT_METAS: SubjectMeta[] = [
  {
    id: 'math',
    name: 'Toán Học Vui Nhộn',
    icon: '🧮',
    color: '#10AC84',
    accentColor: '#E8F8F5',
    description: 'Khám phá thế giới con số, phép tính kì diệu và hình học trực quan.'
  },
  {
    id: 'vietnamese',
    name: 'Tiếng Việt Yêu Thương',
    icon: '📖',
    color: '#FF6B6B',
    accentColor: '#FFEAEA',
    description: 'Đánh vần chuẩn xác, tập viết nét chữ xinh và làm giàu vốn từ ngữ.'
  },
  {
    id: 'english',
    name: 'Tiếng Anh Nhí (English)',
    icon: '🌍',
    color: '#48DBFB',
    accentColor: '#EAF9FE',
    description: 'Học từ vựng bản xứ, luyện nghe phản xạ và phát âm chuẩn quốc tế.'
  }
];

// Toàn bộ ngân hàng bài học thống nhất cho toàn bộ ứng dụng (Lớp 1 đến Lớp 5)
export const ALL_LESSONS: Lesson[] = [
  ...MATH_LESSONS,
  ...VIETNAMESE_LESSONS,
  ...ENGLISH_LESSONS,
  ...SUPPLEMENTAL_LESSONS,
  ...EXPANDED_PRACTICE_LESSONS,
  ...MATH_EXPANSION_LESSONS
];
