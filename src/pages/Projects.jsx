import ProjectCard from '../components/ProjectCard';
import { useEffect, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { getProjects } from '../api/projects';
import ContactModal from '../components/ContactModal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [contact, setContact] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => { let active = true; getProjects({refresh: attempt > 0}).then(data => {if(active){setProjects(data);setStatus('ready');}}).catch(() => {if(active)setStatus('error');}); return () => {active=false;}; }, [attempt]);
  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];
  const visible = projects.filter(p => (category === 'All' || p.category === category) && [p.title,p.description,...(p.tags || [])].join(' ').toLowerCase().includes(query.toLowerCase()));
  return <div className="showcase sc-gallery"><section className="sc-wrap"><div className="sc-gallery-heading"><p className="sc-eyebrow">02 — The project collection</p><h1>Selected <span>Projects.</span></h1><p>Real ideas. Thoughtful engineering. Products built to make a difference.</p></div><div className="sc-gallery-controls"><div className="sc-filters" aria-label="Project categories">{categories.map(name => <button aria-pressed={category === name} className={category===name ? 'active' : ''} onClick={() => setCategory(name)} key={name}>{name}</button>)}</div><label className="sc-search"><Search size={18}/><input type="search" aria-label="Search projects" placeholder="Search projects…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>{status==='loading' ? <p className="sc-empty" role="status">Loading projects…</p> : status==='error' ? <div className="sc-empty" role="alert">Projects could not be loaded.<button className="sc-button" onClick={()=>{setStatus('loading');setAttempt(a=>a+1);}}>Try again</button></div> : <><p className="sc-results" aria-live="polite">{visible.length} {visible.length===1?'project':'projects'}</p><div className="sc-projects">{visible.map(project => <ProjectCard key={project._id} project={project}/>)}</div>{!visible.length && <p className="sc-empty">{projects.length ? 'No projects match your search. Try a different keyword or category.' : 'New projects are on the way.'}</p>}</>}</section><section className="sc-section sc-contact"><div className="sc-orbit"/><div className="sc-wrap"><div><p className="sc-eyebrow">Your idea could be next</p><h2>Let's build <span>something great.</span></h2></div><button className="sc-button primary" onClick={()=>setContact(true)}>Start a Project <ArrowRight size={16}/></button></div></section><ContactModal isOpen={contact} onClose={()=>setContact(false)}/></div>;
}
