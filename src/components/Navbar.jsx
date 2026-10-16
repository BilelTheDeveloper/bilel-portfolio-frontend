import { FileText } from 'lucide-react';
import Dialog from './Dialog';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ContactModal from './ContactModal';

/* ─── INLINE STYLES ─────────────────────────────── */
const navStyles = `

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
    <Dialog label="Bilel résumé" onClose={onClose} className="resume-modal-overlay">
      <div className="resume-modal-card nav-root" onClick={(e) => e.stopPropagation()}>

        {/* ── TOP STRIP ── */}
        <div className="relative overflow-hidden rounded-t-[2rem] p-5 sm:p-10 pb-6 sm:pb-8"
          style={{ background: 'linear-gradient(135deg, #060e25 0%, #091836 60%, #0c1f45 100%)' }}>
          <div className="absolute inset-0 noise-sm" />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: 'rgba(59,130,246,0.12)' }} />

          {/* Close */}
          <button aria-label="Close résumé" onClick={onClose}
            className="absolute z-20 top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            ✕
          </button>

          {/* Avatar + name */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative z-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2" style={{ borderColor: 'rgba(59,130,246,0.4)', boxShadow: '0 0 24px rgba(59,130,246,0.3)' }}>
                <img src="/BilelHelal.png" alt="Bilel" className="w-full h-full object-cover" />
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
          <div className="grid grid-cols-3 gap-2 sm:gap-8 mt-6 sm:mt-8 pt-6 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[['4+', 'Projects'], ['MERN', 'Stack'], ['2+', 'Yrs Exp']].map(([num, label]) => (
              <div key={label}>
                <p className="syne text-lg sm:text-2xl font-black text-white">{num}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="p-5 sm:p-8 space-y-8">

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
            <a href="mailto:bilel.thedeveloper@gmail.com"
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
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

/* ─── MAIN NAVBAR ──────────────────────────────── */
export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contact, setContact] = useState(false);
  const [resume, setResume] = useState(false);
  return <><style>{navStyles}</style><header className="sc-header"><div className="sc-wrap"><Link to="/" className="sc-logo" aria-label="Bilel.dev home"><b>B</b><strong>bilel<span>.dev</span></strong></Link><button className="sc-menu-button sc-button" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="showcase-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</button><nav id="showcase-navigation" className={menuOpen ? 'open' : ''} aria-label="Main navigation"><Link className={pathname === '/' ? 'active' : ''} to="/" onClick={() => setMenuOpen(false)}>Home</Link><Link className={pathname.startsWith('/project') ? 'active' : ''} to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link><a href="/#about" onClick={() => setMenuOpen(false)}>About</a><button onClick={() => { setContact(true); setMenuOpen(false); }}>Contact</button><div className="sc-nav-actions"><button className="sc-button" onClick={() => {setResume(true); setMenuOpen(false);}}><FileText size={14}/> Resume</button><button className="sc-button primary" onClick={() => {setContact(true); setMenuOpen(false);}}>Hire Me →</button></div></nav></div></header><ContactModal isOpen={contact} onClose={() => setContact(false)}/><ResumeModal isOpen={resume} onClose={() => setResume(false)}/></>;
}
