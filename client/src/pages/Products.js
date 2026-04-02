import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', category: '', buyPrice: '', sellPrice: '', stockQuantity: '', supplier: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await api.products.getAll();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await api.products.update(editingProduct._id, formData);
    } else {
      await api.products.create(formData);
    }
    setFormData({ name: '', category: '', buyPrice: '', sellPrice: '', stockQuantity: '', supplier: '' });
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await api.products.delete(id);
      loadProducts();
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">Manage your product inventory</p>
      </div>

      <div className="card">
        <div className="card-header">
          <button
            onClick={() => { setShowForm(!showForm); setEditingProduct(null); setFormData({ name: '', category: '', buyPrice: '', sellPrice: '', stockQuantity: '', supplier: '' }); }}
            className="btn btn-primary"
          >
            {showForm ? '✕ Cancel' : '+ Add Product'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '12px' }}>
            <div className="form-row">
              <input type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input" required />
              <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="form-input" required />
              <input type="number" placeholder="Buy Price" value={formData.buyPrice} onChange={e => setFormData({...formData, buyPrice: e.target.value})} className="form-input" required />
              <input type="number" placeholder="Sell Price" value={formData.sellPrice} onChange={e => setFormData({...formData, sellPrice: e.target.value})} className="form-input" required />
              <input type="number" placeholder="Stock Quantity" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="form-input" required />
              <input type="text" placeholder="Supplier" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="form-input" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        )}

        <div className="search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-max min-w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Category</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Buy</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Sell</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Stock</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Supplier</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ fontWeight: '500' }}>{product.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><span style={{ background: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>{product.category}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap">KES {product.buyPrice}</td>
                    <td className="px-4 py-3 whitespace-nowrap">KES {product.sellPrice}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span style={{ 
                        color: product.stockQuantity < 5 ? '#ef4444' : '#10b981',
                        fontWeight: '600'
                      }}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{product.supplier || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button onClick={() => handleEdit(product)} style={{ marginRight: '0.5rem', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(product._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                    </td>
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

export default Products;