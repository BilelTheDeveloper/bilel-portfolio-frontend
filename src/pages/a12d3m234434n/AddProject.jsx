import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import CONFIG from '../../api/config';

export default function AddProject() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  const [project, setProject] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    link: '',
    image: null
  });

  // FIX: Ghost placeholder removed. Initial state is null.
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProject({ ...project, image: file });
      // FIX: Creates a temporary local URL for the preview
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    const formData = new FormData();
    formData.append('title', project.title);
    formData.append('category', project.category);
    formData.append('description', project.description);
    formData.append('link', project.link);
    formData.append('image', project.image);

    try {
      const response = await axios.post(CONFIG.ENDPOINTS.PROJECTS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true 
      });

      if (response.data.success) {
        setStatus({ type: 'success', msg: 'Project deployed to portfolio successfully!' });
        
        // UPDATE: Reset form AND preview after success
        setProject({ title: '', category: 'Web Development', description: '', link: '', image: null });
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setStatus({ 
        type: 'error', 
        msg: err.response?.data?.message || 'Deployment failed. Check server connection.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white italic">Deploy New <span className="text-brand-primary">Work.</span></h2>
        <p className="text-slate-500 mt-2 font-medium">Fill in the details to update your public portfolio grid.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT: FORM SIDE */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-2xl relative">
          
          {status.msg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-xs font-bold text-center ${
                status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {status.msg}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Project Title</label>
            <input 
              required
              type="text" 
              value={project.title}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-slate-700"
              placeholder="e.g. E-commerce Dashboard"
              onChange={(e) => setProject({...project, title: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Category</label>
              <select 
                value={project.category}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none appearance-none cursor-pointer"
                onChange={(e) => setProject({...project, category: e.target.value})}
              >
                <option>Web Development</option>
                <option>Meta Ads Case Study</option>
                <option>UI/UX Design</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Live URL</label>
              <input 
                required
                type="text" 
                value={project.link}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none"
                placeholder="https://..."
                onChange={(e) => setProject({...project, link: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Description</label>
            <textarea 
              required
              rows="3"
              value={project.description}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none resize-none"
              placeholder="Short impact summary..."
              onChange={(e) => setProject({...project, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Image Assets</label>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                id="file-upload"
                onChange={handleImageChange}
              />
              <label 
                htmlFor="file-upload" 
                className={`flex items-center justify-center w-full py-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all font-bold ${
                  project.image ? 'border-brand-primary/50 bg-brand-primary/5 text-white' : 'border-white/10 text-slate-500 group-hover:border-brand-primary/50'
                }`}
              >
                {project.image ? "✓ Image Attached" : "Click to Upload Project Mockup"}
              </label>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-5 bg-brand-primary hover:bg-blue-600 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest active:scale-95 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Deploying...
              </>
            ) : "Publish to Portfolio"}
          </button>
        </form>

        {/* RIGHT: LIVE PREVIEW SIDE */}
        <div className="sticky top-10 space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Live Preview Card</h4>
          
          <motion.div 
            className="group relative rounded-[2.5rem] bg-slate-900 border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="aspect-video w-full bg-slate-800 overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="text-slate-600 font-bold uppercase tracking-tighter text-xl italic opacity-20">
                  No Mockup Selected
                </div>
              )}
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand-primary/20">
                  {project.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {project.title || "Project Title"}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                {project.description || "The description of your project will appear here..."}
              </p>
              <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
                View Project <span>→</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}