import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', note: '' });

  useEffect(() => {
    loadSavings();
  }, []);

  const loadSavings = async () => {
    const data = await api.savings.getAll();
    setSavings(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.savings.create(formData);
    setFormData({ amount: '', note: '' });
    setShowForm(false);
    loadSavings();
  };

  const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Savings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Savings'}
        </button>
      </div>

      <div className="bg-green-100 p-4 rounded mb-4">
        <p className="text-sm text-gray-600">Total Savings</p>
        <p className="text-2xl font-bold">${totalSavings.toFixed(2)}</p>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={e => setFormData({...formData, amount: e.target.value})}
            className="border p-2 rounded w-full mb-2"
            required
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={formData.note}
            onChange={e => setFormData({...formData, note: e.target.value})}
            className="border p-2 rounded w-full mb-2"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Add</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Note</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {savings.map(saving => (
              <tr key={saving._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-bold">${saving.amount}</td>
                <td className="p-3">{saving.note || '-'}</td>
                <td className="p-3">{new Date(saving.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Savings;