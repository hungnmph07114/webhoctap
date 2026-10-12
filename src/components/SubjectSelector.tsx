import React from 'react';
import { SubjectId } from '../types/curriculum';
import { SUBJECT_METAS } from '../data/curriculumData';
import { audioService } from '../services/audioService';

interface SubjectSelectorProps {
  currentSubject: SubjectId;
  onSelectSubject: (subject: SubjectId) => void;
  availableLessonsCount: { [key in SubjectId]: number };
}

const SUBJECT_CLASS: Record<SubjectId, string> = {
  math: 'math-tab',
  vietnamese: 'viet-tab',
  english: 'eng-tab',
};

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  currentSubject,
  onSelectSubject,
  availableLessonsCount
}) => {
  return (
    <div className="subject-tabs-container">
      {SUBJECT_METAS.map((subj) => {
        const isSelected = currentSubject === subj.id;
        const count = availableLessonsCount[subj.id] || 0;
        const tabClass = SUBJECT_CLASS[subj.id] || '';

        return (
          <button
            key={subj.id}
            className={`subject-tab-btn ${tabClass} ${isSelected ? 'selected' : ''}`}
            style={{
              borderColor: isSelected ? subj.color : 'transparent',
              backgroundColor: isSelected ? subj.accentColor : '#FFFFFF'
            }}
            onClick={() => {
              audioService.playPop();
              onSelectSubject(subj.id);
            }}
          >
            <span className="subj-icon">{subj.icon}</span>
            <div className="subj-details">
              <span className="subj-name" style={{ color: isSelected ? subj.color : '#2D3436' }}>
                {subj.name}
              </span>
              <span className="subj-lesson-count">
                {count} bài học sẵn sàng
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
