import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../../api/config'; 

export default function AdminGate() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const key = searchParams.get('key');
    
    // 1. If no key is present in URL, redirect to home immediately
    if (!key) {
      navigate('/');
      return;
    }

    const performHandshake = async () => {
      try {
        /**
         * 🛡️ THE HANDSHAKE
         * Sending the Monster Key to the backend.
         * The backend will set the HttpOnly 'gate_pass' cookie if the key is correct.
         */
        const res = await axios.post(`${CONFIG.API_URL}/auth/verify-gate`, 
          { key }, 
          { withCredentials: true } // CRITICAL: Allows browser to receive the secure cookie
        );

        if (res.data.success) {
          /**
           * 🧹 CLEANUP: 
           * We explicitly remove the old 'gate_passed' from localStorage 
           * to ensure we are only using the secure cookie from now on.
           */
          localStorage.removeItem('gate_passed');
          
          // Move to the secret login page
          navigate('/a12d3m234434n/login');
        }
      } catch (err) {
        // If the key is wrong, the server returns 401 and we kick the user out
        console.error("Gate Handshake Failed: Invalid or missing key.");
        navigate('/');
      }
    };

    performHandshake();
  }, [searchParams, navigate]);

  // Transition UI: Professional dark loading state
  return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center">
       <div className="w-10 h-10 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
       <p className="mt-4 text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse">
         Securing Terminal Connection...
       </p>
    </div>
  );
}