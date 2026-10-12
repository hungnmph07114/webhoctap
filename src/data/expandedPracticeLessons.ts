import { Grade, Lesson, Question, SubjectId } from '../types/curriculum';

type PracticeSpec = {
  grade: Grade;
  subject: SubjectId;
  title: string;
  icon: string;
  description: string;
  questions: Question[];
};

const choice = (
  prompt: string,
  answer: string,
  distractors: [string, string],
  hint: string,
  explanation: string
): Question => {
  const answerIndex = [...prompt].reduce((total, character) => total + character.charCodeAt(0), 0) % 3;
  const remainingDistractors = [...distractors];
  const orderedChoices = Array.from({ length: 3 }, (_, index) => (
    index === answerIndex ? answer : remainingDistractors.shift()!
  ));

  return {
    id: '',
    type: 'multiple_choice',
    prompt,
    hint,
    explanation,
    options: orderedChoices.map((text, index) => ({
      id: `option_${index + 1}`,
      text,
      isCorrect: index === answerIndex
    }))
  };
};

const fill = (
  prompt: string,
  answer: string,
  hint: string,
  explanation: string,
  acceptableAnswers: string[] = []
): Question => ({
  id: '',
  type: 'fill_in_the_blank',
  prompt,
  hint,
  explanation,
  correctAnswer: answer,
  interactiveData: { blanks: [answer, ...acceptableAnswers] }
});

const trueFalse = (
  prompt: string,
  answer: boolean,
  hint: string,
  explanation: string,
  language: 'vi' | 'en' = 'vi'
): Question => ({
  id: '',
  type: 'true_false',
  prompt,
  hint,
  explanation,
  options: [
    { id: 'true', text: language === 'en' ? 'True' : 'Đúng', isCorrect: answer },
    { id: 'false', text: language === 'en' ? 'False' : 'Sai', isCorrect: !answer }
  ]
});

const ordering = (
  prompt: string,
  items: [string, string, string],
  hint: string,
  explanation: string
): Question => ({
  id: '',
  type: 'ordering',
  prompt,
  hint,
  explanation,
  interactiveData: {
    orderItems: items.map((text, correctIndex) => ({
      id: `item_${correctIndex + 1}`,
      text,
      correctIndex
    }))
  }
});

const match = (
  prompt: string,
  pairs: [[string, string], [string, string], [string, string]],
  hint: string,
  explanation: string
): Question => ({
  id: '',
  type: 'word_match',
  prompt,
  hint,
  explanation,
  interactiveData: {
    matchingPairs: pairs.map(([left, right], index) => ({
      id: `pair_${index + 1}`,
      left,
      right
    })) as [
      { id: string; left: string; right: string },
      { id: string; left: string; right: string },
      { id: string; left: string; right: string }
    ]
  }
});

const practiceSpecs: PracticeSpec[] = [
  // TOÁN: bài toán gắn với hoạt động hàng ngày, hình học và dữ liệu.
  {
    grade: 1, subject: 'math', title: 'Toán vui quanh em: cộng trừ và đo lường', icon: '🧺',
    description: 'Vận dụng số trong phạm vi 20, so sánh độ dài và giải tình huống gần gũi.',
    questions: [
      choice('Mai có 8 nhãn vở, được tặng thêm 5 nhãn. Mai có tất cả bao nhiêu nhãn?', '13 nhãn', ['12 nhãn', '14 nhãn'], 'Gộp 8 nhãn với 5 nhãn nữa.', '8 + 5 = 13.'),
      fill('Có 15 quả bóng, 6 quả đã được lấy ra chơi. Còn lại bao nhiêu quả bóng?', '9', 'Lấy số bóng ban đầu trừ số đã lấy ra.', '15 - 6 = 9 quả bóng.'),
      trueFalse('Số 17 bé hơn số 12.', false, 'Trên tia số, số nằm bên phải thì lớn hơn.', '17 lớn hơn 12 nên câu nói này sai.'),
      ordering('Sắp xếp các số từ bé đến lớn.', ['4', '7', '9'], 'Quan sát chữ số hàng đơn vị.', 'Thứ tự tăng dần là 4, 7, 9.'),
      choice('Sợi dây đỏ dài 12 cm, sợi dây xanh dài 9 cm. Sợi dây nào dài hơn?', 'Sợi dây đỏ', ['Sợi dây xanh', 'Hai sợi bằng nhau'], 'So sánh 12 với 9.', '12 cm lớn hơn 9 cm nên dây đỏ dài hơn.')
    ]
  },
  {
    grade: 2, subject: 'math', title: 'Toán thực tế: tiền, thời gian và nhóm bằng nhau', icon: '🕒',
    description: 'Giải các tình huống đơn giản về mua bán, xem giờ và phép nhân.',
    questions: [
      choice('Một quyển vở giá 6 nghìn đồng. Mua 3 quyển hết bao nhiêu?', '18 nghìn đồng', ['9 nghìn đồng', '16 nghìn đồng'], 'Có 3 nhóm, mỗi nhóm 6 nghìn đồng.', '6 × 3 = 18 nghìn đồng.'),
      fill('Lan bắt đầu đọc sách lúc 7 giờ và đọc trong 1 giờ. Lan đọc xong lúc mấy giờ?', '8 giờ', 'Đếm thêm một giờ từ 7 giờ.', '7 giờ + 1 giờ = 8 giờ.'),
      trueFalse('4 đôi đũa là 8 chiếc đũa.', true, 'Mỗi đôi có 2 chiếc.', '4 × 2 = 8 chiếc đũa.'),
      match('Nối tình huống với phép tính phù hợp.', [['3 túi, mỗi túi 5 cam', '3 × 5'], ['Chia 12 bánh cho 4 bạn', '12 ÷ 4'], ['Có 20 nghìn, mua món 8 nghìn', '20 - 8']], 'Tìm xem cần gộp nhóm, chia đều hay bớt đi.', 'Nhóm bằng nhau dùng phép nhân, chia đều dùng phép chia, mua hàng có thể cần phép trừ.'),
      choice('Đồng hồ chỉ 9 giờ. Sau 2 giờ là mấy giờ?', '11 giờ', ['10 giờ', '12 giờ'], 'Đếm thêm hai giờ từ 9.', '9 + 2 = 11 giờ.')
    ]
  },
  {
    grade: 3, subject: 'math', title: 'Đọc bảng số liệu và đo lường', icon: '📊',
    description: 'Đọc bảng đơn giản, đổi đơn vị quen thuộc và vận dụng nhân chia.',
    questions: [
      choice('Lớp 3A thu gom được 24 chai, lớp 3B được 18 chai. Hai lớp thu gom tất cả bao nhiêu chai?', '42 chai', ['36 chai', '44 chai'], 'Cộng số chai của hai lớp.', '24 + 18 = 42 chai.'),
      fill('Một đoạn ruy băng dài 2 m. Đoạn đó dài bao nhiêu xăng-ti-mét?', '200', 'Mỗi mét có 100 xăng-ti-mét.', '2 × 100 = 200 cm.', ['200 cm', '200cm']),
      trueFalse('Nếu 6 hộp có 4 chiếc bút mỗi hộp thì có tất cả 24 chiếc bút.', true, 'Tính 6 nhóm, mỗi nhóm 4 chiếc.', '6 × 4 = 24 chiếc bút.'),
      ordering('Sắp xếp các khối lượng từ nhẹ đến nặng.', ['250 g', '500 g', '1 kg'], 'Đổi 1 kg thành gam để so sánh.', '1 kg = 1000 g; thứ tự là 250 g, 500 g, 1000 g.'),
      choice('Bảng ghi số cây trồng: tổ Một 8 cây, tổ Hai 11 cây, tổ Ba 6 cây. Tổ nào trồng nhiều cây nhất?', 'Tổ Hai', ['Tổ Một', 'Tổ Ba'], 'So sánh ba số 8, 11 và 6.', '11 lớn nhất nên tổ Hai trồng nhiều cây nhất.')
    ]
  },
  {
    grade: 4, subject: 'math', title: 'Toán ứng dụng: diện tích và bài toán nhiều bước', icon: '📐',
    description: 'Luyện tính diện tích, đổi đơn vị và giải bài toán qua hai bước.',
    questions: [
      choice('Một khu vườn hình chữ nhật dài 12 m, rộng 5 m. Diện tích là bao nhiêu?', '60 m²', ['34 m²', '60 m'], 'Diện tích hình chữ nhật bằng chiều dài nhân chiều rộng.', '12 × 5 = 60 m².'),
      fill('4 hộp có 24 chiếc bánh. Chia đều số bánh đó cho 6 bạn, mỗi bạn được bao nhiêu chiếc?', '4', 'Tìm tổng số bánh rồi chia đều cho 6.', '24 ÷ 6 = 4 chiếc bánh mỗi bạn.'),
      trueFalse('3/8 lớn hơn 5/8 vì 3 nhỏ hơn 5.', false, 'Hai phân số có cùng mẫu số; so sánh tử số.', '3/8 nhỏ hơn 5/8 vì 3 < 5.'),
      ordering('Xếp các phân số cùng mẫu số theo thứ tự từ bé đến lớn.', ['2/7', '4/7', '6/7'], 'Mẫu số giống nhau nên chỉ cần so sánh tử số.', '2 < 4 < 6 nên thứ tự là 2/7, 4/7, 6/7.'),
      choice('Một cửa hàng có 125 kg gạo, đã bán 48 kg. Cửa hàng còn lại bao nhiêu ki-lô-gam?', '77 kg', ['83 kg', '73 kg'], 'Lấy số gạo ban đầu trừ số đã bán.', '125 - 48 = 77 kg.')
    ]
  },
  {
    grade: 5, subject: 'math', title: 'Toán thực hành: phần trăm, thể tích và chuyển động', icon: '🚲',
    description: 'Vận dụng tỉ số phần trăm, thể tích hình hộp và bài toán chuyển động.',
    questions: [
      choice('Một lớp có 40 học sinh, 25% số học sinh tham gia câu lạc bộ cờ. Có bao nhiêu bạn tham gia?', '10 bạn', ['8 bạn', '15 bạn'], 'Tính một phần tư của 40.', '25% = 1/4 và 40 ÷ 4 = 10.'),
      fill('Xe đạp đi 36 km trong 3 giờ với vận tốc đều. Mỗi giờ xe đi được bao nhiêu ki-lô-mét?', '12', 'Lấy quãng đường chia cho thời gian.', '36 ÷ 3 = 12 km/giờ.'),
      trueFalse('Hình hộp chữ nhật dài 4 cm, rộng 3 cm, cao 2 cm có thể tích 24 cm³.', true, 'Thể tích bằng dài nhân rộng nhân cao.', '4 × 3 × 2 = 24 cm³.'),
      match('Nối dữ kiện với đại lượng cần tìm.', [['Quãng đường và thời gian', 'Vận tốc'], ['Chiều dài, chiều rộng, chiều cao', 'Thể tích'], ['Một số và phần trăm của số đó', 'Giá trị phần trăm']], 'Nhớ công thức phù hợp với từng đại lượng.', 'Vận tốc = quãng đường ÷ thời gian; thể tích hộp = dài × rộng × cao.'),
      choice('Một chiếc áo giá 200 000 đồng được giảm 10%. Số tiền được giảm là bao nhiêu?', '20 000 đồng', ['10 000 đồng', '180 000 đồng'], 'Tính 10% của 200 000.', '200 000 × 10 ÷ 100 = 20 000 đồng.')
    ]
  },

  // TIẾNG VIỆT: đọc hiểu, lựa chọn từ ngữ và tổ chức ý.
  {
    grade: 1, subject: 'vietnamese', title: 'Đọc câu ngắn và hiểu ý', icon: '📖',
    description: 'Đọc câu gần gũi, tìm thông tin và sắp xếp lời kể theo trình tự.',
    questions: [
      choice('Đọc: “Bé Na tưới cây mỗi sáng.” Na làm việc đó vào lúc nào?', 'Mỗi sáng', ['Mỗi tối', 'Mỗi trưa'], 'Tìm từ chỉ thời gian trong câu.', 'Câu cho biết Na tưới cây mỗi sáng.'),
      fill('Điền từ còn thiếu: “Con mèo đang ___ cuộn len.” (chơi / xanh)', 'chơi', 'Chọn từ chỉ hoạt động phù hợp.', '“Chơi” là hoạt động mà con mèo đang làm.'),
      trueFalse('Trong câu “Bố đọc sách”, từ “đọc” chỉ hoạt động.', true, 'Hỏi: bố đang làm gì?', '“Đọc” trả lời câu hỏi làm gì, nên là từ chỉ hoạt động.'),
      ordering('Sắp xếp các từ để thành câu kể đúng.', ['Chim', 'hót', 'trên cành.'], 'Câu kể thường nêu sự vật rồi nói hoạt động.', 'Câu hoàn chỉnh: “Chim hót trên cành.”'),
      choice('Câu nào kể về một việc em có thể làm để giữ lớp sạch?', 'Em bỏ rác vào thùng.', ['Em vẽ lên mặt bàn.', 'Em để giấy dưới sàn.'], 'Chọn hành động giúp lớp gọn gàng.', 'Bỏ rác đúng nơi giữ lớp sạch.')
    ]
  },
  {
    grade: 2, subject: 'vietnamese', title: 'Đọc hiểu: một buổi đến trường', icon: '🎒',
    description: 'Tìm chi tiết trong đoạn đọc ngắn và nhận biết từ ngữ chỉ đặc điểm.',
    questions: [
      choice('Đọc: “Sáng thứ Hai, Bình đến trường sớm. Bạn giúp cô xếp sách lên giá.” Bình đến trường vào lúc nào?', 'Sáng thứ Hai', ['Chiều Chủ nhật', 'Tối thứ Hai'], 'Tìm cụm từ nêu thời gian ở đầu đoạn.', 'Đoạn văn ghi rõ Bình đến trường vào sáng thứ Hai.'),
      fill('Trong câu “Sân trường rộng và sạch”, điền một từ chỉ đặc điểm: “___”.', 'rộng', 'Từ này miêu tả sân trường như thế nào.', 'Cả “rộng” và “sạch” đều là từ chỉ đặc điểm.', ['sạch']),
      trueFalse('Trong đoạn đọc, Bình giúp cô giáo xếp sách.', true, 'Đối chiếu với câu thứ hai.', 'Đoạn văn nói Bình giúp cô xếp sách lên giá.'),
      match('Nối từ với nhóm phù hợp.', [['cô giáo', 'Từ chỉ người'], ['quét', 'Từ chỉ hoạt động'], ['sạch', 'Từ chỉ đặc điểm']], 'Hỏi ai, làm gì, như thế nào.', 'Cô giáo là người, quét là hoạt động, sạch là đặc điểm.'),
      choice('Câu nào dùng dấu chấm hỏi đúng?', 'Bạn đã chuẩn bị sách chưa?', ['Bạn đã chuẩn bị sách chưa.', 'Bạn đã chuẩn bị sách chưa!'], 'Câu hỏi cần dấu câu dùng để hỏi.', 'Câu hỏi kết thúc bằng dấu chấm hỏi.')
    ]
  },
  {
    grade: 3, subject: 'vietnamese', title: 'Đọc hiểu và chọn từ đúng ngữ cảnh', icon: '🔎',
    description: 'Rút thông tin từ đoạn văn, hiểu nghĩa từ và chọn cách diễn đạt phù hợp.',
    questions: [
      choice('Đọc: “Sau cơn mưa, giọt nước đọng trên lá long lanh như những hạt ngọc.” Giọt nước đọng ở đâu?', 'Trên lá', ['Dưới gốc cây', 'Trên mái nhà'], 'Tìm nơi được nêu trong câu.', 'Câu văn nói giọt nước đọng trên lá.'),
      fill('Từ trái nghĩa với “ồn ào” là “___”.', 'yên tĩnh', 'Tìm từ chỉ không gian ít tiếng động.', '“Yên tĩnh” trái nghĩa với “ồn ào”.'),
      trueFalse('Câu “Mặt trời mỉm cười sau rặng núi” dùng cách nói nhân hóa.', true, 'Sự vật nào được gắn với hành động của con người?', 'Mặt trời được tả như người biết mỉm cười.'),
      ordering('Sắp xếp các ý theo trình tự một cây đậu lớn lên.', ['Hạt được gieo vào đất.', 'Mầm non nhú lên.', 'Cây mọc thêm lá.'], 'Hạt phải được gieo trước khi nảy mầm.', 'Trình tự phát triển là gieo hạt, nhú mầm, mọc lá.'),
      choice('Chọn từ phù hợp: “Bạn Minh luôn ___ với mọi người nên ai cũng quý.”', 'thân thiện', ['ngập ngừng', 'gồ ghề'], 'Chọn từ miêu tả thái độ tốt với mọi người.', '“Thân thiện” phù hợp để miêu tả cách cư xử của Minh.')
    ]
  },
  {
    grade: 4, subject: 'vietnamese', title: 'Đọc hiểu: tìm ý chính và liên kết câu', icon: '🧵',
    description: 'Xác định ý chính, hiểu từ ngữ trong ngữ cảnh và nối các câu mạch lạc.',
    questions: [
      choice('Đọc: “Nhóm của An chăm sóc bồn hoa trước lớp. Các bạn nhổ cỏ, xới đất và tưới nước. Nhờ vậy, hoa nở rực rỡ.” Ý chính của đoạn là gì?', 'Các bạn cùng chăm sóc bồn hoa.', ['An mua hoa mới cho lớp.', 'Bồn hoa bị thiếu nước.'], 'Chọn ý bao quát cả ba câu.', 'Các việc nhổ cỏ, xới đất, tưới nước đều nói về chăm sóc bồn hoa.'),
      fill('Điền từ nối phù hợp: “Trời mưa to, ___ trận bóng phải hoãn.”', 'nên', 'Quan hệ giữa hai ý là nguyên nhân và kết quả.', 'Trời mưa to là nguyên nhân, trận bóng hoãn là kết quả.'),
      trueFalse('Trong đoạn đọc, các bạn chỉ tưới nước mà không nhổ cỏ.', false, 'Đọc lại câu thứ hai.', 'Các bạn vừa nhổ cỏ, xới đất, vừa tưới nước.'),
      match('Nối từ với nghĩa gần nhất.', [['kiên trì', 'Bền bỉ, không bỏ cuộc'], ['rực rỡ', 'Tươi sáng, nổi bật'], ['sẻ chia', 'Cùng san bớt với người khác']], 'Hãy thử thay từ bằng cách giải thích ngắn.', 'Các cặp nối diễn đạt nghĩa gần nhất của từng từ.'),
      choice('Câu nào liên kết tốt với câu “Hà nhặt được một chiếc ví ở sân trường.”?', 'Bạn đem chiếc ví đến phòng giám thị.', ['Chiếc ví màu nâu rất đẹp.', 'Trời hôm nay có nắng.'], 'Chọn câu tiếp nối hợp lí với sự việc.', 'Mang ví đến phòng giám thị là cách xử lí liên quan và có trách nhiệm.')
    ]
  },
  {
    grade: 5, subject: 'vietnamese', title: 'Đọc hiểu và suy luận từ chi tiết', icon: '🧠',
    description: 'Kết hợp chi tiết, suy luận nguyên nhân và phân biệt thông tin với ý kiến.',
    questions: [
      choice('Đọc: “Vừa thấy trời chuyển mây đen, Linh thu quần áo ngoài sân rồi đóng cửa sổ. Một lát sau, mưa lớn trút xuống.” Vì sao Linh thu quần áo?', 'Linh đoán trời sắp mưa.', ['Linh muốn đem quần áo đi giặt.', 'Linh chuẩn bị ra sân chơi.'], 'Kết nối dấu hiệu Linh nhìn thấy với việc bạn làm.', 'Mây đen báo hiệu mưa nên Linh thu quần áo trước.'),
      fill('Điền từ nêu nguyên nhân: “___ chăm luyện đọc, em đọc ngày càng lưu loát.” (Vì / Tuy)', 'Vì', 'Chọn từ mở đầu cho nguyên nhân.', '“Vì chăm luyện đọc” nêu nguyên nhân giúp em đọc lưu loát.'),
      trueFalse('Câu “Theo em, khu vườn ấy đẹp nhất vào mùa xuân” là một ý kiến.', true, 'Cụm “theo em” cho biết điều gì?', 'Đây là nhận xét cá nhân, không phải dữ kiện đo đếm.'),
      ordering('Sắp xếp câu để tạo đoạn kể hợp lí.', ['Buổi sáng, Nam phát hiện chậu cây bị khô đất.', 'Bạn tưới nước và đặt chậu cây gần cửa sổ.', 'Vài ngày sau, cây lại xanh tươi.'], 'Tìm sự việc ban đầu, hành động rồi kết quả.', 'Trình tự hợp lí gồm phát hiện, chăm sóc, cây hồi phục.'),
      choice('Đọc: “Thư viện lớp mở cửa vào giờ ra chơi. Học sinh có thể mượn sách trong một tuần.” Thông tin nào được nêu trực tiếp?', 'Có thể mượn sách trong một tuần.', ['Mỗi bạn được mượn ba quyển.', 'Thư viện mở cả ngày Chủ nhật.'], 'Chọn chi tiết xuất hiện nguyên văn trong đoạn.', 'Đoạn đọc nêu thời gian mượn là một tuần.')
    ]
  },

  // TIẾNG ANH: từ vựng trong hội thoại và ngữ cảnh giao tiếp quen thuộc.
  {
    grade: 1, subject: 'english', title: 'English in class: greetings and requests', icon: '👋',
    description: 'Use simple greetings and polite classroom phrases in everyday situations.',
    questions: [
      choice('Your teacher says, “Good morning!” What can you say?', 'Good morning!', ['Good night!', 'Goodbye!'], 'Reply with the same daytime greeting.', '“Good morning!” is a suitable morning reply.'),
      fill('Complete the phrase: “___ you.” (Thank / Blue)', 'Thank', 'Choose the polite word used to show gratitude.', '“Thank you” is a polite phrase used to show gratitude.'),
      trueFalse('“Open your book, please” is a polite classroom instruction.', true, 'Notice the word “please”.', 'Adding “please” makes the request polite.', 'en'),
      match('Match the classroom word to the object.', [['book', '📘'], ['pencil', '✏️'], ['ruler', '📏']], 'Think of what each word names.', 'A book is 📘, a pencil is ✏️, and a ruler is 📏.'),
      choice('You want to leave the classroom. What should you ask?', 'May I go out, please?', ['I am a ruler.', 'It is a blue bag.'], 'Choose a polite question asking for permission.', '“May I ...?” is a polite way to ask permission.')
    ]
  },
  {
    grade: 2, subject: 'english', title: 'English conversation: at the snack shop', icon: '🍎',
    description: 'Practice food words, polite requests and short answers about preferences.',
    questions: [
      choice('A: “Would you like an apple?” B: “Yes, ___.”', 'please', ['sorry', 'blue'], 'Choose the polite word that completes the reply.', '“Yes, please” is a natural polite response.'),
      fill('Complete: “I would like ___ orange, please.”', 'an', 'Use “an” before a vowel sound.', '“Orange” begins with a vowel sound, so we say “an orange”.'),
      trueFalse('If you do not want some juice, you can say, “No, thank you.”', true, 'This is a polite way to refuse.', '“No, thank you” politely says that you do not want it.', 'en'),
      ordering('Put the conversation in a sensible order.', ['Can I have a banana, please?', 'Here you are.', 'Thank you.'], 'The customer asks, the seller gives, then the customer thanks.', 'The polite exchange follows request, response, thanks.'),
      choice('A: “How much is the sandwich?” B: “It is ___ dollars.”', 'two', ['hungry', 'under'], 'Choose a number to tell a price.', 'A price is given with a number: “two dollars”.')
    ]
  },
  {
    grade: 3, subject: 'english', title: 'English in my town: places and directions', icon: '🗺️',
    description: 'Name common places and understand simple directions around town.',
    questions: [
      choice('You want to borrow a book. Where do you go?', 'To the library.', ['To the bakery.', 'To the playground.'], 'Choose the place where people read and borrow books.', 'People can borrow books at a library.'),
      fill('The bank is next ___ the supermarket. (to / under)', 'to', 'The phrase is “next to”.', '“Next to” means beside.'),
      trueFalse('“Turn left” means go to the right.', false, 'Left and right are opposite directions.', '“Turn left” tells you to go to the left.', 'en'),
      match('Match each place to what you can do there.', [['bakery', 'buy bread'], ['park', 'play outside'], ['hospital', 'see a doctor']], 'Think about the main purpose of each place.', 'A bakery sells bread, a park is for outdoor play, and a hospital gives medical care.'),
      choice('A: “Where is the post office?” B: “It is ___ the school and the bank.”', 'between', ['behind of', 'in front'], 'Use the word for a place in the middle of two places.', '“Between” describes a place in the middle of two others.')
    ]
  },
  {
    grade: 4, subject: 'english', title: 'English for everyday plans and invitations', icon: '🎈',
    description: 'Make simple invitations, tell the time and respond appropriately.',
    questions: [
      choice('You invite a friend: “Would you like to play badminton?” Choose a positive reply.', 'Yes, I’d love to.', ['No, it isn’t.', 'I am ten.'], 'Choose a reply that accepts the invitation.', '“Yes, I’d love to” is a friendly acceptance.'),
      fill('The film starts ___ 6 o’clock.', 'at', 'Use the preposition used with a clock time.', 'We use “at” before a specific time.'),
      trueFalse('“Let’s visit the museum” is a suggestion.', true, '“Let’s ...” can introduce an idea to do together.', '“Let’s” is a common way to make a suggestion.', 'en'),
      ordering('Arrange the short exchange.', ['What time shall we meet?', 'Let’s meet at four.', 'Great. See you then!'], 'First ask about the time, then suggest it, then agree.', 'The exchange follows question, suggestion, agreement.'),
      choice('Your friend says, “Sorry, I can’t come today.” What is a kind reply?', 'That’s OK. Maybe next time.', ['You are a museum.', 'It is at four o’clock.'], 'Reply kindly when someone cannot come.', 'This answer accepts the refusal and suggests another time.')
    ]
  },
  {
    grade: 5, subject: 'english', title: 'English reading and real-life problem solving', icon: '✈️',
    description: 'Read a short travel notice and use English to ask for help politely.',
    questions: [
      choice('Read: “The school trip leaves at 8:30 on Friday. Bring a hat and a bottle of water.” When does the trip leave?', 'At 8:30 on Friday.', ['At 8:00 on Monday.', 'At 9:30 on Friday.'], 'Find the departure time and day in the first sentence.', 'The notice says the trip leaves at 8:30 on Friday.'),
      fill('You do not understand. Ask: “Could you ___ that, please?”', 'repeat', 'Choose the verb that asks someone to say it again.', '“Could you repeat that, please?” is a polite request.'),
      trueFalse('The travel notice says students should bring a hat and water.', true, 'Check the second sentence.', 'The notice asks students to bring both items.', 'en'),
      match('Match the polite question to its purpose.', [['Could you help me?', 'Ask for help'], ['Where is platform two?', 'Ask for a place'], ['May I have some water?', 'Ask for something']], 'Identify what information or action each question requests.', 'Each question politely asks for help, directions, or an item.'),
      choice('You are lost at a station. Which sentence is most useful?', 'Excuse me, how can I get to the bus stop?', ['I went swimming yesterday.', 'My favourite colour is green.'], 'Choose a polite question for asking directions.', 'The sentence politely asks how to reach a place.')
    ]
  }
];

const SUBJECT_CODES: Record<SubjectId, string> = {
  math: 'm',
  vietnamese: 'v',
  english: 'e'
};

const SUBJECT_LABELS: Record<SubjectId, string> = {
  math: 'Toán',
  vietnamese: 'Tiếng Việt',
  english: 'Tiếng Anh'
};

export const EXPANDED_PRACTICE_LESSONS: Lesson[] = practiceSpecs.map((spec) => {
  const subjectCode = SUBJECT_CODES[spec.subject];
  const unitId = `g${spec.grade}_${subjectCode}_practiceplus`;

  return {
    id: `${unitId}_l1`,
    title: spec.title,
    grade: spec.grade,
    subject: spec.subject,
    unitId,
    unitTitle: `Thực hành mở rộng ${SUBJECT_LABELS[spec.subject]} lớp ${spec.grade}`,
    icon: spec.icon,
    description: spec.description,
    difficulty: spec.grade <= 2 ? 1 : 2,
    passingScore: 60,
    xpReward: 50,
    starsRequiredToUnlock: 0,
    questions: spec.questions.map((question, index) => ({
      ...question,
      id: `q${index + 1}`
    }))
  };
});
