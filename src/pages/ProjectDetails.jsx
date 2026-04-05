import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-blue-500/50 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Establishing Connection...</p>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
      <h2 className="text-4xl font-black mb-4 italic">PROJECT <span className="text-blue-500">VOID.</span></h2>
      <Link to="/" className="text-slate-400 hover:text-blue-500 flex items-center gap-2 transition-all font-bold uppercase text-xs tracking-widest">
        <FiArrowLeft /> Return to Base
      </Link>
    </div>
  );

  return (
    /* ELECTRO BLUE THEME BASE */
    <div className="min-h-screen bg-[#020617] text-slate-300 pb-32 overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Dynamic Electro Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
      </div>

      {/* --- 1. PREMIUM NAVIGATION --- */}
      <nav className="max-w-7xl mx-auto p-8 flex justify-between items-center relative z-50">
        <Link to="/" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
            <FiArrowLeft size={14} />
          </div>
          Exit Case Study
        </Link>
        <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
          Bilel.Dev // <span className="text-blue-500">{project.category}</span>
        </div>
      </nav>

      {/* --- 2. BOLD HERO SECTION --- */}
      <header className="max-w-7xl mx-auto px-8 pt-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-end">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
               <FiLayers size={12} /> System Deployment
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter italic uppercase">
              {project.title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 0 ? "text-white" : "text-blue-500 block"}>{word} </span>
              ))}
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-2xl font-medium border-l-2 border-blue-500/30 pl-6">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-8 items-center pt-6">
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
              >
                Access Live Node <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              {project.duration && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Dev Cycle</span>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <FiClock className="text-blue-500" /> {project.duration}
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
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-blue-500/20 shadow-[0_0_100px_rgba(37,99,235,0.15)]">
               <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
          </motion.div>
        </div>
      </header>

      {/* --- 3. ANALYTICS / CORE DETAILS --- */}
      <main className="max-w-7xl mx-auto px-8 mt-40 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* FEATURES PILLAR */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-12 rounded-[3rem] backdrop-blur-sm"
          >
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/40">
              <FiZap size={28} />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 italic">Engine <span className="text-blue-500">Specs.</span></h3>
            <ul className="space-y-6">
              {project.features && project.features.map((feature, idx) => (
                <li key={idx} className="group flex items-start gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-white group-hover:scale-125 transition-all"></div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors leading-tight tracking-tight">{feature}</span>
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
              className="bg-white/[0.02] border border-white/10 p-12 rounded-[3rem] relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                    <FiTarget size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">The Obstacle</h3>
              </div>
              <p className="text-lg text-slate-400 leading-relaxed font-medium relative z-10">
                {project.challenges}
              </p>
              <div className="absolute top-0 right-0 p-8 text-white/[0.02] font-black text-8xl pointer-events-none select-none">01</div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-blue-600/[0.05] border border-blue-500/30 p-12 rounded-[3rem] relative overflow-hidden group hover:bg-blue-600/[0.08] transition-colors"
            >
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                    <FiCheckCircle size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">The Execution</h3>
              </div>
              <p className="text-lg text-blue-50 font-medium leading-relaxed relative z-10">
                {project.solutions}
              </p>
              <div className="absolute top-0 right-0 p-8 text-blue-500/[0.05] font-black text-8xl pointer-events-none select-none">02</div>
            </motion.section>
          </div>
        </div>
      </main>

      {/* --- 4. TECHNOLOGY STRIP --- */}
      <footer className="max-w-7xl mx-auto px-8 mt-32">
        <div className="pt-20 border-t border-blue-500/10 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 mb-10 italic">Integrated Technologies</span>
          <div className="flex flex-wrap justify-center gap-4">
            {project.tags && project.tags.map((tag, idx) => (
              <motion.span 
                key={idx} 
                whileHover={{ y: -5, borderColor: '#3b82f6', color: '#fff' }}
                className="px-6 py-3 bg-blue-500/[0.03] border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest transition-all cursor-default"
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