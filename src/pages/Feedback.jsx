import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CONFIG from '../api/config';

export default function Feedback() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', role: '', email: '', message: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // 1. Fetch only APPROVED feedback from DB
  useEffect(() => {
    const fetchApprovedFeedback = async () => {
      try {
        const res = await axios.get(`${CONFIG.API_URL}/feedback`);
        setFeedbacks(res.data.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedFeedback();
  }, []);

  // 2. Handle Form Submission to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${CONFIG.API_URL}/feedback`, formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsModalOpen(false);
        setFormData({ name: '', role: '', email: '', message: '', rating: 5 });
      }, 3000);
    } catch (err) {
      alert("Submission failed. Please try again.");
    }
  };

  const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave, size = "w-4 h-4" }) => (
    <svg 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`${size} cursor-pointer transition-all duration-200 ${filled ? 'text-brand-primary' : 'text-slate-600'}`} 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="min-h-screen py-24 px-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-24 left-10 w-72 h-72 bg-brand-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-24 right-10 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tighter"
            >
              Client <span className="text-brand-primary">Voices.</span>
            </motion.h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Real feedback from global partners. Each review represents a successful collaboration and a business scaled.
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative px-10 py-5 bg-white text-slate-950 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] uppercase tracking-widest text-sm"
          >
            Leave a Review
            <span className="ml-3 inline-block group-hover:rotate-12 transition-transform">✍️</span>
          </button>
        </div>

        {/* FEEDBACK GRID */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {feedbacks.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  key={item._id}
                  className="group p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-brand-primary/40 transition-all duration-500 hover:bg-white/[0.06] flex flex-col justify-between relative"
                >
                  <div className="absolute -top-4 -right-2 text-9xl text-white/[0.02] font-serif pointer-events-none group-hover:text-brand-primary/5 transition-colors">"</div>
                  
                  <div>
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} filled={i < item.rating} />
                      ))}
                    </div>
                    <p className="text-slate-200 leading-relaxed mb-8 italic text-lg font-medium">"{item.message}"</p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{item.name}</h4>
                      <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FORM MODAL POP-UP */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-xl bg-[#0a0f1a] border border-white/10 p-10 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary"></div>

              {submitted ? (
                <div className="py-16 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">✓</motion.div>
                  <h3 className="text-4xl font-black text-white tracking-tighter">Review Received!</h3>
                  <p className="text-slate-400 mt-4 text-lg">Thank you for your support, Bilel will review it soon.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-3xl font-black text-white italic tracking-tight">Share your <span className="text-brand-primary underline underline-offset-8 decoration-4">story.</span></h3>
                      <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">Help others scale their business</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:bg-red-500/20 hover:text-red-500">×</button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* STAR RATING PICKER */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-3">
                      <label className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-primary">Rate your experience</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon 
                            key={star}
                            size="w-8 h-8"
                            filled={hoverRating ? star <= hoverRating : star <= formData.rating}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setFormData({...formData, rating: star})}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-2">Full Name</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-slate-700" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-2">Your Role</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-slate-700" placeholder="CEO / Founder" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-2">Professional Email</label>
                      <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-slate-700" placeholder="john@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-2">The Collaboration</label>
                      <textarea required rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all resize-none placeholder:text-slate-700" placeholder="Tell us about the project success..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                    </div>

                    <button type="submit" className="w-full py-5 bg-brand-primary hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/30 uppercase tracking-[0.2em] text-sm active:scale-[0.98]">
                      Publish Review
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}