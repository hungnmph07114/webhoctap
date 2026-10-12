import React, { useRef, useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

interface WritingCanvasProps {
  targetCharacter: string;
  guidelines?: string[];
  onComplete: () => void;
}

export const WritingCanvas: React.FC<WritingCanvasProps> = ({
  targetCharacter,
  guidelines = [],
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [penColor, setPenColor] = useState('#2E86DE');

  // Vẽ lưới ô ly chuẩn tiểu học
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Nền trắng tinh tươm
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Kẻ lưới ô ly 4 hàng (Mô phỏng vở ô ly Hồng Hà của học sinh tiểu học)
    const gridSize = 30;
    ctx.lineWidth = 0.5;

    // Đường kẻ dọc mờ
    ctx.strokeStyle = '#D6E4FF';
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Đường kẻ ngang ô ly
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      // Đường kẻ chính đậm hơn (đường đậm cách 4 ô)
      if (y % (gridSize * 4) === 0) {
        ctx.strokeStyle = '#85A5FF';
        ctx.lineWidth = 1.2;
      } else {
        ctx.strokeStyle = '#D6E4FF';
        ctx.lineWidth = 0.6;
      }
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vẽ chữ mẫu mờ ở giữa để bé đồ theo
    ctx.fillStyle = 'rgba(200, 214, 229, 0.45)';
    ctx.font = 'bold 160px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(targetCharacter, width / 2, height / 2 + 10);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Thiết lập kích thước chuẩn theo màn hình
    canvas.width = Math.min(window.innerWidth - 60, 480);
    canvas.height = 260;

    drawGrid(ctx, canvas.width, canvas.height);
  }, [targetCharacter]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
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

    // Nét mực bút máy mượt mà bo tròn
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    audioService.playPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGrid(ctx, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFinish = () => {
    audioService.playSuccess();
    onComplete();
  };

  return (
    <div className="writing-canvas-container">
      <div className="writing-header">
        <div className="writing-title">
          <span>✍️ Bé tập viết chữ mẫu: </span>
          <strong className="character-highlight">{targetCharacter}</strong>
        </div>
        <div className="pen-palette">
          {['#2E86DE', '#EE5253', '#10AC84', '#1E272E'].map((color) => (
            <button
              key={color}
              className={`color-dot ${penColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => {
                audioService.playPop();
                setPenColor(color);
              }}
              title="Đổi màu mực"
            />
          ))}
        </div>
      </div>

      {guidelines.length > 0 && (
        <div className="writing-guidelines">
          {guidelines.map((g, idx) => (
            <div key={idx} className="guideline-item">
              📌 {g}
            </div>
          ))}
        </div>
      )}

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="oly-canvas"
        />
      </div>

      <div className="canvas-actions">
        <button className="btn-clean" onClick={clearCanvas}>
          🧹 Xóa viết lại
        </button>
        <button
          className={`btn-submit-stroke ${hasDrawn ? 'ready' : ''}`}
          onClick={handleFinish}
          disabled={!hasDrawn}
        >
          🌟 Hoàn thành nét chữ
        </button>
      </div>
    </div>
  );
};
