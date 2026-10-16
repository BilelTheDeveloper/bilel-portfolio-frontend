import { createElement, useState } from 'react';
import { Code2, Database, Fingerprint, Globe, KeyRound, LockKeyhole, Search, ShieldCheck, Timer, X } from 'lucide-react';
import { SiReact, SiNodedotjs, SiMongodb, SiNextdotjs, SiTypescript, SiTailwindcss, SiDocker, SiGit, SiExpress, SiJavascript, SiHtml5, SiVercel, SiCloudinary } from 'react-icons/si';
import { FaAws, FaCss3Alt } from 'react-icons/fa';
import Dialog from './Dialog';
import './TechArsenalModal.css';

const tools = [
  { name:'JavaScript', category:'Languages', icon:SiJavascript, color:'#f3db4e', description:'Interactive interfaces and application logic across the browser and server.' },
  { name:'TypeScript', category:'Languages', icon:SiTypescript, color:'#479fff', description:'Typed JavaScript for clearer interfaces and maintainable application code.' },
  { name:'HTML5', category:'Languages', icon:SiHtml5, color:'#fa8059', description:'Semantic page structure, accessible forms, and meaningful content.' },
  { name:'CSS3', category:'Languages', icon:FaCss3Alt, color:'#54b4ff', description:'Responsive layouts, visual systems, and carefully considered motion.' },
  { name:'React', category:'Frontend', icon:SiReact, color:'#57d9f7', description:'Reusable components and responsive, state-driven user experiences.' },
  { name:'Next.js', category:'Frontend', icon:SiNextdotjs, color:'#edf5ff', description:'React application structure, routing, and server rendering where appropriate.' },
  { name:'Tailwind CSS', category:'Frontend', icon:SiTailwindcss, color:'#3dd1ee', description:'Consistent spacing, typography, and layouts across screen sizes.' },
  { name:'Node.js', category:'Backend & data', icon:SiNodedotjs, color:'#86d264', description:'Server-side JavaScript for APIs, integrations, and background work.' },
  { name:'Express', category:'Backend & data', icon:SiExpress, color:'#d3e4f7', description:'HTTP APIs with request validation, middleware, and clear error handling.' },
  { name:'MongoDB', category:'Backend & data', icon:SiMongodb, color:'#43d38c', description:'Document storage for project content, inquiries, and administrator records.' },
  { name:'Mongoose', category:'Backend & data', icon:Database, color:'#ec9393', description:'Schemas and validation that keep stored application data consistent.' },
  { name:'REST APIs', category:'Backend & data', icon:Globe, color:'#73a9ff', description:'Predictable endpoints that connect the interface to backend services.' },
  { name:'Authenticator MFA', category:'Security', icon:Fingerprint, color:'#7ee4c1', description:'Time-based authenticator codes add a second step to admin sign-in.' },
  { name:'bcrypt', category:'Security', icon:KeyRound, color:'#7ee4c1', description:'Salted password hashing keeps plaintext passwords out of the database.' },
  { name:'AES-256-GCM', category:'Security', icon:LockKeyhole, color:'#7ee4c1', description:'Authenticated encryption protects stored authenticator secrets.' },
  { name:'Secure sessions', category:'Security', icon:ShieldCheck, color:'#7ee4c1', description:'HttpOnly cookies, session expiration, and database-backed revocation.' },
  { name:'CSRF & origin checks', category:'Security', icon:ShieldCheck, color:'#7ee4c1', description:'Request checks protect authenticated actions against unwanted cross-site writes.' },
  { name:'Rate limiting', category:'Security', icon:Timer, color:'#7ee4c1', description:'Request limits reduce repeated sign-in attempts and submission abuse.' },
  { name:'Helmet & validation', category:'Security', icon:Code2, color:'#7ee4c1', description:'Security headers and bounded input validation strengthen API handling.' },
  { name:'Docker', category:'Tools & deployment', icon:SiDocker, color:'#38baf7', description:'Containers support consistent application environments and delivery.' },
  { name:'AWS', category:'Tools & deployment', icon:FaAws, color:'#ffb956', description:'Cloud services for hosting and application infrastructure.' },
  { name:'Vercel', category:'Tools & deployment', icon:SiVercel, color:'#edf5ff', description:'Frontend builds, preview deployments, and custom domain delivery.' },
  { name:'Cloudinary', category:'Tools & deployment', icon:SiCloudinary, color:'#72a7ff', description:'Image uploads, optimization, and delivery for portfolio project covers.' },
  { name:'Git', category:'Tools & deployment', icon:SiGit, color:'#ff8565', description:'Version control for reviewing changes and tracking application history.' },
];
const categories = ['All', ...new Set(tools.map(tool => tool.category))];

export default function TechArsenalModal({ onClose }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const visible = tools.filter(tool => (category === 'All' || tool.category === category) && `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <Dialog label="My Tech Arsenal" onClose={onClose} className="arsenal-overlay">
    <div className="arsenal-backdrop" onClick={onClose}/>
    <div className="arsenal-modal relative">
      <header className="arsenal-heading"><div><p className="arsenal-eyebrow">The tools behind the work</p><h2>My <span>Tech Arsenal.</span></h2><p>From interface to infrastructure, with security at every layer.</p></div><button className="arsenal-close" aria-label="Close tech arsenal" onClick={onClose}><X size={20}/></button></header>
      <div className="arsenal-controls"><label className="arsenal-search"><Search size={17}/><span className="sr-only">Search technologies</span><input type="search" placeholder="Search languages, tools, security…" value={query} onChange={event => setQuery(event.target.value)}/></label><div className="arsenal-filters" role="group" aria-label="Technology categories">{categories.map(value => <button type="button" aria-pressed={category === value} key={value} onClick={() => setCategory(value)}>{value}</button>)}</div></div>
      <div className="arsenal-content"><p className="arsenal-count" role="status">{visible.length} {visible.length === 1 ? 'technology' : 'technologies'}{category !== 'All' ? ` · ${category}` : ''}</p>{visible.length ? <div className="arsenal-grid">{visible.map(tool => <article className="arsenal-tool" key={tool.name}><span className="arsenal-icon" style={{color:tool.color}}>{createElement(tool.icon, {size:25,'aria-hidden':true})}</span><div><p className="arsenal-tool-category">{tool.category}</p><h3>{tool.name}</h3><p>{tool.description}</p></div></article>)}</div> : <div className="arsenal-empty"><Search size={28}/><h3>No tools found</h3><p>Try another keyword or browse all categories.</p><button onClick={() => {setQuery('');setCategory('All');}}>Show all technologies</button></div>}</div>
      <footer className="arsenal-footer"><ShieldCheck size={15}/><p>Tools are selected for each project’s needs. Security is an ongoing practice.</p></footer>
    </div>
  </Dialog>;
}
