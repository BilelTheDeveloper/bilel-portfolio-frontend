import { techStackGroups, techStackIntro } from '../utils/techStack';
import TechArsenalModal from '../components/TechArsenalModal';
import axios from 'axios';
import CONFIG from '../api/config';
import ProjectCard from '../components/ProjectCard';
import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Box, ShieldCheck, Pencil, Mail, MessageSquare, ListChecks, RefreshCw, Rocket } from 'lucide-react';
import { FaGithub, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { SiReact, SiNodedotjs, SiMongodb, SiNextdotjs, SiTypescript, SiTailwindcss, SiDocker, SiGit, SiExpress } from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { getProjects } from '../api/projects';
import ContactModal from '../components/ContactModal';
import '../showcase.css';
import '../mobile.css';

const technologies = [
  ['React', SiReact, '#00cfff'], ['Node.js', SiNodedotjs, '#65cb35'], ['MongoDB', SiMongodb, '#29c878'],
  ['Next.js', SiNextdotjs, '#fff'], ['TypeScript', SiTypescript, '#168aff'], ['Tailwind CSS', SiTailwindcss, '#00c6f4'],
  ['Docker', SiDocker, '#00b7ed'], ['AWS', FaAws, '#ffae35'], ['Git', SiGit, '#f56a45'], ['Express', SiExpress, '#d7e3ef'],
];
const services = [
  [Code2, 'Full-Stack Web Applications', 'Web applications shaped around your users, daily workflows, and business goals.'],
  [Box, 'Product Development', 'A practical first version with the right priorities for your budget and timeline.'],
  [ShieldCheck, 'Security & Best Practices', 'Thoughtful authentication, access control, and a maintainable foundation for your product.'],
  [Pencil, 'UI/UX & Modern Design', 'Clear journeys and responsive interfaces that make your product easier to use.'],
];
const workflow = [
  [MessageSquare, '01', 'A conversation first', 'We start with a short meeting to understand your idea, your users, the problem to solve, and your budget.', 'Your goals, understood', 'A short meeting about your needs, users, and budget.'],
  [ListChecks, '02', 'A plan we agree on', 'I suggest practical options and explain the tradeoffs. We agree on the scope, deliverables, timeline, and budget before development begins.', 'Clear scope. Shared expectations.', 'Practical options, with scope and budget agreed before we start.'],
  [RefreshCw, '03', 'Progress you can follow', 'I share updates and previews as the project develops, ask for your feedback, and discuss changes with you before adjusting the plan.', 'Updates, feedback, and useful advice', 'Regular previews, honest advice, and room for your feedback.'],
  [Rocket, '04', 'Review, refine, and launch', 'We review the key journeys together, resolve the final details, and walk through the finished product and its next steps.', 'A considered handover', 'Review the experience together, refine the details, and launch.'],
];
const questions = [
  ['Do I need a detailed specification?', 'No. Bring your idea, the problem you want to solve, and any examples you like. Our first conversation helps turn those into clear priorities.'],
  ['What if my budget is limited?', 'Tell me your budget early. I can suggest a smaller first release, prioritize essential features, and explain what can wait. We agree on what is realistic before starting.'],
  ['How will I know how the project is going?', 'I keep you informed with progress updates and previews, so you can see the work, ask questions, and give feedback throughout development.'],
  ['Can the requirements change?', 'Yes. We discuss the change, its value, and any effect on the budget or timeline before agreeing on the next step.'],
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
  const feedback = projects.filter(project => project.testimonialApproved && project.testimonialQuote && project.testimonialAuthor).slice(0,3);
  const featured = [...projects].sort((a,b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))).slice(0,3);
  return <div className="showcase">
    <section className="sc-hero sc-wrap" id="home">
      <div className="sc-intro"><p className="sc-eyebrow">01 — Full-stack developer</p><h1>Bilel<br/><span>Helal</span></h1><p className="sc-mobile-role">Full-stack developer & problem solver</p><p className="sc-lead">I help businesses turn everyday problems into practical web applications, with clear communication from the first conversation to launch.</p><div className="sc-actions"><button className="sc-button primary" onClick={() => setContact(true)}>Let’s Talk <ArrowRight size={16}/></button><Link className="sc-button" to="/projects">View My Work</Link></div><SocialLinks /></div>
      <div className="sc-portrait"><img draggable={false} onDragStart={event => event.preventDefault()} src="/BilelHelal.png" alt="Bilel Helal, full-stack developer" fetchPriority="high" width="1254" height="1254"/><blockquote><span>“</span>Listen first.<br/>Solve with care.<br/>Build with purpose.<i/></blockquote></div>
      <nav className="sc-index" aria-label="Page sections"><a href="#home" className="active">01<span>Home</span></a><a href="#process">02<span>Process</span></a><a href="#about">03<span>About</span></a><a href="#selected-projects">04<span>Projects</span></a><a href="#contact">05<span>Contact</span></a></nav>
    </section>
    <nav className="sc-mobile-jumps sc-wrap" aria-label="Explore the portfolio"><a href="#process">The process</a><a href="#selected-projects">My work</a><a href="#stack">Tech stack</a><a href="#about">About me</a></nav>
    <section className="sc-section" id="process"><div className="sc-wrap sc-process"><div className="sc-section-head"><div><p className="sc-eyebrow">02 — How we work together</p><h2>A clear process.<br/><span>A shared direction.</span></h2></div><p className="sc-process-intro">You know what we are building, why it matters, and where the project stands.</p></div><div className="sc-process-grid">{workflow.map(([Icon,number,title,description,outcome,short]) => <article className="sc-process-card" key={number}><div className="sc-process-top">{createElement(Icon,{size:22})}<span>{number}</span></div><h3>{title}</h3><p className="sc-process-description">{description}</p><p className="sc-process-short">{short}</p><details className="sc-mobile-detail"><summary>Read more</summary><p>{description}</p></details><footer>{outcome}</footer></article>)}</div><div className="sc-practical"><div><span className="sc-eyebrow">Practical problem solving</span><h3>Start with what makes the biggest difference.</h3><p className="sc-practical-description">If the full idea is bigger than the available budget, we can define a focused first release, simplify a complicated workflow, or build in stages. I explain the options so we can choose a sensible next step together.</p><details className="sc-mobile-detail"><summary>A plan that fits your budget</summary><p>We can prioritize essential features, simplify a workflow, or build in stages. I’ll explain the options so we can choose the next step together.</p></details></div><button className="sc-button" onClick={() => setContact(true)}>Discuss Your Idea <ArrowRight size={16}/></button></div></div></section>
    <section className="sc-trusted sc-section"><div className="sc-wrap"><p>Tools I work with</p><div className="sc-tech-logos">{technologies.slice(0,8).map(([name, Icon, color]) => <div key={name} aria-label={name}>{createElement(Icon, {style: {color}, 'aria-hidden': true})}<span>{name}</span></div>)}</div></div></section>
    <section className="sc-section"><div className="sc-wrap sc-services"><div><p className="sc-eyebrow">03 — What I do</p><h2>From Idea<br/>to <span>Real Product.</span></h2><p>From a new idea to a better way of working, I help you choose what to build and turn it into a useful, usable product.</p></div><div className="sc-service-grid">{services.map(([Icon,title,desc]) => <button key={title} className="sc-service" onClick={() => setContact(true)}><span className="sc-service-icon">{createElement(Icon)}</span><span><strong>{title}</strong><small>{desc}</small></span></button>)}</div></div></section>
    <section className="sc-section" id="stack"><div className="sc-wrap sc-stack sc-stack-showcase"><div className="sc-section-head"><div><p className="sc-eyebrow">04 — Selected technologies</p><h2>My <span>Tech Stack.</span></h2><p className="sc-stack-intro">{techStackIntro}</p></div><button type="button" onClick={() => setArsenal(true)} className="sc-mini-link" aria-haspopup="dialog">Explore the toolkit <ArrowRight size={14}/></button></div><div className="sc-stack-grid">{techStackGroups.map(({name,icon, color, description, tools}, index) => <article className="sc-stack-card" key={name} style={{'--stack-accent': color}}><header><span className="sc-stack-icon">{createElement(icon,{size:22,'aria-hidden':true})}</span><span className="sc-stack-number">0{index + 1}</span></header><h3>{name}</h3><p>{description}</p><ul className="sc-stack-tags" aria-label={`${name} technologies`}>{tools.map(tool => <li key={tool}>{tool}</li>)}</ul></article>)}</div><div className="sc-stack-note"><span aria-hidden="true">↳</span><p>The problem comes first. The tools follow.</p><a href="#selected-projects">See them in practice <ArrowRight size={14}/></a></div></div></section>
    <section className="sc-section" id="about">
      <div className="sc-wrap sc-about sc-about-expanded">
        <figure className="sc-about-photo"><img draggable={false} onDragStart={event => event.preventDefault()} src="/about-me.png" alt="Bilel Helal working at his development desk" width="1254" height="1254" loading="lazy"/><figcaption><span className="sc-about-photo-mark"><Code2 size={18}/></span><div><strong>Thoughtful code. Real products.</strong><span>From the first idea to the final detail.</span></div></figcaption></figure>
        <div className="sc-about-story"><p className="sc-eyebrow">05 — About me</p><h2>More Than<br/>Just <span>Code.</span></h2><p className="sc-about-intro">I'm Bilel Helal, a Full-Stack Developer and digital builder focused on creating real products that solve real problems.</p><div className="sc-about-full"><p>Good development starts with understanding the problem. Before we begin, I meet with you to discuss your needs, how your business works, and what your budget can support. I ask questions, explain the options, and help you choose a practical direction.</p><p>Once we agree on the scope and the way forward, I keep you involved with updates, previews, and honest advice. I look for solutions that make sense for your users and your resources, and explain the tradeoffs so we can make informed decisions together.</p></div><details className="sc-mobile-detail sc-about-mobile"><summary>My approach to working with you</summary><p>Before we begin, I meet with you to understand your needs, workflow, and budget. We agree on the scope and direction, then stay in touch through updates, previews, and feedback. I explain the options and tradeoffs so we can make practical decisions together.</p></details><details className="sc-about-note"><summary>What matters to me when building a product</summary><p>A feature is useful when it helps someone complete a real task. I start by understanding the workflow, ask what is getting in the way, and look for a solution that fits the people using it. That means explaining choices clearly, welcoming feedback, and keeping the next step practical.</p></details><div className="sc-stats">{[[projects.length ? `${projects.length}+` : 'MERN','Projects & products'],['Listen','Before building'],['Plan','Around your needs'],['Share','Progress & advice']].map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><div className="sc-actions"><Link className="sc-button primary" to="/projects">Explore My Work <ArrowRight size={16}/></Link><button className="sc-button" onClick={() => setContact(true)}>Let's Talk <ArrowRight size={16}/></button></div></div>
      </div>
    </section>
    <section className="sc-section" id="selected-projects"><div className="sc-wrap sc-project-section"><div className="sc-section-head"><div><p className="sc-eyebrow">06 — The work behind the skills</p><h2>Selected<br/>{' '}<span>Projects.</span></h2><p className="sc-section-description">Explore the context, features, and technical decisions behind each project.</p></div><Link className="sc-mini-link" to="/projects">View All Projects <ArrowRight size={14}/></Link></div><div className="sc-projects">{featured.map(project => <ProjectCard key={project._id} project={project}/>)}</div>{!featured.length && <div className="sc-empty" role="status">{status === 'loading' ? 'Loading selected projects…' : status === 'error' ? 'Projects are temporarily unavailable.' : 'New projects are on the way.'}<Link to="/projects">Explore the project gallery <ArrowRight size={16}/></Link></div>}</div></section>
    {feedback.length > 0 && <section className="sc-section"><div className="sc-wrap sc-feedback"><p className="sc-eyebrow">In their words</p><h2>The client’s <span>perspective.</span></h2><div className="sc-feedback-grid">{feedback.map(project=><figure key={project._id}><blockquote>“{project.testimonialQuote}”</blockquote><figcaption>{project.testimonialAuthor}<Link to={`/project/${project._id}`}>Explore the work <ArrowRight size={13}/></Link></figcaption></figure>)}</div></div></section>}
    <section className="sc-section"><div className="sc-wrap sc-faq"><div><p className="sc-eyebrow">07 — Before we start</p><h2>A few things<br/>{' '}<span>you might ask.</span></h2><p>Clear expectations make working together easier.</p></div><div className="sc-faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></div></section>
    <section className="sc-section sc-contact" id="contact"><div className="sc-orbit"/><div className="sc-wrap"><div><p className="sc-eyebrow">08 — Let's work together</p><h2>Have a <span>Project</span> in Mind?</h2><p>Tell me what you want to improve, your rough budget, and your ideal timeline. We’ll start with a conversation and work out a practical next step.</p></div><div className="sc-actions"><button className="sc-button primary" onClick={() => setContact(true)}>Start a Conversation <ArrowRight size={16}/></button><a className="sc-button" href="mailto:bilel.thedeveloper@gmail.com">Email Me</a></div></div></section>
    <nav className="sc-mobile-dock" aria-label="Quick actions"><a href="#selected-projects">View my work <ArrowRight size={15}/></a><button onClick={() => setContact(true)}>Let’s talk <MessageSquare size={15}/></button></nav>
    {arsenal && <TechArsenalModal onClose={() => setArsenal(false)}/>}
    <ContactModal isOpen={contact} onClose={() => setContact(false)}/>
  </div>;
}
