import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

// --- Components ---
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // Secure Auth Wrapper

// --- Pages ---
import Home from './pages/Home';
import Projects from './pages/Projects';
import Feedback from './pages/Feedback';

// --- Admin Pages ---
import AdminDashboard from './pages/a12d3m234434n/AdminDashboard';
import Login from './pages/a12d3m234434n/Login';
import AdminGate from './pages/a12d3m234434n/AdminGate'; // <--- NEWLY ADDED

// CRITICAL: Global Axios setting to allow Secure Cookies (JWT)
// This ensures your admin inquiries and feedback management can authenticate with the backend
axios.defaults.withCredentials = true;

/**
 * ScrollToTop ensures the user starts at the top of the page on route change.
 */
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
        {/* The Gate handles the secret URL entry before the Login page */}
        <Route path="/a12d3m234434n/gate" element={<AdminGate />} /> 
        <Route path="/a12d3m234434n/login" element={<Login />} />

        {/* --- 2. SECURE ADMIN ZONE --- */}
        {/* Everything inside this ProtectedRoute requires a valid JWT cookie from the backend */}
        {/* The /* allows the AdminDashboard's internal switch router to handle sub-tabs like:
            - Projects
            - Client Reviews
            - Inquiries (NEW)
        */}
        <Route element={<ProtectedRoute />}>
          <Route path="/a12d3m234434n/*" element={<AdminDashboard />} />
        </Route>

        {/* --- 3. PUBLIC WEBSITE LAYOUT --- */}
        <Route
          path="*"
          element={
            <div className="min-h-screen text-white font-sans selection:bg-brand-primary selection:text-white bg-[#060e25]">
              <Navbar />
              <main className="animate-in fade-in duration-500">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/feedback" element={<Feedback />} />
                  {/* Catch-all: Redirect unknown public routes to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p>© {new Date().getFullYear()} bilel.dev — Built with MERN Stack</p>
                  
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