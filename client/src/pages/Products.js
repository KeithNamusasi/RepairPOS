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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingProduct(null); setFormData({ name: '', category: '', buyPrice: '', sellPrice: '', stockQuantity: '', supplier: '' }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 grid grid-cols-2 gap-4">
          <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border p-2 rounded" required />
          <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="border p-2 rounded" required />
          <input type="number" placeholder="Buy Price" value={formData.buyPrice} onChange={e => setFormData({...formData, buyPrice: e.target.value})} className="border p-2 rounded" required />
          <input type="number" placeholder="Sell Price" value={formData.sellPrice} onChange={e => setFormData({...formData, sellPrice: e.target.value})} className="border p-2 rounded" required />
          <input type="number" placeholder="Stock Quantity" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="border p-2 rounded" required />
          <input type="text" placeholder="Supplier" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded col-span-2">{editingProduct ? 'Update' : 'Add'} Product</button>
        </form>
      )}

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Buy</th>
              <th className="p-3 text-left">Sell</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">${product.buyPrice}</td>
                <td className="p-3">${product.sellPrice}</td>
                <td className="p-3">{product.stockQuantity}</td>
                <td className="p-3">{product.supplier}</td>
                <td className="p-3">
                  <button onClick={() => handleEdit(product)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;