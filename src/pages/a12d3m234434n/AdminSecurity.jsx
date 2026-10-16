import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, KeyRound, LoaderCircle, Monitor, ShieldCheck, Smartphone, UserCheck } from 'lucide-react';
import axios from 'axios';
import CONFIG from '../../api/config';

const root = `${CONFIG.API_URL}/auth`;
const deviceLabel = agent => {
  const browser = /Edg\//.test(agent) ? 'Edge' : /Firefox\//.test(agent) ? 'Firefox' : /Chrome\//.test(agent) ? 'Chrome' : /Safari\//.test(agent) ? 'Safari' : 'Browser';
  const platform = /Android/.test(agent) ? 'Android' : /iPhone|iPad/.test(agent) ? 'iOS' : /Windows/.test(agent) ? 'Windows' : /Macintosh/.test(agent) ? 'macOS' : /Linux/.test(agent) ? 'Linux' : 'this device';
  return `${browser} on ${platform}`;
};
const inputClass = 'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white';
export default function AdminSecurity() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [account, setAccount] = useState({ email: '', password: '' });
  const [codes, setCodes] = useState([]);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const navigate = useNavigate();
  const fetchData = useCallback(async () => {
    const status = await axios.get(`${root}/status`);
    const [sessions, events, accounts] = await Promise.all([
      axios.get(`${root}/sessions`), axios.get(`${root}/events`),
      status.data.user.role === 'owner' ? axios.get(`${root}/accounts`) : Promise.resolve({ data: { data: [] } })
    ]);
    return { user: status.data.user, sessions: sessions.data.data, events: events.data.data, accounts: accounts.data.data };
  }, []);
  useEffect(() => {
    let active = true;
    fetchData().then(value => { if (active) setData(value); }).catch(() => { if (active) setError('Security settings could not be loaded. Please reopen this tab to retry.'); });
    return () => { active = false; };
  }, [fetchData]);
  const action = async (name, operation) => {
    if (busy) return;
    setBusy(name); setError(''); setNotice('');
    try { if (await operation() === false) return; setVerificationCode(''); setData(await fetchData()); }
    catch (failure) { setError(failure.response?.data?.message || 'This action could not be completed. Please try again.'); }
    finally { setBusy(''); }
  };
  const revoke = session => action(`session-${session._id}`, async () => {
    await axios.delete(`${root}/sessions/${session._id}`);
    if (session.current) { navigate('/admin', { replace: true }); return false; }
    setNotice('Session revoked.');
  });
  const download = () => {
    const url = URL.createObjectURL(new Blob([`Bilel Admin recovery codes\nEach code works once.\n\n${codes.join('\n')}`], { type: 'text/plain' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'bilel-admin-recovery-codes.txt'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section className="space-y-7 max-w-5xl">
    <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-transparent p-7 sm:p-9"><div className="flex items-center gap-3 text-blue-300 mb-5"><ShieldCheck size={22} /><span className="text-xs font-bold uppercase tracking-widest">Account security</span></div><h2 className="text-3xl font-bold mb-3">Access, on your terms.</h2><p className="text-slate-300 text-sm leading-7 max-w-xl">Your password and Google Authenticator protect this workspace. Review sessions, save recovery codes, and control who is approved to enter.</p>{data && <div className="flex flex-wrap gap-3 mt-6"><span className="rounded-full px-3 py-2 text-xs bg-white/5 border border-white/10">{data.user.email}</span><span className="rounded-full px-3 py-2 text-xs bg-emerald-400/10 text-emerald-300 flex items-center gap-2"><Check size={12} /> Authenticator enabled</span><span className="rounded-full px-3 py-2 text-xs bg-white/5 capitalize">{data.user.role}</span></div>}</div>
    <div className="flex flex-wrap gap-3"><a href="#security-sessions" className="studio-button">Sessions</a><a href="#security-recovery" className="studio-button">Recovery</a>{data?.user.role === 'owner' && <a href="#security-accounts" className="studio-button">Account access</a>}<button className="studio-button" disabled={Boolean(busy)} onClick={() => action('refresh', async () => { setNotice('Security settings refreshed.'); })}>Refresh settings</button></div>
    {error && <p role="alert" className="p-4 rounded-xl border border-red-400/20 text-red-300 text-sm">{error}</p>}
    {notice && <p role="status" className="p-4 rounded-xl border border-emerald-400/20 text-emerald-300 text-sm">{notice}</p>}
    {!data ? !error && <p role="status" className="text-slate-300 flex items-center gap-3"><LoaderCircle className="animate-spin" size={17} />Loading security settings…</p> : <>
      <div id="security-sessions" className="rounded-3xl border border-white/10 p-6 sm:p-8"><h3 className="font-bold text-lg flex gap-3 items-center"><Monitor size={20} className="text-blue-300" /> Active sessions</h3><p className="text-slate-400 text-sm mt-2 mb-5">Sessions expire after 30 minutes of inactivity or six hours in total.</p><div className="divide-y divide-white/5">{data.sessions.map(session => <div key={session._id} className="flex flex-wrap justify-between items-center gap-4 py-5"><div className="min-w-0"><p className="text-sm font-medium break-all max-w-xl">{deviceLabel(session.userAgent || '')}</p><p className="text-xs text-slate-400 mt-2">Last active {new Date(session.lastSeenAt).toLocaleString()}{session.current ? ' · This device' : ''}</p></div><button disabled={Boolean(busy)} onClick={() => revoke(session)} className="text-xs text-red-300 border border-red-300/20 rounded-lg px-4 py-2">{session.current ? 'Sign out' : 'Revoke'}</button></div>)}</div><button disabled={Boolean(busy)} className="text-sm text-red-300 mt-4 underline" onClick={() => action('logout-all', async () => { await axios.post(`${root}/logout-all`); navigate('/admin', { replace: true }); return false; })}>Sign out on every device</button></div>
      <div className="rounded-3xl border border-white/10 p-6 sm:p-8"><h3 className="font-bold text-lg flex gap-3 items-center"><Smartphone size={20} className="text-blue-300" /> Verify sensitive changes</h3><p className="text-slate-400 text-sm mt-2 mb-5">Enter a fresh Google Authenticator code before approving accounts, changing your password, or replacing recovery codes. Each code can be accepted only once; wait for the next code after sign-in.</p><label htmlFor="security-code" className="block text-sm mb-2">Current authenticator code</label><input id="security-code" className={`${inputClass} max-w-xs tracking-[.3em]`} value={verificationCode} onChange={event => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" maxLength={6} /></div>
      <div id="security-recovery" className="grid xl:grid-cols-2 gap-7"><div className="rounded-3xl border border-white/10 p-6 sm:p-8"><h3 className="font-bold text-lg flex gap-3 items-center"><KeyRound size={20} className="text-blue-300" /> Recovery codes</h3><p className="text-slate-400 text-sm mt-3 mb-5 leading-6">Use a one-time recovery code if your phone is unavailable. Generating new codes invalidates all previous ones.</p><button disabled={Boolean(busy) || verificationCode.length !== 6} className="px-4 py-3 bg-blue-600 rounded-xl text-sm font-bold" onClick={() => action('recovery', async () => { const response = await axios.post(`${root}/recovery-codes`, { verificationCode }); setCodes(response.data.recoveryCodes); setNotice('Save the new codes. Your old codes no longer work.'); })}>Generate new recovery codes</button>{codes.length > 0 && <div className="mt-5"><div className="grid gap-2">{codes.map(code => <code key={code} className="bg-white/5 rounded-lg p-2 text-xs break-all">{code}</code>)}</div><button onClick={download} className="text-blue-300 text-sm underline mt-4">Download codes</button><button onClick={() => setCodes([])} className="text-slate-300 text-sm underline mt-4 ml-5">I saved them · Hide</button></div>}</div>
      <div className="rounded-3xl border border-white/10 p-6 sm:p-8"><h3 className="font-bold text-lg">Change password</h3><p className="text-slate-400 text-sm mt-3 mb-5">Use at least 16 characters. A password change signs out every device.</p><form className="space-y-4" onSubmit={event => { event.preventDefault(); void action('password', async () => { await axios.post(`${root}/password`, { ...passwords, verificationCode }); setPasswords({ currentPassword: '', newPassword: '' }); navigate('/admin', { replace: true }); return false; }); }}><label className="block text-xs text-slate-300">Current password<input className={`${inputClass} mt-2`} type="password" autoComplete="current-password" required value={passwords.currentPassword} onChange={event => setPasswords({ ...passwords, currentPassword: event.target.value })} /></label><label className="block text-xs text-slate-300">New password<input className={`${inputClass} mt-2`} type="password" autoComplete="new-password" required minLength={16} maxLength={72} value={passwords.newPassword} onChange={event => setPasswords({ ...passwords, newPassword: event.target.value })} /></label><button disabled={Boolean(busy) || verificationCode.length !== 6} className="px-4 py-3 bg-white/10 rounded-xl text-sm font-bold">Change password & sign out</button></form></div></div>
      {data.user.role === 'owner' && <div id="security-accounts" className="rounded-3xl border border-white/10 p-6 sm:p-8"><h3 className="font-bold text-lg flex gap-3 items-center"><UserCheck size={20} className="text-blue-300" /> Approved accounts</h3><p className="text-slate-400 text-sm mt-2 mb-6">There is no public registration. Only the owner can approve administrators. Each account must set up its own authenticator.</p><div className="divide-y divide-white/5 mb-7">{data.accounts.map(user => <div key={user._id} className="flex flex-wrap justify-between gap-3 py-4"><div><p className="text-sm">{user.email}</p><p className="text-xs text-slate-400 mt-1">{user.role} · {user.isActive ? 'Approved' : 'Disabled'} · {user.mfaEnabled ? 'Authenticator configured' : 'Setup required'}</p></div>{user.role === 'admin' && <button disabled={Boolean(busy) || verificationCode.length !== 6} className="text-xs text-red-300" onClick={() => action(`access-${user._id}`, async () => { await axios.patch(`${root}/accounts/${user._id}/${user.isActive ? 'disable' : 'enable'}`, { verificationCode }); setNotice(user.isActive ? 'Account disabled. Its sessions and sign-in requests were revoked.' : 'Account approved again. A new verified sign-in is required.'); })}>{user.isActive ? 'Disable access' : 'Approve again'}</button>}</div>)}</div><form onSubmit={event => { event.preventDefault(); void action('approve', async () => { await axios.post(`${root}/accounts`, { ...account, verificationCode }); setAccount({ email: '', password: '' }); setNotice('Account approved. Share its initial password through a private channel.'); }); }} className="grid sm:grid-cols-2 gap-4"><label className="text-xs text-slate-300">Approved email<input className={`${inputClass} mt-2`} type="email" autoComplete="off" required maxLength={254} value={account.email} onChange={event => setAccount({ ...account, email: event.target.value })} /></label><label className="text-xs text-slate-300">Initial password<input className={`${inputClass} mt-2`} type="password" autoComplete="new-password" required minLength={16} maxLength={72} value={account.password} onChange={event => setAccount({ ...account, password: event.target.value })} /></label><button disabled={Boolean(busy) || verificationCode.length !== 6} className="sm:col-span-2 justify-self-start px-5 py-3 bg-blue-600 rounded-xl text-sm font-bold">Approve administrator</button></form></div>}
      <div className="rounded-3xl border border-white/10 p-6 sm:p-8"><h3 className="font-bold text-lg mb-5">Recent security activity</h3>{data.events.length ? <ul className="divide-y divide-white/5">{data.events.map(event => <li key={event._id} className="py-3 flex flex-wrap justify-between gap-2"><span className="text-sm capitalize">{event.event.replaceAll('_', ' ')}{event.target ? ` · ${event.target}` : ''}</span><time className="text-xs text-slate-400">{new Date(event.createdAt).toLocaleString()}</time></li>)}</ul> : <p className="text-sm text-slate-400">Security events will appear here.</p>}</div>
    </>}
  </section>;
}
