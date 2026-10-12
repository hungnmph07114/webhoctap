export type Grade = 1 | 2 | 3 | 4 | 5;

export type SubjectId = 'math' | 'vietnamese' | 'english';

export type DifficultyLevel = 1 | 2 | 3 | 4; // 1=Dễ, 2=Trung Bình, 3=Khó, 4=Siêu Khó

export type QuestionType = 
  | 'multiple_choice'       // Chọn đáp án đúng
  | 'multi_select'          // Chọn nhiều đáp án đúng
  | 'image_choice'          // Chọn hình ảnh đúng
  | 'drag_and_drop'         // Kéo thả vào vị trí
  | 'fill_in_the_blank'     // Điền vào chỗ trống
  | 'word_match'            // Nối cặp từ/hình
  | 'writing_practice'      // Tập viết nét chữ
  | 'ordering'              // Sắp xếp thứ tự từ/số
  | 'true_false';           // Đúng hay Sai

export interface QuestionOption {
  id: string;
  text?: string;
  imageUrl?: string;
  emoji?: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
  leftEmoji?: string;
  rightEmoji?: string;
}

export interface OrderItem {
  id: string;
  text: string;
  correctIndex: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  audioPromptText?: string;
  illustration?: string;
  options?: QuestionOption[];
  correctAnswer?: string | number | string[];
  explanation?: string;
  explanationStepByStep?: string[]; // Các bước giải chi tiết từng bước
  hint?: string;
  points?: number; // Điểm cho câu hỏi (mặc định 10)
  interactiveData?: {
    basketTargetCount?: number;
    draggableItems?: { id: string; label: string; icon: string }[];
    matchingPairs?: MatchingPair[];
    writingCharacter?: string;
    writingGuidelines?: string[];
    orderItems?: OrderItem[];
    blanks?: string[]; // Các đáp án điền vào chỗ trống theo thứ tự
    fillTemplate?: string; // Template với {{BLANK}} là chỗ trống
    fractionData?: {
      numerator: number;
      denominator: number;
      shape?: 'bar' | 'circle';
      interactive?: boolean;
    };
  };
}

export interface Lesson {
  id: string;
  title: string;
  grade: Grade;
  subject: SubjectId;
  unitTitle: string;
  unitId: string; // Nhóm các bài trong cùng chương
  icon: string;
  description: string;
  difficulty: DifficultyLevel; // 1=Dễ, 2=Trung bình, 3=Khó, 4=Siêu khó
  passingScore: number; // Điểm tối thiểu để mở khóa bài tiếp (0-100)
  xpReward: number; // XP thưởng khi hoàn thành
  starsRequiredToUnlock: number; // Số sao bài trước cần đạt để mở khóa
  prerequisiteLessonId?: string; // Bài cần hoàn thành trước (nếu có)
  questions: Question[];
  funFact?: string; // Sự thật thú vị hiện sau khi hoàn thành bài
}

export interface Unit {
  id: string;
  title: string;
  grade: Grade;
  subject: SubjectId;
  icon: string;
  description: string;
}

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
  accentColor: string;
  description: string;
}

export const DIFFICULTY_LABELS: Record<DifficultyLevel, { label: string; color: string; icon: string }> = {
  1: { label: 'Dễ', color: '#10AC84', icon: '🌱' },
  2: { label: 'Trung Bình', color: '#FF9F43', icon: '🌟' },
  3: { label: 'Khó', color: '#EE5253', icon: '🔥' },
  4: { label: 'Siêu Khó', color: '#5F27CD', icon: '⚡' }
};
