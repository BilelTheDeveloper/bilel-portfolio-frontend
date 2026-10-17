import { FileText } from 'lucide-react';
import ResumeModal from './ResumeModal';
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

/* ─── MAIN NAVBAR ──────────────────────────────── */
export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contact, setContact] = useState(false);
  const [resume, setResume] = useState(false);
  return <><style>{navStyles}</style><header className="sc-header"><div className="sc-wrap"><Link to="/" className="sc-logo" aria-label="Bilel.dev home"><b>B</b><strong>bilel<span>.dev</span></strong></Link><button className="sc-menu-button sc-button" aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="showcase-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</button><nav id="showcase-navigation" className={menuOpen ? 'open' : ''} aria-label="Main navigation"><Link className={pathname === '/' ? 'active' : ''} to="/" onClick={() => setMenuOpen(false)}>Home</Link><Link className={pathname.startsWith('/project') ? 'active' : ''} to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link><a href="/#about" onClick={() => setMenuOpen(false)}>About</a><button onClick={() => { setContact(true); setMenuOpen(false); }}>Contact</button><div className="sc-nav-actions"><button className="sc-button" onClick={() => {setResume(true); setMenuOpen(false);}}><FileText size={14}/> Resume</button><button className="sc-button primary" onClick={() => {setContact(true); setMenuOpen(false);}}>Hire Me →</button></div></nav></div></header><ContactModal isOpen={contact} onClose={() => setContact(false)}/><ResumeModal isOpen={resume} onClose={() => setResume(false)}/></>;
}
