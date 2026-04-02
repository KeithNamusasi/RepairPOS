import React, { useState, useEffect } from 'react';
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

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Today's Sales</p>
          <p className="text-2xl font-bold">${stats?.totalSalesToday?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Today's Profit</p>
          <p className="text-2xl font-bold">${stats?.profitToday?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Purchases</p>
          <p className="text-2xl font-bold">${stats?.totalPurchases?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Repair Income</p>
          <p className="text-2xl font-bold">${stats?.totalRepairIncome?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Low Stock</p>
          <p className="text-2xl font-bold">{stats?.lowStock || 0}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Pending Repairs</p>
          <p className="text-2xl font-bold">{stats?.pendingRepairs || 0}</p>
        </div>
        <div className="bg-teal-100 p-4 rounded shadow">
          <p className="text-sm text-gray-600">Total Savings</p>
          <p className="text-2xl font-bold">${stats?.totalSavings?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;