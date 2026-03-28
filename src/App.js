import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <Routes>
            <Route path="/login" element={
              <PublicRoute><Login /></PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute><Register /></PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute><ResetPassword /></PublicRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute><Inventory /></ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute><Categories /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;