import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Code2, Mail, Send, ShieldCheck, Sparkles, X } from 'lucide-react';
import axios from 'axios';
import Dialog from './Dialog';
import CONFIG from '../api/config';
import './ContactModal.css';
const initial = { name:'', email:'', company:'', subject:'', service:'Web application', budget:'Not sure yet', timeline:'Flexible', message:'' };
const services = ['Web application','Website redesign','UI/UX design','Backend & API','Something else'];
const budgets = ['Not sure yet','Under $1,000','$1,000–$3,000','$3,000–$5,000','$5,000+'];
const timelines = ['Flexible','As soon as possible','Within a month','1–3 months','3+ months'];
const steps = [ {label:'Your idea',title:'What would you like to build?',hint:'Start with the problem. We can work out the details together.'}, {label:'The plan',title:'What works for you?',hint:'A rough budget and timeline help me suggest practical options.'}, {label:'Your details',title:'Where can I reach you?',hint:'Review your brief and leave an email for my reply.'} ];
function validate(form, step) {
  const errors = {};
  if (step === 0) {
    if (!form.subject.trim()) errors.subject = 'Give your project a short title.';
    if (form.message.trim().length < 20) errors.message = 'Tell me a little more (at least 20 characters).';
  }
  if (step === 2) {
    if (!form.name.trim()) errors.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email so I can reply.';
  }
  return errors;
}
export default function ContactModal({isOpen,onClose,projectContext}) {
  const [form,setForm] = useState({...initial,subject:projectContext ? `Inspired by ${projectContext}`.slice(0,150) : ''});
  const [step,setStep] = useState(0);
  const [status,setStatus] = useState('idle');
  const [errors,setErrors] = useState({});
  const [error,setError] = useState('');
  const [reference,setReference] = useState('');
  const sending = useRef(false);
  const receipt = useRef({signature:'',key:''});
  const scrollArea = useRef(null);
  const update = (name,value) => { setForm(old=>({...old,[name]:value})); setErrors(old=>({...old,[name]:''})); };
  const go = next => {
    setStep(next);
    requestAnimationFrame(()=> { scrollArea.current?.scrollTo({top:0}); document.getElementById('inquiry-step-title')?.focus(); });
  };
  const showErrors = found => { setErrors(found); requestAnimationFrame(()=>document.getElementById(`inquiry-${Object.keys(found)[0]}`)?.focus()); };
  const close = () => { scrollArea.current?.scrollTo({top:0}); onClose(); if (status==='success') {setStatus('idle');setStep(0);} };
  const submit = async event => {
    event.preventDefault(); if (sending.current) return;
    if (step < 2) { const found=validate(form,step); if(Object.keys(found).length) {showErrors(found);return;} go(step+1); return; }
    const data = Object.fromEntries(Object.entries(form).map(([key,value])=>[key,value.trim()]));
    for (const index of [0,2]) { const found=validate(data,index); if(Object.keys(found).length) {go(index);showErrors(found);return;} }
    sending.current=true;setStatus('sending');setError('');setErrors({});
    try {
      const signature=JSON.stringify(data);
      if(receipt.current.signature!==signature) receipt.current={signature,key:crypto.randomUUID()};
      const response=await axios.post(`${CONFIG.API_URL}/messages`,data,{headers:{'Idempotency-Key':receipt.current.key}});
      if(!response.data.success) throw new Error('Unconfirmed inquiry');
      setReference(response.data.reference||'');setStatus('success');setForm({...initial});receipt.current={signature:'',key:''};
    } catch(failure) {
      const fieldErrors=failure.response?.data?.errors||{};
      setStatus('error');setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length) { go(Object.keys(fieldErrors).some(key=>['subject','service','message'].includes(key)) ? 0 : Object.keys(fieldErrors).some(key=>['budget','timeline','company'].includes(key)) ? 1 : 2); showErrors(fieldErrors); }
      setError(failure.response?.status===429?'Please wait a little before retrying. Your brief is still here.':failure.response?.data?.message||'I couldn’t confirm your inquiry. Your brief is still here. Retry safely, or email me directly.');
    } finally {sending.current=false;}
  };
  if(!isOpen) return null;
  const field=(name,label,max,type='text',required=false,placeholder='')=><div className="inquiry-field"><label htmlFor={`inquiry-${name}`}>{label}{!required&&<span>Optional</span>}</label><input id={`inquiry-${name}`} name={name} type={type} autoComplete={name==='name'?'name':name==='email'?'email':name==='company'?'organization':'off'} maxLength={max} value={form[name]} required={required} placeholder={placeholder} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name]?`inquiry-${name}-error`:undefined} onChange={event=>update(name,event.target.value)}/>{errors[name]&&<small role="alert" id={`inquiry-${name}-error`}>{errors[name]}</small>}</div>;
  const busy=status==='sending';
  return <Dialog label="Let's Talk — project inquiry" onClose={close} className="inquiry-overlay"><div className="inquiry-backdrop" onClick={close}/><div className={`inquiry-modal relative ${status==='success'?'inquiry-complete':''}`}>
    <button type="button" className="inquiry-close" aria-label="Close inquiry" onClick={close}><X size={19}/></button>
    {status==='success'?<div className="inquiry-success" role="status"><span className="inquiry-success-icon"><CheckCircle2 size={38}/></span><p className="inquiry-kicker">A great start</p><h2>Your idea is<br/><em>in my inbox.</em></h2><p>Your inquiry has been saved. I’ll review your needs and reply to the email you provided to discuss the next steps.</p>{reference&&<div className="inquiry-reference">Your reference <strong>{reference}</strong></div>}<button className="inquiry-submit" onClick={close}>Back to the portfolio <ArrowRight size={17}/></button></div>:<>
      <aside className="inquiry-story"><div className="inquiry-brand"><span>B.</span> Bilel / Let’s build</div><div><p className="inquiry-kicker"><Sparkles size={13}/> A conversation first</p><h2>Your next step<br/>starts with<br/><em>an idea.</em></h2><p>Tell me what you need. We’ll discuss practical options and agree on the scope before work begins.</p><div className="inquiry-promises"><span><Check size={15}/> Advice shaped around your budget</span><span><Check size={15}/> Clear scope before we begin</span><span><Check size={15}/> Updates throughout the project</span></div></div><a href="mailto:bilel.thedeveloper@gmail.com"><Mail size={16}/><span>Prefer email?<strong>bilel.thedeveloper@gmail.com</strong></span></a><Code2 className="inquiry-watermark" aria-hidden="true"/></aside>
      <div className="inquiry-content">
        <header className="inquiry-header"><p className="inquiry-kicker">Bilel / Let’s talk</p><h2>Good work starts<br className="inquiry-phone-break"/> with a <em>conversation.</em></h2><nav className="inquiry-stepper" aria-label="Inquiry progress">{steps.map((item,index)=><button key={item.label} type="button" disabled={busy||index>step} aria-current={index===step?'step':undefined} onClick={()=>go(index)}><span>{index<step?<Check size={12}/>:index+1}</span>{item.label}</button>)}</nav></header>
        <form onSubmit={submit} noValidate aria-busy={busy} className="inquiry-form">
          <div className="inquiry-scroll" ref={scrollArea}>
            {error&&<div className="inquiry-error" role="alert">{error} <a href="mailto:bilel.thedeveloper@gmail.com">Email Bilel</a></div>}
            <div className="inquiry-step-heading"><span>Step {step+1} of 3</span><h3 id="inquiry-step-title" tabIndex={-1}>{steps[step].title}</h3><p>{steps[step].hint}</p></div>
            <fieldset disabled={busy}>
              {step===0&&<><div className="inquiry-field"><label id="inquiry-service-label">What can I help with?</label><div id="inquiry-service" tabIndex={-1} className="inquiry-services" role="group" aria-labelledby="inquiry-service-label">{services.map(service=><button key={service} type="button" aria-pressed={form.service===service} onClick={()=>update('service',service)}>{service}</button>)}</div>{errors.service&&<small role="alert">{errors.service}</small>}</div>{field('subject','Project title',150,'text',true,'A better booking experience')}<div className="inquiry-field"><label htmlFor="inquiry-message">Tell me about your idea<span>{form.message.length}/5000</span></label><textarea id="inquiry-message" name="message" rows={4} maxLength={5000} required value={form.message} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message?'inquiry-message-error':'inquiry-message-hint'} onChange={event=>update('message',event.target.value)} placeholder="What problem do you want to solve? Who is it for?"/>{errors.message?<small role="alert" id="inquiry-message-error">{errors.message}</small>:<p id="inquiry-message-hint" className="inquiry-hint">A rough idea is enough. No technical specification needed.</p>}</div></>}
              {step===1&&<><div className="inquiry-field"><label id="inquiry-budget-label">Estimated budget</label><div className="inquiry-budget-options" role="group" aria-labelledby="inquiry-budget-label">{budgets.map(budget=><button type="button" key={budget} id={budget===budgets[0]?'inquiry-budget':undefined} aria-pressed={form.budget===budget} onClick={()=>update('budget',budget)}>{budget}</button>)}</div><p className="inquiry-hint">Not sure yet? We can explore what is realistic together.</p>{errors.budget&&<small role="alert">{errors.budget}</small>}</div><div className="inquiry-field"><label htmlFor="inquiry-timeline">Ideal timeline</label><select id="inquiry-timeline" value={form.timeline} onChange={event=>update('timeline',event.target.value)}>{timelines.map(option=><option key={option}>{option}</option>)}</select>{errors.timeline&&<small role="alert">{errors.timeline}</small>}</div>{field('company','Company / organization',120,'text',false,'Your business or personal project')}</>}
              {step===2&&<>{field('name','Your name',100,'text',true,'Your name')}{field('email','Email address',254,'email',true,'you@example.com')}<details className="inquiry-review"><summary><span>Review your brief<strong>{form.subject}</strong></span><span aria-hidden="true">+</span></summary><dl><div><dt>Service</dt><dd>{form.service}</dd></div><div><dt>Budget</dt><dd>{form.budget}</dd></div><div><dt>Timeline</dt><dd>{form.timeline}</dd></div>{form.company&&<div><dt>Company</dt><dd>{form.company}</dd></div>}</dl><p>{form.message}</p><button type="button" onClick={()=>go(0)}>Edit project details <ArrowRight size={13}/></button></details><div className="inquiry-next"><CheckCircle2 size={17}/><p><strong>What happens next?</strong>I’ll review your brief and reply by email. We can then arrange a short meeting to discuss your needs.</p></div></>}
            </fieldset>
          </div>
          <footer className="inquiry-form-footer"><div className="inquiry-actions">{step>0&&<button type="button" className="inquiry-back" disabled={busy} onClick={()=>go(step-1)}><ArrowLeft size={16}/><span>Back</span></button>}<button type="submit" className="inquiry-submit" disabled={busy}>{busy?<>Sending your brief…<span className="inquiry-spinner"/></>:step<2?<>Continue <ArrowRight size={17}/></>:<>{status==='error'?'Retry inquiry':'Send my inquiry'}<Send size={17}/></>}</button></div><p className="inquiry-privacy"><ShieldCheck size={13}/>{step===2?'Your details are used to respond to this inquiry.':'Nothing is sent until you submit your inquiry.'}</p></footer>
        </form>
        <a className="inquiry-mobile-email" href="mailto:bilel.thedeveloper@gmail.com"><Mail size={13}/> Prefer email? Write to me directly</a>
      </div>
    </>}
  </div></Dialog>;
}
