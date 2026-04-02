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

  if (!summary) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="flex gap-2 mb-4">
        {['summary', 'daily', 'stock', 'repairs'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-100 p-4 rounded">
            <p className="text-sm text-gray-600">Today's Sales</p>
            <p className="text-2xl font-bold">${summary.totalSalesToday.toFixed(2)}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-sm text-gray-600">Today's Profit</p>
            <p className="text-2xl font-bold">${summary.profitToday.toFixed(2)}</p>
          </div>
          <div className="bg-orange-100 p-4 rounded">
            <p className="text-sm text-gray-600">Total Purchases</p>
            <p className="text-2xl font-bold">${summary.totalPurchases.toFixed(2)}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <p className="text-sm text-gray-600">Repair Income</p>
            <p className="text-2xl font-bold">${summary.totalRepairIncome.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{summary.totalProducts}</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <p className="text-sm text-gray-600">Low Stock</p>
            <p className="text-2xl font-bold">{summary.lowStock}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-600">Pending Repairs</p>
            <p className="text-2xl font-bold">{summary.pendingRepairs}</p>
          </div>
          <div className="bg-green-200 p-4 rounded">
            <p className="text-sm text-gray-600">Total Savings</p>
            <p className="text-2xl font-bold">${summary.totalSavings.toFixed(2)}</p>
          </div>
        </div>
      )}

      {activeTab === 'daily' && (
        <div>
          <div className="bg-green-100 p-4 rounded mb-4">
            <p className="text-sm text-gray-600">Today's Total</p>
            <p className="text-2xl font-bold">${dailySales.total.toFixed(2)}</p>
            <p className="text-green-600">Profit: ${dailySales.profit.toFixed(2)}</p>
          </div>
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Profit</th>
              </tr>
            </thead>
            <tbody>
              {dailySales.sales.map(sale => (
                <tr key={sale._id} className="border-t">
                  <td className="p-3">{sale.productName}</td>
                  <td className="p-3">{sale.quantity}</td>
                  <td className="p-3">${sale.total}</td>
                  <td className="p-3 text-green-600">${sale.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'stock' && (
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Buy Price</th>
              <th className="p-3 text-left">Sell Price</th>
              <th className="p-3 text-left">Stock</th>
            </tr>
          </thead>
          <tbody>
            {productStock.map(product => (
              <tr key={product._id} className={`border-t ${product.stockQuantity < 5 ? 'bg-red-50' : ''}`}>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">${product.buyPrice}</td>
                <td className="p-3">${product.sellPrice}</td>
                <td className="p-3 font-bold">{product.stockQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'repairs' && repairIncome && (
        <div>
          <div className="bg-purple-100 p-4 rounded mb-4">
            <p className="text-sm text-gray-600">Total Repair Income</p>
            <p className="text-2xl font-bold">${repairIncome.totalIncome.toFixed(2)}</p>
          </div>
          <table className="w-full bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Device</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Cost</th>
              </tr>
            </thead>
            <tbody>
              {repairIncome.repairs.map(repair => (
                <tr key={repair._id} className="border-t">
                  <td className="p-3">{repair.customerName}</td>
                  <td className="p-3">{repair.device}</td>
                  <td className="p-3">{repair.status}</td>
                  <td className="p-3">${repair.repairCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;