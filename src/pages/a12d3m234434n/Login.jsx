import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CONFIG from '../../api/config';

export default function Login() {
  const [stage, setStage] = useState('checking');
  const [key, setKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    axios.get(`${CONFIG.API_URL}/auth/status`).then(() => { if (active) navigate('/a12d3m234434n', { replace: true }); }).catch(() => {
      axios.get(`${CONFIG.API_URL}/auth/gate-status`).then(() => { if (active) setStage('login'); }).catch(() => { if (active) setStage('gate'); });
    });
    return () => { active = false; };
  }, [navigate]);
  const submit = async event => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      if (stage === 'gate') {
        await axios.post(`${CONFIG.API_URL}/auth/verify-gate`, { key });
        setKey('');
        setStage('login');
      } else {
        await axios.post(`${CONFIG.API_URL}/auth/login`, { email, password });
        setPassword('');
        navigate('/a12d3m234434n', { replace: true });
      }
    } catch (failure) {
      setError(failure.response?.data?.message || 'Unable to connect. Please try again.');
      if (stage === 'login' && failure.response?.status === 401 && failure.response?.data?.message?.includes('gate')) setStage('gate');
    } finally { setLoading(false); }
  };
  const fieldClass = 'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white';
  return <main className="min-h-screen grid place-items-center bg-[#060e25] p-6 text-white">
    <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#091027] p-7 sm:p-10 shadow-2xl">
      <p className="text-xs tracking-widest uppercase text-blue-300 mb-3">Bilel.dev · Administration</p>
      <h1 className="text-3xl font-bold mb-3">{stage === 'gate' ? 'Admin access' : stage === 'checking' ? 'Checking your session…' : 'Welcome back'}</h1>
      <p className="text-slate-300 text-sm mb-8">{stage === 'gate' ? 'Enter your private gate key to continue to sign in.' : stage === 'login' ? 'Sign in with your administrator account.' : 'Please wait while your session is verified.'}</p>
      {stage !== 'checking' && <form onSubmit={submit} className="space-y-5" aria-busy={loading}>
        {stage === 'gate' ? <div><label htmlFor="gate-key" className="block mb-2 text-sm">Gate key</label><input id="gate-key" className={fieldClass} type="password" required maxLength={256} value={key} onChange={event => setKey(event.target.value)} autoComplete="off" disabled={loading} /></div> : <>
          <div><label htmlFor="admin-email" className="block mb-2 text-sm">Email address</label><input id="admin-email" className={fieldClass} type="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} autoComplete="username" disabled={loading} /></div>
          <div><label htmlFor="admin-password" className="block mb-2 text-sm">Password</label><input id="admin-password" className={fieldClass} type="password" required maxLength={256} value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" disabled={loading} /></div>
        </>}
        {error && <p role="alert" className="rounded-xl border border-red-400/25 p-3 text-sm text-red-300">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-bold">{loading ? 'Please wait…' : stage === 'gate' ? 'Continue securely' : 'Sign in'}</button>
      </form>}
      <Link to="/" className="block text-center text-sm text-slate-300 mt-6 underline">Back to portfolio</Link>
    </section>
  </main>;
}
