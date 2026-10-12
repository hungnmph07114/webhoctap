import React, { useRef, useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

interface ScratchpadCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  onUsed?: () => void;
}

export const ScratchpadCanvas: React.FC<ScratchpadCanvasProps> = ({
  isOpen,
  onClose,
  onUsed
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2563EB'); // Xanh dương
  const [isEraser, setIsEraser] = useState(false);
  const lineWidth = 3;

  const [hasDrawn, setHasDrawn] = useState(false);
  const [isGridMode, setIsGridMode] = useState(true);

  // Khởi tạo và vẽ lưới
  const initCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number, clearDrawing = true) => {
    if (clearDrawing) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    if (isGridMode) {
      const gridSize = 25;
      ctx.save();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#E2E8F0';

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Kích thước canvas responsive theo cửa sổ
    const w = Math.min(window.innerWidth - 40, 680);
    const h = Math.min(window.innerHeight * 0.55, 380);
    canvas.width = w;
    canvas.height = h;

    initCanvas(ctx, w, h, true);
  }, [isOpen, isGridMode]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (!hasDrawn) {
      setHasDrawn(true);
      if (onUsed) onUsed();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = isEraser ? 18 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#FFFFFF' : penColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    audioService.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    initCanvas(ctx, canvas.width, canvas.height, true);
    setHasDrawn(false);
  };

  return (
    <div className="scratchpad-overlay" onClick={onClose}>
      <div className="scratchpad-card" onClick={(e) => e.stopPropagation()}>
        <div className="scratchpad-header">
          <div className="scratchpad-title">
            <span style={{ fontSize: '22px' }}>📝</span>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                Bảng Nháp Điện Tử (Magic Scratchpad)
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                Bé vẽ nháp tính toán phép tính hoặc gạch sơ đồ ở đây nhé!
              </p>
            </div>
          </div>
          <button
            className="btn-scratchpad-close"
            onClick={onClose}
            title="Đóng bảng nháp"
          >
            ✕
          </button>
        </div>

        {/* Toolbar điều khiển bút vẽ */}
        <div className="scratchpad-toolbar">
          <div className="palette-group">
            <span className="tool-label">Bút vẽ:</span>
            {['#2563EB', '#DC2626', '#16A34A', '#1E293B'].map((col) => (
              <button
                key={col}
                className={`color-btn ${!isEraser && penColor === col ? 'active' : ''}`}
                style={{ backgroundColor: col }}
                onClick={() => {
                  audioService.playPop();
                  setPenColor(col);
                  setIsEraser(false);
                }}
                title={`Màu bút ${col}`}
              />
            ))}
          </div>

          <div className="tool-divider" />

          <div className="actions-group">
            <button
              className={`tool-btn ${isEraser ? 'active' : ''}`}
              onClick={() => {
                audioService.playPop();
                setIsEraser(!isEraser);
              }}
              title="Tẩy xóa nét"
            >
              🧹 Tẩy
            </button>
            <button
              className="tool-btn"
              onClick={() => {
                audioService.playPop();
                setIsGridMode(!isGridMode);
              }}
              title="Bật/Tắt đường kẻ ô ly"
            >
              {isGridMode ? '📐 Ẩn ô ly' : '📐 Hiện ô ly'}
            </button>
            <button
              className="tool-btn btn-clear-all"
              onClick={handleClear}
              title="Xóa trắng bảng nháp"
            >
              🗑️ Xóa hết
            </button>
          </div>
        </div>

        {/* Khung Canvas */}
        <div className="scratchpad-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="scratchpad-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className="scratchpad-footer">
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            💡 Nét nháp sẽ tự lưu trong suốt bài học để bé đối chiếu kết quả.
          </span>
          <button
            className="btn-done-scratch"
            onClick={onClose}
          >
            ✓ Thu Gọn Bảng Nháp
          </button>
        </div>
      </div>
    </div>
  );
};
