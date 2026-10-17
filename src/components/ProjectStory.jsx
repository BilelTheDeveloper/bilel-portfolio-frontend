import { useState } from 'react';
import { ArrowUpRight, Play, Code2, ImageOff } from 'lucide-react';
import './ProjectStory.css';
const safeProjectUrl = value => { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : ''; } catch { return ''; } };
function StoryImage({ url, caption }) {
  const [failed, setFailed] = useState(false);
  return <figure className="story-figure">{failed ? <div className="story-image-fallback"><ImageOff size={24}/><span>Image unavailable</span></div> : <a href={url} target="_blank" rel="noreferrer" aria-label={`Open image: ${caption}`}><img src={url} alt={caption} loading="lazy" onError={()=>setFailed(true)}/></a>}<figcaption>{caption}</figcaption></figure>;
}
export default function ProjectStory({ project }) {
  const screenshots = (project.gallery || '').split('\n').filter(Boolean).slice(0,6).map(line => { const [url,...caption] = line.split('|'); return {url:safeProjectUrl(url.trim()),caption:caption.join('|').trim()}; }).filter(item=>item.url && item.caption);
  const sections = [['The context',project.longDescription],['Decisions & tradeoffs',project.decisions],['Outcomes & evidence',project.outcomes],['What I learned',project.lessons]].filter(([,text])=>text);
  const video = safeProjectUrl(project.walkthroughUrl);
  const demo = safeProjectUrl(project.demoUrl);
  const repository = safeProjectUrl(project.repositoryUrl);
  const design = safeProjectUrl(project.designImageUrl);
  return <div className="project-story">
    <nav className="story-navigation" aria-label="Case study sections">{sections.length > 0 && <a href="#project-story">The story</a>}{(video || demo) && <a href="#project-explore">Explore the product</a>}{(design || screenshots.length > 0) && <a href="#project-visuals">Visuals</a>}<a href="#project-conversation">Discuss your project <ArrowUpRight size={13}/></a></nav>
    {(project.projectType || project.role || project.duration || repository) && <dl className="story-facts">{[['Project type',project.projectType],['My contribution',project.role],['Timeframe',project.duration]].filter(([,value])=>value).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}{repository && <div><dt>Explore the code</dt><dd><a href={repository} target="_blank" rel="noreferrer"><Code2 size={15}/> Public repository <ArrowUpRight size={13}/></a></dd></div>}</dl>}
    {sections.length > 0 && <section id="project-story" className="story-grid">{sections.map(([title,text],index)=><article className="story-panel" key={title}><span className="story-eyebrow">0{index+1} / Behind the work</span><h2>{title}</h2><p>{text}</p></article>)}</section>}
    {(video || demo) && <section id="project-explore" className="story-explore">{video && <article className="story-panel"><span className="story-eyebrow">See the experience</span><h2>A product walkthrough</h2>{project.walkthroughNotes && <p>{project.walkthroughNotes}</p>}<a className="story-button" href={video} target="_blank" rel="noreferrer"><Play size={16}/> Watch the walkthrough <ArrowUpRight size={15}/></a></article>}{demo && <article className="story-panel"><span className="story-eyebrow">Try the experience</span><h2>Explore the demo</h2>{project.demoGuide && <ol className="story-demo-steps">{project.demoGuide.split('\n').map(step=>step.trim()).filter(Boolean).map((step,index)=><li key={index}>{step}</li>)}</ol>}<a className="story-button" href={demo} target="_blank" rel="noreferrer">Open the demo <ArrowUpRight size={15}/></a></article>}</section>}
    {(design || screenshots.length > 0) && <section id="project-visuals" className="story-visuals"><span className="story-eyebrow">From thinking to interface</span><h2>A closer look</h2><div className="story-gallery">{design && <StoryImage key={design} url={design} caption={project.designCaption || 'Project design and planning'}/ >}{screenshots.map((item,index)=><StoryImage key={`${item.url}-${index}`} {...item}/>)}</div></section>}
    {project.testimonialApproved && project.testimonialQuote && project.testimonialAuthor && <figure className="story-quote"><span className="story-eyebrow">The client’s perspective</span><blockquote>“{project.testimonialQuote}”</blockquote><figcaption>{project.testimonialAuthor}</figcaption></figure>}
  </div>;
}

