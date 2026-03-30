import React from 'react';
import { motion } from 'framer-motion';

const menuItems = [
  { id: 'stats', label: 'Dashboard', icon: '📊' },
  { id: 'add-project', label: 'Add Project', icon: '🚀' }, // New Update here
  { id: 'services', label: 'Manage Services', icon: '🛠️' },
  { id: 'feedback', label: 'Client Reviews', icon: '💬' },
  { id: 'messages', label: 'Inquiries', icon: '✉️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-72 h-screen bg-slate-950 border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 z-50">
      {/* Admin Profile Branding */}
      <div className="mb-10 px-4">
        <h2 className="text-xl font-black text-white tracking-tighter">
          BILEL<span className="text-brand-primary">.ADMIN</span>
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Control Center v1.0</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
              activeTab === item.id 
                ? 'bg-brand-primary text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {/* Active Indicator Glow */}
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeGlow"
                className="absolute inset-0 bg-white/10 rounded-2xl blur-md -z-10"
              />
            )}

            <span className={`text-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${
              activeTab === item.id ? 'opacity-100' : 'grayscale opacity-70 group-hover:grayscale-0'
            }`}>
              {item.icon}
            </span>
            
            <span className="font-bold text-sm tracking-wide">{item.label}</span>
            
            {activeTab === item.id && (
              <motion.div 
                layoutId="activePill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">System Status</p>
          <p className="text-[10px] text-brand-primary font-black uppercase">Database Connected</p>
        </div>
        
        <button className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm group">
          <span className="group-hover:-translate-x-1 transition-transform">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}