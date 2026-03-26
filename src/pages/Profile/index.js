import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');

    try {
      await updateProfile(profileData);
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.values(data).flat().join(' ');
        setProfileError(messages);
      } else {
        setProfileError('Failed to update profile.');
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');

    if (passwordData.new_password !== passwordData.new_password2) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      await changePassword(passwordData);
      setPasswordMsg('Password changed successfully.');
      setPasswordData({ old_password: '', new_password: '', new_password2: '' });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.values(data).flat().join(' ');
        setPasswordError(messages);
      } else {
        setPasswordError('Failed to change password.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Profile</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Account Details</h2>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Username</span>
            <span style={styles.infoValue}>{user?.username}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Member Since</span>
            <span style={styles.infoValue}>
              {new Date(user?.date_joined).toLocaleDateString('en-GB')}
            </span>
          </div>

          {profileMsg && <div style={styles.success}>{profileMsg}</div>}
          {profileError && <div style={styles.error}>{profileError}</div>}

          <form onSubmit={handleProfileSubmit}>
            <div style={styles.formRow}>
              <div style={styles.field}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData({
                    ...profileData, first_name: e.target.value
                  })}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData({
                    ...profileData, last_name: e.target.value
                  })}
                  style={styles.input}
                  required
                />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({
                  ...profileData, email: e.target.value
                })}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.submitBtn}>
              Update Profile
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Change Password</h2>

          {passwordMsg && <div style={styles.success}>{passwordMsg}</div>}
          {passwordError && <div style={styles.error}>{passwordError}</div>}

          <form onSubmit={handlePasswordSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                value={passwordData.old_password}
                onChange={(e) => setPasswordData({
                  ...passwordData, old_password: e.target.value
                })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({
                  ...passwordData, new_password: e.target.value
                })}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.new_password2}
                onChange={(e) => setPasswordData({
                  ...passwordData, new_password2: e.target.value
                })}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.submitBtn}>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    color: '#1a1a2e',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    margin: '0 0 16px 0',
    fontSize: '20px',
    color: '#1a1a2e',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
    marginBottom: '8px',
  },
  infoLabel: {
    fontSize: '14px',
    color: '#666',
  },
  infoValue: {
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '500',
  },
  success: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '16px',
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
  formRow: {
    display: 'flex',
    gap: '12px',
  },
  field: {
    marginBottom: '12px',
    flex: 1,
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
    marginTop: '4px',
  },
};

export default Profile;