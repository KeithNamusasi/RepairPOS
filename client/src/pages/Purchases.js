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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Purchases</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Purchase'}
        </button>
      </div>

      <div className="bg-orange-100 p-4 rounded mb-4">
        <p className="text-sm text-gray-600">Total Purchases</p>
        <p className="text-2xl font-bold">${totalPurchases.toFixed(2)}</p>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
          <select
            value={formData.productId}
            onChange={e => {
              const product = products.find(p => p._id === e.target.value);
              setFormData({ ...formData, productId: e.target.value, productName: product?.name || '' });
            }}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="">Select Existing Product (Optional)</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Product Name (if new)"
            value={formData.productName}
            onChange={e => setFormData({...formData, productName: e.target.value})}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Supplier"
            value={formData.supplier}
            onChange={e => setFormData({...formData, supplier: e.target.value})}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
            className="border p-2 rounded w-full mb-2"
            min="1"
            required
          />
          <input
            type="number"
            placeholder="Buying Price"
            value={formData.buyingPrice}
            onChange={e => setFormData({...formData, buyingPrice: e.target.value})}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Add Purchase</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => (
              <tr key={purchase._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{purchase.productName}</td>
                <td className="p-3">{purchase.supplier}</td>
                <td className="p-3">{purchase.quantity}</td>
                <td className="p-3">${purchase.buyingPrice}</td>
                <td className="p-3">${purchase.totalCost}</td>
                <td className="p-3">{new Date(purchase.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchases;