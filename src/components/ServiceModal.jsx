import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceModal({ isOpen, onClose, service }) {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="text-5xl">{service.icon}</div>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-3xl">×</button>
              </div>

              <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                {service.title}
              </h3>
              
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                {service.longDesc}
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h4 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-4">What's Included</h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">Tech/Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.tools.map((tool, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs text-slate-400">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-brand-primary hover:bg-blue-600 text-white font-bold rounded-2xl transition-all"
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}