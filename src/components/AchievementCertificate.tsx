import React, { useRef } from 'react';
import { UserProfile } from '../types/user';
import { MascotState } from '../types/user';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';

interface AchievementCertificateProps {
  profile: UserProfile;
  mascot: MascotState;
  isOpen: boolean;
  onClose: () => void;
}

// Tiến hóa Bibo theo Level
export function getMascotEvolution(level: number): {
  emoji: string;
  title: string;
  description: string;
  aura: string;
} {
  if (level <= 2) return { emoji: '🥚', title: 'Quả Trứng Kỳ Diệu', description: 'Bibo đang ấp trứng, bé hãy học thêm để Bibo nở ra!', aura: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' };
  if (level <= 4) return { emoji: '🐣', title: 'Bibo Tí Hon', description: 'Bibo chim non đáng yêu đội khăn quàng đỏ!', aura: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' };
  if (level <= 7) return { emoji: '🦉', title: 'Bibo Thông Thái', description: 'Bibo đội mũ cử nhân, cầm sách tri thức!', aura: 'linear-gradient(135deg, #EEF2FF, #C7D2FE)' };
  return { emoji: '🧙', title: 'Bibo Đại Sư', description: 'Bibo huyền thoại! Kính pháp thuật, phát sáng hào quang!', aura: 'linear-gradient(135deg, #FDF4FF, #E9D5FF)' };
}

export const AchievementCertificate: React.FC<AchievementCertificateProps> = ({
  profile,
  mascot,
  isOpen,
  onClose,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const evolution = getMascotEvolution(mascot.level);
  const today = new Date();
  const dateStr = today.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const gradeNames: Record<number, string> = { 1: 'Lớp 1', 2: 'Lớp 2', 3: 'Lớp 3', 4: 'Lớp 4', 5: 'Lớp 5' };
  const gradeName = gradeNames[profile.currentGrade] || `Lớp ${profile.currentGrade}`;

  const handleDownload = async () => {
    audioService.playSuccess();
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.4 }, colors: ['#F59E0B', '#6366F1', '#10AC84', '#F43F5E'] });
    const el = certRef.current;
    if (!el) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `phieu-khen-${profile.displayName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Trình duyệt chưa hỗ trợ xuất ảnh. Hãy chụp màn hình để lưu phiếu khen!');
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div style={{ maxWidth: '500px', width: '100%' }} onClick={e => e.stopPropagation()}>
        {/* PHIẾU KHEN - vùng xuất ảnh */}
        <div
          ref={certRef}
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
            borderRadius: '24px',
            padding: '32px 28px',
            textAlign: 'center',
            border: '4px solid #F59E0B',
            boxShadow: '0 0 0 8px rgba(245,158,11,0.15), 0 20px 60px rgba(0,0,0,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Hoa văn góc */}
          {['topleft', 'topright', 'bottomleft', 'bottomright'].map(pos => (
            <div key={pos} style={{
              position: 'absolute',
              fontSize: '32px',
              opacity: 0.2,
              top: pos.includes('top') ? '8px' : 'auto',
              bottom: pos.includes('bottom') ? '8px' : 'auto',
              left: pos.includes('left') ? '12px' : 'auto',
              right: pos.includes('right') ? '12px' : 'auto',
            }}>⭐</div>
          ))}

          {/* Tiêu đề */}
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E', letterSpacing: '3px', marginBottom: '4px' }}>
            🏫 PHIẾU KHEN THƯỞNG
          </div>
          <div style={{ fontSize: '11px', color: '#B45309', marginBottom: '20px' }}>
            Học Tiểu Học Vui Nhộn • {dateStr}
          </div>

          {/* Bibo tiến hóa */}
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: evolution.aura,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '52px', margin: '0 auto 14px',
            boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
            border: '3px solid rgba(245,158,11,0.3)'
          }}>
            {evolution.emoji}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '16px' }}>
            {evolution.title}
          </div>

          {/* Tên học sinh */}
          <div style={{ fontSize: '13px', color: '#78350F', marginBottom: '4px' }}>Tặng cho học sinh xuất sắc</div>
          <div style={{
            fontSize: '28px', fontWeight: 900,
            background: 'linear-gradient(135deg, #D97706, #92400E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px',
            letterSpacing: '1px'
          }}>
            {profile.displayName}
          </div>
          <div style={{ fontSize: '14px', color: '#92400E', fontWeight: 600, marginBottom: '20px' }}>
            {gradeName} • Cú Bibo Level {mascot.level}
          </div>

          {/* Thành tích */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px',
            marginBottom: '20px'
          }}>
            {[
              { icon: '⭐', val: profile.stars, label: 'Số Sao' },
              { icon: '🔥', val: profile.currentStreak, label: 'Chuỗi Ngày' },
              { icon: '🏆', val: profile.unlockedBadges.length, label: 'Huy Hiệu' },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '12px', padding: '10px 6px', border: '1px solid rgba(245,158,11,0.3)' }}>
                <div style={{ fontSize: '22px' }}>{item.icon}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#92400E' }}>{item.val}</div>
                <div style={{ fontSize: '10px', color: '#B45309' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Dòng động viên */}
          <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#78350F', lineHeight: 1.6 }}>
            "Chúc mừng bé đã hoàn thành xuất sắc! Tiếp tục học thêm để Bibo ngày càng mạnh hơn nhé!"
          </div>

          {/* Con dấu */}
          <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ height: '1px', flex: 1, background: 'rgba(217,119,6,0.3)' }} />
            <span style={{ fontSize: '20px' }}>🌟</span>
            <div style={{ height: '1px', flex: 1, background: 'rgba(217,119,6,0.3)' }} />
          </div>
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownload}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: '#FFF',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(245,158,11,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📥 Tải Phiếu Khen (PNG)
          </button>
          <button
            onClick={onClose}
            style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.9)', border: '2px solid #FCD34D', borderRadius: '14px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', color: '#92400E' }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
