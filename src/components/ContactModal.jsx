import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // We will connect this to your backend next!
    onClose(); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Background Glow inside Modal */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/20 blur-[80px] -z-10" />

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-white">Let's <span className="text-brand-primary">Talk.</span></h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-all"
                  placeholder="Your name"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-all"
                  placeholder="your@email.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Message</label>
                <textarea 
                  required
                  rows="4"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-primary outline-none transition-all resize-none"
                  placeholder="How can I help you?"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-brand-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}