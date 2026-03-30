import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import CONFIG from '../api/config';

export default function LatestWork() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get(CONFIG.ENDPOINTS.PROJECTS);
        if (res.data.success) {
          // Takes only the 3 most recent projects from your MongoDB
          setProjects(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Home Gallery Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  // Don't render the section if there are no projects yet
  if (!loading && projects.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-[#091027] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Logic */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-brand-primary font-black uppercase tracking-[0.3em] text-xs">
              Portfolio
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-white italic">
              Latest <span className="text-slate-600">Creations.</span>
            </h3>
          </div>

          <Link 
            to="/projects" 
            className="group flex items-center gap-2 text-white font-bold hover:text-brand-primary transition-all pb-2 border-b-2 border-white/5 hover:border-brand-primary"
          >
            Explore All Works
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton Loading State
            [1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-white/5 rounded-[2rem] animate-pulse border border-white/10" />
            ))
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/[0.08] transition-all"
              >
                {/* Project Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                </div>

                {/* Info Overlay */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2 py-1 rounded border border-brand-primary/20">
                      {project.category}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                    {project.title}
                  </h4>
                  
                  <p className="text-slate-400 text-sm line-clamp-1 mb-6">
                    {project.description}
                  </p>

                  <Link 
                    to="/projects" 
                    className="text-xs font-black uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors"
                  >
                    View Project Details
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}