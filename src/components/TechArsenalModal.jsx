import { createElement, useState } from 'react';
import { Search, ShieldCheck, X } from 'lucide-react';
import { techStackGroups, techStackIntro } from '../utils/techStack';
import Dialog from './Dialog';
import './TechArsenalModal.css';

const tools = techStackGroups.flatMap(group => group.tools.map(name => ({name, category: group.name, icon: group.icon, color: group.color, description: group.description})));
const categories = ['All', ...new Set(tools.map(tool => tool.category))];

export default function TechArsenalModal({ onClose }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const visible = tools.filter(tool => (category === 'All' || tool.category === category) && `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <Dialog label="Selected Tech Stack" onClose={onClose} className="arsenal-overlay">
    <div className="arsenal-backdrop" onClick={onClose}/>
    <div className="arsenal-modal relative">
      <header className="arsenal-heading"><div><p className="arsenal-eyebrow">The tools behind the work</p><h2>My <span>Tech Stack.</span></h2><p>{techStackIntro}</p></div><button className="arsenal-close" aria-label="Close tech arsenal" onClick={onClose}><X size={20}/></button></header>
      <div className="arsenal-controls"><label className="arsenal-search"><Search size={17}/><span className="sr-only">Search technologies</span><input type="search" placeholder="Search tools, technologies, integrations…" value={query} onChange={event => setQuery(event.target.value)}/></label><div className="arsenal-filters" role="group" aria-label="Technology categories">{categories.map(value => <button type="button" aria-pressed={category === value} key={value} onClick={() => setCategory(value)}>{value}</button>)}</div></div>
      <div className="arsenal-content"><p className="arsenal-count" role="status">{visible.length} {visible.length === 1 ? 'technology' : 'technologies'}{category !== 'All' ? ` · ${category}` : ''}</p>{visible.length ? <div className="arsenal-grid">{visible.map(tool => <article className="arsenal-tool" key={tool.name}><span className="arsenal-icon" style={{color:tool.color}}>{createElement(tool.icon, {size:25,'aria-hidden':true})}</span><div><p className="arsenal-tool-category">{tool.category}</p><h3>{tool.name}</h3><p>{tool.description}</p></div></article>)}</div> : <div className="arsenal-empty"><Search size={28}/><h3>No tools found</h3><p>Try another keyword or browse all categories.</p><button onClick={() => {setQuery('');setCategory('All');}}>Show all technologies</button></div>}</div>
      <footer className="arsenal-footer"><ShieldCheck size={15}/><p>A selection from a broader toolkit, chosen around each project’s needs.</p></footer>
    </div>
  </Dialog>;
}
