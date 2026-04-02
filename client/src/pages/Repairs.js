import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '', phoneNumber: '', device: '', problemDescription: '', repairCost: '', status: 'Pending'
  });

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    const data = await api.repairs.getAll();
    setRepairs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.repairs.create(formData);
    setFormData({ customerName: '', phoneNumber: '', device: '', problemDescription: '', repairCost: '', status: 'Pending' });
    setShowForm(false);
    loadRepairs();
  };

  const handleStatusChange = async (id, newStatus) => {
    const updateData = { status: newStatus };
    if (newStatus === 'Completed') {
      updateData.dateCompleted = new Date();
    }
    await api.repairs.update(id, updateData);
    loadRepairs();
  };

  const pendingCount = repairs.filter(r => r.status === 'Pending').length;
  const completedCount = repairs.filter(r => r.status === 'Completed' || r.status === 'Collected').length;
  const totalIncome = repairs.filter(r => r.status !== 'Pending').reduce((sum, r) => sum + r.repairCost, 0);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Repairs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Repair'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold">{completedCount}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-2xl font-bold">${totalIncome}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 grid grid-cols-2 gap-4">
          <input type="text" placeholder="Customer Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="border p-2 rounded" required />
          <input type="text" placeholder="Phone Number" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} className="border p-2 rounded" required />
          <input type="text" placeholder="Device" value={formData.device} onChange={e => setFormData({...formData, device: e.target.value})} className="border p-2 rounded" required />
          <input type="number" placeholder="Repair Cost" value={formData.repairCost} onChange={e => setFormData({...formData, repairCost: e.target.value})} className="border p-2 rounded" required />
          <textarea placeholder="Problem Description" value={formData.problemDescription} onChange={e => setFormData({...formData, problemDescription: e.target.value})} className="border p-2 rounded col-span-2" required />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded col-span-2">Add Repair</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Device</th>
              <th className="p-3 text-left">Problem</th>
              <th className="p-3 text-left">Cost</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {repairs.map(repair => (
              <tr key={repair._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{repair.customerName}</td>
                <td className="p-3">{repair.phoneNumber}</td>
                <td className="p-3">{repair.device}</td>
                <td className="p-3">{repair.problemDescription.substring(0, 30)}...</td>
                <td className="p-3">${repair.repairCost}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    repair.status === 'Pending' ? 'bg-yellow-200' :
                    repair.status === 'In Repair' ? 'bg-blue-200' :
                    repair.status === 'Completed' ? 'bg-green-200' : 'bg-gray-200'
                  }`}>
                    {repair.status}
                  </span>
                </td>
                <td className="p-3">{new Date(repair.dateReceived).toLocaleDateString()}</td>
                <td className="p-3">
                  <select
                    value={repair.status}
                    onChange={e => handleStatusChange(repair._id, e.target.value)}
                    className="border p-1 rounded text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Repair">In Repair</option>
                    <option value="Completed">Completed</option>
                    <option value="Collected">Collected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Repairs;