import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import CONFIG from '../../api/config';
import { clearProjectsCache } from '../../api/projects';
import ProjectCard from '../../components/ProjectCard';
const blank = { title: '', category: 'Web Development', cardLabel: '', description: '', imageAlt: '', imagePosition: 'center', link: '', tags: '', longDescription: '', features: '', challenges: '', solutions: '', duration: '', isFeatured: false };
const categories = ['Web Development', 'Meta Ads Case Study', 'UI/UX Design', 'Digital Marketing'];
const list = (text, separator) => [...new Set(text.split(separator).map(value => value.trim()).filter(Boolean))];
export default function AddProject({ initialProject, onDone, onCancel, onDirtyChange }) {
  const [project, setProject] = useState(() => initialProject ? { ...blank, ...initialProject, tags: (initialProject.tags || []).join(', '), features: (initialProject.features || []).join('\n') } : {...blank});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const fileInput = useRef(null);
  const saving = useRef(false);
  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => {
    if (!image) { setPreview(''); return; }
    const url = URL.createObjectURL(image); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);
  useEffect(() => {
    if (!dirty) return;
    const warn = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const update = (name, value) => { setDirty(true); setProject(old => ({ ...old, [name]: value })); setErrors(old => ({...old, [name]: ''})); setNotice(''); };
  const showErrors = found => {
    setErrors(found); setError('Please correct the highlighted fields.');
    requestAnimationFrame(() => document.getElementById(`project-${Object.keys(found)[0]}`)?.focus());
  };
  const submit = async event => {
    event.preventDefault(); if (saving.current) return;
    const found = {};
    if (!project.title.trim()) found.title = 'Enter a project title.';
    if (!project.description.trim()) found.description = 'Describe what you built and who it helps.';
    const tags = list(project.tags, ',');
    const features = list(project.features, '\n');
    if (tags.length > 12 || tags.some(value => value.length > 30)) found.tags = 'Use up to 12 technologies, each at most 30 characters.';
    if (features.length > 30 || features.some(value => value.length > 200)) found.features = 'Use up to 30 features, each at most 200 characters.';
    if (!image && !initialProject) found.image = 'Choose a cover image.';
    if (project.link.trim()) { try { const url = new URL(project.link.trim()); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error(); } catch { found.link = 'Use a complete HTTP or HTTPS URL without credentials.'; } }
    if (Object.keys(found).length) { showErrors(found); return; }
    saving.current = true; setBusy(true); setProgress(0); setError(''); setErrors({}); setNotice('');
    const body = new FormData();
    Object.keys(blank).forEach(name => body.append(name, name === 'features' ? JSON.stringify(features) : name === 'tags' ? tags.join(', ') : String(project[name] ?? '').trim()));
    if (image) body.append('image', image);
    try {
      const url = CONFIG.ENDPOINTS.PROJECTS + (initialProject ? `/${initialProject._id}` : '');
      const response = await axios({ method: initialProject ? 'put' : 'post', url, data: body, onUploadProgress: event => { if (event.total) setProgress(Math.round(event.loaded * 100 / event.total)); } });
      if (!response.data.success || !response.data.data?._id) throw new Error('Unexpected save response');
      clearProjectsCache(); setDirty(false); onDirtyChange?.(false); setNotice('Saved. Your project is now published.');
      onDone?.(response.data.data);
    } catch (failure) {
      if (failure.response?.data?.errors) showErrors(failure.response.data.errors);
      else setError(failure.response?.data?.message || 'Could not confirm the save. Your changes are still here. Check the project library before retrying.');
    } finally { saving.current = false; setBusy(false); }
  };
  const field = (name, label, max, multiline = false, required = false, help = '') => {
    const props = { id: `project-${name}`, name, 'aria-label': label, maxLength: max, value: project[name] ?? '', required, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': `project-${name}-help`, onChange: event => update(name, event.target.value) };
    return <label className="studio-field" htmlFor={props.id}>{label}{required && ' *'}{multiline ? <textarea {...props} rows={name === 'longDescription' ? 6 : 3}/> : <input {...props} type={name === 'link' ? 'url' : 'text'}/>}<span id={`project-${name}-help`} className={errors[name] ? 'text-red-300' : ''}>{errors[name] || help} <span>{(project[name] || '').length}/{max}</span></span></label>;
  };
  const card = {...project, image: preview || initialProject?.image || '', tags: list(project.tags, ',')};
  return <div className="studio-editor"><form onSubmit={submit} className="space-y-6" aria-busy={busy}>
    <div className="studio-toolbar"><button type="button" onClick={onCancel} disabled={busy} className="studio-button"><ArrowLeft size={16}/>Projects</button><span className="studio-muted">{dirty ? 'Unsaved changes' : initialProject ? 'Editing published project' : 'New project'}</span><button disabled={busy} className="studio-button primary"><Save size={16}/>{busy ? progress < 100 ? `Uploading ${progress}%…` : 'Saving project…' : initialProject ? 'Save changes' : 'Publish project'}</button></div>
    {error && <p className="studio-error" role="alert">{error}</p>}{notice && <p className="studio-notice" role="status">{notice}</p>}
    <fieldset disabled={busy} className="studio-panel space-y-5"><legend>01 / Portfolio card</legend><p className="studio-muted text-sm">These fields appear on the homepage and project gallery. The preview uses the exact public card.</p>{field('title','Project title',100,false,true,'Aim for a short, recognizable name.')}
      <div className="studio-two"><label className="studio-field">Category<select id="project-category" value={project.category} onChange={event=>update('category',event.target.value)}>{categories.map(value=><option key={value}>{value}</option>)}</select><span>Used by gallery filters.</span></label>{field('cardLabel','Card label',40,false,false,'Optional, e.g. SaaS Booking. Defaults to the category.')}</div>
      {field('description','Card summary',500,true,true,'The card shows up to three lines; the full summary is available in the case study.')}
      {field('tags','Technologies, separated by commas',500,false,false,'Up to 12, at most 30 characters each. First three appear on the card.')}
      <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={project.isFeatured} onChange={event=>update('isFeatured',event.target.checked)}/>Prioritize in homepage selected projects</label><p className="studio-muted text-xs">The homepage shows up to three projects, with featured projects first and the newest next.</p>
    </fieldset>
    <fieldset disabled={busy} className="studio-panel space-y-5"><legend>02 / Cover image</legend><label className="studio-upload" htmlFor="project-image"><ImagePlus size={24}/><span>{image ? image.name : initialProject ? 'Replace cover image (optional)' : 'Choose a cover image *'}</span><small>JPG, PNG or WebP · up to 5 MB · landscape images work best</small><input ref={fileInput} id="project-image" type="file" accept="image/jpeg,image/png,image/webp" aria-invalid={Boolean(errors.image)} aria-describedby="project-image-error" onChange={event=>{ const file=event.target.files[0]; if(!file)return; if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){setErrors(old=>({...old,image:'Choose a JPG, PNG or WebP image up to 5 MB.'}));event.target.value='';return;} setImage(file);setDirty(true);setErrors(old=>({...old,image:''})); }}/></label>{errors.image && <p id="project-image-error" className="text-red-300 text-sm" role="alert">{errors.image}</p>}{image && <button className="studio-button" type="button" onClick={()=>{setImage(null);fileInput.current.value='';setDirty(true);}}>Undo selected image</button>}
      {field('imageAlt','Image description',160,false,false,'Describe the screenshot for people using screen readers. Defaults to the project name.')}
      <label className="studio-field">Image crop focus<select value={project.imagePosition} onChange={event=>update('imagePosition',event.target.value)}><option value="top">Top</option><option value="center">Center</option><option value="bottom">Bottom</option></select><span>Controls the visible portion of the cover in the public card.</span></label>
    </fieldset>
    <fieldset disabled={busy} className="studio-panel space-y-5"><legend>03 / Project details</legend><div className="studio-two">{field('link','Live website URL',2048,false,false,'Optional. Leave empty for private or unreleased projects.')}{field('duration','Duration',100)}</div>{field('longDescription','Overview',10000,true)}{field('features','Key features, one per line',6000,true,false,'Up to 30 features, at most 200 characters each.')}{field('challenges','The challenge',10000,true)}{field('solutions','Your solution',10000,true)}</fieldset>
    <button disabled={busy} className="studio-button primary"><Save size={16}/>{busy?'Saving…':initialProject?'Save changes':'Publish project'}</button>
  </form><aside className="studio-preview"><p className="studio-eyebrow">Live portfolio card preview</p><ProjectCard project={card} preview/><p className="studio-muted mt-4 text-xs">This is the same card used on the public site. Width changes with the visitor’s screen. Saving publishes immediately.</p>{project.link && <p className="studio-muted mt-3 text-xs break-words">Live website: {project.link}</p>}</aside></div>;
}
