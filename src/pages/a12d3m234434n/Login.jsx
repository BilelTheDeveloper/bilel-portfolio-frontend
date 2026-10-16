import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CheckCheck, Copy, Download, Eye, EyeOff, Fingerprint, KeyRound, LoaderCircle, LockKeyhole, ShieldCheck, Smartphone } from 'lucide-react';
import axios from 'axios';
import CONFIG, { clearAdminCsrf } from '../../api/config';
import './admin-auth.css';

export default function Login() {
  const [stage, setStage] = useState('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [setup, setSetup] = useState(null);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const heading = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${CONFIG.API_URL}/auth/status`, { signal: controller.signal }).then(() => navigate('/admin/dashboard', { replace: true })).catch(() => {});
    return () => controller.abort();
  }, [navigate]);
  useEffect(() => { heading.current?.focus(); }, [stage]);
  useEffect(() => {
    if (!expiresAt || stage === 'backup' || stage === 'credentials') return;
    const timer = setTimeout(() => { setStage('credentials'); setSetup(null); setCode(''); clearAdminCsrf(); setError('Your sign-in request expired. Enter your email and password again.'); }, Math.max(0, expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [expiresAt, stage]);
  const startOver = () => { clearAdminCsrf(); setStage('credentials'); setSetup(null); setCode(''); setError(''); setNotice(''); setRecoveryMode(false); };
  const loadSetup = async () => {
    const response = await axios.get(`${CONFIG.API_URL}/auth/setup`);
    setSetup(response.data);
  };
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      if (stage === 'credentials') {
        const { data } = await axios.post(`${CONFIG.API_URL}/auth/login`, { email, password });
        setPassword(''); setCode(''); setExpiresAt(Date.now() + data.expiresIn * 1000);
        setStage(data.next);
        if (data.next === 'enroll') await loadSetup();
      } else {
        const { data } = await axios.post(`${CONFIG.API_URL}/auth/verify`, { code });
        setSetup(null); setCode('');
        if (data.recoveryCodes) { setRecoveryCodes(data.recoveryCodes); setStage('backup'); }
        else navigate('/admin/dashboard', { replace: true, state: { recoveryUsed: data.recoveryUsed } });
      }
    } catch (failure) {
      setError(failure.response?.data?.message || 'Unable to reach the server. Please try again.');
      setCode('');
    } finally { setBusy(false); }
  };
  const copy = async value => {
    try { await navigator.clipboard.writeText(value); setNotice('Copied. Store it somewhere private.'); }
    catch { setNotice('Copy is unavailable. Select and save the text manually.'); }
  };
  const download = () => {
    const blob = new Blob([`Bilel Admin recovery codes\nAccount: ${email}\nEach code works once. Keep these private.\n\n${recoveryCodes.join('\n')}\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'bilel-admin-recovery-codes.txt'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const title = stage === 'credentials' ? 'Welcome back.' : stage === 'enroll' ? 'Connect your authenticator.' : stage === 'backup' ? 'Keep a way back in.' : recoveryMode ? 'Use a recovery code.' : 'One more check.';
  const description = stage === 'credentials' ? 'Sign in to your private workspace. Only approved accounts can continue.' : stage === 'enroll' ? 'Add this account to Google Authenticator, then enter its six-digit code.' : stage === 'backup' ? 'Save these one-use recovery codes before continuing. They are shown only now.' : recoveryMode ? 'Enter one of the recovery codes you saved during setup.' : 'Enter the six-digit code from Google Authenticator. No email required.';
  return <main className="admin-auth">
    <aside className="auth-story" aria-label="Workspace introduction">
      <Link to="/" className="auth-brand"><span>B.</span> bilel<span className="auth-brand-muted"> / workspace</span></Link>
      <div className="auth-story-body"><div className="auth-eyebrow"><span /> PRIVATE BY DESIGN</div><h1>Your work.<br />Your space.<br /><em>Your control.</em></h1><p>A focused home for your projects, conversations, and the next thing you build.</p>
        <div className="auth-orbit" aria-hidden="true"><div className="auth-orbit-ring" /><div className="auth-orbit-ring inner" /><div className="auth-orbit-core"><Fingerprint size={64} strokeWidth={1} /></div><span className="auth-orbit-tag"><ShieldCheck size={15} /> Two-step verification</span></div>
      </div><div className="auth-story-foot"><LockKeyhole size={14} /> Approved accounts. Verified access.</div>
    </aside>
    <section className="auth-panel"><div className="auth-topline"><Link to="/"><ArrowLeft size={15} /> Back to portfolio</Link><span><span /> ADMIN ACCESS</span></div>
      <div className={`auth-card ${stage === 'backup' ? 'auth-card-wide' : ''}`}>
        <div className="auth-stepper" aria-label="Sign-in progress">{['Account', 'Authenticator', 'Workspace'].map((item, index) => <span key={item} className={index <= (stage === 'credentials' ? 0 : stage === 'backup' ? 2 : 1) ? 'complete' : ''}><b>{index < (stage === 'credentials' ? 0 : stage === 'backup' ? 2 : 1) ? <Check size={11} /> : `0${index + 1}`}</b>{item}</span>)}</div>
        <div className="auth-icon">{stage === 'credentials' ? <KeyRound /> : stage === 'backup' ? <ShieldCheck /> : <Smartphone />}</div>
        <h2 ref={heading} tabIndex={-1}>{title}</h2><p className="auth-description">{description}</p>
        {stage !== 'backup' ? <form onSubmit={submit} className="auth-form" aria-busy={busy}>
          {stage === 'credentials' ? <><label htmlFor="admin-email">Email address</label><input id="admin-email" name="email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} maxLength={254} required disabled={busy} />
            <label htmlFor="admin-password">Password</label><div className="auth-password"><input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={event => setPassword(event.target.value)} maxLength={72} required disabled={busy} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          </> : <>
            {stage === 'enroll' && (setup ? <div className="auth-enrollment"><div className="auth-qr"><img src={setup.qrCode} alt="Scan with Google Authenticator to add your admin account" width="208" height="208" /></div><p>Google Authenticator → <strong>+</strong> → <strong>Scan a QR code</strong></p><details><summary>Can’t scan? Enter a setup key</summary><code>{setup.secret}</code><button type="button" className="auth-text-button" onClick={() => copy(setup.secret)}><Copy size={14} /> Copy setup key</button><p>Choose a time-based key and name it Bilel Admin.</p></details></div> : <div className="auth-loading" role="status"><LoaderCircle className="auth-spin" /> Preparing your setup…<button type="button" className="auth-text-button" onClick={() => loadSetup().catch(() => setError('Setup could not be loaded. Start again.'))}>Retry setup</button></div>)}
            <label htmlFor="admin-code">{recoveryMode ? 'Recovery code' : 'Authenticator code'}</label><input id="admin-code" className={recoveryMode ? 'auth-recovery-input' : 'auth-code-input'} name="code" type="text" inputMode={recoveryMode ? 'text' : 'numeric'} autoComplete="one-time-code" placeholder={recoveryMode ? 'XXXXX-XXXXX-XXXXX-XXXXX' : '000000'} pattern={recoveryMode ? undefined : '[0-9]{6}'} minLength={recoveryMode ? 20 : 6} maxLength={recoveryMode ? 30 : 6} value={code} onChange={event => setCode(recoveryMode ? event.target.value.toUpperCase() : event.target.value.replace(/\D/g, ''))} required disabled={busy || (stage === 'enroll' && !setup)} aria-describedby="code-help" /><p id="code-help" className="auth-hint">{recoveryMode ? 'A recovery code can be used only once.' : 'Codes change every 30 seconds. Keep your phone’s time automatic.'}</p>
          </>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-primary" disabled={busy || (stage === 'enroll' && !setup)}>{busy ? <><LoaderCircle size={17} className="auth-spin" /> Verifying…</> : <>{stage === 'credentials' ? 'Continue securely' : stage === 'enroll' ? 'Verify & finish setup' : 'Verify & sign in'}<ArrowRight size={17} /></>}</button>
          {stage === 'verify' && <button className="auth-text-button auth-center" type="button" onClick={() => { setRecoveryMode(!recoveryMode); setCode(''); setError(''); }}>{recoveryMode ? 'Use Google Authenticator instead' : 'Lost your phone? Use a recovery code'}</button>}
          {stage !== 'credentials' && <button type="button" className="auth-text-button auth-center" onClick={startOver}><ArrowLeft size={14} /> Use a different account</button>}
        </form> : <div className="auth-backups"><div className="auth-backup-grid">{recoveryCodes.map(value => <code key={value}>{value}</code>)}</div><div className="auth-backup-actions"><button onClick={() => copy(recoveryCodes.join('\n'))}><Copy size={15} /> Copy codes</button><button onClick={download}><Download size={15} /> Download</button></div><label className="auth-saved"><input type="checkbox" checked={saved} onChange={event => setSaved(event.target.checked)} /> I saved my recovery codes somewhere private.</label><button className="auth-primary" disabled={!saved} onClick={() => { setRecoveryCodes([]); navigate('/admin/dashboard', { replace: true }); }}>Open workspace <ArrowRight size={17} /></button></div>}
        {notice && <p role="status" className="auth-notice"><CheckCheck size={15} />{notice}</p>}
        <div className="auth-card-foot"><ShieldCheck size={14} /><span>Protected with password + authenticator verification</span></div>
      </div><footer className="auth-footer">© {new Date().getFullYear()} Bilel <span>Private workspace</span></footer>
    </section>
  </main>;
}
