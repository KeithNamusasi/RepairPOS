import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.reports.getSummary();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div style={{ textAlign: 'center', color: 'white' }}>Loading...</div>
    </div>
  );

  const statCards = [
    { label: "Today's Sales", value: stats?.totalSalesToday, icon: '💰', color: 'sales' },
    { label: "Today's Profit", value: stats?.profitToday, icon: '📈', color: 'profit' },
    { label: 'Total Products', value: stats?.totalProducts, icon: '📦', color: 'products' },
    { label: 'Low Stock', value: stats?.lowStock, icon: '⚠️', color: 'stock' },
    { label: 'Pending Repairs', value: stats?.pendingRepairs, icon: '🔧', color: 'pending' },
    { label: 'Total Savings', value: stats?.totalSavings, icon: '💎', color: 'savings' },
    { label: 'Purchases', value: stats?.totalPurchases, icon: '🛒', color: 'purchases' },
    { label: 'Repair Income', value: stats?.totalRepairIncome, icon: '💵', color: 'repairs' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's your shop overview.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stat-value">
              {typeof stat.value === 'number' ? 
                (stat.value > 1000 ? `KES ${stat.value.toFixed(0)}` : stat.value) : 
                'KES 0'}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/sales" className="btn btn-primary">💰 New Sale</Link>
          <Link to="/products" className="btn btn-secondary">📦 Add Product</Link>
          <Link to="/repairs" className="btn btn-secondary">🔧 New Repair</Link>
          <Link to="/reports" className="btn btn-secondary">📊 View Reports</Link>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Shop Status</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontWeight: '600', color: '#166534' }}>Business Running</div>
            <div style={{ fontSize: '0.875rem', color: '#15803d' }}>All systems operational</div>
          </div>
          <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ fontWeight: '600', color: '#92400e' }}>Inventory Status</div>
            <div style={{ fontSize: '0.875rem', color: '#b45309' }}>{stats?.totalProducts || 0} products in stock</div>
          </div>
          <div style={{ padding: '1rem', background: '#f3e8ff', borderRadius: '12px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔧</div>
            <div style={{ fontWeight: '600', color: '#7c3aed' }}>Repairs</div>
            <div style={{ fontSize: '0.875rem', color: '#6d28d9' }}>{stats?.pendingRepairs || 0} pending repairs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;