// ================================================================
// NGÂN HÀNG BÀI HỌC - MÔN TIẾNG ANH | LỚP 1 -> LỚP 5
// ================================================================
import { Lesson } from '../types/curriculum';

export const ENGLISH_LESSONS: Lesson[] = [

  // ============================================================
  // LỚP 1 - CHƯƠNG 1: COLORS & NUMBERS
  // ============================================================
  {
    id: 'g1_e_u1_l1',
    title: 'Colours: Learn Red, Blue, Yellow, Green!',
    grade: 1, subject: 'english',
    unitId: 'g1_e_u1', unitTitle: 'Unit 1: Colors & Shapes',
    icon: '🎨', difficulty: 1,
    passingScore: 60, xpReward: 35, starsRequiredToUnlock: 0,
    description: 'Learn 6 basic colors in English with fun songs and pictures!',
    funFact: 'In English, "color" (US) and "colour" (UK) both mean the same thing — màu sắc!',
    questions: [
      {
        id: 'q1', type: 'image_choice',
        prompt: 'Which one is RED? 🔴',
        audioPromptText: 'Point to the red color! Which one is red?',
        options: [
          { id: 'a', emoji: '🔵', text: 'Blue', isCorrect: false },
          { id: 'b', emoji: '🔴', text: 'Red', isCorrect: true },
          { id: 'c', emoji: '🟡', text: 'Yellow', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'What color is the SUN ☀️?',
        audioPromptText: 'What color is the sun?',
        options: [
          { id: 'a', text: 'Blue', isCorrect: false },
          { id: 'b', text: 'Yellow', isCorrect: true },
          { id: 'c', text: 'Green', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'word_match',
        prompt: 'Match the color with the correct thing:',
        audioPromptText: 'Match each color with the right object!',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'Red', right: '🍎 Apple', leftEmoji: '🔴', rightEmoji: '🍎' },
            { id: 'p2', left: 'Green', right: '🌿 Leaf', leftEmoji: '🟢', rightEmoji: '🌿' },
            { id: 'p3', left: 'Blue', right: '🌊 Ocean', leftEmoji: '🔵', rightEmoji: '🌊' }
          ]
        }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'What color is GRASS 🌱?',
        audioPromptText: 'What color is the grass?',
        hint: 'Cỏ có màu gì? Think of the color of plants!',
        options: [
          { id: 'a', text: 'Red', isCorrect: false },
          { id: 'b', text: 'Green', isCorrect: true },
          { id: 'c', text: 'Purple', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g1_e_u1_l2',
    title: 'Numbers 1-10: Count With Me!',
    grade: 1, subject: 'english',
    unitId: 'g1_e_u1', unitTitle: 'Unit 1: Colors & Shapes',
    icon: '🔢', difficulty: 1,
    passingScore: 60, xpReward: 35, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g1_e_u1_l1',
    description: 'Learn to say and recognize numbers 1-10 in English!',
    funFact: '"Eleven" và "Twelve" có cách đọc rất đặc biệt — không theo quy tắc!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'How do you say "5" in English?',
        audioPromptText: 'How do you say the number five in English?',
        options: [
          { id: 'a', text: 'Four', isCorrect: false },
          { id: 'b', text: 'Five', isCorrect: true },
          { id: 'c', text: 'Six', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Match the number with the word:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: '3', right: 'Three', leftEmoji: '3️⃣', rightEmoji: '📝' },
            { id: 'p2', left: '7', right: 'Seven', leftEmoji: '7️⃣', rightEmoji: '📝' },
            { id: 'p3', left: '10', right: 'Ten', leftEmoji: '🔟', rightEmoji: '📝' }
          ]
        }
      },
      {
        id: 'q3', type: 'ordering',
        prompt: 'Put in order from small to big: Eight / Three / One / Six',
        interactiveData: {
          orderItems: [
            { id: 'eight', text: 'Eight (8)', correctIndex: 3 },
            { id: 'three', text: 'Three (3)', correctIndex: 1 },
            { id: 'one', text: 'One (1)', correctIndex: 0 },
            { id: 'six', text: 'Six (6)', correctIndex: 2 }
          ]
        }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'I have 🍪🍪🍪🍪🍪🍪🍪 cookies. How many? (in English)',
        audioPromptText: 'Count the cookies and say the number in English!',
        options: [
          { id: 'a', text: 'Six', isCorrect: false },
          { id: 'b', text: 'Seven', isCorrect: true },
          { id: 'c', text: 'Eight', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g1_e_u1_l3',
    title: 'Alphabet A-Z: Sing The ABC Song!',
    grade: 1, subject: 'english',
    unitId: 'g1_e_u1', unitTitle: 'Unit 1: Colors & Shapes',
    icon: '🔤', difficulty: 2,
    passingScore: 70, xpReward: 50, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g1_e_u1_l2',
    description: 'Master the English alphabet — 26 letters, uppercase and lowercase!',
    funFact: 'The English alphabet has only 26 letters but can make over 170,000 words!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Which letter comes AFTER "M"?',
        audioPromptText: 'Which letter comes after M in the alphabet?',
        options: [
          { id: 'a', text: 'L', isCorrect: false },
          { id: 'b', text: 'N', isCorrect: true },
          { id: 'c', text: 'O', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"Apple" starts with which letter?',
        audioPromptText: 'Apple starts with which letter?',
        options: [
          { id: 'a', text: 'A', isCorrect: true },
          { id: 'b', text: 'P', isCorrect: false },
          { id: 'c', text: 'E', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'ordering',
        prompt: 'Put in alphabetical order: D / A / F / C / B / E',
        interactiveData: {
          orderItems: [
            { id: 'd', text: 'D', correctIndex: 3 },
            { id: 'a', text: 'A', correctIndex: 0 },
            { id: 'f', text: 'F', correctIndex: 5 },
            { id: 'c', text: 'C', correctIndex: 2 },
            { id: 'b', text: 'B', correctIndex: 1 },
            { id: 'e', text: 'E', correctIndex: 4 }
          ]
        }
      },
      {
        id: 'q4', type: 'word_match',
        prompt: 'Match letter with word starting with that letter:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'C', right: 'Cat 🐱', leftEmoji: '🔤', rightEmoji: '🐱' },
            { id: 'p2', left: 'D', right: 'Dog 🐶', leftEmoji: '🔤', rightEmoji: '🐶' },
            { id: 'p3', left: 'E', right: 'Elephant 🐘', leftEmoji: '🔤', rightEmoji: '🐘' }
          ]
        }
      }
    ]
  },
  {
    id: 'g1_e_u1_l4',
    title: '⚡ Challenge: Phonics — Sound Out First Letters!',
    grade: 1, subject: 'english',
    unitId: 'g1_e_u1', unitTitle: 'Unit 1: Colors & Shapes',
    icon: '🔊', difficulty: 3,
    passingScore: 80, xpReward: 90, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g1_e_u1_l3',
    description: 'Advanced phonics: identify the beginning sound of English words!',
    funFact: 'Phonics là cách học đọc tiếng Anh hiệu quả nhất — thay vì học thuộc từng từ!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '🐱 "CAT" — What is the FIRST sound?',
        audioPromptText: 'What is the first sound in the word cat?',
        options: [
          { id: 'a', text: '/a/ (như chữ A)', isCorrect: false },
          { id: 'b', text: '/k/ (như chữ C/K)', isCorrect: true },
          { id: 'c', text: '/t/ (như chữ T)', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Which word has the same first sound as "🐕 DOG"?',
        audioPromptText: 'Which word begins with the same sound as dog?',
        options: [
          { id: 'a', text: 'Ball', isCorrect: false },
          { id: 'b', text: 'Duck', isCorrect: true },
          { id: 'c', text: 'Cat', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'word_match',
        prompt: 'Match the word to its first letter sound:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: '🐸 Frog', right: '/f/ sound', leftEmoji: '🐸', rightEmoji: '🔊' },
            { id: 'p2', left: '🦒 Giraffe', right: '/j/ sound', leftEmoji: '🦒', rightEmoji: '🔊' },
            { id: 'p3', left: '🐝 Bee', right: '/b/ sound', leftEmoji: '🐝', rightEmoji: '🔊' }
          ]
        }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'Spell the word for this: 🌙',
        audioPromptText: 'How do you spell the word for moon?',
        options: [
          { id: 'a', text: 'MOAN', isCorrect: false },
          { id: 'b', text: 'MOON', isCorrect: true },
          { id: 'c', text: 'MOOM', isCorrect: false }
        ]
      }
    ]
  },

  // ============================================================
  // LỚP 2 - GREETINGS, FAMILY, SCHOOL
  // ============================================================
  {
    id: 'g2_e_u1_l1',
    title: 'Greetings: Hello, Hi, Good Morning!',
    grade: 2, subject: 'english',
    unitId: 'g2_e_u1', unitTitle: 'Unit 1: Greetings & Introductions',
    icon: '👋', difficulty: 1,
    passingScore: 65, xpReward: 40, starsRequiredToUnlock: 0,
    description: 'Learn how to say hello and goodbye in English like a pro!',
    funFact: '"Hello" được sử dụng rộng rãi nhờ phát minh điện thoại của Thomas Edison năm 1877!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'In the MORNING, you say:',
        audioPromptText: 'Buổi sáng bạn nói gì khi gặp ai đó trong tiếng Anh?',
        options: [
          { id: 'a', text: 'Good Evening!', isCorrect: false },
          { id: 'b', text: 'Good Morning!', isCorrect: true },
          { id: 'c', text: 'Good Night!', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Match the greeting to the right time:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'Good Morning', right: 'Buổi sáng ☀️', leftEmoji: '🌅', rightEmoji: '☀️' },
            { id: 'p2', left: 'Good Afternoon', right: 'Buổi chiều 🌤️', leftEmoji: '🕐', rightEmoji: '🌤️' },
            { id: 'p3', left: 'Good Night', right: 'Buổi tối 🌙', leftEmoji: '🌙', rightEmoji: '💤' }
          ]
        }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'How do you ask someone\'s name?',
        audioPromptText: 'Làm thế nào để hỏi tên ai đó bằng tiếng Anh?',
        options: [
          { id: 'a', text: 'Where are you?', isCorrect: false },
          { id: 'b', text: 'What is your name?', isCorrect: true },
          { id: 'c', text: 'How old are you?', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'ordering',
        prompt: 'Put in order to make a greeting: "name / My / is / Minh"',
        interactiveData: {
          orderItems: [
            { id: 'my', text: 'My', correctIndex: 0 },
            { id: 'name', text: 'name', correctIndex: 1 },
            { id: 'is', text: 'is', correctIndex: 2 },
            { id: 'minh', text: 'Minh.', correctIndex: 3 }
          ]
        }
      }
    ]
  },
  {
    id: 'g2_e_u1_l2',
    title: 'My Family: Mom, Dad, Sister, Brother',
    grade: 2, subject: 'english',
    unitId: 'g2_e_u1', unitTitle: 'Unit 1: Greetings & Introductions',
    icon: '👨‍👩‍👧‍👦', difficulty: 1,
    passingScore: 65, xpReward: 45, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g2_e_u1_l1',
    description: 'Learn family member names in English and use "This is my..."',
    funFact: '"Family" trong tiếng Anh bắt nguồn từ chữ Latin "familia" có nghĩa là gia đình!',
    questions: [
      {
        id: 'q1', type: 'word_match',
        prompt: 'Match English word with Vietnamese meaning:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'Mother', right: 'Mẹ', leftEmoji: '👩', rightEmoji: '💝' },
            { id: 'p2', left: 'Father', right: 'Bố / Ba', leftEmoji: '👨', rightEmoji: '💙' },
            { id: 'p3', left: 'Sister', right: 'Chị / Em gái', leftEmoji: '👧', rightEmoji: '💗' },
            { id: 'p4', left: 'Brother', right: 'Anh / Em trai', leftEmoji: '👦', rightEmoji: '💚' }
          ]
        }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"This is my ___" — How do you introduce your dad?',
        audioPromptText: 'How do you say "đây là bố của tôi" in English?',
        options: [
          { id: 'a', text: 'This is my mother.', isCorrect: false },
          { id: 'b', text: 'This is my father.', isCorrect: true },
          { id: 'c', text: 'This is my brother.', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '"My ___ is a doctor." — Điền từ chỉ người mẹ:',
        audioPromptText: 'How do you say my doctor mom is... in English?',
        interactiveData: { blanks: ['mother'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: 'The word for "ông bà" (grandparents) in English is:',
        audioPromptText: 'How do you say ông bà in English?',
        options: [
          { id: 'a', text: 'Uncles', isCorrect: false },
          { id: 'b', text: 'Grandparents', isCorrect: true },
          { id: 'c', text: 'Cousins', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g2_e_u1_l3',
    title: 'School Things: Pen, Book, Bag, Ruler!',
    grade: 2, subject: 'english',
    unitId: 'g2_e_u1', unitTitle: 'Unit 1: Greetings & Introductions',
    icon: '🎒', difficulty: 2,
    passingScore: 70, xpReward: 55, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g2_e_u1_l2',
    description: 'Learn vocabulary for school supplies and classroom objects!',
    funFact: '"Pencil" bắt nguồn từ chữ "pencillus" trong tiếng Latin, nghĩa là "cái đuôi nhỏ"!',
    questions: [
      {
        id: 'q1', type: 'image_choice',
        prompt: 'Which one is a PENCIL? ✏️',
        audioPromptText: 'Which one is a pencil?',
        options: [
          { id: 'a', emoji: '📏', text: 'Ruler', isCorrect: false },
          { id: 'b', emoji: '✏️', text: 'Pencil', isCorrect: true },
          { id: 'c', emoji: '📚', text: 'Book', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Match the school item to its name:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: '📚 Book', right: 'Sách / Quyển sách', leftEmoji: '📚', rightEmoji: '📖' },
            { id: 'p2', left: '🎒 Bag', right: 'Túi / Cặp sách', leftEmoji: '🎒', rightEmoji: '💼' },
            { id: 'p3', left: '✂️ Scissors', right: 'Kéo', leftEmoji: '✂️', rightEmoji: '🔪' }
          ]
        }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: '"I need a ___ to draw a straight line." — What tool?',
        audioPromptText: 'What do you use to draw a straight line?',
        options: [
          { id: 'a', text: 'Pen', isCorrect: false },
          { id: 'b', text: 'Ruler', isCorrect: true },
          { id: 'c', text: 'Eraser', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: '"I have a red ___." — Điền dụng cụ viết bắt đầu bằng P:',
        interactiveData: { blanks: ['pen'] }
      }
    ]
  },
  {
    id: 'g2_e_u1_l4',
    title: '🏆 Challenge: Full Sentences — "I have / I like"',
    grade: 2, subject: 'english',
    unitId: 'g2_e_u1', unitTitle: 'Unit 1: Greetings & Introductions',
    icon: '✍️', difficulty: 3,
    passingScore: 80, xpReward: 100, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g2_e_u1_l3',
    description: 'Build complete English sentences using "I have", "I like", "I am"!',
    funFact: '"I" (tôi) luôn được viết hoa trong tiếng Anh — đây là điểm đặc biệt không ngôn ngữ nào có!',
    questions: [
      {
        id: 'q1', type: 'ordering',
        prompt: 'Make a sentence: "like / I / ice cream"',
        interactiveData: {
          orderItems: [
            { id: 'i', text: 'I', correctIndex: 0 },
            { id: 'like', text: 'like', correctIndex: 1 },
            { id: 'ice', text: 'ice cream.', correctIndex: 2 }
          ]
        }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'Which sentence is CORRECT?',
        audioPromptText: 'Which sentence is grammatically correct?',
        options: [
          { id: 'a', text: 'I has a cat.', isCorrect: false },
          { id: 'b', text: 'I have a cat.', isCorrect: true },
          { id: 'c', text: 'Me have a cat.', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '"___ am a student." (Điền đại từ nhân xưng)',
        interactiveData: { blanks: ['I'] }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"I like pizza" is a correct English sentence.',
        options: [
          { id: 'true', text: '✅ True — It is correct!', isCorrect: true },
          { id: 'false', text: '❌ False', isCorrect: false }
        ]
      }
    ]
  },

  // ============================================================
  // LỚP 3 - ANIMALS, FOOD, BODY PARTS
  // ============================================================
  {
    id: 'g3_e_u1_l1',
    title: 'Animals: Wild & Farm Animals Vocabulary',
    grade: 3, subject: 'english',
    unitId: 'g3_e_u1', unitTitle: 'Unit 1: The World Around Us',
    icon: '🦁', difficulty: 1,
    passingScore: 65, xpReward: 50, starsRequiredToUnlock: 0,
    description: 'Learn the names of wild animals and farm animals in English!',
    funFact: 'The word "Elephant" came from the Greek word "elephas" meaning ivory!',
    questions: [
      {
        id: 'q1', type: 'image_choice',
        prompt: 'Which animal is a LION? 🦁',
        audioPromptText: 'Which one is a lion?',
        options: [
          { id: 'a', emoji: '🐘', text: 'Elephant', isCorrect: false },
          { id: 'b', emoji: '🦁', text: 'Lion', isCorrect: true },
          { id: 'c', emoji: '🦒', text: 'Giraffe', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Match animal to where it lives:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: '🐄 Cow', right: 'Farm 🌾', leftEmoji: '🐄', rightEmoji: '🌾' },
            { id: 'p2', left: '🐬 Dolphin', right: 'Ocean 🌊', leftEmoji: '🐬', rightEmoji: '🌊' },
            { id: 'p3', left: '🦁 Lion', right: 'Jungle 🌿', leftEmoji: '🦁', rightEmoji: '🌿' }
          ]
        }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'A "butterfly" is a type of:',
        audioPromptText: 'What type of animal is a butterfly?',
        options: [
          { id: 'a', text: 'Bird', isCorrect: false },
          { id: 'b', text: 'Fish', isCorrect: false },
          { id: 'c', text: 'Insect', isCorrect: true }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: '"The ___ has a long neck." (Con gì có cổ dài?)',
        audioPromptText: 'What animal has the longest neck?',
        interactiveData: { blanks: ['giraffe'] }
      }
    ]
  },
  {
    id: 'g3_e_u1_l2',
    title: 'Yummy Food! Fruits, Vegetables & Meals',
    grade: 3, subject: 'english',
    unitId: 'g3_e_u1', unitTitle: 'Unit 1: The World Around Us',
    icon: '🍎', difficulty: 1,
    passingScore: 65, xpReward: 50, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g3_e_u1_l1',
    description: 'Learn food vocabulary and how to say what you eat!',
    funFact: 'The tomato was considered poisonous in Europe until the 1800s!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Which is a VEGETABLE?',
        audioPromptText: 'Which one is a vegetable?',
        options: [
          { id: 'a', text: '🍎 Apple', isCorrect: false },
          { id: 'b', text: '🥕 Carrot', isCorrect: true },
          { id: 'c', text: '🍇 Grapes', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Match food to the meal it belongs to:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: '🥞 Pancakes', right: 'Breakfast', leftEmoji: '🥞', rightEmoji: '🌅' },
            { id: 'p2', left: '🍝 Pasta', right: 'Lunch / Dinner', leftEmoji: '🍝', rightEmoji: '🍽️' },
            { id: 'p3', left: '🍰 Cake', right: 'Dessert', leftEmoji: '🍰', rightEmoji: '🎂' }
          ]
        }
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '"I eat ___ for breakfast." (Bé ăn gì vào buổi sáng — tiếng Anh bắt đầu bằng R)',
        interactiveData: { blanks: ['rice'] }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: '"Do you like pizza?" — How to answer YES?',
        audioPromptText: 'Làm thế nào để trả lời có khi ai hỏi bạn có thích pizza không?',
        options: [
          { id: 'a', text: 'Yes, I likes pizza.', isCorrect: false },
          { id: 'b', text: 'Yes, I like pizza.', isCorrect: true },
          { id: 'c', text: 'Yes, me like pizza.', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g3_e_u1_l3',
    title: 'My Body: Head, Shoulders, Knees & Toes!',
    grade: 3, subject: 'english',
    unitId: 'g3_e_u1', unitTitle: 'Unit 1: The World Around Us',
    icon: '🧍', difficulty: 2,
    passingScore: 70, xpReward: 60, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g3_e_u1_l2',
    description: 'Learn body parts in English and sing the famous "Head, Shoulders" song!',
    funFact: 'The human body has over 600 muscles — that\'s a lot of body parts to name!',
    questions: [
      {
        id: 'q1', type: 'image_choice',
        prompt: 'Point to the EARS 👂:',
        audioPromptText: 'Point to the ears!',
        options: [
          { id: 'a', emoji: '👀', text: 'Eyes', isCorrect: false },
          { id: 'b', emoji: '👂', text: 'Ears', isCorrect: true },
          { id: 'c', emoji: '👃', text: 'Nose', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Match body part to its Vietnamese name:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'Head', right: 'Đầu', leftEmoji: '🗣️', rightEmoji: '🧠' },
            { id: 'p2', left: 'Hands', right: 'Bàn tay', leftEmoji: '🤲', rightEmoji: '👐' },
            { id: 'p3', left: 'Feet', right: 'Bàn chân', leftEmoji: '🦶', rightEmoji: '👣' }
          ]
        }
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '"I see with my ___." (Tôi nhìn bằng gì?)',
        interactiveData: { blanks: ['eyes'] }
      },
      {
        id: 'q4', type: 'ordering',
        prompt: 'Order the body parts from top to bottom:',
        interactiveData: {
          orderItems: [
            { id: 'knee', text: 'Knee (đầu gối)', correctIndex: 2 },
            { id: 'head', text: 'Head (đầu)', correctIndex: 0 },
            { id: 'toe', text: 'Toe (ngón chân)', correctIndex: 3 },
            { id: 'shoulder', text: 'Shoulder (vai)', correctIndex: 1 }
          ]
        }
      }
    ]
  },
  {
    id: 'g3_e_u1_l4',
    title: '🔥 Grammar: Present Simple — He/She Does, Doesn\'t',
    grade: 3, subject: 'english',
    unitId: 'g3_e_u1', unitTitle: 'Unit 1: The World Around Us',
    icon: '📖', difficulty: 3,
    passingScore: 80, xpReward: 110, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g3_e_u1_l3',
    description: 'Learn Present Simple tense: He/She + VERB + s, and negative form.',
    funFact: 'Tiếng Anh thêm "-s" hoặc "-es" vào động từ khi chủ ngữ là He/She/It — rất khác với tiếng Việt!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'She ___ to school every day. (go)',
        audioPromptText: 'Fill in the blank: She blank to school every day.',
        options: [
          { id: 'a', text: 'go', isCorrect: false },
          { id: 'b', text: 'goes', isCorrect: true },
          { id: 'c', text: 'goed', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'He ___ not like vegetables.',
        audioPromptText: 'He blank not like vegetables.',
        options: [
          { id: 'a', text: 'do', isCorrect: false },
          { id: 'b', text: 'does', isCorrect: true },
          { id: 'c', text: 'is', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'true_false',
        prompt: '"She play football every Sunday." — Is this CORRECT grammar?',
        audioPromptText: 'She play football every Sunday. Is this sentence correct?',
        options: [
          { id: 'true', text: '✅ True — It is correct', isCorrect: false },
          { id: 'false', text: '❌ False — Should be "She plays"', isCorrect: true }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: '"My brother ___ (like) reading books." (Điền dạng đúng)',
        interactiveData: { blanks: ['likes'] }
      }
    ]
  },

  // ============================================================
  // LỚP 4 & 5 - TENSES, READING, WRITING
  // ============================================================
  {
    id: 'g4_e_u1_l1',
    title: 'Past Simple: Yesterday I WENT to the Park!',
    grade: 4, subject: 'english',
    unitId: 'g4_e_u1', unitTitle: 'Unit 1: Tenses & Grammar',
    icon: '⏰', difficulty: 1,
    passingScore: 65, xpReward: 60, starsRequiredToUnlock: 0,
    description: 'Learn Past Simple tense — talking about things that ALREADY happened.',
    funFact: 'Tiếng Anh có hơn 200 động từ bất quy tắc! "go → went", "eat → ate", "see → saw"',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Yesterday, I ___ (eat) pho for breakfast.',
        audioPromptText: 'Yesterday I blank pho for breakfast.',
        hint: '"eat" là động từ bất quy tắc: eat → ate',
        options: [
          { id: 'a', text: 'eated', isCorrect: false },
          { id: 'b', text: 'ate', isCorrect: true },
          { id: 'c', text: 'eating', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Match verb to its PAST SIMPLE form:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'go', right: 'went', leftEmoji: '🏃', rightEmoji: '📝' },
            { id: 'p2', left: 'see', right: 'saw', leftEmoji: '👀', rightEmoji: '📝' },
            { id: 'p3', left: 'have', right: 'had', leftEmoji: '✋', rightEmoji: '📝' }
          ]
        }
      },
      {
        id: 'q3', type: 'multiple_choice',
        prompt: 'Which sentence is in the PAST?',
        audioPromptText: 'Which sentence talks about the past?',
        options: [
          { id: 'a', text: 'I play soccer now.', isCorrect: false },
          { id: 'b', text: 'I played soccer yesterday.', isCorrect: true },
          { id: 'c', text: 'I will play soccer tomorrow.', isCorrect: false }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: '"Last week, she ___ (visit) her grandparents."',
        interactiveData: { blanks: ['visited'] }
      }
    ]
  },
  {
    id: 'g4_e_u1_l2',
    title: 'Future Simple: I WILL Travel The World!',
    grade: 4, subject: 'english',
    unitId: 'g4_e_u1', unitTitle: 'Unit 1: Tenses & Grammar',
    icon: '🚀', difficulty: 2,
    passingScore: 70, xpReward: 75, starsRequiredToUnlock: 1,
    prerequisiteLessonId: 'g4_e_u1_l1',
    description: 'Learn how to talk about the future using "will" and "going to".',
    funFact: 'Tiếng Anh có hai cách nói về tương lai: "will" (quyết định tức thì) và "going to" (kế hoạch sẵn có)',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Tomorrow, I ___ go to the beach.',
        options: [
          { id: 'a', text: 'will', isCorrect: true },
          { id: 'b', text: 'went', isCorrect: false },
          { id: 'c', text: 'goes', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"It ___ rain tomorrow." — Weather forecast.',
        options: [
          { id: 'a', text: 'rained', isCorrect: false },
          { id: 'b', text: 'will', isCorrect: true },
          { id: 'c', text: 'is', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '"Next year, we ___ move to a new house." (will + verb)',
        interactiveData: { blanks: ['will'] }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"I will to go school tomorrow." — Is this CORRECT?',
        options: [
          { id: 'true', text: '✅ Correct', isCorrect: false },
          { id: 'false', text: '❌ Wrong — "will go" not "will to go"', isCorrect: true }
        ]
      }
    ]
  },
  {
    id: 'g5_e_u1_l1',
    title: 'Reading: Short Story Comprehension',
    grade: 5, subject: 'english',
    unitId: 'g5_e_u1', unitTitle: 'Unit 1: Reading & Writing Mastery',
    icon: '📖', difficulty: 2,
    passingScore: 70, xpReward: 80, starsRequiredToUnlock: 0,
    description: 'Read a short English story and answer comprehension questions!',
    funFact: 'Reading in English for 20 minutes a day exposes you to 1,800,000 new words per year!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Story: "Tom is 10 years old. He lives with his family. His mom is a teacher and his dad is a doctor." → How OLD is Tom?',
        audioPromptText: 'Read the story: Tom is 10 years old. How old is Tom?',
        options: [
          { id: 'a', text: '9 years old', isCorrect: false },
          { id: 'b', text: '10 years old', isCorrect: true },
          { id: 'c', text: '11 years old', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'From the same story: What is Tom\'s MOTHER\'s job?',
        options: [
          { id: 'a', text: 'Doctor', isCorrect: false },
          { id: 'b', text: 'Teacher', isCorrect: true },
          { id: 'c', text: 'Engineer', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'true_false',
        prompt: 'From the story: "Tom\'s father is a teacher." — True or False?',
        options: [
          { id: 'true', text: '✅ True', isCorrect: false },
          { id: 'false', text: '❌ False — His father is a DOCTOR', isCorrect: true }
        ]
      },
      {
        id: 'q4', type: 'fill_in_the_blank',
        prompt: 'Tom\'s dad is a ___. (One word answer from the story)',
        interactiveData: { blanks: ['doctor'] }
      }
    ]
  },
  {
    id: 'g5_e_u1_l2',
    title: '⚡ MASTER LEVEL: Complex Grammar & Essay Writing',
    grade: 5, subject: 'english',
    unitId: 'g5_e_u1', unitTitle: 'Unit 1: Reading & Writing Mastery',
    icon: '🎓', difficulty: 4,
    passingScore: 85, xpReward: 250, starsRequiredToUnlock: 2,
    prerequisiteLessonId: 'g5_e_u1_l1',
    description: 'MASTER CHALLENGE: Present Perfect, Conditionals, and Writing skills!',
    funFact: 'Học sinh lớp 5 giỏi tiếng Anh tương đương trình độ A2 trên thang quốc tế CEFR!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: '"I ___ never seen snow in my life." (Present Perfect)',
        options: [
          { id: 'a', text: 'have', isCorrect: true },
          { id: 'b', text: 'has', isCorrect: false },
          { id: 'c', text: 'had', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"If it rains tomorrow, we ___ stay inside." (Type 1 Conditional)',
        options: [
          { id: 'a', text: 'will', isCorrect: true },
          { id: 'b', text: 'would', isCorrect: false },
          { id: 'c', text: 'should', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'ordering',
        prompt: 'Arrange into a correct sentence: "has / She / piano / playing / been / the"',
        interactiveData: {
          orderItems: [
            { id: 'she', text: 'She', correctIndex: 0 },
            { id: 'has', text: 'has', correctIndex: 1 },
            { id: 'been', text: 'been', correctIndex: 2 },
            { id: 'playing', text: 'playing', correctIndex: 3 },
            { id: 'the', text: 'the', correctIndex: 4 },
            { id: 'piano', text: 'piano.', correctIndex: 5 }
          ]
        }
      },
      {
        id: 'q4', type: 'multiple_choice',
        prompt: '"She has lived in Hanoi ___ 5 years." — Which preposition?',
        options: [
          { id: 'a', text: 'since', isCorrect: false },
          { id: 'b', text: 'for', isCorrect: true },
          { id: 'c', text: 'ago', isCorrect: false }
        ]
      }
    ]
  },

  // ============================================================
  // LỚP 4 - CHƯƠNG 2: DAILY LIFE & SCHOOL
  // ============================================================
  {
    id: 'g4_e_u2_l1',
    title: 'Daily Routines: What time do you wake up?',
    grade: 4, subject: 'english',
    unitId: 'g4_e_u2', unitTitle: 'Unit 2: My Day & Daily Activities',
    icon: '⏰', difficulty: 2,
    passingScore: 70, xpReward: 90, starsRequiredToUnlock: 1,
    description: 'Learn telling time and talking about daily routines in English.',
    funFact: 'In English, AM means morning (ante meridiem) and PM means afternoon/night (post meridiem)!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'What time is it? "It is seven fifteen." (7:15) 🕒',
        audioPromptText: 'What time is it? It is seven fifteen.',
        options: [
          { id: 'a', text: '7 giờ 15 phút', isCorrect: true },
          { id: 'b', text: '7 giờ 50 phút', isCorrect: false },
          { id: 'c', text: '7 giờ rưỡi', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'ordering',
        prompt: 'Put your morning routine in order:',
        interactiveData: {
          orderItems: [
            { id: '1', text: 'Wake up', correctIndex: 0 },
            { id: '2', text: 'Brush teeth', correctIndex: 1 },
            { id: '3', text: 'Eat breakfast', correctIndex: 2 },
            { id: '4', text: 'Go to school', correctIndex: 3 }
          ]
        }
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Complete: "I go to bed ___ 9 o\'clock." (Preposition for time)',
        audioPromptText: 'I go to bed at nine oclock',
        interactiveData: { blanks: ['at'] }
      }
    ]
  },
  {
    id: 'g4_e_u2_l2',
    title: 'School Subjects: Maths, Science, Art & Music',
    grade: 4, subject: 'english',
    unitId: 'g4_e_u2', unitTitle: 'Unit 2: My Day & Daily Activities',
    icon: '🎨', difficulty: 2,
    passingScore: 70, xpReward: 100, starsRequiredToUnlock: 2,
    description: 'Talk about favorite school subjects and schedules.',
    funFact: '"Maths" is used in British English, while Americans say "Math" without the S!',
    questions: [
      {
        id: 'q1', type: 'word_match',
        prompt: 'Match school subjects with what you do:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'Music', right: 'Sing songs & play piano', leftEmoji: '🎵', rightEmoji: '🎹' },
            { id: 'p2', left: 'Art', right: 'Draw pictures & paint', leftEmoji: '🎨', rightEmoji: '🖌️' },
            { id: 'p3', left: 'Science', right: 'Plants & Animals experiments', leftEmoji: '🔬', rightEmoji: '🌱' }
          ]
        }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"What is your favourite subject?" — Choose the best response:',
        options: [
          { id: 'a', text: 'I like English and Maths.', isCorrect: true },
          { id: 'b', text: 'I am 10 years old.', isCorrect: false },
          { id: 'c', text: 'Yes, I do.', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'true_false',
        prompt: '"PE" stands for Physical Education (Môn Thể Dục) — True or False?',
        options: [
          { id: 't', text: '✅ True', isCorrect: true },
          { id: 'f', text: '❌ False', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'g4_e_u2_l3',
    title: 'Sports & Abilities: Can you play basketball?',
    grade: 4, subject: 'english',
    unitId: 'g4_e_u2', unitTitle: 'Unit 2: My Day & Daily Activities',
    icon: '⚽', difficulty: 3,
    passingScore: 75, xpReward: 130, starsRequiredToUnlock: 3,
    description: 'Learn modal verb CAN / CANNOT for sports and abilities.',
    funFact: 'The most popular sport in the world is Football (Soccer) with over 4 billion fans!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Can penguins fly? 🐧',
        options: [
          { id: 'a', text: 'Yes, they can.', isCorrect: false },
          { id: 'b', text: 'No, they cannot (can\'t). They can swim!', isCorrect: true }
        ]
      },
      {
        id: 'q2', type: 'fill_in_the_blank',
        prompt: '"He can ___ the guitar very well." (play / plays / playing)',
        interactiveData: { blanks: ['play'] }
      },
      {
        id: 'q3', type: 'ordering',
        prompt: 'Arrange into a sentence: "swim? / you / Can / fast"',
        interactiveData: {
          orderItems: [
            { id: '1', text: 'Can', correctIndex: 0 },
            { id: '2', text: 'you', correctIndex: 1 },
            { id: '3', text: 'swim', correctIndex: 2 },
            { id: '4', text: 'fast?', correctIndex: 3 }
          ]
        }
      }
    ]
  },

  // ============================================================
  // LỚP 5 - CHƯƠNG 2: PAST TENSE & ADVANCED VOCABULARY
  // ============================================================
  {
    id: 'g5_e_u2_l1',
    title: 'Past Simple Tense: Where were you yesterday?',
    grade: 5, subject: 'english',
    unitId: 'g5_e_u2', unitTitle: 'Unit 2: Past Events & Adventures',
    icon: '📜', difficulty: 2,
    passingScore: 75, xpReward: 140, starsRequiredToUnlock: 1,
    description: 'Master irregular past verbs: go -> went, see -> saw, have -> had.',
    funFact: 'Many common English verbs have irregular past forms because they are ancient Old English words!',
    questions: [
      {
        id: 'q1', type: 'word_match',
        prompt: 'Match present tense verbs with their past tense forms:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'go', right: 'went', leftEmoji: '🚶', rightEmoji: '🏃' },
            { id: 'p2', left: 'see', right: 'saw', leftEmoji: '👀', rightEmoji: '📸' },
            { id: 'p3', left: 'buy', right: 'bought', leftEmoji: '🛒', rightEmoji: '🛍️' }
          ]
        }
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: '"Yesterday, we ___ to Ha Long Bay by bus."',
        options: [
          { id: 'a', text: 'go', isCorrect: false },
          { id: 'b', text: 'went', isCorrect: true },
          { id: 'c', text: 'going', isCorrect: false }
        ]
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: 'Past tense of "eat": Yesterday I ___ a delicious pizza.',
        interactiveData: { blanks: ['ate'] }
      }
    ]
  },
  {
    id: 'g5_e_u2_l2',
    title: 'Comparatives & Superlatives: Faster, Higher, The Best!',
    grade: 5, subject: 'english',
    unitId: 'g5_e_u2', unitTitle: 'Unit 2: Past Events & Adventures',
    icon: '🏆', difficulty: 3,
    passingScore: 80, xpReward: 170, starsRequiredToUnlock: 2,
    description: 'Compare two things (taller than) and find the number one (the tallest).',
    funFact: 'Mount Everest is the highest mountain in the world, standing at 8,848 meters!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'An elephant is ___ than a dog.',
        options: [
          { id: 'a', text: 'bigger', isCorrect: true },
          { id: 'b', text: 'biggest', isCorrect: false },
          { id: 'c', text: 'big', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'multiple_choice',
        prompt: 'The cheetah is the ___ animal on land. 🐆',
        options: [
          { id: 'a', text: 'fast', isCorrect: false },
          { id: 'b', text: 'faster', isCorrect: false },
          { id: 'c', text: 'fastest', isCorrect: true }
        ]
      },
      {
        id: 'q3', type: 'ordering',
        prompt: 'Arrange into a correct sentence: "than / a turtle. / A rabbit / faster / is"',
        interactiveData: {
          orderItems: [
            { id: '1', text: 'A rabbit', correctIndex: 0 },
            { id: '2', text: 'is', correctIndex: 1 },
            { id: '3', text: 'faster', correctIndex: 2 },
            { id: '4', text: 'than', correctIndex: 3 },
            { id: '5', text: 'a turtle.', correctIndex: 4 }
          ]
        }
      }
    ]
  },
  {
    id: 'g5_e_u2_l3',
    title: '⚡ ENGLISH OLYMPIAD CHALLENGE: Reading & Grammar Master',
    grade: 5, subject: 'english',
    unitId: 'g5_e_u2', unitTitle: 'Unit 2: Past Events & Adventures',
    icon: '💎', difficulty: 4,
    passingScore: 85, xpReward: 250, starsRequiredToUnlock: 3,
    description: 'Ultimate primary school English challenge with reading comprehension and idioms!',
    funFact: '"Piece of cake" is an English idiom that means something is very easy!',
    questions: [
      {
        id: 'q1', type: 'multiple_choice',
        prompt: 'Read: "Nam visited London last summer. He saw Big Ben and took a boat on the Thames." → Where did Nam go?',
        options: [
          { id: 'a', text: 'Paris', isCorrect: false },
          { id: 'b', text: 'London (UK)', isCorrect: true },
          { id: 'c', text: 'Tokyo', isCorrect: false }
        ]
      },
      {
        id: 'q2', type: 'word_match',
        prompt: 'Match English idioms with their meanings:',
        interactiveData: {
          matchingPairs: [
            { id: 'p1', left: 'A piece of cake', right: 'Very easy (Rất dễ)', leftEmoji: '🍰', rightEmoji: '👌' },
            { id: 'p2', left: 'Once in a blue moon', right: 'Very rarely (Hiếm khi)', leftEmoji: '🌕', rightEmoji: '⏳' },
            { id: 'p3', left: 'Break a leg', right: 'Good luck! (Chúc may mắn)', leftEmoji: '🎭', rightEmoji: '🍀' }
          ]
        }
      },
      {
        id: 'q3', type: 'fill_in_the_blank',
        prompt: '"If I study hard, I ___ pass the exam with high scores." (will / would)',
        interactiveData: { blanks: ['will'] }
      },
      {
        id: 'q4', type: 'true_false',
        prompt: '"Good, Better, Best" are irregular degrees of comparison for the word "Good"?',
        options: [
          { id: 't', text: '✅ True (Good -> Better -> The Best)', isCorrect: true },
          { id: 'f', text: '❌ False', isCorrect: false }
        ]
      }
    ]
  }
];

