import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// --- Components ---
import Navbar from './components/Navbar';
import './showcase.css';
import ProtectedRoute from './components/ProtectedRoute'; // Secure Auth Wrapper

// --- Pages ---
const Home = lazy(() => import('./pages/Home'));
const Projects = lazy(() => import('./pages/Projects'));
const Feedback = lazy(() => import('./pages/Feedback'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));

// --- Admin Pages ---
// These now point to your new "Secret Folder" name
const AdminDashboard = lazy(() => import('./pages/a12d3m234434n/AdminDashboard'));
const Login = lazy(() => import('./pages/a12d3m234434n/Login'));


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

function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titles = { '/': 'Bilel — Full-Stack Developer', '/projects': 'Selected Projects — Bilel', '/feedback': 'Client Reviews — Bilel' };
    document.title = titles[pathname] || (pathname.startsWith('/project/') ? 'Project Case Study — Bilel' : 'Admin — Bilel');
    const canonical = document.querySelector('link[rel="canonical"]');
    const url = new URL(pathname, import.meta.env.VITE_SITE_URL || 'https://www.bilelthedev.website').href;
    canonical?.setAttribute('href', url);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    const robots = document.querySelector('meta[name="robots"]');
    robots?.setAttribute('content', (pathname.startsWith('/admin') || pathname.startsWith('/a12d3m234434n')) ? 'noindex, nofollow' : 'index, follow');
  }, [pathname]);
  return null;
}
const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <PageMetadata />

      <Suspense fallback={<div className="min-h-screen grid place-items-center text-slate-300" role="status">Loading page…</div>}>
      <Routes>
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
        <Route path="/a12d3m234434n/*" element={<Navigate to="/admin" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* --- 3. PUBLIC WEBSITE LAYOUT --- */}
        <Route
          path="*"
          element={
            <div className="public-site min-h-screen text-white selection:bg-brand-primary selection:text-white">
              <Navbar />
              <a href="#main-content" className="skip-link">Skip to content</a>
              <main id="main-content" tabIndex={-1} className="animate-in fade-in duration-500">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/project/:id" element={<ProjectDetails />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <footer className="sc-footer"><div className="sc-wrap"><a href="/" className="sc-logo"><b>B</b><strong>bilel<span>.dev</span></strong></a><p>© {new Date().getFullYear()} Bilel Helal. All rights reserved.</p><nav aria-label="Footer navigation"><a href="/">Home</a><a href="/projects">Projects</a><a href="/#about">About</a><a href="/#contact">Contact</a><a href="/feedback">Reviews</a><a href="/admin">Admin</a></nav></div></footer>
            </div>
          }
        />
      </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
