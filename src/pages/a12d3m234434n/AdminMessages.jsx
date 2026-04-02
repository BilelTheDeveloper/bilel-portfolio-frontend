import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Calendar, User, Tag } from 'lucide-react'; // Optional: install lucide-react or use SVGs
import CONFIG from '../../api/config';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch all messages from DB
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${CONFIG.API_URL}/messages`, { withCredentials: true });
      setMessages(res.data.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 2. Delete Message Logic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await axios.delete(`${CONFIG.API_URL}/messages/${id}`, { withCredentials: true });
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (err) {
      alert("Failed to delete message.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Encrypted Inbox...</p>
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic">
            Inquiry <span className="text-brand-primary">Control.</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage your incoming leads and business inquiries.</p>
        </div>
        <div className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-xl">
          <span className="text-brand-primary font-black text-sm">{messages.length} TOTAL MESSAGES</span>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid gap-6">
        <AnimatePresence mode='popLayout'>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <motion.div
                key={msg._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.04] hover:border-brand-primary/30 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  {/* Left: Sender Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <User size={18} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{msg.name}</h3>
                        <p className="text-brand-primary text-xs font-black uppercase tracking-tighter">{msg.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">
                       <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(msg.createdAt).toLocaleDateString()}</span>
                       <span className="flex items-center gap-1"><Tag size={12}/> {msg.subject}</span>
                    </div>

                    <div className="bg-slate-950/40 border border-white/5 p-6 rounded-2xl relative">
                      <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex lg:flex-col justify-end items-center gap-3">
                    <a 
                      href={`mailto:${msg.email}`}
                      className="p-4 bg-white/5 hover:bg-brand-primary hover:text-white text-slate-400 rounded-2xl transition-all group/btn"
                      title="Reply via Email"
                    >
                      <Mail size={20} className="group-hover/btn:scale-110 transition-transform"/>
                    </a>
                    <button 
                      onClick={() => handleDelete(msg._id)}
                      className="p-4 bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-slate-400 rounded-2xl transition-all group/btn"
                      title="Delete Message"
                    >
                      <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]"
            >
              <div className="text-4xl mb-4 opacity-20">📥</div>
              <h3 className="text-white font-bold text-xl">Inbox is empty</h3>
              <p className="text-slate-500 text-sm">No new inquiries at the moment. Time to run some Meta Ads?</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}