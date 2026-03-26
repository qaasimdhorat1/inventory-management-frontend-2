import { useState, useEffect } from 'react';
import api from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/inventory/dashboard/');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.grid}>
        <div style={{ ...styles.card, borderLeft: '4px solid #4caf50' }}>
          <h3 style={styles.cardLabel}>Total Items</h3>
          <p style={styles.cardValue}>{stats.total_items}</p>
        </div>

        <div style={{ ...styles.card, borderLeft: '4px solid #2196f3' }}>
          <h3 style={styles.cardLabel}>Total Quantity</h3>
          <p style={styles.cardValue}>{stats.total_quantity}</p>
        </div>

        <div style={{ ...styles.card, borderLeft: '4px solid #9c27b0' }}>
          <h3 style={styles.cardLabel}>Total Value</h3>
          <p style={styles.cardValue}>
            £{stats.total_value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div style={{ ...styles.card, borderLeft: '4px solid #ff9800' }}>
          <h3 style={styles.cardLabel}>Low Stock</h3>
          <p style={styles.cardValue}>{stats.low_stock_count}</p>
        </div>

        <div style={{ ...styles.card, borderLeft: '4px solid #f44336' }}>
          <h3 style={styles.cardLabel}>Out of Stock</h3>
          <p style={styles.cardValue}>{stats.out_of_stock_count}</p>
        </div>

        <div style={{ ...styles.card, borderLeft: '4px solid #607d8b' }}>
          <h3 style={styles.cardLabel}>Categories</h3>
          <p style={styles.cardValue}>{stats.categories_count}</p>
        </div>
      </div>

      <div style={styles.recentSection}>
        <h2 style={styles.sectionTitle}>Recent Stock Changes</h2>
        {stats.recent_changes.length === 0 ? (
          <p style={styles.empty}>No recent stock changes.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Quantity Changed</th>
                <th style={styles.th}>Before</th>
                <th style={styles.th}>After</th>
                <th style={styles.th}>Changed By</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_changes.map((change) => (
                <tr key={change.id}>
                  <td style={styles.td}>{change.item_name}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor:
                        change.change_type === 'addition' ? '#e8f5e9' :
                        change.change_type === 'removal' ? '#ffebee' : '#e3f2fd',
                      color:
                        change.change_type === 'addition' ? '#2e7d32' :
                        change.change_type === 'removal' ? '#c62828' : '#1565c0',
                    }}>
                      {change.change_type}
                    </span>
                  </td>
                  <td style={styles.td}>{change.quantity_changed}</td>
                  <td style={styles.td}>{change.quantity_before}</td>
                  <td style={styles.td}>{change.quantity_after}</td>
                  <td style={styles.td}>{change.changed_by_username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '24px',
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
  },
  error: {
    padding: '40px',
    textAlign: 'center',
    color: '#d32f2f',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardLabel: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  cardValue: {
    margin: 0,
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  recentSection: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#1a1a2e',
    marginTop: 0,
    marginBottom: '16px',
  },
  empty: {
    color: '#666',
    fontStyle: 'italic',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '2px solid #eee',
    fontSize: '13px',
    color: '#666',
    fontWeight: '600',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #f5f5f5',
    fontSize: '14px',
    color: '#333',
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
};

export default Dashboard;