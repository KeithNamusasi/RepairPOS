import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ productId: '', productName: '', supplier: '', quantity: 1, buyingPrice: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [purchasesData, productsData] = await Promise.all([
      api.purchases.getAll(),
      api.products.getAll()
    ]);
    setPurchases(purchasesData);
    setProducts(productsData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.purchases.create(formData);
    setFormData({ productId: '', productName: '', supplier: '', quantity: 1, buyingPrice: '' });
    setShowForm(false);
    loadData();
  };

  const totalPurchases = purchases.reduce((sum, p) => sum + p.totalCost, 0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Purchases</h1>
        <p className="page-subtitle">Track inventory purchases from suppliers</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purchases">🛒</div>
          <div className="stat-value">${totalPurchases.toFixed(2)}</div>
          <div className="stat-label">Total Purchases</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? '✕ Cancel' : '+ Add Purchase'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
            <div className="form-group">
              <label className="form-label">Select Existing Product (Optional)</label>
              <select
                value={formData.productId}
                onChange={e => {
                  const product = products.find(p => p._id === e.target.value);
                  setFormData({ ...formData, productId: e.target.value, productName: product?.name || '' });
                }}
                className="form-select"
              >
                <option value="">Choose a product...</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <input type="text" placeholder="Product Name (if new)" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} className="form-input" />
              <input type="text" placeholder="Supplier Name" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="form-input" required />
              <input type="number" placeholder="Quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} className="form-input" min="1" required />
              <input type="number" placeholder="Buying Price" value={formData.buyingPrice} onChange={e => setFormData({...formData, buyingPrice: e.target.value})} className="form-input" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add Purchase
            </button>
          </form>
        )}

        {purchases.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
            <p>No purchases recorded yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Supplier</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(purchase => (
                  <tr key={purchase._id}>
                    <td style={{ fontWeight: '500' }}>{purchase.productName}</td>
                    <td>{purchase.supplier}</td>
                    <td>{purchase.quantity}</td>
                    <td>${purchase.buyingPrice}</td>
                    <td style={{ fontWeight: '600' }}>${purchase.totalCost}</td>
                    <td>{new Date(purchase.date).toLocaleDateString()}</td>
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

export default Purchases;