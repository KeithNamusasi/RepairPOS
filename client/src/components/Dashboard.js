import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [recentRepairs, setRecentRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryData, salesData, repairsData] = await Promise.all([
        api.reports.getSummary(),
        api.sales.getAll(),
        api.repairs.getAll()
      ]);
      setStats(summaryData);
      setRecentSales(salesData.slice(0, 5));
      setRecentRepairs(repairsData.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>Loading...</div>
    </div>
  );

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'KES 0';
    return `KES ${value.toLocaleString()}`;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.username}! 👋</h1>
        <p className="page-subtitle">Here's what's happening in your shop today.</p>
      </div>

      <div className="stats-grid">
        <Link to="/sales" className="stat-card" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div className="stat-icon sales">💰</div>
          <div className="stat-value">{formatCurrency(stats?.totalSalesToday)}</div>
          <div className="stat-label">Today's Sales</div>
        </Link>
        <Link to="/sales" className="stat-card" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div className="stat-icon profit">📈</div>
          <div className="stat-value">{formatCurrency(stats?.profitToday)}</div>
          <div className="stat-label">Today's Profit</div>
        </Link>
        <Link to="/products" className="stat-card" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div className="stat-icon products">📦</div>
          <div className="stat-value">{stats?.totalProducts || 0}</div>
          <div className="stat-label">Products</div>
        </Link>
        <Link to="/repairs" className="stat-card" style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <div className="stat-icon pending">🔧</div>
          <div className="stat-value">{stats?.pendingRepairs || 0}</div>
          <div className="stat-label">Pending Repairs</div>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">⚡ Quick Actions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/sales" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              💰 Record Sale
            </Link>
            <Link to="/products" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              📦 Add Product
            </Link>
            <Link to="/repairs" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              🔧 New Repair Job
            </Link>
            <Link to="/purchases" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              🛒 Add Purchase
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🔧 Recent Repairs</h2>
            <Link to="/repairs" style={{ fontSize: '0.875rem', color: '#6366f1' }}>View All</Link>
          </div>
          {recentRepairs.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No repairs yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentRepairs.map(repair => (
                <div key={repair._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{repair.device}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{repair.customerName}</div>
                  </div>
                  <span className={`badge badge-${repair.status.toLowerCase().replace(' ', '-')}`}>
                    {repair.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📊 Summary</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px' }}>
              <span style={{ color: '#166534' }}>Total Savings</span>
              <span style={{ fontWeight: '600', color: '#166534' }}>{formatCurrency(stats?.totalSavings)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#fef3c7', borderRadius: '8px' }}>
              <span style={{ color: '#92400e' }}>Total Purchases</span>
              <span style={{ fontWeight: '600', color: '#92400e' }}>{formatCurrency(stats?.totalPurchases)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f3e8ff', borderRadius: '8px' }}>
              <span style={{ color: '#7c3aed' }}>Repair Income</span>
              <span style={{ fontWeight: '600', color: '#7c3aed' }}>{formatCurrency(stats?.totalRepairIncome)}</span>
            </div>
            {stats?.lowStock > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#fef2f2', borderRadius: '8px' }}>
                <span style={{ color: '#dc2626' }}>⚠️ Low Stock Items</span>
                <span style={{ fontWeight: '600', color: '#dc2626' }}>{stats.lowStock}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;