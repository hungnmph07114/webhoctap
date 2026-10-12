import React from 'react';
import { Lesson } from '../types/curriculum';
import { UserProgressMap } from '../types/user';
import { audioService } from '../services/audioService';

interface LessonListProps {
  lessons: Lesson[];
  progress: UserProgressMap;
  totalUserStars: number;
  onStartLesson: (lesson: Lesson) => void;
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: '⭐ Dễ',
  2: '⭐⭐ Trung Bình',
  3: '⭐⭐⭐ Khó',
  4: '💎 Siêu Khó',
};

// Ước lượng thời gian làm bài
function estimateTime(numQuestions: number): string {
  const mins = Math.ceil(numQuestions * 0.5);
  return `~${mins} phút`;
}

// Hiển thị thời gian học gần nhất
function formatLastPlayed(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  return `${Math.floor(days / 7)} tuần trước`;
}

// Circular SVG progress ring
const ProgressRing: React.FC<{ pct: number; stars: number }> = ({ pct, stars }) => {
  const r = 19;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const strokeColor = pct === 100 ? '#F1C40F' : '#10AC84';

  return (
    <div className="progress-ring-wrap">
      <svg className="progress-ring-svg" width="48" height="48">
        <circle className="progress-ring-bg" cx="24" cy="24" r={r} />
        <circle
          className="progress-ring-fill"
          cx="24"
          cy="24"
          r={r}
          stroke={strokeColor}
          style={{ strokeDasharray: circ, strokeDashoffset: offset }}
        />
      </svg>
      <div className="progress-ring-center" style={{ color: strokeColor }}>
        {pct === 100 ? '★' : `${stars}★`}
      </div>
    </div>
  );
};

export const LessonList: React.FC<LessonListProps> = ({
  lessons,
  progress,
  totalUserStars,
  onStartLesson
}) => {
  if (lessons.length === 0) {
    return (
      <div className="empty-lessons-card">
        <span className="empty-icon">🎒</span>
        <h3>Chuyên đề này đang được cập nhật thêm bài học!</h3>
        <p>Bé hãy chọn môn học khác hoặc đổi khối lớp để khám phá nhé.</p>
      </div>
    );
  }

  const lessonsByUnit = Array.from(
    lessons.reduce((groups, lesson) => {
      const group = groups.get(lesson.unitId) || { title: lesson.unitTitle, lessons: [] as Lesson[] };
      group.lessons.push(lesson);
      groups.set(lesson.unitId, group);
      return groups;
    }, new Map<string, { title: string; lessons: Lesson[] }>()).entries()
  );
  const newestLessonIds = new Set(lessons.slice(-2).map((lesson) => lesson.id));

  return (
    <div className="lesson-units-list">
      {lessonsByUnit.map(([unitId, unit]) => (
        <section className="lesson-unit-section" key={unitId}>
          <div className="lesson-unit-heading">
            <h2>{unit.title}</h2>
            <span>
              {unit.lessons.filter((lesson) => (progress[lesson.id]?.stars ?? 0) > 0).length}/{unit.lessons.length} hoàn thành
            </span>
          </div>
          <div className="lessons-grid">
      {unit.lessons.map((lesson, idx) => {
        const prog = progress[lesson.id];
        const stars = prog ? prog.stars : 0;
        const isCompleted = stars > 0;
        const requiredStars = lesson.starsRequiredToUnlock ?? 0;
        const prereqLesson = lesson.prerequisiteLessonId
          ? lessons.find((l) => l.id === lesson.prerequisiteLessonId)
          : undefined;
        const isPrereqCompleted = !lesson.prerequisiteLessonId || (progress[lesson.prerequisiteLessonId]?.stars ?? 0) > 0;
        const isStarsLocked = totalUserStars < requiredStars;
        const isLocked = isStarsLocked || !isPrereqCompleted;
        const completionPct = isCompleted ? Math.round((stars / 3) * 100) : 0;
        const lastPlayed = formatLastPlayed(prog?.completedAt || prog?.lastPlayed);
        const isNew = newestLessonIds.has(lesson.id) && !isCompleted && !isLocked;
        const isHot = prog && prog.stars === 3 && prog.wrongQuestionIds && prog.wrongQuestionIds.length === 0;

        return (
          <div
            key={lesson.id}
            className={`lesson-card ${isLocked ? 'locked' : isCompleted ? 'completed' : ''}`}
          >
            {/* Ribbon badge */}
            {!isLocked && isNew && <div className="ribbon-new">Mới</div>}
            {!isLocked && isHot && <div className="ribbon-hot">🔥 Hot</div>}

            <div className="lesson-badge-top">
              <span className="lesson-order">Bài {idx + 1}</span>
              <div className="stars-earned">
                {isLocked ? (
                  <span className="lock-badge" title={!isPrereqCompleted && prereqLesson ? `Cần xong bài: ${prereqLesson.title}` : `Cần ${requiredStars}⭐`}>
                    {!isPrereqCompleted && prereqLesson
                      ? '🔒 Cần bài trước'
                      : `🔒 Cần ${requiredStars}⭐`}
                  </span>
                ) : isCompleted ? (
                  <ProgressRing pct={completionPct} stars={stars} />
                ) : (
                  [1, 2, 3].map((starIdx) => (
                    <span
                      key={starIdx}
                      className={`star-icon ${starIdx <= stars ? 'active' : 'inactive'}`}
                    >
                      ★
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="lesson-main-info">
              <div className="lesson-icon-box">
                {isLocked ? '🔒' : lesson.icon}
              </div>
              <div className="lesson-text-block">
                <h3 className="lesson-card-title">{lesson.title}</h3>
                {!isLocked && (
                  <p className="lesson-card-desc">{lesson.description}</p>
                )}
                {isLocked && (
                  <p className="lesson-card-desc locked-desc">
                    {!isPrereqCompleted && prereqLesson
                      ? `🔒 Cần hoàn thành bài "${prereqLesson.title}" trước để mở khóa!`
                      : `🔒 Cần tích lũy đủ ${requiredStars}⭐ (hiện có ${totalUserStars}⭐) để mở khóa bài học này!`}
                  </p>
                )}
                {/* Estimated time + last played */}
                {!isLocked && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span className="lesson-time-tag">⏱ {estimateTime(lesson.questions.length)}</span>
                    {lastPlayed && (
                      <span className="lesson-last-played">• Học {lastPlayed}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mini progress bar */}
            {isCompleted && (
              <div className="lesson-progress-bar-mini">
                <div
                  className="lesson-progress-fill-mini"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            )}

            <div className="lesson-card-footer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span className="questions-count">
                  {isLocked
                    ? (!isPrereqCompleted && prereqLesson
                        ? `🔒 Cần xong: ${prereqLesson.title}`
                        : `🔒 Yêu cầu ${requiredStars} sao`)
                    : `📝 ${lesson.questions.length} câu · ${DIFFICULTY_LABELS[lesson.difficulty] || '⭐ Dễ'} · Đạt: ${lesson.passingScore || 60}%`
                  }
                </span>

                {!isLocked && prog?.wrongQuestionIds && prog.wrongQuestionIds.length > 0 && (
                  <span style={{ color: '#B45309', background: '#FEF3C7', padding: '2px 7px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, width: 'fit-content' }}>
                    🎯 Còn {prog.wrongQuestionIds.length} câu cần ôn
                  </span>
                )}
                {!isLocked && isCompleted && (!prog?.wrongQuestionIds || prog.wrongQuestionIds.length === 0) && (
                  <span style={{ color: '#059669', background: '#D1FAE5', padding: '2px 7px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, width: 'fit-content' }}>
                    ✓ Đã nắm vững 100%
                  </span>
                )}
              </div>
              <button
                className={`btn-start-lesson ${isLocked ? 'locked' : ''}`}
                disabled={isLocked}
                onClick={() => {
                  if (!isLocked) {
                    audioService.playPop();
                    onStartLesson(lesson);
                  }
                }}
              >
                {isLocked ? '🔒 Chưa Mở' : isCompleted ? '🔄 Ôn Lại' : '🚀 Vào Học'}
              </button>
            </div>
          </div>
      );
      })}
          </div>
        </section>
      ))}
    </div>
  );
};
