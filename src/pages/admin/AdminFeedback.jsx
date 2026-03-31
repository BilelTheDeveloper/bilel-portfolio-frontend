import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CONFIG from '../../api/config';

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch ALL feedback (Approved + Pending)
  const fetchFeedback = async () => {
    try {
      const res = await axios.get(`${CONFIG.API_URL}/feedback/admin`);
      setFeedbacks(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // 2. Toggle Approval Status
  const toggleApproval = async (id, currentStatus) => {
    try {
      await axios.patch(`${CONFIG.API_URL}/feedback/${id}`, { 
        isApproved: !currentStatus 
      });
      // Update local state for instant UI feel
      setFeedbacks(feedbacks.map(f => 
        f._id === id ? { ...f, isApproved: !currentStatus } : f
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // 3. Delete Feedback
  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure? This action is permanent.")) return;
    try {
      await axios.delete(`${CONFIG.API_URL}/feedback/${id}`);
      setFeedbacks(feedbacks.filter(f => f._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-primary"></div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-white italic">Review <span className="text-brand-primary">Management.</span></h2>
          <p className="text-slate-500 text-sm mt-1">Control which client voices appear on your public portfolio.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
          <span className="text-brand-primary font-bold">{feedbacks.length}</span>
          <span className="text-slate-400 text-xs uppercase ml-2 tracking-widest font-bold">Total Reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {feedbacks.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item._id}
              className={`p-6 rounded-2xl border transition-all ${
                item.isApproved 
                ? 'bg-brand-primary/5 border-brand-primary/20' 
                : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg">{item.name}</h3>
                    <span className="text-[10px] bg-white/10 text-slate-400 px-2 py-0.5 rounded-md uppercase font-black tracking-tighter">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm italic leading-relaxed mb-4">"{item.message}"</p>
                  <div className="text-[10px] text-slate-600 font-mono">ID: {item._id} • {new Date(item.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Approval Toggle */}
                  <button
                    onClick={() => toggleApproval(item._id, item.isApproved)}
                    className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      item.isApproved 
                      ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/30'
                    }`}
                  >
                    {item.isApproved ? '● Live' : '○ Draft'}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteFeedback(item._id)}
                    className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}