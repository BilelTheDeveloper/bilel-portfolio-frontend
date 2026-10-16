import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, Save, RefreshCw } from 'lucide-react';
import CONFIG from '../../api/config';
const labels = {github:'GitHub',linkedin:'LinkedIn',instagram:'Instagram',email:'Email'};
const placeholders = {github:'https://github.com/yourusername',linkedin:'https://www.linkedin.com/in/yourusername/',instagram:'https://www.instagram.com/yourusername/',email:'you@example.com'};
export default function AdminSocialLinks({onDirtyChange}){
  const [links,setLinks]=useState(null);
  const [original,setOriginal]=useState('');
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [errors,setErrors]=useState({});
  const [notice,setNotice]=useState('');
  const dirty=links&&JSON.stringify(links)!==original;
  useEffect(()=>{onDirtyChange?.(Boolean(dirty));},[dirty,onDirtyChange]);
  const load=useCallback(async()=>{setLoading(true);setError('');try{const response=await axios.get(`${CONFIG.API_URL}/social-links`);setLinks(response.data.data);setOriginal(JSON.stringify(response.data.data));}catch{setError('Could not load social links. Please try again.');}finally{setLoading(false);}},[]);
  useEffect(()=>{void load();},[load]);
  useEffect(()=>{if(!dirty)return;const warn=event=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  const submit=async event=>{event.preventDefault();if(busy)return;setBusy(true);setError('');setErrors({});setNotice('');try{const response=await axios.patch(`${CONFIG.API_URL}/social-links`,links);setLinks(response.data.data);setOriginal(JSON.stringify(response.data.data));setNotice('Saved. Your hero icons now use these links.');}catch(failure){setError(failure.response?.data?.message||'Could not save. Your edits are still here.');setErrors(failure.response?.data?.errors||{});}finally{setBusy(false);}};
  if(loading)return <p className="studio-panel studio-muted" role="status">Loading social links…</p>;
  if(!links)return <div className="studio-panel"><p role="alert" className="studio-error">{error}</p><button className="studio-button mt-4" onClick={load}><RefreshCw size={16}/>Try again</button></div>;
  return <form onSubmit={submit} className="space-y-6 max-w-3xl"><div className="studio-panel"><h2 className="text-xl font-semibold">Your profiles, one place.</h2><p className="studio-muted text-sm mt-3">Manage the four social icons below your homepage introduction. Paste full profile links. Leave a field empty to show its icon as coming soon.</p></div>{error&&<p role="alert" className="studio-error">{error}</p>}{notice&&<p role="status" className="studio-notice">{notice}</p>}<fieldset disabled={busy} className="studio-panel space-y-6">{Object.keys(labels).map(field=><div className="studio-field" key={field}><label htmlFor={'social-'+field}>{labels[field]}</label><div className="flex gap-3 items-center"><input id={'social-'+field} type={field==='email'?'email':'url'} maxLength={field==='email'?254:500} value={links[field]} placeholder={placeholders[field]} aria-invalid={Boolean(errors[field])} aria-describedby={errors[field]?'social-error-'+field:undefined} onChange={e=>{setLinks(old=>({...old,[field]:e.target.value}));setErrors(old=>({...old,[field]:''}));setNotice('');}}/>{links[field]&&!errors[field]&&<a className="studio-button shrink-0" aria-label={`Open ${labels[field]} link`} href={field==='email'?`mailto:${links[field]}`:/^https:\/\//.test(links[field])?links[field]:undefined} target="_blank" rel="noopener noreferrer"><ExternalLink size={16}/></a>}</div>{errors[field]&&<small id={'social-error-'+field} className="text-red-300">{errors[field]}</small>}</div>)}</fieldset><div className="flex items-center gap-4 flex-wrap"><button disabled={busy||!dirty} className="studio-button primary"><Save size={16}/>{busy?'Saving…':'Save social links'}</button><span className="studio-muted text-xs">{dirty?'Unsaved changes':'All changes saved'}</span><a href="/" target="_blank" rel="noreferrer" className="studio-button">View homepage<ExternalLink size={14}/></a></div></form>;
}
