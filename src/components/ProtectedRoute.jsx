// client/src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../api/config'; // Import your config!

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // USE CONFIG.API_URL HERE - NOT LOCALHOST
        await axios.get(`${CONFIG.API_URL}/auth/status`);
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;