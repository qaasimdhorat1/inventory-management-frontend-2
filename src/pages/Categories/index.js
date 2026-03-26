import { useState, useEffect } from 'react';
import api from '../../api/axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const response = await api.get('/inventory/categories/');
      setCategories(response.data.results);
    } catch (err) {
      setError('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingCategory) {
        await api.patch(`/inventory/categories/${editingCategory.id}/`, formData);
      } else {
        await api.post('/inventory/categories/', formData);
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.values(data).flat().join(' ');
        setError(messages);
      } else {
        setError('Failed to save category.');
      }
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? Items in this category will become uncategorised.')) return;
    try {
      await api.delete(`/inventory/categories/${id}/`);
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category.');
    }
  };

  if (loading) return <div style={styles.loading}>Loading categories...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Categories</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={styles.input}
                required
                autoFocus
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ ...styles.input, height: '80px' }}
                placeholder="Optional description"
              />
            </div>
            <button type="submit" style={styles.submitBtn}>
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <p style={styles.empty}>No categories yet. Create one to organise your inventory.</p>
      ) : (
        <div style={styles.grid}>
          {categories.map((category) => (
            <div key={category.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{category.name}</h3>
                <span style={styles.itemCount}>{category.item_count} items</span>
              </div>
              {category.description && (
                <p style={styles.cardDescription}>{category.description}</p>
              )}
              <div style={styles.cardActions}>
                <button onClick={() => handleEdit(category)} style={styles.editBtn}>
                  Edit
                </button>
                <button onClick={() => handleDelete(category.id)} style={styles.deleteBtn}>
                  Delete
                </button>
              </div>
            </div>
          ))}
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
  empty: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#1a1a2e',
  },
  itemCount: {
    fontSize: '13px',
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: '2px 8px',
    borderRadius: '12px',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 12px 0',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '12px',
  },
  editBtn: {
    padding: '4px 12px',
    backgroundColor: 'transparent',
    color: '#1a1a2e',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteBtn: {
    padding: '4px 12px',
    backgroundColor: 'transparent',
    color: '#c62828',
    border: '1px solid #ffcdd2',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};

export default Categories;