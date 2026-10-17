import { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Check, FileText, RefreshCw, X } from 'lucide-react';
import Dialog from './Dialog';
import { getProjects } from '../api/projects';
import { resumeProfile, resumeSkills, sortResumeProjects } from '../utils/resume';
import './ResumeModal.css';

function ResumeContent({ onClose }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    const load = () => {
      if (document.hidden) return;
      getProjects({ refresh: true }).then(data => {
        if (active) { setProjects(sortResumeProjects(data)); setError(''); }
      }).catch(() => { if (active) setError('Projects could not be refreshed. Please try again before downloading.'); })
        .finally(() => { if (active) setLoading(false); });
    };
    load();
    const interval = setInterval(load, 60000);
    window.addEventListener('focus', load);
    window.addEventListener('projects-updated', load);
    return () => { active = false; clearInterval(interval); window.removeEventListener('focus', load); window.removeEventListener('projects-updated', load); };
  }, []);
  const download = async () => {
    setExporting(true); setNotice('');
    try {
      const latest = sortResumeProjects(await getProjects({ refresh: true }));
      setProjects(latest); setError('');
      const { createResumePdf } = await import('../utils/resumePdf');
      createResumePdf(latest).save('Bilel-Helal-Resume.pdf');
      setNotice('Your latest resume is ready. Check your downloads.');
    } catch { setError('Could not download your latest resume. Please check your connection and try again.'); }
    finally { setExporting(false); }
  };
  return <Dialog label="Resume preview" onClose={onClose} className="cv-overlay">
    <div className="cv-workspace">
      <header className="cv-toolbar"><div className="cv-toolbar-title"><FileText size={19}/><div><strong>Resume studio</strong><span>A living record of my work</span></div></div><button className="cv-icon" aria-label="Close resume" onClick={onClose}><X size={20}/></button></header>
      <div className="cv-layout"><aside className="cv-sidebar"><span className="cv-kicker">THE PROFESSIONAL EDITION</span><h2>Built with care.<br/>Always current.</h2><p>Explore my experience, technical toolkit, and the projects behind the work.</p><div className="cv-sync"><Check size={16}/><div><strong>Connected to my portfolio</strong><span>New projects appear automatically.</span></div></div><dl><div><dt>Projects</dt><dd>{loading ? '—' : projects.length}</dd></div><div><dt>Format</dt><dd>A4 PDF</dd></div><div><dt>Content</dt><dd>Selectable text</dd></div></dl><button className="cv-download" disabled={loading || exporting} onClick={download}>{exporting ? <RefreshCw size={17} className="cv-spin"/> : <ArrowDownToLine size={17}/>} {exporting ? 'Preparing PDF…' : 'Download resume'}</button><span className="cv-caption">Includes every published project.<br/>Freshly generated with each download.</span>{notice && <p className="cv-notice" role="status">{notice}</p>}{error && <p className="cv-error" role="alert">{error}</p>}</aside>
      <div className="cv-preview"><article className="cv-paper"><header className="cv-identity"><span className="cv-kicker">DEVELOPER / CREATIVE PROBLEM SOLVER</span><h1>{resumeProfile.name}<span>.</span></h1><p>{resumeProfile.role}</p><a href={`mailto:${resumeProfile.email}`}>{resumeProfile.email}</a></header><section className="cv-section"><h3>01 / Profile</h3><p>{resumeProfile.summary}</p></section><section className="cv-section"><h3>02 / Experience</h3>{resumeProfile.experience.map(item => <div className="cv-experience" key={item.title}><div><h4>{item.title}</h4><span>{item.company}</span></div><time>{item.period}</time><p>{item.description}</p></div>)}</section><section className="cv-section"><h3>03 / Technical toolkit</h3><p className="cv-toolkit-intro">Technologies I work with</p><div className="cv-tags" aria-label="Technical skills">{resumeSkills(projects).map(skill => <span key={skill}>{skill}</span>)}</div></section><section className="cv-section"><h3>04 / Projects <span>{projects.length.toString().padStart(2, '0')}</span></h3>{loading ? <p role="status">Loading portfolio projects…</p> : projects.length ? projects.map(project => <div className="cv-project" key={project._id}><div><h4>{project.title}</h4><span>{project.category}{project.duration ? ` · ${project.duration}` : ''}</span></div><p>{project.description}</p>{project.features?.length > 0 && <ul>{project.features.slice(0, 3).map((feature, index) => <li key={index}>{feature}</li>)}</ul>}<div className="cv-project-bottom"><span>{(project.tags || []).join(' / ')}</span>{/^https?:\/\//i.test(project.link || '') && <a href={project.link} target="_blank" rel="noreferrer">View project <ArrowUpRight size={13}/></a>}</div></div>) : <p>{error ? 'Projects are currently unavailable.' : 'New portfolio projects will appear here as they are published.'}</p>}</section><footer className="cv-footer"><strong>BILEL / PORTFOLIO</strong><span>Available for freelance projects worldwide</span></footer></article></div></div>
    </div>
  </Dialog>;
}
export default function ResumeModal({ isOpen, onClose }) { return isOpen ? <ResumeContent onClose={onClose}/> : null; }
