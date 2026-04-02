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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Sale'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-600">Today's Sales</p>
          <p className="text-2xl font-bold">${totalToday.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm text-gray-600">Total Profit</p>
          <p className="text-2xl font-bold">${totalProfit.toFixed(2)}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
          <select
            value={formData.productId}
            onChange={e => setFormData({...formData, productId: e.target.value})}
            className="border p-2 rounded w-full mb-2"
            required
          >
            <option value="">Select Product</option>
            {products.filter(p => p.stockQuantity > 0).map(p => (
              <option key={p._id} value={p._id}>
                {p.name} - ${p.sellPrice} (Stock: {p.stockQuantity})
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
            className="border p-2 rounded w-full mb-2"
            min="1"
            required
          />
          <select
            value={formData.paymentMethod}
            onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Complete Sale</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Profit</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{sale.productName}</td>
                <td className="p-3">{sale.quantity}</td>
                <td className="p-3">${sale.sellingPrice}</td>
                <td className="p-3">${sale.total}</td>
                <td className="p-3 text-green-600">${sale.profit}</td>
                <td className="p-3">{sale.paymentMethod}</td>
                <td className="p-3">{new Date(sale.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;