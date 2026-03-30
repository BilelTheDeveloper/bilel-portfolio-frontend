import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CONFIG from '../../api/config'; // Importing your dynamic config

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Pointing to your Production Render API
      const res = await axios.post(`${CONFIG.API_URL}/auth/login`, 
        { password },
        { withCredentials: true } // Allows the secure cookie to be saved
      );

      if (res.data.success) {
        // 2. CRITICAL UPDATE: Store user data for the AdminGuard in App.jsx
        // We manually set the email here since your backend only checks the password
        const userData = {
          email: "bilel.thedeveloper@gmail.com",
          token: res.data.token // If your backend returns a token string
        };
        
        localStorage.setItem('user', JSON.stringify(userData));

        // 3. Redirect to Dashboard on success
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unauthorized Access');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] -z-10 animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            BILEL<span className="text-brand-primary">.ADMIN</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Identity Verification Required</p>
        </div>

        <form 
          onSubmit={handleLogin}
          className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-6"
        >
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-2">Access Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={`w-full bg-slate-950 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all text-center tracking-[0.5em] placeholder:tracking-normal placeholder:text-slate-800`}
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-xs font-bold text-center italic"
            >
              {error}
            </motion.p>
          )}

          <button 
            disabled={loading}
            className="w-full py-5 bg-brand-primary hover:bg-blue-600 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Authorize Session"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Secure Terminal Connection <span className="text-green-500 underline ml-1">AES-256</span>
        </p>
      </motion.div>
    </div>
  );
}