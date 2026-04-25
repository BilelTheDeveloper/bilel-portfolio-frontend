import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  FiArrowLeft,
  FiExternalLink,
  FiClock,
  FiCheckCircle,
  FiTarget,
  FiZap,
  FiLayers,
  FiCode,
  FiShield,
} from 'react-icons/fi';
import CONFIG from '../api/config';

/* ─── STYLES ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  :root {
    --brand: #3b82f6;
    --brand-dim: rgba(59,130,246,0.15);
    --brand-glow: rgba(59,130,246,0.4);
    --dark-bg: #060e25;
    --dark-mid: #091027;
    --card: rgba(255,255,255,0.03);
    --border: rgba(255,255,255,0.07);
  }

  .pd-root {
    font-family: 'Space Grotesk', sans-serif;
    background: var(--dark-bg);
    color: #94a3b8;
    overflow-x: hidden;
  }
  .pd-root h1, .pd-root h2, .pd-root h3, .pd-root h4 {
    font-family: 'Syne', sans-serif;
  }

  /* ── NOISE ── */
  .pd-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.035;
    pointer-events: none;
  }

  /* ── GRID ── */
  .pd-grid {
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* ── SCANLINE ── */
  @keyframes scanline {
    0%   { transform: translateY(-100vh); }
    100% { transform: translateY(100vh); }
  }
  .pd-scan {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  .pd-scan::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.12), transparent);
    animation: scanline 10s linear infinite;
  }

  /* ── GLOW LINE ── */
  .glow-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--brand), transparent);
  }

  /* ── GLASS ── */
  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.08);
  }

  /* ── PARALLAX HERO IMG ── */
  .hero-img-wrap {
    perspective: 800px;
  }

  /* ── TAG PILL ── */
  .tag-pill {
    transition: all 0.25s ease;
    cursor: default;
  }
  .tag-pill:hover {
    background: rgba(59,130,246,0.18) !important;
    border-color: rgba(59,130,246,0.5) !important;
    color: #bfdbfe !important;
    transform: translateY(-3px);
  }

  /* ── FEATURE ITEM ── */
  .feat-item {
    transition: all 0.3s ease;
  }
  .feat-item:hover {
    background: rgba(59,130,246,0.06);
    border-color: rgba(59,130,246,0.25);
    transform: translateX(6px);
  }

  /* ── LIVE DOT ── */
  @keyframes livePulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
    50%       { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
  }
  .live-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4ade80;
    animation: livePulse 2s ease-in-out infinite;
  }

  /* ── GLOW BUTTON ── */
  .glow-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .glow-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .glow-btn:hover::before { opacity: 1; }
  .glow-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(59,130,246,0.45) !important;
  }
  .glow-btn:active { transform: translateY(-1px); }

  /* ── BACK LINK ── */
  .back-link {
    transition: all 0.25s ease;
  }
  .back-link:hover { color: #fff; gap: 12px; }
  .back-link:hover .back-icon {
    background: rgba(59,130,246,0.2);
    border-color: rgba(59,130,246,0.5);
  }

  /* ── REVEAL ── */
  .pd-reveal {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.75s ease, transform 0.75s ease;
  }
  .pd-reveal.visible { opacity: 1; transform: translateY(0); }
  .pd-reveal-left {
    opacity: 0;
    transform: translateX(-40px);
    transition: opacity 0.75s ease, transform 0.75s ease;
  }
  .pd-reveal-left.visible { opacity: 1; transform: translateX(0); }
  .pd-reveal-right {
    opacity: 0;
    transform: translateX(40px);
    transition: opacity 0.75s ease, transform 0.75s ease;
  }
  .pd-reveal-right.visible { opacity: 1; transform: translateX(0); }
  .d100 { transition-delay: 0.1s; }
  .d200 { transition-delay: 0.2s; }
  .d300 { transition-delay: 0.3s; }
  .d400 { transition-delay: 0.4s; }
  .d500 { transition-delay: 0.5s; }

  /* ── COUNTER ── */
  .stat-val {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }

  /* ── CANVAS ── */
  #pd-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.55;
  }

  /* ── SECTION NUMBER ── */
  .section-num {
    font-family: 'Syne', sans-serif;
    font-size: 7rem;
    font-weight: 800;
    line-height: 1;
    color: rgba(59,130,246,0.04);
    position: absolute;
    right: 1.5rem;
    top: -1rem;
    pointer-events: none;
    user-select: none;
  }

  /* ── SKELETON ── */
  .pd-skeleton {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(255,255,255,0.07) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 200% 100%;
    animation: pdShimmer 1.8s infinite;
    border-radius: 1.5rem;
  }
  @keyframes pdShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── MARQUEE ── */
  .pd-marquee {
    display: flex;
    gap: 2.5rem;
    animation: pdMarquee 25s linear infinite;
    white-space: nowrap;
  }
  @keyframes pdMarquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── IMAGE SHINE ── */
  .img-shine {
    position: relative;
    overflow: hidden;
  }
  .img-shine::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -75%;
    width: 50%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.06) 50%,
      rgba(255,255,255,0) 100%
    );
    transform: skewX(-20deg);
    animation: imgShine 6s ease-in-out infinite;
  }
  @keyframes imgShine {
    0%, 100% { left: -75%; }
    50%       { left: 125%; }
  }

  /* ── ORBIT RING CSS ── */
  @keyframes orbit1 { from { transform: rotateX(70deg) rotateZ(0deg); } to { transform: rotateX(70deg) rotateZ(360deg); } }
  @keyframes orbit2 { from { transform: rotateX(70deg) rotateZ(120deg); } to { transform: rotateX(70deg) rotateZ(480deg); } }
  @keyframes orbit3 { from { transform: rotateX(70deg) rotateZ(240deg); } to { transform: rotateX(70deg) rotateZ(600deg); } }

  /* ── CARD GLOW HOVER ── */
  .card-hover {
    transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  .card-hover:hover {
    border-color: rgba(59,130,246,0.35) !important;
    box-shadow: 0 24px 64px rgba(59,130,246,0.1);
    transform: translateY(-6px);
  }

  /* ── PROGRESS BAR ── */
  .pd-bar {
    width: 0%;
    transition: width 1.4s cubic-bezier(0.23,1,0.32,1);
  }
  .pd-bar.run { width: var(--w); }
`;

/* ─── 3D BACKGROUND (Three.js) ───────────────────────── */
function Background3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let animId;
    let renderer, scene, camera;
    let mouseX = 0, mouseY = 0;

    const boot = async () => {
      if (!window.THREE) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const T = window.THREE;
      const canvas = canvasRef.current;
      if (!canvas) return;

      renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      scene = new T.Scene();
      camera = new T.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.z = 6;

      // Particles
      const pGeo = new T.BufferGeometry();
      const pCount = 800;
      const pos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount * 3; i++) pos[i] = (Math.random() - 0.5) * 22;
      pGeo.setAttribute('position', new T.BufferAttribute(pos, 3));
      const pts = new T.Points(pGeo, new T.PointsMaterial({ color: 0x3b82f6, size: 0.022, transparent: true, opacity: 0.5 }));
      scene.add(pts);

      // Wireframe torus (decorative)
      const torusGeo = new T.TorusGeometry(2.8, 0.006, 6, 150);
      const torusMat = new T.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.2 });
      const torus1 = new T.Mesh(torusGeo, torusMat);
      torus1.rotation.x = 1.2;
      scene.add(torus1);

      const torus2 = new T.Mesh(
        new T.TorusGeometry(3.6, 0.004, 6, 150),
        new T.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.12 })
      );
      torus2.rotation.x = 0.4; torus2.rotation.z = 0.9;
      scene.add(torus2);

      const torus3 = new T.Mesh(
        new T.TorusGeometry(4.4, 0.003, 6, 150),
        new T.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.07 })
      );
      torus3.rotation.x = 0.7; torus3.rotation.y = 1.1;
      scene.add(torus3);

      const onMouse = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 1.5;
      };
      const onResize = () => {
        if (!canvas) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };
      window.addEventListener('mousemove', onMouse);
      window.addEventListener('resize', onResize);

      const clock = new T.Clock();
      const tick = () => {
        animId = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        pts.rotation.y = t * 0.015;
        pts.rotation.x = t * 0.007;
        torus1.rotation.z = t * 0.12;
        torus2.rotation.x = 0.4 + t * 0.09;
        torus3.rotation.y = 1.1 + t * 0.07;
        scene.rotation.x += (mouseY * 0.1 - scene.rotation.x) * 0.03;
        scene.rotation.y += (mouseX * 0.1 - scene.rotation.y) * 0.03;
        renderer.render(scene, camera);
      };
      tick();

      return () => {
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('resize', onResize);
      };
    };

    boot().catch(console.error);
    return () => { cancelAnimationFrame(animId); if (renderer) renderer.dispose(); };
  }, []);

  return <canvas ref={canvasRef} id="pd-canvas" />;
}

/* ─── SCROLL REVEAL ───────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const run = () => {
      const els = document.querySelectorAll('.pd-reveal, .pd-reveal-left, .pd-reveal-right');
      const obs = new IntersectionObserver(
        (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.1 }
      );
      els.forEach(el => obs.observe(el));
      return () => obs.disconnect();
    };
    const cleanup = run();
    return cleanup;
  });
}

/* ─── PROGRESS BAR TRIGGER ────────────────────────────── */
function useProgressBars() {
  useEffect(() => {
    const bars = document.querySelectorAll('.pd-bar');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('run'); }),
      { threshold: 0.3 }
    );
    bars.forEach(b => obs.observe(b));
    return () => obs.disconnect();
  });
}

/* ─── ANIMATED COUNTER ────────────────────────────────── */
function Counter({ target, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - t0) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(ease * target));
          if (p < 1) requestAnimationFrame(tick); else setVal(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── LOADING SCREEN ──────────────────────────────────── */
function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#060e25' }}>
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-2 animate-spin" style={{ borderColor: 'transparent', borderTopColor: '#3b82f6' }} />
        <div className="absolute inset-2 rounded-full border animate-spin" style={{ borderColor: 'transparent', borderTopColor: '#60a5fa', animationDirection: 'reverse', animationDuration: '0.8s' }} />
        <div className="absolute inset-4 rounded-full border animate-pulse" style={{ borderColor: 'rgba(59,130,246,0.3)' }} />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse" style={{ color: 'rgba(59,130,246,0.6)', fontFamily: 'Syne, sans-serif' }}>
        Loading Project...
      </p>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────── */
export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scroll parallax
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);

  useReveal();
  useProgressBars();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${CONFIG.ENDPOINTS.PROJECTS}/${id}`);
        if (res.data.success) setProject(res.data.data);
      } catch (err) {
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="pd-root"><LoadingScreen /></div>
    </>
  );

  if (!project) return (
    <>
      <style>{styles}</style>
      <div className="pd-root min-h-screen flex flex-col items-center justify-center gap-8">
        <p className="text-6xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Project <span style={{ color: '#3b82f6' }}>Not Found.</span>
        </p>
        <Link to="/projects" className="back-link flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-slate-500 transition-all" style={{ gap: '8px' }}>
          <span className="back-icon w-9 h-9 rounded-full border flex items-center justify-center transition-all" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <FiArrowLeft size={14} />
          </span>
          Back to Projects
        </Link>
      </div>
    </>
  );

  // Tech marquee (duplicated for infinite loop)
  const marqueeItems = project.tags
    ? [...project.tags, ...project.tags, ...project.tags, ...project.tags]
    : [];

  return (
    <div className="pd-root min-h-screen" ref={containerRef}>
      <style>{styles}</style>

      {/* 3D BACKGROUND */}
      <Background3D />

      {/* Scanline effect */}
      <div className="pd-scan" />

      {/* Fixed noise overlay */}
      <div className="pd-noise fixed inset-0 pointer-events-none z-0" />

      {/* ══════════════════════════════════════════════════
          NAV BAR
      ══════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-50 max-w-7xl mx-auto px-6 py-7 flex justify-between items-center"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <Link to="/projects" className="back-link flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-slate-500 transition-all">
          <span className="back-icon w-9 h-9 rounded-full border flex items-center justify-center transition-all" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <FiArrowLeft size={14} />
          </span>
          All Projects
        </Link>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">
            bilel.dev
          </span>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>/</span>
          <span className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: '#3b82f6' }}>
            {project.category || 'Development'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live</span>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════
          HERO — CINEMATIC
      ══════════════════════════════════════════════════ */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24"
      >
        {/* Grid texture layer */}
        <div className="absolute inset-0 pd-grid opacity-40 pointer-events-none" />

        {/* Glow blobs */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] blur-[160px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.18), transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.1), transparent 70%)' }} />

        <div className="relative grid lg:grid-cols-12 gap-12 items-center">
          {/* LEFT — TITLE BLOCK */}
          <div className="lg:col-span-6 xl:col-span-7 relative">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="live-dot" style={{ background: '#3b82f6', boxShadow: '0 0 10px rgba(59,130,246,0.8), 0 0 24px rgba(59,130,246,0.4)' }} />
              <span className="text-[11px] font-black uppercase tracking-[0.4em]" style={{ color: '#3b82f6' }}>
                Case Study
              </span>
            </motion.div>

            {/* Giant title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.02] tracking-tight mb-8 text-white"
            >
              {project.title}
              <span className="block mt-2" style={{
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                .
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-lg leading-relaxed mb-10 max-w-xl pl-5"
              style={{ color: '#94a3b8', borderLeft: '2px solid rgba(59,130,246,0.4)' }}
            >
              {project.description}
            </motion.p>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-5 mb-10"
            >
              {project.duration && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <FiClock size={14} style={{ color: '#3b82f6' }} />
                  <span className="text-xs font-bold text-white">{project.duration}</span>
                </div>
              )}
              {project.category && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <FiLayers size={14} style={{ color: '#60a5fa' }} />
                  <span className="text-xs font-bold" style={{ color: '#60a5fa' }}>{project.category}</span>
                </div>
              )}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-btn px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3"
                style={{ background: '#3b82f6', boxShadow: '0 8px 32px rgba(59,130,246,0.35)' }}
              >
                <span>View Live Site</span>
                <FiExternalLink size={15} />
              </a>
              <Link
                to="/projects"
                className="px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all hover:bg-white/8"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <FiArrowLeft size={15} />
                All Projects
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — PROJECT IMAGE with parallax */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="lg:col-span-6 xl:col-span-5 hero-img-wrap"
          >
            <div className="relative">
              {/* Main image */}
              <div className="img-shine relative rounded-[2rem] overflow-hidden shadow-2xl"
                style={{ border: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 32px 80px -12px rgba(59,130,246,0.35), 0 0 0 1px rgba(59,130,246,0.1)' }}>
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto object-cover"
                  style={{ y: imgY }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                />
                {/* Top-right reflection */}
                <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 70%)' }} />
              </div>

              {/* Floating category badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -right-5 glass px-4 py-3 rounded-2xl shadow-2xl"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: '#3b82f6' }}>
                  {project.category || 'Development'}
                </p>
              </motion.div>

              {/* Floating duration badge */}
              {project.duration && (
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-5 -left-5 glass px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
                >
                  <FiClock size={12} style={{ color: '#60a5fa' }} />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white">{project.duration}</p>
                </motion.div>
              )}

              {/* Decorative rings behind image */}
              <div className="absolute -inset-6 rounded-[2.5rem] -z-10"
                style={{ border: '1px dashed rgba(59,130,246,0.12)' }} />
              <div className="absolute -inset-12 rounded-[3rem] -z-10"
                style={{ border: '1px solid rgba(59,130,246,0.05)' }} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* TECH STRIP MARQUEE */}
      {marqueeItems.length > 0 && (
        <div className="relative z-10 py-5 overflow-hidden"
          style={{ background: 'rgba(9,16,39,0.9)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="pd-marquee">
            {marqueeItems.map((t, i) => (
              <span key={i} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shrink-0"
                style={{ color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#60a5fa' : '#334155' }}>
                <span style={{ color: '#1d4ed8', fontSize: '7px' }}>◆</span> {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 rounded-[2rem] overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { label: 'Technologies Used', val: project.tags?.length || 0, suffix: '+', icon: <FiCode size={18} /> },
            { label: 'Features Built', val: project.features?.length || 0, suffix: '', icon: <FiZap size={18} /> },
            { label: 'Delivery Rate', val: 100, suffix: '%', icon: <FiCheckCircle size={18} /> },
            { label: 'Security Score', val: 99, suffix: '%', icon: <FiShield size={18} /> },
          ].map((st, i) => (
            <div key={st.label} className="pd-reveal card-hover p-8 text-center relative"
              style={{ background: 'var(--dark-mid)', transitionDelay: `${i * 0.1}s` }}>
              <div className="flex justify-center mb-4" style={{ color: '#3b82f6' }}>{st.icon}</div>
              <p className="stat-val text-4xl text-white mb-2">
                <Counter target={st.val} suffix={st.suffix} />
              </p>
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#475569' }}>{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES + CHALLENGE + SOLUTION
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* ── FEATURES COLUMN ── */}
          <div className="lg:col-span-4">
            <div className="pd-reveal sticky top-28">
              {/* Section label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                  <FiZap size={18} style={{ color: '#3b82f6' }} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: '#3b82f6' }}>What's Inside</p>
                  <h2 className="text-2xl font-black text-white leading-none">Features.</h2>
                </div>
              </div>

              <div className="space-y-3">
                {project.features && project.features.length > 0 ? (
                  project.features.map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.07 }}
                      className="feat-item flex items-start gap-4 p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ background: '#3b82f6' }} />
                      <span className="text-sm font-semibold text-slate-300 leading-tight">{feat}</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No features listed.</p>
                )}
              </div>

              {/* Tech pills */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-5" style={{ color: '#475569' }}>Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i}
                        className="tag-pill px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── CHALLENGE + SOLUTION ── */}
          <div className="lg:col-span-8 space-y-8">

            {/* THE CHALLENGE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="relative card-hover rounded-[2rem] p-10 overflow-hidden"
              style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.1)' }}
            >
              <span className="section-num">01</span>
              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <FiTarget size={22} style={{ color: '#f87171' }} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(239,68,68,0.6)' }}>Problem</p>
                  <h3 className="text-2xl font-black text-white">The Challenge.</h3>
                </div>
              </div>
              <div className="glow-line mb-7" style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)' }} />
              <p className="text-base leading-relaxed" style={{ color: '#94a3b8' }}>
                {project.challenges || 'No challenge information provided for this project.'}
              </p>
            </motion.div>

            {/* THE SOLUTION */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
              className="relative card-hover rounded-[2rem] p-10 overflow-hidden"
              style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.18)' }}
            >
              <span className="section-num" style={{ color: 'rgba(59,130,246,0.06)' }}>02</span>
              <div className="flex items-center gap-4 mb-7">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                  <FiCheckCircle size={22} style={{ color: '#60a5fa' }} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(59,130,246,0.6)' }}>Answer</p>
                  <h3 className="text-2xl font-black text-white">The Solution.</h3>
                </div>
              </div>
              <div className="glow-line mb-7" />
              <p className="text-base leading-relaxed" style={{ color: '#cbd5e1' }}>
                {project.solutions || 'No solution information provided for this project.'}
              </p>
            </motion.div>

            {/* SKILL CONFIDENCE BARS */}
            {project.tags && project.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="relative card-hover rounded-[2rem] p-10"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="section-num" style={{ color: 'rgba(255,255,255,0.02)' }}>03</span>
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
                    <FiCode size={22} style={{ color: '#38bdf8' }} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(56,189,248,0.6)' }}>Usage</p>
                    <h3 className="text-2xl font-black text-white">Tech Breakdown.</h3>
                  </div>
                </div>
                <div className="glow-line mb-7" style={{ background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)' }} />
                <div className="space-y-5">
                  {project.tags.slice(0, 6).map((tag, i) => {
                    // Pseudo-randomised but stable bar widths based on index
                    const widths = [95, 88, 82, 78, 90, 85];
                    const w = widths[i % widths.length];
                    return (
                      <div key={tag}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-bold text-white">{tag}</span>
                          <span className="text-sm font-bold" style={{ color: '#3b82f6' }}>{w}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="pd-bar h-full rounded-full" style={{ '--w': `${w}%`, background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <div className="glow-line mb-16 opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden p-14 md:p-20 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(9,16,39,0.98), rgba(15,28,61,0.98))',
            border: '1px solid rgba(59,130,246,0.18)',
          }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(59,130,246,0.14), transparent 70%)' }} />

          {/* Decorative grid */}
          <div className="absolute inset-0 pd-grid opacity-30 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="live-dot" style={{ background: '#3b82f6', boxShadow: '0 0 10px rgba(59,130,246,0.8)' }} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#3b82f6' }}>
                Open for New Projects
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Like What You<br />
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                See Here?
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
              Let's build your next project together — fast, secure, and built to last.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="glow-btn px-10 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-white"
                style={{ background: '#3b82f6', boxShadow: '0 8px 32px rgba(59,130,246,0.35)' }}
              >
                Hire Me →
              </Link>
              <Link
                to="/projects"
                className="px-10 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] text-white transition-all hover:bg-white/8"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                More Projects
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}