import { useRef, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Code2, Mail, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import axios from 'axios';
import Dialog from './Dialog';
import CONFIG from '../api/config';
import './ContactModal.css';
const initial = { name:'', email:'', company:'', subject:'', service:'Web application', budget:'Not sure yet', timeline:'Flexible', message:'' };
const services = ['Web application','Website redesign','UI/UX design','Backend & API','Something else'];
const budgets = ['Not sure yet','Under $1,000','$1,000–$3,000','$3,000–$5,000','$5,000+'];
const timelines = ['Flexible','As soon as possible','Within a month','1–3 months','3+ months'];
export default function ContactModal({isOpen,onClose,projectContext}) {
  const [form,setForm]=useState({...initial, subject: projectContext ? `Inspired by ${projectContext}`.slice(0,150) : ''});
  const [status,setStatus]=useState('idle');
  const [errors,setErrors]=useState({});
  const [error,setError]=useState('');
  const [reference,setReference]=useState('');
  const sending=useRef(false);
  const receipt=useRef({signature:'',key:''});
  const update=(name,value)=>{setForm(old=>({...old,[name]:value}));setErrors(old=>({...old,[name]:''}));};
  const close=()=>{onClose();if(status==='success')setStatus('idle');};
  const submit=async event=>{
    event.preventDefault();if(sending.current)return;
    const data=Object.fromEntries(Object.entries(form).map(([key,value])=>[key,value.trim()]));
    const found={};
    if(!data.name)found.name='Please enter your name.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))found.email='Enter a valid email so I can reply.';
    if(!data.subject)found.subject='Give your project a short title.';
    if(data.message.length<20)found.message='Add a little more detail (at least 20 characters).';
    if(Object.keys(found).length){setErrors(found);requestAnimationFrame(()=>document.getElementById('inquiry-'+Object.keys(found)[0])?.focus());return;}
    sending.current=true;setStatus('sending');setError('');setErrors({});
    try {
      const signature=JSON.stringify(data);
      if(receipt.current.signature!==signature)receipt.current={signature,key:crypto.randomUUID()};
      const response=await axios.post(`${CONFIG.API_URL}/messages`,data,{headers:{'Idempotency-Key':receipt.current.key}});
      if(!response.data.success)throw new Error('Unconfirmed inquiry');
      setReference(response.data.reference||'');setStatus('success');setForm({...initial});receipt.current={signature:'',key:''};
    } catch(failure){setStatus('error');setErrors(failure.response?.data?.errors||{});setError(failure.response?.status===429?'A few inquiries were sent recently. Please wait a little before retrying.':failure.response?.data?.message||'I couldn’t confirm your inquiry. Your brief is still here. Retry safely, or email me directly.');}
    finally{sending.current=false;}
  };
  if(!isOpen)return null;
  const field=(name,label,max,type='text',required=false,placeholder='')=><div className="inquiry-field"><label htmlFor={'inquiry-'+name}>{label}{!required&&<span>Optional</span>}</label><input id={'inquiry-'+name} name={name} type={type} autoComplete={name==='name'?'name':name==='email'?'email':name==='company'?'organization':'off'} maxLength={max} value={form[name]} required={required} placeholder={placeholder} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name]?'inquiry-'+name+'-error':undefined} onChange={e=>update(name,e.target.value)}/>{errors[name]&&<small id={'inquiry-'+name+'-error'}>{errors[name]}</small>}</div>;
  return <Dialog label="Let's Talk — project inquiry" onClose={close} className="inquiry-overlay"><div className="inquiry-backdrop" onClick={close}/><div className="inquiry-modal relative"><button type="button" className="inquiry-close" aria-label="Close inquiry" onClick={close}><X size={19}/></button>{status==='success'?<div className="inquiry-success" role="status"><span className="inquiry-success-icon"><CheckCircle2 size={38}/></span><p className="inquiry-kicker">A great start</p><h2>Your idea is<br/><em>in my inbox.</em></h2><p>Thanks for sharing your project. Your inquiry has been saved, and I’ll review the details and reply to the email you provided.</p>{reference&&<div className="inquiry-reference">Your reference <strong>{reference}</strong></div>}<button className="inquiry-submit" onClick={close}>Back to the portfolio <ArrowRight size={17}/></button></div>:<><aside className="inquiry-story"><div className="inquiry-brand"><span>B.</span> Bilel / Let's build</div><div><p className="inquiry-kicker"><Sparkles size={13}/> From idea to impact</p><h2>Great products<br/>start with a<br/><em>conversation.</em></h2><p>Tell me about your goals and budget. We’ll start with a short meeting, explore practical options, and agree on the scope before work begins.</p><div className="inquiry-promises"><span><Check size={15}/> A thoughtful, personal reply</span><span><Check size={15}/> Clear next steps for your project</span><span><Check size={15}/> Practical advice for your budget</span></div></div><a href="mailto:bilel.thedeveloper@gmail.com"><Mail size={16}/><span>Prefer email?<strong>bilel.thedeveloper@gmail.com</strong></span></a><Code2 className="inquiry-watermark" aria-hidden="true"/></aside><div className="inquiry-content"><div className="inquiry-heading"><p className="inquiry-kicker">New project inquiry</p><h2>Let's <em>Talk.</em></h2><p>Share your idea. We’ll talk through your needs and the next steps.</p></div>{error&&<div className="inquiry-error" role="alert">{error} <a href="mailto:bilel.thedeveloper@gmail.com">Email Bilel</a></div>}<form onSubmit={submit} noValidate aria-busy={status==='sending'}><fieldset disabled={status==='sending'}><div className="inquiry-two">{field('name','Your name',100,'text',true,'Alex Morgan')}{field('email','Email address',254,'email',true,'alex@company.com')}</div>{field('company','Company / organization',120,'text',false,'Your company or personal project')}<div className="inquiry-field"><label id="inquiry-service-label">What can I help you build?</label><div className="inquiry-services" role="group" aria-labelledby="inquiry-service-label">{services.map(service=><button key={service} type="button" aria-pressed={form.service===service} onClick={()=>update('service',service)}>{service}</button>)}</div></div>{field('subject','Project title',150,'text',true,'A booking platform for my business')}<div className="inquiry-two">{[['budget','Estimated budget',budgets],['timeline','Ideal timeline',timelines]].map(([name,label,options])=><div className="inquiry-field" key={name}><label htmlFor={'inquiry-'+name}>{label}</label><select id={'inquiry-'+name} value={form[name]} onChange={e=>update(name,e.target.value)}>{options.map(option=><option key={option}>{option}</option>)}</select>{errors[name]&&<small>{errors[name]}</small>}</div>)}</div><div className="inquiry-field"><label htmlFor="inquiry-message">The project brief<span>{form.message.length}/5000</span></label><textarea id="inquiry-message" name="message" rows={4} maxLength={5000} value={form.message} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message?'inquiry-message-error':'inquiry-message-hint'} onChange={e=>update('message',e.target.value)} placeholder="What are you building, who is it for, and what would success look like?"/>{errors.message?<small id="inquiry-message-error">{errors.message}</small>:<p id="inquiry-message-hint" className="inquiry-hint">What is difficult today? Who will use it? Include your priorities and any budget or timing constraints.</p>}</div><button type="submit" className="inquiry-submit">{status==='sending'?<>Sending your brief…<span className="inquiry-spinner"/></>:<>{status==='error'?'Retry inquiry':'Send project inquiry'}<Send size={17}/></>}</button></fieldset><p className="inquiry-privacy"><ShieldCheck size={14}/> Your details are used to review and respond to your inquiry.</p></form></div></>}</div></Dialog>;
}
