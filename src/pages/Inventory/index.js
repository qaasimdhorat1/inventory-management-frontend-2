import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [stockModal, setStockModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [formData, setFormData] = useState({
    name: '', description: '', sku: '', quantity: 0,
    price: '', low_stock_threshold: 10, category: '',
  });

  const [stockData, setStockData] = useState({
    change_type: 'addition', quantity: 1, reason: '',
  });

  const fetchItems = useCallback(async () => {
    try {
      let url = '/inventory/items/?';
      if (searchQuery) url += `search=${searchQuery}&`;
      if (filterStatus) url += `status=${filterStatus}&`;
      if (filterCategory) url += `category=${filterCategory}&`;
      const response = await api.get(url);
      setItems(response.data.results);
    } catch (err) {
      setError('Failed to load inventory items.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus, filterCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/inventory/categories/');
      setCategories(response.data.results);
    } catch (err) {
      console.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', sku: '', quantity: 0,
      price: '', low_stock_threshold: 10, category: '',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = { ...formData };
    if (!payload.category) delete payload.category;

    try {
      if (editingItem) {
        await api.patch(`/inventory/items/${editingItem.id}/`, payload);
      } else {
        await api.post('/inventory/items/', payload);
      }
      resetForm();
      fetchItems();
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.values(data).flat().join(' ');
        setError(messages);
      } else {
        setError('Failed to save item.');
      }
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      low_stock_threshold: item.low_stock_threshold,
      category: item.category || '',
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/inventory/items/${id}/`);
      fetchItems();
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/inventory/items/${stockModal.id}/stock/`, stockData);
      setStockModal(null);
      setStockData({ change_type: 'addition', quantity: 1, reason: '' });
      fetchItems();
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.values(data).flat().join(' ');
        setError(messages);
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'in_stock':
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'low_stock':
        return { backgroundColor: '#fff3e0', color: '#e65100' };
      case 'out_of_stock':
        return { backgroundColor: '#ffebee', color: '#c62828' };
      default:
        return {};
    }
  };

  if (loading) return <div style={styles.loading}>Loading inventory...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Inventory Items</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Name *</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} style={styles.input} required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>SKU *</label>
                <input
                  type="text" name="sku" value={formData.sku}
                  onChange={handleChange} style={styles.input} required
                  disabled={!!editingItem}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Price *</label>
                <input
                  type="number" name="price" value={formData.price}
                  onChange={handleChange} style={styles.input}
                  step="0.01" min="0" required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Quantity</label>
                <input
                  type="number" name="quantity" value={formData.quantity}
                  onChange={handleChange} style={styles.input} min="0"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Low Stock Threshold</label>
                <input
                  type="number" name="low_stock_threshold"
                  value={formData.low_stock_threshold}
                  onChange={handleChange} style={styles.input} min="0"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                <select
                  name="category" value={formData.category}
                  onChange={handleChange} style={styles.input}
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description" value={formData.description}
                onChange={handleChange} style={{ ...styles.input, height: '80px' }}
              />
            </div>
            <button type="submit" style={styles.submitBtn}>
              {editingItem ? 'Update Item' : 'Create Item'}
            </button>
          </form>
        </div>
      )}

      <div style={styles.filters}>
        <input
          type="text" placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <p style={styles.empty}>No inventory items found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>SKU</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.sku}</td>
                <td style={styles.td}>{item.category_name || '—'}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>
                  £{parseFloat(item.price).toFixed(2)}
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    ...getStatusStyle(item.status),
                  }}>
                    {item.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      onClick={() => setStockModal(item)}
                      style={styles.actionBtn}
                    >
                      Stock
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      style={styles.actionBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ ...styles.actionBtn, color: '#c62828' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {stockModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              Update Stock: {stockModal.name}
            </h2>
            <p style={styles.modalSubtitle}>
              Current quantity: {stockModal.quantity}
            </p>
            <form onSubmit={handleStockUpdate}>
              <div style={styles.field}>
                <label style={styles.label}>Change Type</label>
                <select
                  value={stockData.change_type}
                  onChange={(e) => setStockData({
                    ...stockData, change_type: e.target.value
                  })}
                  style={styles.input}
                >
                  <option value="addition">Add Stock</option>
                  <option value="removal">Remove Stock</option>
                  <option value="adjustment">Set Exact Quantity</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Quantity</label>
                <input
                  type="number" min="1"
                  value={stockData.quantity}
                  onChange={(e) => setStockData({
                    ...stockData, quantity: parseInt(e.target.value) || 0
                  })}
                  style={styles.input} required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Reason</label>
                <textarea
                  value={stockData.reason}
                  onChange={(e) => setStockData({
                    ...stockData, reason: e.target.value
                  })}
                  style={{ ...styles.input, height: '60px' }}
                  placeholder="Optional reason for this change"
                />
              </div>
              <div style={styles.modalActions}>
                <button type="submit" style={styles.submitBtn}>
                  Update Stock
                </button>
                <button
                  type="button"
                  onClick={() => setStockModal(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    margin: 0,
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    color: '#666',
  },
  error: {
    backgroundColor: '#ffe6e6',
    color: '#d32f2f',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },
  formTitle: {
    margin: '0 0 16px 0',
    fontSize: '20px',
    color: '#1a1a2e',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  field: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  cancelBtn: {
    padding: '10px 24px',
    backgroundColor: '#666',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minWidth: '150px',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '40px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #eee',
    fontSize: '13px',
    color: '#666',
    fontWeight: '600',
    backgroundColor: '#fafafa',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #f5f5f5',
    fontSize: '14px',
    color: '#333',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '4px 10px',
    backgroundColor: 'transparent',
    color: '#1a1a2e',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  },
  modalTitle: {
    margin: '0 0 4px 0',
    fontSize: '20px',
    color: '#1a1a2e',
  },
  modalSubtitle: {
    margin: '0 0 16px 0',
    color: '#666',
    fontSize: '14px',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
};

export default Inventory;