import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../api/config';

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState('loading'); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Calling your EXISTING status route
        const res = await axios.get(`${CONFIG.API_URL}/auth/status`, {
          withCredentials: true 
        });

        // Verify if the email returned from the 'Access' table is yours
        if (res.data.success && res.data.user.email === "bilel.thedeveloper@gmail.com") {
          setStatus('authorized');
        } else {
          setStatus('unauthorized');
        }
      } catch (err) {
        // If 401 Unauthorized or any error, kick to home
        setStatus('unauthorized');
      }
    };
    checkAuth();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/" replace />;
  }

  return children;
}