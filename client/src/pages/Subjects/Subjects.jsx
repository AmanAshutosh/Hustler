// src/pages/Subjects/Subjects.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';
import {
  ChevronDown, ChevronRight, CheckCircle2, Circle,
  Play, ExternalLink
} from 'lucide-react';
import { ALL_SUBJECTS } from '../../data/careerData.js';
import './Subjects.css';

const SUBJECTS = ALL_SUBJECTS;

const STORAGE_KEY = 'hustler_subject_progress';

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function saveLocal(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function Subjects() {
  const navigate = useNavigate();
  const [progress, setProgress]   = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [expanded, setExpanded]   = useState({});
  const [levelOpen, setLevelOpen] = useState({});
  const [activeTrack, setActiveTrack] = useState('fs');
  const saveTimerRef = useRef(null);

  useEffect(() => {
    api.get('/subjects/progress')
      .then(({ data }) => {
        const merged = { ...loadLocal(), ...data.progress };
        setProgress(merged);
        saveLocal(merged);
      })
      .catch(() => setProgress(loadLocal()))
      .finally(() => setProgressLoaded(true));
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;
    saveLocal(progress);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      api.put('/subjects/progress', { progress }).catch(() => {});
    }, 600);
    return () => clearTimeout(saveTimerRef.current);
  }, [progress, progressLoaded]);

  function toggleTopic(subjectId, level, topic) {
    const key = `${subjectId}.${level}.${topic}`;
    setProgress(p => ({ ...p, [key]: !p[key] }));
  }

  function toggleSubject(id) {
    setExpanded(e => ({ ...e, [id]: !e[id] }));
  }

  function toggleLevel(subjectId, level) {
    const key = `${subjectId}.${level}`;
    setLevelOpen(l => ({ ...l, [key]: !l[key] }));
  }

  function studyNow(subject, topic) {
    navigate('/timer', { state: { subject: subject.timerSubject, topic } });
  }

  function getSubjectStats(subject) {
    const all = [...subject.beginner, ...subject.intermediate, ...subject.advanced];
    const done = all.filter(t =>
      progress[`${subject.id}.beginner.${t}`] ||
      progress[`${subject.id}.intermediate.${t}`] ||
      progress[`${subject.id}.advanced.${t}`]
    ).length;
    return { done, total: all.length };
  }

  function getLevelStats(subject, level) {
    const topics = subject[level];
    const done = topics.filter(t => progress[`${subject.id}.${level}.${t}`]).length;
    return { done, total: topics.length };
  }

  const visibleSubjects = SUBJECTS.filter(s => s.track === activeTrack);

  return (
    <div className="subjects-page">
      <div className="page-header">
        <h2>Subjects</h2>
        <p>Track your progress across every topic — Beginner to Advanced</p>
      </div>

      <div className="path-tabs">
        <button
          className={`path-tab${activeTrack === 'fs' ? ' active' : ''}`}
          onClick={() => setActiveTrack('fs')}
        >
          Full Stack Dev
        </button>
        <button
          className={`path-tab${activeTrack === 'da' ? ' active' : ''}`}
          onClick={() => setActiveTrack('da')}
        >
          Data Analytics
        </button>
      </div>

      <div className="subject-overview">
        {visibleSubjects.map(s => {
          const { done, total } = getSubjectStats(s);
          const pct = Math.round((done / total) * 100);
          return (
            <button
              key={s.id}
              className="overview-pill"
              style={{ '--pill-color': s.color }}
              onClick={() => {
                toggleSubject(s.id);
                document.getElementById(`subj-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span className="pill-name">{s.name}</span>
              <span className="pill-pct">{pct}%</span>
              <div className="pill-bar">
                <div className="pill-fill" style={{ width: `${pct}%`, background: s.color }} />
              </div>
            </button>
          );
        })}
      </div>

      {visibleSubjects.map(subject => {
        const { done, total } = getSubjectStats(subject);
        const pct = Math.round((done / total) * 100);
        const isOpen = expanded[subject.id];

        return (
          <div className="subject-card" key={subject.id} id={`subj-${subject.id}`}>
            <button className="subject-header" onClick={() => toggleSubject(subject.id)}>
              <div className="subject-title-row">
                <div className="subject-dot" style={{ background: subject.color }} />
                <span className="subject-name">{subject.name}</span>
                {subject.courseUrl && (
                  <a
                    href={subject.courseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="course-link-badge"
                    onClick={e => e.stopPropagation()}
                    title={`Open ${subject.courseLabel || 'course'}`}
                  >
                    <ExternalLink size={10} /> {subject.courseLabel || 'Course'}
                  </a>
                )}
                <span className="subject-stats">{done}/{total} topics</span>
              </div>
              <div className="subject-right">
                <div className="subject-bar-wrap">
                  <div className="subject-bar-track">
                    <div className="subject-bar-fill" style={{ width: `${pct}%`, background: subject.color }} />
                  </div>
                  <span className="subject-pct">{pct}%</span>
                </div>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>

            {isOpen && (
              <div className="subject-body">
                {['beginner', 'intermediate', 'advanced'].map(level => {
                  const { done: ld, total: lt } = getLevelStats(subject, level);
                  const levelKey = `${subject.id}.${level}`;
                  const isLevelOpen = levelOpen[levelKey] !== false;

                  return (
                    <div className="level-section" key={level}>
                      <button className="level-header" onClick={() => toggleLevel(subject.id, level)}>
                        <div className="level-left">
                          <span className={`level-badge level-${level}`}>{level}</span>
                          <span className="level-count">{ld}/{lt}</span>
                        </div>
                        {isLevelOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>

                      {isLevelOpen && (
                        <ul className="topic-list">
                          {subject[level].map(topic => {
                            const key = `${subject.id}.${level}.${topic}`;
                            const isDone = !!progress[key];
                            return (
                              <li key={topic} className={`topic-item${isDone ? ' done' : ''}`}>
                                <button
                                  className="topic-check"
                                  onClick={() => toggleTopic(subject.id, level, topic)}
                                  aria-label={isDone ? 'Mark undone' : 'Mark done'}
                                >
                                  {isDone
                                    ? <CheckCircle2 size={16} className="check-done" />
                                    : <Circle size={16} className="check-empty" />
                                  }
                                </button>
                                <span className="topic-name">{topic}</span>
                                <button
                                  className="study-btn"
                                  onClick={() => studyNow(subject, topic)}
                                  title="Start timer for this topic"
                                >
                                  <Play size={11} /> Study
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
