import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRepair, setPaymentRepair] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [formData, setFormData] = useState({
    customerName: '', phoneNumber: '', device: '', problemDescription: '', repairCost: '', status: 'Pending', amountPaid: 0
  });

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    try {
      const data = await api.repairs.getAll();
      setRepairs(data);
    } catch (err) {
      setError('Failed to load repairs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.repairs.create(formData);
      setFormData({ customerName: '', phoneNumber: '', device: '', problemDescription: '', repairCost: '', status: 'Pending', amountPaid: 0 });
      setShowForm(false);
      loadRepairs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setError('');
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'Completed') {
        updateData.dateCompleted = new Date();
      }
      await api.repairs.update(id, updateData);
      loadRepairs();
    } catch (err) {
      setError(err.message);
    }
  };

  const openPaymentModal = (repair) => {
    setPaymentRepair(repair);
    setPaymentAmount('');
    setShowPaymentModal(true);
  };

  const handleAddPayment = async () => {
    if (!paymentRepair || !paymentAmount) return;
    setError('');
    try {
      const newAmount = (paymentRepair.amountPaid || 0) + parseFloat(paymentAmount);
      await api.repairs.update(paymentRepair._id, { amountPaid: newAmount });
      setShowPaymentModal(false);
      setPaymentRepair(null);
      loadRepairs();
    } catch (err) {
      setError(err.message);
    }
  };

  const pendingCount = repairs.filter(r => r.status === 'Pending').length;
  const completedCount = repairs.filter(r => r.status === 'Completed' || r.status === 'Collected').length;
  const cancelledCount = repairs.filter(r => r.status === 'Cancelled' || r.status === 'Unrepairable').length;
  const totalIncome = repairs.filter(r => r.status === 'Completed' || r.status === 'Collected').reduce((sum, r) => sum + r.repairCost, 0);

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
          <div className="stat-value">KES{totalIncome.toFixed(2)}</div>
          <div className="stat-label">Total Income</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2' }}>❌</div>
          <div className="stat-value">{cancelledCount}</div>
          <div className="stat-label">Cancelled/Unrepairable</div>
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
            {error && <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px' }}>{error}</div>}
            <div className="form-row">
              <input type="text" placeholder="Customer Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="form-input" required />
              <input type="text" placeholder="Phone Number (optional)" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="form-input" />
              <input type="text" placeholder="Device (e.g. iPhone 12)" value={formData.device} onChange={e => setFormData({...formData, device: e.target.value})} className="form-input" required />
              <input type="number" placeholder="Repair Cost (KES)" value={formData.repairCost} onChange={e => setFormData({...formData, repairCost: e.target.value})} className="form-input" required />
            </div>
            <div className="form-row">
              <input type="number" placeholder="Amount Paid (KES)" value={formData.amountPaid} onChange={e => setFormData({...formData, amountPaid: parseFloat(e.target.value) || 0})} className="form-input" min="0" />
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
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-max min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Customer</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Device</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Problem</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Cost</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Paid</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Balance</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map(repair => {
                  const balance = (repair.repairCost || 0) - (repair.amountPaid || 0);
                  return (
                  <tr key={repair._id}>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '500' }}>{repair.customerName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{repair.phoneNumber || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{repair.device}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{repair.problemDescription}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '600' }}>KES{repair.repairCost}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#059669' }}>KES{repair.amountPaid || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: balance > 0 ? '#dc2626' : '#059669', fontWeight: '600' }}>
                      KES{balance}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`badge badge-${repair.status.toLowerCase().replace(' ', '-')}`}>
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(repair.dateReceived).toLocaleDateString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
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
                        <option value="Cancelled">Cancelled</option>
                        <option value="Unrepairable">Unrepairable</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add Payment</h3>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              {paymentRepair?.customerName} - {paymentRepair?.device}
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Outstanding: <strong style={{ color: '#dc2626' }}>KES{(paymentRepair?.repairCost || 0) - (paymentRepair?.amountPaid || 0)}</strong>
            </p>
            <input
              type="number"
              placeholder="Amount to pay"
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
              className="form-input"
              style={{ marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleAddPayment} className="btn btn-primary">Add Payment</button>
              <button onClick={() => setShowPaymentModal(false)} className="btn" style={{ background: '#e5e7eb' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repairs;