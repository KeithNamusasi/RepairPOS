import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '', phoneNumber: '', device: '', problemDescription: '', repairCost: '', status: 'Pending'
  });

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    const data = await api.repairs.getAll();
    setRepairs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.repairs.create(formData);
    setFormData({ customerName: '', phoneNumber: '', device: '', problemDescription: '', repairCost: '', status: 'Pending' });
    setShowForm(false);
    loadRepairs();
  };

  const handleStatusChange = async (id, newStatus) => {
    const updateData = { status: newStatus };
    if (newStatus === 'Completed') {
      updateData.dateCompleted = new Date();
    }
    await api.repairs.update(id, updateData);
    loadRepairs();
  };

  const pendingCount = repairs.filter(r => r.status === 'Pending').length;
  const completedCount = repairs.filter(r => r.status === 'Completed' || r.status === 'Collected').length;
  const totalIncome = repairs.filter(r => r.status !== 'Pending').reduce((sum, r) => sum + r.repairCost, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Repairs</h1>
        <p className="page-subtitle">Track device repairs and service jobs</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Pending Repairs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon repairs">✅</div>
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon profit">💵</div>
          <div className="stat-value">${totalIncome.toFixed(2)}</div>
          <div className="stat-label">Total Income</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '✕ Cancel' : '+ New Repair'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
            <div className="form-row">
              <input type="text" placeholder="Customer Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="form-input" required />
              <input type="text" placeholder="Phone Number" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="form-input" required />
              <input type="text" placeholder="Device (e.g. iPhone 12)" value={formData.device} onChange={e => setFormData({...formData, device: e.target.value})} className="form-input" required />
              <input type="number" placeholder="Repair Cost ($)" value={formData.repairCost} onChange={e => setFormData({...formData, repairCost: e.target.value})} className="form-input" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Problem Description" value={formData.problemDescription} onChange={e => setFormData({...formData, problemDescription: e.target.value})} className="form-textarea" rows="3" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Add Repair Job
            </button>
          </form>
        )}

        {repairs.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
            <p>No repair jobs yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Device</th>
                  <th>Problem</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map(repair => (
                  <tr key={repair._id}>
                    <td style={{ fontWeight: '500' }}>{repair.customerName}</td>
                    <td>{repair.phoneNumber}</td>
                    <td>{repair.device}</td>
                    <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{repair.problemDescription}</td>
                    <td style={{ fontWeight: '600' }}>${repair.repairCost}</td>
                    <td>
                      <span className={`badge badge-${repair.status.toLowerCase().replace(' ', '-')}`}>
                        {repair.status}
                      </span>
                    </td>
                    <td>{new Date(repair.dateReceived).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={repair.status}
                        onChange={e => handleStatusChange(repair._id, e.target.value)}
                        className="form-select"
                        style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Repair">In Repair</option>
                        <option value="Completed">Completed</option>
                        <option value="Collected">Collected</option>
                      </select>
                    </td>
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

export default Repairs;