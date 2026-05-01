import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './store/auth.js';
import { useTheme } from './context/ThemeContext.jsx';

import Layout     from './components/Layout/Layout.jsx';
import Dashboard  from './pages/Dashboard/Dashboard.jsx';
import Timer      from './pages/Timer/Timer.jsx';
import Heatmap    from './pages/Heatmap/Heatmap.jsx';
import Subjects   from './pages/Subjects/Subjects.jsx';
import DSATracker from './pages/DSATracker/DSATracker.jsx';
import Projects   from './pages/Projects/Projects.jsx';
import Practice   from './pages/Practice/Practice.jsx';
import Profile    from './pages/Profile/Profile.jsx';
import Login      from './pages/Login/Login.jsx';
import Register   from './pages/Register/Register.jsx';

// Redirect already-logged-in users away from auth pages
function AuthRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

// Require authentication to access app pages
function Guard({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function ToasterThemed() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontSize: '13px',
          borderRadius: '14px',
          fontFamily: 'inherit',
          background: dark ? 'rgba(13,13,28,0.96)' : 'rgba(255,255,255,0.96)',
          color: dark ? 'rgba(255,255,255,0.92)' : '#1c1c1e',
          border: dark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.09)',
          backdropFilter: 'blur(24px)',
          boxShadow: dark
            ? '0 8px 40px rgba(0,0,0,0.60)'
            : '0 8px 32px rgba(0,0,0,0.10)',
        },
      }}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToasterThemed />
      <Routes>
        <Route path="/login"    element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        <Route path="/" element={<Guard><Layout /></Guard>}>
          <Route index              element={<Dashboard />} />
          <Route path="timer"       element={<Timer />} />
          <Route path="heatmap"     element={<Heatmap />} />
          <Route path="subjects"    element={<Subjects />} />
          <Route path="dsa"         element={<DSATracker />} />
          <Route path="projects"    element={<Projects />} />
          <Route path="practice"    element={<Practice />} />
          <Route path="profile"     element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
