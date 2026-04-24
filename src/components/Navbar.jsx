import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ContactModal from './ContactModal';

/* ─── INLINE STYLES ─────────────────────────────── */
const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  :root {
    --brand: #3b82f6;
    --brand-glow: rgba(59,130,246,0.35);
    --dark-bg: #060e25;
    --dark-mid: #091027;
    --border: rgba(255,255,255,0.07);
  }

  /* ── NAV ROOT ── */
  .nav-root {
    font-family: 'Space Grotesk', sans-serif;
  }
  .nav-root h1, .nav-root h2, .nav-root h3, .nav-root .syne {
    font-family: 'Syne', sans-serif;
  }

  /* ── HEADER SCROLL EFFECT ── */
  .nav-header {
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .nav-header.scrolled {
    background: rgba(6,14,37,0.97) !important;
    border-bottom-color: rgba(59,130,246,0.15) !important;
    box-shadow: 0 0 40px rgba(59,130,246,0.06);
  }

  /* ── LOGO GLOW ── */
  .logo-box {
    transition: all 0.3s ease;
    position: relative;
  }
  .logo-box::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 12px;
    background: var(--brand);
    opacity: 0;
    filter: blur(8px);
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  .logo-box:hover::after { opacity: 0.4; }
  .logo-box:hover { transform: rotate(8deg) scale(1.1); }

  /* ── NAV LINK ── */
  .nav-link {
    position: relative;
    transition: all 0.25s ease;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, var(--brand), transparent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  .nav-link:hover::after,
  .nav-link.active::after {
    transform: scaleX(1);
  }
  .nav-link:hover { color: #fff; }
  .nav-link.active { color: #60a5fa; }

  /* ── HIRE ME BUTTON ── */
  .hire-btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .hire-btn::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease;
  }
  .hire-btn:hover::before { width: 200px; height: 200px; }
  .hire-btn:hover {
    box-shadow: 0 0 24px var(--brand-glow), 0 0 50px rgba(59,130,246,0.2);
    transform: translateY(-1px);
  }

  /* ── RESUME BUTTON ── */
  .resume-btn {
    transition: all 0.3s ease;
  }
  .resume-btn:hover {
    background: rgba(59,130,246,0.08) !important;
    border-color: rgba(59,130,246,0.3) !important;
    color: #60a5fa !important;
    transform: translateY(-1px);
  }

  /* ── MOBILE NAV ── */
  .mobile-nav-item {
    transition: all 0.25s ease;
  }
  .mobile-nav-item.active .mobile-icon-wrap {
    background: rgba(59,130,246,0.12);
    border-color: rgba(59,130,246,0.3);
  }
  .mobile-nav-item.active span {
    color: #60a5fa;
  }
  .mobile-nav-item:not(.active):hover .mobile-icon-wrap {
    background: rgba(255,255,255,0.05);
  }

  /* ── PROGRESS BAR (scroll indicator) ── */
  .scroll-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 1.5px;
    background: linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa);
    transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(59,130,246,0.5);
  }

  /* ── RESUME MODAL ── */
  .resume-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(6,14,37,0.92);
    backdrop-filter: blur(16px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    animation: fadeIn 0.25s ease;
  }
  .resume-modal-card {
    width: 100%;
    max-width: 680px;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 2rem;
    background: #091027;
    border: 1px solid rgba(59,130,246,0.2);
    box-shadow: 0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.08);
    animation: slideUp 0.35s cubic-bezier(0.23, 1, 0.32, 1);
    scrollbar-width: thin;
    scrollbar-color: rgba(59,130,246,0.3) transparent;
  }
  .resume-modal-card::-webkit-scrollbar { width: 4px; }
  .resume-modal-card::-webkit-scrollbar-track { background: transparent; }
  .resume-modal-card::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 2px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  /* ── SECTION TAG ── */
  .section-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    background: rgba(59,130,246,0.08);
    border: 1px solid rgba(59,130,246,0.2);
    color: #60a5fa;
  }

  /* ── SKILL BAR ── */
  .skill-bar-fill {
    height: 100%;
    border-radius: 9999px;
    background: linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa);
    transition: width 1s cubic-bezier(0.23, 1, 0.32, 1);
  }

  /* ── NOISE OVERLAY ── */
  .noise-sm {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
  }

  /* ── MOBILE NAV GLOW ── */
  .mobile-nav-bg {
    background: rgba(6,14,37,0.96);
    border-top: 1px solid rgba(255,255,255,0.05);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
`;

/* ─── RESUME MODAL ─────────────────────────────── */
function ResumeModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const skills = [
    { name: 'React 19 / Next.js', level: 92 },
    { name: 'Node.js / Express',  level: 88 },
    { name: 'MongoDB',            level: 85 },
    { name: 'Tailwind CSS',       level: 95 },
    { name: 'TypeScript',         level: 78 },
  ];

  const experiences = [
    {
      period: '2024 – Present',
      title: 'Full-Stack Developer',
      company: 'Freelance',
      desc: 'Building MERN stack web apps for clients — from UI design to deployment on Vercel & AWS.',
    },
    {
      period: '2022 – 2024',
      title: 'Frontend Developer',
      company: 'Personal Projects',
      desc: 'Developed responsive React interfaces with focus on performance, accessibility and clean code.',
    },
  ];

  const techStack = [
    'React 19', 'Next.js', 'Node.js', 'Express', 'MongoDB',
    'Tailwind 4.0', 'TypeScript', 'REST API', 'JWT Auth',
    'Cloudinary', 'Vercel', 'AWS', 'Git', 'Docker',
  ];

  return (
    <div className="resume-modal-overlay" onClick={onClose}>
      <div className="resume-modal-card nav-root" onClick={(e) => e.stopPropagation()}>

        {/* ── TOP STRIP ── */}
        <div className="relative overflow-hidden rounded-t-[2rem] p-10 pb-8"
          style={{ background: 'linear-gradient(135deg, #060e25 0%, #091836 60%, #0c1f45 100%)' }}>
          <div className="absolute inset-0 noise-sm" />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: 'rgba(59,130,246,0.12)' }} />

          {/* Close */}
          <button onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            ✕
          </button>

          {/* Avatar + name */}
          <div className="flex items-center gap-6 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2" style={{ borderColor: 'rgba(59,130,246,0.4)', boxShadow: '0 0 24px rgba(59,130,246,0.3)' }}>
                <img src="BilelTheDev.webp" alt="Bilel" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ background: '#060e25', borderColor: '#060e25' }}>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                </span>
              </div>
            </div>
            <div>
              <h2 className="syne text-3xl font-black text-white tracking-tight">Bilel</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Full-Stack Web Developer · MERN Stack</p>
              <div className="section-tag mt-3">Open for New Projects</div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-8 pt-6 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[['4+', 'Projects'], ['100%', 'Satisfaction'], ['2+', 'Yrs Exp']].map(([num, label]) => (
              <div key={label}>
                <p className="syne text-2xl font-black text-white">{num}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="p-8 space-y-8">

          {/* About */}
          <div>
            <div className="section-tag mb-4">About</div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Hi, I am <span className="text-white font-semibold">Bilel</span> — a Full-Stack Web Developer specialising in the
              <span className="text-white font-semibold"> MERN Stack</span>. I build fast, secure, and scalable web applications
              with clean code and real results. Available for freelance projects worldwide.
            </p>
          </div>

          {/* Skills */}
          <div>
            <div className="section-tag mb-5">Technical Skills</div>
            <div className="space-y-4">
              {skills.map((sk) => (
                <div key={sk.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-semibold text-white">{sk.name}</span>
                    <span className="text-sm font-bold" style={{ color: '#3b82f6' }}>{sk.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="skill-bar-fill" style={{ width: `${sk.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div>
            <div className="section-tag mb-5">Experience</div>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.title} className="flex gap-4 p-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ background: '#3b82f6', boxShadow: '0 0 8px rgba(59,130,246,0.5)' }} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(59,130,246,0.7)' }}>{exp.period}</p>
                    <h4 className="syne text-base font-bold text-white">{exp.title}</h4>
                    <p className="text-slate-500 text-xs font-semibold mb-2">{exp.company}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <div className="section-tag mb-4">Tech Stack</div>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <a href="mailto:bilel@example.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: '#3b82f6', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Me
            </a>
            <button onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN NAVBAR ──────────────────────────────── */
export default function Navbar() {
  const location = useLocation();
  const [isContactOpen, setIsContactOpen]   = useState(false);
  const [isResumeOpen,  setIsResumeOpen]    = useState(false);
  const [scrolled,      setScrolled]        = useState(false);
  const [scrollPct,     setScrollPct]       = useState(0);
  const [menuOpen,      setMenuOpen]        = useState(false);

  /* scroll listener */
  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 24);
      const docH  = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    {
      name: 'Home', path: '/',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Projects', path: '/projects',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      name: 'Feedback', path: '/feedback',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{navStyles}</style>

      {/* ══════════════════════════════════════════
          TOP HEADER
      ══════════════════════════════════════════ */}
      <header
        className={`nav-root nav-header sticky top-0 z-50 w-full ${scrolled ? 'scrolled' : ''}`}
        style={{
          background: scrolled ? undefined : 'rgba(6,14,37,0.72)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Scroll progress bar */}
        <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center gap-3 group z-10">
            <div
              className="logo-box w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-base"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}
            >
              B
            </div>
            <span className="syne text-xl font-black tracking-tight text-white">
              bilel<span style={{ color: '#3b82f6' }}>.dev</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${isActive(link.path)
                    ? 'active text-blue-400'
                    : 'text-slate-400 hover:text-white'
                  }`}
                style={isActive(link.path)
                  ? { background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)' }
                  : { border: '1px solid transparent' }
                }
              >
                {link.icon}
                {link.name}
                {isActive(link.path) && (
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }} />
                )}
              </Link>
            ))}
          </nav>

          {/* ── CTA BUTTONS ── */}
          <div className="hidden md:flex items-center gap-3">
            {/* Resume */}
            <button
              onClick={() => setIsResumeOpen(true)}
              className="resume-btn px-5 py-2 text-sm font-semibold text-slate-300 rounded-full flex items-center gap-2"
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </button>

            {/* Hire Me */}
            <button
              onClick={() => setIsContactOpen(true)}
              className="hire-btn px-6 py-2.5 text-sm font-bold rounded-full text-white flex items-center gap-2 group/btn"
              style={{ background: '#3b82f6', boxShadow: '0 6px 24px rgba(59,130,246,0.3)' }}
            >
              Hire Me
              <span className="group-hover/btn:translate-x-1 transition-transform text-xs">→</span>
            </button>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl z-10"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* ── MOBILE DROPDOWN MENU ── */}
        <div
          className="md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            maxHeight: menuOpen ? '320px' : '0',
            borderTop: menuOpen ? '1px solid rgba(255,255,255,0.05)' : 'none',
            background: 'rgba(6,14,37,0.98)',
          }}
        >
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${isActive(link.path) ? 'text-blue-400' : 'text-slate-400 hover:text-white hover:bg-white/4'}`}
                style={isActive(link.path)
                  ? { background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)' }
                  : { border: '1px solid transparent' }
                }
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {/* Mobile CTA row */}
            <div className="flex gap-3 pt-3 pb-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => { setIsResumeOpen(true); setMenuOpen(false); }}
                className="flex-1 py-2.5 text-sm font-bold text-slate-300 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Resume
              </button>
              <button
                onClick={() => { setIsContactOpen(true); setMenuOpen(false); }}
                className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl text-center"
                style={{ background: '#3b82f6', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}
              >
                Hire Me →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          MOBILE BOTTOM NAV
      ══════════════════════════════════════════ */}
      <nav className="nav-root md:hidden fixed bottom-0 left-0 z-50 w-full mobile-nav-bg px-4 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-item flex flex-col items-center gap-1 min-w-[4rem] ${isActive(link.path) ? 'active' : ''}`}
            >
              <div
                className="mobile-icon-wrap w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  border: `1px solid ${isActive(link.path) ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                  background: isActive(link.path) ? 'rgba(59,130,246,0.1)' : 'transparent',
                }}
              >
                <span style={{ color: isActive(link.path) ? '#60a5fa' : '#94a3b8' }}>
                  {link.icon}
                </span>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive(link.path) ? 'text-blue-400' : 'text-slate-500'}`}>
                {link.name}
              </span>
            </Link>
          ))}

          {/* Hire Me shortcut in bottom nav */}
          <button
            onClick={() => setIsContactOpen(true)}
            className="flex flex-col items-center gap-1 min-w-[4rem]"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{ background: '#3b82f6', boxShadow: '0 4px 16px rgba(59,130,246,0.4)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Hire</span>
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════ */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <ResumeModal  isOpen={isResumeOpen}  onClose={() => setIsResumeOpen(false)} />
    </>
  );
}