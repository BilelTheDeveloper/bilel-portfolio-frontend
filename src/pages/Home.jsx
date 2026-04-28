import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ContactModal from '../components/ContactModal';
import ServiceModal from '../components/ServiceModal';
import LatestWork from '../components/LatestWork';
import axios from 'axios';
import CONFIG from '../api/config';
 
/* ─── INLINE STYLES ─────────────────────────────────── */
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
 
  .home-root { font-family: 'Space Grotesk', sans-serif; }
  .home-root h1,
  .home-root h2,
  .home-root h3 { font-family: 'Syne', sans-serif; }
 
  /* ── CANVAS 3D ── */
  #hero-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }
 
  /* ── SCROLL REVEAL ── */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-left {
    opacity: 0;
    transform: translateX(-50px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .reveal-right {
    opacity: 0;
    transform: translateX(50px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal-right.visible { opacity: 1; transform: translateX(0); }
 
  /* ── DELAY HELPERS ── */
  .d100 { transition-delay: 0.1s; }
  .d200 { transition-delay: 0.2s; }
  .d300 { transition-delay: 0.3s; }
  .d400 { transition-delay: 0.4s; }
  .d500 { transition-delay: 0.5s; }
 
  /* ── TYPEWRITER CURSOR ── */
  .cursor-blink::after {
    content: '|';
    animation: blink 1s step-end infinite;
    color: var(--brand);
    margin-left: 2px;
  }
  @keyframes blink { 50% { opacity: 0; } }
 
  /* ── GLOWING BUTTON ── */
  .btn-glow {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .btn-glow::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease;
  }
  .btn-glow:hover::before { width: 300px; height: 300px; }
  .btn-glow:hover {
    box-shadow: 0 0 30px var(--brand-glow), 0 0 60px var(--brand-glow);
    transform: translateY(-2px);
  }
 
  /* ── SKILL PILL HOVER ── */
  .skill-pill {
    transition: all 0.25s ease;
    cursor: default;
  }
  .skill-pill:hover {
    background: rgba(59,130,246,0.15);
    border-color: rgba(59,130,246,0.4);
    color: #93c5fd;
    transform: translateY(-2px);
  }
 
  /* ── SERVICE CARD ── */
  .service-card {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
  }
  .service-card:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: rgba(59,130,246,0.5);
    box-shadow: 0 20px 60px rgba(59,130,246,0.12);
  }

  /* ── SECURITY CARD SPECIAL ── */
  .security-card {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .security-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(59,130,246,0.04) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .security-card:hover::before { opacity: 1; }
  .security-card:hover {
    transform: translateY(-8px) scale(1.01);
    border-color: rgba(16,185,129,0.45) !important;
    box-shadow: 0 20px 60px rgba(16,185,129,0.10);
  }

  /* ── SECURITY BADGE PULSE ── */
  .sec-badge-pulse {
    animation: secPulse 2.5s ease-in-out infinite;
  }
  @keyframes secPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
    50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
  }

  /* ── ATTACK LOG ITEM ── */
  .attack-log-item {
    animation: logSlide 0.5s ease forwards;
    opacity: 0;
  }
  .attack-log-item:nth-child(1) { animation-delay: 0.1s; }
  .attack-log-item:nth-child(2) { animation-delay: 0.2s; }
  .attack-log-item:nth-child(3) { animation-delay: 0.3s; }
  .attack-log-item:nth-child(4) { animation-delay: 0.4s; }
  .attack-log-item:nth-child(5) { animation-delay: 0.5s; }
  @keyframes logSlide {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* ── TERMINAL BLINK ── */
  .terminal-cursor {
    display: inline-block;
    width: 7px;
    height: 14px;
    background: #10b981;
    margin-left: 3px;
    vertical-align: middle;
    animation: termBlink 1s step-end infinite;
  }
  @keyframes termBlink { 50% { opacity: 0; } }
 
  /* ── STAT CARD FLOAT ── */
  .float-card {
    animation: floatCard 3s ease-in-out infinite;
  }
  .float-card-2 { animation-duration: 4s; animation-delay: 0.5s; }
  .float-card-3 { animation-duration: 5s; animation-delay: 1s; }
  @keyframes floatCard {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
 
  /* ── RING SPIN ── */
  .ring-spin { animation: spinRing 20s linear infinite; }
  @keyframes spinRing { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
 
  /* ── GRID TEXTURE ── */
  .grid-texture {
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%);
  }
 
  /* ── STAT COUNTER ── */
  .stat-number {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
  }
 
  /* ── GLASS CARD ── */
  .glass {
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
  }
 
  /* ── PROGRESS BAR ANIMATE ── */
  .progress-fill {
    width: 0%;
    transition: width 1.2s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .progress-fill.animate { width: var(--target-width); }
 
  /* ── NOISE ── */
  .noise-overlay {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.04;
    pointer-events: none;
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
 
  /* ── GLOW LINE ── */
  .glow-line {
    background: linear-gradient(90deg, transparent, var(--brand), transparent);
    height: 1px;
    width: 100%;
  }

  /* ── FULL-WIDTH SERVICE CARD ── */
  .service-card-full {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    cursor: pointer;
  }
  .service-card-full:hover {
    transform: translateY(-5px);
    border-color: rgba(59,130,246,0.5) !important;
    box-shadow: 0 20px 60px rgba(59,130,246,0.1);
  }
`;
 
/* ─── 3D SCENE (THREE.JS) ─────────────────────────────── */
function Hero3D({ canvasRef }) {
  useEffect(() => {
    let animId;
    let THREE_mod;
    let renderer, scene, camera;
    let particles, sphere, ring1, ring2, ring3;
    let mouseX = 0, mouseY = 0;
 
    const load = async () => {
      if (!window.THREE) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
          s.onload = res;
          s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      THREE_mod = window.THREE;
      init();
    };
 
    const init = () => {
      const T = THREE_mod;
      const canvas = canvasRef.current;
      if (!canvas) return;
 
      renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
 
      scene = new T.Scene();
      camera = new T.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.z = 5;
 
      const sphereGeo = new T.SphereGeometry(1.4, 32, 32);
      const sphereMat = new T.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      sphere = new T.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);
 
      const innerGeo = new T.SphereGeometry(1.1, 24, 24);
      const innerMat = new T.MeshBasicMaterial({
        color: 0x1d4ed8,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
      });
      const inner = new T.Mesh(innerGeo, innerMat);
      scene.add(inner);
 
      const makeRing = (rx, ry, rz, opacity, color = 0x3b82f6) => {
        const geo = new T.TorusGeometry(2.2, 0.008, 6, 120);
        const mat = new T.MeshBasicMaterial({ color, transparent: true, opacity });
        const mesh = new T.Mesh(geo, mat);
        mesh.rotation.x = rx;
        mesh.rotation.y = ry;
        mesh.rotation.z = rz;
        scene.add(mesh);
        return mesh;
      };
      ring1 = makeRing(1.2, 0.4, 0, 0.45);
      ring2 = makeRing(0.3, 1.1, 0.6, 0.3, 0x60a5fa);
      ring3 = makeRing(0.8, 0.2, 1.4, 0.2, 0x93c5fd);
 
      const pCount = 600;
      const pGeo = new T.BufferGeometry();
      const positions = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 18;
      }
      pGeo.setAttribute('position', new T.BufferAttribute(positions, 3));
      const pMat = new T.PointsMaterial({
        color: 0x3b82f6,
        size: 0.025,
        transparent: true,
        opacity: 0.6,
      });
      particles = new T.Points(pGeo, pMat);
      scene.add(particles);
 
      const onMouse = (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouse);
 
      const onResize = () => {
        if (!canvas) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };
      window.addEventListener('resize', onResize);
 
      const clock = new T.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
 
        sphere.rotation.y = t * 0.12;
        sphere.rotation.x = t * 0.06;
        inner.rotation.y = -t * 0.09;
        inner.rotation.x = t * 0.04;
 
        ring1.rotation.z = t * 0.18;
        ring2.rotation.x = t * 0.14;
        ring3.rotation.y = t * 0.10;
 
        particles.rotation.y = t * 0.02;
        particles.rotation.x = t * 0.008;
 
        scene.rotation.x += (mouseY * 0.15 - scene.rotation.x) * 0.04;
        scene.rotation.y += (mouseX * 0.15 - scene.rotation.y) * 0.04;
 
        renderer.render(scene, camera);
      };
      animate();
 
      return () => {
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('resize', onResize);
      };
    };
 
    load().catch(console.error);
 
    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, []);
 
  return null;
}
 
/* ─── SCROLL REVEAL HOOK ───────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
 
/* ─── PROGRESS BARS HOOK ──────────────────────────────── */
function useProgressBars() {
  useEffect(() => {
    const bars = document.querySelectorAll('.progress-fill');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('animate'); }),
      { threshold: 0.3 }
    );
    bars.forEach((b) => obs.observe(b));
    return () => obs.disconnect();
  }, []);
}
 
/* ─── TYPEWRITER HOOK ─────────────────────────────────── */
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
 
  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx((c) => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx((w) => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx((c) => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
 
  return display;
}
 
/* ─── MAIN COMPONENT ──────────────────────────────────── */
export default function Home() {
  const canvasRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [latestProject, setLatestProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
 
  useScrollReveal();
  useProgressBars();
 
  const typeText = useTypewriter(
    ['Fast Websites.', 'Secure Systems.', 'Clean Code.', 'Real Results.'],
    75,
    2000
  );
 
  const skills = [
    { name: 'React 19', level: 92 },
    { name: 'Node.js', level: 88 },
    { name: 'MongoDB', level: 85 },
    { name: 'Next.js', level: 80 },
    { name: 'Tailwind', level: 95 },
  ];
 
  const techBadges = [
    'React 19', 'Next.js', 'Node.js', 'Express', 'MongoDB',
    'Tailwind 4.0', 'TypeScript', 'REST API', 'JWT Auth', 'Cloudinary',
    'Vercel', 'AWS', 'Git', 'Docker',
    'React 19', 'Next.js', 'Node.js', 'Express', 'MongoDB',
    'Tailwind 4.0', 'TypeScript', 'REST API', 'JWT Auth', 'Cloudinary',
    'Vercel', 'AWS', 'Git', 'Docker',
  ];
 
  const services = [
    {
      title: 'Full-Stack Web Applications',
      desc: 'End-to-end web applications engineered for performance, maintainability, and scale — from database architecture to pixel-perfect UI.',
      longDesc:
        'I architect and deliver complete web applications using the MERN stack. Every layer is designed with purpose: a MongoDB schema optimised for query performance, a Node.js/Express API built around RESTful principles with proper error handling and validation, and a React frontend that is fast, accessible, and intuitive. I own the full delivery — no hand-offs, no gaps.',
      icon: '🖥️',
      features: ['Custom React 19 UI', 'REST API Design', 'MongoDB Schema Architecture', 'SEO & Core Web Vitals', 'CI/CD Deployment'],
      tools: ['React 19', 'Node.js', 'MongoDB', 'Tailwind 4.0', 'Express', 'Vercel'],
      highlight: 'Full ownership from schema to deploy',
    },
    {
      title: 'Security-First Backend Engineering',
      desc: 'Production-grade backends with enterprise authentication, hardened APIs, and layered defences — not bolted on after the fact.',
      longDesc:
        'Security is architecture, not a feature. I implement multi-layered auth systems: JWT access/refresh token rotation, Redis-backed JTI blacklisting, device fingerprinting, CSRF double-submit protection, and account-level brute force lockout. Every write endpoint has Joi schema validation. Every route has the right RBAC guard. Your users and their data are protected by design.',
      icon: '🔒',
      features: ['JWT + Redis Token Blacklist', 'Device Fingerprinting', 'CSRF Protection', 'Rate Limiting + Lockout', 'Joi Schema Validation'],
      tools: ['Helmet.js', 'JWT', 'Bcrypt', 'Redis', 'Joi', 'Cloudflare'],
      highlight: 'Penetration-tested & hardened',
    },
  ];

  // ── NEW: Security proof card data ──
  const attackLogs = [
    { type: 'BLOCKED', label: 'SQL / NoSQL Injection', detail: 'Sanitizer stripped operator payload', color: '#10b981' },
    { type: 'BLOCKED', label: 'Brute Force Login', detail: 'Account locked after 5 attempts via Redis', color: '#10b981' },
    { type: 'BLOCKED', label: 'JWT Algorithm Confusion', detail: 'HS256 allowlist rejected forged RS256 token', color: '#10b981' },
    { type: 'BLOCKED', label: 'CSRF Forged Request', detail: 'Double-submit token mismatch → 403', color: '#10b981' },
    { type: 'BLOCKED', label: 'Session Replay Attack', detail: 'JTI blacklist confirmed token revoked', color: '#10b981' },
  ];

  const securityChecks = [
    { label: 'HttpOnly Cookie Auth', passed: true },
    { label: 'Redis JTI Blacklist', passed: true },
    { label: 'Device Fingerprinting', passed: true },
    { label: 'CSRF Double-Submit', passed: true },
    { label: 'Refresh Token Hashing', passed: true },
    { label: 'Admin RBAC Guard', passed: true },
  ];
 
  const whyItems = [
    {
      id: '01',
      title: 'Built for Speed',
      desc: 'Every site I build loads fast. Fast websites keep visitors happy and rank higher on Google.',
    },
    {
      id: '02',
      title: 'Secure by Design',
      desc: 'I add security from day one — not as an afterthought. Your data and your users are protected.',
    },
    {
      id: '03',
      title: 'Clean & Modern Code',
      desc: 'I write code that is easy to read, easy to update, and built with the latest tools.',
    },
  ];
 
  const handleOpenService = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };
 
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axios.get(CONFIG.ENDPOINTS.PROJECTS);
        if (res.data.success && res.data.data.length > 0) {
          setLatestProject(res.data.data[0]);
        }
      } catch (err) {
        console.error('Error fetching latest preview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);
 
  useEffect(() => {
    const fetchHomeFeedback = async () => {
      try {
        const res = await axios.get(`${CONFIG.API_URL}/feedback`);
        setFeedbacks(res.data.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home feedback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeFeedback();
  }, []);
 
  return (
    <div className="home-root animate-in fade-in duration-700">
      <style>{styles}</style>
 
      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'var(--dark-bg)' }}
      >
        <div className="absolute inset-0 grid-texture -z-10" />
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/15 blur-[140px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-500/8 blur-[100px] rounded-full -z-10" />
 
        <canvas
          ref={canvasRef}
          id="hero-canvas"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
        />
        <Hero3D canvasRef={canvasRef} />
 
        <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center relative z-10 w-full">
          <div className="order-2 md:order-1">
            <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8 text-xs font-bold uppercase tracking-widest"
              style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.25)', color: '#60a5fa' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
              </span>
              Open for New Projects
            </div>
 
            <h1 className="reveal d100 text-5xl lg:text-[4.5rem] font-black leading-[1.05] mb-4 tracking-tight text-white">
              I Build Websites<br />
              That Actually<br />
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Work.
              </span>
            </h1>
 
            <div className="reveal d200 text-2xl font-bold mb-6" style={{ color: '#93c5fd', fontFamily: 'Syne, sans-serif', minHeight: '2rem' }}>
              <span className="cursor-blink">{typeText}</span>
            </div>
 
            <p className="reveal d300 text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
              Hi, I am <span className="text-white font-semibold">Bilel</span> — a Full-Stack Web Developer.
              I build websites and web apps using the <span className="text-white font-semibold">MERN Stack</span>.
              Clean code. Fast delivery. Real results.
            </p>
 
            <div className="reveal d400 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-glow px-8 py-4 font-bold rounded-2xl text-white flex items-center justify-center gap-2 group"
                style={{ background: '#3b82f6', boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}
              >
                Hire Me
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <Link
                to="/projects"
                className="px-8 py-4 font-bold rounded-2xl text-white text-center border transition-all hover:bg-white/8"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
              >
                See My Work
              </Link>
            </div>
 
            <div className="reveal d500 flex gap-8 mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { num: '4+', label: 'Projects Done' },
                { num: '100%', label: 'Client Satisfaction' },
                { num: '2+', label: 'Years Experience' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="stat-number text-2xl font-black text-white">{s.num}</p>
                  <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
 
          <div className="order-1 md:order-2 flex justify-center items-center relative">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem]">
              <div className="ring-spin absolute inset-[-20px] border-2 border-dashed rounded-full"
                style={{ borderColor: 'rgba(59,130,246,0.3)' }} />
              <div className="ring-spin absolute inset-[-40px] border rounded-full"
                style={{ borderColor: 'rgba(59,130,246,0.12)', animationDirection: 'reverse', animationDuration: '30s' }} />
              <div className="absolute inset-[-8px] rounded-full animate-pulse"
                style={{ border: '1px solid rgba(59,130,246,0.2)' }} />
 
              <div className="absolute inset-4 rounded-full overflow-hidden border-4"
                style={{ borderColor: 'var(--dark-bg)', boxShadow: '0 0 60px -8px rgba(59,130,246,0.6)' }}>
                <img
                  src="BilelTheDev.webp"
                  alt="Bilel"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
 
              <div className="float-card absolute -top-6 -left-8 md:-left-14 z-30">
                <div className="glass px-4 py-3 rounded-2xl shadow-2xl">
                  <p className="stat-number text-xl font-black" style={{ color: '#3b82f6' }}>+4</p>
                  <p className="text-white text-[10px] uppercase font-bold tracking-tighter">Projects Done</p>
                </div>
              </div>
              <div className="float-card float-card-2 absolute top-1/2 -right-8 md:-right-16 z-30">
                <div className="glass px-4 py-3 rounded-2xl shadow-2xl">
                  <p className="stat-number text-xl font-black text-cyan-400">MERN</p>
                  <p className="text-white text-[10px] uppercase font-bold tracking-tighter">Stack Dev</p>
                </div>
              </div>
              <div className="float-card float-card-3 absolute -bottom-6 left-0 md:left-4 z-30">
                <div className="glass px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-green-400"
                    style={{ background: 'rgba(74,222,128,0.15)' }}>✓</div>
                  <div>
                    <p className="text-white text-lg font-black leading-none">99%</p>
                    <p className="text-slate-400 text-[8px] uppercase font-bold">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        <div className="absolute bottom-0 left-0 right-0 glow-line opacity-40" />
      </section>
 
      {/* ══════════════════════════════════════════════════
          MARQUEE TECH STRIP
      ══════════════════════════════════════════════════ */}
      <div className="py-6 overflow-hidden border-y" style={{ background: 'rgba(9,16,39,0.95)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="marquee-track">
          {techBadges.map((t, i) => (
            <span key={i} className="text-xs font-black uppercase tracking-widest flex items-center gap-3 shrink-0"
              style={{ color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#60a5fa' : '#94a3b8' }}>
              <span style={{ color: '#3b82f6', fontSize: '8px' }}>◆</span> {t}
            </span>
          ))}
        </div>
      </div>
 
      {/* ══════════════════════════════════════════════════
          SERVICES SECTION  (UPDATED)
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden border-b" style={{ background: 'var(--dark-mid)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="absolute top-1/4 -left-20 w-96 h-96 blur-[140px] -z-10 animate-pulse" style={{ background: 'rgba(59,130,246,0.08)' }} />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 blur-[140px] -z-10 animate-pulse" style={{ background: 'rgba(56,189,248,0.06)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[180px] -z-10" style={{ background: 'rgba(16,185,129,0.03)' }} />
 
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <p className="reveal text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: '#3b82f6' }}>What I Do</p>
            <h2 className="reveal d100 text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
              My Services.
            </h2>
            <div className="reveal d200 w-20 h-1.5 rounded-full mb-6" style={{ background: '#3b82f6' }} />
            <p className="reveal d300 text-slate-400 text-lg max-w-xl">
              I focus on one thing and do it very well — building web applications that are fast, secure, and engineered to last.
            </p>
          </div>
 
          {/* ── TOP TWO SERVICE CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {services.map((s, i) => (
              <div
                key={s.title}
                onClick={() => handleOpenService(s)}
                className={`reveal d${(i + 1) * 100} service-card p-10 rounded-[2rem] flex flex-col justify-between h-full`}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <div className="text-5xl">{s.icon}</div>
                    {/* Highlight badge */}
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
                      {s.highlight}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{s.desc}</p>

                  {/* Tools used */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {s.tools.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {s.features.map((f) => (
                      <span key={f} className="skill-pill px-3 py-1 rounded-lg text-xs font-bold text-slate-400"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group/cta"
                  style={{ color: '#3b82f6' }}>
                  Learn More
                  <span className="group-hover/cta:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── SECURITY PROOF CARD (FULL WIDTH) ── */}
          <div className="reveal d300">
            <div
              className="security-card rounded-[2rem] p-10 md:p-12"
              style={{ background: 'rgba(6,20,12,0.6)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              {/* Card header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                <div className="flex items-start gap-5">
                  <div className="sec-badge-pulse w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    🛡️
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">Security-Hardened Infrastructure</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981' }}>
                        Pentest Verified
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                      I conducted real penetration testing on my own production systems — running actual attack vectors to verify every defence layer holds. 
                      The results below are from live tests against the deployed backend, not theoretical assumptions.
                    </p>
                  </div>
                </div>

                {/* Overall score */}
                <div className="flex-shrink-0 text-center px-8 py-5 rounded-2xl"
                  style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <p className="text-4xl font-black mb-1" style={{ color: '#10b981', fontFamily: 'Syne, sans-serif' }}>6/6</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Attacks Blocked</p>
                </div>
              </div>

              {/* Two-column layout: attack log + checklist */}
              <div className="grid md:grid-cols-2 gap-8">

                {/* LEFT: Live attack simulation log */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-[0.25em]" style={{ color: '#10b981' }}>
                      Penetration Test Log
                    </p>
                  </div>

                  {/* Terminal-style container */}
                  <div className="rounded-2xl overflow-hidden" style={{ background: '#050f0a', border: '1px solid rgba(16,185,129,0.15)' }}>
                    {/* Terminal title bar */}
                    <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid rgba(16,185,129,0.1)', background: 'rgba(16,185,129,0.04)' }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                      <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                      <span className="ml-3 text-[11px] font-bold" style={{ color: 'rgba(16,185,129,0.5)' }}>security-audit.log</span>
                    </div>

                    {/* Log entries */}
                    <div className="p-5 space-y-3">
                      {attackLogs.map((log, idx) => (
                        <div key={idx} className="attack-log-item flex items-start gap-3">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                            {log.type}
                          </span>
                          <div className="min-w-0">
                            <p className="text-white text-xs font-bold truncate">{log.label}</p>
                            <p className="text-slate-500 text-[10px] leading-relaxed">{log.detail}</p>
                          </div>
                        </div>
                      ))}
                      {/* Terminal cursor line */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px]" style={{ color: '#10b981' }}>$</span>
                        <span className="text-[11px]" style={{ color: 'rgba(16,185,129,0.5)' }}>awaiting_next_vector</span>
                        <span className="terminal-cursor" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Security checklist + layers */}
                <div className="flex flex-col justify-between gap-6">

                  {/* Checklist */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] mb-5" style={{ color: '#3b82f6' }}>
                      Security Layers Active
                    </p>
                    <div className="space-y-3">
                      {securityChecks.map((check, idx) => (
                        <div key={idx} className="flex items-center justify-between py-2.5 px-4 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <span className="text-sm font-semibold text-slate-300">{check.label}</span>
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase"
                            style={{ color: '#10b981' }}>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom note */}
                  <div className="p-4 rounded-xl flex items-start gap-3"
                    style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
                    <span className="text-green-400 text-lg flex-shrink-0">ℹ️</span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Security is not a feature I add at the end — it is part of the architecture from the first commit. 
                      Every project I deliver includes hardened auth, input validation, and proper access controls.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills progress bars */}
          <div className="mt-20 grid md:grid-cols-2 gap-8">
            <div className="reveal reveal-left">
              <h3 className="text-2xl font-bold text-white mb-8">Technical Skills</h3>
              <div className="space-y-5">
                {skills.map((sk) => (
                  <div key={sk.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-white">{sk.name}</span>
                      <span className="text-sm font-bold" style={{ color: '#3b82f6' }}>{sk.level}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div
                        className="progress-fill h-full rounded-full"
                        style={{
                          '--target-width': `${sk.level}%`,
                          background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal reveal-right">
              <h3 className="text-2xl font-bold text-white mb-8">Tech Arsenal</h3>
              <div className="flex flex-wrap gap-3">
                {['React 19', 'Node.js', 'MongoDB', 'Next.js', 'Express', 'Tailwind', 'TypeScript', 'REST API', 'JWT Auth', 'Cloudinary', 'Vercel', 'AWS'].map((t) => (
                  <span key={t} className="skill-pill px-4 py-2 rounded-xl text-sm font-semibold text-slate-300"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* ══════════════════════════════════════════════════
          WHY BILEL.DEV SECTION
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden border-b" style={{ background: 'var(--dark-bg)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 blur-[100px] -z-10" style={{ background: 'rgba(59,130,246,0.06)' }} />
 
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
 
            <div>
              <p className="reveal text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: '#3b82f6' }}>The Reason</p>
              <h2 className="reveal d100 text-4xl md:text-5xl font-black text-white mb-10 leading-tight">
                Why <span style={{ color: '#3b82f6' }}>Bilel.dev?</span>
              </h2>
              <div className="space-y-5">
                {whyItems.map((item, i) => (
                  <div
                    key={item.id}
                    className={`reveal d${(i + 1) * 100} group p-6 rounded-2xl transition-all duration-500`}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                      e.currentTarget.style.background = 'rgba(59,130,246,0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <div className="flex gap-6 items-start">
                      <span className="text-2xl font-black transition-colors" style={{ color: 'rgba(59,130,246,0.35)' }}>
                        {item.id}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="relative group">
              <div className="absolute -top-8 left-0 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'rgba(59,130,246,0.6)' }}>
                Latest Project
              </div>
              <div className="reveal reveal-right relative rounded-3xl overflow-hidden border shadow-2xl transition-all duration-500 group-hover:-translate-y-3 min-h-[380px]"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#0f1c3d' }}>
                {loading ? (
                  <div className="w-full h-64 animate-pulse flex items-center justify-center text-xs font-black uppercase tracking-widest" style={{ background: '#0f1c3d', color: '#1e3a6e' }}>
                    Loading...
                  </div>
                ) : latestProject ? (
                  <>
                    <div className="aspect-video w-full overflow-hidden" style={{ background: '#0a1228' }}>
                      <img
                        src={latestProject.image}
                        alt={latestProject.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                          style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' }}>
                          {latestProject.category || 'Development'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                          {latestProject.tags?.[0] || 'React 19'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{latestProject.title}</h3>
                      <p className="text-slate-400 text-sm mb-6 line-clamp-2">{latestProject.description}</p>
                      <Link to="/projects" className="inline-flex items-center gap-2 text-white font-bold group/link">
                        View Full Project
                        <span className="transition-transform group-hover/link:translate-x-2" style={{ color: '#3b82f6' }}>→</span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-slate-500 italic">No projects yet.</div>
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full rounded-3xl -z-10 transition-transform duration-500 group-hover:rotate-2"
                style={{ border: '1px solid rgba(59,130,246,0.1)' }} />
            </div>
          </div>
        </div>
      </section>
 
      {/* LATEST WORK */}
      <LatestWork />
 
      {/* ══════════════════════════════════════════════════
          FEEDBACK SECTION
      ══════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden border-t" style={{ background: 'var(--dark-bg)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] -z-10" style={{ background: 'rgba(59,130,246,0.05)' }} />
 
        <div className="max-w-7xl mx-auto">
          <div className="reveal text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ color: '#3b82f6' }}>Testimonials</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              What Clients <span style={{ color: '#3b82f6' }}>Say.</span>
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Real words from real people who worked with me.
            </p>
          </div>
 
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3b82f6', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {feedbacks.length > 0 ? (
                feedbacks.map((review, idx) => (
                  <div
                    key={review._id || idx}
                    className={`reveal d${(idx + 1) * 100} p-8 rounded-3xl flex flex-col justify-between transition-all duration-500`}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold uppercase"
                          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6' }}>
                          {review.name.charAt(0)}
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-white text-lg">{review.name}</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(59,130,246,0.6)' }}>{review.role}</p>
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-8 italic">"{review.message}"</p>
                    </div>
                    <div className="flex gap-1 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                          style={{ color: i < review.rating ? '#3b82f6' : '#1e293b' }}>
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-slate-500 py-10 rounded-3xl border border-dashed" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  Success stories coming soon...
                </div>
              )}
            </div>
          )}
 
          <div className="reveal mt-16 text-center">
            <Link
              to="/feedback"
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full font-bold text-white transition-all group"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.borderColor = '#3b82f6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              Read All Reviews
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>
 
      {/* Modals */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ServiceModal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} service={selectedService} />
    </div>
  );
}