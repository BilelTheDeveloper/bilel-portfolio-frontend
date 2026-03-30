import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';

// --- Components ---
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // Security Wrapper

// --- Pages ---
import Home from './pages/Home';
import Projects from './pages/Projects';
import Feedback from './pages/Feedback';

// --- Admin Pages ---
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/admin/Login';

// --- Global Axios Configuration ---
// This ensures every request (including ProtectedRoute) handles cookies automatically
axios.defaults.withCredentials = true;

/**
 * ScrollToTop: 
 * Professional UX component that resets scroll position to the top 
 * whenever the user navigates to a new route.
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
        {/* --- 1. ADMIN AUTH ROUTE --- 
            Stand-alone login page. No Navbar or Footer allowed here.
        */}
        <Route path="/admin/login" element={<Login />} />

        {/* --- 2. PROTECTED ADMIN ROUTES --- 
            The ProtectedRoute checks for a valid session before 
            allowing access to the AdminDashboard.
        */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>

        {/* --- 3. PUBLIC ROUTES --- 
            Wrapped in the site-wide layout (Navbar & Footer).
        */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[var(--color-brand-dark)] text-white font-sans selection:bg-brand-primary selection:text-white">
              
              {/* Site-wide Navbar */}
              <Navbar />

              {/* Main Page Content with Entrance Animation */}
              <main className="animate-in fade-in duration-500">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/feedback" element={<Feedback />} />
                  
                  {/* 404 Catch-all: Redirects unknown URLs back to Home */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>

              {/* Site-wide Footer */}
              <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p>© {new Date().getFullYear()} bilel.dev — Crafted with React & Tailwind 4.0</p>
                  
                  <div className="flex gap-6 items-center">
                    <div className="flex gap-6 opacity-60 hover:opacity-100 transition-opacity">
                      <a 
                        href="https://linkedin.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hover:text-brand-primary transition-colors"
                      >
                        LinkedIn
                      </a>
                      <a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="hover:text-brand-primary transition-colors"
                      >
                        GitHub
                      </a>
                    </div>
                    
                    {/* Stealth Admin Access */}
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