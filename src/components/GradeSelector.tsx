import React from 'react';
import { Grade, Lesson } from '../types/curriculum';
import { audioService } from '../services/audioService';

interface GradeSelectorProps {
  currentGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
  progress?: Record<string, { stars: number }>;
  lessons: Lesson[];
}

const GRADES: { grade: Grade; title: string; subtitle: string; icon: string; bg: string }[] = [
  { grade: 1, title: 'Lớp 1', subtitle: '6 tuổi • Làm quen chữ & số', icon: '🐣', bg: 'linear-gradient(135deg, #FF9F43, #FECA57)' },
  { grade: 2, title: 'Lớp 2', subtitle: '7 tuổi • Bảng nhân & chính tả', icon: '🐰', bg: 'linear-gradient(135deg, #10AC84, #1DD1A1)' },
  { grade: 3, title: 'Lớp 3', subtitle: '8 tuổi • Cửu chương & so sánh', icon: '🦊', bg: 'linear-gradient(135deg, #0ABDE3, #48DBFB)' },
  { grade: 4, title: 'Lớp 4', subtitle: '9 tuổi • Phân số & từ loại', icon: '🦁', bg: 'linear-gradient(135deg, #5F27CD, #341F97)' },
  { grade: 5, title: 'Lớp 5', subtitle: '10 tuổi • Thập phân & vận tốc', icon: '🦅', bg: 'linear-gradient(135deg, #EE5253, #FF6B6B)' }
];

export const GradeSelector: React.FC<GradeSelectorProps> = ({ currentGrade, onSelectGrade, progress = {}, lessons }) => {
  return (
    <div className="grade-selector-container">
      <div className="grade-selector-header">
        <h2 className="grade-heading">🌟 Bé Đang Học Khối Lớp Nào?</h2>
        <p className="grade-subheading">Chọn khối lớp để xem chương trình học phù hợp nhất với con nhé!</p>
      </div>

      <div className="grade-cards-grid">
        {GRADES.map((g) => {
          const isActive = currentGrade === g.grade;
          // Đếm số bài chưa làm
          const totalForGrade = lessons.filter(l => l.grade === g.grade).length;
          const doneForGrade = lessons.filter(l => l.grade === g.grade && progress[l.id]?.stars > 0).length;
          const remaining = totalForGrade - doneForGrade;

          return (
            <button
              key={g.grade}
              className={`grade-card-btn ${isActive ? 'active' : ''}`}
              style={{ background: isActive ? g.bg : undefined }}
              onClick={() => {
                audioService.playPop();
                onSelectGrade(g.grade);
              }}
            >
              <div className="grade-card-icon">{g.icon}</div>
              <div className="grade-card-info">
                <span className="grade-card-title">{g.title}</span>
                <span className="grade-card-subtitle">{g.subtitle}</span>
              </div>
              {isActive && <div className="active-check-badge">✓ Đang chọn</div>}
              {!isActive && remaining > 0 && (
                <div className="grade-lesson-badge">{remaining} bài mới</div>
              )}
              {!isActive && remaining === 0 && doneForGrade > 0 && (
                <div className="grade-lesson-badge">✓ Hoàn thành</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
