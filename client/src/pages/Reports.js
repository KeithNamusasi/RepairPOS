import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [productStock, setProductStock] = useState([]);
  const [repairIncome, setRepairIncome] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const summaryData = await api.reports.getSummary();
    setSummary(summaryData);
    
    const today = new Date().toISOString().split('T')[0];
    const dailyData = await api.reports.getDailySales(today);
    setDailySales(dailyData);
    
    const stockData = await api.reports.getProductStock();
    setProductStock(stockData);
    
    const repairData = await api.reports.getRepairIncome();
    setRepairIncome(repairData);
  };

  if (!summary) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div style={{ color: 'white' }}>Loading...</div>
    </div>
  );

  const tabs = [
    { id: 'summary', label: '📊 Summary', icon: '📊' },
    { id: 'daily', label: '📅 Daily Sales', icon: '📅' },
    { id: 'stock', label: '📦 Stock', icon: '📦' },
    { id: 'repairs', label: '🔧 Repairs', icon: '🔧' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">View business analytics and insights</p>
      </div>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab KES{activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon sales">💰</div>
            <div className="stat-value">KES{summary.totalSalesToday.toFixed(2)}</div>
            <div className="stat-label">Today's Sales</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon profit">📈</div>
            <div className="stat-value">KES{summary.profitToday.toFixed(2)}</div>
            <div className="stat-label">Today's Profit</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purchases">🛒</div>
            <div className="stat-value">KES{summary.totalPurchases.toFixed(2)}</div>
            <div className="stat-label">Total Purchases</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon repairs">🔧</div>
            <div className="stat-value">KES{summary.totalRepairIncome.toFixed(2)}</div>
            <div className="stat-label">Repair Income</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon products">📦</div>
            <div className="stat-value">{summary.totalProducts}</div>
            <div className="stat-label">Total Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stock">⚠️</div>
            <div className="stat-value">{summary.lowStock}</div>
            <div className="stat-label">Low Stock Items</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-value">{summary.pendingRepairs}</div>
            <div className="stat-label">Pending Repairs</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon savings">💎</div>
            <div className="stat-value">KES{summary.totalSavings.toFixed(2)}</div>
            <div className="stat-label">Total Savings</div>
          </div>
        </div>
      )}

      {activeTab === 'daily' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📅 Today's Sales</h2>
          </div>
          <div className="stat-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>Total Revenue</div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>KES{dailySales.total.toFixed(2)}</div>
            <div style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.9)' }}>📈 Profit: KES{dailySales.profit.toFixed(2)}</div>
          </div>
          {dailySales.sales.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <p>No sales today</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-max min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Product</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Qty</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Total</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySales.sales.map(sale => (
                    <tr key={sale._id}>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '500' }}>{sale.productName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{sale.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '600' }}>KES{sale.total}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#10b981', fontWeight: '600' }}>+KES{sale.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📦 Product Stock</h2>
          </div>
          {productStock.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <p>No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-max min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Product</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Category</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Buy</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Sell</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productStock.map(product => (
                    <tr key={product._id} style={product.stockQuantity < 5 ? { background: '#fef2f2' } : {}}>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '500' }}>{product.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap"><span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>{product.category}</span></td>
                      <td className="px-4 py-3 whitespace-nowrap">KES{product.buyPrice}</td>
                      <td className="px-4 py-3 whitespace-nowrap">KES{product.sellPrice}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '700', color: product.stockQuantity < 5 ? '#ef4444' : '#10b981' }}>{product.stockQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'repairs' && repairIncome && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🔧 Repair Jobs</h2>
          </div>
          <div className="stat-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>Total Repair Income</div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>KES{repairIncome.totalIncome.toFixed(2)}</div>
          </div>
          {repairIncome.repairs.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
              <p>No repair jobs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-max min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Customer</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Device</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {repairIncome.repairs.map(repair => (
                    <tr key={repair._id}>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '500' }}>{repair.customerName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{repair.device}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`badge badge-KES{repair.status.toLowerCase().replace(' ', '-')}`}>
                          {repair.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '600' }}>KES{repair.repairCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;