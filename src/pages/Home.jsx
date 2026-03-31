import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ContactModal from '../components/ContactModal'; // Ensure this path is correct
import ServiceModal  from '../components/ServiceModal';
import LatestWork from '../components/LatestWork';
import axios from 'axios';
import CONFIG from '../api/config';
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const techStack = ['React 19', 'Tailwind 4.0', 'Node.js', 'MongoDB', 'Cloudinary'];
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [latestProject, setLatestProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const services = [
    {
      title: "Web Development",
      desc: "Custom MERN stack solutions built for speed and scalability.",
      longDesc: "I build enterprise-grade web applications from scratch. My focus is on writing clean, maintainable code that ensures your business stays ahead of the competition with lightning-fast performance.",
      icon: "💻",
      features: ["Custom UI/UX Design", "API Integration", "Database Management", "SEO Optimization"],
      tools: ["React 19", "Node.js", "MongoDB", "Tailwind 4.0", "Express"]
    },
    {
      title: "Meta Ads Management",
      desc: "Data-driven Facebook & Instagram campaigns to scale your ROI.",
      longDesc: "Stop wasting money on ads that don't convert. I manage your entire funnel, from creative strategy and pixel setup to advanced A/B testing and scaling your daily spend profitably.",
      icon: "📈",
      features: ["Campaign Strategy", "Pixel & CAPI Setup", "Retargeting Funnels", "Copywriting & Creative"],
      tools: ["Meta Business Suite", "Ads Manager", "Google Analytics", "Hotjar"]
    }
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
          // Get the very first item (the most recent one from your DB)
          setLatestProject(res.data.data[0]);
        }
      } catch (err) {
        console.error("Error fetching latest preview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);
  return (
    <div className="animate-in fade-in duration-700">
      {/* HERO SECTION - REWORKED WITH IMAGE */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 px-6 overflow-hidden">
        {/* ADVANCED BACKGROUND DETAILS - KEPT EXACTLY THE SAME */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left order-2 md:order-1">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              Open for New Projects
            </div>
            
            {/* CLEAR WEB DEVELOPER SLOGAN */}
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight">
              Modern <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-blue-400 to-cyan-400">
                Web Developer.
              </span>
            </h1>
            
            {/* CLEAR & SIMPLE SUB-TEXT */}
            <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              I am Bilel. I build fast, secure, and beautiful websites using the 
              <span className="text-white font-medium"> MERN Stack</span>. I also help businesses grow with 
              <span className="text-white font-medium"> Meta Ads management</span> and digital strategy.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-brand-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Hire Me
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <Link 
                to="/projects" 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all text-center"
              >
                My Work
              </Link>
            </div>
          </div>

          {/* IMAGE SECTION - UPDATED WITH FLOATING CARDS */}
          <div className="order-1 md:order-2 flex justify-center relative">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              
              {/* --- FLOATING STAT CARDS --- */}
              <div className="absolute -top-4 -left-8 md:-left-12 z-30 animate-bounce [animation-duration:3s]">
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-2xl shadow-2xl">
                  <p className="text-brand-primary text-xl md:text-2xl font-black">+12</p>
                  <p className="text-white text-[10px] uppercase font-bold tracking-tighter">Success Projects</p>
                </div>
              </div>

              <div className="absolute top-1/2 -right-10 md:-right-16 z-30 animate-bounce [animation-duration:4s]">
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-2xl shadow-2xl">
                  <p className="text-blue-400 text-xl md:text-2xl font-black">+5</p>
                  <p className="text-white text-[10px] uppercase font-bold tracking-tighter">Marketing Scales</p>
                </div>
              </div>

              <div className="absolute -bottom-4 left-0 md:left-4 z-30 animate-bounce [animation-duration:5s]">
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-2xl shadow-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-lg">✓</div>
                  <div>
                    <p className="text-white text-lg font-black leading-none">99%</p>
                    <p className="text-slate-400 text-[8px] uppercase font-bold">Satisfaction</p>
                  </div>
                </div>
              </div>

              {/* --- EXISTING DECORATIONS & IMAGE --- */}
              <div className="absolute inset-0 border-2 border-dashed border-brand-primary/40 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute -inset-4 border border-brand-primary/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-slate-900 bg-slate-800 shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
                <img 
                  src="BilelTheDev.webp" 
                  alt="Bilel"
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
<section className="py-24 px-6 relative overflow-hidden  border-y border-white/5 bg-[#091027]">
  {/* Dynamic Background Glows */}
  <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/10 blur-[140px] -z-10 animate-pulse"></div>
  <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 blur-[140px] -z-10 animate-pulse"></div>

  <div className="max-w-7xl mx-auto">
    {/* HEADER */}
    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="text-left">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
          Expertise <span className="text-brand-primary">&</span> Stack.
        </h2>
        <div className="w-24 h-2 bg-brand-primary rounded-full mb-6"></div>
        <p className="text-slate-400 max-w-xl text-lg">
          I combine high-level strategy with deep technical execution to build products that actually move the needle.
        </p>
      </div>
    </div>

    {/* BENTO GRID LAYOUT */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT SIDE: SERVICES (Main Focus - 7/12 columns) */}
      <div className="lg:col-span-7 space-y-8">
        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4 ml-2">Core Services</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div 
              key={s.title} 
              onClick={() => handleOpenService(s)}
              className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 hover:border-brand-primary/50 transition-all group cursor-pointer relative overflow-hidden active:scale-[0.98] h-full flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              
              <div>
                <div className="text-5xl mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white leading-tight">
                  {s.title}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-8 text-sm">
                  {s.desc}
                </p>
              </div>
              
              <div className="text-brand-primary font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-sm uppercase tracking-widest">
                Deep Dive 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: TECH STACKS (Supporting - 5/12 columns) */}
      <div className="lg:col-span-5 space-y-8">
        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4 ml-2">Technical Arsenal</h4>
        <div className="flex flex-col gap-4">
          
          {/* 01. DEVELOPMENT */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-primary/40 transition-all duration-500 group flex items-start gap-6">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Development</h3>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'Node.js', 'MongoDB', 'Next.js'].map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 group-hover:text-brand-primary transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 02. MARKETING */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-400/40 transition-all duration-500 group flex items-start gap-6">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-400/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Marketing</h3>
              <div className="flex flex-wrap gap-2">
                {['Meta Ads', 'ROI Scaling', 'CAPI', 'Funnels'].map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 group-hover:text-blue-400 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 03. MANAGEMENT */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all duration-500 group flex items-start gap-6">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-cyan-400/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Management</h3>
              <div className="flex flex-wrap gap-2">
                {['Git/GitHub', 'AWS', 'Vercel', 'Strategy'].map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>

      {/* WHY BILEL.DEV SECTION */}
<section className="py-24 bg-slate-900/30 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand-primary/5 blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE: THE TEXT CONTENT (KEPT EXACTLY THE SAME) */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 text-white leading-tight text-left">
              Why <span className="text-brand-primary">Bilel.dev?</span>
            </h2>
            
            <div className="space-y-6">
              {[
                { 
                  id: "01", 
                  title: "Performance First", 
                  desc: "I build lightweight, lightning-fast sites. Speed is the #1 factor for keeping visitors on your page." 
                },
                { 
                  id: "02", 
                  title: "Conversion Focused", 
                  desc: "A beautiful site is useless if it doesn't sell. I integrate marketing psychology into every pixel." 
                },
                { 
                  id: "03", 
                  title: "Next-Gen Tech", 
                  desc: "Built with React 19 and Tailwind 4.0. Your project stays fast, secure, and modern for years." 
                }
              ].map((item) => (
                <div key={item.id} className="group p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-brand-primary/30 transition-all duration-500">
                  <div className="flex gap-6 items-start">
                    <span className="text-2xl font-black text-brand-primary/40 group-hover:text-brand-primary transition-colors">
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

          {/* RIGHT SIDE: THE "LAST WORK" CARD PREVIEW (NOW DYNAMIC) */}
          <div className="relative group">
            <div className="absolute -top-10 left-0 text-xs font-bold uppercase tracking-[0.3em] text-brand-primary/60 mb-4">
              Latest Project Preview
            </div>
            
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-800 shadow-2xl group-hover:translate-y-[-10px] transition-all duration-500 min-h-[400px]">
              {loading ? (
                // Simple Skeleton while loading
                <div className="w-full h-full bg-slate-800 animate-pulse flex items-center justify-center text-slate-600 text-xs font-black uppercase tracking-widest">
                  Fetching Latest Work...
                </div>
              ) : latestProject ? (
                <>
                  <div className="aspect-video w-full overflow-hidden bg-slate-900">
                    <img 
                      src={latestProject.image} 
                      alt={latestProject.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  
                  <div className="p-8">
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-bold text-brand-primary uppercase">
                        {latestProject.category || "Development"}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase">
                        {latestProject.tags?.[0] || "React 19"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {latestProject.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                      {latestProject.description}
                    </p>
                    <Link to="/projects" className="inline-flex items-center gap-2 text-white font-bold group/link">
                      View Full Project 
                      <span className="text-brand-primary group-hover/link:translate-x-2 transition-transform">→</span>
                    </Link>
                  </div>
                </>
              ) : (
                // Fallback if no project is found
                <div className="p-8 text-center text-slate-500 italic">No projects found.</div>
              )}
            </div>
            {/* The decorative border background */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border border-brand-primary/10 rounded-3xl -z-10 group-hover:rotate-2 transition-transform duration-500"></div>
          </div>

        </div>
      </div>
    </section>
      <LatestWork />
      {/* FEEDBACK SECTION - 3 CARD GRID */}
      <section className="py-24 px-6 bg-slate-900/50 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[120px] -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">Client <span className="text-brand-primary">Success.</span></h2>
            <p className="text-slate-400 max-w-lg mx-auto italic">"Real stories from partners who scaled their business with Bilel.dev"</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Jenkins",
                email: "s.jenkins@techcorp.com",
                text: "Bilel transformed our landing page into a high-converting machine. The MERN integration is flawless and the speed is incredible.",
                rating: 5,
                icon: "👤"
              },
              {
                name: "Marco Rossi",
                email: "marco@growthads.io",
                text: "The combination of expert development and Meta Ads knowledge is rare. Our ROI increased by 40% in the first month alone.",
                rating: 5,
                icon: "👔"
              },
              {
                name: "Elena Petrov",
                email: "elena@vogue-retail.ru",
                text: "Fast, professional, and understood our brand vision perfectly. The new site handled our peak traffic without a single glitch.",
                rating: 5,
                icon: "👗"
              }
            ].map((review, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-white/2 border border-white/10 hover:border-brand-primary/40 transition-all duration-500 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">
                      {review.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-white text-lg">{review.name}</h4>
                      <p className="text-brand-primary/60 text-xs font-medium lowercase tracking-tight">{review.email}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 italic">
                    "{review.text}"
                  </p>
                </div>
                <div className="flex gap-1 border-t border-white/5 pt-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg 
                      key={i} 
                      className="w-4 h-4 text-brand-primary" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              to="/feedback" 
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-white/10 text-white font-bold hover:bg-brand-primary hover:border-brand-primary transition-all group"
            >
              Read All Success Stories
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal Integration at the very bottom */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* THE SERVICE MODAL */}
      <ServiceModal 
        isOpen={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
        service={selectedService} 
      />
    </div>
  );
}