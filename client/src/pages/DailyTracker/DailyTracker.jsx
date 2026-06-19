// src/pages/DailyTracker/DailyTracker.jsx
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Flame, Calendar, Trophy } from "lucide-react";
import api from "../../lib/api.js";
import toast from "react-hot-toast";
import { getSchedule, CATEGORIES } from "../../data/schedule.js";
import {
  getStoredGymMode,
  setStoredGymMode,
  GYM_MODE_CHANGE_EVENT,
} from "../../data/careerData.js";
import "./DailyTracker.css";

const HABITS = [
  { id: "gym", label: "Gym done", icon: "🏋️", cat: "health" },
  { id: "sleep", label: "Sleep 8 hours", icon: "😴", cat: "sleep" },
  {
    id: "study1",
    label: "Study Block 1 — Full Stack Dev",
    icon: "⚛️",
    cat: "fullstack",
  },
  {
    id: "study2",
    label: "Study Block 2 — Backend / Node.js",
    icon: "🖥️",
    cat: "fullstack",
  },
  {
    id: "study3",
    label: "Study Block 3 — Data Analytics",
    icon: "📊",
    cat: "analytics",
  },
  { id: "project", label: "Project work done", icon: "🛠️", cat: "project" },
  { id: "github", label: "GitHub commit made", icon: "🐙", cat: "fullstack" },
  {
    id: "linkedin",
    label: "LinkedIn / Job application done",
    icon: "💼",
    cat: "jobs",
  },
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DailyTracker() {
  const [habits, setHabits] = useState({});
  const [streaks, setStreaks] = useState({});
  const [loading, setLoading] = useState(true);
  const [gymMode, setGymMode] = useState(getStoredGymMode);

  const now = new Date();
  const dayIdx = now.getDay();
  const dayName = DAY_NAMES[dayIdx];
  const dateStr = `${now.getDate()} ${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
  const schedule = getSchedule(dayIdx, gymMode);

  const completedCount = HABITS.filter((h) => habits[h.id]).length;
  const completionPct = Math.round((completedCount / HABITS.length) * 100);

  useEffect(() => {
    Promise.all([api.get("/tracker/today"), api.get("/tracker/streaks")])
      .then(([t, s]) => {
        setHabits(t.data.habits || {});
        setStreaks(s.data || {});
      })
      .catch(() => toast.error("Could not load tracker data"))
      .finally(() => setLoading(false));
  }, []);

  // Sync gym mode across pages (e.g. if changed from Profile or WeeklyView)
  useEffect(() => {
    const handler = () => setGymMode(getStoredGymMode());
    window.addEventListener(GYM_MODE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(GYM_MODE_CHANGE_EVENT, handler);
  }, []);

  const handleGymModeChange = (mode) => {
    setGymMode(mode);
    setStoredGymMode(mode);
    window.dispatchEvent(new Event(GYM_MODE_CHANGE_EVENT));
  };

  const toggleHabit = async (habitId) => {
    const prev = { ...habits };
    const next = { ...habits, [habitId]: !habits[habitId] };
    setHabits(next);
    try {
      await api.post("/tracker/today", { habits: next });
    } catch {
      toast.error("Failed to save");
      setHabits(prev);
    }
  };

  if (loading)
    return (
      <div className="dt-page">
        <div className="dt-skeleton-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="dt-skeleton-card" />
          ))}
        </div>
      </div>
    );

  // SVG ring values
  const R = 26,
    CIRC = 2 * Math.PI * R;

  return (
    <div className="dt-page">
      {/* Page header */}
      <div className="page-header dt-header">
        <div>
          <h2>Daily Tracker</h2>
          <p className="dt-date-line">
            <Calendar
              size={13}
              style={{
                display: "inline",
                verticalAlign: "middle",
                marginRight: 5,
              }}
            />
            {dayName}, {dateStr}
          </p>
        </div>

        {/* Completion ring */}
        <div className="dt-ring-wrap">
          <svg className="dt-ring" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={R} className="dt-ring-bg" />
            <circle
              cx="32"
              cy="32"
              r={R}
              className="dt-ring-fill"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - completionPct / 100)}
            />
          </svg>
          <div className="dt-ring-inner">
            <span className="dt-ring-pct">{completionPct}%</span>
            <span className="dt-ring-sub">done</span>
          </div>
        </div>
      </div>

      <div className="dt-grid">
        {/* ── Habits panel ── */}
        <section className="dt-card">
          <div className="sec-title">
            <Trophy size={12} /> Daily Habits
          </div>

          <div className="dt-habits">
            {HABITS.map((h) => {
              const done = !!habits[h.id];
              const streak = streaks[h.id] || 0;
              const catColor = CATEGORIES[h.cat]?.color || "var(--text3)";
              return (
                <button
                  key={h.id}
                  className={`dt-habit${done ? " dt-habit-done" : ""}`}
                  onClick={() => toggleHabit(h.id)}
                  style={done ? { "--hc": catColor } : {}}
                >
                  <span className="dt-habit-icon">{h.icon}</span>
                  <span className="dt-habit-label">{h.label}</span>
                  <div className="dt-habit-right">
                    {streak > 0 && (
                      <span className="dt-streak">
                        <Flame size={11} />
                        {streak}d
                      </span>
                    )}
                    {done ? (
                      <CheckCircle2
                        size={18}
                        style={{ color: catColor, flexShrink: 0 }}
                      />
                    ) : (
                      <Circle
                        size={18}
                        style={{ color: "var(--border-2)", flexShrink: 0 }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="dt-habits-footer">
            <div className="dt-prog-track">
              <div
                className="dt-prog-fill"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="dt-prog-label">
              {completedCount} / {HABITS.length} habits completed today
            </span>
          </div>
        </section>

        {/* ── Today's schedule ── */}
        <section className="dt-card">
          <div className="dt-sched-header">
            <div className="sec-title">
              <Calendar size={12} /> {dayName}'s Schedule
            </div>
            <span className={`badge ${gymMode === "evening" ? "badge-indigo" : "badge-amber"}`}>
              {gymMode === "evening" ? "🌙 Evening Gym" : "🌅 Morning Gym"}
            </span>
          </div>

          <div className="path-tabs dt-gym-tabs">
            <button
              className={`path-tab${gymMode === "morning" ? " active" : ""}`}
              onClick={() => handleGymModeChange("morning")}
            >
              🌅 Morning Gym
            </button>
            <button
              className={`path-tab${gymMode === "evening" ? " active" : ""}`}
              onClick={() => handleGymModeChange("evening")}
            >
              🌙 Evening Gym
            </button>
          </div>

          <div className="dt-sched">
            {schedule.map((block, i) => {
              const cat = CATEGORIES[block.cat] || CATEGORIES.break;
              return (
                <div
                  key={i}
                  className="dt-sched-block"
                  style={{ "--cc": cat.color, "--cb": cat.bg }}
                >
                  <span className="dt-sched-dot" />
                  <div className="dt-sched-body">
                    <span className="dt-sched-time">{block.time}</span>
                    <span className="dt-sched-label">{block.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
