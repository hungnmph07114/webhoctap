import React, { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

interface FractionVisualizerProps {
  numerator: number;
  denominator: number;
  shape?: 'bar' | 'circle';
  interactive?: boolean;
  onValueChange?: (numerator: number, denominator: number) => void;
  label?: string;
}

export const FractionVisualizer: React.FC<FractionVisualizerProps> = ({
  numerator: initialNum,
  denominator,
  shape = 'bar',
  interactive = false,
  onValueChange,
  label
}) => {
  const [selectedCount, setSelectedCount] = useState(initialNum);

  useEffect(() => {
    setSelectedCount(initialNum);
  }, [initialNum]);

  const handleTogglePart = (index: number) => {
    if (!interactive) return;
    audioService.playPop();
    // If clicking on part index: if index < selectedCount, we set to index (unfill from there), otherwise index + 1
    const nextCount = index < selectedCount ? index : index + 1;
    setSelectedCount(nextCount);
    if (onValueChange) {
      onValueChange(nextCount, denominator);
    }
  };

  const den = Math.max(1, denominator);
  const num = Math.min(den, Math.max(0, selectedCount));

  // Render SVG Circle (Pie slices)
  const renderCircle = () => {
    const size = 160;
    const center = size / 2;
    const radius = 68;

    if (den === 1) {
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="fraction-pie-svg">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill={num >= 1 ? '#F59E0B' : '#F1F5F9'}
            stroke="#D97706"
            strokeWidth="3"
            onClick={() => handleTogglePart(0)}
            style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.2s ease' }}
          />
        </svg>
      );
    }

    const slices = [];
    const angleStep = (2 * Math.PI) / den;

    for (let i = 0; i < den; i++) {
      const startAngle = i * angleStep - Math.PI / 2;
      const endAngle = (i + 1) * angleStep - Math.PI / 2;

      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      const isFilled = i < num;

      slices.push(
        <path
          key={i}
          d={pathData}
          fill={isFilled ? '#F59E0B' : '#F8FAFC'}
          stroke="#CBD5E1"
          strokeWidth="2"
          onClick={() => handleTogglePart(i)}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            transition: 'fill 0.2s ease, transform 0.15s ease',
            filter: isFilled ? 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))' : 'none'
          }}
          className="fraction-slice"
        />
      );
    }

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="fraction-pie-svg">
        <circle cx={center} cy={center} r={radius + 4} fill="none" stroke="#E2E8F0" strokeWidth="4" />
        {slices}
        <circle cx={center} cy={center} r={4} fill="#475569" />
      </svg>
    );
  };

  // Render Bar (Chocolate / Strip)
  const renderBar = () => {
    const parts = [];
    for (let i = 0; i < den; i++) {
      const isFilled = i < num;
      parts.push(
        <div
          key={i}
          className={`fraction-bar-segment ${isFilled ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
          onClick={() => handleTogglePart(i)}
          title={`Phần ${i + 1}/${den}`}
        >
          <span className="fraction-segment-label">1/{den}</span>
        </div>
      );
    }

    return (
      <div className="fraction-bar-wrapper">
        <div className="fraction-bar-segments">{parts}</div>
      </div>
    );
  };

  return (
    <div className="fraction-visualizer-container">
      {label && <div className="fraction-label">{label}</div>}

      <div className="fraction-content-layout">
        <div className="fraction-render-box">
          {shape === 'circle' ? renderCircle() : renderBar()}
        </div>

        <div className="fraction-display-math">
          <div className="math-fraction-card">
            <span className="math-num">{num}</span>
            <span className="math-bar" />
            <span className="math-den">{den}</span>
          </div>
          <span className="math-reading-text">
            ({num}/{den})
          </span>
        </div>
      </div>

      {interactive && (
        <div className="fraction-interactive-hint">
          👆 Bé có thể chạm vào các phần để tô màu phân số nhé!
        </div>
      )}
    </div>
  );
};
