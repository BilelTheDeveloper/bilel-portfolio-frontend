import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState(null); // null = checking, true = logged in, false = denied

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // We call a simple "me" or "status" route on the backend
        // If the cookie is valid, the backend returns 200 OK
        await axios.get('http://localhost:5000/api/auth/status', { withCredentials: true });
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  // --- Loading State: Prevents UI flickering ---
  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-500 animate-pulse">
            Verifying Credentials...
          </p>
        </div>
      </div>
    );
  }

  // If authenticated, render the children (the Dashboard)
  // If not, redirect to the login page
  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;