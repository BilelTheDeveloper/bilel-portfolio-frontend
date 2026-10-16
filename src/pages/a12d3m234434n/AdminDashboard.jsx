import AdminSocialLinks from './AdminSocialLinks';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useOutletContext, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Download, FolderOpen, Inbox, MessageSquare, Plus, RefreshCw, ShieldCheck, Activity, Search, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import CONFIG from '../../api/config';
import Sidebar from './Sidebar';
import AddProject from './AddProject';
import AdminProjects from './AdminProjects';
import AdminFeedback from './AdminFeedback';
import AdminMessages from './AdminMessages';
import AdminSecurity from './AdminSecurity';
import './admin-studio.css';
const pages = {
  social: ['Social links', 'Manage the profiles visitors can open from your hero.'],
  stats: ['Overview', 'A clear view of your portfolio, conversations, and next steps.'],
  projects: ['Project library', 'Create, refine, and showcase your best work.'],
  'add-project': ['Project editor', 'Build a case study worth exploring.'],
  messages: ['Inquiries', 'Every conversation is a new possibility.'],
  feedback: ['Reviews', 'Choose the client stories that appear on your portfolio.'],
  explore: ['Explore your workspace', 'Useful tools for managing your portfolio in one place.'],
  security: ['Security & access', 'Manage approved accounts, verified sessions, and recovery.']
};
export default function AdminDashboard() {
  const [params, setParams] = useSearchParams();
  const activeTab = pages[params.get('tab')] ? params.get('tab') : 'stats';
  const [editing, setEditing] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toolBusy, setToolBusy] = useState('');
  const [toolNotice, setToolNotice] = useState('');
  const [toolSearch, setToolSearch] = useState('');
  const { admin } = useOutletContext();
  const location = useLocation();
  const navigateTab = tab => { if (dirty && !window.confirm('Discard your unsaved changes?')) return; setDirty(false); setEditing(null); setParams({ tab }); };
  const load = useCallback(async () => { setLoading(true); setError(''); try { const response = await axios.get(`${CONFIG.API_URL}/auth/overview`); setOverview(response.data.data); } catch { setError('Could not load your workspace summary. Please retry.'); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  const edit = project => { setEditing(project); setParams({ tab: 'add-project' }); };
  const exportProjects = async () => {
    setToolBusy('export'); setToolNotice('');
    try { const response = await axios.get(CONFIG.ENDPOINTS.PROJECTS); const url = URL.createObjectURL(new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), projects: response.data.data }, null, 2)], { type: 'application/json' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `portfolio-projects-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setToolNotice('Project content exported. Images are included as URLs; this is not a full database backup.'); }
    catch { setToolNotice('Export failed. Please try again.'); } finally { setToolBusy(''); }
  };
  const health = async () => { setToolBusy('health'); setToolNotice(''); try { const response = await axios.get(`${CONFIG.API_URL.replace(/\/api\/?$/, '')}/api/auth/overview`); setToolNotice(response.data.success ? 'Your authenticated API and database are responding.' : 'The API returned an unexpected response.'); } catch { setToolNotice('Could not reach the authenticated API. Retry or check your session.'); } finally { setToolBusy(''); } };
  const tools = [
    { title: 'Create a case study', text: 'Add a project with a cover, technologies, and the story behind your solution.', icon: Plus, action: () => navigateTab('add-project') },
    { title: 'Browse your work', text: 'Search the project library, edit details, or preview the public page.', icon: FolderOpen, action: () => navigateTab('projects') },
    { title: 'Manage access', text: 'Review approved administrators, sessions, and authenticator recovery.', icon: ShieldCheck, action: () => navigateTab('security') },
    { title: 'Export project content', text: 'Download your project text and image links as a JSON file.', icon: Download, action: exportProjects },
    { title: 'Check connection', text: 'Check that your signed-in API and database respond right now.', icon: Activity, action: health },
    { title: 'Review client feedback', text: 'Approve client reviews before they appear on your website.', icon: MessageSquare, action: () => navigateTab('feedback') }
  ];
  const overviewContent = <div className="space-y-7">
    <div className="studio-panel bg-gradient-to-r from-blue-500/10 to-transparent flex flex-wrap justify-between items-center gap-6"><div><p className="studio-eyebrow">Your creative workspace</p><h2 className="text-2xl sm:text-3xl font-semibold mt-3 mb-2">Good work deserves a great story.</h2><p className="studio-muted text-sm">Keep your projects current and your next conversation moving.</p></div><button className="studio-button primary" onClick={() => navigateTab('add-project')}><Plus size={16} />Create project</button></div>
    <div className="studio-toolbar"><h2 className="text-lg font-semibold flex-1">Workspace at a glance</h2><button className="studio-button" onClick={load} disabled={loading}><RefreshCw size={14} />{loading ? 'Refreshing…' : 'Refresh'}</button></div>
    {error && <p className="studio-error" role="alert">{error}</p>}<div className="studio-stats">{[{ label: 'Published projects', value: overview?.projects, tab: 'projects', icon: FolderOpen }, { label: 'Inquiries received', value: overview?.inquiries, tab: 'messages', icon: Inbox }, { label: 'Client reviews', value: overview?.reviews, tab: 'feedback', icon: MessageSquare }, { label: 'Awaiting approval', value: overview?.pendingReviews, tab: 'feedback', icon: CheckCircle2 }].map(item => { const Icon = item.icon; return <button key={item.label} className="studio-panel" onClick={() => navigateTab(item.tab)}><Icon size={18} className="text-blue-300" /><p className="studio-stat-number">{loading ? '…' : item.value ?? '—'}</p><p className="studio-muted text-xs">{item.label}</p></button>; })}</div>
    <div className="studio-overview-grid"><section className="studio-panel"><h3 className="text-lg font-semibold mb-2">Make your next move</h3><button className="studio-task" onClick={() => navigateTab('feedback')}><div>Review client stories<small>{overview ? `${overview.pendingReviews} reviews awaiting approval` : 'Open the moderation queue'}</small></div><ArrowRight size={18} /></button><button className="studio-task" onClick={() => navigateTab('projects')}><div>Refresh your selected work<small>Edit case studies and homepage features</small></div><ArrowRight size={18} /></button><button className="studio-task" onClick={() => navigateTab('messages')}><div>Follow up on inquiries<small>Read messages and reply from your email app</small></div><ArrowRight size={18} /></button></section><section className="studio-panel"><ShieldCheck size={24} className="text-emerald-300 mb-5" /><h3 className="text-lg font-semibold">Your access is verified</h3><p className="studio-muted text-sm mt-3 mb-5">Signed in as {admin?.role}. Keep an eye on your active sessions and store your recovery codes safely.</p><button className="studio-button" onClick={() => navigateTab('security')}>Open security center<ArrowRight size={14} /></button></section></div>
  </div>;
  return <div className="studio"><a href="#admin-content" className="skip-link">Skip to workspace content</a><Sidebar activeTab={activeTab} setActiveTab={navigateTab} /><div className="studio-shell"><main className="studio-main" id="admin-content"><header className="studio-header"><div><p className="studio-eyebrow">Workspace / {pages[activeTab][0]}</p><h1>{pages[activeTab][0]}</h1><p className="studio-muted">{pages[activeTab][1]}</p></div><a className="studio-button" href="/" target="_blank" rel="noreferrer">View website<ArrowUpRight size={15} /></a></header>{location.state?.recoveryUsed && <p role="status" className="studio-notice mb-6">You used a recovery code. Keep your remaining codes safe and review your authenticator access.</p>}
    {activeTab === 'social' && <AdminSocialLinks onDirtyChange={setDirty} />}
    {activeTab === 'stats' && overviewContent}
    {activeTab === 'projects' && <AdminProjects onEdit={edit} onCreate={() => navigateTab('add-project')} />}
    {activeTab === 'add-project' && <AddProject key={editing?._id || 'new'} initialProject={editing} onDirtyChange={setDirty} onCancel={() => navigateTab('projects')} onDone={() => { setDirty(false); setEditing(null); setParams({ tab: 'projects' }); void load(); }} />}
    {activeTab === 'feedback' && <AdminFeedback />}{activeTab === 'messages' && <AdminMessages />}{activeTab === 'security' && <AdminSecurity />}
    {activeTab === 'explore' && <section className="space-y-6"><label className="studio-search"><Search size={17} /><input aria-label="Find a workspace tool" placeholder="Find a tool…" value={toolSearch} onChange={event => setToolSearch(event.target.value)} /></label>{toolNotice && <p role="status" className="studio-notice">{toolNotice}</p>}<div className="studio-tool-grid">{tools.filter(tool => `${tool.title} ${tool.text}`.toLowerCase().includes(toolSearch.toLowerCase())).map(tool => { const Icon = tool.icon; return <button className="studio-panel hover:border-blue-400/40 transition-colors" disabled={Boolean(toolBusy)} onClick={tool.action} key={tool.title}><Icon size={26} /><h3>{tool.title}</h3><p className="studio-muted text-sm">{tool.text}</p><span className="text-blue-300 flex items-center gap-2 text-xs mt-6">{toolBusy ? 'Working…' : 'Open tool'}<ArrowRight size={14} /></span></button>; })}</div>{!tools.some(tool => `${tool.title} ${tool.text}`.toLowerCase().includes(toolSearch.toLowerCase())) && <p className="studio-panel studio-muted">No matching tools. Try another search.</p>}</section>}
  </main></div></div>;
}
