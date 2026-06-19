// client/src/lib/calendar.js — Calendar integration utility
// Supports: Google Calendar links (Android + iOS) and .ics download (desktop)

import {
  WEEKDAY, SATURDAY, SUNDAY,
  EVENING_WEEKDAY, EVENING_SATURDAY, EVENING_SUNDAY,
  CATEGORIES, START_DATE,
} from '../data/careerData.js';

function scheduleFor(mode) {
  return mode === 'evening'
    ? { weekday: EVENING_WEEKDAY, saturday: EVENING_SATURDAY, sunday: EVENING_SUNDAY }
    : { weekday: WEEKDAY, saturday: SATURDAY, sunday: SUNDAY };
}

const TZ = 'Asia/Kolkata';
// IST offset in minutes
const IST_OFFSET_MINS = 330;

// ─── Time parsing ─────────────────────────────────────────────────────────────

function parseTime(str) {
  const clean = str.trim();
  const isPM = /PM/i.test(clean);
  const isAM = /AM/i.test(clean);
  const [hStr, mStr] = clean.replace(/[APM\s]/gi, '').split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;
  return { h, m };
}

function parseTimeRange(timeStr) {
  const parts = timeStr.split('–').map(s => s.trim());
  if (parts.length !== 2) return null;
  const [startStr, endStr] = parts;
  const startHasAMPM = /[AP]M/i.test(startStr);
  const endHasPM     = /PM/i.test(endStr);
  const endHasAM     = /AM/i.test(endStr);
  // When start lacks AM/PM (e.g. '01:00 – 02:00 PM'), inherit period from end
  // so '01:00' → '01:00 PM' instead of being parsed as 1 AM
  const resolvedStart = (!startHasAMPM && (endHasPM || endHasAM))
    ? startStr + (endHasPM ? ' PM' : ' AM')
    : startStr;
  return { start: parseTime(resolvedStart), end: parseTime(endStr) };
}

function formatTime(h, m) {
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${pad(h12)}:${pad(m)} ${period}`;
}

// ─── Date formatting ──────────────────────────────────────────────────────────

function pad(n) { return String(n).padStart(2, '0'); }

// Returns YYYYMMDDTHHMMSS (local, no Z) for iCal TZID usage
function toICalLocal(date, h, m) {
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`;
}

// Returns YYYYMMDDTHHMMSSZ (UTC) for Google Calendar URLs
// IST = UTC+5:30, so subtract 5h30m
function toGCalUTC(date, h, m) {
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  const utcMs = d.getTime() - IST_OFFSET_MINS * 60 * 1000;
  const u = new Date(utcMs);
  return `${u.getUTCFullYear()}${pad(u.getUTCMonth() + 1)}${pad(u.getUTCDate())}T${pad(u.getUTCHours())}${pad(u.getUTCMinutes())}00Z`;
}

function uid() {
  return `hustler-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}@hustler`;
}

function esc(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function fold(str) {
  const lines = [];
  while (str.length > 75) {
    lines.push(str.slice(0, 75));
    str = ' ' + str.slice(75);
  }
  lines.push(str);
  return lines.join('\r\n');
}

function firstOccurrence(startDate, targetDow) {
  const d = new Date(startDate);
  const diff = (targetDow - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}

function getUntilDate() {
  const until = new Date(START_DATE);
  until.setMonth(until.getMonth() + 6);
  return until.toISOString().slice(0, 10).replace(/-/g, '');
}

// ─── Google Calendar link builder ────────────────────────────────────────────

// byday: 'MO,TU,WE,TH,FR' | 'SA' | 'SU'
function makeGCalLink(slot, firstDate, byday) {
  const range = parseTimeRange(slot.time);
  if (!range) return null;

  const crossesMidnight = range.end.h < range.start.h;
  const endDate = new Date(firstDate);
  if (crossesMidnight) endDate.setDate(endDate.getDate() + 1);

  const dtStart = toGCalUTC(firstDate, range.start.h, range.start.m);
  const dtEnd   = toGCalUTC(endDate,   range.end.h,   range.end.m);
  const untilStr = getUntilDate() + 'T000000Z';
  const rrule = `RRULE:FREQ=WEEKLY;BYDAY=${byday};UNTIL=${untilStr}`;

  const cat = CATEGORIES[slot.cat];
  const details = cat ? cat.label : '';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: slot.label,
    dates: `${dtStart}/${dtEnd}`,
    recur: rrule,
    ctz: TZ,
    details,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Returns all schedule slots with their Google Calendar add links.
 * Filters out sleep and off-type blocks by default.
 * @param {'morning'|'evening'} mode - which gym schedule to export
 * @returns {Array<{ label: string, time: string, cat: string, gcalUrl: string, dayType: string }>}
 */
export function getGCalLinks(mode = 'morning') {
  const { weekday, saturday, sunday } = scheduleFor(mode);

  const weekdayFirst  = firstOccurrence(START_DATE, 1);
  const saturdayFirst = firstOccurrence(START_DATE, 6);
  const sundayFirst   = firstOccurrence(START_DATE, 0);

  const result = [];

  const add = (slots, firstDate, byday, dayType) => {
    for (const slot of slots) {
      const gcalUrl = makeGCalLink(slot, firstDate, byday);
      if (gcalUrl) result.push({ ...slot, gcalUrl, dayType });
    }
  };

  add(weekday,  weekdayFirst,  'MO,TU,WE,TH,FR', 'Mon–Fri');
  add(saturday, saturdayFirst, 'SA',              'Saturdays');
  add(sunday,   sundayFirst,   'SU',              'Sundays');

  return result;
}

// ─── .ics export (desktop + iOS Safari) ──────────────────────────────────────

function slotsToEvents(slots, firstDate, rruleByDay, untilStr) {
  const events = [];

  for (const slot of slots) {
    const range = parseTimeRange(slot.time);
    if (!range) continue;

    const startDate = new Date(firstDate);
    const endDate   = new Date(firstDate);
    if (range.end.h < range.start.h) endDate.setDate(endDate.getDate() + 1);

    const dtStart = toICalLocal(startDate, range.start.h, range.start.m);
    const dtEnd   = toICalLocal(endDate,   range.end.h,   range.end.m);
    const cat = CATEGORIES[slot.cat];

    events.push([
      'BEGIN:VEVENT',
      fold(`UID:${uid()}`),
      `DTSTART;TZID=${TZ}:${dtStart}`,
      `DTEND;TZID=${TZ}:${dtEnd}`,
      fold(`RRULE:FREQ=WEEKLY;BYDAY=${rruleByDay};UNTIL=${untilStr}T000000Z`),
      fold(`SUMMARY:${esc(slot.label)}`),
      fold(`DESCRIPTION:${esc(cat ? cat.label : '')}`),
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
    ].join('\r\n'));
  }

  return events;
}

/**
 * Returns a formatted text preview of the full week schedule (Mon–Sun)
 * exactly as it will be exported to calendar, with normalized AM/PM times.
 * @param {'morning'|'evening'} mode - which gym schedule to preview
 */
export function getSchedulePreview(mode = 'morning') {
  const { weekday, saturday, sunday } = scheduleFor(mode);
  const days = [
    { label: 'MONDAY',    slots: weekday },
    { label: 'TUESDAY',   slots: weekday },
    { label: 'WEDNESDAY', slots: weekday },
    { label: 'THURSDAY',  slots: weekday },
    { label: 'FRIDAY',    slots: weekday },
    { label: 'SATURDAY',  slots: saturday },
    { label: 'SUNDAY',    slots: sunday },
  ];

  return days.map(({ label, slots }) => {
    const lines = slots.map(slot => {
      const range = parseTimeRange(slot.time);
      if (!range) return `  ${slot.label}`;
      const s = formatTime(range.start.h, range.start.m);
      const e = formatTime(range.end.h, range.end.m);
      return `${s} – ${e}  ${slot.label}`;
    });
    return `${label}\n${lines.join('\n')}`;
  }).join('\n\n');
}

/**
 * Download the full weekly schedule as a .ics file.
 * On iOS Safari, uses a data: URI so it opens in Files/Calendar instead of downloading.
 * @param {'morning'|'evening'} mode - which gym schedule to export
 */
export function exportScheduleToCalendar(mode = 'morning') {
  const { weekday, saturday, sunday } = scheduleFor(mode);
  const untilStr = getUntilDate();

  const allEvents = [
    ...slotsToEvents(weekday,  firstOccurrence(START_DATE, 1), 'MO,TU,WE,TH,FR', untilStr),
    ...slotsToEvents(saturday, firstOccurrence(START_DATE, 6), 'SA', untilStr),
    ...slotsToEvents(sunday,   firstOccurrence(START_DATE, 0), 'SU', untilStr),
  ];

  const vcalendar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HUSTLER//Career Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:HUSTLER Study Schedule',
    `X-WR-TIMEZONE:${TZ}`,
    ...allEvents,
    'END:VCALENDAR',
  ].join('\r\n');

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    // iOS Safari: data URI opens directly in Calendar app
    window.location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(vcalendar)}`;
  } else {
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
}
