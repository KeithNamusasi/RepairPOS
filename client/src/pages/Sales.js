import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ productId: '', quantity: 1, paymentMethod: 'cash' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [salesData, productsData] = await Promise.all([
      api.sales.getAll(),
      api.products.getAll()
    ]);
    setSales(salesData);
    setProducts(productsData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await api.sales.create(formData);
    if (result.message) {
      alert(result.message);
    } else {
      setFormData({ productId: '', quantity: 1, paymentMethod: 'cash' });
      setShowForm(false);
      loadData();
    }
  };

  const totalToday = sales.filter(s => {
    const saleDate = new Date(s.date).toDateString();
    return saleDate === new Date().toDateString();
  }).reduce((sum, s) => sum + s.total, 0);

  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sales</h1>
        <p className="page-subtitle">Record and track your sales</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales">💰</div>
          <div className="stat-value">KES{totalToday.toFixed(2)}</div>
          <div className="stat-label">Today's Sales</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon profit">📈</div>
          <div className="stat-value">KES{totalProfit.toFixed(2)}</div>
          <div className="stat-label">Total Profit</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '✕ Cancel' : '+ New Sale'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
            <div className="form-group">
              <label className="form-label">Select Product</label>
              <select
                value={formData.productId}
                onChange={e => setFormData({...formData, productId: e.target.value})}
                className="form-select"
                required
              >
                <option value="">Choose a product...</option>
                {products.filter(p => p.stockQuantity > 0).map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} - KES{p.sellPrice} (Stock: {p.stockQuantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                  className="form-select"
                >
                  <option value="cash">💵 Cash</option>
                  <option value="mpesa">📱 M-Pesa</option>
                  <option value="card">💳 Card</option>
                  <option value="other">📋 Other</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Complete Sale
            </button>
          </form>
        )}

        {sales.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
            <p>No sales recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-max min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Product</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Qty</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Price</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Total</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Profit</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Payment</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale._id}>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '500' }}>{sale.productName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{sale.quantity}</td>
                    <td className="px-4 py-3 whitespace-nowrap">KES{sale.sellingPrice}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '600' }}>KES{sale.total}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#10b981', fontWeight: '600' }}>+KES{sale.profit}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(sale.date).toLocaleDateString()}</td>
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

export default Sales;