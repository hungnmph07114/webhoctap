import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { audioService } from '../../services/audioService';

interface SpellingBeeGameProps {
  onFinishGame: (earnedStars: number, earnedXp: number, score: number) => void;
  onBack: () => void;
}

interface WordChallenge {
  word: string;
  hint: string;
  category: string;
}

const WORD_BANK: WordChallenge[] = [
  { word: 'CAT', hint: '🐱 Con mèo', category: 'Động vật' },
  { word: 'DOG', hint: '🐶 Con chó', category: 'Động vật' },
  { word: 'SUN', hint: '☀️ Mặt trời', category: 'Thiên nhiên' },
  { word: 'MOON', hint: '🌙 Mặt trăng', category: 'Thiên nhiên' },
  { word: 'FISH', hint: '🐟 Con cá', category: 'Động vật' },
  { word: 'BIRD', hint: '🐦 Con chim', category: 'Động vật' },
  { word: 'BOOK', hint: '📚 Quyển sách', category: 'Đồ vật' },
  { word: 'TREE', hint: '🌳 Cái cây', category: 'Thiên nhiên' },
  { word: 'CAKE', hint: '🎂 Cái bánh', category: 'Thức ăn' },
  { word: 'RAIN', hint: '🌧️ Mưa', category: 'Thiên nhiên' },
  { word: 'APPLE', hint: '🍎 Trái táo', category: 'Thức ăn' },
  { word: 'TIGER', hint: '🐯 Con hổ', category: 'Động vật' },
  { word: 'WATER', hint: '💧 Nước', category: 'Thiên nhiên' },
  { word: 'HAPPY', hint: '😊 Vui vẻ', category: 'Cảm xúc' },
  { word: 'DANCE', hint: '💃 Nhảy múa', category: 'Hoạt động' },
  { word: 'DREAM', hint: '🌟 Giấc mơ', category: 'Khái niệm' },
  { word: 'CLOUD', hint: '☁️ Đám mây', category: 'Thiên nhiên' },
  { word: 'MUSIC', hint: '🎵 Âm nhạc', category: 'Nghệ thuật' },
  { word: 'OCEAN', hint: '🌊 Đại dương', category: 'Thiên nhiên' },
  { word: 'BRAVE', hint: '🦁 Dũng cảm', category: 'Cảm xúc' },
  { word: 'DOLPHIN', hint: '🐬 Cá heo', category: 'Động vật' },
  { word: 'RAINBOW', hint: '🌈 Cầu vồng', category: 'Thiên nhiên' },
  { word: 'TEACHER', hint: '👩‍🏫 Giáo viên', category: 'Nghề nghiệp' },
  { word: 'LIBRARY', hint: '📖 Thư viện', category: 'Địa điểm' },
  { word: 'FLOWERS', hint: '🌸 Những bông hoa', category: 'Thiên nhiên' },
  { word: 'ELEPHANT', hint: '🐘 Con voi', category: 'Động vật' },
  { word: 'BUTTERFLY', hint: '🦋 Con bướm', category: 'Động vật' },
  { word: 'MOUNTAIN', hint: '⛰️ Ngọn núi', category: 'Thiên nhiên' },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWords(count = 8): WordChallenge[] {
  return shuffleArray(WORD_BANK).slice(0, count);
}

function speakWord(word: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(word.toLowerCase());
  utter.lang = 'en-US';
  utter.rate = 0.85;
  utter.pitch = 1.1;
  window.speechSynthesis.speak(utter);
}

type GamePhase = 'ready' | 'playing' | 'result';

interface LetterTile {
  id: number;
  char: string;
  used: boolean;
}

export const SpellingBeeGame: React.FC<SpellingBeeGameProps> = ({ onFinishGame, onBack }) => {
  const words = useRef<WordChallenge[]>(pickWords(8));
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [wordIndex, setWordIndex] = useState(0);
  const [tiles, setTiles] = useState<LetterTile[]>([]);
  const [typed, setTyped] = useState<{ tileId: number; char: string }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const [beeWiggle, setBeeWiggle] = useState(false);
  const feedbackTimer = useRef<number | null>(null);

  const currentWord = words.current[wordIndex];

  const initTiles = useCallback((word: string) => {
    const letters = word.split('');
    const shuffled = shuffleArray(letters.map((char, i) => ({ id: i, char, used: false })));
    setTiles(shuffled);
    setTyped([]);
    setFeedback(null);
    setHintShown(false);
  }, []);

  useEffect(() => {
    if (phase === 'playing' && currentWord) {
      initTiles(currentWord.word);
      setTimeout(() => speakWord(currentWord.word), 400);
    }
  }, [phase, wordIndex, currentWord, initTiles]);

  const handleTileTap = (tile: LetterTile) => {
    if (tile.used || feedback !== null) return;
    audioService.playPop();
    setBeeWiggle(true);
    setTimeout(() => setBeeWiggle(false), 400);

    const newTyped = [...typed, { tileId: tile.id, char: tile.char }];
    setTyped(newTyped);
    setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, used: true } : t));

    if (newTyped.length === currentWord.word.length) {
      const spelled = newTyped.map(t => t.char).join('');
      if (spelled === currentWord.word) {
        setFeedback('correct');
        setCorrectCount(c => c + 1);
        audioService.playSuccess();
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 }, colors: ['#F59E0B', '#10AC84', '#6366F1'] });
      } else {
        setFeedback('wrong');
        setWrongCount(w => w + 1);
        audioService.playWrong();
      }
      feedbackTimer.current = window.setTimeout(() => {
        if (wordIndex + 1 >= words.current.length) {
          setPhase('result');
        } else {
          setWordIndex(i => i + 1);
        }
      }, spelled === currentWord.word ? 1200 : 1600);
    }
  };

  const handleDelete = () => {
    if (typed.length === 0 || feedback !== null) return;
    audioService.playPop();
    const last = typed[typed.length - 1];
    setTyped(prev => prev.slice(0, -1));
    setTiles(prev => prev.map(t => t.id === last.tileId ? { ...t, used: false } : t));
  };

  const handleHint = () => {
    setHintShown(true);
    speakWord(currentWord.word);
  };

  const totalWords = words.current.length;
  const accuracy = Math.round((correctCount / totalWords) * 100);
  const stars = accuracy >= 90 ? 5 : accuracy >= 70 ? 4 : accuracy >= 50 ? 3 : accuracy >= 30 ? 2 : 1;
  const xp = correctCount * 15;

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  if (phase === 'ready') {
    return (
      <div style={{ textAlign: 'center', padding: '20px 16px' }}>
        <div style={{ fontSize: '72px', marginBottom: '12px', animation: 'float 2s ease-in-out infinite' }}>🐝</div>
        <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#92400E', margin: '0 0 8px 0' }}>Ong Tìm Chữ</h2>
        <p style={{ color: '#78350F', fontSize: '15px', lineHeight: 1.6, marginBottom: '8px' }}>
          Nghe từ vựng được đọc 🔊 rồi bấm các ô chữ cái theo đúng thứ tự để đánh vần!
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', margin: '16px 0 24px' }}>
          {[`📝 ${totalWords} từ vựng`, '⭐ Thưởng đến 5 sao', `🦉 +${totalWords * 15} XP`].map(t => (
            <div key={t} style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', color: '#78350F' }}>{t}</div>
          ))}
        </div>
        <button onClick={() => setPhase('playing')} style={{ padding: '14px 40px', background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#FFF', border: 'none', borderRadius: '16px', fontSize: '18px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 16px rgba(245,158,11,0.5)' }}>
          🚀 Bắt Đầu Chơi!
        </button>
        <br />
        <button onClick={onBack} style={{ marginTop: '14px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px' }}>← Quay lại</button>
      </div>
    );
  }

  if (phase === 'result') {
    return (
      <div style={{ textAlign: 'center', padding: '24px 16px', maxWidth: '420px', margin: '0 auto' }}>
        <div style={{ fontSize: '64px', marginBottom: '10px' }}>{accuracy >= 80 ? '🏆' : accuracy >= 50 ? '🎖️' : '🌱'}</div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1E293B', margin: '0 0 6px 0' }}>
          {accuracy >= 80 ? 'Xuất Sắc!' : accuracy >= 50 ? 'Cố Gắng Tốt!' : 'Tiếp Tục Luyện Nhé!'}
        </h2>
        <p style={{ color: '#64748B', marginBottom: '20px' }}>Bé đã đánh vần đúng {correctCount}/{totalWords} từ</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#ECFDF5', borderRadius: '12px', padding: '14px', border: '1px solid #6EE7B7' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#059669' }}>{correctCount}</div>
            <div style={{ fontSize: '12px', color: '#065F46' }}>Từ đúng ✓</div>
          </div>
          <div style={{ background: '#FEF2F2', borderRadius: '12px', padding: '14px', border: '1px solid #FCA5A5' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#DC2626' }}>{wrongCount}</div>
            <div style={{ fontSize: '12px', color: '#991B1B' }}>Từ sai ✗</div>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '32px', letterSpacing: '4px', marginBottom: '6px' }}>{'⭐'.repeat(stars)}{'☆'.repeat(5-stars)}</div>
          <div style={{ fontWeight: 700, color: '#92400E' }}>+{xp} XP cho Bibo 🦉</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { words.current = pickWords(8); setWordIndex(0); setCorrectCount(0); setWrongCount(0); setPhase('playing'); }} style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>🔄 Chơi Lại</button>
          <button onClick={() => onFinishGame(stars, xp, accuracy)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#10AC84,#059669)', color: '#FFF', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>Nhận Thưởng 🎁</button>
        </div>
      </div>
    );
  }

  const progress = (wordIndex / totalWords) * 100;
  return (
    <div style={{ padding: '12px 16px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '999px', marginBottom: '14px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#F59E0B,#D97706)', borderRadius: '999px', transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
        <span>Từ {wordIndex + 1}/{totalWords}</span>
        <span>✅ {correctCount} đúng · ❌ {wrongCount} sai</span>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '56px', display: 'inline-block', animation: beeWiggle ? 'beeWiggle 0.4s ease' : 'float 2.5s ease-in-out infinite' }}>🐝</span>
        <span style={{ fontSize: '12px', background: '#FEF3C7', color: '#92400E', display: 'inline-block', padding: '3px 10px', borderRadius: '999px', marginLeft: '8px', fontWeight: 600 }}>{currentWord.category}</span>
      </div>
      <div style={{ background: hintShown ? 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' : 'linear-gradient(135deg,#FEF3C7,#FDE68A)', border: `2px solid ${hintShown ? '#6EE7B7' : '#FCD34D'}`, borderRadius: '14px', padding: '12px 16px', textAlign: 'center', marginBottom: '14px', fontSize: '16px', fontWeight: 700, color: hintShown ? '#065F46' : '#92400E' }}>
        {currentWord.hint}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
        <button onClick={() => { speakWord(currentWord.word); audioService.playPop(); }} style={{ padding: '8px 16px', background: '#EEF2FF', border: '2px solid #C7D2FE', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#4338CA' }}>🔊 Nghe Lại</button>
        {!hintShown && <button onClick={handleHint} style={{ padding: '8px 16px', background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: '#15803D' }}>💡 Gợi Ý</button>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', minHeight: '56px', alignItems: 'center' }}>
        {Array.from({ length: currentWord.word.length }).map((_, i) => {
          const t = typed[i];
          return (
            <div key={i} style={{ width: '46px', height: '50px', borderRadius: '10px', border: `2px solid ${feedback === 'correct' ? '#10AC84' : feedback === 'wrong' ? '#EF4444' : t ? '#6366F1' : '#CBD5E1'}`, background: feedback === 'correct' ? '#ECFDF5' : feedback === 'wrong' ? '#FEF2F2' : t ? '#EEF2FF' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, color: t ? '#3730A3' : '#CBD5E1', transition: 'all 0.15s ease' }}>
              {t ? t.char : ''}
            </div>
          );
        })}
      </div>
      {feedback && (
        <div style={{ textAlign: 'center', fontSize: '17px', fontWeight: 800, color: feedback === 'correct' ? '#059669' : '#DC2626', marginBottom: '12px' }}>
          {feedback === 'correct' ? '🎉 Chính xác! Giỏi lắm!' : `❌ Sai rồi! Từ đúng là: ${currentWord.word}`}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
        {tiles.map((tile) => (
          <button key={tile.id} onClick={() => handleTileTap(tile)} disabled={tile.used || feedback !== null} style={{ width: '50px', height: '54px', borderRadius: '12px', border: `2px solid ${tile.used ? '#E2E8F0' : '#FCD34D'}`, background: tile.used ? '#F1F5F9' : 'linear-gradient(135deg,#FEF3C7,#FDE68A)', fontSize: '20px', fontWeight: 900, color: tile.used ? '#CBD5E1' : '#92400E', cursor: tile.used ? 'default' : 'pointer', transition: 'all 0.15s ease', boxShadow: tile.used ? 'none' : '0 3px 8px rgba(245,158,11,0.3)' }}>
            {tile.char}
          </button>
        ))}
      </div>
      {typed.length > 0 && feedback === null && (
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleDelete} style={{ padding: '8px 20px', background: '#FEE2E2', border: '2px solid #FCA5A5', borderRadius: '10px', color: '#DC2626', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>⌫ Xóa Chữ Cuối</button>
        </div>
      )}
    </div>
  );
};
