import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', note: '' });

  useEffect(() => {
    loadSavings();
  }, []);

  const loadSavings = async () => {
    const data = await api.savings.getAll();
    setSavings(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.savings.create(formData);
    setFormData({ amount: '', note: '' });
    setShowForm(false);
    loadSavings();
  };

  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Savings</h1>
        <p className="page-subtitle">Track your business savings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon savings">💎</div>
          <div className="stat-value">KES{totalSavings.toFixed(2)}</div>
          <div className="stat-label">Total Savings</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '✕ Cancel' : '+ Add Savings'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input type="number" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="form-label">Note (Optional)</label>
                <input type="text" placeholder="What's this for?" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="form-input" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add to Savings
            </button>
          </form>
        )}

        {savings.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
            <p>No savings recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-max min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Amount</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Note</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {savings.map(saving => (
                  <tr key={saving._id}>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '600', color: '#10b981', fontSize: '1.1rem' }}>+KES{saving.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{saving.note || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(saving.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Savings;