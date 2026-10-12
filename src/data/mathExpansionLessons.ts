import { Grade, Lesson, Question } from '../types/curriculum';

interface MathLessonSpec {
  grade: Grade;
  unit: number;
  title: string;
  icon: string;
  description: string;
  difficulty: 1 | 2 | 3;
  questions: Question[];
}

function multipleChoice(
  prompt: string,
  answer: string,
  distractors: [string, string],
  hint: string,
  explanation: string
): Question {
  const answerIndex = [...prompt].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 3;
  const remainingDistractors = [...distractors];
  const orderedOptions = Array.from({ length: 3 }, (_, index) => (
    index === answerIndex ? answer : remainingDistractors.shift()!
  ));

  return {
    id: '',
    type: 'multiple_choice',
    prompt,
    hint,
    explanation,
    options: orderedOptions.map((text, index) => ({
      id: `option_${index + 1}`,
      text,
      isCorrect: index === answerIndex
    }))
  };
}

function fillBlank(
  prompt: string,
  answer: string,
  hint: string,
  explanation: string,
  alternatives: string[] = []
): Question {
  return {
    id: '',
    type: 'fill_in_the_blank',
    prompt,
    hint,
    explanation,
    correctAnswer: answer,
    interactiveData: { blanks: [answer, ...alternatives] }
  };
}

function trueFalse(prompt: string, answer: boolean, hint: string, explanation: string): Question {
  return {
    id: '',
    type: 'true_false',
    prompt,
    hint,
    explanation,
    options: [
      { id: 'true', text: 'Đúng', isCorrect: answer },
      { id: 'false', text: 'Sai', isCorrect: !answer }
    ]
  };
}

function orderThree(
  prompt: string,
  answersInOrder: [string, string, string],
  hint: string,
  explanation: string
): Question {
  return {
    id: '',
    type: 'ordering',
    prompt,
    hint,
    explanation,
    interactiveData: {
      orderItems: answersInOrder.map((text, correctIndex) => ({
        id: `item_${correctIndex + 1}`,
        text,
        correctIndex
      }))
    }
  };
}

const lessonSpecs: MathLessonSpec[] = [
  // LỚP 1
  {
    grade: 1, unit: 1, title: 'Đếm, so sánh và tính đến 20', icon: '🔢', difficulty: 1,
    description: 'Luyện số đến 20, tìm số còn thiếu và giải phép cộng trừ gần gũi.',
    questions: [
      multipleChoice('Số liền sau của 12 là số nào?', '13', ['11', '14'], 'Đếm thêm một đơn vị từ 12.', '12 + 1 = 13.'),
      multipleChoice('18 - 5 = ?', '13', ['12', '14'], 'Từ 18 lùi lại 5 đơn vị.', '18 - 5 = 13.'),
      fillBlank('7 + ___ = 15. Điền số còn thiếu.', '8', 'Lấy 15 trừ 7.', '15 - 7 = 8.'),
      fillBlank('___ - 4 = 10. Số cần điền là bao nhiêu?', '14', 'Tìm số mà khi bớt 4 còn 10.', '10 + 4 = 14.'),
      orderThree('Sắp xếp các số từ bé đến lớn.', ['11', '13', '15'], 'So sánh hàng chục rồi đến hàng đơn vị.', '11 < 13 < 15.'),
      multipleChoice('1 chục và 6 đơn vị tạo thành số nào?', '16', ['10', '61'], 'Một chục là 10 đơn vị.', '10 + 6 = 16.'),
      multipleChoice('Có 8 quả táo đỏ và 7 quả táo xanh. Có tất cả bao nhiêu quả?', '15 quả', ['14 quả', '16 quả'], 'Gộp hai nhóm quả táo.', '8 + 7 = 15 quả.'),
      trueFalse('13 lớn hơn 17.', false, 'So sánh chữ số hàng đơn vị vì hai số cùng có 1 chục.', '13 nhỏ hơn 17.')
    ]
  },
  {
    grade: 1, unit: 2, title: 'Hình phẳng và độ dài quanh em', icon: '📏', difficulty: 1,
    description: 'Nhận biết hình cơ bản, so sánh độ dài và tính độ dài đơn giản.',
    questions: [
      multipleChoice('Hình tam giác có bao nhiêu cạnh?', '3 cạnh', ['4 cạnh', '5 cạnh'], 'Đếm các cạnh của hình tam giác.', 'Tam giác có 3 cạnh.'),
      multipleChoice('Hình nào không có góc?', 'Hình tròn', ['Hình vuông', 'Hình tam giác'], 'Quan sát đường bao cong liên tục.', 'Hình tròn không có góc.'),
      multipleChoice('Đoạn dây nào dài nhất: 12 cm, 9 cm hay 10 cm?', '12 cm', ['9 cm', '10 cm'], 'So sánh ba số đo.', '12 cm lớn hơn 10 cm và 9 cm.'),
      fillBlank('Một bút chì dài 8 cm, thước dài hơn bút chì 5 cm. Thước dài ___ cm.', '13', 'Lấy 8 cộng thêm 5.', '8 + 5 = 13 cm.'),
      multipleChoice('Hình nào có 4 cạnh bằng nhau và 4 góc vuông?', 'Hình vuông', ['Hình chữ nhật', 'Hình tam giác'], 'Chú ý cả độ dài cạnh lẫn góc.', 'Hình vuông có bốn cạnh bằng nhau và bốn góc vuông.'),
      fillBlank('Sợi ruy băng dài 6 cm được nối thêm 4 cm. Tổng chiều dài là ___ cm.', '10', 'Cộng chiều dài hai đoạn.', '6 + 4 = 10 cm.'),
      orderThree('Sắp xếp độ dài từ ngắn đến dài.', ['5 cm', '9 cm', '12 cm'], 'Số đo nhỏ nhất đứng trước.', '5 cm < 9 cm < 12 cm.'),
      trueFalse('Hình chữ nhật có 4 cạnh.', true, 'Đếm các cạnh quanh hình.', 'Hình chữ nhật có 4 cạnh.')
    ]
  },
  {
    grade: 1, unit: 3, title: 'Giải toán có lời văn: thêm vào và bớt đi', icon: '🍊', difficulty: 1,
    description: 'Đọc tình huống, xác định phép tính và tìm số chưa biết trong phạm vi 20.',
    questions: [
      multipleChoice('Trên cành có 6 chú chim, 2 chú bay đi. Còn lại bao nhiêu chú?', '4 chú', ['3 chú', '8 chú'], 'Bay đi nghĩa là bớt đi.', '6 - 2 = 4 chú chim.'),
      multipleChoice('Bình có 9 nhãn vở, được tặng thêm 5 nhãn. Bình có tất cả bao nhiêu nhãn?', '14 nhãn', ['13 nhãn', '15 nhãn'], 'Được tặng thêm nghĩa là cộng.', '9 + 5 = 14 nhãn.'),
      multipleChoice('Có 12 quả bóng, 3 quả bị xẹp. Còn bao nhiêu quả bóng dùng được?', '9 quả', ['8 quả', '15 quả'], 'Lấy số ban đầu trừ số bị xẹp.', '12 - 3 = 9 quả.'),
      fillBlank('6 + ___ = 13. Điền số còn thiếu.', '7', 'Lấy 13 trừ 6.', '13 - 6 = 7.'),
      multipleChoice('Giỏ A có 8 quả, giỏ B có 5 quả rồi được thêm 4 quả. Giỏ nào có nhiều quả hơn?', 'Giỏ B', ['Giỏ A', 'Hai giỏ bằng nhau'], 'Tính số quả mới của giỏ B trước.', 'Giỏ B có 5 + 4 = 9 quả; 9 nhiều hơn 8.'),
      fillBlank('14 - ___ = 8. Số bị bớt là bao nhiêu?', '6', 'Tính 14 trừ 8.', '14 - 8 = 6.'),
      multipleChoice('Mỗi bạn nhận 1 chiếc bút. Có 7 bạn và 5 chiếc bút. Cần thêm bao nhiêu chiếc?', '2 chiếc', ['1 chiếc', '3 chiếc'], 'Lấy số bút cần có trừ số đang có.', '7 - 5 = 2 chiếc bút.'),
      trueFalse('Một rổ có 7 cam, thêm 8 cam thì có 16 cam.', false, 'Tính 7 + 8.', '7 + 8 = 15, không phải 16.')
    ]
  },

  // LỚP 2
  {
    grade: 2, unit: 1, title: 'Các số đến 1.000: đọc, viết và xếp thứ tự', icon: '💯', difficulty: 1,
    description: 'Củng cố hàng trăm, hàng chục, hàng đơn vị và cộng trừ số có ba chữ số.',
    questions: [
      multipleChoice('356 + 200 = ?', '556', ['546', '576'], 'Cộng 2 trăm vào 3 trăm.', '356 + 200 = 556.'),
      multipleChoice('700 - 285 = ?', '415', ['425', '515'], 'Có thể tính 700 - 200 rồi trừ tiếp 85.', '700 - 285 = 415.'),
      multipleChoice('Số gồm 6 trăm, 0 chục và 8 đơn vị là số nào?', '608', ['680', '68'], 'Chữ số hàng chục là 0.', '6 trăm và 8 đơn vị viết là 608.'),
      fillBlank('Số đứng ngay trước 1.000 là ___ .', '999', 'Lùi một đơn vị từ 1.000.', '1.000 - 1 = 999.'),
      orderThree('Sắp xếp các số từ bé đến lớn.', ['425', '452', '524'], 'So sánh lần lượt hàng trăm, hàng chục.', '425 < 452 < 524.'),
      fillBlank('375 + ___ = 400. Số cần điền là bao nhiêu?', '25', 'Tính 400 trừ 375.', '400 - 375 = 25.'),
      multipleChoice('Số gồm 9 trăm, 4 chục và 2 đơn vị là số nào?', '942', ['924', '492'], 'Viết các chữ số theo đúng thứ tự hàng.', '9 trăm, 4 chục, 2 đơn vị viết là 942.'),
      trueFalse('706 lớn hơn 760.', false, 'Hai số có cùng hàng trăm; so sánh hàng chục.', '706 nhỏ hơn 760 vì 0 chục nhỏ hơn 6 chục.')
    ]
  },
  {
    grade: 2, unit: 2, title: 'Nhân chia qua nhóm đồ vật', icon: '🧮', difficulty: 2,
    description: 'Luyện bảng nhân, chia đều và chọn phép tính cho tình huống thực tế.',
    questions: [
      multipleChoice('8 × 4 = ?', '32', ['28', '36'], 'Tính 8 được lấy 4 lần.', '8 × 4 = 32.'),
      multipleChoice('48 chiếc kẹo chia đều cho 6 bạn. Mỗi bạn nhận bao nhiêu chiếc?', '8 chiếc', ['7 chiếc', '9 chiếc'], 'Tìm số mà 6 nhân lên bằng 48.', '48 ÷ 6 = 8.'),
      multipleChoice('Có 6 túi, mỗi túi 5 quả cam. Có tất cả bao nhiêu quả?', '30 quả', ['11 quả', '25 quả'], 'Tính 6 nhóm, mỗi nhóm 5 quả.', '6 × 5 = 30 quả.'),
      fillBlank('___ × 7 = 42. Thừa số còn thiếu là bao nhiêu?', '6', 'Lấy 42 chia cho 7.', '42 ÷ 7 = 6.'),
      trueFalse('36 chiếc bánh chia đều cho 4 bạn thì mỗi bạn được 9 chiếc.', true, 'Kiểm tra bằng phép nhân 9 × 4.', '36 ÷ 4 = 9.'),
      multipleChoice('64 ÷ 8 = ?', '8', ['7', '9'], 'Tìm số nhân với 8 được 64.', '8 × 8 = 64.'),
      multipleChoice('Một hàng có 7 ghế. 5 hàng như vậy có bao nhiêu ghế?', '35 ghế', ['12 ghế', '30 ghế'], 'Có 5 nhóm, mỗi nhóm 7 ghế.', '7 × 5 = 35 ghế.'),
      multipleChoice('Phép chia nào kiểm tra được phép tính 9 × 6 = 54?', '54 ÷ 9 = 6', ['54 - 9 = 6', '54 + 9 = 6'], 'Phép chia là phép tính ngược của phép nhân.', '54 ÷ 9 = 6.')
    ]
  },
  {
    grade: 2, unit: 3, title: 'Tiền Việt Nam, thời gian và đo đại lượng', icon: '🕰️', difficulty: 2,
    description: 'Giải tình huống mua bán, xem giờ và đổi đơn vị đo quen thuộc.',
    questions: [
      multipleChoice('Một chiếc bút giá 6.000 đồng. Mua 2 chiếc hết bao nhiêu?', '12.000 đồng', ['8.000 đồng', '10.000 đồng'], 'Cộng hai lần giá một chiếc bút.', '6.000 × 2 = 12.000 đồng.'),
      multipleChoice('Có 20.000 đồng, mua quyển vở giá 12.000 đồng. Còn lại bao nhiêu?', '8.000 đồng', ['7.000 đồng', '9.000 đồng'], 'Lấy số tiền có trừ số tiền mua vở.', '20.000 - 12.000 = 8.000 đồng.'),
      multipleChoice('1 kg bằng bao nhiêu gam?', '1.000 g', ['100 g', '10.000 g'], 'Một ki-lô-gam có một nghìn gam.', '1 kg = 1.000 g.'),
      fillBlank('1 m bằng ___ cm.', '100', 'Nhớ bảng đổi đơn vị độ dài.', '1 m = 100 cm.'),
      multipleChoice('Kim phút chỉ số 6, kim giờ nằm giữa số 3 và 4. Đồng hồ chỉ giờ nào?', '3 giờ 30 phút', ['3 giờ 6 phút', '6 giờ 30 phút'], 'Kim phút ở số 6 là 30 phút.', 'Đồng hồ chỉ 3 giờ 30 phút.'),
      multipleChoice('Một bình có 2 lít nước, rót thêm 1 lít. Bình có bao nhiêu lít?', '3 lít', ['2 lít', '4 lít'], 'Cộng lượng nước ban đầu với lượng rót thêm.', '2 + 1 = 3 lít.'),
      trueFalse('1 giờ có 60 phút.', true, 'Đây là mối quan hệ giữa giờ và phút.', '1 giờ = 60 phút.'),
      multipleChoice('Bạn An đọc 12 trang sáng và 9 trang chiều. Cả ngày An đọc bao nhiêu trang?', '21 trang', ['20 trang', '22 trang'], 'Cộng số trang đọc ở hai buổi.', '12 + 9 = 21 trang.')
    ]
  },

  // LỚP 3
  {
    grade: 3, unit: 1, title: 'Số có bốn chữ số và tính toán', icon: '🔠', difficulty: 2,
    description: 'Đọc cấu tạo số hàng nghìn, so sánh và thực hành cộng trừ.',
    questions: [
      multipleChoice('2.345 + 1.000 = ?', '3.345', ['2.445', '3.245'], 'Cộng thêm một nghìn.', '2.345 + 1.000 = 3.345.'),
      multipleChoice('5.020 - 2.010 = ?', '3.010', ['3.110', '2.010'], 'Trừ hàng nghìn và hàng chục tương ứng.', '5.020 - 2.010 = 3.010.'),
      multipleChoice('Trong số 3.742, chữ số 7 có giá trị là bao nhiêu?', '700', ['70', '7'], 'Chữ số 7 ở hàng trăm.', '7 ở hàng trăm có giá trị 700.'),
      orderThree('Sắp xếp các số từ bé đến lớn.', ['4.098', '4.809', '4.890'], 'Các số có cùng hàng nghìn; so sánh hàng trăm rồi hàng chục.', '4.098 < 4.809 < 4.890.'),
      fillBlank('6.000 - ___ = 2.750. Số cần điền là bao nhiêu?', '3250', 'Lấy 6.000 trừ 2.750.', '6.000 - 2.750 = 3.250.'),
      multipleChoice('Số gồm 8 nghìn, 0 trăm, 5 chục và 2 đơn vị là số nào?', '8.052', ['8.502', '852'], 'Hàng trăm có chữ số 0.', 'Số đó là 8.052.'),
      trueFalse('4.500 lớn hơn 4.050.', true, 'So sánh hàng trăm sau khi hai số cùng có 4 nghìn.', '4.500 > 4.050.'),
      multipleChoice('Một thư viện có 2.350 sách, được tặng thêm 450 sách. Có tất cả bao nhiêu quyển?', '2.800 quyển', ['2.700 quyển', '2.900 quyển'], 'Cộng số sách cũ với số sách được tặng.', '2.350 + 450 = 2.800 quyển.')
    ]
  },
  {
    grade: 3, unit: 2, title: 'Nhân chia số có nhiều chữ số', icon: '✖️', difficulty: 2,
    description: 'Tính nhân chia với số có nhiều chữ số và kiểm tra bằng phép tính ngược.',
    questions: [
      multipleChoice('324 × 3 = ?', '972', ['962', '982'], 'Tính lần lượt 3 × 4, 3 × 2 chục và 3 × 3 trăm.', '324 × 3 = 972.'),
      multipleChoice('864 ÷ 4 = ?', '216', ['214', '226'], 'Chia lần lượt từ hàng trăm sang hàng đơn vị.', '864 ÷ 4 = 216.'),
      multipleChoice('135 × 3 = ?', '405', ['395', '415'], 'Tính 3 × 5 đơn vị, 3 × 3 chục và 3 × 1 trăm.', '135 × 3 = 405.'),
      multipleChoice('925 ÷ 5 = ?', '185', ['175', '195'], 'Kiểm tra bằng 185 × 5.', '185 × 5 = 925.'),
      multipleChoice('Mỗi hộp có 24 bút màu. 8 hộp có tất cả bao nhiêu bút?', '192 bút', ['182 bút', '202 bút'], 'Tính 24 nhân 8.', '24 × 8 = 192 bút.'),
      fillBlank('72 × ___ = 648.', '9', 'Tìm 648 chia cho 72.', '648 ÷ 72 = 9.'),
      multipleChoice('Nếu 8 × 7 = 56 thì 56 ÷ 8 bằng bao nhiêu?', '7', ['6', '8'], 'Phép chia kiểm tra lại phép nhân.', '56 ÷ 8 = 7.'),
      trueFalse('143 × 4 = 572.', true, 'Tách 143 thành 100 + 40 + 3 rồi nhân từng phần với 4.', '400 + 160 + 12 = 572.')
    ]
  },
  {
    grade: 3, unit: 3, title: 'Chu vi, diện tích và đọc bảng số liệu', icon: '📊', difficulty: 2,
    description: 'Tính chu vi, diện tích hình chữ nhật và đọc dữ liệu đơn giản.',
    questions: [
      multipleChoice('Hình chữ nhật dài 6 cm, rộng 4 cm. Chu vi là bao nhiêu?', '20 cm', ['10 cm', '24 cm'], 'Chu vi bằng tổng độ dài bốn cạnh.', '(6 + 4) × 2 = 20 cm.'),
      multipleChoice('Hình chữ nhật dài 6 cm, rộng 4 cm. Diện tích là bao nhiêu?', '24 cm²', ['20 cm²', '24 cm'], 'Diện tích bằng chiều dài nhân chiều rộng.', '6 × 4 = 24 cm².'),
      fillBlank('1 km bằng ___ m.', '1000', 'Một ki-lô-mét gồm một nghìn mét.', '1 km = 1.000 m.'),
      multipleChoice('Bảng ghi số cây lớp 3A trồng: thứ Hai 8 cây, thứ Ba 12 cây. Ngày nào trồng nhiều hơn?', 'Thứ Ba', ['Thứ Hai', 'Hai ngày bằng nhau'], 'So sánh 12 với 8.', '12 > 8 nên thứ Ba trồng nhiều hơn.'),
      multipleChoice('Hình vuông cạnh 8 cm có chu vi bao nhiêu?', '32 cm', ['16 cm', '64 cm'], 'Chu vi hình vuông bằng cạnh nhân 4.', '8 × 4 = 32 cm.'),
      multipleChoice('Tổ A thu gom 15 kg giấy, tổ B thu gom 9 kg. Cả hai tổ được bao nhiêu ki-lô-gam?', '24 kg', ['6 kg', '25 kg'], 'Cộng số giấy của hai tổ.', '15 + 9 = 24 kg.'),
      trueFalse('1 m bằng 100 cm.', true, 'Đây là quan hệ giữa mét và xăng-ti-mét.', '1 m = 100 cm.'),
      fillBlank('Một hình vuông có cạnh 5 cm. Chu vi hình vuông là ___ cm.', '20', 'Có bốn cạnh bằng nhau.', '5 × 4 = 20 cm.')
    ]
  },

  // LỚP 4
  {
    grade: 4, unit: 1, title: 'Số lớn, phép tính và tính nhẩm', icon: '🧠', difficulty: 2,
    description: 'Luyện cộng trừ số lớn, nhân chia và chọn cách tính thuận tiện.',
    questions: [
      multipleChoice('245.678 + 32.456 = ?', '278.134', ['277.134', '288.134'], 'Đặt các chữ số cùng hàng thẳng cột.', '245.678 + 32.456 = 278.134.'),
      multipleChoice('600.000 - 279.350 = ?', '320.650', ['330.650', '321.650'], 'Thực hiện phép trừ có nhớ theo từng hàng.', '600.000 - 279.350 = 320.650.'),
      multipleChoice('324 × 25 = ?', '8100', ['8000', '8200'], 'Có thể tính 324 × 100 ÷ 4.', '324 × 25 = 324 × 100 ÷ 4 = 8.100.'),
      multipleChoice('4.836 ÷ 12 = ?', '403', ['413', '393'], 'Kiểm tra bằng 403 × 12.', '403 × 12 = 4.836.'),
      fillBlank('16 × 25 = ___ .', '400', '25 × 4 = 100, hãy nhóm 16 thành bốn nhóm 4.', '16 × 25 = 4 × 100 = 400.'),
      multipleChoice('120 - 20 × 3 = ?', '60', ['300', '100'], 'Thực hiện phép nhân trước phép trừ.', '20 × 3 = 60; 120 - 60 = 60.'),
      multipleChoice('7.200 ÷ 24 = ?', '300', ['30', '3.000'], 'Tìm số nhân với 24 bằng 7.200.', '24 × 300 = 7.200.'),
      trueFalse('1.250 × 8 = 10.000.', true, 'Tính 125 × 8 rồi thêm một chữ số 0.', '1.250 × 8 = 10.000.')
    ]
  },
  {
    grade: 4, unit: 2, title: 'Phân số và trung bình cộng', icon: '🍰', difficulty: 2,
    description: 'So sánh, tính toán phân số cùng mẫu và tìm giá trị trung bình.',
    questions: [
      multipleChoice('3/8 + 2/8 = ?', '5/8', ['5/16', '1/8'], 'Giữ nguyên mẫu số, cộng tử số.', '3/8 + 2/8 = 5/8.'),
      multipleChoice('7/10 - 3/10 = ?', '4/10', ['4/20', '10/10'], 'Giữ nguyên mẫu số, trừ tử số.', '7/10 - 3/10 = 4/10.'),
      multipleChoice('Phân số nào bằng 3/4?', '6/8', ['3/8', '4/6'], 'Nhân cả tử số và mẫu số với cùng một số.', '3/4 = 6/8.'),
      multipleChoice('3/8 của 24 quả cam là bao nhiêu quả?', '9 quả', ['8 quả', '12 quả'], 'Tính 24 chia 8 rồi nhân 3.', '24 ÷ 8 × 3 = 9 quả.'),
      fillBlank('Trung bình cộng của 8, 9 và 10 là ___ .', '9', 'Cộng ba số rồi chia cho 3.', '(8 + 9 + 10) ÷ 3 = 9.'),
      orderThree('Xếp các phân số cùng mẫu số từ bé đến lớn.', ['1/4', '2/4', '3/4'], 'Mẫu số giống nhau nên so sánh tử số.', '1 < 2 < 3 nên thứ tự là 1/4, 2/4, 3/4.'),
      trueFalse('5/6 lớn hơn 4/6.', true, 'Hai phân số cùng mẫu số.', '5 > 4 nên 5/6 > 4/6.'),
      fillBlank('___/7 + 2/7 = 6/7. Tử số còn thiếu là bao nhiêu?', '4', 'Lấy 6 trừ 2.', '4/7 + 2/7 = 6/7.')
    ]
  },
  {
    grade: 4, unit: 3, title: 'Góc, chu vi và đổi đơn vị', icon: '📐', difficulty: 3,
    description: 'Vận dụng góc vuông, chu vi hình và các đơn vị đo thường gặp.',
    questions: [
      multipleChoice('Một góc vuông có số đo bao nhiêu độ?', '90°', ['45°', '180°'], 'Góc vuông là một phần tư vòng tròn.', 'Góc vuông có số đo 90°.'),
      multipleChoice('Tam giác có các cạnh 5 cm, 6 cm và 7 cm. Chu vi là bao nhiêu?', '18 cm', ['17 cm', '21 cm'], 'Cộng độ dài ba cạnh.', '5 + 6 + 7 = 18 cm.'),
      multipleChoice('Hình chữ nhật dài 12 cm, rộng 8 cm. Diện tích là bao nhiêu?', '96 cm²', ['40 cm²', '96 cm'], 'Diện tích bằng dài nhân rộng.', '12 × 8 = 96 cm².'),
      fillBlank('2 km bằng ___ m.', '2000', '1 km bằng 1.000 m.', '2 × 1.000 = 2.000 m.'),
      multipleChoice('Hình chữ nhật có diện tích 60 cm², chiều dài 10 cm. Chiều rộng là bao nhiêu?', '6 cm', ['5 cm', '50 cm'], 'Lấy diện tích chia cho chiều dài.', '60 ÷ 10 = 6 cm.'),
      fillBlank('3 kg 200 g bằng ___ g.', '3200', 'Đổi 3 kg ra gam rồi cộng thêm 200 g.', '3.000 g + 200 g = 3.200 g.'),
      trueFalse('Chu vi hình vuông bằng độ dài một cạnh nhân với 4.', true, 'Hình vuông có 4 cạnh bằng nhau.', 'Chu vi hình vuông = cạnh × 4.'),
      multipleChoice('Một hình chữ nhật có chiều dài 9 cm và chiều rộng 4 cm. Chu vi là bao nhiêu?', '26 cm', ['13 cm', '36 cm'], 'Cộng dài và rộng rồi nhân 2.', '(9 + 4) × 2 = 26 cm.')
    ]
  },

  // LỚP 5
  {
    grade: 5, unit: 1, title: 'Số thập phân và phần trăm ứng dụng', icon: '💸', difficulty: 2,
    description: 'Tính với số thập phân và giải tình huống giá tiền, giảm giá, phần trăm.',
    questions: [
      multipleChoice('12,75 + 3,6 = ?', '16,35', ['16,25', '15,35'], 'Viết 3,6 thành 3,60 rồi cộng.', '12,75 + 3,60 = 16,35.'),
      multipleChoice('25% của 360 là bao nhiêu?', '90', ['80', '100'], '25% bằng một phần tư.', '360 ÷ 4 = 90.'),
      multipleChoice('2,4 × 3,5 = ?', '8,4', ['7,4', '8,2'], 'Nhân 24 × 35 rồi đặt hai chữ số thập phân.', '24 × 35 = 840; kết quả là 8,40 = 8,4.'),
      multipleChoice('7,2 ÷ 0,6 = ?', '12', ['1,2', '120'], 'Nhân cả số bị chia và số chia với 10.', '72 ÷ 6 = 12.'),
      multipleChoice('15% của 200.000 đồng là bao nhiêu?', '30.000 đồng', ['20.000 đồng', '35.000 đồng'], 'Tính 10% rồi cộng với 5%.', '20.000 + 10.000 = 30.000 đồng.'),
      fillBlank('3,5 kg táo giá 28.000 đồng mỗi ki-lô-gam. Số tiền phải trả là ___ đồng.', '98000', 'Lấy 28.000 nhân 3,5.', '28.000 × 3,5 = 98.000 đồng.'),
      multipleChoice('Áo giá 250.000 đồng được giảm 20%. Giá sau khi giảm là bao nhiêu?', '200.000 đồng', ['50.000 đồng', '230.000 đồng'], 'Tính số tiền giảm trước rồi trừ khỏi giá gốc.', '20% của 250.000 là 50.000; giá mới 200.000 đồng.'),
      trueFalse('0,4 bằng 4/10.', true, 'Chữ số 4 ở hàng phần mười.', '0,4 = 4/10.')
    ]
  },
  {
    grade: 5, unit: 2, title: 'Diện tích hình và thể tích', icon: '🧊', difficulty: 3,
    description: 'Tính diện tích tam giác, hình thang, hình tròn và thể tích khối hộp.',
    questions: [
      multipleChoice('Tam giác có đáy 12 cm và chiều cao 5 cm. Diện tích là bao nhiêu?', '30 cm²', ['60 cm²', '17 cm²'], 'Diện tích tam giác bằng đáy nhân chiều cao rồi chia 2.', '12 × 5 ÷ 2 = 30 cm².'),
      multipleChoice('Hình thang có hai đáy 8 cm, 12 cm và chiều cao 5 cm. Diện tích là bao nhiêu?', '50 cm²', ['100 cm²', '40 cm²'], 'Cộng hai đáy, nhân chiều cao rồi chia 2.', '(8 + 12) × 5 ÷ 2 = 50 cm².'),
      multipleChoice('Hình lập phương cạnh 4 cm có thể tích bao nhiêu?', '64 cm³', ['16 cm³', '48 cm³'], 'Thể tích bằng cạnh nhân cạnh nhân cạnh.', '4 × 4 × 4 = 64 cm³.'),
      multipleChoice('Hộp chữ nhật dài 8 cm, rộng 5 cm, cao 4 cm. Thể tích là bao nhiêu?', '160 cm³', ['80 cm³', '170 cm³'], 'Nhân ba kích thước.', '8 × 5 × 4 = 160 cm³.'),
      multipleChoice('Hình tròn có đường kính 14 cm. Chu vi gần bằng bao nhiêu? (π = 3,14)', '43,96 cm', ['21,98 cm', '153,86 cm'], 'Chu vi hình tròn bằng đường kính nhân π.', '14 × 3,14 = 43,96 cm.'),
      multipleChoice('Hình tròn bán kính 7 cm. Diện tích gần bằng bao nhiêu? (π = 3,14)', '153,86 cm²', ['43,96 cm²', '49 cm²'], 'Diện tích hình tròn bằng bán kính nhân bán kính nhân π.', '7 × 7 × 3,14 = 153,86 cm².'),
      fillBlank('Một hình tam giác có đáy 10 cm, chiều cao 8 cm. Diện tích là ___ cm².', '40', 'Lấy 10 nhân 8 rồi chia 2.', '10 × 8 ÷ 2 = 40 cm².'),
      trueFalse('Khối lập phương cạnh 3 cm có thể tích 27 cm³.', true, 'Tính 3 × 3 × 3.', '3 × 3 × 3 = 27 cm³.')
    ]
  },
  {
    grade: 5, unit: 3, title: 'Tỉ lệ bản đồ và bài toán tổng hợp', icon: '🗺️', difficulty: 3,
    description: 'Giải bài toán tỉ lệ, vận tốc, tỉ số và trung bình cộng trong thực tế.',
    questions: [
      multipleChoice('Bản đồ có tỉ lệ 1 : 100.000. Đoạn đường 3 cm trên bản đồ dài bao nhiêu ngoài thực tế?', '3 km', ['300 m', '30 km'], '1 cm trên bản đồ ứng với 100.000 cm ngoài thực tế.', '100.000 cm = 1 km nên 3 cm ứng với 3 km.'),
      multipleChoice('Bản đồ tỉ lệ 1 : 50.000. Đoạn đường 4 cm ứng với bao nhiêu ngoài thực tế?', '2 km', ['200 m', '20 km'], '1 cm ứng với 50.000 cm = 500 m.', '4 × 500 m = 2.000 m = 2 km.'),
      multipleChoice('24 quyển vở chia đều vào 6 hộp. Mỗi hộp có bao nhiêu quyển?', '4 quyển', ['3 quyển', '6 quyển'], 'Chia tổng số vở cho số hộp.', '24 ÷ 6 = 4 quyển.'),
      multipleChoice('Tỉ số giữa 12 viên bi đỏ và 18 viên bi xanh, viết tối giản, là gì?', '2 : 3', ['3 : 2', '12 : 3'], 'Chia cả hai số cho 6.', '12 : 18 = 2 : 3.'),
      fillBlank('Trung bình cộng của 6, 8 và 10 là ___ .', '8', 'Cộng ba số rồi chia cho 3.', '(6 + 8 + 10) ÷ 3 = 8.'),
      multipleChoice('Một xe đi 120 km trong 2 giờ. Vận tốc trung bình là bao nhiêu?', '60 km/giờ', ['60 km', '240 km/giờ'], 'Lấy quãng đường chia thời gian.', '120 ÷ 2 = 60 km/giờ.'),
      trueFalse('2/5 bằng 40%.', true, 'Đổi 2/5 thành phần trăm bằng cách nhân với 100%.', '2 ÷ 5 × 100% = 40%.'),
      multipleChoice('Một cửa hàng bán 15 hộp vào buổi sáng và 21 hộp buổi chiều. Trung bình mỗi buổi bán bao nhiêu hộp?', '18 hộp', ['17 hộp', '36 hộp'], 'Cộng số hộp rồi chia cho 2 buổi.', '(15 + 21) ÷ 2 = 18 hộp.')
    ]
  }
];

const makeMathLesson = (spec: MathLessonSpec): Lesson => {
  const unitId = `g${spec.grade}_m_mathbank`;

  return {
    id: `${unitId}_u${spec.unit}_l1`,
    title: spec.title,
    grade: spec.grade,
    subject: 'math',
    unitId,
    unitTitle: `Bài tập mở rộng Toán lớp ${spec.grade}`,
    icon: spec.icon,
    description: spec.description,
    difficulty: spec.difficulty,
    passingScore: 60,
    xpReward: 45 + spec.unit * 5,
    starsRequiredToUnlock: 0,
    questions: spec.questions.map((question, index) => ({
      ...question,
      id: `q${index + 1}`
    }))
  };
};

export const MATH_EXPANSION_LESSONS: Lesson[] = lessonSpecs.map(makeMathLesson);
