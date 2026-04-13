import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import gsap from 'gsap';
import {
  User, Mail, Lock, Phone, Store, Search, ArrowRight,
  Wrench, Shield, MapPin, Star, Eye, EyeOff,
  Wind, Droplet, Thermometer, Sparkles, CheckCircle,
  Zap, Award, Clock
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

/* ─── Floating particles component ─── */
const FloatingParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(163, 194, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(163, 194, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />;
};

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */
const AuthPage = () => {
  const navigate = useNavigate();
  const { loginUser, registerUser, login, register, isAuthenticated, isShopOwner, isCustomer } = useAuth();
  const brandRef = useRef(null);
  const formRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);

  const [mode, setMode] = useState('signin');
  const [role, setRole] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [custForm, setCustForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [bizForm, setBizForm] = useState({
    businessName: '', ownerName: '', email: '', password: '', confirm: '',
    phone: '', whatsappNumber: '', services: [], description: '',
    address: { street: '', city: '', state: '', pincode: '' },
  });
  const [signInForm, setSignInForm] = useState({ email: '', password: '', role: 'customer' });

  /* ─── GSAP Entrance Animations ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Brand panel animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.auth-logo-icon', { scale: 0, rotation: -180, duration: 0.8, delay: 0.2 })
        .from('.auth-logo-text', { x: -30, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.auth-tagline', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
        .from('.auth-hero-img', { scale: 1.1, opacity: 0, duration: 1 }, '-=0.4')
        .from('.auth-feature-item', { x: -40, opacity: 0, stagger: 0.12, duration: 0.5 }, '-=0.6')
        .from('.auth-stat-item', { y: 30, opacity: 0, stagger: 0.1, duration: 0.4 }, '-=0.3');

      // Form panel
      gsap.from('.auth-form-card', {
        y: 40, opacity: 0, duration: 0.8, delay: 0.5, ease: 'power3.out'
      });

      // Floating badges
      gsap.to('.floating-badge-1', {
        y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
      gsap.to('.floating-badge-2', {
        y: 10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5
      });
      gsap.to('.floating-badge-3', {
        y: -8, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1
      });

      // Counter animations
      const counters = [
        { el: '.counter-1', target: 500 },
        { el: '.counter-2', target: 10000 },
        { el: '.counter-3', target: 4.8 },
      ];
      counters.forEach(({ el, target }) => {
        const element = document.querySelector(el);
        if (element) {
          gsap.from({ val: 0 }, {
            val: target, duration: 2, delay: 1.2, ease: 'power2.out',
            onUpdate: function () {
              const v = this.targets()[0].val;
              if (target > 100) element.textContent = Math.floor(v).toLocaleString() + '+';
              else element.textContent = v.toFixed(1) + '★';
            }
          });
        }
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (isShopOwner) navigate('/dashboard', { replace: true });
      else if (isCustomer) navigate('/find-services', { replace: true });
    }
  }, [isAuthenticated, isShopOwner, isCustomer, navigate]);

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
        background: isCustomer
          ? 'linear-gradient(135deg, #003c89, #1a53ad)'
          : 'linear-gradient(135deg, #b12d00, #e84d1a)',
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
          background: linear-gradient(135deg, #003c89, #1a53ad);
          z-index: 1;
          box-shadow: 0 4px 12px rgba(0,30,80,0.2);
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
        @media (max-width: 900px) {
          .auth-content-wrap { grid-template-columns: 1fr !important; }
          .auth-brand-panel { display: none !important; }
          .auth-form-panel { padding: 24px 16px !important; }
        }
      `}</style>

      <div style={s.pageWrap}>
        <div style={s.contentWrap} className="auth-content-wrap">

          {/* ── Left: Premium Branding Panel ── */}
          <div style={s.brandPanel} className="auth-brand-panel">
            <FloatingParticles />

            {/* Hero image with overlay */}
            <div className="auth-hero-img" style={s.heroImgWrap}>
              <img src="/auth_hero.png" alt="" style={s.heroImg} />
              <div style={s.heroImgOverlay} />
            </div>

            <div style={s.brandInner}>
              {/* Logo */}
              <div style={s.logoRow}>
                <div className="auth-logo-icon" style={s.logoIconWrap}>
                  <img src="/favicon.svg" alt="" style={{ width: 40, height: 40, borderRadius: 10 }} />
                </div>
                <div className="auth-logo-text">
                  <h1 style={s.brandLogo}>PRO FIX</h1>
                  <p className="auth-tagline" style={s.brandTagline}>Professional Home Services</p>
                </div>
              </div>

              {/* Features with animated entrance */}
              <div ref={featuresRef} style={s.brandFeatures}>
                <div className="auth-feature-item" style={s.featureItem}>
                  <div style={s.featureIcon}><Shield size={20} /></div>
                  <div>
                    <strong>Verified Professionals</strong>
                    <p style={s.featureText}>Every technician is background-checked & skill-certified</p>
                  </div>
                </div>
                <div className="auth-feature-item" style={s.featureItem}>
                  <div style={{ ...s.featureIcon, background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.25)' }}><Clock size={20} /></div>
                  <div>
                    <strong>Fast Response Time</strong>
                    <p style={s.featureText}>Expert at your door within 1–2 hours of booking</p>
                  </div>
                </div>
                <div className="auth-feature-item" style={s.featureItem}>
                  <div style={{ ...s.featureIcon, background: 'rgba(251, 191, 36, 0.15)', borderColor: 'rgba(251, 191, 36, 0.25)' }}><Award size={20} /></div>
                  <div>
                    <strong>30-Day Warranty</strong>
                    <p style={s.featureText}>Guaranteed satisfaction on every repair & installation</p>
                  </div>
                </div>
              </div>

              {/* Floating trust badges */}
              <div className="floating-badge-1" style={{ ...s.floatingBadge, top: '15%', right: '10%' }}>
                <Zap size={16} color="#fbbf24" /> Lightning Fast
              </div>
              <div className="floating-badge-2" style={{ ...s.floatingBadge, bottom: '30%', right: '5%' }}>
                <Shield size={16} color="#22c55e" /> 100% Safe
              </div>
              <div className="floating-badge-3" style={{ ...s.floatingBadge, top: '50%', left: '5%' }}>
                <Star size={16} color="#f59e0b" /> Top Rated
              </div>

              {/* Animated Stats */}
              <div ref={statsRef} style={s.brandStats}>
                <div className="auth-stat-item" style={s.statItem}>
                  <strong className="counter-1" style={s.statNumber}>500+</strong>
                  <span style={s.statLabel}>Verified Experts</span>
                </div>
                <div style={s.statDivider} />
                <div className="auth-stat-item" style={s.statItem}>
                  <strong className="counter-2" style={s.statNumber}>10,000+</strong>
                  <span style={s.statLabel}>Happy Customers</span>
                </div>
                <div style={s.statDivider} />
                <div className="auth-stat-item" style={s.statItem}>
                  <strong className="counter-3" style={s.statNumber}>4.8★</strong>
                  <span style={s.statLabel}>Average Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Auth Form ── */}
          <div style={s.formPanel} className="auth-form-panel">
            <div ref={formRef} style={s.formCard} className="auth-form-card">
              <div className="auth-form-inner">

                {/* Tabs */}
                <div style={s.tabBar}>
                  <button onClick={() => animateFormChange(() => { setMode('signin'); setRole(null); })} style={mode === 'signin' ? s.tabActive : s.tab}>Sign In</button>
                  <button onClick={() => animateFormChange(() => { setMode('signup'); setRole(null); })} style={mode === 'signup' ? s.tabActive : s.tab}>Create Account</button>
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

                    <button type="submit" className="btn-secondary" style={{
                      ...s.submitBtn,
                      background: signInForm.role === 'customer'
                        ? 'linear-gradient(135deg, #003c89, #1a53ad)'
                        : 'linear-gradient(135deg, #b12d00, #e84d1a)',
                      transition: 'background 0.4s ease',
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
                    <button type="submit" className="btn-secondary" style={s.submitBtn} disabled={submitting}>
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

                    <div style={s.sectionLabel}><MapPin size={14} /> Address</div>
                    <AuthInput label="Street" type="text" placeholder="Shop No. 5, Main Road"
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

                    <button type="submit" className="btn-secondary" style={s.submitBtn} disabled={submitting}>
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

  /* ── Brand Panel ── */
  brandPanel: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px',
    background: 'linear-gradient(160deg, #001227 0%, #002555 40%, #003c89 100%)',
    position: 'relative', overflow: 'hidden',
  },
  heroImgWrap: {
    position: 'absolute', inset: 0, zIndex: 0,
  },
  heroImg: {
    width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4,
    filter: 'saturate(0.5)',
  },
  heroImgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(0,18,39,0.3) 0%, rgba(0,37,85,0.6) 50%, rgba(0,60,137,0.85) 100%)',
  },
  brandInner: {
    maxWidth: '480px', color: '#fff', position: 'relative', zIndex: 3,
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px',
  },
  logoIconWrap: {
    width: '56px', height: '56px', borderRadius: '16px',
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  brandLogo: {
    fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.03em', margin: 0, lineHeight: 1,
    background: 'linear-gradient(135deg, #fff, #a3c2ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  brandTagline: {
    fontSize: '0.9rem', opacity: 0.7, margin: '4px 0 0', fontWeight: '500', letterSpacing: '0.02em',
  },
  brandFeatures: {
    display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px',
  },
  featureItem: { display: 'flex', alignItems: 'flex-start', gap: '16px' },
  featureIcon: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: 'rgba(99, 161, 255, 0.15)', border: '1px solid rgba(99, 161, 255, 0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  featureText: { margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.6, lineHeight: 1.4 },
  floatingBadge: {
    position: 'absolute', zIndex: 4,
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '10px 16px', borderRadius: '50px',
    background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.12)',
    fontSize: '0.78rem', fontWeight: '700', color: '#fff',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
  },
  brandStats: {
    display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
    backdropFilter: 'blur(10px)',
  },
  statItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    flex: 1, textAlign: 'center',
  },
  statNumber: { fontSize: '1.4rem', fontWeight: '900', lineHeight: 1 },
  statLabel: { fontSize: '0.72rem', opacity: 0.6, fontWeight: '500' },
  statDivider: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.12)' },

  /* ── Form Panel ── */
  formPanel: {
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: '24px 32px', overflowY: 'auto', height: '100vh',
    background: 'linear-gradient(180deg, #f8faff 0%, #fff 100%)',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0,30,80,0.1) transparent',
  },
  formCard: {
    width: '100%', maxWidth: '520px',
    background: '#fff',
    border: '1px solid rgba(0,30,80,0.06)',
    borderRadius: '24px',
    padding: 'clamp(24px, 3vw, 36px)',
    boxShadow: '0 24px 80px rgba(0,30,80,0.06), 0 4px 16px rgba(0,0,0,0.03)',
    margin: 'auto 0',
  },
  tabBar: {
    display: 'flex', gap: '4px',
    background: '#f1f5f9', borderRadius: '14px', padding: '4px', marginBottom: '28px',
  },
  tab: {
    flex: 1, padding: '12px 16px', borderRadius: '11px', border: 'none',
    background: 'transparent', color: '#64748b', fontWeight: '700', fontSize: '0.92rem',
    cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.25s ease',
  },
  tabActive: {
    flex: 1, padding: '12px 16px', borderRadius: '11px', border: 'none',
    background: '#fff', color: 'var(--color-primary)', fontWeight: '800', fontSize: '0.92rem',
    cursor: 'pointer', fontFamily: 'var(--font-body)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.25s ease',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  formTitle: { fontSize: '1.6rem', fontWeight: '800', margin: '0 0 2px', letterSpacing: '-0.02em', color: '#0f172a' },
  formSubtitle: { color: '#64748b', margin: '0 0 8px', fontSize: '0.95rem' },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  label: { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.82rem', color: '#475569' },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '2px solid #e2e8f0', backgroundColor: '#f8fafc',
    fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: '#0f172a',
    outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', padding: '4px', color: '#94a3b8', cursor: 'pointer',
  },
  submitBtn: {
    padding: '15px', borderRadius: '14px', fontSize: '1rem', fontWeight: '800',
    marginTop: '8px', border: 'none', cursor: 'pointer', letterSpacing: '0.01em',
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
    textAlign: 'center', cursor: 'pointer', border: '2px solid #e2e8f0',
    borderRadius: '20px', background: '#fff',
    fontFamily: 'var(--font-body)', width: '100%',
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
