import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Image } from 'lucide-react';
import './ProjectCard.css';

/** The same card is rendered in the homepage, gallery and admin preview. */
export default function ProjectCard({ project, preview = false }) {
  const [failedSource, setFailedSource] = useState('');
  const hasImage = project.image && failedSource !== project.image;
  const content = <>
    <div className="project-card-art" style={{ '--cover-position': project.imagePosition || 'center' }}>
      {hasImage ? <img src={project.image} alt={project.imageAlt || `${project.title || 'Project'} preview`} loading={preview ? 'eager' : 'lazy'} onError={() => setFailedSource(project.image)}/> : <div className="project-card-placeholder"><Image size={36}/><span>{preview ? 'Choose a cover image' : 'Project preview'}</span></div>}
    </div>
    <div className="project-card-copy"><span className="project-card-label">{project.cardLabel || project.category || 'Web application'}</span><h3>{project.title || 'Your project title'}</h3><p>{project.description || 'A concise summary of what you built and who it helps.'}</p></div>
    <div className="project-card-bottom"><div className="project-card-tags">{(project.tags || []).slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div><span className="project-card-arrow" aria-hidden="true"><ArrowUpRight size={21}/></span></div>
  </>;
  return preview ? <article className="project-card" aria-label="Portfolio card preview">{content}</article> : <Link className="project-card" to={`/project/${project._id}`} aria-label={`View ${project.title} case study`}>{content}</Link>;
}
