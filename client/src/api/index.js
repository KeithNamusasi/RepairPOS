const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  products: {
    getAll: () => fetch(`${API_URL}/products`, { headers: getAuthHeaders() }).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    update: (id, data) => fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id) => fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(res => res.json())
  },

  sales: {
    getAll: () => fetch(`${API_URL}/sales`, { headers: getAuthHeaders() }).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },

  purchases: {
    getAll: () => fetch(`${API_URL}/purchases`, { headers: getAuthHeaders() }).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },

  repairs: {
    getAll: () => fetch(`${API_URL}/repairs`, { headers: getAuthHeaders() }).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/repairs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    update: (id, data) => fetch(`${API_URL}/repairs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },

  savings: {
    getAll: () => fetch(`${API_URL}/savings`, { headers: getAuthHeaders() }).then(res => res.json()),
    create: (data) => fetch(`${API_URL}/savings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },

  reports: {
    getSummary: () => fetch(`${API_URL}/reports/summary`, { headers: getAuthHeaders() }).then(res => res.json()),
    getDailySales: (date) => fetch(`${API_URL}/reports/sales/daily?date=${date}`, { headers: getAuthHeaders() }).then(res => res.json()),
    getMonthlySales: (month, year) => fetch(`${API_URL}/reports/sales/monthly?month=${month}&year=${year}`, { headers: getAuthHeaders() }).then(res => res.json()),
    getProductStock: () => fetch(`${API_URL}/reports/products/stock`, { headers: getAuthHeaders() }).then(res => res.json()),
    getRepairIncome: () => fetch(`${API_URL}/reports/repairs/income`, { headers: getAuthHeaders() }).then(res => res.json())
  }
};

export default api;