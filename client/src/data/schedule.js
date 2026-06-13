// Shared schedule + category definitions for DailyTracker and WeeklyView

export const CATEGORIES = {
  health:    { label: 'Gym / Health',     color: 'var(--green)',   bg: 'var(--green-light)' },
  fullstack: { label: 'Full Stack Dev',   color: 'var(--blue)',    bg: 'var(--blue-light)' },
  analytics: { label: 'Data Analytics',  color: 'var(--amber)',   bg: 'var(--amber-light)' },
  project:   { label: 'Project Work',    color: 'var(--purple)',  bg: 'var(--purple-light)' },
  jobs:      { label: 'Jobs / LinkedIn', color: 'var(--cyan)',    bg: 'rgba(0,191,255,0.10)' },
  break:     { label: 'Break / Meals',   color: 'var(--text3)',   bg: 'var(--surface-2)' },
  sleep:     { label: 'Sleep',           color: 'var(--text3)',   bg: 'var(--surface-3)' },
  blocked:   { label: 'Blocked',         color: 'var(--red)',     bg: 'var(--red-light)' },
};

export const WEEKDAY = [
  { time: '10:00 PM – 06:00 AM', label: 'Sleep',                                    cat: 'sleep' },
  { time: '06:00 AM – 10:00 AM', label: 'Gym + Travel + Post-workout',               cat: 'health' },
  { time: '10:00 AM – 10:30 AM', label: 'Breakfast',                                 cat: 'break' },
  { time: '10:30 AM – 01:00 PM', label: 'Study Block 1 — Full Stack Dev (React/JS)', cat: 'fullstack' },
  { time: '01:00 PM – 02:00 PM', label: 'Lunch + Rest',                              cat: 'break' },
  { time: '02:00 PM – 05:00 PM', label: 'Study Block 2 — Backend / Node.js',         cat: 'fullstack' },
  { time: '05:00 PM – 05:30 PM', label: 'Tea + Walk',                                cat: 'break' },
  { time: '05:30 PM – 07:00 PM', label: 'Study Block 3 — Data Analytics',            cat: 'analytics' },
  { time: '07:00 PM – 09:00 PM', label: 'Project Work',                              cat: 'project' },
  { time: '09:00 PM – 09:30 PM', label: 'Dinner',                                    cat: 'break' },
  { time: '09:30 PM – 10:00 PM', label: 'LinkedIn + Job Applications',               cat: 'jobs' },
];

export const SATURDAY = [
  { time: '06:00 AM – 10:00 AM', label: 'Gym + Travel',             cat: 'health' },
  { time: '10:30 AM – 01:30 PM', label: 'Project Build',            cat: 'project' },
  { time: '02:30 PM – 05:00 PM', label: 'Data Analytics Deep Dive', cat: 'analytics' },
  { time: '06:00 PM – 08:00 PM', label: 'Job Applications',         cat: 'jobs' },
  { time: '09:00 PM – 10:00 PM', label: 'Light Revision',           cat: 'fullstack' },
];

export const SUNDAY = [
  { time: '07:00 AM – 09:00 AM', label: 'Free Morning',            cat: 'break' },
  { time: '09:00 AM – 12:00 PM', label: 'Week Review',             cat: 'project' },
  { time: '01:00 PM – 04:00 PM', label: 'Portfolio / GitHub Work', cat: 'project' },
  { time: '05:00 PM – 06:00 PM', label: 'MARKET TRIP (blocked)',   cat: 'blocked' },
  { time: '08:00 PM – 09:30 PM', label: 'Plan Next Week',          cat: 'project' },
];

// dayOfWeek: 0=Sun, 1=Mon … 6=Sat
export function getSchedule(dayOfWeek) {
  if (dayOfWeek === 0) return SUNDAY;
  if (dayOfWeek === 6) return SATURDAY;
  return WEEKDAY;
}
