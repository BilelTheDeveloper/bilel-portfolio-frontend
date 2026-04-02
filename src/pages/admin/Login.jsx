import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CONFIG from '../../api/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Check Email, 2: Enter Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Step 1: Verify if the email is on the "Access List"
  const handleCheckAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${CONFIG.API_URL}/auth/check-access`, { email });
      if (res.data.success) {
        setStep(2); // Move to password step
      }
    } catch (err) {
      // If unauthorized, kick them to the home page immediately
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Final Login with Password
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${CONFIG.API_URL}/auth/login`, 
        { email, password },
        { withCredentials: true } 
      );

      if (res.data.success) {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
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
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">
            {step === 1 ? 'Access Protocol Initiated' : 'Identity Verification Required'}
          </p>
        </div>

        <form 
          onSubmit={step === 1 ? handleCheckAccess : handleLogin}
          className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl space-y-6"
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-2 block text-center">
                  Enter Registered Admin Email
                </label>
                <input 
                  type="email" 
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bilel.dev"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all text-center tracking-wider placeholder:text-slate-800"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest mb-4 text-center">
                  Access Granted For: <span className="text-white">{email}</span>
                </p>
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-2 block text-center">
                  Security Access Key
                </label>
                <input 
                  type="password" 
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full bg-slate-950 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all text-center tracking-[0.5em] placeholder:tracking-normal placeholder:text-slate-800`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-[10px] font-bold text-center uppercase tracking-widest"
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
              step === 1 ? "Check Authorization" : "Authorize Session"
            )}
          </button>

          {step === 2 && (
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-[9px] text-slate-500 uppercase font-bold tracking-widest hover:text-white transition-colors"
            >
              Back to Verification
            </button>
          )}
        </form>

        <p className="text-center mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          Secure Terminal Connection <span className="text-green-500 underline ml-1">AES-256</span>
        </p>
      </motion.div>
    </div>
  );
}