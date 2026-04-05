import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout, deleteAccount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async () => {
    if (!confirmPassword) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await deleteAccount(confirmPassword);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Profile Information</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="sidebar-avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{user?.username}</div>
              <div style={{ color: '#6b7280' }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <span className="badge" style={{ background: user?.role === 'admin' ? '#dbeafe' : '#f3f4f6', color: user?.role === 'admin' ? '#2563eb' : '#6b7280' }}>
              {user?.role || 'staff'}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Account Actions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            🚪 Sign Out
          </button>
          <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger" style={{ justifyContent: 'flex-start' }}>
            🗑️ Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Delete Account</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            {error && (
              <div className="message error" style={{ marginBottom: '1rem' }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Enter your password to confirm</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={handleDelete} className="btn btn-danger" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;