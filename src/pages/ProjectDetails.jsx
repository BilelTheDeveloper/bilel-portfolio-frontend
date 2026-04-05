import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FiArrowLeft, 
  FiExternalLink, 
  FiClock, 
  FiCheckCircle, 
  FiTarget, 
  FiZap, 
  FiLayers 
} from 'react-icons/fi';
import CONFIG from '../api/config';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${CONFIG.ENDPOINTS.PROJECTS}/${id}`);
        if (res.data.success) {
          setProject(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Decrypting Case Study...</p>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center text-white">
      <h2 className="text-4xl font-black mb-4 italic">404 <span className="text-brand-primary">Lost.</span></h2>
      <Link to="/" className="text-slate-400 hover:text-brand-primary flex items-center gap-2 transition-all font-bold uppercase text-xs tracking-widest">
        <FiArrowLeft /> Return to Base
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-300 pb-32 overflow-x-hidden">
      
      {/* --- 1. PREMIUM NAVIGATION --- */}
      <nav className="max-w-7xl mx-auto p-8 flex justify-between items-center relative z-50">
        <Link to="/" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-primary/50 group-hover:bg-brand-primary/10 transition-all">
            <FiArrowLeft size={14} />
          </div>
          Back to Work
        </Link>
        <div className="hidden md:block h-[1px] w-20 bg-white/10 mx-4"></div>
        <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
          Bilel.Dev // <span className="text-brand-primary">{project.category}</span>
        </div>
      </nav>

      {/* --- 2. BOLD HERO SECTION --- */}
      <header className="max-w-7xl mx-auto px-8 pt-12 relative">
        {/* Background Glow */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="grid lg:grid-cols-12 gap-16 items-end">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary text-[10px] font-black uppercase tracking-widest">
               <FiLayers size={12} /> Case Study Detail
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter italic">
              {project.title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 0 ? "text-white" : "text-brand-primary block"}>{word} </span>
              ))}
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-medium">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-8 items-center pt-6">
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group px-10 py-5 bg-white text-black font-black rounded-2xl transition-all flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
              >
                Explore Live <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              {project.duration && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Timeline</span>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <FiClock className="text-brand-primary" /> {project.duration}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
               <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Geometric Accent */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border-b-4 border-l-4 border-brand-primary rounded-bl-3xl z-0"></div>
          </motion.div>
        </div>
      </header>

      {/* --- 3. ANALYTICS / CORE DETAILS --- */}
      <main className="max-w-7xl mx-auto px-8 mt-40">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* FEATURES PILLAR */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-white/[0.07] to-transparent border border-white/10 p-12 rounded-[3rem]"
          >
            <div className="w-14 h-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-brand-primary/20">
              <FiZap size={28} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 italic">Core <span className="text-brand-primary">Logic.</span></h3>
            <ul className="space-y-6">
              {project.features && project.features.map((feature, idx) => (
                <li key={idx} className="group flex items-start gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary group-hover:scale-150 transition-transform"></div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CHALLENGE & SOLUTION STACK */}
          <div className="lg:col-span-2 space-y-8">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                    <FiTarget size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">The Challenge</h3>
              </div>
              <p className="text-lg text-slate-400 leading-relaxed font-medium relative z-10">
                {project.challenges || "Confidential project parameters requiring custom architectural implementation and interface optimization."}
              </p>
              <div className="absolute top-0 right-0 p-8 text-white/[0.02] font-black text-8xl pointer-events-none select-none">01</div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-brand-primary/[0.03] border border-brand-primary/20 p-12 rounded-[3rem] relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                    <FiCheckCircle size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">The Solution</h3>
              </div>
              <p className="text-lg text-slate-300 leading-relaxed font-medium relative z-10">
                {project.solutions || "Deployment of scalable micro-interactions and optimized backend logic to achieve peak user retention."}
              </p>
              <div className="absolute top-0 right-0 p-8 text-brand-primary/[0.03] font-black text-8xl pointer-events-none select-none">02</div>
            </motion.section>
          </div>
        </div>
      </main>

      {/* --- 4. TECHNOLOGY STRIP --- */}
      <footer className="max-w-7xl mx-auto px-8 mt-32">
        <div className="pt-20 border-t border-white/5 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 mb-10">Technological Stack</span>
          <div className="flex flex-wrap justify-center gap-4">
            {project.tags && project.tags.map((tag, idx) => (
              <motion.span 
                key={idx} 
                whileHover={{ y: -5 }}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all cursor-default"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}