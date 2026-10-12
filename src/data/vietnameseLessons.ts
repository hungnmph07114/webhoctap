// ================================================================
// NGÂN HÀNG BÀI HỌC - MÔN TIẾNG VIỆT | LỚP 1 -> LỚP 5
// ================================================================
import { Lesson } from '../types/curriculum';

export const VIETNAMESE_LESSONS: Lesson[] = [

  // ============================================================
  // LỚP 1 - CHƯƠNG 1: HỌC BẢNG CHỮ CÁI & ĐÁNH VẦN
  // ============================================================
  {
    id: 'g1_v_u1_l1',
    title: 'Nhận Diện Chữ Cái A, B, C, D',
    grade: 1, subject: 'vietnamese',
    unitId: 'g1_v_u1', unitTitle: 'Bảng chữ cái & Âm đầu',
    icon: '🅰️', difficulty: 1,
    passingScore: 60, xpReward: 30, starsRequiredToUnlock: 0,
    description: 'Bé học nhận diện 4 chữ cái đầu tiên: A, B, C, D qua hình ảnh sinh động.',
    funFact: 'Tiếng Việt có 29 chữ cái! Bé đang học 4 chữ cái đầu tiên rồi đó!',
    questions: [
      {
        id: 'q1', type: 'image_choice',
        prompt: 'Chọn chữ cái viết hoa "A":',
        audioPromptText: 'Bé hãy tìm chữ A viết hoa nhé!',
        options: [
          { id: 'a', text: 'A', isCorrect: true },
          { id: 'b', text: 'B', isCorrect: false },
          { id: 'c', text: 'C', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"Quả _____ thơm ngọt" — Điền từ bắt đầu bằng chữ A vào chỗ trống:',
        audioPromptText: 'Quả gì thơm ngọt bắt đầu bằng chữ A?',
        options: [
          { id: 'a', text: 'ổi', isCorrect: false },
          { id: 'b', text: 'chuối', isCorrect: false },
          { id: 'c', text: 'anh đào', isCorrect: true }
        ]
      },
      {
        id: 'q3', type: 'word_match',
        prompt: 'Nối chữ cái với hình ảnh tương ứng:',
        audioPromptText: 'Bé hãy nối chữ cái với hình ảnh đúng nhé!',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'A', right: 'Áo', leftEmoji: '🅰️', rightEmoji: '👕' },
            { id: 'p2', left: 'B', right: 'Bóng', leftEmoji: '🅱️', rightEmoji: '⚽' },
            { id: 'p3', left: 'C', right: 'Cây', leftEmoji: '🔤', rightEmoji: '🌳' }
          ]
        }
      },
      {
        id: 'q4', type: 'writing_practice',
        prompt: 'Bé hãy tập viết chữ "A" hoa vào vở ô ly!',
        audioPromptText: 'Nắn nót viết chữ A hoa thật đẹp nhé bé!',
        interactiveData: {
          writingCharacter: 'A',
          writingGuidelines: [
            'Nét 1: Đặt bút ở đường kẻ 2, kéo lên đỉnh góc trái.',
            'Nét 2: Từ đỉnh kéo xuống bên phải đến đường kẻ 1.',
            'Nét 3: Kẻ ngang nối hai nét chéo ở giữa.'
          ]
        }
      }
    ]
  },
  {
    id: 'g1_v_u1_l2',
    title: 'Các Âm Ghép: CH, GH, KH, PH, TH, TR, NG',
    grade: 1, subject: 'vietnamese',
    unitId: 'g1_v_u1', unitTitle: 'Bảng chữ cái & Âm đầu',
    icon: '🔤', difficulty: 1,
    passingScore: 65, xpReward: 40, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g1_v_u1_l1',
    description: 'Nhận diện và phát âm đúng các âm ghép cơ bản của Tiếng Việt.',
    funFact: 'Tiếng Việt có những âm ghép rất đặc biệt như "NG" và "NGH" mà nhiều tiếng khác không có!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Từ "chim" bắt đầu bằng âm ghép nào?',
        audioPromptText: 'Từ chim bắt đầu bằng âm ghép gì?',
        options: [
          { id: 'a', text: 'CH', isCorrect: true },
          { id: 'b', text: 'GH', isCorrect: false },
          { id: 'c', text: 'KH', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Từ "khỉ" bắt đầu bằng âm ghép nào?',
        audioPromptText: 'Từ khỉ bắt đầu bằng âm ghép gì?',
        options: [
          { id: 'a', text: 'TH', isCorrect: false },
          { id: 'b', text: 'KH', isCorrect: true },
          { id: 'c', text: 'PH', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'word_match',
        prompt: 'Nối từ với âm ghép đúng:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'CH', right: 'chó', leftEmoji: '📝', rightEmoji: '🐕' },
            { id: 'p2', left: 'TH', right: 'thỏ', leftEmoji: '📝', rightEmoji: '🐇' },
            { id: 'p3', left: 'NG', right: 'ngựa', leftEmoji: '📝', rightEmoji: '🐎' }
          ]
        }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"Phở" bắt đầu bằng âm ghép PH — Đúng hay Sai?',
        options: [
          { id: 'true', text: '✅ Đúng', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g1_v_u1_l3',
    title: '5 Dấu Thanh & Cách Đọc Đúng Giọng Tiếng Việt',
    grade: 1, subject: 'vietnamese',
    unitId: 'g1_v_u1', unitTitle: 'Bảng chữ cái & Âm đầu',
    icon: '🎵', difficulty: 2,
    passingScore: 70, xpReward: 50, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g1_v_u1_l2',
    description: 'Nhận diện 5 dấu thanh điệu và cách chúng làm thay đổi hoàn toàn nghĩa của từ.',
    funFact: 'Tiếng Việt có 6 thanh điệu: Ngang, Huyền (\\), Sắc (/), Hỏi (?), Ngã (~), Nặng (.) — Đây là đặc điểm rất hiếm trên thế giới!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Từ "ma" thêm dấu SẮC (/) tạo thành từ gì?',
        audioPromptText: 'Chữ ma thêm dấu sắc thành từ gì?',
        options: [
          { id: 'a', text: 'mà (huyền)', isCorrect: false },
          { id: 'b', text: 'má (sắc = người mẹ)', isCorrect: true },
          { id: 'c', text: 'mả (hỏi = mộ phần)', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"Bà" khác "ba" ở điểm nào?',
        audioPromptText: 'Chữ bà và chữ ba khác nhau ở điểm nào?',
        options: [
          { id: 'a', text: 'Khác phụ âm đầu', isCorrect: false },
          { id: 'b', text: 'Khác dấu thanh: bà có dấu Huyền, ba không có dấu', isCorrect: true },
          { id: 'c', text: 'Khác vần', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'word_match',
        prompt: 'Nối dấu thanh với nghĩa:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'ca (không dấu)', right: 'hát ca, ca sĩ', leftEmoji: '🎵', rightEmoji: '🎤' },
            { id: 'p2', left: 'cà (huyền)', right: 'cà chua, cà tím', leftEmoji: '🎵', rightEmoji: '🍅' },
            { id: 'p3', left: 'cá (sắc)', right: 'con cá bơi dưới nước', leftEmoji: '🎵', rightEmoji: '🐟' }
          ]
        }
      },
      {
        id: 'q4', type: 'writing_practice',
        prompt: 'Tập viết từ "bà" (chữ b nhỏ + chữ a + dấu huyền \\):',
        audioPromptText: 'Nắn nót viết từ bà thật đẹp nhé!',
        interactiveData: {
          writingCharacter: 'bà',
          writingGuidelines: [
            'Viết chữ b: Kéo nét thẳng từ đường kẻ 3 xuống dưới, rồi uốn vòng tròn sang phải.',
            'Viết chữ a: Vẽ vòng tròn bên phải, kéo nét thẳng xuống.',
            'Thêm dấu huyền (\\) nghiêng từ phải sang trái ở trên.'
          ]
        }
      }
    ]
  },
  {
    id: 'g1_v_u1_l4',
    title: '🏆 Ghép Âm Đánh Vần: Tạo Từ Có Nghĩa',
    grade: 1, subject: 'vietnamese',
    unitId: 'g1_v_u1', unitTitle: 'Bảng chữ cái & Âm đầu',
    icon: '🧩', difficulty: 3,
    passingScore: 80, xpReward: 90, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g1_v_u1_l3',
    description: 'Ghép âm đầu + vần + thanh điệu tạo thành từ có nghĩa hoàn chỉnh.',
    funFact: 'Mỗi tiếng Việt = Âm đầu + Vần + Dấu thanh. Đơn giản mà tạo ra hàng vạn từ!',
    questions: [
      {
        id: 'q1', type: 'ordering',
        prompt: 'Sắp xếp thành từ đúng: DÀO / AN / BI',
        audioPromptText: 'Bé sắp xếp ba phần này thành từ BI AN ĐAO nhé!',
        interactiveData: {
          orderItems: [
            { id: 'bi', text: 'BI', correctIndex: 0 },
            { id: 'an', text: 'AN', correctIndex: 1 },
            { id: 'dao', text: 'ĐÀO', correctIndex: 2 }
          ]
        }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Ghép "CH" + "IM" + "không dấu" tạo thành từ gì?',
        audioPromptText: 'Âm chờ cộng với vần im cộng với không dấu, tạo thành từ gì?',
        options: [
          { id: 'a', text: 'chim (con chim)', isCorrect: true },
          { id: 'b', text: 'chìm (chìm xuống)', isCorrect: false },
          { id: 'c', text: 'chím', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'B + A + dấu SẮC = ___',
        audioPromptText: 'Chữ bờ cộng chữ a cộng dấu sắc bằng từ gì?',
        interactiveData: { blanks: ['bá'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Từ "CÀY" (dụng cụ làm đất) gồm những phần nào?',
        options: [
          { id: 'a', text: 'C + ÀY + không dấu', isCorrect: false },
          { id: 'b', text: 'C + AY + dấu Huyền (\\)', isCorrect: true },
          { id: 'c', text: 'C + ÂY + dấu Huyền', isCorrect: false }
        ]
      }
    ]
  },

  // ============================================================
  // LỚP 2 - CHÍNH TẢ & VỐN TỪ
  // ============================================================
  {
    id: 'g2_v_u1_l1',
    title: 'Phân Biệt Chính Tả: L/N, S/X, D/GI/R',
    grade: 2, subject: 'vietnamese',
    unitId: 'g2_v_u1', unitTitle: 'Chính tả âm đầu khó',
    icon: '✏️', difficulty: 1,
    passingScore: 65, xpReward: 45, starsRequiredToUnlock: 0,
    description: 'Viết đúng chính tả các cặp âm dễ nhầm: L/N, S/X, D/GI/R.',
    funFact: 'Người Nam Bộ nói "nói" nhưng viết là "lời nói" — âm L và N đôi khi bị nhầm theo vùng!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Điền chữ đúng: "Buổi ___áng con đi học" (L hay N?)',
        audioPromptText: 'Buổi gì con đi học, viết bằng chữ L hay N?',
        options: [
          { id: 'a', text: 'Náng (N)', isCorrect: false },
          { id: 'b', text: 'Láng (L)', isCorrect: false },
          { id: 'c', text: 'Sáng (S)', isCorrect: true }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Từ nào viết ĐÚNG chính tả? Loài hoa có gai nhọn:',
        audioPromptText: 'Loài hoa có gai nhọn viết đúng như thế nào?',
        options: [
          { id: 'a', text: 'xoa hồng', isCorrect: false },
          { id: 'b', text: 'hoa sồng', isCorrect: false },
          { id: 'c', text: 'hoa hồng', isCorrect: true }
        ]
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: '"Con ___ bay lên bầu trời xanh" — Điền D, GI hay R?',
        audioPromptText: 'Con gì bay lên bầu trời xanh? D, GI hay R?',
        options: [
          { id: 'a', text: 'Con dim', isCorrect: false },
          { id: 'b', text: 'Con rim', isCorrect: false },
          { id: 'c', text: 'Con gim (diều giấy)', isCorrect: false },
          { id: 'd', text: 'Con diều (viết đúng)', isCorrect: true }
        ]
      },
      {
        id: 'q4', type: 'word_match',
        prompt: 'Nối từ với nghĩa đúng:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'sáng sủa', right: 'Nhiều ánh sáng', leftEmoji: '☀️', rightEmoji: '💡' },
            { id: 'p2', left: 'xanh ngắt', right: 'Màu xanh đậm', leftEmoji: '🟢', rightEmoji: '🌿' },
            { id: 'p3', left: 'nắng hạ', right: 'Nắng mùa hè', leftEmoji: '🌞', rightEmoji: '🌻' }
          ]
        }
      }
    ]
  },
  {
    id: 'g2_v_u1_l2',
    title: 'Mở Rộng Vốn Từ: Từ Chỉ Người, Đồ Vật, Con Vật',
    grade: 2, subject: 'vietnamese',
    unitId: 'g2_v_u1', unitTitle: 'Chính tả âm đầu khó',
    icon: '📚', difficulty: 1,
    passingScore: 65, xpReward: 45, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g2_v_u1_l1',
    description: 'Phân loại từ theo nhóm: Từ chỉ người, đồ vật, hoạt động, đặc điểm.',
    funFact: 'Tiếng Việt có hàng chục nghìn từ! Mỗi ngày học một từ mới, 1 năm bé có thêm 365 từ!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Từ nào là từ CHỈ NGƯỜI?',
        audioPromptText: 'Từ nào dùng để chỉ người?',
        options: [
          { id: 'a', text: 'cái bàn', isCorrect: false },
          { id: 'b', text: 'cô giáo', isCorrect: true },
          { id: 'c', text: 'con chó', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Phân loại các từ vào nhóm đúng:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'Chỉ người', right: 'học sinh', leftEmoji: '👤', rightEmoji: '🎒' },
            { id: 'p2', left: 'Chỉ đồ vật', right: 'quyển vở', leftEmoji: '📦', rightEmoji: '📓' },
            { id: 'p3', left: 'Chỉ con vật', right: 'con mèo', leftEmoji: '🐾', rightEmoji: '🐱' }
          ]
        }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'Từ "đẹp" dùng để chỉ điều gì?',
        audioPromptText: 'Từ đẹp thuộc loại từ gì?',
        options: [
          { id: 'a', text: 'Chỉ người', isCorrect: false },
          { id: 'b', text: 'Chỉ hoạt động', isCorrect: false },
          { id: 'c', text: 'Chỉ đặc điểm (tính chất)', isCorrect: true }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: 'Điền từ thích hợp: Chú gấu trúc có bộ lông màu ___ và ___.',
        audioPromptText: 'Chú gấu trúc có bộ lông màu gì?',
        interactiveData: { blanks: ['đen', 'trắng'] }
      }
    ]
  },
  {
    id: 'g2_v_u1_l3',
    title: 'Dấu Câu: Chấm, Phẩy, Chấm Hỏi, Chấm Than',
    grade: 2, subject: 'vietnamese',
    unitId: 'g2_v_u1', unitTitle: 'Chính tả âm đầu khó',
    icon: '❓', difficulty: 2,
    passingScore: 70, xpReward: 55, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g2_v_u1_l2',
    description: 'Hiểu công dụng và cách sử dụng đúng các dấu câu cơ bản trong văn bản.',
    funFact: 'Dấu chấm hỏi (?) xuất hiện từ thế kỷ 8, lấy cảm hứng từ chữ "quaestio" trong tiếng Latin!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Cuối câu hỏi cần đặt dấu gì?',
        audioPromptText: 'Cuối câu hỏi ta đặt dấu câu gì?',
        options: [
          { id: 'a', text: '. (Dấu chấm)', isCorrect: false },
          { id: 'b', text: '? (Dấu chấm hỏi)', isCorrect: true },
          { id: 'c', text: '! (Dấu chấm than)', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Chọn dấu câu đúng: "Ôi, trời đẹp quá___"',
        audioPromptText: 'Ôi trời đẹp quá thì đặt dấu gì ở cuối?',
        options: [
          { id: 'a', text: '! (Chấm than — cảm thán)', isCorrect: true },
          { id: 'b', text: '? (Chấm hỏi)', isCorrect: false },
          { id: 'c', text: '. (Dấu chấm)', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'ordering',
        prompt: 'Đặt dấu phẩy đúng chỗ vào câu: "Trong vườn có hoa hồng hoa lan hoa cúc"',
        interactiveData: {
          orderItems: [
            { id: 'w1', text: 'Trong vườn có', correctIndex: 0 },
            { id: 'w2', text: 'hoa hồng,', correctIndex: 1 },
            { id: 'w3', text: 'hoa lan,', correctIndex: 2 },
            { id: 'w4', text: 'hoa cúc.', correctIndex: 3 }
          ]
        }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"Bé ơi, con có đói không___ nên đặt dấu Chấm Hỏi" — Đúng hay Sai?',
        options: [
          { id: 'true', text: '✅ Đúng', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g2_v_u1_l4',
    title: '🔥 Viết Câu Hoàn Chỉnh: Ghép Từ Thành Câu Đúng Nghĩa',
    grade: 2, subject: 'vietnamese',
    unitId: 'g2_v_u1', unitTitle: 'Chính tả âm đầu khó',
    icon: '🖊️', difficulty: 3,
    passingScore: 80, xpReward: 100, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g2_v_u1_l3',
    description: 'Thử thách sắp xếp từ tạo thành câu có nghĩa đúng ngữ pháp và dấu câu.',
    funFact: 'Câu tiếng Việt đầy đủ thường gồm: Ai? (Chủ ngữ) + Làm gì? / Như thế nào? (Vị ngữ)',
    questions: [
      {
        id: 'q1', type: 'ordering',
        prompt: 'Sắp xếp từ thành câu hoàn chỉnh: "học / Hôm nay / bài toán / khó / bé / một"',
        interactiveData: {
          orderItems: [
            { id: 'w1', text: 'Hôm nay', correctIndex: 0 },
            { id: 'w2', text: 'bé', correctIndex: 1 },
            { id: 'w3', text: 'học', correctIndex: 2 },
            { id: 'w4', text: 'một', correctIndex: 3 },
            { id: 'w5', text: 'bài toán', correctIndex: 4 },
            { id: 'w6', text: 'khó.', correctIndex: 5 }
          ]
        }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Câu nào có nghĩa rõ ràng và đủ thành phần nhất?',
        options: [
          { id: 'a', text: 'Chạy nhanh.', isCorrect: false },
          { id: 'b', text: 'Bạn Lan chạy nhanh ra sân trường.', isCorrect: true },
          { id: 'c', text: 'Nhanh bạn.', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Điền từ còn thiếu: "___ đang bay trên bầu trời xanh biếc."',
        audioPromptText: 'Cái gì đang bay trên bầu trời xanh biếc?',
        interactiveData: { blanks: ['Chú chim'] }
      }
    ]
  },

  // ============================================================
  // LỚP 3 - TỪ ĐỒNG NGHĨA, TRÁI NGHĨA & BIỆN PHÁP TU TỪ
  // ============================================================
  {
    id: 'g3_v_u1_l1',
    title: 'Từ Đồng Nghĩa: Nhiều Từ, Một Nghĩa',
    grade: 3, subject: 'vietnamese',
    unitId: 'g3_v_u1', unitTitle: 'Từ vựng & Ngữ pháp nâng cao',
    icon: '🔀', difficulty: 1,
    passingScore: 65, xpReward: 50, starsRequiredToUnlock: 0,
    description: 'Khám phá các từ đồng nghĩa — nhiều từ cùng mang một ý nghĩa tương tự.',
    funFact: '"Xinh" và "đẹp" là đồng nghĩa nhưng "xinh" thường dùng cho người trẻ hơn!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Từ nào đồng nghĩa với "nhà"?',
        audioPromptText: 'Từ nào có nghĩa gần giống với từ nhà?',
        options: [
          { id: 'a', text: 'gia đình', isCorrect: false },
          { id: 'b', text: 'ngôi nhà / căn nhà / mái nhà', isCorrect: true },
          { id: 'c', text: 'cửa sổ', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Nối cặp từ đồng nghĩa:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'chết', right: 'từ trần / mất / qua đời', leftEmoji: '💀', rightEmoji: '🕊️' },
            { id: 'p2', left: 'nhanh', right: 'mau lẹ / thoắt', leftEmoji: '⚡', rightEmoji: '🏃' },
            { id: 'p3', left: 'vui', right: 'hớn hở / mừng rỡ', leftEmoji: '😊', rightEmoji: '🎉' }
          ]
        }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'Câu nào dùng từ đồng nghĩa để tránh lặp từ "đẹp"?',
        options: [
          { id: 'a', text: 'Bạn Nga đẹp. Áo của Nga cũng rất đẹp. Tóc Nga đẹp.', isCorrect: false },
          { id: 'b', text: 'Bạn Nga xinh xắn. Áo của Nga rất đẹp mắt. Tóc Nga mượt mà.', isCorrect: true }
        ]
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"Buồn" và "sầu" là hai từ đồng nghĩa — Đúng hay Sai?',
        options: [
          { id: 'true', text: '✅ Đúng', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g3_v_u1_l2',
    title: 'Từ Trái Nghĩa: Đối Lập Tạo Nên Sức Mạnh Ngôn Từ',
    grade: 3, subject: 'vietnamese',
    unitId: 'g3_v_u1', unitTitle: 'Từ vựng & Ngữ pháp nâng cao',
    icon: '⚖️', difficulty: 1,
    passingScore: 65, xpReward: 50, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g3_v_u1_l1',
    description: 'Tìm hiểu từ trái nghĩa và cách sử dụng chúng để tạo hiệu quả biểu cảm.',
    funFact: 'Câu ca dao "Trẻ trồng na, già trồng chuối" sử dụng cặp trái nghĩa: Trẻ ↔ Già!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Từ trái nghĩa của "cao" là:',
        audioPromptText: 'Từ trái nghĩa của cao là gì?',
        options: [
          { id: 'a', text: 'lớn', isCorrect: false },
          { id: 'b', text: 'thấp', isCorrect: true },
          { id: 'c', text: 'rộng', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Nối cặp từ trái nghĩa:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'nóng', right: 'lạnh', leftEmoji: '🔥', rightEmoji: '❄️' },
            { id: 'p2', left: 'ngày', right: 'đêm', leftEmoji: '☀️', rightEmoji: '🌙' },
            { id: 'p3', left: 'thắng', right: 'thua', leftEmoji: '🏆', rightEmoji: '😔' }
          ]
        }
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Điền từ trái nghĩa với "rộng": "Căn phòng này ___ quá!"',
        interactiveData: { blanks: ['hẹp'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Trong câu: "Dù bé hay lớn, dù nghèo hay giàu, ai cũng cần học" — Có mấy cặp trái nghĩa?',
        options: [
          { id: 'a', text: '1 cặp', isCorrect: false },
          { id: 'b', text: '2 cặp (bé↔lớn, nghèo↔giàu)', isCorrect: true },
          { id: 'c', text: '3 cặp', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g3_v_u1_l3',
    title: 'Nhân Hóa & So Sánh: Ngôn Từ Biến Hóa Như Phép Thuật',
    grade: 3, subject: 'vietnamese',
    unitId: 'g3_v_u1', unitTitle: 'Từ vựng & Ngữ pháp nâng cao',
    icon: '🪄', difficulty: 2,
    passingScore: 70, xpReward: 65, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g3_v_u1_l2',
    description: 'Nhận biết và phân tích biện pháp tu từ so sánh và nhân hóa trong văn thơ thiếu nhi.',
    funFact: 'Nhân hóa giúp đồ vật và con vật trở nên sinh động như trong phim hoạt hình!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '"Mặt trời ngủ sau núi" — Đây là biện pháp tu từ gì?',
        audioPromptText: 'Mặt trời ngủ sau núi — đây là biện pháp tu từ gì?',
        options: [
          { id: 'a', text: 'So sánh', isCorrect: false },
          { id: 'b', text: 'Nhân hóa (gán hoạt động của người cho mặt trời)', isCorrect: true },
          { id: 'c', text: 'Ẩn dụ', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"Tiếng suối trong như tiếng hát xa" — Từ nào cho biết đây là so sánh?',
        options: [
          { id: 'a', text: 'tiếng suối', isCorrect: false },
          { id: 'b', text: '"như" (từ so sánh)', isCorrect: true },
          { id: 'c', text: 'tiếng hát', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'true_false',
        prompt: '"Chú gió nghịch ngợm thổi bay tờ giấy" sử dụng Nhân hóa — Đúng hay Sai?',
        options: [
          { id: 'true', text: '✅ Đúng, gió được gán tính nghịch ngợm như trẻ em', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: 'Điền từ so sánh vào câu: "Mắt bé đen ___ hạt nhãn."',
        interactiveData: { blanks: ['như'] }
      }
    ]
  },
  {
    id: 'g3_v_u1_l4',
    title: '🔥 Thám Hiểm Câu: Phân Tích Thành Phần Câu Đơn',
    grade: 3, subject: 'vietnamese',
    unitId: 'g3_v_u1', unitTitle: 'Từ vựng & Ngữ pháp nâng cao',
    icon: '🔍', difficulty: 3,
    passingScore: 80, xpReward: 110, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g3_v_u1_l3',
    description: 'Xác định Chủ ngữ (Ai/cái gì?) và Vị ngữ (Làm gì?/Như thế nào?) trong câu đơn.',
    funFact: 'Câu tiếng Việt không nhất thiết phải có chủ ngữ! "Trời mưa." là câu hoàn chỉnh!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Trong câu "Bé Lan đang đọc sách" — Chủ ngữ là:',
        audioPromptText: 'Bé Lan đang đọc sách, vậy chủ ngữ là gì?',
        options: [
          { id: 'a', text: 'đang đọc sách', isCorrect: false },
          { id: 'b', text: 'Bé Lan', isCorrect: true },
          { id: 'c', text: 'sách', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Vị ngữ của câu "Con mèo đen ngủ trên ghế" là:',
        options: [
          { id: 'a', text: 'Con mèo đen', isCorrect: false },
          { id: 'b', text: 'ngủ trên ghế', isCorrect: true },
          { id: 'c', text: 'đen ngủ', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'ordering',
        prompt: 'Sắp xếp thành câu đúng với chủ ngữ trước, vị ngữ sau:',
        interactiveData: {
          orderItems: [
            { id: 'cn', text: 'Những chú chim non', correctIndex: 0 },
            { id: 'vn1', text: 'đang ríu rít', correctIndex: 1 },
            { id: 'vn2', text: 'trên cành tre xanh.', correctIndex: 2 }
          ]
        }
      }
    ]
  },

  // ============================================================
  // LỚP 4 & 5 - CÂU GHÉP, NGỮ PHÁP NÂNG CAO, VĂN HỌC
  // ============================================================
  {
    id: 'g4_v_u1_l1',
    title: 'Danh Từ, Động Từ, Tính Từ: Tam Trụ Ngữ Pháp',
    grade: 4, subject: 'vietnamese',
    unitId: 'g4_v_u1', unitTitle: 'Từ loại & Câu ghép',
    icon: '🏛️', difficulty: 1,
    passingScore: 65, xpReward: 55, starsRequiredToUnlock: 0,
    description: 'Phân biệt rõ ràng Danh từ (người/vật), Động từ (hoạt động), Tính từ (đặc điểm).',
    funFact: 'Trong tiếng Việt, động từ "đánh" có tới hơn 20 nghĩa khác nhau tuỳ ngữ cảnh!',
    questions: [
      {
        id: 'q1', type: 'word_match',
        prompt: 'Phân loại từ vào đúng nhóm:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'Danh từ', right: 'trường học', leftEmoji: '📌', rightEmoji: '🏫' },
            { id: 'p2', left: 'Động từ', right: 'chạy nhảy', leftEmoji: '🏃', rightEmoji: '⚡' },
            { id: 'p3', left: 'Tính từ', right: 'thông minh', leftEmoji: '💡', rightEmoji: '🧠' }
          ]
        }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"Những đứa trẻ vui vẻ chạy trên cỏ xanh" — Từ "vui vẻ" là:',
        options: [
          { id: 'a', text: 'Danh từ', isCorrect: false },
          { id: 'b', text: 'Động từ', isCorrect: false },
          { id: 'c', text: 'Tính từ', isCorrect: true }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '"Mẹ ___ cơm rất ngon" — Điền Động từ vào chỗ trống:',
        audioPromptText: 'Mẹ làm gì cơm rất ngon?',
        interactiveData: { blanks: ['nấu'] }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"Cuốn sách này" — "cuốn sách" là Danh từ — Đúng hay Sai?',
        options: [
          { id: 'true', text: '✅ Đúng', isCorrect: true },
          { id: 'false', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g4_v_u1_l2',
    title: 'Câu Ghép: Nối Hai Câu Đơn Bằng Quan Hệ Từ',
    grade: 4, subject: 'vietnamese',
    unitId: 'g4_v_u1', unitTitle: 'Từ loại & Câu ghép',
    icon: '🔗', difficulty: 2,
    passingScore: 70, xpReward: 70, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g4_v_u1_l1',
    description: 'Tạo câu ghép bằng các quan hệ từ: vì-nên, tuy-nhưng, nếu-thì, hễ-thì.',
    funFact: 'Câu ghép giúp văn viết mượt mà và thể hiện mối quan hệ logic giữa các sự việc!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '"___ trời mưa ___ bé phải ở nhà" — Điền cặp quan hệ từ thích hợp:',
        options: [
          { id: 'a', text: 'tuy...nhưng', isCorrect: false },
          { id: 'b', text: 'vì...nên', isCorrect: true },
          { id: 'c', text: 'nếu...thì', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Cặp quan hệ từ "tuy...nhưng" biểu thị quan hệ gì?',
        options: [
          { id: 'a', text: 'Nguyên nhân - Kết quả', isCorrect: false },
          { id: 'b', text: 'Tương phản / Nhượng bộ', isCorrect: true },
          { id: 'c', text: 'Điều kiện - Kết quả', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '"___ bé ngoan, mẹ sẽ thưởng quà" — Điền cặp quan hệ từ:',
        interactiveData: { blanks: ['Nếu'] }
      },
      {
        id: 'q4', type: 'ordering',
        prompt: 'Ghép thành câu ghép hoàn chỉnh:',
        interactiveData: {
          orderItems: [
            { id: 'w1', text: 'Tuy trời rất nóng', correctIndex: 0 },
            { id: 'w2', text: 'nhưng', correctIndex: 1 },
            { id: 'w3', text: 'bé vẫn cố gắng tập thể dục mỗi sáng.', correctIndex: 2 }
          ]
        }
      }
    ]
  },
  {
    id: 'g5_v_u1_l1',
    title: 'Ôn Luyện Thành Ngữ & Tục Ngữ Việt Nam',
    grade: 5, subject: 'vietnamese',
    unitId: 'g5_v_u1', unitTitle: 'Văn học & Kho tàng dân gian',
    icon: '📜', difficulty: 1,
    passingScore: 65, xpReward: 60, starsRequiredToUnlock: 0,
    description: 'Ghi nhớ và hiểu đúng nghĩa của các thành ngữ, tục ngữ quen thuộc của ông cha.',
    funFact: 'Tục ngữ Việt Nam là kho tàng trí tuệ của ông cha, được lưu truyền qua hàng ngàn năm lịch sử!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '"Uống nước nhớ nguồn" — Câu tục ngữ này có nghĩa là:',
        audioPromptText: 'Câu tục ngữ uống nước nhớ nguồn có nghĩa là gì?',
        options: [
          { id: 'a', text: 'Uống nước phải nhớ chỗ lấy nước', isCorrect: false },
          { id: 'b', text: 'Khi được hưởng thành quả phải nhớ ơn người tạo ra', isCorrect: true },
          { id: 'c', text: 'Chỉ nên uống nước sạch', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: 'Điền từ còn thiếu: "Học thầy không ___ học bạn"',
        interactiveData: { blanks: ['tày'] }
      },
      {
        id: 'q3', type: 'word_match',
        prompt: 'Nối tục ngữ với nghĩa:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'Một con ngựa đau cả tàu bỏ cỏ', right: 'Đoàn kết, thương nhau', leftEmoji: '🐴', rightEmoji: '🤝' },
            { id: 'p2', left: 'Lời chào cao hơn mâm cỗ', right: 'Phép lịch sự rất quan trọng', leftEmoji: '🙏', rightEmoji: '✨' },
            { id: 'p3', left: 'Có công mài sắt có ngày nên kim', right: 'Kiên trì sẽ thành công', leftEmoji: '⚒️', rightEmoji: '🎯' }
          ]
        }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: '"Gần mực thì đen, gần đèn thì sáng" — Bài học là:',
        options: [
          { id: 'a', text: 'Nên tránh xa bóng đêm', isCorrect: false },
          { id: 'b', text: 'Môi trường sống và bạn bè ảnh hưởng đến tính cách con người', isCorrect: true },
          { id: 'c', text: 'Nên dùng nhiều đèn điện', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g5_v_u1_l2',
    title: '⚡ SIÊU KHÓ: Đọc Hiểu Đoạn Văn & Suy Luận Nâng Cao',
    grade: 5, subject: 'vietnamese',
    unitId: 'g5_v_u1', unitTitle: 'Văn học & Kho tàng dân gian',
    icon: '🧠', difficulty: 4,
    passingScore: 85, xpReward: 220, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g5_v_u1_l1',
    description: 'Đọc đoạn văn và trả lời câu hỏi suy luận — Bài thi học kỳ cấp độ!',
    funFact: 'Đọc hiểu là kỹ năng quan trọng nhất trong học tập — người đọc tốt học môn nào cũng giỏi!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Đọc: "Mặt trời mọc từ phía đông, chiếu những tia nắng vàng óng lên đồng lúa chín." → Thời điểm được miêu tả là:',
        audioPromptText: 'Buổi sáng hay tối? Tại sao bé biết?',
        options: [
          { id: 'a', text: 'Buổi chiều', isCorrect: false },
          { id: 'b', text: 'Buổi sáng sớm (vì mặt trời mọc)', isCorrect: true },
          { id: 'c', text: 'Buổi trưa', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"Tiếng suối trong như tiếng hát xa" (Hồ Chí Minh) — Tác giả so sánh tiếng suối với:',
        options: [
          { id: 'a', text: 'Tiếng gió', isCorrect: false },
          { id: 'b', text: 'Tiếng hát người', isCorrect: true },
          { id: 'c', text: 'Tiếng chim', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: '"Mẹ là ngọn gió của con suốt đời" — Biện pháp tu từ được sử dụng là:',
        options: [
          { id: 'a', text: 'So sánh', isCorrect: false },
          { id: 'b', text: 'Nhân hóa', isCorrect: false },
          { id: 'c', text: 'Ẩn dụ (Mẹ được gọi là ngọn gió — che mát, bảo vệ)', isCorrect: true }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: '"Công cha như núi Thái Sơn / Nghĩa mẹ như ___ trong nguồn chảy ra" — Điền từ còn thiếu:',
        interactiveData: { blanks: ['nước'] }
      }
    ]
  },

  // ============================================================
  // LỚP 4 - CHƯƠNG 2: LUYỆN TỪ VÀ CÂU NÂNG CAO
  // ============================================================
  {
    id: 'g4_v_u2_l1',
    title: 'Trạng Ngữ Trong Câu: Nơi Chốn, Thời Gian, Nguyên Nhân',
    grade: 4, subject: 'vietnamese',
    unitId: 'g4_v_u2', unitTitle: 'Chương 2: Luyện từ và câu nâng cao',
    icon: '📍', difficulty: 2,
    passingScore: 70, xpReward: 90, starsRequiredToUnlock: 1,
    description: 'Nhận biết các loại trạng ngữ đứng đầu câu trả lời cho câu hỏi Ở đâu? Khi nào? Vì sao?',
    funFact: 'Trạng ngữ được ngăn cách với chủ ngữ và vị ngữ bằng dấu phẩy (,) khi đứng ở đầu câu!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Trong câu: "Trên cành cây, chim hót líu lo", bộ phận nào là trạng ngữ chỉ nơi chốn?',
        audioPromptText: 'Bộ phận nào chỉ nơi chốn trong câu trên cành cây chim hót líu lo?',
        options: [
          { id: 'a', text: 'chim hót', isCorrect: false },
          { id: 'b', text: 'Trên cành cây', isCorrect: true },
          { id: 'c', text: 'líu lo', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"Mùa xuân đến, hoa mai vàng nở rộ." — Trạng ngữ "Mùa xuân đến" chỉ gì?',
        options: [
          { id: 'a', text: 'Chỉ thời gian', isCorrect: true },
          { id: 'b', text: 'Chỉ nơi chốn', isCorrect: false },
          { id: 'c', text: 'Chỉ mục đích', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'true_false',
        prompt: '"Vì trời mưa to, chúng em phải nghỉ thể dục." — "Vì trời mưa to" là trạng ngữ chỉ nguyên nhân?',
        options: [
          { id: 't', text: '✅ Đúng (Trả lời cho câu hỏi Vì sao?)', isCorrect: true },
          { id: 'f', text: '❌ Sai', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: 'Điền từ nối: "___ sân trường, các bạn học sinh đang chơi nhảy dây."',
        interactiveData: { blanks: ['trên', 'dưới', 'ngoài'] }
      }
    ]
  },
  {
    id: 'g4_v_u2_l2',
    title: 'Phân Biệt Từ Ghép Và Từ Láy (Tiếng Việt 4)',
    grade: 4, subject: 'vietnamese',
    unitId: 'g4_v_u2', unitTitle: 'Chương 2: Luyện từ và câu nâng cao',
    icon: '🧩', difficulty: 3,
    passingScore: 75, xpReward: 120, starsRequiredToUnlock: 2,
    description: 'Phân biệt từ phức: Từ ghép có các tiếng đều có nghĩa, từ láy có sự hòa phối âm thanh.',
    funFact: 'Tiếng Việt rất giàu nhạc tính nhờ vào hệ thống từ láy phong phú như róc rách, xôn xao, lung linh!',
    questions: [
      {
        id: 'q1', type: 'word_match',
        prompt: 'Nối từ với nhóm từ thích hợp:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'long lanh', right: 'Từ láy (láy âm đầu L)', leftEmoji: '✨', rightEmoji: '📝' },
            { id: 'p2', left: 'nhà cửa', right: 'Từ ghép đẳng lập', leftEmoji: '🏠', rightEmoji: '🚪' },
            { id: 'p3', left: 'xe đạp', right: 'Từ ghép chính phụ', leftEmoji: '🚲', rightEmoji: '⚙️' }
          ]
        }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Từ nào sau đây là TỪ LÁY tượng thanh mô phỏng tiếng mưa rơi?',
        options: [
          { id: 'a', text: 'xanh ngắt', isCorrect: false },
          { id: 'b', text: 'tí tách', isCorrect: true },
          { id: 'c', text: 'chăm chỉ', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'Trong các từ sau, từ nào là TỪ GHÉP?',
        options: [
          { id: 'a', text: 'róc rách', isCorrect: false },
          { id: 'b', text: 'học tập', isCorrect: true },
          { id: 'c', text: 'mênh mông', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: 'Điền từ láy miêu tả ánh mắt long lanh: "Đôi mắt em bé tròn xoe và ___."',
        interactiveData: { blanks: ['đen lánh', 'sáng ngời', 'long lanh'] }
      }
    ]
  },
  {
    id: 'g4_v_u2_l3',
    title: 'Biện Pháp Tu Từ: So Sánh & Nhân Hóa Nâng Cao',
    grade: 4, subject: 'vietnamese',
    unitId: 'g4_v_u2', unitTitle: 'Chương 2: Luyện từ và câu nâng cao',
    icon: '🎭', difficulty: 3,
    passingScore: 80, xpReward: 140, starsRequiredToUnlock: 3,
    description: 'Học cách biến câu văn trở nên sinh động, có hồn bằng các phép so sánh và nhân hóa.',
    funFact: 'Nhân hóa là gán cho đồ vật, con vật, cây cối những hành động, tính cách của con người!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Câu nào sau đây sử dụng phép NHÂN HÓA?',
        options: [
          { id: 'a', text: 'Mặt trời chiếu sáng rực rỡ.', isCorrect: false },
          { id: 'b', text: 'Bác đồng hồ cần mẫn đếm từng tích tắc thời gian.', isCorrect: true },
          { id: 'c', text: 'Dòng sông uốn lượn như dải lụa.', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'ordering',
        prompt: 'Sắp xếp câu so sánh: "như / trăng rằm / tròn / Mặt / cái đĩa bạc"',
        interactiveData: {
          orderItems: [
            { id: '1', text: 'Mặt', correctIndex: 0 },
            { id: '2', text: 'trăng rằm', correctIndex: 1 },
            { id: '3', text: 'tròn', correctIndex: 2 },
            { id: '4', text: 'như', correctIndex: 3 },
            { id: '5', text: 'cái đĩa bạc.', correctIndex: 4 }
          ]
        }
      },
      {
        id: 'q3', type: 'true_false',
        prompt: '"Trẻ em như búp trên cành" (Hồ Chí Minh) là phép so sánh ngang bằng?',
        options: [
          { id: 't', text: '✅ Đúng (từ so sánh: "như")', isCorrect: true },
          { id: 'f', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  },

  // ============================================================
  // LỚP 5 - CHƯƠNG 2: CÂU GHÉP & TẬP LÀM VĂN ĐỈNH CAO
  // ============================================================
  {
    id: 'g5_v_u2_l1',
    title: 'Từ Đồng Nghĩa, Từ Trái Nghĩa & Từ Đồng Âm',
    grade: 5, subject: 'vietnamese',
    unitId: 'g5_v_u2', unitTitle: 'Chương 2: Cú pháp & Ngữ nghĩa lớp 5',
    icon: '⚖️', difficulty: 2,
    passingScore: 75, xpReward: 150, starsRequiredToUnlock: 1,
    description: 'Làm chủ vốn từ ngữ phong phú của tiếng Việt qua các mối quan hệ ngữ nghĩa.',
    funFact: 'Từ đồng âm là từ phát âm giống hệt nhau nhưng nghĩa hoàn toàn khác nhau: "con đỗ (đậu)" và "xôi đỗ (đậu xanh)"!',
    questions: [
      {
        id: 'q1', type: 'word_match',
        prompt: 'Nối các cặp từ TRÁI NGHĨA nhau:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'chăm chỉ', right: 'lười biếng', leftEmoji: '🐝', rightEmoji: '🦥' },
            { id: 'p2', left: 'dũng cảm', right: 'hèn nhát', leftEmoji: '🦁', rightEmoji: '🐁' },
            { id: 'p3', left: 'thật thà', right: 'gian dối', leftEmoji: '🤝', rightEmoji: '🎭' }
          ]
        }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Từ nào sau đây ĐỒNG NGHĨA với từ "Tổ quốc"?',
        options: [
          { id: 'a', text: 'Quê hương, Đất nước, Giang sơn', isCorrect: true },
          { id: 'b', text: 'Làng xóm, Con phố', isCorrect: false },
          { id: 'c', text: 'Bầu trời, Biển cả', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Tìm từ đồng âm với "bàn" (bàn học): "Gia đình em cùng nhau ___ bạc công việc."',
        interactiveData: { blanks: ['bàn'] }
      }
    ]
  },
  {
    id: 'g5_v_u2_l2',
    title: 'Cặp Quan Hệ Từ Trong Câu Ghép (Nguyên Nhân, Điều Kiện, Tương Phản)',
    grade: 5, subject: 'vietnamese',
    unitId: 'g5_v_u2', unitTitle: 'Chương 2: Cú pháp & Ngữ nghĩa lớp 5',
    icon: '🔗', difficulty: 3,
    passingScore: 80, xpReward: 180, starsRequiredToUnlock: 2,
    description: 'Nối các vế câu ghép bằng các cặp quan hệ từ: Vì...nên, Hễ...thì, Mặc dù...nhưng.',
    funFact: 'Câu ghép có ít nhất 2 vế câu độc lập và mỗi vế đều có đầy đủ cụm Chủ ngữ - Vị ngữ!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Cặp quan hệ từ trong câu: "Mặc dù đêm đã khuya NHƯNG mẹ vẫn thức chấm bài" thể hiện quan hệ gì?',
        options: [
          { id: 'a', text: 'Quan hệ tương phản (nhượng bộ)', isCorrect: true },
          { id: 'b', text: 'Quan hệ nguyên nhân - kết quả', isCorrect: false },
          { id: 'c', text: 'Quan hệ tăng tiến', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Điền cặp quan hệ từ thích hợp: "___ hoa sen sống trong bùn lầy ___ nó vẫn tỏa hương thơm ngát."',
        options: [
          { id: 'a', text: 'Tuy ... nhưng', isCorrect: true },
          { id: 'b', text: 'Vì ... nên', isCorrect: false },
          { id: 'c', text: 'Nếu ... thì', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'ordering',
        prompt: 'Sắp xếp câu ghép: "chăm chỉ / em càng / Càng học, / hiểu biết nhiều / hơn"',
        interactiveData: {
          orderItems: [
            { id: '1', text: 'Càng học', correctIndex: 0 },
            { id: '2', text: 'chăm chỉ,', correctIndex: 1 },
            { id: '3', text: 'em càng', correctIndex: 2 },
            { id: '4', text: 'hiểu biết nhiều', correctIndex: 3 },
            { id: '5', text: 'hơn.', correctIndex: 4 }
          ]
        }
      }
    ]
  },
  {
    id: 'g5_v_u2_l3',
    title: '⚡ ĐẠI CHIẾN TIẾNG VIỆT 5: Thử Thách Trạng Nguyên Nhí',
    grade: 5, subject: 'vietnamese',
    unitId: 'g5_v_u2', unitTitle: 'Chương 2: Cú pháp & Ngữ nghĩa lớp 5',
    icon: '👑', difficulty: 4,
    passingScore: 85, xpReward: 250, starsRequiredToUnlock: 3,
    description: 'Thử thách tổng hợp kiến thức ngữ pháp, ca dao tục ngữ và cảm thụ văn học đỉnh cao!',
    funFact: 'Trạng nguyên là danh hiệu cao quý nhất trong các kỳ thi Nho học thời xưa của nước ta!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Thành ngữ nào sau đây khuyên chúng ta tinh thần đoàn kết gắn bó?',
        options: [
          { id: 'a', text: 'Một cây làm chẳng nên non / Ba cây chụm lại nên hòn núi cao', isCorrect: true },
          { id: 'b', text: 'Ăn quả nhớ kẻ trồng cây', isCorrect: false },
          { id: 'c', text: 'Học thầy không tày học bạn', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Nối câu tục ngữ với ý nghĩa tương ứng:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'Gần mực thì đen, gần đèn thì sáng', right: 'Môi trường sống ảnh hưởng đến nhân cách', leftEmoji: '💡', rightEmoji: '📖' },
            { id: 'p2', left: 'Lá lành đùm lá rách', right: 'Tình yêu thương, giúp đỡ người khó khăn', leftEmoji: '🍃', rightEmoji: '❤️' },
            { id: 'p3', left: 'Có công mài sắt, có ngày nên kim', right: 'Lòng kiên trì, nhẫn nại sẽ thành công', leftEmoji: '🪡', rightEmoji: '⭐' }
          ]
        }
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Điền từ còn thiếu vào câu tục ngữ: "Uống nước nhớ ___."',
        interactiveData: { blanks: ['nguồn'] }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: 'Câu "Mặt trời xuống biển như hòn lửa" (Huy Cận) sử dụng biện pháp so sánh?',
        options: [
          { id: 't', text: '✅ Đúng', isCorrect: true },
          { id: 'f', text: '❌ Sai', isCorrect: false }
        ]
      }
    ]
  }
];

