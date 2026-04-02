import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="auth-title">Welcome Back!</h1>
        <p className="auth-subtitle">Sign in to manage your repair shop</p>

        {error && (
          <div className="message error" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-illustration">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            <rect x="10" y="20" width="100" height="50" rx="8" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="2"/>
            <rect x="20" y="30" width="30" height="20" rx="4" fill="#6366f1" opacity="0.3"/>
            <rect x="55" y="30" width="30" height="20" rx="4" fill="#10b981" opacity="0.3"/>
            <rect x="90" y="30" width="20" height="20" rx="4" fill="#f59e0b" opacity="0.3"/>
            <circle cx="35" cy="60" r="8" fill="#6366f1" opacity="0.5"/>
            <circle cx="70" cy="60" r="8" fill="#10b981" opacity="0.5"/>
          </svg>
        </div>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;