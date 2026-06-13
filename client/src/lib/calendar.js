// client/src/lib/calendar.js — Apple Calendar / iCal export utility
// Generates .ics files for recurring weekly schedule events
// Uses Asia/Kolkata timezone (IST, UTC+5:30)

import { WEEKDAY, SATURDAY, SUNDAY, CATEGORIES, START_DATE } from '../data/careerData.js';

const TZ = 'Asia/Kolkata';

// Parses "10:30 AM" → { h: 10, m: 30 } in 24h
function parseTime(str) {
  const clean = str.trim();
  const isPM = clean.toUpperCase().includes('PM');
  const isAM = clean.toUpperCase().includes('AM');
  const [hStr, mStr] = clean.replace(/[APM]/gi, '').trim().split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;
  return { h, m };
}

// Parses "10:30 AM – 01:00 PM" → { start: {h,m}, end: {h,m} }
function parseTimeRange(timeStr) {
  const parts = timeStr.split('–').map(s => s.trim());
  if (parts.length !== 2) return null;
  return { start: parseTime(parts[0]), end: parseTime(parts[1]) };
}

// Format date + time to iCal local datetime string
// Returns "YYYYMMDDTHHMMSS"
function toICalLocal(date, h, m) {
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

// Generate a random UID
function uid() {
  return `hustler-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}@hustler`;
}

// Escape text for iCal
function esc(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// Fold long lines per RFC 5545 (max 75 octets)
function fold(str) {
  const lines = [];
  while (str.length > 75) {
    lines.push(str.slice(0, 75));
    str = ' ' + str.slice(75);
  }
  lines.push(str);
  return lines.join('\r\n');
}

/**
 * Build iCal VEVENT blocks for one schedule day
 * @param {Array} slots - WEEKDAY | SATURDAY | SUNDAY
 * @param {Date} firstDate - the first occurrence date of this day type
 * @param {string} rruleByDay - 'MO,TU,WE,TH,FR' | 'SA' | 'SU'
 * @param {string} untilDate - YYYYMMDD until which to repeat
 * @returns {string[]} array of VEVENT strings
 */
function slotsToEvents(slots, firstDate, rruleByDay, untilDate) {
  const events = [];

  for (const slot of slots) {
    const range = parseTimeRange(slot.time);
    if (!range) continue;

    let startDate = new Date(firstDate);
    let endDate = new Date(firstDate);

    // Handle overnight slots (e.g., "10:00 PM – 06:00 AM")
    const crossesMidnight = range.end.h < range.start.h;
    if (crossesMidnight) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const dtStart = toICalLocal(startDate, range.start.h, range.start.m);
    const dtEnd   = toICalLocal(endDate,   range.end.h,   range.end.m);
    const cat = CATEGORIES[slot.cat];
    const summary = slot.label;
    const description = cat ? cat.label : '';

    events.push([
      'BEGIN:VEVENT',
      fold(`UID:${uid()}`),
      `DTSTART;TZID=${TZ}:${dtStart}`,
      `DTEND;TZID=${TZ}:${dtEnd}`,
      fold(`RRULE:FREQ=WEEKLY;BYDAY=${rruleByDay};UNTIL=${untilDate}T000000Z`),
      fold(`SUMMARY:${esc(summary)}`),
      fold(`DESCRIPTION:${esc(description)}`),
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    ].join('\r\n'));
  }

  return events;
}

/**
 * Get the first occurrence of a given weekday (0=Sun, 6=Sat) on or after startDate
 */
function firstOccurrence(startDate, targetDow) {
  const d = new Date(startDate);
  const current = d.getDay();
  const diff = (targetDow - current + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Export the weekly schedule as a .ics file and trigger download
 * @param {Object} opts - optional: { untilDate: 'YYYYMMDD' }
 */
export function exportScheduleToCalendar(opts = {}) {
  // 6 months from START_DATE
  const until = new Date(START_DATE);
  until.setMonth(until.getMonth() + 6);
  const untilStr = opts.untilDate || until.toISOString().slice(0, 10).replace(/-/g, '');

  const allEvents = [
    ...slotsToEvents(WEEKDAY,  firstOccurrence(START_DATE, 1), 'MO,TU,WE,TH,FR', untilStr),
    ...slotsToEvents(SATURDAY, firstOccurrence(START_DATE, 6), 'SA', untilStr),
    ...slotsToEvents(SUNDAY,   firstOccurrence(START_DATE, 0), 'SU', untilStr),
  ];

  const vcalendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HUSTLER//Career Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:HUSTLER Study Schedule`,
    `X-WR-TIMEZONE:${TZ}`,
    ...allEvents,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([vcalendar], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'hustler-schedule.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
