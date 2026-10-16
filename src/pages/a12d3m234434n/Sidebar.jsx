import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Compass, MessageSquare, Inbox, ShieldCheck, LogOut, Menu, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import CONFIG, { clearAdminCsrf } from '../../api/config';
const items = [
  { id: 'stats', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Project library', icon: FolderOpen },
  { id: 'feedback', label: 'Reviews', icon: MessageSquare },
  { id: 'messages', label: 'Inquiries', icon: Inbox },
  { id: 'security', label: 'Security & access', icon: ShieldCheck },
  { id: 'explore', label: 'Explore & tools', icon: Compass }
];
export default function Sidebar({ activeTab, setActiveTab }) {
  const [busy, setBusy] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState('');
  const logout = async () => {
    setBusy(true); setError('');
    try { await axios.post(`${CONFIG.API_URL}/auth/logout`); clearAdminCsrf(); window.location.assign('/admin'); }
    catch (failure) {
      if (failure.response?.status === 401) { clearAdminCsrf(); window.location.assign('/admin'); }
      else { setError('Could not sign out. Try again.'); setBusy(false); }
    }
  };
  return <aside className="w-full lg:w-72 lg:h-dvh relative lg:fixed left-0 top-0 z-50 bg-[#0a1020] border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col p-4 lg:p-6">
    <div className="flex items-center justify-between mb-4 lg:mb-10"><div className="flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-300 grid place-items-center font-bold">B.</span><div><p className="text-sm font-semibold text-white">Bilel workspace</p><p className="text-[9px] text-slate-400 uppercase tracking-[.18em] mt-1">Administration</p></div></div><Link to="/" aria-label="Open portfolio" className="text-slate-400 hover:text-white"><ArrowUpRight size={16} /></Link></div>
    <button className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 mb-3 rounded-xl border border-white/10 text-sm text-slate-200" onClick={() => setMobileOpen(value => !value)} aria-expanded={mobileOpen} aria-controls="workspace-navigation"><span>Workspace sections</span><Menu size={18} /></button>
    <nav id="workspace-navigation" aria-label="Administration" className={`${mobileOpen ? 'grid' : 'hidden'} grid-cols-2 sm:grid-cols-3 lg:block gap-2 lg:space-y-2 lg:overflow-y-auto pb-2 lg:pb-0 lg:flex-1`}>{items.map(item => { const { id, label } = item; const Icon = item.icon; return <button key={id} aria-current={activeTab === id ? 'page' : undefined} onClick={() => { setActiveTab(id); setMobileOpen(false); }} className={`w-full flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-3 rounded-xl text-xs font-medium text-left transition-colors ${activeTab === id ? 'text-blue-200 bg-blue-500/15 border border-blue-400/15' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}><Icon size={17} /><span>{label}</span></button>; })}</nav>
    <div className="lg:pt-6 lg:border-t lg:border-white/5 mt-2 lg:mt-6"><p className="hidden lg:flex items-center gap-2 text-[10px] text-emerald-300 mb-5"><ShieldCheck size={13} /> Authenticator verified</p>{error && <p role="alert" className="text-xs text-red-300 mb-2">{error}</p>}<button disabled={busy} onClick={logout} className="flex items-center gap-3 text-xs text-slate-400 hover:text-red-300 px-4 py-2"><LogOut size={16} />{busy ? 'Signing out…' : 'Sign out'}</button></div>
  </aside>;
}
