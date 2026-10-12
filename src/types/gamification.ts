export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: 'learning' | 'streak' | 'pet' | 'mastery';
  requiredCount: number;
}

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_lesson',
    title: 'Khởi Đầu Nan',
    icon: '🌱',
    description: 'Hoàn thành bài học đầu tiên trong đời!',
    category: 'learning',
    requiredCount: 1
  },
  {
    id: 'math_star_g1',
    title: 'Thần Đồng Số Học',
    icon: '🔢',
    description: 'Đạt 3 sao trong 3 bài toán bất kỳ',
    category: 'mastery',
    requiredCount: 3
  },
  {
    id: 'spelling_bee',
    title: 'Vua Tiếng Việt',
    icon: '📖',
    description: 'Hoàn thành 3 bài học Tiếng Việt đạt chuẩn',
    category: 'mastery',
    requiredCount: 3
  },
  {
    id: 'english_explorer',
    title: 'Nhà Thám Hiểm Anh Ngữ',
    icon: '🌍',
    description: 'Hoàn thành 3 bài học Tiếng Anh bất kỳ',
    category: 'learning',
    requiredCount: 3
  },
  {
    id: 'streak_3',
    title: 'Ngọn Lửa Chăm Chỉ',
    icon: '🔥',
    description: 'Duy trì chuỗi học tập 3 ngày liên tiếp',
    category: 'streak',
    requiredCount: 3
  },
  {
    id: 'streak_7',
    title: 'Cú Vọ Bền Bỉ',
    icon: '⚡',
    description: 'Duy trì chuỗi học tập 7 ngày liên tiếp',
    category: 'streak',
    requiredCount: 7
  },
  {
    id: 'streak_shield',
    title: 'Bất Khả Xâm Phạm',
    icon: '🛡️',
    description: 'Sở hữu chiếc Khiên bảo vệ chuỗi đầu tiên',
    category: 'streak',
    requiredCount: 1
  },
  {
    id: 'pet_friend',
    title: 'Bạn Thân Của Bibo',
    icon: '🦉',
    description: 'Cho thú cưng Bibo ăn 5 lần để lên cấp',
    category: 'pet',
    requiredCount: 5
  },
  {
    id: 'mascot_scholar',
    title: 'Bibo Học Giả',
    icon: '🎓',
    description: 'Nâng cấp Cú Bibo đạt cấp độ 5 trở lên',
    category: 'pet',
    requiredCount: 5
  },
  {
    id: 'perfect_100',
    title: 'Điểm 10 Đỏ Chói',
    icon: '💯',
    description: 'Hoàn thành một bài thi trắc nghiệm không sai câu nào',
    category: 'mastery',
    requiredCount: 1
  },
  {
    id: 'speed_racer',
    title: 'Tay Đua Tốc Độ',
    icon: '🏎️',
    description: 'Về đích xuất sắc trong mini-game Đua xe phép tính',
    category: 'mastery',
    requiredCount: 1
  },
  {
    id: 'memory_master',
    title: 'Bộ Não Siêu Nhớ',
    icon: '🎴',
    description: 'Hoàn thành trò chơi Lật thẻ trí nhớ với kết quả tốt',
    category: 'mastery',
    requiredCount: 1
  },
  {
    id: 'scratchpad_genius',
    title: 'Bậc Thầy Nháp Tính',
    icon: '✏️',
    description: 'Sử dụng Bảng nháp điện tử để tính toán bài học',
    category: 'learning',
    requiredCount: 1
  },
  {
    id: 'writing_artisan',
    title: 'Vở Sạch Chữ Đẹp',
    icon: '✍️',
    description: 'Hoàn thành bài tập luyện viết ô ly chuẩn xác',
    category: 'mastery',
    requiredCount: 1
  },
  {
    id: 'tri_subject_champ',
    title: 'Học Bá Toàn Năng',
    icon: '🏆',
    description: 'Đã hoàn thành bài học ở cả 3 môn Toán, Tiếng Việt và Tiếng Anh',
    category: 'learning',
    requiredCount: 3
  }
];

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  rewardStars: number;
  rewardGems?: number;
  completed: boolean;
  claimed: boolean;
}

export interface DailyQuestState {
  date: string;
  quests: DailyQuest[];
}

