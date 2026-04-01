import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout, deleteAccount } = useContext(AuthContext);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!confirmPassword) {
      setError('Please enter your password to confirm');
      return;
    }

    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(confirmPassword);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <h1>Dashboard</h1>
        
        <div className="dashboard-card">
          <h2>User Information</h2>
          <div className="user-info">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="dashboard-card delete-account">
          <h2>Delete Account</h2>
          <div className="delete-warning">
            Warning: Deleting your account is permanent and cannot be undone. All your data will be lost.
          </div>
          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}
          <form onSubmit={handleDelete}>
            <div className="form-group">
              <label htmlFor="confirmPassword">Enter your password to confirm deletion</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-danger" disabled={loading}>
              {loading ? 'Deleting...' : 'Delete My Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;