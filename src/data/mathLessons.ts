// ================================================================
// NGÂN HÀNG BÀI HỌC - MÔN TOÁN | LỚP 1 -> LỚP 5
// Cấu trúc: Mỗi Unit có 4 bài, tăng dần độ khó từ 1 (Dễ) -> 4 (Siêu Khó)
// Cơ chế: Đạt ≥ 60 điểm (1 sao) để mở khóa bài tiếp theo
// ================================================================
import { Lesson } from '../types/curriculum';

export const MATH_LESSONS: Lesson[] = [

  // ============================================================
  // LỚP 1 - CHƯƠNG 1: CÁC SỐ TỪ 0 ĐẾN 10
  // ============================================================
  {
    id: 'g1_m_u1_l1',
    title: 'Làm Quen Số 1, 2, 3 (Đếm Cùng Bibo)',
    grade: 1, subject: 'math',
    unitId: 'g1_m_u1', unitTitle: 'Chương 1: Các số từ 0 đến 10',
    icon: '🍎', difficulty: 1,
    passingScore: 60, xpReward: 30, starsRequiredToUnlock: 0,
    description: 'Bé học nhận diện và đếm số 1, 2, 3 qua các hình ảnh trái cây sinh động.',
    funFact: 'Số 1 là số nhỏ nhất lớn hơn 0! Mọi số đều bắt đầu từ 1.',
    questions: [
      {
        id: 'q1', type: 'image_choice',
        prompt: 'Hình nào có đúng 2 quả táo đỏ?',
        audioPromptText: 'Hình nào có đúng hai quả táo đỏ?',
        hint: 'Bé đếm: Một... Hai! Đúng rồi!',
        options: [
          { id: 'a', text: '🍎', isCorrect: false },
          { id: 'b', text: '🍎 🍎', isCorrect: true },
          { id: 'c', text: '🍎 🍎 🍎', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'image_choice',
        prompt: 'Có mấy chú gà con đang kêu chiếp chiếp?',
        illustration: '🐣 🐣 🐣',
        audioPromptText: 'Bé đếm xem có mấy chú gà con đang kêu chiếp chiếp nhé?',
        options: [
          { id: 'a', text: '1 con', isCorrect: false },
          { id: 'b', text: '2 con', isCorrect: false },
          { id: 'c', text: '3 con', isCorrect: true }
        ]
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'Số nào đứng sau số 2?',
        audioPromptText: 'Số nào đứng sau số hai?',
        illustration: '2 → ?',
        hint: 'Đếm tiếp: Một, Hai, ...',
        options: [
          { id: 'a', text: '1', isCorrect: false },
          { id: 'b', text: '3', isCorrect: true },
          { id: 'c', text: '4', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'drag_and_drop',
        prompt: 'Kéo đúng 3 ngôi sao vào giỏ nhé!',
        audioPromptText: 'Bé hãy kéo đúng ba ngôi sao vào giỏ nhé!',
        interactiveData: {
          basketTargetCount: 3,
          draggableItems: [
            { id: 's1', label: 'Sao 1', icon: '⭐' },
            { id: 's2', label: 'Sao 2', icon: '⭐' },
            { id: 's3', label: 'Sao 3', icon: '⭐' },
            { id: 's4', label: 'Sao 4', icon: '⭐' },
            { id: 's5', label: 'Sao 5', icon: '⭐' }
          ]
        }
      }
    ]
  },
  {
    id: 'g1_m_u1_l2',
    title: 'Nhận Diện Số 4, 5, 6 Và So Sánh',
    grade: 1, subject: 'math',
    unitId: 'g1_m_u1', unitTitle: 'Chương 1: Các số từ 0 đến 10',
    icon: '🌻', difficulty: 1,
    passingScore: 60, xpReward: 35, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g1_m_u1_l1',
    description: 'Học số 4, 5, 6 và phân biệt số lớn hơn – nhỏ hơn – bằng nhau.',
    funFact: 'Số 5 đặc biệt vì chúng ta có đúng 5 ngón tay trên mỗi bàn tay!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '4 ○ 5 — Dấu nào điền vào?',
        audioPromptText: 'Bốn so với năm thì số nào lớn hơn?',
        illustration: '4 ○ 5',
        hint: '4 nằm bên trái 5 trên trục số, tức là nhỏ hơn.',
        options: [
          { id: 'a', text: '< (nhỏ hơn)', isCorrect: true },
          { id: 'b', text: '> (lớn hơn)', isCorrect: false },
          { id: 'c', text: '= (bằng nhau)', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Số nào lớn nhất trong dãy: 4, 2, 6, 1?',
        audioPromptText: 'Số nào lớn nhất trong các số bốn, hai, sáu, một?',
        options: [
          { id: 'a', text: '4', isCorrect: false },
          { id: 'b', text: '2', isCorrect: false },
          { id: 'c', text: '6', isCorrect: true }
        ]
      },
      {
        id: 'q3', type: 'image_choice',
        prompt: 'Hình nào có số bông hoa bằng số 5?',
        audioPromptText: 'Hình nào có đúng năm bông hoa?',
        options: [
          { id: 'a', text: '🌸 🌸 🌸 🌸', isCorrect: false },
          { id: 'b', text: '🌸 🌸 🌸 🌸 🌸', isCorrect: true },
          { id: 'c', text: '🌸 🌸 🌸', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'true_false',
        prompt: 'Đúng hay Sai: "6 lớn hơn 4"?',
        audioPromptText: 'Phát biểu sau đúng hay sai: sáu lớn hơn bốn?',
        options: [
          { id: 'true', text: '✅ Đúng', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g1_m_u1_l3',
    title: 'Số 7, 8, 9, 10 Và Thứ Tự Dãy Số',
    grade: 1, subject: 'math',
    unitId: 'g1_m_u1', unitTitle: 'Chương 1: Các số từ 0 đến 10',
    icon: '🔢', difficulty: 2,
    passingScore: 70, xpReward: 45, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g1_m_u1_l2',
    description: 'Hoàn thiện bộ số 1-10, sắp xếp dãy số tăng dần và giảm dần.',
    funFact: 'Số 10 = 1 chục! Khi đếm đến 10, bé đã đếm đủ 2 bàn tay rồi!',
    questions: [
      {
        id: 'q1', type: 'ordering',
        prompt: 'Sắp xếp các số theo thứ tự từ nhỏ đến lớn:',
        audioPromptText: 'Bé hãy sắp xếp các số từ nhỏ đến lớn: chín, bảy, tám, mười.',
        interactiveData: {
          orderItems: [
            { id: 'n9', text: '9', correctIndex: 3 },
            { id: 'n7', text: '7', correctIndex: 1 },
            { id: 'n8', text: '8', correctIndex: 2 },
            { id: 'n10', text: '10', correctIndex: 4 },
            { id: 'n6', text: '6', correctIndex: 0 }
          ]
        }
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: 'Điền số còn thiếu vào dãy: 7, 8, ___, 10',
        audioPromptText: 'Điền số còn thiếu vào dãy: bảy, tám, chỗ trống, mười.',
        hint: 'Số đứng giữa 8 và 10 là số mấy?',
        interactiveData: { blanks: ['9'] }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'Số liền sau 9 là số mấy?',
        audioPromptText: 'Số liền sau chín là số mấy?',
        options: [
          { id: 'a', text: '8', isCorrect: false },
          { id: 'b', text: '10', isCorrect: true },
          { id: 'c', text: '11', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Số nào bé nhất trong dãy: 9, 5, 10, 7, 3?',
        audioPromptText: 'Số nào nhỏ nhất: chín, năm, mười, bảy, ba?',
        options: [
          { id: 'a', text: '5', isCorrect: false },
          { id: 'b', text: '7', isCorrect: false },
          { id: 'c', text: '3', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'g1_m_u1_l4',
    title: '⚡ Thử Thách: Trắc Nghiệm Số 1-10 Siêu Tốc',
    grade: 1, subject: 'math',
    unitId: 'g1_m_u1', unitTitle: 'Chương 1: Các số từ 0 đến 10',
    icon: '🏆', difficulty: 3,
    passingScore: 80, xpReward: 80, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g1_m_u1_l3',
    description: 'Bài kiểm tra tổng hợp chương 1 — Bé trả lời nhanh để thử tài!',
    funFact: 'Nếu đạt 3 sao, bé đã sẵn sàng chinh phục chương phép cộng trừ rồi! 🚀',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Điền dấu đúng: 8 ___ 7',
        audioPromptText: 'Tám so sánh với bảy như thế nào?',
        options: [
          { id: 'a', text: '< (nhỏ hơn)', isCorrect: false },
          { id: 'b', text: '> (lớn hơn)', isCorrect: true },
          { id: 'c', text: '= (bằng)', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: '__, 4, 5, 6, __ (Điền 2 số còn thiếu, viết cách nhau bởi dấu phẩy)',
        audioPromptText: 'Điền hai số còn thiếu vào dãy: chỗ trống, bốn, năm, sáu, chỗ trống.',
        interactiveData: { blanks: ['3', '7'] }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'Số liền trước 10 là số mấy?',
        audioPromptText: 'Số liền trước mười là số mấy?',
        options: [
          { id: 'a', text: '8', isCorrect: false },
          { id: 'b', text: '9', isCorrect: true },
          { id: 'c', text: '11', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'image_choice',
        prompt: 'Chọn số ĐÚNG chỉ số lượng hình: 🌟🌟🌟🌟🌟🌟🌟',
        audioPromptText: 'Đếm xem có mấy ngôi sao rồi chọn đáp án đúng.',
        options: [
          { id: 'a', text: '6', isCorrect: false },
          { id: 'b', text: '7', isCorrect: true },
          { id: 'c', text: '8', isCorrect: false }
        ]
      },
      {
        id: 'q5', type: 'ordering',
        prompt: 'Sắp xếp từ LỚN → NHỎ: 3, 8, 1, 5, 10',
        audioPromptText: 'Sắp xếp từ lớn đến nhỏ: ba, tám, một, năm, mười.',
        interactiveData: {
          orderItems: [
            { id: 'n3', text: '3', correctIndex: 3 },
            { id: 'n8', text: '8', correctIndex: 1 },
            { id: 'n1', text: '1', correctIndex: 4 },
            { id: 'n5', text: '5', correctIndex: 2 },
            { id: 'n10', text: '10', correctIndex: 0 }
          ]
        }
      }
    ]
  },

  // ============================================================
  // LỚP 1 - CHƯƠNG 2: PHÉP CỘNG TRONG PHẠM VI 10
  // ============================================================
  {
    id: 'g1_m_u2_l1',
    title: 'Phép Cộng: 1 + 1, 2 + 1, 3 + 1 (Thêm Vào)',
    grade: 1, subject: 'math',
    unitId: 'g1_m_u2', unitTitle: 'Chương 2: Phép cộng trong phạm vi 10',
    icon: '➕', difficulty: 1,
    passingScore: 60, xpReward: 35, starsRequiredToUnlock: 0,
    description: 'Hiểu khái niệm "Thêm vào" qua hình ảnh con vật dễ thương.',
    funFact: 'Phép cộng là thêm vào! 2 + 3 = 5 vì ta thêm 3 vào 2 là có 5!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '1 + 1 = ?',
        illustration: '🐥 + 🐥 = ?',
        audioPromptText: 'Một cộng một bằng mấy?',
        options: [
          { id: 'a', text: '1', isCorrect: false },
          { id: 'b', text: '2', isCorrect: true },
          { id: 'c', text: '3', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '2 + 1 = ?',
        illustration: '🍬 🍬 + 🍬 = ?',
        audioPromptText: 'Có hai cái kẹo, thêm một cái kẹo nữa là bao nhiêu?',
        hint: 'Đếm tất cả: 1, 2, 3!',
        options: [
          { id: 'a', text: '3', isCorrect: true },
          { id: 'b', text: '4', isCorrect: false },
          { id: 'c', text: '2', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: '3 + 2 = ?',
        illustration: '🐠 🐠 🐠 + 🐠 🐠 = ?',
        audioPromptText: 'Ba chú cá cộng thêm hai chú cá bằng mấy?',
        options: [
          { id: 'a', text: '4', isCorrect: false },
          { id: 'b', text: '5', isCorrect: true },
          { id: 'c', text: '6', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'drag_and_drop',
        prompt: 'Bé có 2 bóng bay, bạn cho thêm 2 bóng nữa. Kéo đủ 4 bóng vào giỏ!',
        audioPromptText: 'Bé có hai bóng bay, bạn cho thêm hai bóng nữa. Kéo đủ bốn bóng vào giỏ!',
        interactiveData: {
          basketTargetCount: 4,
          draggableItems: [
            { id: 'b1', label: 'Bóng 1', icon: '🎈' },
            { id: 'b2', label: 'Bóng 2', icon: '🎈' },
            { id: 'b3', label: 'Bóng 3', icon: '🎈' },
            { id: 'b4', label: 'Bóng 4', icon: '🎈' },
            { id: 'b5', label: 'Bóng 5', icon: '🎈' },
            { id: 'b6', label: 'Bóng 6', icon: '🎈' }
          ]
        }
      }
    ]
  },
  {
    id: 'g1_m_u2_l2',
    title: 'Phép Cộng Phạm Vi 10: Luyện Tập Thành Thạo',
    grade: 1, subject: 'math',
    unitId: 'g1_m_u2', unitTitle: 'Chương 2: Phép cộng trong phạm vi 10',
    icon: '🎯', difficulty: 2,
    passingScore: 70, xpReward: 50, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g1_m_u2_l1',
    description: 'Luyện tập nhuần nhuyễn các phép cộng từ 1 đến 10 qua bài tập đa dạng.',
    funFact: '4 + 6 = 10 và 6 + 4 = 10 — Thứ tự cộng không làm thay đổi kết quả!',
    questions: [
      {
        id: 'q1', type: 'fill_in_the_blank',
        prompt: '5 + ___ = 8',
        audioPromptText: 'Năm cộng bao nhiêu thì bằng tám?',
        hint: '5 + ? = 8, tức là 8 - 5 = ?',
        interactiveData: { blanks: ['3'] }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '4 + 4 = ?',
        audioPromptText: 'Bốn cộng bốn bằng mấy?',
        options: [
          { id: 'a', text: '7', isCorrect: false },
          { id: 'b', text: '8', isCorrect: true },
          { id: 'c', text: '9', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: '6 + 3 = ?',
        audioPromptText: 'Sáu cộng ba bằng mấy?',
        illustration: '🌈',
        options: [
          { id: 'a', text: '8', isCorrect: false },
          { id: 'b', text: '9', isCorrect: true },
          { id: 'c', text: '10', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: '___ + 3 = 10',
        audioPromptText: 'Bao nhiêu cộng ba thì bằng mười?',
        interactiveData: { blanks: ['7'] }
      },
      {
        id: 'q5', type: 'true_false',
        prompt: '"7 + 2 = 10" — Đúng hay Sai?',
        audioPromptText: 'Bảy cộng hai có bằng mười không?',
        hint: '7 + 2 = 9, không phải 10!',
        options: [
          { id: 'true', text: '✅ Đúng', isCorrect: false },
          { id: 'false', text: '❌ Sai, 7 + 2 = 9', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'g1_m_u2_l3',
    title: 'Phép Trừ Phạm Vi 10: Bớt Đi Là Trừ',
    grade: 1, subject: 'math',
    unitId: 'g1_m_u2', unitTitle: 'Chương 2: Phép cộng trong phạm vi 10',
    icon: '➖', difficulty: 2,
    passingScore: 70, xpReward: 55, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g1_m_u2_l2',
    description: 'Học phép trừ qua câu chuyện "Bớt đi": Có 5 cái bánh, ăn 2 cái, còn lại mấy cái?',
    funFact: 'Phép cộng và phép trừ là "anh em sinh đôi": 3 + 4 = 7 thì 7 - 4 = 3!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '5 - 2 = ?',
        illustration: '🍩 🍩 🍩 🍩 🍩 → ăn 🍩 🍩 → còn?',
        audioPromptText: 'Có năm cái bánh donut, ăn đi hai cái, còn lại mấy cái?',
        options: [
          { id: 'a', text: '2', isCorrect: false },
          { id: 'b', text: '3', isCorrect: true },
          { id: 'c', text: '4', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '8 - 3 = ?',
        audioPromptText: 'Tám trừ ba bằng mấy?',
        options: [
          { id: 'a', text: '4', isCorrect: false },
          { id: 'b', text: '5', isCorrect: true },
          { id: 'c', text: '6', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '10 - ___ = 6',
        audioPromptText: 'Mười trừ bao nhiêu thì bằng sáu?',
        interactiveData: { blanks: ['4'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Cô giáo có 9 quyển vở, phát cho học sinh 4 quyển. Còn lại mấy quyển?',
        audioPromptText: 'Cô giáo có chín quyển vở, phát cho học sinh bốn quyển. Còn lại mấy quyển?',
        options: [
          { id: 'a', text: '4 quyển', isCorrect: false },
          { id: 'b', text: '5 quyển', isCorrect: true },
          { id: 'c', text: '6 quyển', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g1_m_u2_l4',
    title: '🏆 Thử Thách Vàng: Cộng Trừ Phạm Vi 10 Tổng Hợp',
    grade: 1, subject: 'math',
    unitId: 'g1_m_u2', unitTitle: 'Chương 2: Phép cộng trong phạm vi 10',
    icon: '👑', difficulty: 3,
    passingScore: 80, xpReward: 100, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g1_m_u2_l3',
    description: 'Bài kiểm tra tổng hợp CỘNG và TRỪ trong phạm vi 10 — Bé có giải đúng hết không?',
    funFact: 'Nếu bé đạt 3 sao, bé đã là nhà toán học nhí xuất sắc của lớp 1! 🏅',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '7 + 3 = ?', audioPromptText: 'Bảy cộng ba bằng mấy?',
        options: [
          { id: 'a', text: '9', isCorrect: false },
          { id: 'b', text: '10', isCorrect: true },
          { id: 'c', text: '11', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: '6 - ___ = 4',
        audioPromptText: 'Sáu trừ bao nhiêu thì bằng bốn?',
        interactiveData: { blanks: ['2'] }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'Bé có 5 kẹo, mẹ cho thêm 4 kẹo nữa. Bé có tất cả bao nhiêu kẹo?',
        audioPromptText: 'Bé có năm cái kẹo, mẹ cho thêm bốn cái nữa. Bé có tất cả bao nhiêu kẹo?',
        options: [
          { id: 'a', text: '8 cái', isCorrect: false },
          { id: 'b', text: '9 cái', isCorrect: true },
          { id: 'c', text: '10 cái', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"4 + 5 = 9" và "9 - 5 = 4" — Cả hai đều ĐÚNG?',
        audioPromptText: 'Bốn cộng năm bằng chín và chín trừ năm bằng bốn, cả hai đều đúng không?',
        options: [
          { id: 'true', text: '✅ Đúng, cả hai đều đúng!', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      },
      {
        id: 'q5', type: 'fill_in_the_blank',
        prompt: '___ + 2 = 8 (Điền số cần tìm)',
        audioPromptText: 'Bao nhiêu cộng hai thì bằng tám?',
        interactiveData: { blanks: ['6'] }
      },
      {
        id: 'q6', type: 'multiple_choice',
        prompt: 'Trường có 10 ghế, học sinh ngồi hết 7 ghế. Còn bao nhiêu ghế trống?',
        audioPromptText: 'Trường có mười cái ghế, học sinh ngồi hết bảy ghế. Còn bao nhiêu ghế trống?',
        options: [
          { id: 'a', text: '2 ghế', isCorrect: false },
          { id: 'b', text: '3 ghế', isCorrect: true },
          { id: 'c', text: '4 ghế', isCorrect: false }
        ]
      }
    ]
  },

  // ============================================================
  // LỚP 2 - CHƯƠNG 1: BẢNG CỬU CHƯƠNG 2, 3, 4, 5
  // ============================================================
  {
    id: 'g2_m_u1_l1',
    title: 'Bảng Nhân 2: Nhân Đôi Lên Thôi!',
    grade: 2, subject: 'math',
    unitId: 'g2_m_u1', unitTitle: 'Bảng nhân 2, 3, 4, 5',
    icon: '✖️', difficulty: 1,
    passingScore: 60, xpReward: 40, starsRequiredToUnlock: 0,
    description: 'Học bảng nhân 2 từ 2×1 đến 2×10 qua câu chuyện đôi giày, đôi mắt, đôi tay.',
    funFact: 'Nhân với 2 chính là cộng thêm một lần nữa: 2×5 = 5+5 = 10!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '2 × 3 = ?', illustration: '👟 👟 | 👟 👟 | 👟 👟',
        audioPromptText: 'Hai nhân ba bằng mấy?',
        options: [
          { id: 'a', text: '5', isCorrect: false },
          { id: 'b', text: '6', isCorrect: true },
          { id: 'c', text: '7', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '2 × 5 = ?', audioPromptText: 'Hai nhân năm bằng mấy?',
        hint: '2 × 5 = 5 + 5 = ?',
        options: [
          { id: 'a', text: '8', isCorrect: false },
          { id: 'b', text: '10', isCorrect: true },
          { id: 'c', text: '12', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '2 × 7 = ___', audioPromptText: 'Hai nhân bảy bằng bao nhiêu?',
        interactiveData: { blanks: ['14'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Có 4 đôi vớ. Hỏi có tất cả mấy chiếc vớ?',
        audioPromptText: 'Có bốn đôi vớ. Hỏi có tất cả bao nhiêu chiếc vớ?',
        illustration: '🧦🧦 🧦🧦 🧦🧦 🧦🧦',
        options: [
          { id: 'a', text: '6 chiếc', isCorrect: false },
          { id: 'b', text: '8 chiếc', isCorrect: true },
          { id: 'c', text: '10 chiếc', isCorrect: false }
        ]
      },
      {
        id: 'q5', type: 'fill_in_the_blank',
        prompt: '2 × ___ = 16', audioPromptText: 'Hai nhân bao nhiêu thì bằng mười sáu?',
        interactiveData: { blanks: ['8'] }
      }
    ]
  },
  {
    id: 'g2_m_u1_l2',
    title: 'Bảng Nhân 3: Ba Là Số Kì Diệu!',
    grade: 2, subject: 'math',
    unitId: 'g2_m_u1', unitTitle: 'Bảng nhân 2, 3, 4, 5',
    icon: '🔺', difficulty: 1,
    passingScore: 65, xpReward: 45, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g2_m_u1_l1',
    description: 'Chinh phục bảng nhân 3 qua hình ảnh tam giác ba cạnh, ba cánh hoa.',
    funFact: 'Số nào nhân với 3 cũng có tổng chữ số chia hết cho 3: 3×4=12, 1+2=3 ✓',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '3 × 4 = ?', audioPromptText: 'Ba nhân bốn bằng mấy?',
        options: [
          { id: 'a', text: '10', isCorrect: false },
          { id: 'b', text: '12', isCorrect: true },
          { id: 'c', text: '15', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '3 × 6 = ?', audioPromptText: 'Ba nhân sáu bằng mấy?',
        options: [
          { id: 'a', text: '15', isCorrect: false },
          { id: 'b', text: '18', isCorrect: true },
          { id: 'c', text: '21', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '3 × 8 = ___', audioPromptText: 'Ba nhân tám bằng bao nhiêu?',
        interactiveData: { blanks: ['24'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Mỗi con nhện có 8 chân. Hỏi 3 con nhện có tất cả bao nhiêu chân?',
        audioPromptText: 'Ba nhân tám bằng mấy? Có ba con nhện, mỗi con tám chân.',
        options: [
          { id: 'a', text: '21 chân', isCorrect: false },
          { id: 'b', text: '24 chân', isCorrect: true },
          { id: 'c', text: '27 chân', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g2_m_u1_l3',
    title: 'Bảng Nhân 4 & 5: Đếm Bước Chân!',
    grade: 2, subject: 'math',
    unitId: 'g2_m_u1', unitTitle: 'Bảng nhân 2, 3, 4, 5',
    icon: '🖐️', difficulty: 2,
    passingScore: 70, xpReward: 55, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g2_m_u1_l2',
    description: 'Bảng nhân 4 (cánh hoa 4 cánh) và bảng nhân 5 (bàn tay 5 ngón).',
    funFact: 'Bảng nhân 5 rất dễ nhớ: kết quả luôn tận cùng là 0 hoặc 5!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '5 × 6 = ?', audioPromptText: 'Năm nhân sáu bằng mấy?',
        options: [
          { id: 'a', text: '25', isCorrect: false },
          { id: 'b', text: '30', isCorrect: true },
          { id: 'c', text: '35', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '4 × 7 = ?', audioPromptText: 'Bốn nhân bảy bằng mấy?',
        options: [
          { id: 'a', text: '24', isCorrect: false },
          { id: 'b', text: '28', isCorrect: true },
          { id: 'c', text: '32', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '5 × 9 = ___', audioPromptText: 'Năm nhân chín bằng bao nhiêu?',
        interactiveData: { blanks: ['45'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: '4 × ___ = 32', audioPromptText: 'Bốn nhân bao nhiêu thì bằng ba mươi hai?',
        hint: '4 × 8 = 32 vì 4 × 8 = 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4',
        options: [
          { id: 'a', text: '6', isCorrect: false },
          { id: 'b', text: '7', isCorrect: false },
          { id: 'c', text: '8', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'g2_m_u1_l4',
    title: '⚡ Siêu Thách Thức: Cửu Chương 2-5 Hỗn Hợp',
    grade: 2, subject: 'math',
    unitId: 'g2_m_u1', unitTitle: 'Bảng nhân 2, 3, 4, 5',
    icon: '🌪️', difficulty: 4,
    passingScore: 85, xpReward: 150, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g2_m_u1_l3',
    description: 'Bài kiểm tra SIÊU KHÓ — Bảng nhân 2, 3, 4, 5 trộn lẫn ngẫu nhiên, không có đơn vị gợi ý!',
    funFact: 'Đạt 3 sao bài này chứng tỏ bé có khả năng tính nhẩm siêu đẳng! 🧠',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '3 × 7 = ?', audioPromptText: 'Ba nhân bảy bằng mấy?',
        options: [
          { id: 'a', text: '18', isCorrect: false },
          { id: 'b', text: '21', isCorrect: true },
          { id: 'c', text: '24', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: '4 × 9 = ___', interactiveData: { blanks: ['36'] }
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '___ × 6 = 30', interactiveData: { blanks: ['5'] }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"2 × 9 = 18" — Đúng hay Sai?',
        options: [
          { id: 'true', text: '✅ Đúng', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      },
      {
        id: 'q5', type: 'multiple_choice',
        prompt: 'Một hộp có 5 viên phấn. Hỏi 8 hộp có tất cả bao nhiêu viên phấn?',
        audioPromptText: 'Năm nhân tám bằng mấy?',
        options: [
          { id: 'a', text: '35 viên', isCorrect: false },
          { id: 'b', text: '40 viên', isCorrect: true },
          { id: 'c', text: '45 viên', isCorrect: false }
        ]
      },
      {
        id: 'q6', type: 'fill_in_the_blank',
        prompt: '3 × ___ = 27', interactiveData: { blanks: ['9'] }
      }
    ]
  },

  // ============================================================
  // LỚP 3 - CHƯƠNG 1: BẢNG CỬU CHƯƠNG 6, 7, 8, 9
  // ============================================================
  {
    id: 'g3_m_u1_l1',
    title: 'Bảng Nhân 6: Mỗi Bông Tuyết 6 Cánh',
    grade: 3, subject: 'math',
    unitId: 'g3_m_u1', unitTitle: 'Cửu chương 6, 7, 8, 9 nâng cao',
    icon: '❄️', difficulty: 1,
    passingScore: 65, xpReward: 50, starsRequiredToUnlock: 0,
    description: 'Bảng nhân 6 gắn với câu chuyện mỗi bông tuyết tuyệt đẹp có 6 cánh.',
    funFact: 'Mọi bông tuyết trên thế giới đều có đúng 6 cánh — thiên nhiên thật kỳ diệu!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '6 × 4 = ?', audioPromptText: 'Sáu nhân bốn bằng mấy?',
        options: [
          { id: 'a', text: '20', isCorrect: false },
          { id: 'b', text: '24', isCorrect: true },
          { id: 'c', text: '28', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: '6 × 7 = ___', interactiveData: { blanks: ['42'] }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: '6 × 9 = ?', audioPromptText: 'Sáu nhân chín bằng mấy?',
        options: [
          { id: 'a', text: '48', isCorrect: false },
          { id: 'b', text: '54', isCorrect: true },
          { id: 'c', text: '56', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: '___ × 6 = 48', interactiveData: { blanks: ['8'] }
      }
    ]
  },
  {
    id: 'g3_m_u1_l2',
    title: 'Bảng Nhân 7 & 8: Ghi Nhớ Cặp Đôi Đặc Biệt',
    grade: 3, subject: 'math',
    unitId: 'g3_m_u1', unitTitle: 'Cửu chương 6, 7, 8, 9 nâng cao',
    icon: '🎵', difficulty: 2,
    passingScore: 70, xpReward: 65, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g3_m_u1_l1',
    description: 'Bảng nhân 7 và 8 — Học cặp đôi đặc biệt: 7×8=56, 8×7=56.',
    funFact: '7×8=56 là phép tính khó nhất của cửu chương, bé nhớ được rồi là siêu giỏi!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '7 × 6 = ?', audioPromptText: 'Bảy nhân sáu bằng mấy?',
        options: [
          { id: 'a', text: '40', isCorrect: false },
          { id: 'b', text: '42', isCorrect: true },
          { id: 'c', text: '48', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '7 × 8 = ?', audioPromptText: 'Bảy nhân tám bằng mấy?',
        options: [
          { id: 'a', text: '54', isCorrect: false },
          { id: 'b', text: '56', isCorrect: true },
          { id: 'c', text: '63', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '8 × 9 = ___', interactiveData: { blanks: ['72'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Một tuần có 7 ngày. Hỏi 8 tuần có bao nhiêu ngày?',
        audioPromptText: 'Một tuần có bảy ngày. Tám tuần có bao nhiêu ngày?',
        options: [
          { id: 'a', text: '48 ngày', isCorrect: false },
          { id: 'b', text: '56 ngày', isCorrect: true },
          { id: 'c', text: '63 ngày', isCorrect: false }
        ]
      },
      {
        id: 'q5', type: 'fill_in_the_blank',
        prompt: '___ × 8 = 64', interactiveData: { blanks: ['8'] }
      }
    ]
  },
  {
    id: 'g3_m_u1_l3',
    title: 'Bảng Nhân 9: Bí Kíp Nhân 9 Thần Tốc Bằng Ngón Tay',
    grade: 3, subject: 'math',
    unitId: 'g3_m_u1', unitTitle: 'Cửu chương 6, 7, 8, 9 nâng cao',
    icon: '🖐️', difficulty: 2,
    passingScore: 70, xpReward: 70, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g3_m_u1_l2',
    description: 'Học bí kíp tính nhẩm bảng nhân 9 siêu nhanh bằng đôi bàn tay!',
    funFact: 'Bí kíp nhân 9: Kết quả luôn có tổng 2 chữ số = 9! (9×3=27 → 2+7=9)',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '9 × 4 = ?', audioPromptText: 'Chín nhân bốn bằng mấy?',
        hint: 'Bí kíp: 9×4 = 10×4 - 4 = 40 - 4 = 36',
        options: [
          { id: 'a', text: '27', isCorrect: false },
          { id: 'b', text: '36', isCorrect: true },
          { id: 'c', text: '45', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: '9 × 7 = ___', interactiveData: { blanks: ['63'] }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: '9 × 9 = ?', audioPromptText: 'Chín nhân chín bằng mấy?',
        options: [
          { id: 'a', text: '81', isCorrect: true },
          { id: 'b', text: '72', isCorrect: false },
          { id: 'c', text: '90', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"9 × 6 = 54" và tổng chữ số 5+4=9 — Đúng hay Sai?',
        options: [
          { id: 'true', text: '✅ Đúng', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g3_m_u1_l4',
    title: '🏆 Chiến Binh Cửu Chương 1-9: Đấu Trường Toán Học',
    grade: 3, subject: 'math',
    unitId: 'g3_m_u1', unitTitle: 'Cửu chương 6, 7, 8, 9 nâng cao',
    icon: '⚔️', difficulty: 4,
    passingScore: 85, xpReward: 200, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g3_m_u1_l3',
    description: 'ĐỈNH CAO khó nhất lớp 3 — 10 phép nhân ngẫu nhiên từ toàn bộ cửu chương 1-9!',
    funFact: 'Chinh phục bài này chứng tỏ bé đã thuộc nằm lòng toàn bộ bảng cửu chương! 🎓',
    questions: [
      { id: 'q1', type: 'fill_in_the_blank', prompt: '7 × 9 = ___', interactiveData: { blanks: ['63'] } },
      { id: 'q2', type: 'fill_in_the_blank', prompt: '8 × 6 = ___', interactiveData: { blanks: ['48'] } },
      { id: 'q3', type: 'fill_in_the_blank', prompt: '9 × 8 = ___', interactiveData: { blanks: ['72'] } },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: '6 × 7 = ?',
        options: [
          { id: 'a', text: '36', isCorrect: false },
          { id: 'b', text: '42', isCorrect: true },
          { id: 'c', text: '48', isCorrect: false }
        ]
      },
      { id: 'q5', type: 'fill_in_the_blank', prompt: '___ × 7 = 63', interactiveData: { blanks: ['9'] } },
      {
        id: 'q6', type: 'multiple_choice',
        prompt: 'Một hộp bút có 8 cây. Hỏi 7 hộp có bao nhiêu cây bút?',
        options: [
          { id: 'a', text: '48 cây', isCorrect: false },
          { id: 'b', text: '56 cây', isCorrect: true },
          { id: 'c', text: '64 cây', isCorrect: false }
        ]
      }
    ]
  },

  // ============================================================
  // LỚP 4 - PHÂN SỐ & TRUNG BÌNH CỘNG
  // ============================================================
  {
    id: 'g4_m_u1_l1',
    title: 'Phân Số Là Gì? Pizza Được Chia Đều Cho Bạn Bè',
    grade: 4, subject: 'math',
    unitId: 'g4_m_u1', unitTitle: 'Phân số và các phép tính',
    icon: '🍕', difficulty: 1,
    passingScore: 65, xpReward: 55, starsRequiredToUnlock: 0,
    description: 'Hiểu bản chất phân số qua chiếc pizza được chia đều cho nhóm bạn.',
    funFact: 'Phân số xuất hiện từ 4000 năm trước! Người Ai Cập cổ đại đã dùng phân số để chia thức ăn.',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Chiếc bánh pizza được cắt 4 phần bằng nhau. Bé ăn 1 phần. Phần bé ăn là:',
        audioPromptText: 'Chiếc bánh chia bốn phần bằng nhau, bé ăn một phần, đó là phân số gì?',
        interactiveData: {
          fractionData: { numerator: 1, denominator: 4, shape: 'circle' }
        },
        explanationStepByStep: [
          'Bước 1: Toàn bộ chiếc bánh pizza được cắt thành 4 phần bằng nhau, nên mẫu số là 4.',
          'Bước 2: Bé đã ăn 1 phần trong số 4 phần đó, nên tử số là 1.',
          'Bước 3: Viết tử số ở trên và mẫu số ở dưới, ta được phân số 1/4 (đọc là một phần tư).'
        ],
        options: [
          { id: 'a', text: '1/4 (một phần tư)', isCorrect: true },
          { id: 'b', text: '1/2 (một phần hai)', isCorrect: false },
          { id: 'c', text: '4/1', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Phân số 3/5 đọc là:',
        audioPromptText: 'Phân số ba trên năm đọc là gì?',
        interactiveData: {
          fractionData: { numerator: 3, denominator: 5, shape: 'bar' }
        },
        explanationStepByStep: [
          'Bước 1: Quan sát cấu tạo phân số: số 3 ở trên gọi là Tử số, số 5 ở dưới gọi là Mẫu số.',
          'Bước 2: Quy tắc đọc phân số: Đọc tử số trước, rồi đến chữ "phần", tiếp theo là mẫu số.',
          'Bước 3: Đọc chính xác là: Ba phần năm (hoặc ba trên năm).'
        ],
        options: [
          { id: 'a', text: 'Ba trên năm (3 phần 5)', isCorrect: true },
          { id: 'b', text: 'Năm chia ba', isCorrect: false },
          { id: 'c', text: 'Năm phần ba', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'true_false',
        prompt: '"1/2 > 1/4" (Một nửa lớn hơn một phần tư) — Đúng hay Sai?',
        explanationStepByStep: [
          'Bước 1: Quy đồng mẫu số hai phân số về mẫu số chung 4: 1/2 = 2/4.',
          'Bước 2: So sánh tử số của hai phân số có cùng mẫu 4: vì 2 > 1 nên 2/4 > 1/4.',
          'Bước 3: Do đó 1/2 lớn hơn 1/4 là khẳng định hoàn toàn ĐÚNG!'
        ],
        options: [
          { id: 'true', text: '✅ Đúng, 1/2 lớn hơn 1/4!', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Tử số của phân số 5/8 là:',
        audioPromptText: 'Tử số của phân số năm phần tám là số mấy?',
        interactiveData: {
          fractionData: { numerator: 5, denominator: 8, shape: 'bar' }
        },
        explanationStepByStep: [
          'Bước 1: Ghi nhớ vị trí: Tử số nằm ở TRÊN dấu gạch ngang, Mẫu số nằm ở DƯỚI.',
          'Bước 2: Trong phân số 5/8, số ở trên là 5.',
          'Bước 3: Vậy tử số chính là số 5.'
        ],
        options: [
          { id: 'a', text: '8', isCorrect: false },
          { id: 'b', text: '5', isCorrect: true },
          { id: 'c', text: '58', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g4_m_u1_l2',
    title: 'Rút Gọn & Quy Đồng Phân Số',
    grade: 4, subject: 'math',
    unitId: 'g4_m_u1', unitTitle: 'Phân số và các phép tính',
    icon: '⚖️', difficulty: 2,
    passingScore: 70, xpReward: 70, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g4_m_u1_l1',
    description: 'Học cách rút gọn phân số về dạng tối giản bằng ước chung lớn nhất.',
    funFact: '4/8 = 2/4 = 1/2 — Cùng một lượng nhưng cách viết khác nhau!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Rút gọn phân số 6/9 về dạng tối giản:',
        audioPromptText: 'Rút gọn sáu phần chín bằng phân số nào?',
        hint: 'ƯCLN(6,9) = 3. Chia cả tử và mẫu cho 3.',
        options: [
          { id: 'a', text: '2/3', isCorrect: true },
          { id: 'b', text: '3/4', isCorrect: false },
          { id: 'c', text: '1/2', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Rút gọn 8/12:',
        audioPromptText: 'Tám phần mười hai rút gọn bằng phân số gì?',
        options: [
          { id: 'a', text: '3/4', isCorrect: false },
          { id: 'b', text: '2/3', isCorrect: true },
          { id: 'c', text: '4/6', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '10/15 rút gọn = ___ / ___  (Viết theo dạng a/b)',
        audioPromptText: 'Mười phần mười lăm rút gọn bằng bao nhiêu?',
        interactiveData: { blanks: ['2/3'] }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"4/6 và 2/3 là hai phân số bằng nhau" — Đúng hay Sai?',
        options: [
          { id: 'true', text: '✅ Đúng', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g4_m_u1_l3',
    title: 'Cộng Trừ Phân Số Cùng Mẫu Số',
    grade: 4, subject: 'math',
    unitId: 'g4_m_u1', unitTitle: 'Phân số và các phép tính',
    icon: '🔢', difficulty: 2,
    passingScore: 70, xpReward: 75, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g4_m_u1_l2',
    description: 'Thực hiện phép cộng và trừ hai phân số có cùng mẫu số một cách chính xác.',
    funFact: 'Cộng phân số cùng mẫu rất đơn giản: chỉ cộng tử số, giữ nguyên mẫu số!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '1/5 + 2/5 = ?', audioPromptText: 'Một phần năm cộng hai phần năm bằng mấy?',
        options: [
          { id: 'a', text: '2/10', isCorrect: false },
          { id: 'b', text: '3/5', isCorrect: true },
          { id: 'c', text: '3/10', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: '4/7 - 2/7 = ___', interactiveData: { blanks: ['2/7'] }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: '3/8 + 4/8 = ?', audioPromptText: 'Ba phần tám cộng bốn phần tám bằng mấy?',
        options: [
          { id: 'a', text: '6/8', isCorrect: false },
          { id: 'b', text: '7/8', isCorrect: true },
          { id: 'c', text: '8/8', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Mẹ dùng 2/6 kg đường để làm bánh, rồi dùng thêm 3/6 kg nữa. Mẹ đã dùng tất cả bao nhiêu kg đường?',
        audioPromptText: 'Hai phần sáu cộng ba phần sáu bằng mấy?',
        options: [
          { id: 'a', text: '4/6 kg', isCorrect: false },
          { id: 'b', text: '5/6 kg', isCorrect: true },
          { id: 'c', text: '5/12 kg', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g4_m_u1_l4',
    title: '🔥 Khó: Cộng Trừ Phân Số Khác Mẫu & Trung Bình Cộng',
    grade: 4, subject: 'math',
    unitId: 'g4_m_u1', unitTitle: 'Phân số và các phép tính',
    icon: '🧠', difficulty: 3,
    passingScore: 75, xpReward: 120, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g4_m_u1_l3',
    description: 'Quy đồng mẫu số khác nhau trước khi cộng trừ, và tính trung bình cộng của dãy số.',
    funFact: 'Trung bình cộng = (Tổng tất cả các số) ÷ (Số lượng các số đó)',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '1/2 + 1/4 = ? (Quy đồng mẫu số)',
        audioPromptText: 'Một phần hai cộng một phần bốn bằng mấy?',
        hint: '1/2 = 2/4. Vậy 2/4 + 1/4 = ?',
        explanationStepByStep: [
          'Bước 1: Hai phân số khác mẫu số (2 và 4). Ta chọn Mẫu số chung là 4 vì 4 chia hết cho 2.',
          'Bước 2: Quy đồng phân số 1/2: Nhân cả tử và mẫu với 2 được 1/2 = 2/4.',
          'Bước 3: Thực hiện phép cộng hai phân số cùng mẫu: 2/4 + 1/4 = (2 + 1)/4 = 3/4.'
        ],
        options: [
          { id: 'a', text: '2/6', isCorrect: false },
          { id: 'b', text: '3/4', isCorrect: true },
          { id: 'c', text: '2/4', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Trung bình cộng của 6, 8, 10 là:',
        audioPromptText: 'Trung bình cộng của sáu, tám và mười là bao nhiêu?',
        hint: 'Trung bình = (6+8+10) ÷ 3 = 24 ÷ 3',
        explanationStepByStep: [
          'Bước 1: Tính tổng của tất cả các số hạng: 6 + 8 + 10 = 24.',
          'Bước 2: Đếm số lượng các số hạng: có 3 số tất cả.',
          'Bước 3: Lấy tổng chia cho số lượng số hạng: 24 ÷ 3 = 8.'
        ],
        options: [
          { id: 'a', text: '7', isCorrect: false },
          { id: 'b', text: '8', isCorrect: true },
          { id: 'c', text: '9', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Trung bình cộng của 5, 15, 25, 35 = ___',
        explanationStepByStep: [
          'Bước 1: Tính tổng 4 số: 5 + 15 + 25 + 35 = 80.',
          'Bước 2: Đếm số lượng các số hạng: có 4 số hạng.',
          'Bước 3: Tính số trung bình cộng: 80 ÷ 4 = 20.'
        ],
        interactiveData: { blanks: ['20'] }
      }
    ]
  },

  // ============================================================
  // LỚP 5 - SỐ THẬP PHÂN, VẬN TỐC, THỂ TÍCH
  // ============================================================
  {
    id: 'g5_m_u1_l1',
    title: 'Số Thập Phân: Hiểu Từ Dấu Phẩy Thập Phân',
    grade: 5, subject: 'math',
    unitId: 'g5_m_u1', unitTitle: 'Số thập phân và ứng dụng',
    icon: '🔸', difficulty: 1,
    passingScore: 65, xpReward: 60, starsRequiredToUnlock: 0,
    description: 'Đọc, viết và so sánh số thập phân qua ví dụ chiều cao, cân nặng, giá tiền.',
    funFact: 'Số thập phân 1,5 chính là 1 + 1/2. Mỗi chữ số sau dấu phẩy là phần mười!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Số 4,7 đọc là:', audioPromptText: 'Số bốn phẩy bảy đọc như thế nào?',
        options: [
          { id: 'a', text: 'Bốn phẩy bảy', isCorrect: true },
          { id: 'b', text: 'Bốn mươi bảy', isCorrect: false },
          { id: 'c', text: 'Bảy phẩy bốn', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'So sánh: 3,5 ___ 3,8',
        audioPromptText: 'Ba phẩy năm so với ba phẩy tám thì số nào lớn hơn?',
        options: [
          { id: 'a', text: '< (nhỏ hơn)', isCorrect: true },
          { id: 'b', text: '> (lớn hơn)', isCorrect: false },
          { id: 'c', text: '= (bằng nhau)', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'Bé cao 1,35m. Số đó đọc là:', audioPromptText: 'Đọc số một phẩy ba mươi lăm mét như thế nào?',
        options: [
          { id: 'a', text: 'Một mét ba mươi lăm xăng-ti-mét', isCorrect: true },
          { id: 'b', text: 'Một trăm ba mươi lăm mét', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'ordering',
        prompt: 'Sắp xếp từ nhỏ đến lớn: 2,7 / 2,3 / 2,9 / 2,1',
        interactiveData: {
          orderItems: [
            { id: 'd27', text: '2,7', correctIndex: 2 },
            { id: 'd23', text: '2,3', correctIndex: 1 },
            { id: 'd29', text: '2,9', correctIndex: 3 },
            { id: 'd21', text: '2,1', correctIndex: 0 }
          ]
        }
      }
    ]
  },
  {
    id: 'g5_m_u1_l2',
    title: 'Cộng Trừ Nhân Chia Số Thập Phân',
    grade: 5, subject: 'math',
    unitId: 'g5_m_u1', unitTitle: 'Số thập phân và ứng dụng',
    icon: '🧮', difficulty: 2,
    passingScore: 70, xpReward: 75, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g5_m_u1_l1',
    description: 'Thực hiện 4 phép tính với số thập phân cẩn thận, chú ý vị trí dấu phẩy.',
    funFact: 'Khi nhân 2 số thập phân, tổng số chữ số thập phân của kết quả = tổng của 2 số nhân!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '3,5 + 2,8 = ?', audioPromptText: 'Ba phẩy năm cộng hai phẩy tám bằng mấy?',
        options: [
          { id: 'a', text: '5,3', isCorrect: false },
          { id: 'b', text: '6,3', isCorrect: true },
          { id: 'c', text: '6,13', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: '7,6 - 3,4 = ___', interactiveData: { blanks: ['4,2'] }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: '2,5 × 4 = ?', audioPromptText: 'Hai phẩy năm nhân bốn bằng mấy?',
        options: [
          { id: 'a', text: '8', isCorrect: false },
          { id: 'b', text: '10', isCorrect: true },
          { id: 'c', text: '9,5', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Mẹ mua 3 kg táo, mỗi kg giá 15,5 nghìn đồng. Mẹ trả bao nhiêu tiền?',
        audioPromptText: 'Mười lăm phẩy năm nhân ba bằng mấy nghìn đồng?',
        options: [
          { id: 'a', text: '45,5 nghìn đồng', isCorrect: false },
          { id: 'b', text: '46,5 nghìn đồng', isCorrect: true },
          { id: 'c', text: '47 nghìn đồng', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g5_m_u1_l3',
    title: 'Vận Tốc, Quãng Đường & Thời Gian (v = s ÷ t)',
    grade: 5, subject: 'math',
    unitId: 'g5_m_u1', unitTitle: 'Số thập phân và ứng dụng',
    icon: '🚗', difficulty: 3,
    passingScore: 75, xpReward: 100, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g5_m_u1_l2',
    description: 'Giải bài toán vận tốc - quãng đường - thời gian bằng công thức tam giác.',
    funFact: 'Ánh sáng di chuyển nhanh nhất vũ trụ: 300.000 km/s — tức là đi quanh Trái Đất 7 vòng chỉ trong 1 giây!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Ô tô đi 120km trong 2 giờ. Vận tốc của ô tô là: (v = s ÷ t)',
        audioPromptText: 'Ô tô đi một trăm hai mươi ki-lô-mét trong hai giờ. Vận tốc bằng bao nhiêu?',
        explanationStepByStep: [
          'Bước 1: Nhớ lại công thức tính vận tốc: v = s ÷ t (Vận tốc = Quãng đường ÷ Thời gian).',
          'Bước 2: Thay số vào bài: Quãng đường s = 120 km, Thời gian t = 2 giờ.',
          'Bước 3: Thực hiện phép chia: v = 120 ÷ 2 = 60 km/h.'
        ],
        options: [
          { id: 'a', text: '50 km/h', isCorrect: false },
          { id: 'b', text: '60 km/h', isCorrect: true },
          { id: 'c', text: '70 km/h', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Xe máy đi với vận tốc 40 km/h trong 3 giờ. Quãng đường đi được: (s = v × t)',
        audioPromptText: 'Xe máy chạy bốn mươi ki-lô-mét giờ trong ba giờ. Quãng đường bằng bao nhiêu?',
        explanationStepByStep: [
          'Bước 1: Nhớ lại công thức tính quãng đường: s = v × t (Quãng đường = Vận tốc × Thời gian).',
          'Bước 2: Thay số vào bài: Vận tốc v = 40 km/h, Thời gian t = 3 giờ.',
          'Bước 3: Thực hiện phép nhân: s = 40 × 3 = 120 km.'
        ],
        options: [
          { id: 'a', text: '100 km', isCorrect: false },
          { id: 'b', text: '120 km', isCorrect: true },
          { id: 'c', text: '130 km', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Người đi bộ đi quãng đường 6km với vận tốc 4 km/h. Thời gian đi: t = s ÷ v = 6 ÷ 4 = ___ giờ',
        explanationStepByStep: [
          'Bước 1: Sử dụng công thức tính thời gian: t = s ÷ v (Thời gian = Quãng đường ÷ Vận tốc).',
          'Bước 2: Lấy 6 chia cho 4: 6 ÷ 4 = 1,5.',
          'Bước 3: Đáp số điền vào chỗ trống là: 1,5 giờ (tức 1 giờ 30 phút).'
        ],
        interactiveData: { blanks: ['1,5'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Tàu hỏa đi từ A đến B mất 4 giờ, vận tốc 75 km/h. Khoảng cách A-B là:',
        audioPromptText: 'Bảy mươi lăm nhân bốn bằng bao nhiêu ki-lô-mét?',
        explanationStepByStep: [
          'Bước 1: Khoảng cách giữa hai điểm A và B chính là độ dài quãng đường s: s = v × t.',
          'Bước 2: Vận tốc v = 75 km/h và thời gian t = 4 giờ.',
          'Bước 3: Tính phép nhân: 75 × 4 = 300 km.'
        ],
        options: [
          { id: 'a', text: '280 km', isCorrect: false },
          { id: 'b', text: '300 km', isCorrect: true },
          { id: 'c', text: '320 km', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g5_m_u1_l4',
    title: '⚡ SIÊU THÁCH THỨC: Phần Trăm & Toán Tổng Hợp Lớp 5',
    grade: 5, subject: 'math',
    unitId: 'g5_m_u1', unitTitle: 'Số thập phân và ứng dụng',
    icon: '🌋', difficulty: 4,
    passingScore: 85, xpReward: 250, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g5_m_u1_l3',
    description: 'Bài kiểm tra ĐỈNH CAO Lớp 5 — Phần trăm, thể tích hình hộp, vận tốc ngược chiều!',
    funFact: 'Đây là bài khó nhất trong ứng dụng! Đạt 3 sao là bé đã học vượt chương trình tiểu học! 🚀',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '30% của 200 = ?', audioPromptText: 'Ba mươi phần trăm của hai trăm bằng mấy?',
        hint: '30% = 30/100. Vậy 200 × 30/100 = ?',
        options: [
          { id: 'a', text: '50', isCorrect: false },
          { id: 'b', text: '60', isCorrect: true },
          { id: 'c', text: '70', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Hình hộp chữ nhật: dài 4cm, rộng 3cm, cao 5cm. Thể tích = dài × rộng × cao = ?',
        audioPromptText: 'Thể tích hình hộp chữ nhật bốn nhân ba nhân năm bằng mấy?',
        options: [
          { id: 'a', text: '50 cm³', isCorrect: false },
          { id: 'b', text: '60 cm³', isCorrect: true },
          { id: 'c', text: '70 cm³', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '2 xe đi ngược chiều. Xe A: 60km/h, Xe B: 40km/h. Sau 2 giờ khoảng cách = ___km',
        interactiveData: { blanks: ['200'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Giá áo giảm 25% từ 200.000đ. Giá sau giảm là:',
        audioPromptText: 'Giá áo hai trăm nghìn đồng giảm hai mươi lăm phần trăm thì còn lại bao nhiêu?',
        options: [
          { id: 'a', text: '140.000đ', isCorrect: false },
          { id: 'b', text: '150.000đ', isCorrect: true },
          { id: 'c', text: '160.000đ', isCorrect: false }
        ]
      }
    ]
  },

  // ============================================================
  // LỚP 4 - CHƯƠNG 3: HÌNH HỌC VÀ TOÁN TƯ DUY LOGIC
  // ============================================================
  {
    id: 'g4_m_u3_l1',
    title: 'Dãy Số Có Quy Luật & Bài Toán Trồng Cây',
    grade: 4, subject: 'math',
    unitId: 'g4_m_u3', unitTitle: 'Chương 3: Toán tư duy & Hình học 4',
    icon: '🌳', difficulty: 3,
    passingScore: 75, xpReward: 130, starsRequiredToUnlock: 2,
    description: 'Khám phá quy luật dãy số cách đều và công thức giải bài toán trồng cây kinh điển.',
    funFact: 'Trồng cây cả 2 đầu đường: Số cây = Số khoảng cách + 1!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Đoạn đường dài 20m, trồng cây cách nhau 5m ở cả 2 đầu. Có tất cả bao nhiêu cây?',
        audioPromptText: 'Đoạn đường hai mươi mét, trồng cây cách nhau năm mét cả hai đầu thì có mấy cây?',
        hint: 'Số khoảng cách = 20 : 5 = 4. Số cây = 4 + 1 = ?',
        options: [
          { id: 'a', text: '4 cây', isCorrect: false },
          { id: 'b', text: '5 cây', isCorrect: true },
          { id: 'c', text: '6 cây', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: 'Tìm số tiếp theo trong dãy số: 3, 7, 11, 15, ___ (mỗi số cách nhau 4 đơn vị)',
        interactiveData: { blanks: ['19'] }
      },
      {
        id: 'q3', type: 'ordering',
        prompt: 'Sắp xếp dãy số theo thứ tự tăng dần:',
        interactiveData: {
          orderItems: [
            { id: '1', text: '105', correctIndex: 0 },
            { id: '2', text: '210', correctIndex: 1 },
            { id: '3', text: '315', correctIndex: 2 },
            { id: '4', text: '420', correctIndex: 3 }
          ]
        }
      }
    ]
  },
  {
    id: 'g4_m_u3_l2',
    title: 'Phép Nhân Số Có Nhiều Chữ Số & Tính Nhanh Thuận Tiện',
    grade: 4, subject: 'math',
    unitId: 'g4_m_u3', unitTitle: 'Chương 3: Toán tư duy & Hình học 4',
    icon: '⚡', difficulty: 2,
    passingScore: 70, xpReward: 110, starsRequiredToUnlock: 2,
    description: 'Áp dụng tính chất kết hợp và giao hoán: a × b = b × a, gom số tròn chục tròn trăm.',
    funFact: 'Nhân với 11 cực dễ: Ví dụ 25 × 11 = 2 (2+5) 5 = 275!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Tính nhanh: 25 × 37 × 4 = ?',
        audioPromptText: 'Hai mươi lăm nhân ba mươi bảy nhân bốn bằng bao nhiêu?',
        hint: 'Gom (25 × 4) = 100. Sau đó 100 × 37 = ?',
        options: [
          { id: 'a', text: '3.700', isCorrect: true },
          { id: 'b', text: '370', isCorrect: false },
          { id: 'c', text: '7.400', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: 'Tính nhanh phép nhân nhẩm với 11: 34 × 11 = ___',
        interactiveData: { blanks: ['374'] }
      },
      {
        id: 'q3', type: 'true_false',
        prompt: '125 × 8 = 1.000 (Một nghìn) — Đúng hay Sai?',
        options: [
          { id: 't', text: '✅ Đúng', isCorrect: true },
          { id: 'f', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g4_m_u3_l3',
    title: 'Hình Bình Hành & Hình Thoi: Chu Vi & Diện Tích',
    grade: 4, subject: 'math',
    unitId: 'g4_m_u3', unitTitle: 'Chương 3: Toán tư duy & Hình học 4',
    icon: '🔷', difficulty: 3,
    passingScore: 75, xpReward: 140, starsRequiredToUnlock: 3,
    description: 'Diện tích hình bình hành S = a × h. Diện tích hình thoi S = (m × n) : 2.',
    funFact: 'Hình thoi có hai đường chéo vuông góc với nhau và cắt nhau tại trung điểm của mỗi đường!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Hình bình hành có độ dài đáy 12cm và chiều cao 5cm. Diện tích là:',
        options: [
          { id: 'a', text: '60 cm²', isCorrect: true },
          { id: 'b', text: '30 cm²', isCorrect: false },
          { id: 'c', text: '34 cm²', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Hình thoi có độ dài 2 đường chéo là 8cm và 6cm. Diện tích là:',
        hint: 'S = (8 × 6) : 2 = ?',
        options: [
          { id: 'a', text: '48 cm²', isCorrect: false },
          { id: 'b', text: '24 cm²', isCorrect: true },
          { id: 'c', text: '14 cm²', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Hình vuông có cạnh 9cm thì diện tích bằng ___ cm²',
        interactiveData: { blanks: ['81'] }
      }
    ]
  },

  // ============================================================
  // LỚP 5 - CHƯƠNG 3: TOÁN CHUYỂN ĐỘNG & TỔNG ÔN TOÀN DIỆN
  // ============================================================
  {
    id: 'g5_m_u3_l1',
    title: 'Toán Tỉ Lệ Bản Đồ & Diện Tích Thực Tế',
    grade: 5, subject: 'math',
    unitId: 'g5_m_u3', unitTitle: 'Chương 3: Vận tốc & Ôn tập toàn diện',
    icon: '🗺️', difficulty: 3,
    passingScore: 75, xpReward: 160, starsRequiredToUnlock: 2,
    description: 'Quy đổi tỉ lệ bản đồ: 1 : 100.000, tính khoảng cách thực tế giữa hai thành phố.',
    funFact: 'Tỉ lệ 1 : 1.000.000 nghĩa là 1 cm trên bản đồ tương ứng 10 km ngoài đời thực!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Trên bản đồ tỉ lệ 1 : 1.000.000, khoảng cách Hà Nội - Hải Phòng đo được 10cm. Khoảng cách thực tế là:',
        options: [
          { id: 'a', text: '100 km (10 × 1.000.000 cm = 10.000.000 cm = 100 km)', isCorrect: true },
          { id: 'b', text: '10 km', isCorrect: false },
          { id: 'c', text: '1.000 km', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: 'Trên bản đồ tỉ lệ 1 : 500, một mảnh đất dài 4cm. Chiều dài thực tế là ___ mét.',
        hint: '4 × 500 = 2000 cm = 20 m',
        interactiveData: { blanks: ['20'] }
      },
      {
        id: 'q3', type: 'true_false',
        prompt: '1 hecta (1 ha) bằng 10.000 mét vuông (m²) — Đúng hay Sai?',
        options: [
          { id: 't', text: '✅ Đúng', isCorrect: true },
          { id: 'f', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g5_m_u3_l2',
    title: 'Toán Chuyển Động: Ca Nô Xuôi Dòng & Ngược Dòng',
    grade: 5, subject: 'math',
    unitId: 'g5_m_u3', unitTitle: 'Chương 3: Vận tốc & Ôn tập toàn diện',
    icon: '🚤', difficulty: 4,
    passingScore: 80, xpReward: 200, starsRequiredToUnlock: 3,
    description: 'Vận tốc xuôi dòng = V thực + V nước. Vận tốc ngược dòng = V thực - V nước.',
    funFact: 'Hiệu vận tốc xuôi dòng và ngược dòng luôn gấp 2 lần vận tốc dòng nước!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Ca nô có vận tốc thực 25 km/h, dòng nước chảy 3 km/h. Vận tốc ca nô khi xuôi dòng là:',
        options: [
          { id: 'a', text: '28 km/h (25 + 3)', isCorrect: true },
          { id: 'b', text: '22 km/h', isCorrect: false },
          { id: 'c', text: '75 km/h', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Cùng ca nô trên, khi chạy NGƯỢC DÒNG thì vận tốc là:',
        options: [
          { id: 'a', text: '22 km/h (25 - 3)', isCorrect: true },
          { id: 'b', text: '28 km/h', isCorrect: false },
          { id: 'c', text: '25 km/h', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Một ca nô xuôi dòng với vận tốc 30 km/h. Sau 3 giờ ca nô đi được ___ km.',
        interactiveData: { blanks: ['90'] }
      }
    ]
  },
  {
    id: 'g5_m_u3_l3',
    title: '⚡ ĐẤU TRƯỜNG TOÁN TUỔI THƠ 5: Đề Thi Chinh Phục Điểm 10',
    grade: 5, subject: 'math',
    unitId: 'g5_m_u3', unitTitle: 'Chương 3: Vận tốc & Ôn tập toàn diện',
    icon: '🏆', difficulty: 4,
    passingScore: 85, xpReward: 280, starsRequiredToUnlock: 4,
    description: 'Bài thi thử thách cao nhất của cấp 1 — Chinh phục toàn bộ các câu hỏi toán học đỉnh cao!',
    funFact: 'Toán học là mẹ của mọi ngành khoa học — Chúc mừng bé đã hoàn thành toàn bộ lộ trình cấp tiểu học!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Một hình tròn có bán kính r = 5cm. Diện tích S = r × r × 3,14 bằng:',
        options: [
          { id: 'a', text: '78,5 cm²', isCorrect: true },
          { id: 'b', text: '31,4 cm²', isCorrect: false },
          { id: 'c', text: '15,7 cm²', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Nối công thức với hình học tương ứng:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'S = a × h', right: 'Hình bình hành', leftEmoji: '📐', rightEmoji: '🔷' },
            { id: 'p2', left: 'S = (a + b) × h : 2', right: 'Hình thang', leftEmoji: '📐', rightEmoji: '🛑' },
            { id: 'p3', left: 'S = r × r × 3,14', right: 'Hình tròn', leftEmoji: '📐', rightEmoji: '⚪' }
          ]
        }
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Một lớp có 40 học sinh, trong đó có 24 bạn nữ. Tỉ số phần trăm của học sinh nữ là ___ %',
        hint: '24 : 40 = 0,6 = 60%',
        interactiveData: { blanks: ['60'] }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: 'Tổng các góc trong một tam giác luôn luôn bằng 180 độ — Đúng hay Sai?',
        options: [
          { id: 't', text: '✅ Đúng', isCorrect: true },
          { id: 'f', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  }
];

