import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ productId: '', productName: '', supplier: '', quantity: 1, buyingPrice: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [purchasesData, productsData] = await Promise.all([
        api.purchases.getAll(),
        api.products.getAll()
      ]);
      setPurchases(purchasesData);
      setProducts(productsData);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!formData.productId && formData.productName) {
        const newProduct = await api.products.create({
          name: formData.productName,
          category: 'Auto Created',
          buyPrice: formData.buyingPrice,
          sellPrice: parseFloat(formData.buyingPrice) * 1.3,
          stockQuantity: formData.quantity,
          supplier: formData.supplier
        });
        formData.productId = newProduct._id;
      }
      await api.purchases.create(formData);
      setFormData({ productId: '', productName: '', supplier: '', quantity: 1, buyingPrice: '' });
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
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
          <div className="stat-value">KES{totalPurchases.toFixed(2)}</div>
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
            {error && <div style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', borderRadius: '8px' }}>{error}</div>}
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
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-max min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Product</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Supplier</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Qty</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Price</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Total</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map(purchase => (
                  <tr key={purchase._id}>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '500' }}>{purchase.productName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{purchase.supplier}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{purchase.quantity}</td>
                    <td className="px-4 py-3 whitespace-nowrap">KES{purchase.buyingPrice}</td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '600' }}>KES{purchase.totalCost}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(purchase.date).toLocaleDateString()}</td>
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