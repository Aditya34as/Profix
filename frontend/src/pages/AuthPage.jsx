import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import gsap from 'gsap';
import {
  User, Mail, Lock, Phone, Store, Search, ArrowRight,
  Wrench, MapPin, Eye, EyeOff,
  Wind, Droplet, Thermometer, Sparkles, CheckCircle,
  LocateFixed, Loader
} from 'lucide-react';

/* ─── Shared input components — OUTSIDE to prevent focus loss ─── */
const AuthInput = ({ icon: Icon, label, ...props }) => (
  <div style={s.fieldWrap}>
    {label && <label style={s.label}>{Icon && <Icon size={15} />} {label}</label>}
    <div style={s.inputWrap}>
      <input className="form-input-auth" style={s.input} {...props} />
    </div>
  </div>
);

const AuthPasswordInput = ({ label, value, onChange, placeholder, showPwd, onToggle }) => (
  <div style={s.fieldWrap}>
    <label style={s.label}><Lock size={15} /> {label}</label>
    <div style={{ ...s.inputWrap, position: 'relative' }}>
      <input
        className="form-input-auth"
        type={showPwd ? 'text' : 'password'}
        style={s.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <button type="button" onClick={onToggle} style={s.eyeBtn} tabIndex={-1}>
        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

/* ─── constants ─── */
const SERVICE_OPTIONS = [
  { value: 'ac-repair', label: 'AC Repair', icon: Wind },
  { value: 'plumbing', label: 'Plumbing', icon: Droplet },
  { value: 'water-heater', label: 'Geyser/Heater', icon: Thermometer },
  { value: 'cleaning', label: 'Cleaning', icon: Sparkles },
];

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
const AuthPage = () => {
  const navigate = useNavigate();
  const { loginUser, registerUser, login, register, isAuthenticated, isShopOwner, isCustomer, isAdmin } = useAuth();
  const formRef = useRef(null);

  const [mode, setMode] = useState('signin');
  const [role, setRole] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [custForm, setCustForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [bizForm, setBizForm] = useState({
    businessName: '', ownerName: '', email: '', password: '', confirm: '',
    phone: '', whatsappNumber: '', services: [], description: '',
    address: { street: '', city: '', state: '', pincode: '' },
    latitude: '', longitude: '',
  });
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('');
  const [signInForm, setSignInForm] = useState({ email: '', password: '', role: 'customer' });

  /* ─── GSAP Entrance + ambient motion ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.auth-brand-photo',
        { scale: 1.14, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.35, ease: 'power3.out' }
      );
      gsap.to('.auth-brand-photo', {
        scale: 1.045,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.2,
      });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.auth-brand-mark', { opacity: 0, y: -18, scale: 0.92, duration: 0.55 }, 0.2)
        .fromTo(
          '.auth-brand-headline',
          { y: 36, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.82, ease: 'power3.out' },
          '-=0.12'
        )
        .from('.auth-brand-sub', { y: 22, opacity: 0, duration: 0.62 }, '-=0.38')
        .from('.auth-brand-metric-part', { y: 14, opacity: 0, duration: 0.38, stagger: 0.085 }, '-=0.28');

      // Animated counters (subtle, production-style)
      const animateCounter = (selector, target, options = {}) => {
        const el = document.querySelector(selector);
        if (!el) return;
        const cfg = {
          duration: options.duration ?? 1.8,
          delay: options.delay ?? 0.55,
          decimals: options.decimals ?? 0,
          prefix: options.prefix ?? '',
          suffix: options.suffix ?? '',
          format: options.format ?? ((v) => v),
        };
        gsap.fromTo(
          { val: 0 },
          { val: target },
          {
            duration: cfg.duration,
            delay: cfg.delay,
            ease: 'power2.out',
            onUpdate() {
              const v = this.targets()[0].val;
              const n = cfg.decimals ? Number(v).toFixed(cfg.decimals) : String(Math.round(v));
              el.textContent = `${cfg.prefix}${cfg.format(n)}${cfg.suffix}`;
            }
          }
        );
      };

      animateCounter('.auth-metric-counter-1', 500, { suffix: '+', format: (n) => Number(n).toLocaleString() });
      animateCounter('.auth-metric-counter-2', 10000, { suffix: '+', format: (n) => Number(n).toLocaleString() });
      animateCounter('.auth-metric-counter-3', 4.8, { decimals: 1 });

      // Gentle looping accent on metrics row (keeps page feeling "alive")
      gsap.to('.auth-brand-metrics', {
        opacity: 0.85,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.6,
      });

      // Keep motion minimal: entrance + counters only

      gsap.from('.auth-form-card', {
        y: 32, opacity: 0, duration: 0.9, delay: 0.08, ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) navigate('/admin', { replace: true });
      else if (isShopOwner) navigate('/dashboard', { replace: true });
      else if (isCustomer) navigate('/find-services', { replace: true });
    }
  }, [isAuthenticated, isShopOwner, isCustomer, isAdmin, navigate]);

  /* ─── Animate form transitions ─── */
  const animateFormChange = useCallback((callback) => {
    const card = document.querySelector('.auth-form-inner');
    if (card) {
      gsap.to(card, {
        opacity: 0, y: 15, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
          callback();
          gsap.fromTo(card, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
        }
      });
    } else {
      callback();
    }
  }, []);

  /* ─── handlers ─── */
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!signInForm.email || !signInForm.password) { toast.error('Please enter email and password'); return; }
    setSubmitting(true);
    try {
      const result = signInForm.role === 'business'
        ? await login(signInForm.email, signInForm.password)
        : await loginUser(signInForm.email, signInForm.password);
      if (result.success) toast.success('Welcome back!');
      else toast.error(result.error || 'Login failed');
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const handleCustomerSignup = async (e) => {
    e.preventDefault();
    if (!custForm.name || !custForm.email || !custForm.password) { toast.error('Name, email, and password are required'); return; }
    if (custForm.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (custForm.password !== custForm.confirm) { toast.error('Passwords do not match'); return; }
    setSubmitting(true);
    try {
      const result = await registerUser({ name: custForm.name, email: custForm.email, phone: custForm.phone, password: custForm.password });
      if (result.success) toast.success('Account created! 🎉');
      else toast.error(result.error || 'Registration failed');
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const toggleBizService = (svc) => {
    setBizForm(prev => ({ ...prev, services: prev.services.includes(svc) ? prev.services.filter(v => v !== svc) : [...prev.services, svc] }));
  };

  const handleBusinessSignup = async (e) => {
    e.preventDefault();
    if (!bizForm.businessName || !bizForm.ownerName || !bizForm.email || !bizForm.password || !bizForm.phone) { toast.error('Please fill all required fields'); return; }
    if (bizForm.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (bizForm.password !== bizForm.confirm) { toast.error('Passwords do not match'); return; }
    if (bizForm.services.length === 0) { toast.error('Select at least one service'); return; }
    setSubmitting(true);
    try {
      const result = await register(bizForm);
      if (result.success) toast.success('Business registered! Pending admin approval.');
      else toast.error(result.error || 'Registration failed');
    } catch { toast.error('Something went wrong'); }
    finally { setSubmitting(false); }
  };

  const togglePwd = () => setShowPwd(p => !p);

  /* ─── Animated role switch ─── */
  const handleRoleSwitch = useCallback((newRole) => {
    if (signInForm.role === newRole) return;

    // Animate the sliding pill
    const pill = document.querySelector('.role-slider-pill');
    const container = document.querySelector('.role-toggle-container');
    if (pill && container) {
      const isCustomer = newRole === 'customer';
      gsap.to(pill, {
        x: isCustomer ? 0 : container.offsetWidth / 2,
        background: isCustomer ? '#003c89' : '#b12d00',
        duration: 0.35,
        ease: 'power3.out',
      });
    }

    // Animate the form fields
    const fields = document.querySelector('.signin-fields');
    if (fields) {
      gsap.fromTo(fields,
        { opacity: 0.3, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.1 }
      );
    }

    // Animate the subtitle text
    const subtitle = document.querySelector('.signin-subtitle');
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, x: newRole === 'customer' ? -20 : 20 },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', delay: 0.05 }
      );
    }

    setSignInForm(p => ({ ...p, role: newRole }));
  }, [signInForm.role]);

  /* ═══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <>
      <SEO title="Welcome to Pro Fix" description="Sign in or create an account to find trusted local services or list your business." />

      {/* Inject auth-specific CSS animations */}
      <style>{`
        @keyframes shimmer-auth {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .auth-form-card { transition: transform 0.3s ease; }
        @keyframes auth-grid-drift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 72px 72px, 72px 72px; }
        }
        /* keep motion GSAP-driven (cleaner, smoother) */
        .form-input-auth:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 4px rgba(0,60,137,0.08) !important;
        }
        .auth-role-card {
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .auth-role-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 20px 40px rgba(0,30,80,0.12) !important;
          border-color: var(--color-primary) !important;
        }
        .service-chip-btn {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .service-chip-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,30,80,0.08);
        }
        .role-slider-container {
          position: relative;
          display: flex;
          background: #f1f5f9;
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 4px;
          overflow: hidden;
        }
        .role-slider-pill {
          position: absolute;
          top: 4px;
          left: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          border-radius: 11px;
          background: #003c89;
          z-index: 1;
          box-shadow: 0 1px 3px rgba(0,30,80,0.12);
        }
        .role-slider-btn {
          flex: 1;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          font-family: var(--font-body);
          transition: color 0.3s ease;
          border-radius: 11px;
          color: #64748b;
        }
        .role-slider-btn.active {
          color: #fff;
        }
        .role-slider-btn .role-icon {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .role-slider-btn.active .role-icon {
          transform: scale(1.15);
        }
        .auth-form-panel::-webkit-scrollbar { width: 6px; }
        .auth-form-panel::-webkit-scrollbar-track { background: transparent; }
        .auth-form-panel::-webkit-scrollbar-thumb { background: rgba(0,30,80,0.1); border-radius: 3px; }
        .auth-form-panel::-webkit-scrollbar-thumb:hover { background: rgba(0,30,80,0.2); }
        .auth-brand-photo-wrap {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }
        .auth-brand-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 68% center;
          will-change: transform, opacity;
        }
        .auth-brand-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(102deg, rgba(3, 7, 18, 0.86) 0%, rgba(5, 12, 28, 0.62) 40%, rgba(8, 20, 45, 0.38) 100%),
            radial-gradient(ellipse 90% 70% at 80% 20%, rgba(37, 99, 235, 0.2), transparent 58%);
          pointer-events: none;
        }
        .auth-brand-glow {
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            radial-gradient(ellipse 55% 45% at 20% 10%, rgba(59, 130, 246, 0.2), transparent 55%),
            radial-gradient(ellipse 40% 35% at 85% 75%, rgba(34, 211, 238, 0.12), transparent 50%);
          pointer-events: none;
        }
        .auth-brand-grid {
          position: absolute;
          inset: 0;
          z-index: 3;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 72px 72px;
          animation: auth-grid-drift 48s linear infinite;
          mask-image: radial-gradient(ellipse 95% 85% at 40% 40%, black 18%, transparent 68%);
          pointer-events: none;
          opacity: 0.85;
        }
        .auth-mobile-brand { display: none; align-items: center; gap: 10px; }
        @media (max-width: 900px) {
          .auth-content-wrap { grid-template-columns: 1fr !important; }
          .auth-brand-panel { display: none !important; }
          .auth-form-panel { padding: 24px 16px !important; }
          .auth-mobile-brand { display: flex !important; }
        }
      `}</style>

      <div style={s.pageWrap}>
        <div style={s.contentWrap} className="auth-content-wrap">

          {/* ── Left: editorial brand (Linear / Vercel–style) ── */}
          <div style={s.brandPanel} className="auth-brand-panel">
            <div className="auth-brand-photo-wrap" aria-hidden>
              <img className="auth-brand-photo" src="/auth_hero.png" alt="" />
              <div className="auth-brand-scrim" />
            </div>
            <div className="auth-brand-glow" aria-hidden />
            <div className="auth-brand-grid" aria-hidden />
            <div style={s.brandContent}>
              <div className="auth-brand-mark" style={s.brandMark}>
                <img src="/favicon.svg" alt="" width={36} height={36} style={{ borderRadius: 10 }} />
                <span style={s.brandMarkText}>Pro Fix</span>
              </div>
              <h2 className="auth-brand-headline" style={s.brandHeadline}>
                Book trusted home services in minutes.
              </h2>
              <p className="auth-brand-sub" style={s.brandSub}>
                From AC repair to plumbing—get background‑verified pros, upfront pricing, and 1–2 hour response times. Every job backed by our 30‑day warranty.
              </p>
              <p className="auth-brand-metrics" style={s.brandMetrics}>
                <span className="auth-brand-metric-part" style={s.brandMetric}>
                  <strong className="auth-metric-counter-1">0</strong> experts
                </span>
                <span className="auth-brand-metric-part auth-brand-metric-sep" style={s.brandMetricSep}>·</span>
                <span className="auth-brand-metric-part" style={s.brandMetric}>
                  <strong className="auth-metric-counter-2">0</strong> jobs
                </span>
                <span className="auth-brand-metric-part auth-brand-metric-sep" style={s.brandMetricSep}>·</span>
                <span className="auth-brand-metric-part" style={s.brandMetric}>
                  <strong className="auth-metric-counter-3">0.0</strong> avg rating
                </span>
              </p>
            </div>
          </div>

          {/* ── Right: auth column ── */}
          <div style={s.formPanel} className="auth-form-panel">
            <div className="auth-mobile-brand" style={s.mobileBrand}>
              <img src="/favicon.svg" alt="" width={28} height={28} style={{ borderRadius: 8 }} />
              <span style={s.mobileBrandText}>Pro Fix</span>
            </div>
            <div ref={formRef} style={s.formCard} className="auth-form-card">
              <div className="auth-form-inner">
                <div style={s.modeTabs}>
                  <button
                    type="button"
                    onClick={() => animateFormChange(() => { setMode('signin'); setRole(null); })}
                    style={mode === 'signin' ? s.modeTabOn : s.modeTabOff}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => animateFormChange(() => { setMode('signup'); setRole(null); })}
                    style={mode === 'signup' ? s.modeTabOn : s.modeTabOff}
                  >
                    Create account
                  </button>
                </div>

                {/* ─── SIGN IN ─── */}
                {mode === 'signin' && (
                  <form onSubmit={handleSignIn} style={s.form}>
                    <h2 style={s.formTitle}>Welcome back</h2>
                    <p className="signin-subtitle" style={s.formSubtitle}>
                      {signInForm.role === 'customer'
                        ? 'Sign in to find services near you'
                        : 'Sign in to manage your business'}
                    </p>

                    <div className="role-toggle-container role-slider-container">
                      <div className="role-slider-pill" />
                      <button type="button" onClick={() => handleRoleSwitch('customer')} className={`role-slider-btn ${signInForm.role === 'customer' ? 'active' : ''}`}>
                        <Search size={16} className="role-icon" /> Customer
                      </button>
                      <button type="button" onClick={() => handleRoleSwitch('business')} className={`role-slider-btn ${signInForm.role === 'business' ? 'active' : ''}`}>
                        <Store size={16} className="role-icon" /> Business
                      </button>
                    </div>

                    <div className="signin-fields">
                      <AuthInput icon={Mail} label="Email" type="email" placeholder="your@email.com"
                        value={signInForm.email} onChange={e => setSignInForm(p => ({ ...p, email: e.target.value }))} required />
                      <AuthPasswordInput label="Password" placeholder="Enter your password" showPwd={showPwd} onToggle={togglePwd}
                        value={signInForm.password} onChange={e => setSignInForm(p => ({ ...p, password: e.target.value }))} />

                    </div>

                    <button type="submit" style={{
                      ...s.submitBtn,
                      background: signInForm.role === 'customer' ? '#003c89' : '#b12d00',
                      color: '#fff',
                    }} disabled={submitting}>
                      {submitting ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <span style={s.spinner} /> Signing in...
                        </span>
                      ) : 'Sign In'}
                    </button>
                    <p style={s.switchText}>Don't have an account? <button type="button" onClick={() => animateFormChange(() => setMode('signup'))} style={s.switchLink}>Create one</button></p>
                  </form>
                )}

                {/* ─── SIGN UP: Role Selection ─── */}
                {mode === 'signup' && !role && (
                  <div style={s.form}>
                    <h2 style={s.formTitle}>Create your account</h2>
                    <p style={s.formSubtitle}>Choose how you'd like to use Pro Fix</p>
                    <div style={s.roleCards}>
                      <button onClick={() => animateFormChange(() => setRole('customer'))} style={s.roleCard} className="auth-role-card">
                        <div style={s.roleCardIcon}><Search size={32} color="var(--color-primary)" /></div>
                        <h3 style={s.roleCardTitle}>I'm a Customer</h3>
                        <p style={s.roleCardDesc}>Find trusted service providers near your location</p>
                        <div style={s.roleCardFeatures}>
                          <span><CheckCircle size={14} /> Search services</span>
                          <span><CheckCircle size={14} /> Read reviews</span>
                          <span><CheckCircle size={14} /> Contact providers</span>
                        </div>
                        <span style={s.roleCardCta}>Get Started <ArrowRight size={16} /></span>
                      </button>
                      <button onClick={() => animateFormChange(() => setRole('business'))} style={s.roleCard} className="auth-role-card">
                        <div style={{ ...s.roleCardIcon, background: 'rgba(177,45,0,0.08)' }}><Store size={32} color="var(--color-secondary)" /></div>
                        <h3 style={s.roleCardTitle}>I'm a Business</h3>
                        <p style={s.roleCardDesc}>List your service business and reach local customers</p>
                        <div style={s.roleCardFeatures}>
                          <span><CheckCircle size={14} /> Free listing</span>
                          <span><CheckCircle size={14} /> Get leads</span>
                          <span><CheckCircle size={14} /> Manage profile</span>
                        </div>
                        <span style={{ ...s.roleCardCta, color: 'var(--color-secondary)' }}>List Your Business <ArrowRight size={16} /></span>
                      </button>
                    </div>
                    <p style={s.switchText}>Already have an account? <button type="button" onClick={() => animateFormChange(() => setMode('signin'))} style={s.switchLink}>Sign in</button></p>
                  </div>
                )}

                {/* ─── SIGN UP: Customer ─── */}
                {mode === 'signup' && role === 'customer' && (
                  <form onSubmit={handleCustomerSignup} style={s.form}>
                    <button type="button" onClick={() => animateFormChange(() => setRole(null))} style={s.backBtn}>← Choose role</button>
                    <h2 style={s.formTitle}>Customer Sign Up</h2>
                    <p style={s.formSubtitle}>Create your account to find services near you</p>
                    <AuthInput icon={User} label="Full Name" type="text" placeholder="Rahul Kumar"
                      value={custForm.name} onChange={e => setCustForm(p => ({ ...p, name: e.target.value }))} required />
                    <AuthInput icon={Mail} label="Email" type="email" placeholder="your@email.com"
                      value={custForm.email} onChange={e => setCustForm(p => ({ ...p, email: e.target.value }))} required />
                    <AuthInput icon={Phone} label="Phone (optional)" type="tel" placeholder="+91 98765 43210"
                      value={custForm.phone} onChange={e => setCustForm(p => ({ ...p, phone: e.target.value }))} />
                    <div style={s.fieldRow}>
                      <AuthPasswordInput label="Password" placeholder="Min 6 characters" showPwd={showPwd} onToggle={togglePwd}
                        value={custForm.password} onChange={e => setCustForm(p => ({ ...p, password: e.target.value }))} />
                      <AuthPasswordInput label="Confirm" placeholder="Repeat password" showPwd={showPwd} onToggle={togglePwd}
                        value={custForm.confirm} onChange={e => setCustForm(p => ({ ...p, confirm: e.target.value }))} />
                    </div>
                    <button type="submit" style={{ ...s.submitBtn, background: '#003c89', color: '#fff' }} disabled={submitting}>
                      {submitting ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <span style={s.spinner} /> Creating Account...
                        </span>
                      ) : 'Create Account'}
                    </button>
                    <p style={s.switchText}>Already have an account? <button type="button" onClick={() => animateFormChange(() => setMode('signin'))} style={s.switchLink}>Sign in</button></p>
                  </form>
                )}

                {/* ─── SIGN UP: Business ─── */}
                {mode === 'signup' && role === 'business' && (
                  <form onSubmit={handleBusinessSignup} style={s.form}>
                    <button type="button" onClick={() => animateFormChange(() => setRole(null))} style={s.backBtn}>← Choose role</button>
                    <h2 style={s.formTitle}>Business Registration</h2>
                    <p style={s.formSubtitle}>List your service business on Pro Fix</p>

                    <div style={s.sectionLabel}><Store size={14} /> Business Details</div>
                    <AuthInput icon={Store} label="Business Name *" type="text" placeholder="Kumar AC Services"
                      value={bizForm.businessName} onChange={e => setBizForm(p => ({ ...p, businessName: e.target.value }))} required />
                    <AuthInput icon={User} label="Owner Name *" type="text" placeholder="Rajesh Kumar"
                      value={bizForm.ownerName} onChange={e => setBizForm(p => ({ ...p, ownerName: e.target.value }))} required />
                    <div style={s.fieldRow}>
                      <AuthInput icon={Mail} label="Email *" type="email" placeholder="business@email.com"
                        value={bizForm.email} onChange={e => setBizForm(p => ({ ...p, email: e.target.value }))} required />
                      <AuthInput icon={Phone} label="Phone *" type="tel" placeholder="+91 98765 43210"
                        value={bizForm.phone} onChange={e => setBizForm(p => ({ ...p, phone: e.target.value }))} required />
                    </div>
                    <AuthInput icon={Phone} label="WhatsApp (optional)" type="tel" placeholder="Same as phone if empty"
                      value={bizForm.whatsappNumber} onChange={e => setBizForm(p => ({ ...p, whatsappNumber: e.target.value }))} />

                    <div style={s.sectionLabel}><Wrench size={14} /> Services Offered *</div>
                    <div style={s.serviceChips}>
                      {SERVICE_OPTIONS.map(opt => {
                        const Icon = opt.icon;
                        const active = bizForm.services.includes(opt.value);
                        return (
                          <button key={opt.value} type="button" onClick={() => toggleBizService(opt.value)} className="service-chip-btn" style={active ? s.chipActive : s.chip}>
                            <Icon size={16} /> {opt.label}
                          </button>
                        );
                      })}
                    </div>

                    <div style={s.fieldWrap}>
                      <label style={s.label}><Wrench size={15} /> Description</label>
                      <textarea className="form-input-auth" rows="3" style={{ ...s.input, resize: 'vertical' }}
                        placeholder="Tell customers about your business..."
                        value={bizForm.description} onChange={e => setBizForm(p => ({ ...p, description: e.target.value }))} />
                    </div>

                    <div style={s.sectionLabel}><MapPin size={14} /> Address & Location</div>

                    {/* Auto-detect location — primary action */}
                    <div style={s.fieldWrap}>
                      <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: 'var(--color-outline)', lineHeight: 1.5 }}>
                        Tap below to auto-detect your shop's location. This sets your GPS pin for "near me" search and auto-fills your address.
                      </p>
                      <button
                        type="button"
                        disabled={detectingLocation}
                        onClick={() => {
                          if (!navigator.geolocation) {
                            toast.error('Geolocation is not supported by your browser');
                            return;
                          }
                          setDetectingLocation(true);
                          setDetectedAddress('');
                          navigator.geolocation.getCurrentPosition(
                            async (position) => {
                              const lat = position.coords.latitude;
                              const lng = position.coords.longitude;
                              let addressUpdate = {};
                              try {
                                const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`);
                                const geo = await resp.json();
                                setDetectedAddress(geo.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                                if (geo.address) {
                                  const a = geo.address;
                                  const streetParts = [a.house_number, a.building, a.road, a.neighbourhood, a.suburb, a.hamlet, a.residential, a.locality].filter(Boolean);
                                  const city = a.city || a.town || a.village || a.state_district || a.county || '';
                                  let street = streetParts.join(', ');
                                  // Fallback: if no street fields, extract from display_name
                                  if (!street && geo.display_name) {
                                    const parts = geo.display_name.split(',').map(p => p.trim());
                                    // Take parts before the city/state/country (usually the first 1-3 segments)
                                    const skipWords = [city, a.state, a.country, a.postcode, a.country_code].filter(Boolean).map(w => w.toLowerCase());
                                    const streetFromDisplay = parts.filter(p => !skipWords.includes(p.toLowerCase())).slice(0, 2);
                                    street = streetFromDisplay.join(', ');
                                  }
                                  addressUpdate = {
                                    street,
                                    city,
                                    state: a.state || '',
                                    pincode: a.postcode || '',
                                  };
                                }
                              } catch {
                                setDetectedAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                              }
                              setBizForm(prev => ({
                                ...prev,
                                latitude: String(lat),
                                longitude: String(lng),
                                address: { ...prev.address, ...addressUpdate },
                              }));
                              setDetectingLocation(false);
                              toast.success('Location & address detected!');
                            },
                            (err) => {
                              setDetectingLocation(false);
                              if (err.code === 1) toast.error('Location permission denied. Please allow access in your browser settings.');
                              else if (err.code === 2) toast.error('Location unavailable. Please try again.');
                              else toast.error('Location request timed out. Please try again.');
                            },
                            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                          );
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                          width: '100%', padding: '14px 20px', borderRadius: '12px',
                          border: '2px dashed var(--color-primary)',
                          background: 'rgba(0,60,137,0.04)', color: 'var(--color-primary)',
                          fontWeight: '700', fontSize: '0.95rem',
                          cursor: detectingLocation ? 'wait' : 'pointer',
                          fontFamily: 'var(--font-body)',
                          transition: 'all 0.25s ease',
                          opacity: detectingLocation ? 0.75 : 1,
                        }}
                      >
                        {detectingLocation ? (
                          <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Detecting your location...</>
                        ) : (
                          <><LocateFixed size={18} /> {bizForm.latitude ? 'Re-detect My Location' : 'Detect My Location'}</>
                        )}
                      </button>

                      {(bizForm.latitude && bizForm.longitude) && (
                        <div style={{
                          display: 'flex', flexDirection: 'column', gap: '6px',
                          padding: '12px 16px', borderRadius: '10px', marginTop: '8px',
                          background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle size={16} color="#25d366" />
                            <strong style={{ fontSize: '0.88rem', color: '#166534' }}>Location & address detected</strong>
                          </div>
                          {detectedAddress && (
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                              📍 {detectedAddress}
                            </p>
                          )}
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                            Coords: {parseFloat(bizForm.latitude).toFixed(5)}, {parseFloat(bizForm.longitude).toFixed(5)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Address fields — auto-filled, editable for corrections */}
                    <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--color-outline)', fontStyle: 'italic' }}>
                      {bizForm.latitude ? 'Auto-filled from your location. Edit if needed.' : 'Or enter your address manually below.'}
                    </p>
                    <AuthInput label="Street / Area" type="text" placeholder="Shop No. 5, Main Road"
                      value={bizForm.address.street} onChange={e => setBizForm(p => ({ ...p, address: { ...p.address, street: e.target.value } }))} />
                    <div style={s.fieldRow}>
                      <AuthInput label="City" type="text" placeholder="New Delhi"
                        value={bizForm.address.city} onChange={e => setBizForm(p => ({ ...p, address: { ...p.address, city: e.target.value } }))} />
                      <AuthInput label="Pincode" type="text" placeholder="110001"
                        value={bizForm.address.pincode} onChange={e => setBizForm(p => ({ ...p, address: { ...p.address, pincode: e.target.value } }))} />
                    </div>

                    <div style={s.sectionLabel}><Lock size={14} /> Account Security</div>
                    <div style={s.fieldRow}>
                      <AuthPasswordInput label="Password *" placeholder="Min 6 characters" showPwd={showPwd} onToggle={togglePwd}
                        value={bizForm.password} onChange={e => setBizForm(p => ({ ...p, password: e.target.value }))} />
                      <AuthPasswordInput label="Confirm *" placeholder="Repeat password" showPwd={showPwd} onToggle={togglePwd}
                        value={bizForm.confirm} onChange={e => setBizForm(p => ({ ...p, confirm: e.target.value }))} />
                    </div>

                    <button type="submit" style={{ ...s.submitBtn, background: '#003c89', color: '#fff' }} disabled={submitting}>
                      {submitting ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <span style={s.spinner} /> Registering...
                        </span>
                      ) : 'Register Business'}
                    </button>
                    <p style={{ ...s.switchText, fontSize: '0.82rem', color: 'var(--color-outline)' }}>
                      Your listing will be reviewed by our admin team before going live.
                    </p>
                    <p style={s.switchText}>Already have an account? <button type="button" onClick={() => animateFormChange(() => setMode('signin'))} style={s.switchLink}>Sign in</button></p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════ STYLES ════════════════════════════════ */
const s = {
  pageWrap: {
    position: 'fixed',
    inset: 0,
    background: '#f8faff',
    overflow: 'hidden',
    zIndex: 9999,
  },
  contentWrap: {
    display: 'grid', gridTemplateColumns: '1.1fr 1fr', height: '100vh', position: 'relative', zIndex: 2,
  },

  /* ── Brand column (editorial, SaaS-style) ── */
  brandPanel: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
    padding: 'clamp(48px, 8vw, 96px) clamp(40px, 6vw, 80px)',
    background: '#070b14',
    position: 'relative', overflow: 'hidden',
  },
  brandContent: {
    position: 'relative', zIndex: 4, maxWidth: '460px',
  },
  brandMark: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px',
  },
  brandMarkText: {
    fontSize: '1rem', fontWeight: '700', color: 'rgba(248, 250, 252, 0.95)', letterSpacing: '-0.02em',
  },
  brandHeadline: {
    fontSize: 'clamp(2rem, 3.2vw, 2.75rem)', fontWeight: '600', lineHeight: 1.12, letterSpacing: '-0.038em',
    color: '#f8fafc', margin: '0 0 20px', willChange: 'filter',
  },
  brandSub: {
    fontSize: '1.05rem', lineHeight: 1.65, color: 'rgba(226, 232, 240, 0.7)', margin: '0 0 32px',
  },
  brandMetrics: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 2px',
    fontSize: '0.875rem', color: 'rgba(226, 232, 240, 0.5)', margin: 0, lineHeight: 1.5,
  },
  brandMetric: { letterSpacing: '0.01em' },
  brandMetricSep: { padding: '0 8px', opacity: 0.45, userSelect: 'none' },

  /* ── Auth column ── */
  formPanel: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
    padding: '40px 48px 56px', overflowY: 'auto', height: '100vh',
    background: '#f4f5f7',
    borderLeft: '1px solid rgba(15, 23, 42, 0.07)',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0,30,80,0.12) transparent',
  },
  mobileBrand: {
    width: '100%', maxWidth: '440px', marginBottom: '4px',
  },
  mobileBrandText: {
    fontSize: '1rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em',
  },
  formCard: {
    width: '100%', maxWidth: '440px',
    background: 'transparent',
    border: 'none', borderRadius: 0, padding: 0, boxShadow: 'none', margin: '8px 0 auto',
  },
  modeTabs: {
    display: 'flex', gap: '32px', marginBottom: '28px', borderBottom: '1px solid rgba(15,23,42,0.08)',
  },
  modeTabOn: {
    padding: '0 0 14px', marginBottom: '-1px', border: 'none', background: 'none',
    borderBottom: '2px solid var(--color-primary)', color: '#0f172a', fontWeight: '700',
    fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  modeTabOff: {
    padding: '0 0 14px', marginBottom: '-1px', border: 'none', background: 'none',
    borderBottom: '2px solid transparent', color: '#94a3b8', fontWeight: '600',
    fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'color 0.2s',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  formTitle: { fontSize: '1.5rem', fontWeight: '700', margin: '4px 0 0', letterSpacing: '-0.03em', color: '#0f172a' },
  formSubtitle: { color: '#64748b', margin: '0 0 18px', fontSize: '0.9375rem', lineHeight: 1.5 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  label: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.82rem', color: '#475569' },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%', padding: '11px 14px', borderRadius: '8px',
    border: '1px solid rgba(15,23,42,0.12)', backgroundColor: '#fff',
    fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: '#0f172a',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', padding: '4px', color: '#94a3b8', cursor: 'pointer',
  },
  submitBtn: {
    padding: '12px 16px', borderRadius: '8px', fontSize: '0.9375rem', fontWeight: '700',
    marginTop: '6px', border: 'none', cursor: 'pointer', letterSpacing: '0.01em',
    position: 'relative', overflow: 'hidden',
  },
  spinner: {
    display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  switchText: { textAlign: 'center', color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' },
  switchLink: {
    background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: '700',
    cursor: 'pointer', fontSize: 'inherit', fontFamily: 'var(--font-body)',
    textDecoration: 'underline', padding: 0,
  },
  backBtn: {
    alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-primary)',
    fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'var(--font-body)',
    padding: '0', marginBottom: '4px',
  },
  roleToggleRow: { display: 'flex', gap: '8px', marginBottom: '4px' },
  roleToggle: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '11px 16px', borderRadius: '12px', border: '2px solid #e2e8f0',
    background: 'transparent', color: '#64748b', fontWeight: '700', fontSize: '0.88rem',
    cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
  },
  roleToggleActive: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '11px 16px', borderRadius: '12px', border: '2px solid var(--color-primary)',
    background: 'rgba(0,60,137,0.04)', color: 'var(--color-primary)', fontWeight: '800', fontSize: '0.88rem',
    cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s',
  },
  roleCards: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '8px 0' },
  roleCard: {
    padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(15,23,42,0.1)',
    borderRadius: '12px', background: '#fff',
    fontFamily: 'var(--font-body)', width: '100%',
    boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
  },
  roleCardIcon: {
    width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(0,60,137,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
  },
  roleCardTitle: { fontSize: '1.05rem', fontWeight: '800', margin: '0 0 6px', color: '#0f172a' },
  roleCardDesc: { fontSize: '0.82rem', color: '#64748b', margin: '0 0 12px', lineHeight: 1.4 },
  roleCardFeatures: {
    display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start',
    width: '100%', fontSize: '0.78rem', color: '#64748b', marginBottom: '16px',
  },
  roleCardCta: {
    display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)',
    fontWeight: '800', fontSize: '0.9rem', marginTop: 'auto',
  },
  sectionLabel: {
    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '800',
    textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)',
    marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #e2e8f0',
  },
  serviceChips: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chip: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px',
    border: '2px solid #e2e8f0', background: 'transparent', color: '#0f172a',
    fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  chipActive: {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px',
    border: '2px solid var(--color-primary)', background: 'rgba(0,60,137,0.06)',
    color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.85rem',
    cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
};

export default AuthPage;
