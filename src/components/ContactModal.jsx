import Dialog from './Dialog';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import axios from 'axios';
import CONFIG from '../api/config';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', subject: 'New Portfolio Inquiry' });
  const receipt = useRef({ signature: '', key: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');

    try {
      const signature = JSON.stringify(formData);
      if (receipt.current.signature !== signature) receipt.current = { signature, key: crypto.randomUUID() };
      const res = await axios.post(`${CONFIG.API_URL}/messages`, formData, { headers: { 'Idempotency-Key': receipt.current.key } });

      if (!res.data.success) throw new Error('Inquiry not accepted');
      if (res.data.success) {
        receipt.current = { signature: '', key: '' };
        setStatus('success');
        // Reset form after successful send
        setFormData({ name: '', email: '', message: '', subject: 'New Portfolio Inquiry' });


      }
    } catch (err) {
      console.error("Submission Error:", err);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog label="Contact Bilel" onClose={onClose}>
          {/* Backdrop Blur */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <Motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className="relative w-full max-w-lg bg-[#0a1120] border border-white/10 p-10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] max-h-[90dvh] overflow-y-auto"
          >
            {/* Design Elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 blur-[100px] -z-10" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10" />

            {status === 'success' ? (
              <Motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✅</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2">Inquiry <span className="text-green-500">Received!</span></h2>
                <p role="status" className="text-slate-300">Thanks for reaching out. I’ll reply as soon as I can.</p><button className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold" onClick={() => { onClose(); setStatus('idle'); }}>Done</button>
              </Motion.div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-4xl font-black text-white italic">Let's <span className="text-brand-primary">Talk.</span></h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Direct access to my workspace</p>
                  </div>
                  <button aria-label="Close dialog"
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-2xl"
                  >
                    ×
                  </button>
                </div>

                <p className="sr-only" role="status" aria-live="polite">{status === 'loading' ? 'Sending your inquiry…' : status === 'error' ? 'Unable to send. Please retry or email bilel.thedeveloper@gmail.com.' : ''}</p>
                {status === 'error' && <p role="alert" className="mb-4 text-red-300 text-sm">Your inquiry could not be confirmed. Please retry or <a className="underline" href="mailto:bilel.thedeveloper@gmail.com">email me directly</a>.</p>}
                <form onSubmit={handleSubmit} aria-busy={status === 'loading'} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Name</label>
                      <input id="contact-name" name="name" maxLength={100}
                        type="text"
                        required
                        disabled={status === 'loading'}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary focus:bg-brand-primary/5 outline-none transition-all placeholder:text-slate-700"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Email</label>
                      <input id="contact-email" name="email" maxLength={254}
                        type="email"
                        required
                        disabled={status === 'loading'}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary focus:bg-brand-primary/5 outline-none transition-all placeholder:text-slate-700"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Message</label>
                    <textarea id="contact-message" name="message" maxLength={5000}
                      required
                      disabled={status === 'loading'}
                      rows="4"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-primary focus:bg-brand-primary/5 outline-none transition-all resize-none placeholder:text-slate-700"
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full py-5 font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 ${
                      status === 'error'
                      ? 'bg-red-500 text-white'
                      : 'bg-brand-primary hover:bg-blue-600 text-white shadow-blue-500/20'
                    }`}
                  >
                    {status === 'loading' ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : status === 'error' ? (
                      "Connection Failed"
                    ) : (
                      <>Send Inquiry <span className="text-xl">🚀</span></>
                    )}
                  </button>
                </form>
              </>
            )}
          </Motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
