import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feedback() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', rating: 5 });
  const [submitted, setSubmitted] = useState(false);

  // Mock data for the 6 cards (Replace with real DB data later)
  const feedbackCards = [
    { name: "Sarah Jenkins", role: "Marketing Director", text: "Bilel transformed our landing page into a high-converting machine. Flawless execution.", rating: 5 },
    { name: "Marco Rossi", role: "SaaS Founder", text: "The combination of MERN expertise and Meta Ads knowledge is rare. ROI increased by 40%.", rating: 5 },
    { name: "Elena Petrov", role: "E-commerce Owner", text: "Fast, professional, and understood our brand vision perfectly. Highly recommended!", rating: 5 },
    { name: "James Wilson", role: "Tech Lead", text: "Clean code and great communication. The React 19 integration was handled perfectly.", rating: 5 },
    { name: "Amira Hassan", role: "Startup CEO", text: "Bilel delivered a complex dashboard ahead of schedule. Truly a full-stack expert.", rating: 5 },
    { name: "David Chen", role: "Digital Creator", text: "The custom animations and speed optimization made a huge difference for my portfolio.", rating: 5 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback data:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen py-20 px-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-24 left-10 w-72 h-72 bg-brand-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-24 right-10 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              Client <span className="text-brand-primary">Voices.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Real feedback from global partners. Each review represents a successful collaboration and a business scaled.
            </p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Leave a Review
            <span className="ml-2 inline-block group-hover:rotate-12 transition-transform">✍️</span>
          </button>
        </div>

        {/* FEEDBACK GRID (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {feedbackCards.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-primary/40 transition-all duration-500 hover:bg-white/[0.07] flex flex-col justify-between relative overflow-hidden"
            >
              {/* Quote Icon Decoration */}
              <div className="absolute -top-4 -right-2 text-9xl text-white/[0.03] font-serif pointer-events-none group-hover:text-brand-primary/5 transition-colors">"</div>
              
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(item.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-8 italic text-lg">"{item.text}"</p>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h4 className="text-white font-bold">{item.name}</h4>
                <p className="text-brand-primary text-xs font-bold uppercase tracking-widest">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FORM MODAL POP-UP */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-xl bg-slate-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl"
            >
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 text-3xl animate-bounce">✓</div>
                  <h3 className="text-3xl font-black text-white">Review Received!</h3>
                  <p className="text-slate-400 mt-3">Thanks for supporting Bilel.dev</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-3xl font-black text-white italic">Share your <span className="text-brand-primary underline underline-offset-8 decoration-4">story.</span></h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white text-2xl">×</button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Full Name</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all" placeholder="John Doe" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Professional Role</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all" placeholder="CEO / Manager" onChange={(e) => setFormData({...formData, role: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Your Email</label>
                      <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all" placeholder="john@example.com" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">The Collaboration Experience</label>
                      <textarea required rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all resize-none" placeholder="Tell the world how we worked together..." onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                    </div>

                    <button type="submit" className="w-full py-5 bg-brand-primary hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest">
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