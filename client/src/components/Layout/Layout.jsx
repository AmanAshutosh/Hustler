// src/components/Layout/Layout.jsx
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Timer, Flame, BookOpen,
  Zap, FolderKanban, Layers, User, LogOut, Menu, X, Sun, Moon
} from 'lucide-react';
import { useAuth } from '../../store/auth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import Footer from '../Footer/Footer.jsx';
import Loader from '../Loader/Loader.jsx';
import api from '../../lib/api.js';
import './Layout.css';

const NAV = [
  { to: '/',         label: 'Dashboard',  Icon: LayoutDashboard },
  { to: '/timer',    label: 'Timer',      Icon: Timer },
  { to: '/heatmap',  label: 'Heatmap',    Icon: Flame },
  { to: '/subjects', label: 'Subjects',   Icon: BookOpen },
  { to: '/dsa',      label: 'DSA',        Icon: Zap },
  { to: '/projects', label: 'Projects',   Icon: FolderKanban },
  { to: '/practice', label: 'Practice',   Icon: Layers },
  { to: '/profile',  label: 'Profile',    Icon: User },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [todayHours, setTodayHours] = useState(0);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [loading, setLoading]       = useState(true);
  const [offline, setOffline]       = useState(false);

  useEffect(() => {
    setLoading(true);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    api.get('/health').then(() => setOffline(false)).catch(() => setOffline(true));
  }, []);

  useEffect(() => {
    api.get('/stats/weekly').then(({ data }) => {
      const today = new Date().toISOString().split('T')[0];
      setTodayHours(data[today] || 0);
    }).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const pct = Math.min(100, (todayHours / 8) * 100);
  const closeSidebar = () => setMenuOpen(false);

  return (
    <div className="app-shell">
      {loading && <Loader onDone={() => setLoading(false)} />}

      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="mobile-brand">Hustler 2.0</span>
        <div className="mobile-right">
          <button className="theme-toggle-mobile" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <span className="mobile-hours">{todayHours.toFixed(1)}h</span>
        </div>
      </header>

      {menuOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`sidebar${menuOpen ? ' sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">H</div>
          <div>
            <div className="sidebar-logo-name">Hustler 2.0</div>
            <div className="sidebar-logo-sub">Job Hunt Tracker</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={closeSidebar}
            >
              <Icon size={16} className="nav-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="daily-row">
            <span>Today — {user?.name?.split(' ')[0]}</span>
            <span className="daily-hours-val">{todayHours.toFixed(1)}h / 8h</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>

          <div className="sidebar-footer-actions">
            <button className="theme-toggle-btn" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark'
                ? <><Sun size={13} /><span>Light</span></>
                : <><Moon size={13} /><span>Dark</span></>
              }
            </button>
            <button className="sign-out-btn" onClick={handleLogout}>
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        {offline && (
          <div className="offline-banner">
            ⚠ Backend offline — run <code>npm run dev</code> to save data.
          </div>
        )}
        <main className="main-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
