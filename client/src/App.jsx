// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './store/auth.js';

import Layout     from './components/Layout/Layout.jsx';
import Dashboard  from './pages/Dashboard/Dashboard.jsx';
import Timer      from './pages/Timer/Timer.jsx';
import Heatmap    from './pages/Heatmap/Heatmap.jsx';
import Subjects   from './pages/Subjects/Subjects.jsx';
import DSATracker from './pages/DSATracker/DSATracker.jsx';
import Projects   from './pages/Projects/Projects.jsx';
import Profile    from './pages/Profile/Profile.jsx';
import Login      from './pages/Login/Login.jsx';
import Register   from './pages/Register/Register.jsx';

function Guard({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: '13px', borderRadius: '10px', fontFamily: 'inherit' },
        }}
      />
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Guard><Layout /></Guard>}>
          <Route index              element={<Dashboard />} />
          <Route path="timer"       element={<Timer />} />
          <Route path="heatmap"     element={<Heatmap />} />
          <Route path="subjects"    element={<Subjects />} />
          <Route path="dsa"         element={<DSATracker />} />
          <Route path="projects"    element={<Projects />} />
          <Route path="profile"     element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
