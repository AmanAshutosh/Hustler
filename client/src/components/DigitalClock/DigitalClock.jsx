import { useState, useEffect } from 'react';
import './DigitalClock.css';

const pad = n => String(n).padStart(2, '0');
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DigitalClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = now.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;

  const timeStr = `${pad(h12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
  const dayName = DAYS[now.getDay()];

  return (
    <div className="dclock">
      <div className="dclock-time">
        <span className="dclock-digits">{timeStr}</span>
        <span className="dclock-ampm">{ampm}</span>
      </div>
      <div className="dclock-meta">
        <span className="dclock-date">{dateStr}</span>
        <span className="dclock-sep">·</span>
        <span className="dclock-day">{dayName}</span>
      </div>
    </div>
  );
}
