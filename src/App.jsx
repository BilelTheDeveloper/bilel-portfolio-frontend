import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import CONFIG from './api/config'; // Ensure this points to your config

// --- Components ---
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// --- Pages ---
import Home from './pages/Home';
import Projects from './pages/Projects';
import Feedback from './pages/Feedback';

// --- Admin Pages ---
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/admin/Login';

axios.defaults.withCredentials = true;

/**
 * AdminGuard: 
 * VERIFIED SECURITY LAYER.
 * Calls the backend to check if the session is valid and 
 * confirms the email belongs to the admin.
 */
const AdminGuard = ({ children }) => {
  const [authState, setAuthState] = useState({ loading: true, authorized: false });
  const ALLOWED_EMAIL = "bilel.thedeveloper@gmail.com";

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await axios.get(`${CONFIG.API_URL}/auth/status`);
        
        // Check if the backend confirms admin status and the email matches
        if (res.data.success && res.data.user?.email === ALLOWED_EMAIL) {
          setAuthState({ loading: false, authorized: true });
        } else {
          setAuthState({ loading: false, authorized: false });
        }
      } catch (err) {
        setAuthState({ loading: false, authorized: false });
      }
    };
    verifyAdmin();
  }, []);

  if (authState.loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authState.authorized) {
    console.warn("Unauthorized admin access attempt blocked.");
    return <Navigate to="/" replace />;
  }

  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      
      <Routes>
        {/* --- 1. ADMIN LOGIN --- */}
        <Route path="/admin/login" element={<Login />} />

        {/* --- 2. PROTECTED & DATABASE-VERIFIED ADMIN ROUTES --- */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path="/admin/*" 
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            } 
          />
        </Route>

        {/* --- 3. PUBLIC ROUTES --- */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[var(--color-brand-dark)] text-white font-sans selection:bg-brand-primary selection:text-white">
              <Navbar />
              <main className="animate-in fade-in duration-500">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p>© {new Date().getFullYear()} bilel.dev — Crafted with React & Tailwind 4.0</p>
                  
                  <div className="flex gap-6 items-center">
                    <div className="flex gap-6 opacity-60 hover:opacity-100 transition-opacity text-xs uppercase font-bold tracking-widest">
                      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-brand-primary transition-colors">LinkedIn</a>
                      <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-brand-primary transition-colors">GitHub</a>
                    </div>
                    
                    <a 
                      href="/admin/login" 
                      className="text-[10px] uppercase font-black tracking-[0.2em] border border-white/10 px-3 py-1.5 rounded-lg hover:bg-white/5 hover:border-brand-primary/40 transition-all text-slate-600 hover:text-brand-primary"
                    >
                      Admin Access
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;