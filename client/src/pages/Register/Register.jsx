// src/pages/Register/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth.js';
import toast from 'react-hot-toast';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">Hustler 2.0</div>
        <p className="auth-sub">Create your account — start grinding</p>

        <form onSubmit={submit}>
          <div className="auth-field">
            <label>Full name</label>
            <input value={form.name} onChange={set('name')} placeholder="Aman Ashutosh" required />
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="min 6 characters" required />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
