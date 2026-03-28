import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', new_password: '', new_password2: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/reset-password/', formData);
      setSuccess('Password has been reset successfully. You can now log in with your new password.');
      setFormData({ username: '', email: '', new_password: '', new_password2: '' });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = typeof data === 'object'
          ? Object.values(data).flat().join(' ')
          : data;
        setError(messages);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset Password</h1>
        <p style={styles.subtitle}>
          Verify your identity to reset your password
        </p>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              type="text" required style={styles.input}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email" required style={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>New Password</label>
            <input
              type="password" required style={styles.input}
              value={formData.new_password}
              onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password" required style={styles.input}
              value={formData.new_password2}
              onChange={(e) => setFormData({ ...formData, new_password2: e.target.value })}
            />
          </div>
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p style={styles.footer}>
          Remember your password?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f3460',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '28px',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    color: '#666',
    textAlign: 'center',
    fontSize: '14px',
  },
  error: {
    backgroundColor: '#ffe6e6',
    color: '#d32f2f',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#e94560',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default ResetPassword;