import React, { useState } from 'react';
import { Grade, SubjectId, Lesson, Question, QuestionType, DifficultyLevel } from '../types/curriculum';
import { audioService } from '../services/audioService';
import { firebaseSyncService } from '../services/firebaseSyncService';
import { validateLessonForPublishing, isValidLessonImport } from '../services/teacherValidation';

interface TeacherPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  customLessons: Lesson[];
  onSaveLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onTestLesson: (lesson: Lesson) => void;
}

export const TeacherPortalModal: React.FC<TeacherPortalModalProps> = ({
  isOpen,
  onClose,
  customLessons,
  onSaveLesson,
  onDeleteLesson,
  onTestLesson
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'import' | 'manage'>('create');

  // Form bài học
  const [grade, setGrade] = useState<Grade>(1);
  const [subject, setSubject] = useState<SubjectId>('math');
  const [title, setTitle] = useState('');
  const [unitTitle, setUnitTitle] = useState('Chương 1: Bài học nâng cao');
  const [icon, setIcon] = useState('🌟');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
  const [starsRequired, setStarsRequired] = useState(0);
  const [description, setDescription] = useState('');
  const [funFact, setFunFact] = useState('');

  React.useEffect(() => {
    if (!isOpen) {
      setActiveTab('create');
      setGrade(1);
      setSubject('math');
      setTitle('');
      setUnitTitle('Chương 1: Bài học nâng cao');
      setIcon('🌟');
      setDifficulty(1);
      setStarsRequired(0);
      setDescription('');
      setFunFact('');
      setQuestions([]);
      setQType('multiple_choice');
      setQPrompt('');
      setQAudio('');
      setQHint('');
      setOptA('');
      setOptB('');
      setOptC('');
      setCorrectOpt('a');
      setBlankAnswer('');
      setTfCorrect(true);
      setStep1('');
      setStep2('');
      setStep3('');
      setPreviewUserChoice(null);
      setShowPreviewSteps(false);
      setImportJsonText('');
      setImportMessage(null);
      setFormMessage(null);
      setCodeToDownload('');
      setDownloadMsg(null);
      setSharedCodeMap({});
      setSharingLessonId(null);
    }
  }, [isOpen]);

  // Danh sách câu hỏi đang soạn
  const [questions, setQuestions] = useState<Question[]>([]);

  // Form thêm câu hỏi mới
  const [qType, setQType] = useState<QuestionType>('multiple_choice');
  const [qPrompt, setQPrompt] = useState('');
  const [qAudio, setQAudio] = useState('');
  const [qHint, setQHint] = useState('');

  // Lời giải chi tiết từng bước
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');

  // Live preview test interaction
  const [previewUserChoice, setPreviewUserChoice] = useState<string | null>(null);
  const [showPreviewSteps, setShowPreviewSteps] = useState(false);

  // Options trắc nghiệm
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [correctOpt, setCorrectOpt] = useState<'a' | 'b' | 'c'>('a');

  // Dạng điền từ
  const [blankAnswer, setBlankAnswer] = useState('');

  // Dạng đúng sai
  const [tfCorrect, setTfCorrect] = useState<boolean>(true);

  // Tab Import JSON & Cloud
  const [importJsonText, setImportJsonText] = useState('');
  const [importMessage, setImportMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [formMessage, setFormMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Tính năng tải & chia sẻ mã đề Cloud
  const [codeToDownload, setCodeToDownload] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [sharedCodeMap, setSharedCodeMap] = useState<{ [lessonId: string]: string }>({});
  const [sharingLessonId, setSharingLessonId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Thêm câu hỏi vào bài đang soạn
  const handleAddQuestion = () => {
    if (!qPrompt.trim()) {
      setFormMessage({ text: 'Vui lòng nhập nội dung đề bài!', isError: true });
      return;
    }

    const newQId = 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    let newQuestion: Question;

    const steps: string[] = [];
    if (step1.trim()) steps.push(step1.trim());
    if (step2.trim()) steps.push(step2.trim());
    if (step3.trim()) steps.push(step3.trim());
    const explanationStepByStep = steps.length > 0 ? steps : undefined;

    if (qType === 'multiple_choice') {
      if (!optA.trim() || !optB.trim()) {
        setFormMessage({ text: 'Vui lòng nhập ít nhất lựa chọn A và B!', isError: true });
        return;
      }
      const opts = [
        { id: 'a', text: optA.trim(), isCorrect: correctOpt === 'a' },
        { id: 'b', text: optB.trim(), isCorrect: correctOpt === 'b' }
      ];
      if (optC.trim()) {
        opts.push({ id: 'c', text: optC.trim(), isCorrect: correctOpt === 'c' });
      }
      newQuestion = {
        id: newQId,
        type: 'multiple_choice',
        prompt: qPrompt.trim(),
        audioPromptText: qAudio.trim() || undefined,
        hint: qHint.trim() || undefined,
        explanationStepByStep,
        options: opts
      };
    } else if (qType === 'true_false') {
      newQuestion = {
        id: newQId,
        type: 'true_false',
        prompt: qPrompt.trim(),
        audioPromptText: qAudio.trim() || undefined,
        hint: qHint.trim() || undefined,
        explanationStepByStep,
        options: [
          { id: 't', text: '✅ Đúng', isCorrect: tfCorrect },
          { id: 'f', text: '❌ Sai', isCorrect: !tfCorrect }
        ]
      };
    } else if (qType === 'fill_in_the_blank') {
      if (!blankAnswer.trim()) {
        setFormMessage({ text: 'Vui lòng nhập đáp án đúng cho chỗ trống!', isError: true });
        return;
      }
      newQuestion = {
        id: newQId,
        type: 'fill_in_the_blank',
        prompt: qPrompt.trim(),
        audioPromptText: qAudio.trim() || undefined,
        hint: qHint.trim() || undefined,
        explanationStepByStep,
        interactiveData: {
          blanks: [blankAnswer.trim()]
        }
      };
    } else {
      // Fallback
      newQuestion = {
        id: newQId,
        type: qType,
        prompt: qPrompt.trim(),
        audioPromptText: qAudio.trim() || undefined,
        hint: qHint.trim() || undefined,
        explanationStepByStep,
        options: [{ id: 'a', text: 'Đáp án A', isCorrect: true }]
      };
    }

    setQuestions([...questions, newQuestion]);
    audioService.playPop();

    // Reset form câu hỏi
    setQPrompt('');
    setQAudio('');
    setQHint('');
    setOptA('');
    setOptB('');
    setOptC('');
    setBlankAnswer('');
    setStep1('');
    setStep2('');
    setStep3('');
    setPreviewUserChoice(null);
    setShowPreviewSteps(false);
    setFormMessage({ text: 'Đã thêm câu hỏi vào bài học.', isError: false });
  };

  // Lưu bài học
  const handleSaveLesson = () => {
    if (!title.trim()) {
      setFormMessage({ text: 'Vui lòng nhập tiêu đề bài học!', isError: true });
      return;
    }
    if (questions.length === 0) {
      setFormMessage({ text: 'Bài học cần có ít nhất 1 câu hỏi! Hãy nhấn "➕ Thêm Câu Hỏi Này" ở dưới.', isError: true });
      return;
    }

    const lessonId = 'custom_' + subject + '_g' + grade + '_' + Date.now();
    const newLesson: Lesson = {
      id: lessonId,
      title: title.trim(),
      grade,
      subject,
      unitId: 'unit_' + subject + '_g' + grade,
      unitTitle: unitTitle.trim() || 'Chương Tự Tạo',
      icon: icon.trim() || '🌟',
      difficulty,
      passingScore: 60,
      xpReward: 50 * difficulty,
      starsRequiredToUnlock: starsRequired,
      description: description.trim() || 'Bài tập rèn luyện do giáo viên biên soạn.',
      funFact: funFact.trim() || undefined,
      questions
    };

    const validation = validateLessonForPublishing(newLesson);
    if (!validation.valid) {
      setFormMessage({ text: validation.message, isError: true });
      return;
    }

    onSaveLesson(newLesson);
    audioService.playSuccess();
    setFormMessage({ text: `Đã lưu và xuất bản bài học "${newLesson.title}" thành công vào hệ thống!`, isError: false });

    setTitle('');
    setDescription('');
    setFunFact('');
    setQuestions([]);
    setActiveTab('manage');
  };

  // Tải bài học từ Cloud bằng mã ngắn (Ví dụ: DE-1234)
  const handleDownloadByCode = async () => {
    if (!codeToDownload.trim()) {
      setDownloadMsg({ text: 'Vui lòng nhập mã bài học (Ví dụ: DE-1234)!', isError: true });
      return;
    }
    setDownloadLoading(true);
    setDownloadMsg(null);
    try {
      const lesson = await firebaseSyncService.fetchLessonByCode(codeToDownload.trim());
      if (!lesson) {
        setDownloadMsg({ text: `Không tìm thấy bài học nào với mã "${codeToDownload.trim()}". Vui lòng kiểm tra lại!`, isError: true });
      } else {
        onSaveLesson(lesson);
        audioService.playSuccess();
        setDownloadMsg({ text: `✓ Đã nạp thành công bài học: "${lesson.title}" (Lớp ${lesson.grade} - ${lesson.subject})!`, isError: false });
        setCodeToDownload('');
      }
    } catch (err: any) {
      setDownloadMsg({ text: 'Lỗi khi tải từ Cloud: ' + (err?.message || 'Không xác định'), isError: true });
    } finally {
      setDownloadLoading(false);
    }
  };

  // Chia sẻ bài học lên Cloud và nhận mã ngắn
  const handleShareLesson = async (lesson: Lesson) => {
    setSharingLessonId(lesson.id);
    try {
      const result = await firebaseSyncService.publishLessonWithShortCode(lesson, 'Thầy Cô');
      if (result.success) {
        setSharedCodeMap(prev => ({ ...prev, [lesson.id]: result.shortCode }));
        audioService.playSuccess();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(result.shortCode).catch(() => {});
        }
        setFormMessage({ text: `Đã tạo mã đề ${result.shortCode} cho bài học "${lesson.title}".`, isError: false });
      } else {
        setFormMessage({ text: 'Không thể chia sẻ bài học lên Cloud, vui lòng thử lại!', isError: true });
      }
    } catch (err: any) {
      setFormMessage({ text: 'Lỗi: ' + (err?.message || 'Không xác định'), isError: true });
    } finally {
      setSharingLessonId(null);
    }
  };

  // Tải file mẫu JSON cho giáo viên
  const handleDownloadTemplate = () => {
    const sample: Lesson = {
      id: 'custom_sample_1',
      title: 'Đề Thi Thử Học Kỳ - Môn Toán',
      grade: 3,
      subject: 'math',
      unitId: 'unit_custom_sample',
      unitTitle: 'Chương: Ôn tập giáo viên',
      icon: '📐',
      difficulty: 2,
      passingScore: 60,
      xpReward: 80,
      starsRequiredToUnlock: 0,
      description: 'Đề thi trắc nghiệm do tổ chuyên môn khối 3 biên soạn.',
      funFact: 'Luyện tập đều đặn mỗi ngày sẽ giúp điểm số tăng vượt bậc!',
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          prompt: '7 × 8 bằng bao nhiêu?',
          audioPromptText: 'Bảy nhân tám bằng bao nhiêu hỡi bé?',
          options: [
            { id: 'a', text: '54', isCorrect: false },
            { id: 'b', text: '56', isCorrect: true },
            { id: 'c', text: '58', isCorrect: false }
          ]
        },
        {
          id: 'q2',
          type: 'true_false',
          prompt: 'Một ngày có 24 giờ — Đúng hay Sai?',
          options: [
            { id: 't', text: '✅ Đúng', isCorrect: true },
            { id: 'f', text: '❌ Sai', isCorrect: false }
          ]
        },
        {
          id: 'q3',
          type: 'fill_in_the_blank',
          prompt: 'Số liền trước của 100 là số: ___',
          interactiveData: { blanks: ['99'] }
        }
      ]
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sample, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'mau_de_thi_giao_vien.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Nhập đề từ JSON
  const handleImportJson = () => {
    try {
      if (!importJsonText.trim()) {
        setImportMessage({ text: 'Vui lòng dán nội dung JSON trước khi nhập.', isError: true });
        return;
      }

      const parsed = JSON.parse(importJsonText);
      const lessonsToImport: Lesson[] = Array.isArray(parsed) ? parsed : [parsed];

      if (lessonsToImport.length === 0) {
        throw new Error('File JSON không chứa bài học nào.');
      }

      lessonsToImport.forEach((l, index) => {
        if (!isValidLessonImport(l)) {
          throw new Error(`Bài học ở vị trí ${index + 1} không hợp lệ hoặc thiếu dữ liệu bắt buộc.`);
        }
      });

      // Chỉ lưu sau khi cả gói hợp lệ để lỗi ở bài cuối không làm nhập dở dang.
      const importedAt = Date.now();
      lessonsToImport.forEach((lesson, index) => {
        const id = lesson.id?.trim()
          || `imported_${importedAt}_${index}_${Math.random().toString(36).substring(2, 6)}`;
        onSaveLesson({ ...lesson, id });
      });

      audioService.playSuccess();
      setImportMessage({ text: `✓ Đã nạp thành công ${lessonsToImport.length} bài học vào hệ thống!`, isError: false });
      setImportJsonText('');
      setTimeout(() => setActiveTab('manage'), 1200);
    } catch (err: any) {
      audioService.playWrong();
      setImportMessage({ text: 'Lỗi định dạng JSON: ' + (err?.message || 'Không xác định'), isError: true });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="parent-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button className="btn-close-modal" onClick={onClose}>
          ✕
        </button>

        <div className="dashboard-header" style={{ marginBottom: '16px' }}>
          <h2>🎓 Cổng Soạn Đề Cho Giáo Viên & Quản Lý</h2>
          <span className="safe-tag">Tự Động Xuất Bản Vào Ứng Dụng</span>
        </div>

        {/* Thanh chuyển tab */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #edf2f7', marginBottom: '20px' }}>
          <button
            style={{
              padding: '10px 16px',
              background: activeTab === 'create' ? '#FFF5EB' : 'transparent',
              color: activeTab === 'create' ? '#E67E22' : '#718096',
              border: 'none',
              borderBottom: activeTab === 'create' ? '3px solid #E67E22' : 'none',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('create')}
          >
            ✏️ Soạn Bài Trực Quan (Form)
          </button>
          <button
            style={{
              padding: '10px 16px',
              background: activeTab === 'import' ? '#FFF5EB' : 'transparent',
              color: activeTab === 'import' ? '#E67E22' : '#718096',
              border: 'none',
              borderBottom: activeTab === 'import' ? '3px solid #E67E22' : 'none',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('import')}
          >
            📥 Nhập Đề Nhanh (JSON / File)
          </button>
          <button
            style={{
              padding: '10px 16px',
              background: activeTab === 'manage' ? '#FFF5EB' : 'transparent',
              color: activeTab === 'manage' ? '#E67E22' : '#718096',
              border: 'none',
              borderBottom: activeTab === 'manage' ? '3px solid #E67E22' : 'none',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('manage')}
          >
            📋 Quản Lý Đề Đã Tạo ({customLessons.length})
          </button>
        </div>

        {/* TAB 1: SOẠN BÀI TRỰC QUAN */}
        {activeTab === 'create' && (
          <div>
            {formMessage && (
              <div
                style={{
                  marginBottom: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: formMessage.isError ? '#FEE2E2' : '#DCFCE7',
                  color: formMessage.isError ? '#B91C1C' : '#166534'
                }}
              >
                {formMessage.text}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Khối Lớp:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value) as Grade)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value={1}>Lớp 1</option>
                  <option value={2}>Lớp 2</option>
                  <option value={3}>Lớp 3</option>
                  <option value={4}>Lớp 4</option>
                  <option value={5}>Lớp 5</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Môn Học:</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectId)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="math">🧮 Toán Học</option>
                  <option value="vietnamese">📖 Tiếng Việt</option>
                  <option value="english">🌍 Tiếng Anh</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Icon Emoji:</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  placeholder="Ví dụ: 🌟, 🍎, 📐"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Độ Khó:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value) as DifficultyLevel)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value={1}>⭐ Cấp 1 (Dễ)</option>
                  <option value={2}>⭐⭐ Cấp 2 (Vừa)</option>
                  <option value={3}>⭐⭐⭐ Cấp 3 (Khó)</option>
                  <option value={4}>⭐⭐⭐⭐ Cấp 4 (Siêu Khó)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Tiêu Đề Bài Học *:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Luyện Tập Bảng Cửu Chương 7 & 8"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Tên Chương / Unit:</label>
                <input
                  type="text"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Số Sao Cần Để Mở Bài:</label>
                <input
                  type="number"
                  min={0}
                  value={starsRequired}
                  onChange={(e) => setStarsRequired(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Mô Tả Bài Học & Lời Khuyên (funFact):</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả nội dung cho học sinh..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px' }}
              />
              <input
                type="text"
                value={funFact}
                onChange={(e) => setFunFact(e.target.value)}
                placeholder="Góc thú vị xuất hiện khi bé hoàn thành bài..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* KHU VỰC THÊM CÂU HỎI VỚI LIVE PREVIEW */}
            <div style={{ background: '#F8FAFC', border: '2px dashed #CBD5E1', borderRadius: '16px', padding: '18px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#1E293B' }}>
                  ➕ Soạn & Thêm Câu Hỏi ({questions.length} câu trong bài)
                </h3>
                <span style={{ fontSize: '12px', color: '#4F46E5', background: '#EEF2FF', padding: '4px 10px', borderRadius: '999px', fontWeight: 700 }}>
                  👁️ Khung Xem Trước Trực Quan Thời Gian Thực
                </span>
              </div>

              <div className="teacher-creator-split">
                {/* CỘT TRÁI: FORM NHẬP LIỆU CÂU HỎI */}
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Dạng Câu Hỏi:</label>
                      <select
                        value={qType}
                        onChange={(e) => {
                          setQType(e.target.value as QuestionType);
                          setPreviewUserChoice(null);
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="multiple_choice">Trắc nghiệm (A, B, C)</option>
                        <option value="true_false">Đúng hay Sai</option>
                        <option value="fill_in_the_blank">Điền vào chỗ trống</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Đề Bài *:</label>
                      <input
                        type="text"
                        value={qPrompt}
                        onChange={(e) => setQPrompt(e.target.value)}
                        placeholder="Ví dụ: 9 nhân 6 bằng bao nhiêu?"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Giọng Đọc Mẫu (tùy chọn):</label>
                      <input
                        type="text"
                        value={qAudio}
                        onChange={(e) => setQAudio(e.target.value)}
                        placeholder="Câu đọc rõ chữ cho máy đọc..."
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Gợi Ý Cho Bé (hint):</label>
                      <input
                        type="text"
                        value={qHint}
                        onChange={(e) => setQHint(e.target.value)}
                        placeholder="Gợi ý khi bé chọn sai..."
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  {/* DẠNG TRẮC NGHIỆM */}
                  {qType === 'multiple_choice' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="radio" checked={correctOpt === 'a'} onChange={() => setCorrectOpt('a')} />
                        <span style={{ fontWeight: 700 }}>A:</span>
                        <input
                          type="text"
                          placeholder="Đáp án A"
                          value={optA}
                          onChange={(e) => setOptA(e.target.value)}
                          style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="radio" checked={correctOpt === 'b'} onChange={() => setCorrectOpt('b')} />
                        <span style={{ fontWeight: 700 }}>B:</span>
                        <input
                          type="text"
                          placeholder="Đáp án B"
                          value={optB}
                          onChange={(e) => setOptB(e.target.value)}
                          style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="radio" checked={correctOpt === 'c'} onChange={() => setCorrectOpt('c')} />
                        <span style={{ fontWeight: 700 }}>C:</span>
                        <input
                          type="text"
                          placeholder="Đáp án C (tùy chọn)"
                          value={optC}
                          onChange={(e) => setOptC(e.target.value)}
                          style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>Tích vào nút tròn ở đáp án đúng.</span>
                    </div>
                  )}

                  {/* DẠNG ĐÚNG SAI */}
                  {qType === 'true_false' && (
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>Đáp án đúng:</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input type="radio" checked={tfCorrect} onChange={() => setTfCorrect(true)} />
                        ✅ Đúng
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input type="radio" checked={!tfCorrect} onChange={() => setTfCorrect(false)} />
                        ❌ Sai
                      </label>
                    </div>
                  )}

                  {/* DẠNG ĐIỀN TỪ */}
                  {qType === 'fill_in_the_blank' && (
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Đáp Án Đúng Cho Chỗ Trống:</label>
                      <input
                        type="text"
                        value={blankAnswer}
                        onChange={(e) => setBlankAnswer(e.target.value)}
                        placeholder="Ví dụ: 54 hoặc chín"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  )}

                  {/* LỜI GIẢI TỪNG BƯỚC (STEP-BY-STEP SOLUTION) */}
                  <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      📖 Lời Giải Chi Tiết Từng Bước (Tùy chọn):
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input
                        type="text"
                        value={step1}
                        onChange={(e) => setStep1(e.target.value)}
                        placeholder="Bước 1: Xác định dữ kiện bài toán..."
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        value={step2}
                        onChange={(e) => setStep2(e.target.value)}
                        placeholder="Bước 2: Áp dụng công thức / quy tắc..."
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        value={step3}
                        onChange={(e) => setStep3(e.target.value)}
                        placeholder="Bước 3: Kết luận đáp số..."
                        style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <button
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      background: '#3B82F6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                    }}
                    onClick={handleAddQuestion}
                  >
                    ➕ Thêm Câu Hỏi Này Vào Bài
                  </button>
                </div>

                {/* CỘT PHẢI: KHUNG XEM TRƯỚC TRỰC QUAN (LIVE PREVIEW) */}
                <div className="teacher-preview-pane">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="teacher-preview-badge">👁️ Khung Xem Trước</span>
                    <button
                      onClick={() => {
                        const text = qAudio.trim() || qPrompt.trim() || 'Thầy cô hãy nhập đề bài để thử giọng đọc.';
                        audioService.playPop();
                        if (subject === 'english') {
                          audioService.speakEnglish(text);
                        } else {
                          audioService.speakVietnamese(text);
                        }
                      }}
                      style={{
                        background: '#EFF6FF',
                        border: '1px solid #93C5FD',
                        color: '#1D4ED8',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                      title="Bấm để nghe thử phát âm đề bài"
                    >
                      🔊 Thử Giọng Đọc
                    </button>
                  </div>

                  <div className="preview-card-box">
                    <div className="preview-prompt">
                      {qPrompt.trim() ? qPrompt.trim() : 'Đề bài câu hỏi sẽ hiển thị ở đây...'}
                    </div>

                    {/* PREVIEW TRẮC NGHIỆM */}
                    {qType === 'multiple_choice' && (
                      <div className="preview-options-list">
                        {[
                          { id: 'a', text: optA.trim() || 'Lựa chọn A', isCorrect: correctOpt === 'a' },
                          { id: 'b', text: optB.trim() || 'Lựa chọn B', isCorrect: correctOpt === 'b' },
                          ...(optC.trim() ? [{ id: 'c', text: optC.trim(), isCorrect: correctOpt === 'c' }] : [])
                        ].map((opt) => {
                          const isSelected = previewUserChoice === opt.id;
                          return (
                            <div
                              key={opt.id}
                              className={`preview-opt-btn ${opt.isCorrect ? 'correct-mark' : ''}`}
                              onClick={() => {
                                audioService.playPop();
                                setPreviewUserChoice(opt.id);
                              }}
                            >
                              <span style={{ fontWeight: 800, color: opt.isCorrect ? '#16A34A' : '#64748B' }}>
                                {opt.id.toUpperCase()}:
                              </span>
                              <span style={{ flex: 1 }}>{opt.text}</span>
                              {opt.isCorrect && <span style={{ color: '#16A34A', fontWeight: 800 }}>✓ Đúng</span>}
                              {isSelected && !opt.isCorrect && <span style={{ color: '#DC2626' }}>● Chọn thử</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* PREVIEW ĐÚNG SAI */}
                    {qType === 'true_false' && (
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                        <div
                          className={`preview-opt-btn ${tfCorrect ? 'correct-mark' : ''}`}
                          style={{ flex: 1, justifyContent: 'center' }}
                          onClick={() => {
                            audioService.playPop();
                            setPreviewUserChoice('t');
                          }}
                        >
                          👍 Đúng {tfCorrect && '✓'}
                        </div>
                        <div
                          className={`preview-opt-btn ${!tfCorrect ? 'correct-mark' : ''}`}
                          style={{ flex: 1, justifyContent: 'center' }}
                          onClick={() => {
                            audioService.playPop();
                            setPreviewUserChoice('f');
                          }}
                        >
                          👎 Sai {!tfCorrect && '✓'}
                        </div>
                      </div>
                    )}

                    {/* PREVIEW ĐIỀN TỪ */}
                    {qType === 'fill_in_the_blank' && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>Ô nhập của học sinh:</div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            disabled
                            placeholder="Học sinh nhập đáp án tại đây..."
                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px dashed #94A3B8', background: '#F1F5F9' }}
                          />
                          <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                            Đáp án: {blankAnswer.trim() || '...'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* PREVIEW GỢI Ý */}
                    {qHint.trim() && (
                      <div className="preview-hint-box">
                        💡 <strong>Gợi ý:</strong> {qHint.trim()}
                      </div>
                    )}

                    {/* PREVIEW LỜI GIẢI TỪNG BƯỚC */}
                    {(step1.trim() || step2.trim() || step3.trim()) && (
                      <div className="preview-steps-box">
                        <div
                          onClick={() => setShowPreviewSteps(!showPreviewSteps)}
                          style={{ cursor: 'pointer', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <span>📖 Xem cách giải từng bước ({[step1, step2, step3].filter(s => s.trim()).length} bước)</span>
                          <span>{showPreviewSteps ? '▲' : '▼'}</span>
                        </div>
                        {showPreviewSteps && (
                          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {step1.trim() && <div><strong>Bước 1:</strong> {step1.trim()}</div>}
                            {step2.trim() && <div><strong>Bước 2:</strong> {step2.trim()}</div>}
                            {step3.trim() && <div><strong>Bước 3:</strong> {step3.trim()}</div>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* DANH SÁCH CÂU HỎI ĐÃ SOẠN */}
            {questions.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>Danh Sách Câu Hỏi Trong Bài:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <strong>Câu {idx + 1}:</strong> {q.prompt}
                        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#64748B' }}>({q.type})</span>
                      </div>
                      <button
                        style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}
                        onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              style={{
                width: '100%',
                padding: '14px',
                background: '#10AC84',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 172, 132, 0.3)'
              }}
              onClick={handleSaveLesson}
            >
              🚀 Xuất Bản Bài Học Này Vào Ứng Dụng
            </button>
          </div>
        )}

        {/* TAB 2: NHẬP ĐỀ NHANH (JSON / FILE / MÃ CLOUD) */}
        {activeTab === 'import' && (
          <div>
            {/* Thẻ Nhập Mã Đề Cloud */}
            <div
              style={{
                background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                border: '2px dashed #6366F1',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>☁️</span>
                <strong style={{ color: '#3730A3', fontSize: '16px' }}>Tải Đề Bằng Mã Đề Cloud (Từ Thầy/Cô Khác)</strong>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#4338CA' }}>
                Nhập mã đề do giáo viên hoặc nhà trường chia sẻ (Ví dụ: <strong>DE-8921</strong>) để tải trực tiếp vào kho bài học:
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Nhập mã đề (Ví dụ: DE-8921)..."
                  value={codeToDownload}
                  onChange={(e) => setCodeToDownload(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #C7D2FE',
                    fontSize: '15px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                />
                <button
                  onClick={handleDownloadByCode}
                  disabled={downloadLoading}
                  style={{
                    padding: '10px 18px',
                    background: '#4F46E5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {downloadLoading ? 'Đang tải...' : '📥 Tải Đề Về'}
                </button>
              </div>
              {downloadMsg && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    background: downloadMsg.isError ? '#FEE2E2' : '#DCFCE7',
                    color: downloadMsg.isError ? '#B91C1C' : '#15803D'
                  }}
                >
                  {downloadMsg.text}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#475569' }}>
                Hoặc dán mã JSON đề thi / tải file đề mẫu để biên soạn:
              </p>
              <button
                style={{ padding: '6px 12px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                onClick={handleDownloadTemplate}
              >
                📥 Tải File Đề Mẫu (.json)
              </button>
            </div>

            <textarea
              rows={8}
              placeholder="Dán nội dung JSON bài học vào đây..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontFamily: 'monospace',
                fontSize: '13px',
                marginBottom: '12px',
                boxSizing: 'border-box'
              }}
            />

            {importMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  background: importMessage.isError ? '#FEE2E2' : '#DCFCE7',
                  color: importMessage.isError ? '#B91C1C' : '#15803D'
                }}
              >
                {importMessage.text}
              </div>
            )}

            <button
              style={{
                width: '100%',
                padding: '12px',
                background: '#4834D4',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={handleImportJson}
            >
              Nạp Bộ Đề JSON Vào Hệ Thống
            </button>
          </div>
        )}

        {/* TAB 3: QUẢN LÝ ĐỀ ĐÃ TẠO */}
        {activeTab === 'manage' && (
          <div>
            {customLessons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>📭</span>
                <p>Chưa có bài học tự tạo nào. Thầy cô hãy chuyển sang tab "Soạn Bài Trực Quan" để tạo bài đầu tiên nhé!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {customLessons.map((lesson) => {
                  const shareCode = sharedCodeMap[lesson.id];
                  return (
                    <div
                      key={lesson.id}
                      style={{
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#ffffff',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '24px' }}>{lesson.icon}</span>
                          <strong style={{ fontSize: '16px', color: '#1E293B' }}>{lesson.title}</strong>
                          <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 }}>
                            Lớp {lesson.grade} - {lesson.subject}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                          {lesson.questions.length} câu hỏi • Chương: {lesson.unitTitle} • Cần {lesson.starsRequiredToUnlock}⭐
                        </p>
                        {shareCode && (
                          <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', border: '1px solid #FCD34D', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', color: '#92400E', fontWeight: 600 }}>
                            <span>🔑 Mã Đề Cloud:</span>
                            <code style={{ fontSize: '13px', fontWeight: 800, color: '#B45309' }}>{shareCode}</code>
                            <span>(Đã copy vào bộ nhớ tạm để gửi học sinh)</span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          style={{
                            padding: '6px 12px',
                            background: '#4F46E5',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onClick={() => handleShareLesson(lesson)}
                          disabled={sharingLessonId === lesson.id}
                          title="Tạo mã đề gửi cho học sinh làm bài trên thiết bị khác"
                        >
                          {sharingLessonId === lesson.id ? '⏳...' : '☁️ Lấy Mã Chia Sẻ'}
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            background: '#10AC84',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                          onClick={() => {
                            onTestLesson(lesson);
                            onClose();
                          }}
                        >
                          🎮 Học Thử
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                          onClick={() => {
                            if (confirm(`Thầy cô có chắc chắn muốn xóa bài "${lesson.title}" không?`)) {
                              onDeleteLesson(lesson.id);
                            }
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
