import TechArsenalModal from '../components/TechArsenalModal';
import axios from 'axios';
import CONFIG from '../api/config';
import ProjectCard from '../components/ProjectCard';
import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Box, ShieldCheck, Pencil, Mail } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { SiReact, SiNodedotjs, SiMongodb, SiNextdotjs, SiTypescript, SiTailwindcss, SiDocker, SiGit, SiExpress } from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { getProjects } from '../api/projects';
import ContactModal from '../components/ContactModal';
import '../showcase.css';

const technologies = [
  ['React', SiReact, '#00cfff'], ['Node.js', SiNodedotjs, '#65cb35'], ['MongoDB', SiMongodb, '#29c878'],
  ['Next.js', SiNextdotjs, '#fff'], ['TypeScript', SiTypescript, '#168aff'], ['Tailwind CSS', SiTailwindcss, '#00c6f4'],
  ['Docker', SiDocker, '#00b7ed'], ['AWS', FaAws, '#ffae35'], ['Git', SiGit, '#f56a45'], ['Express', SiExpress, '#d7e3ef'],
];
const services = [
  [Code2, 'Full-Stack Web Applications', 'End-to-end solutions using the MERN stack and modern technologies.'],
  [Box, 'Product Development', 'Transforming ideas into real, scalable products.'],
  [ShieldCheck, 'Security & Best Practices', 'Secure backend, authentication, data protection and clean architecture.'],
  [Pencil, 'UI/UX & Modern Design', 'Clean, responsive and user-friendly interfaces with modern design systems.'],
];
function SocialLinks() {
  const [links, setLinks] = useState({ github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/BilelTheDeveloper', linkedin: '', instagram: '', email: 'bilel.thedeveloper@gmail.com' });
  useEffect(() => { let active = true; axios.get(`${CONFIG.API_URL}/social-links`).then(response => { if (active && response.data.success) setLinks(response.data.data); }).catch(() => {}); return () => { active = false; }; }, []);
  const profiles = [
    ['GitHub', links.github, FaGithub],
    ['LinkedIn', links.linkedin, FaLinkedinIn],
    ['Instagram', links.instagram, FaInstagram],
    ['Email Bilel', links.email ? 'mailto:' + links.email : '', Mail],
  ];
  return <div className="sc-socials" aria-label="Social profiles">
    {profiles.map(([name, url, Icon]) => url ? (
      <a key={name} aria-label={name} href={url} target={url.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" title={name}>{createElement(Icon)}</a>
    ) : (
      <button key={name} type="button" disabled aria-label={`${name} profile coming soon`} title={`${name} profile coming soon`}>{createElement(Icon)}</button>
    ))}
  </div>;
}

export default function Home() {
  const [contact, setContact] = useState(false);
  const [arsenal, setArsenal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  useEffect(() => { let active = true; getProjects().then(data => { if (active) { setProjects(data); setStatus('ready'); } }).catch(() => { if (active) setStatus('error'); }); return () => { active = false; }; }, []);
  const featured = [...projects].sort((a,b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))).slice(0,3);
  return <div className="showcase">
    <section className="sc-hero sc-wrap" id="home">
      <div className="sc-intro"><p className="sc-eyebrow">01 — Full-stack developer</p><h1>Bilel<br/><span>Helal</span></h1><p className="sc-lead">I build modern, secure, and scalable web applications that turn ideas into real products.</p><div className="sc-actions"><button className="sc-button primary" onClick={() => setContact(true)}>Hire Me <ArrowRight size={16}/></button><Link className="sc-button" to="/projects">See My Projects</Link></div><SocialLinks /></div>
      <div className="sc-portrait"><img draggable={false} onDragStart={event => event.preventDefault()} src="/BilelHelal.png" alt="Bilel Helal, full-stack developer" fetchPriority="high" width="1254" height="1254"/><blockquote><span>“</span>Clean code.<br/>Real products.<br/>Lasting impact.<i/></blockquote></div>
      <nav className="sc-index" aria-label="Page sections"><a href="#home" className="active">01<span>Home</span></a><a href="#about">02<span>About</span></a><a href="#selected-projects">03<span>Projects</span></a><a href="#contact">04<span>Contact</span></a></nav>
    </section>
    <section className="sc-trusted sc-section"><div className="sc-wrap"><p>Trusted technologies</p><div className="sc-tech-logos">{technologies.slice(0,8).map(([name, Icon, color]) => <div key={name}>{createElement(Icon, {style: {color}})}<span>{name}</span></div>)}</div></div></section>
    <section className="sc-section"><div className="sc-wrap sc-services"><div><p className="sc-eyebrow">02 — What I do</p><h2>From Idea<br/>to <span>Real Product.</span></h2><p>I design and develop web applications that are fast, secure, user-focused, and built to scale.</p></div><div className="sc-service-grid">{services.map(([Icon,title,desc]) => <button key={title} className="sc-service" onClick={() => setContact(true)}><span className="sc-service-icon">{createElement(Icon)}</span><span><strong>{title}</strong><small>{desc}</small></span></button>)}</div></div></section>
    <section className="sc-section" id="stack"><div className="sc-wrap sc-stack"><div className="sc-section-head"><div><p className="sc-eyebrow">03 — Tech stack</p><h2>My <span>Tech Arsenal.</span></h2></div><button type="button" onClick={() => setArsenal(true)} className="sc-mini-link" aria-haspopup="dialog">View Details <ArrowRight size={14}/></button></div><div className="sc-tech-pills">{technologies.map(([name,Icon,color]) => <span key={name}>{createElement(Icon, {style: {color}})}{name === 'React' ? 'React 19' : name}</span>)}</div></div></section>
    <section className="sc-section" id="about">
      <div className="sc-wrap sc-about sc-about-expanded">
        <figure className="sc-about-photo"><img draggable={false} onDragStart={event => event.preventDefault()} src="/about-me.png" alt="Bilel Helal working at his development desk" width="1254" height="1254" loading="lazy"/><figcaption><span className="sc-about-photo-mark"><Code2 size={18}/></span><div><strong>Thoughtful code. Real products.</strong><span>From the first idea to the final detail.</span></div></figcaption></figure>
        <div className="sc-about-story"><p className="sc-eyebrow">04 — About me</p><h2>More Than<br/>Just <span>Code.</span></h2><p className="sc-about-intro">I'm Bilel Helal, a Full-Stack Developer and digital builder focused on creating real products that solve real problems.</p><p>I combine technical skills, problem-solving, and a product mindset to build impactful web applications. From a clear, accessible interface to the API and database behind it, I care about how every part works together.</p><p>My approach is simple: understand the goal, build with purpose, and keep improving the details. The result is software that feels good to use and is built to grow.</p><div className="sc-stats">{[[projects.length ? `${projects.length}+` : 'MERN','Projects & products'],['100%','Passion for Building'],['MERN','Main Stack'],['Always','Learning & Improving']].map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="sc-actions"><Link className="sc-button primary" to="/projects">Explore My Work <ArrowRight size={16}/></Link><button className="sc-button" onClick={() => setContact(true)}>Let's Talk <ArrowRight size={16}/></button></div></div>
      </div>
    </section>
    <section className="sc-section" id="selected-projects"><div className="sc-wrap sc-project-section"><div className="sc-section-head"><div><p className="sc-eyebrow">05 — Featured projects</p><h2>Selected<br/><span>Projects.</span></h2></div><Link className="sc-mini-link" to="/projects">View All Projects <ArrowRight size={14}/></Link></div><div className="sc-projects">{featured.map(project => <ProjectCard key={project._id} project={project}/>)}</div>{!featured.length && <div className="sc-empty" role="status">{status === 'loading' ? 'Loading selected projects…' : status === 'error' ? 'Projects are temporarily unavailable.' : 'New projects are on the way.'}<Link to="/projects">Explore the project gallery <ArrowRight size={16}/></Link></div>}</div></section>
    <section className="sc-section sc-contact" id="contact"><div className="sc-orbit"/><div className="sc-wrap"><div><p className="sc-eyebrow">06 — Let's work together</p><h2>Have a <span>Project</span> in Mind?</h2><p>Let's turn your idea into a real product. I'm open to freelance work,<br className="sc-desktop-break"/> collaborations and new opportunities.</p></div><div className="sc-actions"><button className="sc-button primary" onClick={() => setContact(true)}>Hire Me <ArrowRight size={16}/></button><button className="sc-button" onClick={() => setContact(true)}>Contact Me</button></div></div></section>
    {arsenal && <TechArsenalModal onClose={() => setArsenal(false)}/>}
    <ContactModal isOpen={contact} onClose={() => setContact(false)}/>
  </div>;
}
