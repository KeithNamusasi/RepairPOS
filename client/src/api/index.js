const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

export const api = {
  products: {
    getAll: () => fetch(`${API_URL}/products`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (data) => fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse)
  },

  sales: {
    getAll: () => fetch(`${API_URL}/sales`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (data) => fetch(`${API_URL}/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse)
  },

  purchases: {
    getAll: () => fetch(`${API_URL}/purchases`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (data) => fetch(`${API_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse)
  },

  repairs: {
    getAll: () => fetch(`${API_URL}/repairs`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (data) => fetch(`${API_URL}/repairs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse),
    update: (id, data) => fetch(`${API_URL}/repairs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse)
  },

  savings: {
    getAll: () => fetch(`${API_URL}/savings`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (data) => fetch(`${API_URL}/savings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    }).then(handleResponse)
  },

  reports: {
    getSummary: () => fetch(`${API_URL}/reports/summary`, { headers: getAuthHeaders() }).then(handleResponse),
    getDailySales: (date) => fetch(`${API_URL}/reports/sales/daily?date=${date}`, { headers: getAuthHeaders() }).then(handleResponse),
    getMonthlySales: (month, year) => fetch(`${API_URL}/reports/sales/monthly?month=${month}&year=${year}`, { headers: getAuthHeaders() }).then(handleResponse),
    getProductStock: () => fetch(`${API_URL}/reports/products/stock`, { headers: getAuthHeaders() }).then(handleResponse),
    getRepairIncome: () => fetch(`${API_URL}/reports/repairs/income`, { headers: getAuthHeaders() }).then(handleResponse)
  }
};

export default api;