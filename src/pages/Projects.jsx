import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CONFIG from '../api/config';


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  :root {
    --brand: #3b82f6;
    --brand-glow: rgba(59,130,246,0.35);
    --dark-bg: #060e25;
    --dark-mid: #091027;
    --card-bg: rgba(255,255,255,0.03);
    --border: rgba(255,255,255,0.07);
  }

  .projects-root { font-family: 'Space Grotesk', sans-serif; }
  .projects-root h1,
  .projects-root h2,
  .projects-root h3 { font-family: 'Syne', sans-serif; }

  /* ── NOISE ── */
  .noise-overlay {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.04;
    pointer-events: none;
  }

  /* ── GRID TEXTURE ── */
  .grid-texture {
    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  /* ── 3D CARD ── */
  .card-3d-wrapper {
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  .card-3d {
    transform-style: preserve-3d;
    transition: transform 0.08s ease-out;
    will-change: transform;
  }

  .card-3d-inner {
    transform-style: preserve-3d;
  }

  .card-shine {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 10;
    background: radial-gradient(
      600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(255,255,255,0.08),
      transparent 40%
    );
  }

  .card-3d:hover .card-shine {
    opacity: 1;
  }

  /* ── HOLOGRAPHIC BORDER ── */
  @keyframes holoBorder {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .holo-border {
    background: linear-gradient(
      135deg,
      rgba(59,130,246,0.6),
      rgba(96,165,250,0.4),
      rgba(56,189,248,0.5),
      rgba(59,130,246,0.6)
    );
    background-size: 300% 300%;
    animation: holoBorder 4s ease infinite;
    padding: 1px;
    border-radius: 1.5rem;
  }

  /* ── SCANLINE EFFECT ── */
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  .scanline {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.15), transparent);
    animation: scanline 8s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* ── FILTER TABS ── */
  .filter-tab {
    position: relative;
    padding: 0.5rem 1.25rem;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border-radius: 0.75rem;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #64748b;
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .filter-tab:hover {
    color: #93c5fd;
    border-color: rgba(59,130,246,0.3);
    background: rgba(59,130,246,0.06);
  }
  .filter-tab.active {
    color: #fff;
    border-color: rgba(59,130,246,0.7);
    background: rgba(59,130,246,0.12);
    box-shadow: 0 0 20px rgba(59,130,246,0.2), inset 0 0 20px rgba(59,130,246,0.05);
  }

  /* ── GLOWING DOT ── */
  .glow-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #3b82f6;
    box-shadow: 0 0 8px rgba(59,130,246,0.9), 0 0 20px rgba(59,130,246,0.5);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%, 100% { box-shadow: 0 0 8px rgba(59,130,246,0.9), 0 0 20px rgba(59,130,246,0.5); }
    50% { box-shadow: 0 0 16px rgba(59,130,246,1), 0 0 40px rgba(59,130,246,0.7); }
  }

  /* ── COUNT-UP ── */
  .count-ticker {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  /* ── IMAGE OVERLAY SLIDE ── */
  .img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
      transparent 30%,
      rgba(6,14,37,0.6) 60%,
      rgba(6,14,37,0.95) 100%
    );
  }

  /* ── FLOATING CARD BADGE ── */
  .float-badge {
    animation: floatBadge 3s ease-in-out infinite;
  }
  @keyframes floatBadge {
    0%, 100% { transform: translateY(0) rotate(-1deg); }
    50% { transform: translateY(-6px) rotate(1deg); }
  }

  /* ── CURSOR CROSSHAIR ── */
  .crosshair-cursor * { cursor: crosshair; }

  /* ── GLOW LINE ── */
  .glow-line {
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    height: 1px;
  }

  /* ── NUMBER BIG ── */
  .big-number {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 8rem;
    line-height: 1;
    color: rgba(255,255,255,0.03);
    position: absolute;
    right: -1rem;
    top: -1.5rem;
    pointer-events: none;
    user-select: none;
  }

  /* ── SKELETON ── */
  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(255,255,255,0.07) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.8s infinite;
    border-radius: 1.5rem;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── GLASS ── */
  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
  }

  /* ── MARQUEE ── */
  .marquee-track {
    display: flex;
    gap: 3rem;
    animation: marquee 20s linear infinite;
    white-space: nowrap;
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* ── DRAG SCROLL ── */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* ── CARD STACK HOVER ── */
  .stack-card { transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease; }

  /* ── REVEAL ── */
  .reveal-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── COUNTER SECTION ── */
  .stat-counter-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 1.5rem;
    overflow: hidden;
  }
  .stat-counter-cell {
    background: var(--dark-mid);
    padding: 2rem;
    text-align: center;
    transition: background 0.3s ease;
  }
  .stat-counter-cell:hover {
    background: rgba(59,130,246,0.05);
  }

  /* ── CARD GLOW ── */
  .card-glow-wrapper {
    position: relative;
  }
  .card-glow-wrapper::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 1.6rem;
    background: linear-gradient(135deg, rgba(59,130,246,0.4), rgba(56,189,248,0.2), transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }
  .card-glow-wrapper:hover::before {
    opacity: 1;
  }

  /* ── LIVE TAG ── */
  @keyframes livePulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .live-dot { animation: livePulse 1.5s ease-in-out infinite; }
`;

/* ─── 3D TILT CARD COMPONENT ─────────────────────────── */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const shineX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`card-glow-wrapper ${className}`}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[1.5rem] z-20"
        style={{
          background: useTransform(
            [shineX, shineY],
            ([sx, sy]) =>
              `radial-gradient(600px circle at ${sx}% ${sy}%, rgba(255,255,255,0.07), transparent 40%)`
          ),
        }}
      />
    </motion.div>
  );
}

/* ─── ANIMATED COUNTER ─────────────────────────────── */
function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref} className="count-ticker">{count}{suffix}</span>;
}

/* ─── SCROLL REVEAL HOOK ─────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal-up');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─── PROJECT CARD ─────────────────────────────────── */
function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <TiltCard>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative flex flex-col h-full rounded-[1.5rem] overflow-hidden"
        style={{
          background: 'rgba(9,16,39,0.8)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── IMAGE ── */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          />
          <div className="img-overlay" />

          {/* Category badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(6,14,37,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
              {project.category}
            </span>
          </div>

          {/* Duration badge */}
          {project.duration && (
            <div className="absolute top-4 right-4 z-10">
              <span className="text-[9px] uppercase tracking-tighter font-bold px-2.5 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                {project.duration}
              </span>
            </div>
          )}

          {/* Live demo tag */}
          {project.link && (
            <motion.div
              className="absolute bottom-4 right-4 z-10 flex items-center gap-2"
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(59,130,246,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(59,130,246,0.3)' }}>
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                <span className="text-[9px] uppercase font-black tracking-widest text-blue-300">Live</span>
              </div>
            </motion.div>
          )}

          {/* Index number */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="text-[10px] font-black" style={{ color: 'rgba(59,130,246,0.5)', fontFamily: 'Syne, sans-serif' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex flex-col flex-grow p-7 relative" style={{ transform: 'translateZ(20px)' }}>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags && project.tags.length > 0 ? (
              project.tags.slice(0, 3).map(t => (
                <span key={t} className="text-[8px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
                  {t}
                </span>
              ))
            ) : (
              <span className="text-[8px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#64748b' }}>
                Full Stack
              </span>
            )}
          </div>

          {/* Title */}
          <motion.h3
            className="text-xl font-bold mb-3 leading-tight"
            style={{ fontFamily: 'Syne, sans-serif', color: hovered ? '#93c5fd' : '#fff', transition: 'color 0.3s ease' }}
          >
            {project.title}
          </motion.h3>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-6 flex-grow"
            style={{ color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.description}
          </p>

          {/* Divider */}
          <div className="glow-line mb-6 opacity-20" />

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              to={`/project/${project._id}`}
              className="group/btn relative overflow-hidden w-full py-3 rounded-xl text-center text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Case Study
                <motion.span
                  animate={{ x: hovered ? 4 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ color: '#60a5fa' }}
                >
                  →
                </motion.span>
              </span>
            </Link>

            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="group/demo flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300"
              style={{ color: '#475569' }}
              onMouseEnter={e => e.currentTarget.style.color = '#93c5fd'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              Launch Live Demo
              <span className="group-hover/demo:translate-x-1 transition-transform inline-block" style={{ color: '#3b82f6' }}>↗</span>
            </a>
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 70%)' }} />
      </motion.div>
    </TiltCard>
  );
}

/* ─── FEATURED CARD (large hero card) ─────────────── */
function FeaturedCard({ project }) {
  const [hovered, setHovered] = useState(false);

  if (!project) return null;

  return (
    <TiltCard className="col-span-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative rounded-[1.5rem] overflow-hidden"
        style={{ background: 'rgba(9,16,39,0.9)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', minHeight: '420px' }}
      >
        {/* Background image full bleed */}
        <div className="absolute inset-0">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            style={{ opacity: 0.25 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,14,37,0.98) 40%, rgba(6,14,37,0.6) 100%)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 p-12 grid md:grid-cols-2 gap-12 items-center min-h-[420px]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="glow-dot" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black" style={{ color: '#3b82f6' }}>
                Featured Project
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              {project.title}
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-lg">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-10">
              {project.tags?.map(t => (
                <span key={t} className="px-3 py-1.5 text-[9px] uppercase font-black tracking-widest rounded-lg"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <Link to={`/project/${project._id}`}
                className="px-7 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all"
                style={{ background: '#3b82f6', boxShadow: '0 8px 32px rgba(59,130,246,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(59,130,246,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.35)'; }}
              >
                View Case Study →
              </Link>
              <a href={project.link} target="_blank" rel="noreferrer"
                className="px-7 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                Live Demo ↗
              </a>
            </div>
          </div>

          {/* Right visual */}
          <div className="hidden md:flex justify-end items-center">
            <div className="relative">
              <div className="w-72 h-56 rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 32px 80px -12px rgba(59,130,246,0.4)' }}>
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" style={{ opacity: 0.9 }} />
              </div>
              {/* Category float badge */}
              <div className="float-badge absolute -top-5 -right-5 glass px-4 py-2.5 rounded-xl shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">{project.category}</p>
              </div>
              {project.duration && (
                <div className="float-badge absolute -bottom-5 -left-5 glass px-4 py-2.5 rounded-xl shadow-2xl" style={{ animationDelay: '1s' }}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{project.duration}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────── */
export default function Projects() {
  const [myWorks, setMyWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useScrollReveal();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get(CONFIG.ENDPOINTS.PROJECTS);
        if (res.data.success) {
          setMyWorks(res.data.data);
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Dynamic filter categories from data
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(myWorks.map(p => p.category).filter(Boolean))];
    return cats;
  }, [myWorks]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return myWorks;
    return myWorks.filter(p => p.category === activeFilter);
  }, [myWorks, activeFilter]);

  const featured = myWorks[0] || null;
  const rest = filtered.length > 0 ? (activeFilter === 'All' ? filtered.slice(1) : filtered) : [];

  const techStrip = ['React 19', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind', 'TypeScript', 'Express', 'REST API', 'JWT', 'AWS',
    'React 19', 'Next.js', 'Node.js', 'MongoDB', 'Tailwind', 'TypeScript', 'Express', 'REST API', 'JWT', 'AWS'];

  return (
    <div className="projects-root min-h-screen crosshair-cursor" style={{ background: 'var(--dark-bg)' }}>
      <style>{styles}</style>
      <div className="scanline" />

      {/* ── HERO HEADER ── */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        {/* Grid + noise */}
        <div className="absolute inset-0 grid-texture opacity-50" />
        <div className="absolute inset-0 noise-overlay" />

        {/* Glow blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] blur-[160px] -z-10 opacity-60"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.2), transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 blur-[120px] -z-10 opacity-40"
          style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.12), transparent 70%)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="glow-dot" />
            <span className="text-[11px] uppercase tracking-[0.35em] font-black" style={{ color: '#3b82f6' }}>
              Portfolio / Selected Works
            </span>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="text-6xl md:text-7xl font-black leading-[1] tracking-tight"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                <span className="text-white">Selected</span>
                <br />
                <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Works.
                </span>
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-6 md:items-end"
            >
              <p className="text-slate-400 text-lg leading-relaxed md:text-right max-w-md md:ml-auto">
                A collection of real-world projects — from web apps to complex system architectures. Each one built with precision.
              </p>

              {/* Stats bar */}
              <div className="stat-counter-grid w-full md:max-w-sm">
                <div className="stat-counter-cell">
                  <p className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                    <AnimatedCounter target={myWorks.length || 6} suffix="+" />
                  </p>
                  <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#475569' }}>Projects</p>
                </div>
                <div className="stat-counter-cell">
                  <p className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                    <AnimatedCounter target={100} suffix="%" />
                  </p>
                  <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#475569' }}>Delivery</p>
                </div>
                <div className="stat-counter-cell">
                  <p className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                    <AnimatedCounter target={2} suffix="+" />
                  </p>
                  <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: '#475569' }}>Yrs Exp.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex gap-3 flex-wrap"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`filter-tab ${activeFilter === cat ? 'active' : ''}`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-2 text-[8px] font-black"
                    style={{ color: activeFilter === cat ? '#60a5fa' : '#334155' }}>
                    ({myWorks.filter(p => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TECH STRIP ── */}
      <div className="py-5 overflow-hidden border-y" style={{ background: 'rgba(9,16,39,0.95)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="marquee-track">
          {techStrip.map((t, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shrink-0"
              style={{ color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#60a5fa' : '#334155' }}>
              <span style={{ color: '#1d4ed8', fontSize: '7px' }}>◆</span> {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <section className="px-6 py-20 relative">
        <div className="max-w-7xl mx-auto">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="skeleton h-[480px]" />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 rounded-3xl"
              style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              <p className="text-2xl font-black text-red-400 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
                Connection Error
              </p>
              <p className="text-slate-500 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && !error && myWorks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 rounded-3xl"
              style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
            >
              <p className="text-5xl mb-6">🚀</p>
              <p className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
                No Projects Yet
              </p>
              <p className="text-slate-500">Something incredible is being built. Check back soon.</p>
            </motion.div>
          )}

          {/* Featured + Grid */}
          {!loading && !error && myWorks.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Featured (only on "All" view) */}
                {activeFilter === 'All' && featured && (
                  <div className="mb-12">
                    <FeaturedCard project={featured} />
                  </div>
                )}

                {/* Project grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((project, index) => (
                    <ProjectCard key={project._id} project={project} index={index} />
                  ))}
                </div>

                {/* Empty filtered result */}
                {filtered.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 rounded-3xl"
                    style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
                  >
                    <p className="text-white font-black text-xl mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                      No projects in "{activeFilter}"
                    </p>
                    <p className="text-slate-500 text-sm">Try a different category.</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA STRIP ── */}
      {!loading && !error && myWorks.length > 0 && (
        <section className="px-6 pb-28 relative">
          <div className="max-w-7xl mx-auto">
            <div className="glow-line mb-16 opacity-30" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="relative rounded-[2rem] overflow-hidden p-12 md:p-20 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(9,16,39,0.95), rgba(15,28,61,0.95))', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              {/* bg glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(59,130,246,0.12), transparent 70%)' }} />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="glow-dot" />
                  <span className="text-[10px] uppercase tracking-[0.35em] font-black" style={{ color: '#3b82f6' }}>
                    Open for Work
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Like What You<br />
                  <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    See?
                  </span>
                </h2>
                <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
                  Let's build something remarkable together. Fast, clean, and built to last.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/"
                    className="px-9 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-white transition-all"
                    style={{ background: '#3b82f6', boxShadow: '0 8px 32px rgba(59,130,246,0.35)' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(59,130,246,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.35)'; }}
                  >
                    Hire Me →
                  </Link>
                  <Link
                    to="/feedback"
                    className="px-9 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  >
                    Read Reviews
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}