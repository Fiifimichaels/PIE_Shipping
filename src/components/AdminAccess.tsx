import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

const AdminAccess: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin || (isAuthenticated && isAdmin)) {
    if (!isAuthenticated) {
      return <AdminLogin onLoginSuccess={() => setShowLogin(false)} />;
    }
    return <AdminDashboard />;
  }

  return null;
};

export default AdminAccess;