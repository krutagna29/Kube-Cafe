import React, { useEffect, useState } from 'react';

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category_id: '', price: '', description: '', image: null });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', category_id: '', price: '', description: '', image: null });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const fetchMenu = () => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/menu', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Handle both new standardized format and old format
        if (data.success && data.data) {
          if (Array.isArray(data.data)) {
            setMenu(data.data);
          } else if (data.data.items) {
            setMenu(data.data.items);
          } else {
            setMenu(data.data);
          }
        } else {
          setMenu(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch('/api/menu/categories')
      .then(res => res.json())
      .then(data => {
        // Handle new standardized response format
        const categoriesData = data.success ? data.data : data;
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      });
  };

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm(f => ({ ...f, image: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAddMenuItem = async e => {
    e.preventDefault();
    setAdding(true);
    setError('');
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to add menu item');
      setForm({ name: '', category_id: '', price: '', description: '', image: null });
      fetchMenu();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this menu item?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setMenu(menu.filter(item => item.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = item => {
    setEditId(item.id);
    setEditForm({
      name: item.name || '',
      category_id: item.category_id || '',
      price: item.price || '',
      description: item.description || '',
      image: null
    });
  };

  const handleEditInputChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditForm(f => ({ ...f, image: files[0] }));
    } else {
      setEditForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleEditMenuItem = async e => {
    e.preventDefault();
    setEditing(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    try {
      const res = await fetch(`/api/menu/${editId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to update menu item');
      setEditId(null);
      fetchMenu();
    } catch (err) {
      alert(err.message);
    } finally {
      setEditing(false);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title mb-2">Menu Management</h1>
      <p className="admin-page-subtitle mb-4">Add, edit, and remove menu items</p>

      <form className="mb-4" onSubmit={handleAddMenuItem} encType="multipart/form-data">
        <div className="row g-2 align-items-end admin-form-row">
          <div className="col-12 col-sm-6 col-md"><input name="name" value={form.name} onChange={handleInputChange} className="form-control" placeholder="Name" required /></div>
          <div className="col-12 col-sm-6 col-md">
            <select name="category_id" value={form.category_id} onChange={handleInputChange} className="form-control form-select" required>
              <option value="">Select Category</option>
              {Array.isArray(categories) && categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md"><input name="price" value={form.price} onChange={handleInputChange} className="form-control" placeholder="Price" type="number" min="0" step="0.01" required /></div>
          <div className="col-12 col-sm-6 col-md"><input name="description" value={form.description} onChange={handleInputChange} className="form-control" placeholder="Description" /></div>
          <div className="col-12 col-sm-6 col-md"><input name="image" type="file" accept="image/*" onChange={handleInputChange} className="form-control" /></div>
          <div className="col-12 col-md-auto"><button className="btn btn-success w-100" type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add'}</button></div>
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
      </form>

      <div className="admin-table-wrap">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th><th>Category</th><th>Price</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map(item => (
            <tr key={item.id}>
              <td>
                {item.image_url ? (
                  <img
                    src={`/uploads/${(item.image_url || '').replace(/^uploads[\\/]/, '')}`}
                    alt={item.name}
                    className="admin-table-img"
                  />
                ) : (
                  <span>No image</span>
                )}
              </td>
              {editId === item.id ? (
                <>
                  <td><input name="name" value={editForm.name} onChange={handleEditInputChange} className="form-control" required /></td>
                  <td>
                    <select name="category_id" value={editForm.category_id} onChange={handleEditInputChange} className="form-control" required>
                      <option value="">Select Category</option>
                      {Array.isArray(categories) && categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </td>
                  <td><input name="price" value={editForm.price} onChange={handleEditInputChange} className="form-control" type="number" min="0" step="0.01" required /></td>
                  <td>
                    <button className="btn btn-sm btn-success me-2" onClick={handleEditMenuItem} disabled={editing}>{editing ? 'Saving...' : 'Save'}</button>
                    <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                    <input name="image" type="file" accept="image/*" onChange={handleEditInputChange} className="form-control mt-2" />
                  </td>
                </>
              ) : (
                <>
                  <td>{item.name}</td>
                  <td>{item.category || item.category_name || (categories.find(cat => cat.id === item.category_id)?.name) || '-'}</td>
                  <td>₹{Number(item.price).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(item)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
} 