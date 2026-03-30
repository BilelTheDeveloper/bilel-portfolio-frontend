import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ContactModal from './ContactModal'; // Ensure this path matches your file structure

export default function Navbar() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to highlight the active link
  const isActive = (path) => 
    location.pathname === path 
      ? 'text-brand-primary' 
      : 'text-slate-400 hover:text-white';

  const navLinks = [
    { name: 'Home', path: '/', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { name: 'Projects', path: '/projects', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
    { name: 'Feedback', path: '/feedback', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )},
  ];

  return (
    <>
      {/* --- TOP NAVBAR (Logo + CTA Buttons) --- */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[var(--color-brand-dark)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-black text-white group-hover:rotate-12 transition-transform">
              B
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              bilel<span className="text-brand-primary">.dev</span>
            </span>
          </Link>

          {/* DESKTOP NAV (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`${isActive(link.path)} flex items-center gap-2 transition-colors`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CALL TO ACTION BUTTONS */}
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 text-sm font-semibold text-white rounded-full border border-white/10 hover:bg-white/5 transition-colors">
              Resume
            </button>
            {/* Updated to Button for Pop-up */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 text-sm font-semibold rounded-full bg-brand-primary text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all cursor-pointer"
            >
              Hire Me
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE BOTTOM NAV (Instagram Style) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full border-t border-white/10 bg-[var(--color-brand-dark)]/90 backdrop-blur-lg px-6 py-3">
        <div className="flex items-center justify-around">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`flex flex-col items-center gap-1 ${isActive(link.path)}`}
            >
              <div className={`p-2 rounded-xl ${location.pathname === link.path ? 'bg-brand-primary/10' : ''}`}>
                {link.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* CONTACT MODAL COMPONENT */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}