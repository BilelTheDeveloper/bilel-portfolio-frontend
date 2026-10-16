import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../api/config';
export default function ProtectedRoute() {
  const [status, setStatus] = useState('checking');
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    let active = true;
    const check = async () => {
      try { const response = await axios.get(`${CONFIG.API_URL}/auth/status`); if (active) { setAdmin(response.data.user); setStatus('active'); } }
      catch (error) { if (active) setStatus(error.response?.status === 401 ? 'signed-out' : 'unavailable'); }
    };
    const onVisible = () => { if (!document.hidden) void check(); };
    void check();
    const timer = setInterval(() => { if (!document.hidden) void check(); }, 60000);
    document.addEventListener('visibilitychange', onVisible);
    return () => { active = false; clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, []);
  if (status === 'checking') return <div className="min-h-screen grid place-items-center" role="status">Checking your session…</div>;
  if (status === 'signed-out') return <Navigate to="/admin" replace />;
  if (status === 'unavailable') return <main className="min-h-screen grid place-items-center p-6 text-center"><div><h1 className="text-2xl font-bold mb-3">Unable to verify your session</h1><p className="text-slate-300">The server may be starting. Please try again.</p><button className="mt-6 px-6 py-3 rounded-xl bg-blue-600" onClick={() => window.location.reload()}>Retry</button></div></main>;
  return <Outlet context={{ admin }} />;
}
