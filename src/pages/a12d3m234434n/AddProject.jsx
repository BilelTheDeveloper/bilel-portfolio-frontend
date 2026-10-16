import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import CONFIG from '../../api/config';
import { clearProjectsCache } from '../../api/projects';
const blank = { title: '', category: 'Web Development', description: '', link: '', tags: '', longDescription: '', features: '', challenges: '', solutions: '', duration: '', isFeatured: false };
const categories = ['Web Development', 'Meta Ads Case Study', 'UI/UX Design', 'Digital Marketing'];
export default function AddProject({ initialProject, onDone, onCancel, onDirtyChange }) {
  const [project, setProject] = useState(() => initialProject ? { ...blank, ...initialProject, tags: (initialProject.tags || []).join(', '), features: (initialProject.features || []).join('\n') } : blank);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);
  useEffect(() => {
    if (!dirty) return;
    const warn = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const update = (name, value) => { setDirty(true); setProject(old => ({ ...old, [name]: value })); };
  const cancel = () => onCancel?.();
  const submit = async event => {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError(''); setNotice('');
    const body = new FormData();
    Object.entries(blank).forEach(([name]) => body.append(name, name === 'features' ? JSON.stringify(project.features.split('\n').map(value => value.trim()).filter(Boolean)) : String(project[name] ?? '')));
    if (image) body.append('image', image);
    try {
      const url = CONFIG.ENDPOINTS.PROJECTS + (initialProject ? `/${initialProject._id}` : '');
      await axios({ method: initialProject ? 'put' : 'post', url, data: body });
      clearProjectsCache(); setDirty(false); setNotice('Saved. Your project is now updated on the public portfolio.');
      if (onDone) onDone();
    } catch (failure) { setError(failure.response?.data?.message || 'Could not save your project. Your changes are still here.'); }
    finally { setBusy(false); }
  };
  const field = (name, label, max, multiline = false, required = false) => <label className="studio-field">{label}{required && ' *'}{multiline ? <textarea rows={name === 'longDescription' ? 6 : 3} maxLength={max} value={project[name]} required={required} onChange={event => update(name, event.target.value)} /> : <input type={name === 'link' ? 'url' : 'text'} maxLength={max} value={project[name]} required={required} onChange={event => update(name, event.target.value)} />}<span>{project[name].length}/{max}</span></label>;
  return <div className="studio-editor"><form onSubmit={submit} className="space-y-6">
    <div className="studio-toolbar"><button type="button" onClick={cancel} disabled={busy} className="studio-button"><ArrowLeft size={16} />Projects</button><span className="studio-muted">{dirty ? 'Unsaved changes' : initialProject ? 'Editing published project' : 'New project'}</span><button disabled={busy} className="studio-button primary"><Save size={16} />{busy ? 'Saving…' : initialProject ? 'Save changes' : 'Publish project'}</button></div>
    {error && <p className="studio-error" role="alert">{error}</p>}{notice && <p className="studio-notice" role="status">{notice}</p>}
    <fieldset disabled={busy} className="studio-panel space-y-5"><legend>01 / Project essentials</legend>{field('title', 'Project title', 100, false, true)}<div className="studio-two"><label className="studio-field">Category<select value={project.category} onChange={event => update('category', event.target.value)}>{categories.map(value => <option key={value}>{value}</option>)}</select></label>{field('duration', 'Duration', 100)}</div>{field('description', 'Short description', 500, true, true)}{field('link', 'Live website URL', 2048, false, true)}{field('tags', 'Technologies, separated by commas', 500)}<label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={project.isFeatured} onChange={event => update('isFeatured', event.target.checked)} />Feature on the homepage</label></fieldset>
    <fieldset disabled={busy} className="studio-panel space-y-5"><legend>02 / Case study</legend>{field('longDescription', 'Overview', 10000, true)}{field('features', 'Key features, one per line (up to 30)', 4000, true)}{field('challenges', 'The challenge', 10000, true)}{field('solutions', 'Your solution', 10000, true)}</fieldset>
    <fieldset disabled={busy} className="studio-panel"><legend>03 / Cover image</legend><label className="studio-upload"><ImagePlus size={24} /><span>{image ? image.name : initialProject ? 'Replace cover image (optional)' : 'Choose a cover image *'}</span><small>JPG, PNG or WebP · up to 5 MB</small><input type="file" accept="image/jpeg,image/png,image/webp" required={!initialProject} onChange={event => { const file = event.target.files[0]; if (!file) return; if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('Choose a JPG, PNG or WebP image up to 5 MB.'); event.target.value = ''; return; } setImage(file); setDirty(true); setError(''); }} /></label></fieldset>
  </form><aside className="studio-preview"><p className="studio-eyebrow">Portfolio card preview</p><article className="studio-panel !p-0 overflow-hidden">{preview || initialProject?.image ? <img src={preview || initialProject.image} alt="Project cover preview" className="aspect-video w-full object-cover" /> : <div className="aspect-video grid place-items-center bg-slate-800 text-slate-400">Your cover image</div>}<div className="p-6"><p className="studio-eyebrow">{project.category}</p><h3 className="text-2xl font-semibold my-3">{project.title || 'Your next great project'}</h3><p className="studio-muted break-words">{project.description || 'Write a short summary of the project and its impact.'}</p><div className="flex flex-wrap gap-2 mt-5">{project.tags.split(',').filter(Boolean).slice(0, 6).map((tag, index) => <span key={index} className="studio-chip">{tag.trim()}</span>)}</div></div></article><p className="studio-muted mt-4 text-xs">Saving publishes changes immediately. Review your copy and cover before publishing.</p></aside></div>;
}
