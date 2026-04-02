import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
// Ensure this points to your actual config file for the API URL
import CONFIG from '../../api/config'; 

export default function AdminGate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const key = searchParams.get('key');
    
    // If no key is present in URL, kick to home immediately
    if (!key) {
      navigate('/');
      return;
    }

    const performHandshake = async () => {
      try {
        /**
         * 🛡️ THE HANDSHAKE
         * We send the key to the backend. 
         * The backend verifies it and returns a secure HttpOnly cookie.
         */
        const res = await axios.post(`${CONFIG.API_URL}/auth/verify-gate`, 
          { key }, 
          { withCredentials: true } // CRITICAL: Allows the browser to accept the cookie
        );

        if (res.data.success) {
          // Success! The cookie is now set. No need for localStorage.
          navigate('/a12d3m234434n/login');
        }
      } catch (err) {
        // If the key is wrong or the server is down, kick to home
        console.error("Gate Handshake Failed");
        navigate('/');
      }
    };

    performHandshake();
  }, [searchParams, navigate]);

  // We return a simple dark screen with a spinner so the transition looks smooth
  return (
    <div className="min-h-screen bg-[#060e25] flex flex-col items-center justify-center">
       <div className="w-10 h-10 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
       <p className="mt-4 text-slate-500 text-xs font-medium tracking-widest uppercase animate-pulse">
         Securing Connection...
       </p>
    </div>
  );
}