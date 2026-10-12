import { Lesson, MatchingPair, OrderItem, Question, SubjectId } from '../types/curriculum';

type ExtraInteraction =
  | { type: 'word_match'; prompt: string; pairs: [MatchingPair, MatchingPair, MatchingPair] }
  | { type: 'ordering'; prompt: string; items: [OrderItem, OrderItem, OrderItem] };

interface ChoiceSpec {
  prompt: string;
  answer: string;
  distractors: [string, string];
  hint: string;
  interaction?: ExtraInteraction;
}

interface LessonSpec {
  grade: 1 | 2 | 3 | 4 | 5;
  subject: SubjectId;
  unit: number;
  title: string;
  icon: string;
  description: string;
  questions: [ChoiceSpec, ChoiceSpec, ChoiceSpec, ChoiceSpec];
}

function makeQuestion(spec: ChoiceSpec, questionIndex: number, subject: SubjectId): Question {
  if (spec.interaction?.type === 'word_match') {
    return {
      id: `q${questionIndex + 1}`,
      type: 'word_match',
      prompt: spec.interaction.prompt,
      hint: spec.hint,
      interactiveData: { matchingPairs: spec.interaction.pairs }
    };
  }

  if (spec.interaction?.type === 'ordering') {
    return {
      id: `q${questionIndex + 1}`,
      type: 'ordering',
      prompt: spec.interaction.prompt,
      hint: spec.hint,
      interactiveData: { orderItems: spec.interaction.items }
    };
  }

  if (questionIndex === 1) {
    return {
      id: `q${questionIndex + 1}`,
      type: 'fill_in_the_blank',
      prompt: spec.prompt,
      hint: spec.hint,
      interactiveData: { blanks: [spec.answer] }
    };
  }

  if (questionIndex === 3) {
    const isStatementTrue = (questionIndex + spec.answer.length) % 2 === 0;
    const statementAnswer = isStatementTrue ? spec.answer : spec.distractors[0];
    const prompt = subject === 'english'
      ? `True or false: “${spec.prompt.replace(/\?$/, '')}” The answer is “${statementAnswer}”.`
      : `Đúng hay sai? “${spec.prompt.replace(/\?$/, '')}” Đáp án là “${statementAnswer}”.`;
    return {
      id: `q${questionIndex + 1}`,
      type: 'true_false',
      prompt,
      hint: spec.hint,
      options: subject === 'english'
        ? [
            { id: 'true', text: 'True', isCorrect: isStatementTrue },
            { id: 'false', text: 'False', isCorrect: !isStatementTrue }
          ]
        : [
            { id: 'true', text: 'Đúng', isCorrect: isStatementTrue },
            { id: 'false', text: 'Sai', isCorrect: !isStatementTrue }
          ]
    };
  }

  const answers = [spec.answer, ...spec.distractors];
  const correctIndex = questionIndex % answers.length;
  const rotated = [...answers.slice(correctIndex), ...answers.slice(0, correctIndex)];

  return {
    id: `q${questionIndex + 1}`,
    type: 'multiple_choice',
    prompt: spec.prompt,
    hint: spec.hint,
    options: rotated.map((text, optionIndex) => ({
      id: `option_${optionIndex + 1}`,
      text,
      isCorrect: text === spec.answer
    }))
  };
}

const specs: LessonSpec[] = [
  // TOÁN — LỚP 1
  { grade: 1, subject: 'math', unit: 1, title: 'Cộng trong phạm vi 10', icon: '➕', description: 'Luyện cộng bằng cách đếm thêm và nhận biết phép tính.', questions: [
    { prompt: '3 + 2 = ?', answer: '5', distractors: ['4', '6'], hint: 'Bắt đầu từ 3 rồi đếm thêm 2 bước.' },
    { prompt: '4 + 5 = ?', answer: '9', distractors: ['8', '10'], hint: 'Đếm tiếp 5, 6, 7, 8, 9.' },
    { prompt: '6 + 1 = ?', answer: '7', distractors: ['6', '8'], hint: 'Thêm 1 là số liền sau.' },
    { prompt: '2 + 6 = ?', answer: '8', distractors: ['7', '9'], hint: 'Có thể đổi chỗ: 6 + 2.' }
  ] },
  { grade: 1, subject: 'math', unit: 2, title: 'Trừ trong phạm vi 10', icon: '➖', description: 'Tập bớt đi và tìm số còn lại trong phạm vi 10.', questions: [
    { prompt: '8 - 3 = ?', answer: '5', distractors: ['4', '6'], hint: 'Từ 8 lùi lại 3 bước.' },
    { prompt: '10 - 4 = ?', answer: '6', distractors: ['5', '7'], hint: 'Tách 10 thành 4 và phần còn lại.' },
    { prompt: '7 - 1 = ?', answer: '6', distractors: ['5', '8'], hint: 'Bớt 1 là lùi một số.' },
    { prompt: '9 - 5 = ?', answer: '4', distractors: ['3', '5'], hint: 'Đếm lùi từ 9 năm bước.' }
  ] },
  { grade: 1, subject: 'math', unit: 3, title: 'So sánh và tìm số còn thiếu', icon: '🔎', description: 'Nhận biết số lớn bé và hoàn thành dãy số quen thuộc.', questions: [
    { prompt: 'Số nào lớn hơn: 7 hay 5?', answer: '7', distractors: ['5', 'Hai số bằng nhau'], hint: 'Trên trục số, số ở bên phải lớn hơn.' },
    { prompt: 'Điền số tiếp theo: 2, 4, 6, ...', answer: '8', distractors: ['7', '9'], hint: 'Mỗi lần dãy tăng thêm 2.' },
    { prompt: 'Số nào đứng ngay trước 10?', answer: '9', distractors: ['8', '11'], hint: 'Đếm lùi một bước từ 10.', interaction: { type: 'ordering', prompt: 'Sắp xếp các số từ bé đến lớn.', items: [{ id: 'six', text: '6', correctIndex: 1 }, { id: 'two', text: '2', correctIndex: 0 }, { id: 'nine', text: '9', correctIndex: 2 }] } },
    { prompt: 'Điền dấu đúng: 6 ... 6', answer: '=', distractors: ['<', '>'], hint: 'Hai số giống nhau thì dùng dấu bằng.' }
  ] },
  // TOÁN — LỚP 2
  { grade: 2, subject: 'math', unit: 1, title: 'Cộng trừ trong phạm vi 100', icon: '💯', description: 'Củng cố cộng trừ hai chữ số và kiểm tra kết quả.', questions: [
    { prompt: '24 + 13 = ?', answer: '37', distractors: ['36', '47'], hint: 'Cộng hàng đơn vị trước, rồi đến hàng chục.' },
    { prompt: '56 - 22 = ?', answer: '34', distractors: ['32', '44'], hint: 'Trừ hàng đơn vị và hàng chục tương ứng.' },
    { prompt: '38 + 7 = ?', answer: '45', distractors: ['44', '46'], hint: '38 + 2 = 40, còn cộng thêm 5.' },
    { prompt: '70 - 8 = ?', answer: '62', distractors: ['68', '60'], hint: 'Bớt 8 đơn vị khỏi 70.' }
  ] },
  { grade: 2, subject: 'math', unit: 2, title: 'Bảng nhân 2, 5 và 10', icon: '✖️', description: 'Luyện các phép nhân cơ bản qua nhóm đồ vật bằng nhau.', questions: [
    { prompt: '2 × 4 = ?', answer: '8', distractors: ['6', '10'], hint: 'Tính 2 + 2 + 2 + 2.' },
    { prompt: '5 × 3 = ?', answer: '15', distractors: ['8', '20'], hint: 'Đếm thêm 5 ba lần.' },
    { prompt: '10 × 6 = ?', answer: '60', distractors: ['16', '50'], hint: 'Nhân với 10, thêm một chữ số 0.' },
    { prompt: 'Có 4 đôi tất. Có tất cả bao nhiêu chiếc?', answer: '8', distractors: ['6', '10'], hint: 'Mỗi đôi có 2 chiếc.' }
  ] },
  { grade: 2, subject: 'math', unit: 3, title: 'Đo độ dài và xem giờ', icon: '⏰', description: 'Ôn đơn vị đo quen thuộc và cách đọc giờ tròn.', questions: [
    { prompt: '1 mét bằng bao nhiêu xăng-ti-mét?', answer: '100 cm', distractors: ['10 cm', '1.000 cm'], hint: 'Một mét gồm một trăm xăng-ti-mét.' },
    { prompt: 'Kim phút chỉ số 12, kim giờ chỉ số 7. Mấy giờ?', answer: '7 giờ', distractors: ['12 giờ', '6 giờ'], hint: 'Kim phút ở số 12 báo giờ tròn.' },
    { prompt: 'Thước dài 20 cm và bút dài 15 cm. Thước dài hơn bao nhiêu?', answer: '5 cm', distractors: ['4 cm', '35 cm'], hint: 'Lấy 20 trừ 15.', interaction: { type: 'ordering', prompt: 'Sắp xếp đơn vị thời gian từ ngắn đến dài.', items: [{ id: 'minute', text: '1 phút', correctIndex: 1 }, { id: 'second', text: '1 giây', correctIndex: 0 }, { id: 'hour', text: '1 giờ', correctIndex: 2 }] } },
    { prompt: 'Đơn vị nào phù hợp để đo chiều dài lớp học?', answer: 'Mét', distractors: ['Gam', 'Lít'], hint: 'Mét dùng để đo độ dài.' }
  ] },
  // TOÁN — LỚP 3
  { grade: 3, subject: 'math', unit: 1, title: 'Nhân chia và bảng cửu chương', icon: '✖️', description: 'Thực hành nhân chia và mối liên hệ giữa hai phép tính.', questions: [
    { prompt: '7 × 8 = ?', answer: '56', distractors: ['54', '64'], hint: 'Nhớ bảng nhân 7: 7 × 8.' },
    { prompt: '54 ÷ 6 = ?', answer: '9', distractors: ['8', '7'], hint: 'Tìm số nhân với 6 bằng 54.' },
    { prompt: '9 × 4 = ?', answer: '36', distractors: ['32', '45'], hint: '9 × 4 bằng 4 nhóm 9.' },
    { prompt: 'Có 42 viên bi chia đều cho 7 bạn. Mỗi bạn được mấy viên?', answer: '6', distractors: ['5', '7'], hint: 'Tính 42 ÷ 7.' }
  ] },
  { grade: 3, subject: 'math', unit: 2, title: 'Chu vi hình vuông và hình chữ nhật', icon: '📐', description: 'Tính chu vi bằng cách cộng độ dài các cạnh.', questions: [
    { prompt: 'Hình vuông cạnh 5 cm có chu vi bao nhiêu?', answer: '20 cm', distractors: ['10 cm', '25 cm'], hint: 'Chu vi hình vuông bằng cạnh nhân 4.' },
    { prompt: 'Hình chữ nhật dài 8 cm, rộng 3 cm. Chu vi là?', answer: '22 cm', distractors: ['11 cm', '24 cm'], hint: 'Cộng chiều dài và chiều rộng rồi nhân 2.' },
    { prompt: 'Hình vuông chu vi 36 cm. Mỗi cạnh dài bao nhiêu?', answer: '9 cm', distractors: ['8 cm', '12 cm'], hint: 'Lấy chu vi chia cho 4.' },
    { prompt: 'Hình chữ nhật có hai cạnh 6 cm và 4 cm. Chu vi là?', answer: '20 cm', distractors: ['10 cm', '24 cm'], hint: 'Có hai cạnh dài và hai cạnh rộng.' }
  ] },
  { grade: 3, subject: 'math', unit: 3, title: 'Phân số và chia đều', icon: '🍕', description: 'Làm quen tử số, mẫu số và phần bằng nhau.', questions: [
    { prompt: 'Một chiếc bánh chia 4 phần bằng nhau, ăn 1 phần. Phân số đã ăn là?', answer: '1/4', distractors: ['4/1', '1/3'], hint: 'Tử số là số phần đã lấy; mẫu số là tổng số phần.' },
    { prompt: 'Phân số nào biểu thị một nửa?', answer: '1/2', distractors: ['1/3', '2/1'], hint: 'Một nửa là 1 trong 2 phần bằng nhau.' },
    { prompt: 'Trong phân số 3/5, mẫu số là số nào?', answer: '5', distractors: ['3', '8'], hint: 'Mẫu số nằm bên dưới vạch phân số.', interaction: { type: 'ordering', prompt: 'Xếp các phân số theo thứ tự từ bé đến lớn.', items: [{ id: 'half', text: '1/2', correctIndex: 1 }, { id: 'quarter', text: '1/4', correctIndex: 0 }, { id: 'three_quarters', text: '3/4', correctIndex: 2 }] } },
    { prompt: 'Có 12 quả cam chia đều thành 3 túi. Mỗi túi có?', answer: '4 quả', distractors: ['3 quả', '9 quả'], hint: 'Tính 12 chia cho 3.' }
  ] },
  // TOÁN — LỚP 4
  { grade: 4, subject: 'math', unit: 1, title: 'Cộng trừ phân số cùng mẫu số', icon: '🍰', description: 'Cộng trừ phân số khi các phần được chia cùng kích thước.', questions: [
    { prompt: '2/7 + 3/7 = ?', answer: '5/7', distractors: ['5/14', '1/7'], hint: 'Giữ nguyên mẫu số, cộng hai tử số.' },
    { prompt: '6/9 - 2/9 = ?', answer: '4/9', distractors: ['4/18', '8/9'], hint: 'Giữ nguyên mẫu số, lấy tử số trừ nhau.' },
    { prompt: '1/8 + 4/8 = ?', answer: '5/8', distractors: ['5/16', '3/8'], hint: 'Các phần tám có cùng mẫu số.' },
    { prompt: '7/10 - 3/10 = ?', answer: '4/10', distractors: ['4/20', '10/10'], hint: 'Lấy 7 phần trừ 3 phần mười.' }
  ] },
  { grade: 4, subject: 'math', unit: 2, title: 'Diện tích hình chữ nhật và hình vuông', icon: '🟦', description: 'Vận dụng công thức diện tích vào các hình quen thuộc.', questions: [
    { prompt: 'Hình chữ nhật dài 9 cm, rộng 4 cm. Diện tích là?', answer: '36 cm²', distractors: ['26 cm²', '36 cm'], hint: 'Diện tích bằng chiều dài nhân chiều rộng.' },
    { prompt: 'Hình vuông cạnh 7 cm có diện tích?', answer: '49 cm²', distractors: ['28 cm²', '14 cm²'], hint: 'Lấy cạnh nhân với chính nó.' },
    { prompt: 'Mảnh vườn dài 12 m, rộng 5 m. Diện tích là?', answer: '60 m²', distractors: ['34 m²', '60 m'], hint: 'Đơn vị diện tích là mét vuông.' },
    { prompt: 'Diện tích hình chữ nhật 48 cm², rộng 6 cm. Dài bao nhiêu?', answer: '8 cm', distractors: ['7 cm', '42 cm'], hint: 'Lấy diện tích chia cho chiều rộng.' }
  ] },
  { grade: 4, subject: 'math', unit: 3, title: 'Đổi đơn vị khối lượng và thời gian', icon: '⚖️', description: 'Ôn quan hệ giữa ki-lô-gam, gam, phút và giây.', questions: [
    { prompt: '1 kg bằng bao nhiêu gam?', answer: '1.000 g', distractors: ['100 g', '10.000 g'], hint: 'Một ki-lô-gam bằng một nghìn gam.' },
    { prompt: '3 phút bằng bao nhiêu giây?', answer: '180 giây', distractors: ['30 giây', '300 giây'], hint: 'Mỗi phút có 60 giây.' },
    { prompt: '2 kg 500 g bằng bao nhiêu gam?', answer: '2.500 g', distractors: ['2.050 g', '250 g'], hint: 'Đổi 2 kg ra gam rồi cộng thêm 500 g.', interaction: { type: 'ordering', prompt: 'Sắp xếp độ dài từ ngắn đến dài.', items: [{ id: 'meter', text: '1 m', correctIndex: 1 }, { id: 'centimeter', text: '1 cm', correctIndex: 0 }, { id: 'kilometer', text: '1 km', correctIndex: 2 }] } },
    { prompt: 'Một chuyến đi bắt đầu lúc 8 giờ và kết thúc lúc 10 giờ. Chuyến đi dài?', answer: '2 giờ', distractors: ['3 giờ', '18 giờ'], hint: 'Lấy thời điểm kết thúc trừ thời điểm bắt đầu.' }
  ] },
  // TOÁN — LỚP 5
  { grade: 5, subject: 'math', unit: 1, title: 'Cộng trừ số thập phân', icon: '🔢', description: 'Đặt thẳng hàng dấu phẩy khi tính với số thập phân.', questions: [
    { prompt: '2,4 + 1,35 = ?', answer: '3,75', distractors: ['3,39', '2,75'], hint: 'Viết 2,4 thành 2,40 rồi cộng.' },
    { prompt: '8,6 - 3,25 = ?', answer: '5,35', distractors: ['5,45', '4,35'], hint: 'Viết 8,6 thành 8,60.' },
    { prompt: '0,75 + 0,2 = ?', answer: '0,95', distractors: ['0,27', '0,85'], hint: 'Viết 0,2 thành 0,20.' },
    { prompt: '10 - 4,8 = ?', answer: '5,2', distractors: ['6,2', '5,8'], hint: 'Viết 10 thành 10,0 trước khi trừ.' }
  ] },
  { grade: 5, subject: 'math', unit: 2, title: 'Tỉ số phần trăm', icon: '📊', description: 'Nhận biết và tính phần trăm của một số lượng đơn giản.', questions: [
    { prompt: '25% viết dưới dạng phân số tối giản là?', answer: '1/4', distractors: ['1/2', '1/5'], hint: '25% = 25/100.' },
    { prompt: '10% của 200 là bao nhiêu?', answer: '20', distractors: ['2', '40'], hint: '10% là một phần mười.' },
    { prompt: 'Lớp có 20 học sinh, 50% là nữ. Có bao nhiêu bạn nữ?', answer: '10', distractors: ['5', '15'], hint: '50% nghĩa là một nửa.' },
    { prompt: 'Viết 0,4 dưới dạng phần trăm.', answer: '40%', distractors: ['4%', '400%'], hint: 'Nhân số thập phân với 100.' }
  ] },
  { grade: 5, subject: 'math', unit: 3, title: 'Vận tốc, quãng đường và thời gian', icon: '🚲', description: 'Luyện chọn đúng phép tính trong bài toán chuyển động đều.', questions: [
    { prompt: 'Đi 60 km trong 2 giờ. Vận tốc là?', answer: '30 km/giờ', distractors: ['120 km/giờ', '58 km/giờ'], hint: 'Vận tốc bằng quãng đường chia thời gian.' },
    { prompt: 'Xe chạy 40 km/giờ trong 3 giờ. Quãng đường là?', answer: '120 km', distractors: ['43 km', '13 km'], hint: 'Quãng đường bằng vận tốc nhân thời gian.' },
    { prompt: 'Đi 90 km với vận tốc 30 km/giờ. Thời gian là?', answer: '3 giờ', distractors: ['60 giờ', '2 giờ'], hint: 'Thời gian bằng quãng đường chia vận tốc.', interaction: { type: 'ordering', prompt: 'Sắp xếp các bước để tìm vận tốc.', items: [{ id: 'divide', text: 'Chia quãng đường cho thời gian', correctIndex: 1 }, { id: 'distance', text: 'Xác định quãng đường', correctIndex: 0 }, { id: 'speed', text: 'Ghi kết quả vận tốc', correctIndex: 2 }] } },
    { prompt: 'Một người đi 12 km trong 4 giờ. Vận tốc trung bình là?', answer: '3 km/giờ', distractors: ['8 km/giờ', '48 km/giờ'], hint: 'Chia tổng quãng đường cho tổng thời gian.' }
  ] },
  // TIẾNG VIỆT — LỚP 1
  { grade: 1, subject: 'vietnamese', unit: 1, title: 'Âm đầu và vần đơn giản', icon: '🔤', description: 'Nhận biết âm đầu, vần và ghép tiếng quen thuộc.', questions: [
    { prompt: 'Tiếng “mẹ” bắt đầu bằng âm nào?', answer: 'm', distractors: ['b', 'n'], hint: 'Đọc chậm tiếng mẹ và nghe âm đầu.' },
    { prompt: 'Tiếng nào có vần “an”?', answer: 'bàn', distractors: ['bé', 'bút'], hint: 'Tìm tiếng có phần cuối đọc là an.' },
    { prompt: 'Chữ nào là chữ viết hoa?', answer: 'A', distractors: ['a viết thường', 'Ă'], hint: 'Chữ viết hoa thường có hình dáng lớn hơn.' },
    { prompt: 'Tiếng “cá” mang dấu thanh nào?', answer: 'Dấu sắc', distractors: ['Dấu huyền', 'Dấu hỏi'], hint: 'Dấu sắc nghiêng lên trên.' }
  ] },
  { grade: 1, subject: 'vietnamese', unit: 2, title: 'Dấu thanh trong tiếng Việt', icon: '🔊', description: 'Phân biệt các dấu thanh qua tiếng và từ quen thuộc.', questions: [
    { prompt: 'Từ “bé” mang dấu thanh nào?', answer: 'Dấu sắc', distractors: ['Dấu hỏi', 'Dấu ngang'], hint: 'Dấu nằm phía trên chữ e.' },
    { prompt: 'Từ “mẹ” mang dấu thanh nào?', answer: 'Dấu nặng', distractors: ['Dấu ngã', 'Dấu huyền'], hint: 'Dấu chấm nằm dưới chữ e.' },
    { prompt: 'Từ nào mang dấu huyền?', answer: 'bà', distractors: ['bé', 'bỏ'], hint: 'Dấu huyền nghiêng xuống.' },
    { prompt: 'Từ nào không có dấu thanh?', answer: 'ba', distractors: ['bá', 'bà'], hint: 'Tiếng không dấu được đọc với thanh ngang.' }
  ] },
  { grade: 1, subject: 'vietnamese', unit: 3, title: 'Từ chỉ người, vật và hoạt động', icon: '🧸', description: 'Mở rộng vốn từ gần gũi với gia đình và trường học.', questions: [
    { prompt: 'Từ nào chỉ người?', answer: 'Cô giáo', distractors: ['Bông hoa', 'Chạy'], hint: 'Cô giáo là một người.' },
    { prompt: 'Từ nào chỉ đồ vật?', answer: 'Cặp sách', distractors: ['Vui vẻ', 'Nhảy'], hint: 'Đồ vật có thể cầm hoặc sử dụng.' },
    { prompt: 'Từ nào chỉ hoạt động?', answer: 'Đọc sách', distractors: ['Quyển vở', 'Màu xanh'], hint: 'Hoạt động thường trả lời câu hỏi làm gì.', interaction: { type: 'word_match', prompt: 'Nối từ với nhóm nghĩa phù hợp.', pairs: [{ id: 'cat', left: 'Chú mèo', right: 'Con vật', leftEmoji: '🐈', rightEmoji: '🐾' }, { id: 'table', left: 'Cái bàn', right: 'Đồ vật', leftEmoji: '🪑', rightEmoji: '📦' }, { id: 'read', left: 'Đọc sách', right: 'Hoạt động', leftEmoji: '📖', rightEmoji: '🏃' }] } },
    { prompt: 'Từ nào chỉ con vật?', answer: 'Chú mèo', distractors: ['Cái bàn', 'Ngủ ngon'], hint: 'Con vật có thể kêu meo meo.' }
  ] },
  // TIẾNG VIỆT — LỚP 2
  { grade: 2, subject: 'vietnamese', unit: 1, title: 'Phân biệt ch/tr và s/x', icon: '📝', description: 'Luyện chọn cách viết đúng trong các tiếng thường gặp.', questions: [
    { prompt: 'Từ nào viết đúng?', answer: 'chăm chỉ', distractors: ['trăm trỉ', 'chăm chĩ'], hint: 'Đọc tiếng chăm với âm đầu ch.' },
    { prompt: 'Điền âm đầu: ...ường học', answer: 'tr', distractors: ['ch', 's'], hint: 'Từ đúng là trường học.' },
    { prompt: 'Từ nào viết đúng?', answer: 'sạch sẽ', distractors: ['xạch xẽ', 'sạch xẽ'], hint: 'Cả hai tiếng đều bắt đầu bằng s.' },
    { prompt: 'Điền vào chỗ trống: dòng ...ông', answer: 's', distractors: ['x', 'ch'], hint: 'Ta viết dòng sông.' }
  ] },
  { grade: 2, subject: 'vietnamese', unit: 2, title: 'Từ chỉ đặc điểm và hoạt động', icon: '🌈', description: 'Nhận biết từ miêu tả và từ nêu hoạt động.', questions: [
    { prompt: 'Từ nào chỉ đặc điểm?', answer: 'cao', distractors: ['chạy', 'cái cây'], hint: 'Cao miêu tả dáng vẻ của sự vật.' },
    { prompt: 'Từ nào chỉ hoạt động?', answer: 'đọc', distractors: ['xinh', 'quyển sách'], hint: 'Đọc là việc chúng ta làm.' },
    { prompt: 'Trong câu “Bé hát rất hay”, từ chỉ hoạt động là?', answer: 'hát', distractors: ['bé', 'hay'], hint: 'Hỏi bé làm gì.' },
    { prompt: 'Từ nào miêu tả bầu trời?', answer: 'trong xanh', distractors: ['bay', 'đám mây'], hint: 'Từ miêu tả cho biết bầu trời thế nào.' }
  ] },
  { grade: 2, subject: 'vietnamese', unit: 3, title: 'Câu kể và dấu câu', icon: '❗', description: 'Chọn dấu câu và nhận biết câu kể đủ ý.', questions: [
    { prompt: 'Cuối câu kể thông thường dùng dấu nào?', answer: 'Dấu chấm (.)', distractors: ['Dấu hỏi (?)', 'Dấu phẩy (,)'], hint: 'Câu kể kết thúc bằng một dấu chấm.' },
    { prompt: 'Câu nào dùng dấu hỏi đúng?', answer: 'Bạn tên là gì?', distractors: ['Bạn tên là gì.', 'Bạn tên là gì!'], hint: 'Câu hỏi cần dấu hỏi ở cuối.' },
    { prompt: 'Câu nào kể về hoạt động?', answer: 'Lan đang đọc sách.', distractors: ['Lan có đọc sách không?', 'Ôi, quyển sách đẹp quá!'], hint: 'Câu kể thông báo một việc.', interaction: { type: 'word_match', prompt: 'Nối câu với dấu câu thường dùng ở cuối câu.', pairs: [{ id: 'telling', left: 'Lan đang đọc sách', right: 'Dấu chấm (.)', leftEmoji: '📖', rightEmoji: '🔵' }, { id: 'asking', left: 'Bạn tên là gì', right: 'Dấu hỏi (?)', leftEmoji: '❓', rightEmoji: '🔎' }, { id: 'feeling', left: 'Quyển sách đẹp quá', right: 'Dấu chấm than (!)', leftEmoji: '✨', rightEmoji: '❗' }] } },
    { prompt: 'Trong câu “Mẹ nấu cơm”, ai đang nấu cơm?', answer: 'Mẹ', distractors: ['Cơm', 'Bé'], hint: 'Tìm người thực hiện hoạt động.' }
  ] },
  // TIẾNG VIỆT — LỚP 3
  { grade: 3, subject: 'vietnamese', unit: 1, title: 'Từ đồng nghĩa và trái nghĩa', icon: '↔️', description: 'So sánh nghĩa của từ và chọn từ phù hợp ngữ cảnh.', questions: [
    { prompt: 'Từ nào gần nghĩa với “siêng năng”?', answer: 'Chăm chỉ', distractors: ['Lười biếng', 'Ồn ào'], hint: 'Siêng năng nghĩa là chịu khó làm việc.' },
    { prompt: 'Từ trái nghĩa với “dũng cảm” là?', answer: 'Nhút nhát', distractors: ['Can đảm', 'Mạnh mẽ'], hint: 'Tìm từ có nghĩa ngược lại.' },
    { prompt: 'Từ nào gần nghĩa với “vui vẻ”?', answer: 'Phấn khởi', distractors: ['Buồn bã', 'Lo lắng'], hint: 'Cả hai từ đều diễn tả cảm xúc vui.' },
    { prompt: 'Từ trái nghĩa với “sạch sẽ” là?', answer: 'Bẩn thỉu', distractors: ['Gọn gàng', 'Tinh tươm'], hint: 'Chọn từ chỉ trạng thái ngược lại.' }
  ] },
  { grade: 3, subject: 'vietnamese', unit: 2, title: 'Danh từ, động từ và tính từ', icon: '📚', description: 'Phân loại từ theo người/vật, hoạt động và đặc điểm.', questions: [
    { prompt: 'Từ nào là danh từ chỉ sự vật?', answer: 'Dòng sông', distractors: ['Chảy', 'Êm đềm'], hint: 'Danh từ gọi tên người, vật hoặc hiện tượng.' },
    { prompt: 'Từ nào là động từ?', answer: 'Tưới cây', distractors: ['Cái bình', 'Xanh tốt'], hint: 'Động từ chỉ hoạt động hoặc trạng thái.' },
    { prompt: 'Từ nào là tính từ?', answer: 'Dịu dàng', distractors: ['Cô bé', 'Nói chuyện'], hint: 'Tính từ thường nêu đặc điểm.' },
    { prompt: 'Trong câu “Chim hót líu lo”, từ chỉ hoạt động là?', answer: 'hót', distractors: ['chim', 'líu lo'], hint: 'Chim làm gì?' }
  ] },
  { grade: 3, subject: 'vietnamese', unit: 3, title: 'Mở rộng vốn từ thiên nhiên', icon: '🌿', description: 'Chọn từ ngữ đúng khi nói về cây cối, thời tiết và cảnh vật.', questions: [
    { prompt: 'Từ nào chỉ hiện tượng thời tiết?', answer: 'Mưa rào', distractors: ['Bút chì', 'Trang vở'], hint: 'Mưa rào xảy ra ngoài trời.' },
    { prompt: 'Từ nào miêu tả dòng suối?', answer: 'Trong veo', distractors: ['Đọc sách', 'Cành cây'], hint: 'Chọn từ nêu đặc điểm của nước.' },
    { prompt: 'Từ nào cùng nhóm với “hoa, lá, thân cây”?', answer: 'Rễ', distractors: ['Cái ghế', 'Tiếng hát'], hint: 'Rễ là một bộ phận của cây.', interaction: { type: 'word_match', prompt: 'Nối từ với nhóm phù hợp.', pairs: [{ id: 'rain', left: 'Mưa rào', right: 'Hiện tượng thời tiết', leftEmoji: '🌧️', rightEmoji: '☁️' }, { id: 'root', left: 'Rễ', right: 'Bộ phận của cây', leftEmoji: '🌱', rightEmoji: '🌳' }, { id: 'carp', left: 'Cá chép', right: 'Động vật dưới nước', leftEmoji: '🐟', rightEmoji: '🌊' }] } },
    { prompt: 'Từ nào chỉ con vật sống dưới nước?', answer: 'Cá chép', distractors: ['Chim sẻ', 'Thỏ trắng'], hint: 'Con vật này bơi bằng vây.' }
  ] },
  // TIẾNG VIỆT — LỚP 4
  { grade: 4, subject: 'vietnamese', unit: 1, title: 'Danh từ riêng và danh từ chung', icon: '🏷️', description: 'Phân biệt tên gọi chung với tên riêng cần viết hoa.', questions: [
    { prompt: 'Từ nào là danh từ riêng?', answer: 'Đà Nẵng', distractors: ['thành phố', 'dòng sông'], hint: 'Tên địa danh cụ thể là danh từ riêng.' },
    { prompt: 'Cách viết nào đúng?', answer: 'sông Hồng', distractors: ['Sông hồng', 'sông hồng'], hint: 'Tên chung viết thường, tên riêng viết hoa.' },
    { prompt: 'Từ nào là danh từ chung?', answer: 'học sinh', distractors: ['Nguyễn Du', 'Việt Nam'], hint: 'Danh từ chung gọi một loại người.' },
    { prompt: 'Tên người nào được viết đúng?', answer: 'Trần Quốc Toản', distractors: ['trần Quốc Toản', 'Trần quốc toản'], hint: 'Các tiếng trong tên riêng cần viết hoa.' }
  ] },
  { grade: 4, subject: 'vietnamese', unit: 2, title: 'Chủ ngữ và vị ngữ', icon: '🧩', description: 'Tìm bộ phận nêu người/vật và hoạt động, đặc điểm của câu.', questions: [
    { prompt: 'Chủ ngữ trong câu “Đàn chim bay về tổ” là?', answer: 'Đàn chim', distractors: ['bay về', 'về tổ'], hint: 'Chủ ngữ trả lời câu hỏi ai hoặc con gì.' },
    { prompt: 'Vị ngữ trong câu “Bầu trời trong xanh” là?', answer: 'trong xanh', distractors: ['Bầu trời', 'trời'], hint: 'Vị ngữ cho biết sự vật thế nào.' },
    { prompt: 'Câu nào có chủ ngữ là “Mẹ em”?', answer: 'Mẹ em đang tưới hoa.', distractors: ['Bông hoa rất đẹp.', 'Ngoài sân, gió thổi.'], hint: 'Tìm câu bắt đầu bằng Mẹ em.' },
    { prompt: 'Trong câu “Bạn Nam học bài”, vị ngữ là?', answer: 'học bài', distractors: ['Bạn Nam', 'Nam'], hint: 'Bạn Nam làm gì?' }
  ] },
  { grade: 4, subject: 'vietnamese', unit: 3, title: 'Biện pháp nhân hóa và so sánh', icon: '✨', description: 'Nhận ra hình ảnh so sánh và cách gọi sự vật như con người.', questions: [
    { prompt: 'Câu nào có hình ảnh so sánh?', answer: 'Mặt hồ phẳng như tấm gương.', distractors: ['Mặt hồ gợn sóng.', 'Hồ nằm giữa cánh đồng.'], hint: 'Từ “như” thường báo hiệu phép so sánh.' },
    { prompt: 'Câu nào có nhân hóa?', answer: 'Chị gió khẽ vuốt mái tóc cây.', distractors: ['Gió thổi qua vườn.', 'Cây cao mười mét.'], hint: 'Gió được gọi bằng từ chỉ người và làm việc của người.' },
    { prompt: 'Trong câu “Tiếng suối trong như tiếng hát”, sự vật được so sánh là?', answer: 'Tiếng suối và tiếng hát', distractors: ['Con suối và ngọn núi', 'Tiếng hát và cánh rừng'], hint: 'Tìm hai hình ảnh đứng hai bên từ “như”.', interaction: { type: 'word_match', prompt: 'Nối cách diễn đạt với đặc điểm phù hợp.', pairs: [{ id: 'like', left: 'Mặt hồ phẳng như gương', right: 'So sánh hai hình ảnh', leftEmoji: '🪞', rightEmoji: '↔️' }, { id: 'wind', left: 'Chị gió vuốt tóc cây', right: 'Gọi sự vật bằng từ chỉ người', leftEmoji: '🌬️', rightEmoji: '🧍' }, { id: 'sun', left: 'Ông mặt trời thức dậy', right: 'Gán hoạt động của người', leftEmoji: '☀️', rightEmoji: '🧍' }] } },
    { prompt: 'Câu nào tả sự vật bằng hoạt động của con người?', answer: 'Ông mặt trời thức dậy.', distractors: ['Mặt trời chiếu sáng.', 'Mặt trời ở rất xa.'], hint: 'Thức dậy là hoạt động thường gắn với con người.' }
  ] },
  // TIẾNG VIỆT — LỚP 5
  { grade: 5, subject: 'vietnamese', unit: 1, title: 'Từ đồng nghĩa, trái nghĩa và nhiều nghĩa', icon: '🧠', description: 'Lựa chọn từ chính xác và hiểu nghĩa của từ trong câu.', questions: [
    { prompt: 'Từ nào đồng nghĩa với “bảo vệ”?', answer: 'Gìn giữ', distractors: ['Phá hoại', 'Lãng quên'], hint: 'Bảo vệ là giữ gìn cho an toàn.' },
    { prompt: 'Từ trái nghĩa với “lạc quan” là?', answer: 'Bi quan', distractors: ['Vui vẻ', 'Tin tưởng'], hint: 'Tìm từ chỉ cách nhìn thiếu hy vọng.' },
    { prompt: 'Trong câu “Em bé có đôi mắt sáng”, từ “sáng” chỉ điều gì?', answer: 'Đôi mắt có ánh nhìn rõ, tinh anh', distractors: ['Trời vừa rạng đông', 'Bóng đèn đang bật'], hint: 'Dựa vào từ đứng trước để hiểu nghĩa.' },
    { prompt: 'Cặp từ nào trái nghĩa?', answer: 'Rộng – hẹp', distractors: ['Chăm chỉ – siêng năng', 'Dũng cảm – gan dạ'], hint: 'Một cặp có nghĩa ngược nhau.' }
  ] },
  { grade: 5, subject: 'vietnamese', unit: 2, title: 'Liên kết câu bằng phép lặp và phép thế', icon: '🔗', description: 'Nhận biết cách nối ý giữa các câu trong đoạn văn.', questions: [
    { prompt: 'Phép lặp trong đoạn văn là cách nào?', answer: 'Lặp lại từ ngữ để liên kết câu', distractors: ['Đổi trật tự từ tùy ý', 'Bỏ hết dấu câu'], hint: 'Tên gọi gợi ý một từ được nhắc lại.' },
    { prompt: 'Từ nào có thể thay cho “Lan” trong câu sau?', answer: 'Bạn ấy', distractors: ['Quyển vở', 'Hôm qua'], hint: 'Chọn đại từ chỉ người đã nhắc đến.' },
    { prompt: 'Trong “Nam có chiếc xe đạp. Cậu ấy giữ xe rất cẩn thận”, từ thay thế là?', answer: 'Cậu ấy', distractors: ['chiếc xe đạp', 'cẩn thận'], hint: 'Từ này thay cho tên Nam.' },
    { prompt: 'Cách nào giúp hai câu cùng nói về một sự vật được liên kết?', answer: 'Dùng từ ngữ phù hợp để nhắc lại hoặc thay thế', distractors: ['Đổi sang chủ đề khác', 'Bỏ câu thứ hai'], hint: 'Các câu cần có mối liên hệ về nội dung.' }
  ] },
  { grade: 5, subject: 'vietnamese', unit: 3, title: 'Dấu câu và câu ghép', icon: '✍️', description: 'Ôn cách dùng dấu câu và nhận biết các vế trong câu ghép.', questions: [
    { prompt: 'Câu ghép thường có bao nhiêu vế câu trở lên?', answer: 'Hai vế trở lên', distractors: ['Chỉ một vế', 'Không có vế câu'], hint: 'Câu ghép kết nối nhiều sự việc.' },
    { prompt: 'Dấu nào thường dùng để kết thúc câu cảm?', answer: 'Dấu chấm than (!)', distractors: ['Dấu phẩy (,)', 'Dấu hai chấm (:)'], hint: 'Dấu này thể hiện cảm xúc mạnh.' },
    { prompt: 'Trong câu “Trời mưa to nên đường trơn”, hai vế được nối bằng từ nào?', answer: 'nên', distractors: ['trời', 'đường'], hint: 'Từ nối thể hiện kết quả.', interaction: { type: 'word_match', prompt: 'Nối thành phần câu ghép với vai trò phù hợp.', pairs: [{ id: 'cause', left: 'Trời mưa to', right: 'Nguyên nhân', leftEmoji: '🌧️', rightEmoji: '⬅️' }, { id: 'connector', left: 'nên', right: 'Từ nối chỉ kết quả', leftEmoji: '🔗', rightEmoji: '➡️' }, { id: 'result', left: 'đường trơn', right: 'Kết quả', leftEmoji: '🛣️', rightEmoji: '✅' }] } },
    { prompt: 'Câu nào là câu ghép?', answer: 'Mặt trời lên, sương tan dần.', distractors: ['Mặt trời đỏ rực.', 'Sương mỏng.'], hint: 'Tìm câu có hai sự việc được kể.' }
  ] },
  // ENGLISH — GRADE 1
  { grade: 1, subject: 'english', unit: 1, title: 'Hello and classroom words', icon: '👋', description: 'Practice greetings and the names of familiar classroom objects.', questions: [
    { prompt: 'What do you say when you meet your teacher?', answer: 'Hello!', distractors: ['Good night!', 'Goodbye!'], hint: 'Use a greeting when you meet someone.' },
    { prompt: 'Which one is a book?', answer: '📘 Book', distractors: ['✏️ Pencil', '🪑 Chair'], hint: 'You read a book.' },
    { prompt: 'Complete: “My ___ is Anna.”', answer: 'name', distractors: ['desk', 'red'], hint: 'Tell someone what you are called.' },
    { prompt: 'Which word means “bút chì”?', answer: 'Pencil', distractors: ['Ruler', 'Bag'], hint: 'You write with it.' }
  ] },
  { grade: 1, subject: 'english', unit: 2, title: 'Animals and simple descriptions', icon: '🐾', description: 'Name common animals and describe them with simple words.', questions: [
    { prompt: 'Which animal says “meow”?', answer: 'Cat', distractors: ['Dog', 'Duck'], hint: 'This pet likes to purr.' },
    { prompt: 'Choose the correct sentence: ___ is a bird.', answer: 'It', distractors: ['They', 'We'], hint: 'Use “it” for one animal.' },
    { prompt: 'What color is a green frog?', answer: 'Green', distractors: ['Purple', 'Orange'], hint: 'The color is in the sentence.' },
    { prompt: 'Which animal can swim and says “quack”?', answer: 'Duck', distractors: ['Lion', 'Rabbit'], hint: 'It is a bird that likes water.' }
  ] },
  { grade: 1, subject: 'english', unit: 3, title: 'Numbers, toys and “I have”', icon: '🧸', description: 'Count small groups and talk about favorite toys.', questions: [
    { prompt: 'How many is “three”?', answer: '3', distractors: ['2', '4'], hint: 'Count: one, two, three.' },
    { prompt: 'Complete: “I ___ a ball.”', answer: 'have', distractors: ['has', 'am'], hint: 'Use “I have” to say you own something.' },
    { prompt: 'Which one is a toy?', answer: '🪁 Kite', distractors: ['🥕 Carrot', '🌳 Tree'], hint: 'Children can fly it outside.', interaction: { type: 'word_match', prompt: 'Match each word to its group.', pairs: [{ id: 'kite', left: 'Kite', right: 'Toy', leftEmoji: '🪁', rightEmoji: '🧸' }, { id: 'carrot', left: 'Carrot', right: 'Food', leftEmoji: '🥕', rightEmoji: '🍎' }, { id: 'tree', left: 'Tree', right: 'Plant', leftEmoji: '🌳', rightEmoji: '🌱' }] } },
    { prompt: 'Choose the plural of “book”.', answer: 'Books', distractors: ['Bookes', 'Book'], hint: 'Add s to most nouns to mean more than one.' }
  ] },
  // ENGLISH — GRADE 2
  { grade: 2, subject: 'english', unit: 1, title: 'Family and possessive words', icon: '👨‍👩‍👧', description: 'Talk about family members and use my, your and his.', questions: [
    { prompt: 'My mother’s son is my ___.', answer: 'brother', distractors: ['sister', 'grandmother'], hint: 'A boy in your generation is a brother.' },
    { prompt: 'This is ___ book. It belongs to me.', answer: 'my', distractors: ['your', 'his'], hint: 'Use the word for something that belongs to me.' },
    { prompt: 'My father and mother are my ___.', answer: 'parents', distractors: ['cousins', 'friends'], hint: 'This word means bố mẹ.' },
    { prompt: 'The bag belongs to Tom. It is ___ bag.', answer: 'his', distractors: ['her', 'our'], hint: 'Tom is one boy.' }
  ] },
  { grade: 2, subject: 'english', unit: 2, title: 'Daily routines and time words', icon: '🌞', description: 'Describe everyday actions with simple present verbs.', questions: [
    { prompt: 'I ___ up at seven o’clock.', answer: 'get', distractors: ['gets', 'getting'], hint: 'The phrase is “get up”.' },
    { prompt: 'Which action do you do with a toothbrush?', answer: 'Brush my teeth', distractors: ['Ride a bike', 'Read a map'], hint: 'It keeps your teeth clean.' },
    { prompt: 'Complete: “She ___ breakfast every day.”', answer: 'has', distractors: ['have', 'having'], hint: 'Use has with she.' },
    { prompt: 'What comes after Monday?', answer: 'Tuesday', distractors: ['Sunday', 'Friday'], hint: 'It is the second school day of the week.' }
  ] },
  { grade: 2, subject: 'english', unit: 3, title: 'Food and “Do you like…?”', icon: '🍎', description: 'Name foods and answer simple questions about preferences.', questions: [
    { prompt: 'Which one is a fruit?', answer: 'Banana', distractors: ['Bread', 'Milk'], hint: 'It is yellow and easy to peel.' },
    { prompt: 'Complete: “Do you like apples?” “Yes, I ___.”', answer: 'do', distractors: ['am', 'does'], hint: 'Repeat the helping verb from the question.' },
    { prompt: 'Which food do we drink?', answer: 'Milk', distractors: ['Rice', 'Egg'], hint: 'It comes in a glass.', interaction: { type: 'word_match', prompt: 'Match each food to its group.', pairs: [{ id: 'banana', left: 'Banana', right: 'Fruit', leftEmoji: '🍌', rightEmoji: '🍎' }, { id: 'milk', left: 'Milk', right: 'Drink', leftEmoji: '🥛', rightEmoji: '🧃' }, { id: 'rice', left: 'Rice', right: 'Grain', leftEmoji: '🍚', rightEmoji: '🌾' }] } },
    { prompt: 'Choose the healthy snack.', answer: 'An orange', distractors: ['A lot of candy', 'A fizzy drink'], hint: 'Fruit is a healthy snack.' }
  ] },
  // ENGLISH — GRADE 3
  { grade: 3, subject: 'english', unit: 1, title: 'There is, there are and places', icon: '🏠', description: 'Describe rooms and places using there is and there are.', questions: [
    { prompt: '___ a library next to my school.', answer: 'There is', distractors: ['There are', 'They are'], hint: 'Library is one place.' },
    { prompt: '___ two windows in the classroom.', answer: 'There are', distractors: ['There is', 'It is'], hint: 'Windows is plural.' },
    { prompt: 'Where can you borrow a book?', answer: 'At the library', distractors: ['At the bakery', 'At the zoo'], hint: 'A library has books to borrow.' },
    { prompt: 'The park is ___ the school and the shop.', answer: 'between', distractors: ['under', 'inside'], hint: 'Use this word for something in the middle of two places.' }
  ] },
  { grade: 3, subject: 'english', unit: 2, title: 'Present simple: likes and habits', icon: '🔁', description: 'Use present simple verbs for habits and things people like.', questions: [
    { prompt: 'He ___ football on Sundays.', answer: 'plays', distractors: ['play', 'playing'], hint: 'Add s to the verb after he.' },
    { prompt: 'I ___ reading stories.', answer: 'like', distractors: ['likes', 'am'], hint: 'Use the base verb after I.' },
    { prompt: 'They ___ to school every morning.', answer: 'walk', distractors: ['walks', 'walking'], hint: 'Use the base verb after they.' },
    { prompt: 'Choose the correct question.', answer: 'Does she like music?', distractors: ['Do she likes music?', 'Does she likes music?'], hint: 'After does, use the base verb.' }
  ] },
  { grade: 3, subject: 'english', unit: 3, title: 'Can and can’t: abilities', icon: '💪', description: 'Describe what people and animals can or cannot do.', questions: [
    { prompt: 'A bird ___ fly.', answer: 'can', distractors: ['cans', 'is'], hint: 'Birds are able to fly.' },
    { prompt: 'A fish ___ walk.', answer: 'can’t', distractors: ['can', 'does'], hint: 'Fish cannot walk on land.' },
    { prompt: 'Complete: “Can you swim?” “Yes, I ___.”', answer: 'can', distractors: ['do', 'am'], hint: 'Repeat can in a short answer.', interaction: { type: 'word_match', prompt: 'Match the animal to an ability.', pairs: [{ id: 'bird', left: 'A bird', right: 'can fly', leftEmoji: '🐦', rightEmoji: '🪽' }, { id: 'fish', left: 'A fish', right: 'can swim', leftEmoji: '🐟', rightEmoji: '🌊' }, { id: 'tiger', left: 'A tiger', right: 'can run', leftEmoji: '🐅', rightEmoji: '🏃' }] } },
    { prompt: 'Which sentence is correct?', answer: 'She can sing.', distractors: ['She cans sing.', 'She can sings.'], hint: 'Do not add s to can or the verb after it.' }
  ] },
  // ENGLISH — GRADE 4
  { grade: 4, subject: 'english', unit: 1, title: 'Prepositions of place', icon: '📍', description: 'Describe where objects are with common prepositions.', questions: [
    { prompt: 'The cat is ___ the table. It is below it.', answer: 'under', distractors: ['on', 'between'], hint: 'Choose the word meaning ở dưới.' },
    { prompt: 'The picture is ___ the wall.', answer: 'on', distractors: ['in', 'between'], hint: 'A picture hangs on a surface.' },
    { prompt: 'The school is ___ the bank and the park.', answer: 'between', distractors: ['under', 'behind'], hint: 'There are two places on either side.' },
    { prompt: 'My pencils are ___ my school bag.', answer: 'in', distractors: ['on', 'above'], hint: 'The pencils are inside the bag.' }
  ] },
  { grade: 4, subject: 'english', unit: 2, title: 'Present continuous', icon: '🏃', description: 'Talk about actions happening right now.', questions: [
    { prompt: 'Look! The children ___ in the garden.', answer: 'are playing', distractors: ['is playing', 'play'], hint: 'Use are with children and add -ing.' },
    { prompt: 'I ___ a book now.', answer: 'am reading', distractors: ['is reading', 'reads'], hint: 'Use am with I.' },
    { prompt: 'She is ___ a picture.', answer: 'drawing', distractors: ['draw', 'draws'], hint: 'After is, add -ing to the action.' },
    { prompt: 'Which sentence describes something happening now?', answer: 'They are having lunch.', distractors: ['They have lunch at noon.', 'They had lunch yesterday.'], hint: 'Look for am, is or are plus an -ing verb.' }
  ] },
  { grade: 4, subject: 'english', unit: 3, title: 'Comparatives and superlatives', icon: '📏', description: 'Compare people, animals and objects using adjectives.', questions: [
    { prompt: 'An elephant is ___ than a mouse.', answer: 'bigger', distractors: ['big', 'biggest'], hint: 'Use the comparative form before “than”.' },
    { prompt: 'Mount Everest is the ___ mountain in the world.', answer: 'highest', distractors: ['higher', 'high'], hint: 'Use the superlative after “the”.' },
    { prompt: 'A bike is ___ than a car.', answer: 'slower', distractors: ['slowest', 'slow'], hint: 'Compare two things with -er than.', interaction: { type: 'word_match', prompt: 'Match the adjective form to how it is used.', pairs: [{ id: 'slow', left: 'slower', right: 'Compare two things', leftEmoji: '🚲', rightEmoji: '↔️' }, { id: 'high', left: 'the highest', right: 'Compare with a whole group', leftEmoji: '🏔️', rightEmoji: '🏆' }, { id: 'big', left: 'bigger', right: 'Comparative form of big', leftEmoji: '🐘', rightEmoji: '📏' }] } },
    { prompt: 'Which is correct?', answer: 'My bag is heavier than yours.', distractors: ['My bag is heavy than yours.', 'My bag is the heavier.'], hint: 'Use an adjective form with -er before than.' }
  ] },
  // ENGLISH — GRADE 5
  { grade: 5, subject: 'english', unit: 1, title: 'Past simple: regular verbs', icon: '🕰️', description: 'Talk about finished actions using regular past tense verbs.', questions: [
    { prompt: 'Yesterday, we ___ football after school.', answer: 'played', distractors: ['play', 'plays'], hint: 'Add -ed to the regular verb.' },
    { prompt: 'She ___ her room last Saturday.', answer: 'cleaned', distractors: ['cleans', 'clean'], hint: 'Last Saturday tells us it happened in the past.' },
    { prompt: 'They ___ a film last night.', answer: 'watched', distractors: ['watch', 'watches'], hint: 'Use the past form of watch.' },
    { prompt: 'Choose the correct sentence.', answer: 'I visited my aunt yesterday.', distractors: ['I visit my aunt yesterday.', 'I visits my aunt yesterday.'], hint: 'Yesterday calls for past tense.' }
  ] },
  { grade: 5, subject: 'english', unit: 2, title: 'Past simple: common irregular verbs', icon: '⏳', description: 'Practice common irregular past tense forms in short sentences.', questions: [
    { prompt: 'We ___ to the museum yesterday.', answer: 'went', distractors: ['go', 'goed'], hint: 'The past form of go is irregular.' },
    { prompt: 'He ___ breakfast at seven this morning.', answer: 'ate', distractors: ['eat', 'eated'], hint: 'The past form of eat is ate.' },
    { prompt: 'I ___ a new story last night.', answer: 'wrote', distractors: ['write', 'writed'], hint: 'The past form of write is wrote.' },
    { prompt: 'They ___ happy after the game.', answer: 'were', distractors: ['are', 'was'], hint: 'Use were with they.' }
  ] },
  { grade: 5, subject: 'english', unit: 3, title: 'Future plans with “going to”', icon: '🚀', description: 'Say what you plan to do using am, is or are going to.', questions: [
    { prompt: 'I ___ going to visit my grandparents.', answer: 'am', distractors: ['is', 'are'], hint: 'Use am with I.' },
    { prompt: 'They are going to ___ a kite.', answer: 'fly', distractors: ['flies', 'flying'], hint: 'Use the base verb after going to.' },
    { prompt: 'She ___ going to read tonight.', answer: 'is', distractors: ['am', 'are'], hint: 'Use is with she.', interaction: { type: 'word_match', prompt: 'Match the subject with the correct form of “be”.', pairs: [{ id: 'i', left: 'I', right: 'am', leftEmoji: '🙋', rightEmoji: '🔤' }, { id: 'she', left: 'She / He / It', right: 'is', leftEmoji: '👧', rightEmoji: '🔤' }, { id: 'they', left: 'We / You / They', right: 'are', leftEmoji: '👨‍👩‍👧', rightEmoji: '🔤' }] } },
    { prompt: 'Which sentence describes a plan?', answer: 'We are going to swim tomorrow.', distractors: ['We swam yesterday.', 'We swim every day.'], hint: 'Look for going to and a future time.' }
  ] }
];

const SUBJECT_LABELS: Record<SubjectId, string> = {
  math: 'Toán',
  vietnamese: 'Tiếng Việt',
  english: 'Tiếng Anh'
};

const SUBJECT_CODES: Record<SubjectId, string> = {
  math: 'm',
  vietnamese: 'v',
  english: 'e'
};

export const SUPPLEMENTAL_LESSONS: Lesson[] = specs.map((spec) => {
  const subjectCode = SUBJECT_CODES[spec.subject];
  const unitId = `g${spec.grade}_${subjectCode}_extra`;

  return {
    id: `g${spec.grade}_${subjectCode}_extra_u${spec.unit}_l1`,
    title: spec.title,
    grade: spec.grade,
    subject: spec.subject,
    unitId,
    unitTitle: `Luyện tập bổ sung ${SUBJECT_LABELS[spec.subject]} lớp ${spec.grade}`,
    icon: spec.icon,
    description: spec.description,
    difficulty: spec.unit === 1 ? 1 : spec.unit === 2 ? 2 : 3,
    passingScore: 60,
    xpReward: 35 + spec.unit * 5,
    starsRequiredToUnlock: spec.unit > 1 ? 1 : 0,
    prerequisiteLessonId: spec.unit > 1
      ? `g${spec.grade}_${subjectCode}_extra_u${spec.unit - 1}_l1`
      : undefined,
    questions: spec.questions.map((question, index) => makeQuestion(question, index, spec.subject))
  };
});
