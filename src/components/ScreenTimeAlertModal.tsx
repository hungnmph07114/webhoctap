import React from 'react';
import { audioService } from '../services/audioService';

interface ScreenTimeAlertModalProps {
  isOpen: boolean;
  limitMinutes: number;
  onTakeBreak: () => void;
  onOpenParentGate: () => void;
}

export const ScreenTimeAlertModal: React.FC<ScreenTimeAlertModalProps> = ({
  isOpen,
  limitMinutes,
  onTakeBreak,
  onOpenParentGate
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="screen-time-alert-card" style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '32px 24px',
        maxWidth: '440px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        border: '4px solid #FF9F43',
        animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '12px' }}>🦉💤</div>
        <h2 style={{ color: '#d35400', fontSize: '24px', margin: '0 0 8px 0', fontWeight: 800 }}>
          Bé Ơi, Đã Đến Giờ Nghỉ Ngơi!
        </h2>
        <p style={{ color: '#57606f', fontSize: '15px', lineHeight: '1.5', margin: '0 0 20px 0' }}>
          Hôm nay bé đã chăm chỉ học tập đủ <strong>{limitMinutes} phút</strong> rồi! 
          Đôi mắt xinh cần được thư giãn và nhắm lại 5 phút nhé!
        </p>

        <div style={{
          background: '#FFF5EB',
          borderRadius: '16px',
          padding: '14px',
          marginBottom: '24px',
          border: '1px dashed #FF9F43',
          textAlign: 'left'
        }}>
          <strong style={{ color: '#E67E22', display: 'block', marginBottom: '4px' }}>💡 Mẹo thư giãn cho bé:</strong>
          <span style={{ fontSize: '13px', color: '#7f8c8d' }}>
            1. Đứng dậy vươn vai và nhảy theo nhạc.<br/>
            2. Uống một ngụm nước mát.<br/>
            3. Nhìn ra xa ngoài cửa sổ ngắm cây xanh.
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            style={{
              padding: '14px',
              background: '#2ECC71',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)'
            }}
            onClick={() => {
              audioService.playPop();
              onTakeBreak();
            }}
          >
            🌱 Bé Đi Nghỉ Ngơi Nhé (nhắc lại sau 15 phút)
          </button>
          
          <button
            style={{
              padding: '10px',
              background: 'transparent',
              color: '#95A5A6',
              border: 'none',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
            onClick={() => {
              audioService.playPop();
              onOpenParentGate();
            }}
          >
            👨‍👩‍👧 Phụ huynh điều chỉnh thêm thời gian
          </button>
        </div>
      </div>
    </div>
  );
};
