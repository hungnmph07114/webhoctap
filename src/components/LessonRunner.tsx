import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Lesson, Question, OrderItem } from '../types/curriculum';
import { audioService } from '../services/audioService';
import { createLessonReplayReset } from '../services/sessionState';
import { isAcceptedShortAnswer } from '../services/answerValidation';
import { storageService } from '../services/storageService';
import { WritingCanvas } from './WritingCanvas';
import { ScratchpadCanvas } from './ScratchpadCanvas';
import { FractionVisualizer } from './FractionVisualizer';

interface LessonRunnerProps {
  lesson: Lesson;
  previousWrongIds?: string[];
  onExit: () => void;
  onComplete: (score: number, stars: number, wrongIds?: string[], masteredIds?: string[]) => number;
}

export const LessonRunner: React.FC<LessonRunnerProps> = ({
  lesson,
  previousWrongIds = [],
  onExit,
  onComplete
}) => {
  const [filterWrongOnly, setFilterWrongOnly] = useState<boolean>(false);

  // Bộ câu hỏi thực tế: toàn bộ bài hoặc chỉ các câu từng làm sai
  const activeQuestions: Question[] = useMemo(
    () =>
      filterWrongOnly && previousWrongIds.length > 0
        ? lesson.questions.filter(q => previousWrongIds.includes(q.id))
        : lesson.questions,
    [filterWrongOnly, previousWrongIds, lesson.questions]
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const correctCountRef = useRef(0);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);
  // Combo system
  const [comboCount, setComboCount] = useState(0);
  const comboCountRef = useRef(0);
  // Slide animation
  const [slideClass, setSlideClass] = useState('question-slide-in');
  // Bảng nháp điện tử & Lời giải chi tiết
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [showExplanationSteps, setShowExplanationSteps] = useState(false);

  // Bộ nhớ theo dõi câu làm đúng & câu làm sai trong phiên này
  const currentSessionMasteredIds = useRef<string[]>([]);
  const currentSessionWrongIds = useRef<string[]>([]);
  const earnedPointsRef = useRef(0);

  // States cho các dạng bài khác nhau
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [basketItems, setBasketItems] = useState<string[]>([]);
  const [blankInput, setBlankInput] = useState('');
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [rightColumnOrder, setRightColumnOrder] = useState<{ id: string; text: string; emoji?: string }[]>([]);

  const question: Question | undefined = activeQuestions[currentIdx] || activeQuestions[0];
  const totalQuestions = activeQuestions.length;
  const totalPoints = activeQuestions.reduce((sum, activeQuestion) => sum + (activeQuestion.points ?? 10), 0);
  const progressPercent = totalQuestions > 0 ? Math.round(((currentIdx + 1) / totalQuestions) * 100) : 0;
  const advanceTimeoutRef = useRef<number | null>(null);

  const resetSessionState = () => {
    const defaults = createLessonReplayReset();
    setFilterWrongOnly(defaults.filterWrongOnly);
    setCurrentIdx(defaults.currentIdx);
    setAnsweredState(defaults.answeredState);
    setShowHint(defaults.showHint);
    setCorrectCount(defaults.correctCount);
    correctCountRef.current = defaults.correctCount;
    setIsFinished(defaults.isFinished);
    setEarnedStars(0);
    setSelectedOptionId(defaults.selectedOptionId);
    setSelectedOptionIds([]);
    setBasketItems(defaults.basketItems);
    setBlankInput(defaults.blankInput);
    setMatchedPairIds(defaults.matchedPairIds);
    setSelectedLeftId(defaults.selectedLeftId);
    setCurrentOrderItems(defaults.currentOrderItems);
    setRightColumnOrder(defaults.rightColumnOrder);
    currentSessionMasteredIds.current = [];
    currentSessionWrongIds.current = [];
    earnedPointsRef.current = 0;
    setComboCount(0);
    comboCountRef.current = 0;
    setSlideClass('question-slide-in');
    setIsScratchpadOpen(false);
    setShowExplanationSteps(false);
    if (advanceTimeoutRef.current) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    resetSessionState();
  }, [lesson.id, previousWrongIds.join(',')]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  // Khởi tạo state khi chuyển câu hỏi
  useEffect(() => {
    setSelectedOptionId(null);
    setSelectedOptionIds([]);
    setBasketItems([]);
    setBlankInput('');
    setMatchedPairIds([]);
    setSelectedLeftId(null);
    setShowHint(false);
    setAnsweredState('idle');

    if (!question) return;

    // Chuẩn bị cho dạng ordering
    if (question.type === 'ordering' && question.interactiveData?.orderItems) {
      // Đảo thứ tự nhẹ nếu ban đầu đã đúng thứ tự để bé thử thách sắp xếp
      const items = [...question.interactiveData.orderItems];
      const isAlreadySorted = items.every((it, idx) => it.correctIndex === idx);
      if (isAlreadySorted && items.length > 1) {
        // Hoán đổi 2 phần tử đầu
        const temp = items[0];
        items[0] = items[1];
        items[1] = temp;
      }
      setCurrentOrderItems(items);
    }

    // Chuẩn bị cho dạng word_match
    if (question.type === 'word_match' && question.interactiveData?.matchingPairs) {
      const rightItems = question.interactiveData.matchingPairs.map(p => ({
        id: p.id,
        text: p.right,
        emoji: p.rightEmoji
      }));
      // Xáo trộn cột bên phải
      const shuffled = [...rightItems].sort(() => Math.random() - 0.5);
      setRightColumnOrder(shuffled);
    }
  }, [currentIdx, question]);

  // Kéo thả quả táo / đồ vật vào giỏ
  const handleToggleBasketItem = (itemId: string) => {
    audioService.playPop();
    if (basketItems.includes(itemId)) {
      setBasketItems(basketItems.filter(id => id !== itemId));
    } else {
      setBasketItems([...basketItems, itemId]);
    }
  };

  // Di chuyển thứ tự trong dạng ordering
  const handleMoveOrderItem = (index: number, direction: 'up' | 'down') => {
    audioService.playPop();
    const newItems = [...currentOrderItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setCurrentOrderItems(newItems);
  };

  // Xử lý nối cặp trong word_match
  const handleSelectLeftPair = (pairId: string) => {
    if (matchedPairIds.includes(pairId)) return;
    audioService.playPop();
    setSelectedLeftId(pairId);
  };

  const handleSelectRightPair = (rightId: string) => {
    if (matchedPairIds.includes(rightId)) return;
    if (!selectedLeftId) {
      audioService.playPop();
      return;
    }

    if (selectedLeftId === rightId) {
      // Nối đúng!
      audioService.playSuccess();
      const updated = [...matchedPairIds, rightId];
      setMatchedPairIds(updated);
      setSelectedLeftId(null);

      // Nếu đã nối hết tất cả các cặp -> Hoàn thành câu hỏi!
      const totalPairs = question.interactiveData?.matchingPairs?.length || 0;
      if (updated.length >= totalPairs && totalPairs > 0) {
        handleCheckAnswer(true);
      }
    } else {
      // Nối sai
      audioService.playWrong();
      setSelectedLeftId(null);
    }
  };

  // Kiểm tra tính đúng đắn của câu trả lời
  const handleCheckAnswer = (overrideCorrect?: boolean) => {
    if (!question) return;

    let isCorrect = false;

    if (overrideCorrect !== undefined) {
      isCorrect = overrideCorrect;
    } else if (question.type === 'multi_select') {
      const correctIds = (question.options || []).filter((option) => option.isCorrect).map((option) => option.id).sort();
      const chosenIds = [...selectedOptionIds].sort();
      isCorrect = correctIds.length > 0
        && correctIds.length === chosenIds.length
        && correctIds.every((id, index) => id === chosenIds[index]);
    } else if (question.type === 'multiple_choice' || question.type === 'image_choice' || question.type === 'true_false') {
      const chosen = question.options?.find(o => o.id === selectedOptionId);
      isCorrect = chosen?.isCorrect || false;
    } else if (question.type === 'fill_in_the_blank') {
      const expectedAnswers = [
        ...(question.interactiveData?.blanks || []),
        ...(question.correctAnswer === undefined ? [] : [String(question.correctAnswer)])
      ];
      isCorrect = isAcceptedShortAnswer(blankInput, expectedAnswers);
    } else if (question.type === 'drag_and_drop') {
      const targetCount = question.interactiveData?.basketTargetCount || 0;
      isCorrect = basketItems.length === targetCount;
    } else if (question.type === 'ordering') {
      isCorrect = currentOrderItems.every((item, idx) => item.correctIndex === idx);
    } else if (question.type === 'word_match') {
      const totalPairs = question.interactiveData?.matchingPairs?.length || 0;
      isCorrect = matchedPairIds.length === totalPairs && totalPairs > 0;
    }

    if (isCorrect) {
      audioService.playSuccess();
      setAnsweredState('correct');
      const wasWrong = currentSessionWrongIds.current.includes(question.id);
      const nextCount = correctCountRef.current + 1;
      correctCountRef.current = nextCount;
      setCorrectCount(nextCount);
      const basePoints = question.points ?? 10;
      // Lần sửa đúng chỉ nhận một nửa điểm câu hỏi. Nếu thử sai nhiều lần,
      // điểm vẫn chỉ được cộng một lần khi cuối cùng trả lời đúng.
      const pointsToAdd = wasWrong ? Math.round(basePoints * 0.5) : basePoints;
      earnedPointsRef.current += pointsToAdd;

      // Combo tracking
      const newCombo = comboCountRef.current + 1;
      comboCountRef.current = newCombo;
      setComboCount(newCombo);

      if (!currentSessionMasteredIds.current.includes(question.id)) {
        currentSessionMasteredIds.current.push(question.id);
      }

      const particleCount = newCombo >= 3 ? 90 : 55;
      confetti({
        particleCount,
        spread: newCombo >= 3 ? 90 : 60,
        origin: { y: 0.7 }
      });

      if (advanceTimeoutRef.current) {
        window.clearTimeout(advanceTimeoutRef.current);
      }

      advanceTimeoutRef.current = window.setTimeout(() => {
        advanceToNextQuestion();
      }, 1300);
    } else {
      audioService.playWrong();
      setAnsweredState('wrong');
      setShowHint(true);
      // Reset combo on wrong
      comboCountRef.current = 0;
      setComboCount(0);

      if (!currentSessionWrongIds.current.includes(question.id)) {
        currentSessionWrongIds.current.push(question.id);
      }
    }
  };

  const advanceToNextQuestion = () => {
    setAnsweredState('idle');
    setShowHint(false);
    setShowExplanationSteps(false);
    setSlideClass('');
    // Trigger slide-in animation
    window.setTimeout(() => setSlideClass('question-slide-in'), 20);

    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx(prev => prev + 1);
    } else {
      finishLesson();
    }
  };

  const finishLesson = () => {
    if (isFinished) return;

    const passingScore = lesson.passingScore ?? 60;
    const score = totalPoints > 0 ? Math.round((earnedPointsRef.current / totalPoints) * 100) : 0;
    let stars = 0;
    if (score >= 90) stars = 3;
    else if (score >= 75) stars = 2;
    else if (score >= passingScore) stars = 1;

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });
    audioService.playCoin();
    const reward = onComplete(score, stars, currentSessionWrongIds.current, currentSessionMasteredIds.current);
    setEarnedStars(reward);
    setIsFinished(true);
  };

  // Màn hình Kết Thúc & Tổng Kết Bài Học
  if (isFinished) {
    const passingScore = lesson.passingScore ?? 60;
    const finalScore = totalPoints > 0 ? Math.round((earnedPointsRef.current / totalPoints) * 100) : 0;
    let stars = 0;
    if (finalScore >= 90) stars = 3;
    else if (finalScore >= 75) stars = 2;
    else if (finalScore >= passingScore) stars = 1;

    const isPassed = finalScore >= passingScore;
    const gradePill = finalScore >= 90
      ? { cls: 'excellent', label: '🏆 Xuất sắc!' }
      : isPassed
      ? { cls: 'good', label: '👍 Đạt chuẩn bài học!' }
      : { cls: 'needs-work', label: `💪 Cần đạt ${passingScore}% để qua bài!` };

    const diffMultiplier = lesson.difficulty === 4 ? 2 : lesson.difficulty === 3 ? 1.5 : lesson.difficulty === 2 ? 1.2 : 1;
    const earnedXp = Math.round((lesson.xpReward ? (lesson.xpReward * (finalScore / 100)) : (finalScore * 0.5)) * diffMultiplier);

    return (
      <div className="runner-overlay">
        <div className="finish-modal-card">
          <div className="finish-trophy">🏆</div>
          <h2 className="finish-title">Hoan Hô Bé Đã Hoàn Thành!</h2>
          <p className="finish-subtitle">{lesson.title}</p>

          <div className="finish-stars-display">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`big-star ${s <= stars ? 'active' : ''}`}>
                ★
              </span>
            ))}
          </div>

          {/* Grade pill */}
          <div className="finish-grade-comparison">
            <span className={`finish-grade-pill ${gradePill.cls}`}>{gradePill.label}</span>
          </div>

          <div className="finish-score-pill">
            Điểm số: <strong>{finalScore}/100</strong> (Đúng {correctCount}/{totalQuestions} câu)
          </div>

          <div className="finish-rewards-box">
            <div className="reward-item">
                <span>⭐ +{earnedStars} Sao</span>
            </div>
            <div className="reward-item">
              <span>🦉 +{earnedXp} XP Cho Bibo {diffMultiplier > 1 ? `(x${diffMultiplier})` : ''}</span>
            </div>
            {finalScore === 100 && (
              <div className="reward-item">
                <span>💎 +1 Kim Cương</span>
              </div>
            )}
          </div>

          {!isPassed && (
            <div style={{ marginTop: '10px', padding: '10px 14px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '16px', color: '#92400E', fontSize: '13px', textAlign: 'center' }}>
              ⚠️ Điểm chuẩn vượt qua bài này là <strong>{passingScore}%</strong>. Bé hãy ôn lại để nâng cao thành tích nhé!
            </div>
          )}


          {lesson.funFact && (
            <div className="finish-fun-fact">
              <span className="fun-fact-icon">💡</span>
              <p><strong>Góc thú vị:</strong> {lesson.funFact}</p>
            </div>
          )}

          <div className="finish-actions">
            <button
              className="btn-finish-replay"
              onClick={() => {
                audioService.playPop();
                resetSessionState();
              }}
            >
              🔄 Học Lại Bài Này
            </button>
            <button
              className="btn-finish-exit"
              onClick={() => {
                audioService.playPop();
                onExit();
              }}
            >
              🎉 Tiếp Tục Bài Mới
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Nút kiểm tra có sẵn sàng bấm không
  const isCheckDisabled = () => {
    if (!question) return true;
    if (answeredState === 'correct') return true;
    if (question.type === 'multiple_choice' || question.type === 'image_choice' || question.type === 'true_false') {
      return !selectedOptionId;
    }
    if (question.type === 'multi_select') {
      return selectedOptionIds.length === 0;
    }
    if (question.type === 'fill_in_the_blank') {
      return !blankInput.trim();
    }
    if (question.type === 'drag_and_drop') {
      return basketItems.length === 0;
    }
    if (question.type === 'word_match') {
      const totalPairs = question.interactiveData?.matchingPairs?.length || 0;
      return matchedPairIds.length < totalPairs;
    }
    if (question.type === 'ordering') {
      return false;
    }
    return false;
  };

  if (!question) {
    return (
      <div className="runner-overlay">
        <div className="runner-card">
          <div className="finish-modal-card">
            <div className="finish-trophy">📚</div>
            <h2 className="finish-title">Không có câu hỏi nào để luyện tập</h2>
            <p className="finish-subtitle">Bài học hiện chưa có dữ liệu hoặc danh sách câu hỏi đã lọc rỗng.</p>
            <div className="finish-actions">
              <button className="btn-finish-exit" onClick={onExit}>Quay lại</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="runner-overlay">
      <div className="runner-card">
        {/* Topbar: Nút thoát, tiến độ, âm thanh */}
        <div className="runner-topbar">
          <button className="btn-exit-runner" onClick={onExit} title="Thoát ra danh sách bài">
            ✕ Thoát
          </button>
          <div className="runner-progress-bar-wrap">
            <div
              className={`runner-progress-fill ${comboCount >= 5 ? 'combo-3' : comboCount >= 3 ? 'combo-2' : comboCount >= 1 ? 'combo-1' : ''}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="runner-step-text">
            {currentIdx + 1}/{totalQuestions}
          </span>
          <button
            onClick={() => {
              audioService.playPop();
              setIsScratchpadOpen(true);
            }}
            className="btn-toggle-scratchpad"
            style={{
              background: '#EFF6FF',
              color: '#2563EB',
              border: '1px solid #BFDBFE',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Mở Bảng Nháp Điện Tử để tính toán trực tiếp"
          >
            ✏️ Bảng Nháp
          </button>
          <button
            className="btn-toggle-sound-small"
            title={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            onClick={() => {
              const next = !soundMuted;
              setSoundMuted(next);
              audioService.setSoundEnabled(!next);
            }}
          >
            {soundMuted ? '🔇' : '🔊'}
          </button>
        </div>

        {/* Gợi ý mở bảng nháp cho môn Toán Lớp 3-5 */}
        {lesson.subject === 'math' && lesson.grade >= 3 && (
          <div
            className="math-scratchpad-tip"
            onClick={() => {
              audioService.playPop();
              setIsScratchpadOpen(true);
            }}
            style={{
              cursor: 'pointer',
              fontSize: '12px',
              color: '#1D4ED8',
              background: '#EFF6FF',
              border: '1px dashed #93C5FD',
              padding: '6px 12px',
              borderRadius: '10px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}
          >
            <span>💡 Mẹo nhỏ: Bé hãy bấm vào <strong>✏️ Bảng Nháp</strong> ở trên để vẽ nháp phép tính trước khi chọn đáp án nhé!</span>
            <span style={{ fontWeight: 800, textDecoration: 'underline' }}>Mở Nháp ➔</span>
          </div>
        )}

        {/* Thông báo chế độ Luyện Tập Câu Sai (nếu có câu từng làm sai) */}
        {previousWrongIds.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: filterWrongOnly ? '#FEF3C7' : '#F0FDF4',
              border: `1px solid ${filterWrongOnly ? '#FCD34D' : '#BBF7D0'}`,
              padding: '8px 14px',
              borderRadius: '10px',
              marginBottom: '12px',
              fontSize: '13px',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <span style={{ color: filterWrongOnly ? '#92400E' : '#166534', fontWeight: 600 }}>
              {filterWrongOnly 
                ? `🎯 Đang chỉ luyện lại ${activeQuestions.length} câu bé từng làm sai trước đó.` 
                : `💡 Bài này có ${previousWrongIds.length} câu bé từng làm chưa đúng. Bé có muốn chỉ ôn lại những câu đó không?`}
            </span>
            <button
              onClick={() => {
                audioService.playPop();
                setFilterWrongOnly(!filterWrongOnly);
                setCurrentIdx(0);
              }}
              style={{
                background: filterWrongOnly ? '#D97706' : '#16A34A',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {filterWrongOnly ? '🔄 Làm toàn bộ bài' : '🎯 Chỉ luyện câu sai'}
            </button>
          </div>
        )}

        {/* Combo banner */}
        {comboCount >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 0' }}>
            <div className="combo-banner">
              <span className="combo-flame">🔥</span>
              Combo x{comboCount}! Tuyệt vời!
            </div>
          </div>
        )}

        {/* Nội dung câu hỏi */}
        <div className={`question-content-box ${slideClass}`}>
          <div className="prompt-header">
            <h3 className="prompt-text">{question.prompt}</h3>
          </div>

          {question.illustration && (
            <div className="question-illustration">{question.illustration}</div>
          )}

          {/* Dạng minh họa hoặc tương tác Phân số (Fraction Visualizer) */}
          {question.interactiveData?.fractionData && (
            <FractionVisualizer
              numerator={question.interactiveData.fractionData.numerator}
              denominator={question.interactiveData.fractionData.denominator}
              shape={question.interactiveData.fractionData.shape}
              interactive={question.interactiveData.fractionData.interactive}
              label="📊 Mô hình trực quan hóa phân số:"
            />
          )}

          {/* DẠNG 1 & 2: Multiple Choice & Image Choice */}
          {(question.type === 'multiple_choice' || question.type === 'image_choice' || question.type === 'multi_select') && (
            <div className={`options-grid ${question.type === 'image_choice' ? 'image-choice-grid' : ''}`}>
              {question.options?.map((opt, idx) => {
                const isSelected = question.type === 'multi_select'
                  ? selectedOptionIds.includes(opt.id)
                  : selectedOptionId === opt.id;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D
                return (
                  <button
                    key={opt.id}
                    className={`option-btn ${isSelected ? 'selected' : ''} ${question.type === 'image_choice' ? 'image-opt' : ''}`}
                    onClick={() => {
                      audioService.playPop();
                      if (question.type === 'multi_select') {
                        setSelectedOptionIds((current) => current.includes(opt.id)
                          ? current.filter((id) => id !== opt.id)
                          : [...current, opt.id]);
                      } else {
                        setSelectedOptionId(opt.id);
                      }
                    }}
                  >
                    <span className="opt-letter-badge">{letter}</span>
                    {opt.emoji && <span className="opt-emoji">{opt.emoji}</span>}
                    <span className="option-text">{opt.text}</span>
                    {isSelected && <span className="option-check">✓</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* DẠNG 3: True / False (Đúng hay Sai) */}
          {question.type === 'true_false' && (
            <div className="true-false-container">
              {question.options && question.options.length > 0 ? (
                question.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isTrueBtn = opt.id.toLowerCase().includes('true') || opt.text?.toLowerCase().includes('đúng');
                  return (
                    <button
                      key={opt.id}
                      className={`btn-tf ${isTrueBtn ? 'btn-tf-true' : 'btn-tf-false'} ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        audioService.playPop();
                        setSelectedOptionId(opt.id);
                      }}
                    >
                      <span className="tf-icon">{isTrueBtn ? '👍' : '👎'}</span>
                      <span className="tf-label">{opt.text}</span>
                    </button>
                  );
                })
              ) : (
                <>
                  <button
                    className={`btn-tf btn-tf-true ${selectedOptionId === 'true' ? 'selected' : ''}`}
                    onClick={() => {
                      audioService.playPop();
                      setSelectedOptionId('true');
                    }}
                  >
                    <span className="tf-icon">👍</span>
                    <span className="tf-label">Đúng (True)</span>
                  </button>
                  <button
                    className={`btn-tf btn-tf-false ${selectedOptionId === 'false' ? 'selected' : ''}`}
                    onClick={() => {
                      audioService.playPop();
                      setSelectedOptionId('false');
                    }}
                  >
                    <span className="tf-icon">👎</span>
                    <span className="tf-label">Sai (False)</span>
                  </button>
                </>
              )}
            </div>
          )}

          {/* DẠNG 4: Fill in the Blank (Điền vào chỗ trống) */}
          {question.type === 'fill_in_the_blank' && (
            <div className="fill-blank-container">
              <div className="fill-blank-field-wrap">
                <input
                  type="text"
                  className="fill-blank-input"
                  placeholder="Bé gõ câu trả lời vào đây..."
                  value={blankInput}
                  autoFocus
                  onChange={(e) => setBlankInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && blankInput.trim()) {
                      handleCheckAnswer();
                    }
                  }}
                />
                {blankInput && (
                  <button
                    className="btn-clear-input"
                    onClick={() => setBlankInput('')}
                    title="Xóa chữ"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="fill-blank-hint-sub">Bấm phím <strong>Enter</strong> hoặc nút <strong>Kiểm Tra Đáp Án</strong> để nộp bài.</p>
            </div>
          )}

          {/* DẠNG 5: Drag and Drop (Kéo/Chạm quả táo vào giỏ) */}
          {question.type === 'drag_and_drop' && (
            <div className="drag-drop-arena">
              <div className="basket-dropzone">
                <div className="basket-icon">🧺</div>
                <div className="basket-info">
                  <strong>Giỏ Đựng ({basketItems.length}/{question.interactiveData?.basketTargetCount})</strong>
                  <p>Chạm vào vật phẩm bên dưới để cho vào hoặc lấy ra khỏi giỏ</p>
                </div>
              </div>

              <div className="apples-shelf">
                {question.interactiveData?.draggableItems?.map((item) => {
                  const isInBasket = basketItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      className={`apple-item-btn ${isInBasket ? 'in-basket' : ''}`}
                      onClick={() => handleToggleBasketItem(item.id)}
                    >
                      <span className="apple-emoji">{item.icon}</span>
                      <span className="apple-tag">{isInBasket ? '✓ Trong giỏ' : item.label || 'Chọn'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DẠNG 6: Word Match (Nối cặp từ / hình) */}
          {question.type === 'word_match' && (
            <div className="word-match-container">
              <p className="word-match-guide">Chạm vào một thẻ ở cột trái, rồi chạm vào thẻ tương ứng ở cột phải để nối cặp!</p>
              <div className="match-columns-grid">
                {/* Cột trái */}
                <div className="match-col match-col-left">
                  <h4 className="match-col-title">Vế 1</h4>
                  {question.interactiveData?.matchingPairs?.map((pair) => {
                    const isMatched = matchedPairIds.includes(pair.id);
                    const isSelected = selectedLeftId === pair.id;
                    return (
                      <button
                        key={pair.id}
                        disabled={isMatched}
                        className={`match-card ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                        onClick={() => handleSelectLeftPair(pair.id)}
                      >
                        {pair.leftEmoji && <span className="match-emoji">{pair.leftEmoji}</span>}
                        <span className="match-text">{pair.left}</span>
                        {isMatched && <span className="match-check">✓ Đã nối</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Biểu tượng liên kết ở giữa */}
                <div className="match-divider-col">
                  <span>↔️</span>
                </div>

                {/* Cột phải */}
                <div className="match-col match-col-right">
                  <h4 className="match-col-title">Vế 2</h4>
                  {rightColumnOrder.map((item) => {
                    const isMatched = matchedPairIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        disabled={isMatched}
                        className={`match-card ${isMatched ? 'matched' : ''}`}
                        onClick={() => handleSelectRightPair(item.id)}
                      >
                        {item.emoji && <span className="match-emoji">{item.emoji}</span>}
                        <span className="match-text">{item.text}</span>
                        {isMatched && <span className="match-check">✓ Đã nối</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DẠNG 7: Ordering (Sắp xếp thứ tự) */}
          {question.type === 'ordering' && (
            <div className="ordering-container">
              <p className="ordering-guide">Sắp xếp các thẻ theo đúng thứ tự yêu cầu bằng các nút mũi tên ⬆️ ⬇️:</p>
              <div className="ordering-list">
                {currentOrderItems.map((item, idx) => (
                  <div key={item.id} className="ordering-card">
                    <span className="order-badge">{idx + 1}</span>
                    <span className="order-text">{item.text}</span>
                    <div className="order-actions">
                      <button
                        className="btn-order-move"
                        disabled={idx === 0}
                        title="Di chuyển lên trên"
                        onClick={() => handleMoveOrderItem(idx, 'up')}
                      >
                        ⬆️
                      </button>
                      <button
                        className="btn-order-move"
                        disabled={idx === currentOrderItems.length - 1}
                        title="Di chuyển xuống dưới"
                        onClick={() => handleMoveOrderItem(idx, 'down')}
                      >
                        ⬇️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DẠNG 8: Writing Practice (Tập viết ô ly) */}
          {question.type === 'writing_practice' && (
            <WritingCanvas
              targetCharacter={question.interactiveData?.writingCharacter || 'A'}
              guidelines={question.interactiveData?.writingGuidelines}
              onComplete={() => handleCheckAnswer(true)}
            />
          )}

          {/* Gợi ý khi câu trả lời chưa đúng */}
          {showHint && question.hint && (
            <div className="hint-banner">
              💡 <strong>Gợi ý bé: </strong> {question.hint}
            </div>
          )}

          {/* Lời giải chi tiết từng bước (Step-by-step Explanation) */}
          {question.explanationStepByStep && question.explanationStepByStep.length > 0 && (
            <div className="step-by-step-explanation-box">
              <button
                className="btn-toggle-steps"
                onClick={() => {
                  audioService.playPop();
                  setShowExplanationSteps(!showExplanationSteps);
                }}
              >
                {showExplanationSteps ? '📖 Thu gọn cách giải' : '📖 Xem cách giải từng bước'}
              </button>
              {showExplanationSteps && (
                <div className="steps-list">
                  {question.explanationStepByStep.map((step, sIdx) => (
                    <div key={sIdx} className="step-item">
                      <span className="step-num">Bước {sIdx + 1}:</span> {step}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Trạng thái phản hồi vui vẻ */}
          {answeredState === 'correct' && (
            <div className="feedback-badge correct">
              🎉 Tuyệt vời! Bé trả lời hoàn toàn chính xác!
            </div>
          )}
          {answeredState === 'wrong' && (
            <div className="feedback-badge wrong">
              🤔 Chưa chính xác rồi, bé quan sát kỹ và thử lại nhé!
            </div>
          )}
        </div>

        {/* Footer: Nút Kiểm Tra Đáp Án */}
        {question.type !== 'writing_practice' && (
          <div className="runner-footer">
            <button
              className="btn-check-answer"
              disabled={isCheckDisabled()}
              onClick={() => handleCheckAnswer()}
            >
              Kiểm Tra Đáp Án ➔
            </button>
          </div>
        )}
      </div>

      {/* Bảng Nháp Điện Tử (Magic Scratchpad) */}
      <ScratchpadCanvas
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        onUsed={() => storageService.recordScratchpadUsed()}
      />
    </div>
  );
};
