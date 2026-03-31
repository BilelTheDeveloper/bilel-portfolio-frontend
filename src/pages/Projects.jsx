import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import CONFIG from '../api/config';

export default function Projects() {
  const [myWorks, setMyWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Projects from MongoDB on Page Load
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(CONFIG.ENDPOINTS.PROJECTS);
        if (res.data.success) {
          setMyWorks(res.data.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto min-h-screen ">
      {/* Header Area */}
      <div className="mb-16">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-black mb-4 italic text-white"
        >
          Selected <span className="text-brand-primary">Works.</span>
        </motion.h2>
        <p className="text-slate-400 max-w-xl text-lg font-medium">
          A collection of projects I've built, ranging from web apps to complex system architectures.
        </p>
      </div>

      {/* 2. Loading State (Skeleton Cards) */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[450px] bg-slate-900/50 rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      )}

      {/* 3. Error State */}
      {!loading && error && (
        <div className="text-center py-20 bg-red-500/5 border border-red-500/20 rounded-3xl">
          <p className="text-red-400 font-bold">{error}</p>
        </div>
      )}

      {/* 4. Empty State (No Projects in DB) */}
      {!loading && !error && myWorks.length === 0 && (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
          <p className="text-slate-500 font-medium">No projects deployed yet. Check back soon!</p>
        </div>
      )}

      {/* 5. Real Data Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myWorks.map((project, index) => (
            <motion.div 
              key={project._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-brand-primary/50 transition-all duration-300 shadow-2xl"
            >
              {/* Image Container */}
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                {/* Category Overlay */}
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-brand-primary border border-brand-primary/20">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags && project.tags.length > 0 ? (
                    project.tags.map(t => (
                      <span key={t} className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-white/5 text-slate-500">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-white/5 text-slate-600">
                      Full Stack
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-brand-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm font-bold flex items-center gap-2 text-white hover:text-brand-primary transition-all group/btn"
                  >
                    Launch Project 
                    <span className="group-hover/btn:translate-x-2 transition-transform duration-300 text-brand-primary">→</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}