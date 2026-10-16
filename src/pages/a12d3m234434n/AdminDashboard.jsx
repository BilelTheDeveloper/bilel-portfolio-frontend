import axios from 'axios';
import CONFIG from '../../api/config';
import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

// --- Components ---
import Sidebar from './Sidebar';
import AdminSecurity from './AdminSecurity';
import { useLocation, useOutletContext } from 'react-router-dom';
import AddProject from './AddProject';
import AdminFeedback from './AdminFeedback';
import AdminMessages from './AdminMessages'; // NEW: Import the Inquiry management page

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const location = useLocation();
  const { admin } = useOutletContext();
  const [overview, setOverview] = useState(null);
  const [overviewError, setOverviewError] = useState(false);
  useEffect(() => {
    if (activeTab !== 'stats') return;
    let active = true;
    axios.get(`${CONFIG.API_URL}/auth/overview`).then(response => { if (active) { setOverview(response.data.data); setOverviewError(false); } }).catch(() => { if (active) setOverviewError(true); });
    return () => { active = false; };
  }, [activeTab]);

  /**
   * Unified Content Router
   * Switches between views based on Sidebar selection
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Projects" value={overview?.projects ?? "—"} growth="Published" />
              <StatCard title="Inquiries" value={overview?.inquiries ?? "—"} growth="Received" />
              <StatCard title="Reviews" value={overview?.reviews ?? "—"} growth={`${overview?.pendingReviews ?? "—"} pending`} />
            </div>

            {/* Recent Activity Section */}
            <div className="p-10 bg-white/2 border border-white/5 rounded-[2.5rem]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                System Overview
              </h3>
              <div className="text-slate-500 text-sm italic font-medium">
                {overviewError ? "Dashboard counts could not be loaded. Reopen this tab to retry." : overview ? "Counts reflect the current database. Review pending feedback and respond to inquiries from the sidebar." : "Loading current portfolio counts…"}
              </div>
            </div>
          </div>
        );

      case 'add-project':
        return <AddProject />;
      case 'feedback':
        return <AdminFeedback />;

      case 'security':
        return <AdminSecurity />;
      case 'messages': // NEW: This case handles the Inquiries tab
        return <AdminMessages />;

      default:
        return (
          <div className="p-20 bg-white/2 border border-white/5 rounded-[3rem] text-center">
            <p className="text-slate-500 italic">
              The <span className="text-brand-primary font-bold">{activeTab}</span> module is currently under construction.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white selection:bg-brand-primary/30">
      {/* Fixed Persistent Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="lg:ml-72 p-5 sm:p-8 lg:p-12 min-h-screen">

        {/* Dynamic Header */}
        <header className="flex flex-wrap gap-6 justify-between items-center mb-10">
          <Motion.div
            key={activeTab + "header"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black capitalize tracking-tighter">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-bold uppercase tracking-widest opacity-70">
              Bilel Dashboard <span className="mx-2">/</span> {activeTab}
            </p>
          </Motion.div>

          <div className="flex items-center gap-6 bg-white/5 p-2 pr-6 rounded-2xl border border-white/10 hover:border-brand-primary/30 transition-all">
            <div className="relative">
               <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-blue-400 flex items-center justify-center text-xl shadow-lg">
                 👨‍💻
               </div>
               <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#05070a] rounded-full"></span>
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-white leading-none mb-1 truncate max-w-[190px]" title={admin?.email}>{admin?.email || "Administrator"}</p>
              <p className="text-[10px] text-brand-primary font-black uppercase tracking-tighter">{admin?.role || "Admin"} · Verified</p>
            </div>
          </div>
        </header>

        {location.state?.recoveryUsed && <p role="status" className="mb-7 p-4 border border-amber-300/20 rounded-xl text-amber-200 text-sm">You signed in with a recovery code. Keep your remaining codes safe. If your phone is lost, use the documented operator recovery procedure to replace your authenticator.</p>}
        {/* Dynamic View Section with Professional Transitions */}
        <AnimatePresence mode="wait">
          <Motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderContent()}
          </Motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Internal Mini-Component for Stats
function StatCard({ title, value, growth }) {
  return (
    <div className="p-8 bg-white/2 border border-white/10 rounded-[2.5rem] hover:border-brand-primary/40 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-3xl -z-10 group-hover:bg-brand-primary/10 transition-all"></div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-5xl font-black text-white tracking-tighter group-hover:text-brand-primary transition-colors">{value}</h3>
        <div className="px-3 py-1 bg-brand-primary/10 rounded-full border border-brand-primary/20">
          <span className="text-brand-primary text-[10px] font-bold">{growth}</span>
        </div>
      </div>
    </div>
  );
}
