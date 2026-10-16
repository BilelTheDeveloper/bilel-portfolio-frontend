import { clearProjectsCache } from '../../api/projects';
import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
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
    image: null,
    isFeatured: false,
    // --- 🚀 NEW DETAILED FIELDS ---
    tags: '',
    longDescription: '',
    features: '',    // Will be converted to array on submit
    challenges: '',
    solutions: '',
    duration: ''
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setStatus({ type: 'error', msg: 'Choose a JPG, PNG, or WebP image smaller than 5 MB.' }); e.target.value = ''; return; }
      setProject({ ...project, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus({ type: '', msg: '' });

    const formData = new FormData();
    formData.append('isFeatured', String(Boolean(project.isFeatured)));
    formData.append('title', project.title);
    formData.append('category', project.category);
    formData.append('description', project.description);
    formData.append('link', project.link);
    formData.append('image', project.image);

    // --- 🚀 APPENDING NEW FIELDS ---
    // Convert comma-separated string to array
    const featuresArray = project.features.split(',').map(f => f.trim()).filter(f => f !== '');
    formData.append('features', JSON.stringify(featuresArray));
    formData.append('tags', project.tags || '');
    formData.append('longDescription', project.longDescription || '');
    formData.append('challenges', project.challenges);
    formData.append('solutions', project.solutions);
    formData.append('duration', project.duration);

    try {
      const response = await axios.post(CONFIG.ENDPOINTS.PROJECTS, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (response.data.success) {
        clearProjectsCache();
        setStatus({ type: 'success', msg: 'Project deployed to portfolio successfully!' });

        // Reset form AND preview after success
        setProject({
          title: '',
          category: 'Web Development',
          description: '',
          link: '',
          image: null,
          features: '',
          challenges: '',
          solutions: '',
          duration: ''
        });
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

          <div className="space-y-2"><label htmlFor="project-tags" className="block text-sm text-slate-300">Technologies (comma separated)</label><input id="project-tags" maxLength={500} value={project.tags || ''} onChange={event => setProject({ ...project, tags: event.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3" placeholder="React, Node.js, MongoDB" /></div>
          <div className="space-y-2"><label htmlFor="project-overview" className="block text-sm text-slate-300">Case study overview</label><textarea id="project-overview" maxLength={10000} value={project.longDescription || ''} onChange={event => setProject({ ...project, longDescription: event.target.value })} rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3" /></div>
          <label className="flex items-center gap-3 text-sm text-slate-200"><input type="checkbox" checked={Boolean(project.isFeatured)} onChange={event => setProject({ ...project, isFeatured: event.target.checked })} /> Feature this project</label>
          {status.msg && (
            <Motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-xs font-bold text-center ${
                status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {status.msg}
            </Motion.div>
          )}

          <div className="space-y-2">
            <label htmlFor="project-title" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Project Title</label>
            <input id="project-title" maxLength={100}
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
              <label htmlFor="project-category" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Category</label>
              <select id="project-category"
                value={project.category}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none appearance-none cursor-pointer"
                onChange={(e) => setProject({...project, category: e.target.value})}
              >
                <option>Web Development</option>
                <option>Meta Ads Case Study</option>
                <option>UI/UX Design</option>
                <option>Digital Marketing</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="project-duration" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Duration</label>
              <input id="project-duration" maxLength={100}
                type="text"
                value={project.duration}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none"
                placeholder="e.g. 3 Months"
                onChange={(e) => setProject({...project, duration: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="project-link" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Live URL</label>
            <input id="project-link" maxLength={2048}
              required
              type="text"
              value={project.link}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none"
              placeholder="https://..."
              onChange={(e) => setProject({...project, link: e.target.value})}
            />
          </div>

          {/* NEW: FEATURES INPUT */}
          <div className="space-y-2">
            <label htmlFor="project-features" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Key Features (Comma separated)</label>
            <input id="project-features" maxLength={4000}
              type="text"
              value={project.features}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none"
              placeholder="e.g. Auth, Cloudinary, Framer Motion"
              onChange={(e) => setProject({...project, features: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project-description" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Short Description</label>
            <textarea id="project-description" maxLength={500}
              required
              rows="2"
              value={project.description}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none resize-none"
              placeholder="Short impact summary for card..."
              onChange={(e) => setProject({...project, description: e.target.value})}
            />
          </div>

          {/* NEW: CHALLENGES & SOLUTIONS */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="project-challenges" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Main Challenge</label>
              <textarea id="project-challenges" maxLength={10000}
                rows="3"
                value={project.challenges}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none resize-none"
                placeholder="What was difficult?"
                onChange={(e) => setProject({...project, challenges: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="project-solutions" className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 ml-2">Your Solution</label>
              <textarea id="project-solutions" maxLength={10000}
                rows="3"
                value={project.solutions}
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-primary outline-none resize-none"
                placeholder="How did you solve it?"
                onChange={(e) => setProject({...project, solutions: e.target.value})}
              />
            </div>
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

          <Motion.div
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
                {project.duration && (
                  <span className="text-slate-500 text-[10px] font-bold uppercase">{project.duration}</span>
                )}
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
          </Motion.div>
        </div>

      </div>
    </div>
  );
}
