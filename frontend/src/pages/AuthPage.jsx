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
  LocateFixed, Loader, Shield, Zap, Star, Clock, Award
} from 'lucide-react';

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
  const canvasRef = useRef(null);

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

  /* ─── Particle Canvas Animation ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 2 + 0.4,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });
      // Draw faint connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ─── GSAP Entrance and ambient ─── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Orb floating
      gsap.to('.orb-1', { x: 50, y: -40, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.orb-2', { x: -40, y: 50, duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
      gsap.to('.orb-3', { x: 30, y: 25, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 4 });

      // Background image breathing
      gsap.fromTo('.auth-bg-img',
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' }
      );
      gsap.to('.auth-bg-img', {
        scale: 1.04, duration: 16, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5,
      });

      // Brand text entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.auth-brand-mark', { opacity: 0, y: -20, scale: 0.9, duration: 0.65 }, 0.3)
        .fromTo('.auth-headline',
          { y: 45, opacity: 0, filter: 'blur(16px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1 }, '-=0.25')
        .from('.auth-brand-sub', { y: 28, opacity: 0, duration: 0.7 }, '-=0.45')
        .from('.auth-metric-card', { y: 20, opacity: 0, duration: 0.45, stagger: 0.1 }, '-=0.35')
        .from('.auth-trust-badge', { x: -20, opacity: 0, duration: 0.4, stagger: 0.12 }, '-=0.25');

      // Counters
      const animC = (sel, target, opts = {}) => {
        const el = document.querySelector(sel);
        if (!el) return;
        gsap.fromTo({ v: 0 }, { v: target }, {
          duration: opts.dur ?? 2.2, delay: opts.dly ?? 0.9, ease: 'power2.out',
          onUpdate() {
            const v = this.targets()[0].v;
            const n = opts.dec ? Number(v).toFixed(opts.dec) : String(Math.round(v));
            el.textContent = `${opts.pre ?? ''}${opts.fmt ? opts.fmt(n) : n}${opts.suf ?? ''}`;
          }
        });
      };
      animC('.counter-1', 500, { suf: '+', fmt: n => Number(n).toLocaleString() });
      animC('.counter-2', 10000, { suf: '+', fmt: n => Number(n).toLocaleString() });
      animC('.counter-3', 4.9, { dec: 1 });

      // Form card entrance
      gsap.from('.auth-form-card', { y: 45, opacity: 0, duration: 1.1, delay: 0.2, ease: 'power3.out' });
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
        opacity: 0, y: 20, duration: 0.22, ease: 'power2.in',
        onComplete: () => {
          callback();
          gsap.fromTo(card, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
        }
      });
    } else callback();
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

  /* ─── Animated role switch with RED for business ─── */
  const handleRoleSwitch = useCallback((newRole) => {
    if (signInForm.role === newRole) return;
    const pill = document.querySelector('.role-slider-pill');
    const container = document.querySelector('.role-toggle-container');
    if (pill && container) {
      const isCust = newRole === 'customer';
      gsap.to(pill, {
        x: isCust ? 0 : container.offsetWidth / 2 - 4,
        duration: 0.4,
        ease: 'power3.out',
      });
      // Animate pill color change
      gsap.to(pill, {
        background: isCust
          ? 'linear-gradient(135deg, #003c89, #1e5bb8)'
          : 'linear-gradient(135deg, #b12d00, #e05500)',
        duration: 0.35,
        ease: 'power2.out',
      });
    }
    // Animate the subtitle
    const subtitle = document.querySelector('.signin-subtitle');
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, x: newRole === 'customer' ? -24 : 24 },
        { opacity: 1, x: 0, duration: 0.38, ease: 'power2.out', delay: 0.05 }
      );
    }
    // Animate form fields
    const fields = document.querySelector('.signin-fields');
    if (fields) {
      gsap.fromTo(fields, { opacity: 0.2, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.08 });
    }
    setSignInForm(p => ({ ...p, role: newRole }));
  }, [signInForm.role]);

  /* derived */
  const isBizRole = signInForm.role === 'business';

  /* ═══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <>
      <SEO
        title="Sign In or Register — Pro Fix India | Trusted Home Services"
        description="Join Pro Fix India — sign in or create your free account to book verified AC repair, plumbing, geyser, and cleaning services near you. Businesses can register to reach local customers instantly."
        keywords="Pro Fix login, Pro Fix sign up, home services India, AC repair near me login, plumber booking India, register business Pro Fix"
        url="https://www.profixindia.in/auth"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer-grad {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-soft {
          0%,100% { box-shadow: 0 0 20px rgba(0,60,137,0.2); }
          50% { box-shadow: 0 0 40px rgba(0,60,137,0.4), 0 0 80px rgba(0,60,137,0.08); }
        }
        @keyframes pulse-soft-biz {
          0%,100% { box-shadow: 0 0 20px rgba(177,45,0,0.2); }
          50% { box-shadow: 0 0 40px rgba(177,45,0,0.35), 0 0 80px rgba(177,45,0,0.08); }
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .auth-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: fixed; inset: 0;
          background: #050a18;
          overflow: hidden; z-index: 9999;
        }

        /* Floating orbs */
        .auth-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; will-change: transform; }
        .orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(0,60,137,0.28) 0%, transparent 70%); top: -140px; left: -100px; }
        .orb-2 { width: 380px; height: 380px; background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%); bottom: -80px; left: 25%; }
        .orb-3 { width: 320px; height: 320px; background: radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%); top: 35%; right: 50%; }

        .auth-grid { display: grid; grid-template-columns: 1.15fr 1fr; height: 100vh; position: relative; z-index: 2; }

        /* ─── Brand panel ─── */
        .auth-brand-panel {
          position: relative; display: flex; flex-direction: column; justify-content: center;
          padding: clamp(40px, 7vw, 96px) clamp(40px, 6vw, 80px); overflow: hidden;
        }
        .auth-bg-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: 65% center;
          opacity: 0.45; /* VISIBLE */
          will-change: transform, opacity;
        }
        .auth-brand-overlay {
          position: absolute; inset: 0;
          background:
            linear-gradient(145deg, rgba(3,8,22,0.88) 0%, rgba(3,8,22,0.7) 40%, rgba(3,8,22,0.5) 100%);
        }
        .auth-brand-grid-lines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          animation: auth-grid-drift 50s linear infinite;
        }
        @keyframes auth-grid-drift {
          0% { background-position: 0 0; }
          100% { background-position: 52px 52px; }
        }
        .auth-brand-content { position: relative; z-index: 5; max-width: 490px; }

        .auth-brand-mark { display: flex; align-items: center; gap: 12px; margin-bottom: 36px; }
        .auth-brand-logo-wrap {
          width: 46px; height: 46px; border-radius: 13px;
          background: linear-gradient(135deg, #003c89, #1e5bb8);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 24px rgba(0,60,137,0.5);
        }
        .auth-brand-name { font-size: 1.15rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
        .auth-verified-tag {
          margin-left: auto; display: flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 20px;
          background: rgba(0,60,137,0.2); border: 1px solid rgba(0,60,137,0.35);
          font-size: 0.7rem; font-weight: 700; color: #7ba6e0;
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        .auth-headline {
          font-size: clamp(2.1rem, 3.5vw, 3.1rem); font-weight: 800;
          line-height: 1.08; letter-spacing: -0.04em; color: #f8fafc; margin: 0 0 22px;
        }
        .auth-headline-accent {
          background: linear-gradient(120deg, #5b9bff 0%, #003c89 40%, #06b6d4 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-grad 5s linear infinite;
        }

        .auth-brand-sub {
          font-size: 1rem; line-height: 1.72; color: rgba(226,232,240,0.6);
          margin: 0 0 36px; max-width: 420px;
        }

        /* Metric cards */
        .auth-metrics-row { display: flex; gap: 14px; margin-bottom: 36px; flex-wrap: wrap; }
        .auth-metric-card {
          flex: 1; min-width: 95px; padding: 16px 18px; border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          animation: float-y 6s ease-in-out infinite;
        }
        .auth-metric-card:nth-child(2) { animation-delay: -2s; }
        .auth-metric-card:nth-child(3) { animation-delay: -4s; }
        .auth-metric-val {
          font-size: 1.6rem; font-weight: 800; color: #f8fafc;
          letter-spacing: -0.04em; line-height: 1.2; display: block;
        }
        .auth-metric-lbl { font-size: 0.72rem; color: rgba(148,163,184,0.7); font-weight: 500; margin-top: 2px; display: block; }

        /* Trust badges */
        .auth-trust-badges { display: flex; flex-direction: column; gap: 11px; }
        .auth-trust-badge {
          display: flex; align-items: center; gap: 11px;
          font-size: 0.86rem; color: rgba(226,232,240,0.7); font-weight: 500;
        }
        .auth-trust-icon {
          width: 32px; height: 32px; border-radius: 9px;
          background: rgba(0,60,137,0.15); border: 1px solid rgba(0,60,137,0.3);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        /* ─── Form Panel ─── */
        .auth-form-panel {
          background: rgba(255,255,255,0.97);
          display: flex; flex-direction: column;
          align-items: center; justify-content: flex-start;
          padding: 40px 52px 56px; overflow-y: auto; height: 100vh;
          border-left: 1px solid rgba(0,60,137,0.08);
          scrollbar-width: thin; scrollbar-color: rgba(0,60,137,0.12) transparent;
        }
        .auth-form-panel::-webkit-scrollbar { width: 5px; }
        .auth-form-panel::-webkit-scrollbar-thumb { background: rgba(0,60,137,0.12); border-radius: 3px; }

        .auth-form-card { width: 100%; max-width: 430px; margin: auto; }

        .auth-mode-tabs {
          display: flex; gap: 0; margin-bottom: 30px;
          background: #f1f5f9; border-radius: 14px; padding: 4px;
        }
        .auth-tab {
          flex: 1; padding: 11px 16px; border: none; border-radius: 11px;
          font-size: 0.88rem; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: #94a3b8; background: transparent;
        }
        .auth-tab.active { background: #fff; color: #0f172a; box-shadow: 0 2px 8px rgba(15,23,42,0.1); }

        .auth-form-title { font-size: 1.55rem; font-weight: 800; letter-spacing: -0.04em; color: #0f172a; margin: 0 0 5px; }
        .auth-form-sub { font-size: 0.9rem; color: #64748b; margin: 0 0 20px; line-height: 1.5; }

        /* Role slider */
        .role-slider-wrap {
          position: relative; display: flex;
          background: #f1f5f9; border-radius: 14px; padding: 4px;
          margin-bottom: 20px; overflow: hidden;
        }
        .role-slider-pill {
          position: absolute; top: 4px; left: 4px;
          width: calc(50% - 4px); height: calc(100% - 8px);
          border-radius: 11px;
          background: linear-gradient(135deg, #003c89, #1e5bb8);
          z-index: 1;
          box-shadow: 0 2px 10px rgba(0,60,137,0.35);
          transition: background 0.35s ease;
        }
        .role-toggle-btn {
          flex: 1; position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 11px 14px; border: none; background: transparent;
          font-weight: 700; font-size: 0.88rem; cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: color 0.3s ease; border-radius: 11px; color: #64748b;
        }
        .role-toggle-btn.active { color: #fff; }
        .role-toggle-btn .role-icon { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .role-toggle-btn.active .role-icon { transform: scale(1.15); }

        /* Inputs */
        .auth-field { display: flex; flex-direction: column; gap: 4px; }
        .auth-label {
          display: flex; align-items: center; gap: 5px;
          font-weight: 700; font-size: 0.78rem; color: #475569;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .form-input-auth {
          width: 100%; padding: 12px 14px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: #f8faff;
          font-family: 'Inter', sans-serif; font-size: 0.9375rem;
          color: #0f172a; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .form-input-auth:focus {
          border-color: var(--color-primary, #003c89) !important;
          box-shadow: 0 0 0 4px rgba(0,60,137,0.08) !important;
          background: #fff !important;
        }
        .form-input-auth::placeholder { color: #cbd5e1; }

        /* Submit buttons */
        .auth-submit {
          width: 100%; padding: 14px 16px; border-radius: 12px;
          border: none; color: #fff; font-size: 0.9375rem; font-weight: 700;
          cursor: pointer; font-family: 'Inter', sans-serif;
          letter-spacing: 0.01em; position: relative; overflow: hidden;
          margin-top: 6px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .auth-submit.cust {
          background: linear-gradient(135deg, #003c89, #1e5bb8);
          box-shadow: 0 4px 20px rgba(0,60,137,0.35);
          animation: pulse-soft 3s ease-in-out infinite;
        }
        .auth-submit.biz {
          background: linear-gradient(135deg, #b12d00, #e05500);
          box-shadow: 0 4px 20px rgba(177,45,0,0.35);
          animation: pulse-soft-biz 3s ease-in-out infinite;
        }
        .auth-submit:hover:not(:disabled) { transform: translateY(-1px); animation: none !important; }
        .auth-submit:active:not(:disabled) { transform: translateY(0); }
        .auth-submit:disabled { opacity: 0.7; cursor: not-allowed; animation: none !important; }
        .auth-submit.neutral {
          background: linear-gradient(135deg, #003c89, #1e5bb8);
          box-shadow: 0 4px 20px rgba(0,60,137,0.35);
        }

        .auth-spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.6s linear infinite;
        }

        .auth-switch { text-align: center; color: #94a3b8; font-size: 0.88rem; margin: 6px 0 0; }
        .auth-link {
          background: none; border: none; color: var(--color-primary, #003c89);
          font-weight: 700; cursor: pointer; font-size: inherit;
          font-family: 'Inter', sans-serif; padding: 0; transition: color 0.2s;
        }
        .auth-link:hover { text-decoration: underline; }

        .auth-back {
          align-self: flex-start; background: none; border: none;
          color: var(--color-primary, #003c89); font-weight: 700;
          cursor: pointer; font-size: 0.86rem; font-family: 'Inter', sans-serif;
          padding: 0; margin-bottom: 4px; display: flex;
          align-items: center; gap: 4px; transition: gap 0.2s;
        }
        .auth-back:hover { gap: 8px; }

        /* Role cards */
        .auth-roles { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 10px 0; }
        .auth-role-card {
          padding: 22px 18px; display: flex; flex-direction: column; align-items: center;
          text-align: center; cursor: pointer; border: 1.5px solid #e2e8f0;
          border-radius: 16px; background: #fff; font-family: 'Inter', sans-serif;
          width: 100%; transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(15,23,42,0.04);
        }
        .auth-role-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,60,137,0.12);
          border-color: var(--color-primary, #003c89);
        }
        .auth-role-icon {
          width: 58px; height: 58px; border-radius: 18px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
        }
        .auth-role-title { font-size: 1rem; font-weight: 800; margin: 0 0 6px; color: #0f172a; }
        .auth-role-desc { font-size: 0.78rem; color: #64748b; margin: 0 0 12px; line-height: 1.45; }
        .auth-role-feats { display: flex; flex-direction: column; gap: 5px; text-align: left; width: 100%; font-size: 0.75rem; color: #64748b; margin-bottom: 14px; }
        .auth-role-feats span { display: flex; align-items: center; gap: 5px; }
        .auth-role-cta { display: flex; align-items: center; gap: 5px; font-weight: 800; font-size: 0.86rem; margin-top: auto; }

        /* Section labels */
        .auth-section-lbl {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.72rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--color-primary, #003c89);
          margin-top: 10px; padding-top: 14px; border-top: 1px solid #e2e8f0;
        }

        /* Chips */
        .auth-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .auth-chip {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 14px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: transparent;
          color: #0f172a; font-weight: 600; font-size: 0.83rem;
          cursor: pointer; font-family: 'Inter', sans-serif;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .auth-chip:hover { border-color: var(--color-primary, #003c89); color: var(--color-primary, #003c89); transform: translateY(-1px); }
        .auth-chip.on { border-color: var(--color-primary, #003c89); background: rgba(0,60,137,0.06); color: var(--color-primary, #003c89); font-weight: 700; }

        .auth-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; padding: 4px; color: #94a3b8;
          cursor: pointer; display: flex; transition: color 0.2s;
        }
        .auth-eye:hover { color: var(--color-primary, #003c89); }

        .auth-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        /* Mobile brand */
        .auth-mobile-brand { display: none; align-items: center; gap: 10px; width: 100%; max-width: 430px; margin-bottom: 8px; }
        @media (max-width: 900px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-brand-panel { display: none !important; }
          .auth-form-panel { padding: 24px 20px !important; }
          .auth-mobile-brand { display: flex !important; }
        }
      `}</style>

      <div className="auth-root">
        {/* Ambient orbs */}
        <div className="auth-orb orb-1" />
        <div className="auth-orb orb-2" />
        <div className="auth-orb orb-3" />

        {/* Particle canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '52%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />

        <div className="auth-grid">

          {/* ── LEFT: Brand Panel ── */}
          <div className="auth-brand-panel">
            <img className="auth-bg-img" src="/auth_hero.png" alt="Pro Fix professional technician" />
            <div className="auth-brand-overlay" />
            <div className="auth-brand-grid-lines" />

            <div className="auth-brand-content">
              <div className="auth-brand-mark">
                <div className="auth-brand-logo-wrap">
                  <img src="/favicon.svg" alt="Pro Fix logo" width={28} height={28} style={{ borderRadius: 6 }} />
                </div>
                <span className="auth-brand-name">Pro Fix</span>
                <div className="auth-verified-tag"><Star size={10} fill="currentColor" /> Trusted</div>
              </div>

              <h2 className="auth-headline">
                Book trusted<br />
                <span className="auth-headline-accent">home services</span><br />
                in minutes.
              </h2>

              <p className="auth-brand-sub">
                From AC repair to plumbing — background‑verified pros, upfront pricing, and 1–2 hour response times. Every job backed by our 30‑day warranty.
              </p>

              {/* Metric cards */}
              <div className="auth-metrics-row">
                <div className="auth-metric-card">
                  <span className="auth-metric-val"><span className="counter-1">0</span></span>
                  <span className="auth-metric-lbl">Expert pros</span>
                </div>
                <div className="auth-metric-card">
                  <span className="auth-metric-val"><span className="counter-2">0</span></span>
                  <span className="auth-metric-lbl">Jobs done</span>
                </div>
                <div className="auth-metric-card">
                  <span className="auth-metric-val">⭐ <span className="counter-3">0.0</span></span>
                  <span className="auth-metric-lbl">Avg rating</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="auth-trust-badges">
                <div className="auth-trust-badge">
                  <div className="auth-trust-icon"><Shield size={14} color="#7ba6e0" /></div>
                  Background-verified professionals only
                </div>
                <div className="auth-trust-badge">
                  <div className="auth-trust-icon"><Zap size={14} color="#7ba6e0" /></div>
                  1–2 hour guaranteed response time
                </div>
                <div className="auth-trust-badge">
                  <div className="auth-trust-icon"><Award size={14} color="#7ba6e0" /></div>
                  30-day service warranty on all jobs
                </div>
                <div className="auth-trust-badge">
                  <div className="auth-trust-icon"><Clock size={14} color="#7ba6e0" /></div>
                  Available Mon–Sun, 8 AM – 9 PM
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form Panel ── */}
          <div className="auth-form-panel">
            <div className="auth-mobile-brand">
              <div className="auth-brand-logo-wrap" style={{ width: 34, height: 34 }}>
                <img src="/favicon.svg" alt="" width={20} height={20} />
              </div>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', letterSpacing: '-0.02em' }}>Pro Fix</span>
            </div>

            <div ref={formRef} className="auth-form-card">
              <div className="auth-form-inner">
                {/* Mode tabs */}
                <div className="auth-mode-tabs">
                  <button type="button" className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
                    onClick={() => animateFormChange(() => { setMode('signin'); setRole(null); })}>
                    Sign in
                  </button>
                  <button type="button" className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                    onClick={() => animateFormChange(() => { setMode('signup'); setRole(null); })}>
                    Create account
                  </button>
                </div>

                {/* ─── SIGN IN ─── */}
                {mode === 'signin' && (
                  <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <h2 className="auth-form-title">Welcome back</h2>
                      <p className="auth-form-sub signin-subtitle">
                        {isBizRole ? 'Sign in to manage your business' : 'Sign in to find services near you'}
                      </p>
                    </div>

                    {/* Role toggle — blue ↔ red */}
                    <div className="role-slider-wrap role-toggle-container">
                      <div className="role-slider-pill" />
                      <button type="button" className={`role-toggle-btn ${!isBizRole ? 'active' : ''}`}
                        onClick={() => handleRoleSwitch('customer')}>
                        <Search size={15} className="role-icon" /> Customer
                      </button>
                      <button type="button" className={`role-toggle-btn ${isBizRole ? 'active' : ''}`}
                        onClick={() => handleRoleSwitch('business')}>
                        <Store size={15} className="role-icon" /> Business
                      </button>
                    </div>

                    <div className="signin-fields" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div className="auth-field">
                        <label className="auth-label"><Mail size={13} /> Email</label>
                        <div style={{ position: 'relative' }}>
                          <input className="form-input-auth" type="email" placeholder="your@email.com"
                            value={signInForm.email} onChange={e => setSignInForm(p => ({ ...p, email: e.target.value }))} required />
                        </div>
                      </div>
                      <div className="auth-field">
                        <label className="auth-label"><Lock size={13} /> Password</label>
                        <div style={{ position: 'relative' }}>
                          <input className="form-input-auth" type={showPwd ? 'text' : 'password'} placeholder="Enter your password"
                            value={signInForm.password} onChange={e => setSignInForm(p => ({ ...p, password: e.target.value }))} required />
                          <button type="button" className="auth-eye" onClick={togglePwd} tabIndex={-1}>
                            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className={`auth-submit ${isBizRole ? 'biz' : 'cust'}`} disabled={submitting}>
                      {submitting
                        ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span className="auth-spinner" /> Signing in...</span>
                        : 'Sign In'}
                    </button>
                    <p className="auth-switch">Don't have an account? <button type="button" className="auth-link" onClick={() => animateFormChange(() => setMode('signup'))}>Create one</button></p>
                  </form>
                )}

                {/* ─── SIGN UP: Role Selection ─── */}
                {mode === 'signup' && !role && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <h2 className="auth-form-title">Create account</h2>
                      <p className="auth-form-sub">Choose how you'd like to use Pro Fix</p>
                    </div>
                    <div className="auth-roles">
                      <button className="auth-role-card" onClick={() => animateFormChange(() => setRole('customer'))}>
                        <div className="auth-role-icon" style={{ background: 'rgba(0,60,137,0.06)' }}><Search size={28} color="#003c89" /></div>
                        <h3 className="auth-role-title">I'm a Customer</h3>
                        <p className="auth-role-desc">Find trusted providers near you</p>
                        <div className="auth-role-feats">
                          <span><CheckCircle size={13} color="#003c89" /> Search services</span>
                          <span><CheckCircle size={13} color="#003c89" /> Read reviews</span>
                          <span><CheckCircle size={13} color="#003c89" /> Contact pros</span>
                        </div>
                        <span className="auth-role-cta" style={{ color: '#003c89' }}>Get Started <ArrowRight size={15} /></span>
                      </button>
                      <button className="auth-role-card" onClick={() => animateFormChange(() => setRole('business'))}>
                        <div className="auth-role-icon" style={{ background: 'rgba(177,45,0,0.06)' }}><Store size={28} color="#b12d00" /></div>
                        <h3 className="auth-role-title">I'm a Business</h3>
                        <p className="auth-role-desc">List your business, reach customers</p>
                        <div className="auth-role-feats">
                          <span><CheckCircle size={13} color="#b12d00" /> Free listing</span>
                          <span><CheckCircle size={13} color="#b12d00" /> Get leads</span>
                          <span><CheckCircle size={13} color="#b12d00" /> Manage profile</span>
                        </div>
                        <span className="auth-role-cta" style={{ color: '#b12d00' }}>List Business <ArrowRight size={15} /></span>
                      </button>
                    </div>
                    <p className="auth-switch">Already have an account? <button type="button" className="auth-link" onClick={() => animateFormChange(() => setMode('signin'))}>Sign in</button></p>
                  </div>
                )}

                {/* ─── SIGN UP: Customer ─── */}
                {mode === 'signup' && role === 'customer' && (
                  <form onSubmit={handleCustomerSignup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button type="button" className="auth-back" onClick={() => animateFormChange(() => setRole(null))}>← Choose role</button>
                    <div><h2 className="auth-form-title">Customer Sign Up</h2><p className="auth-form-sub">Create your free account</p></div>
                    <div className="auth-field"><label className="auth-label"><User size={13} /> Full Name</label><div><input className="form-input-auth" type="text" placeholder="Rahul Kumar" value={custForm.name} onChange={e => setCustForm(p => ({ ...p, name: e.target.value }))} required /></div></div>
                    <div className="auth-field"><label className="auth-label"><Mail size={13} /> Email</label><div><input className="form-input-auth" type="email" placeholder="your@email.com" value={custForm.email} onChange={e => setCustForm(p => ({ ...p, email: e.target.value }))} required /></div></div>
                    <div className="auth-field"><label className="auth-label"><Phone size={13} /> Phone (optional)</label><div><input className="form-input-auth" type="tel" placeholder="+91 98765 43210" value={custForm.phone} onChange={e => setCustForm(p => ({ ...p, phone: e.target.value }))} /></div></div>
                    <div className="auth-row">
                      <div className="auth-field"><label className="auth-label"><Lock size={13} /> Password</label><div style={{ position: 'relative' }}><input className="form-input-auth" type={showPwd ? 'text' : 'password'} placeholder="Min 6 chars" value={custForm.password} onChange={e => setCustForm(p => ({ ...p, password: e.target.value }))} required /><button type="button" className="auth-eye" onClick={togglePwd} tabIndex={-1}>{showPwd ? <EyeOff size={14} /> : <Eye size={14} />}</button></div></div>
                      <div className="auth-field"><label className="auth-label"><Lock size={13} /> Confirm</label><div><input className="form-input-auth" type={showPwd ? 'text' : 'password'} placeholder="Repeat" value={custForm.confirm} onChange={e => setCustForm(p => ({ ...p, confirm: e.target.value }))} required /></div></div>
                    </div>
                    <button type="submit" className="auth-submit cust" disabled={submitting}>
                      {submitting ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span className="auth-spinner" /> Creating...</span> : 'Create Account'}
                    </button>
                    <p className="auth-switch">Already have an account? <button type="button" className="auth-link" onClick={() => animateFormChange(() => setMode('signin'))}>Sign in</button></p>
                  </form>
                )}

                {/* ─── SIGN UP: Business ─── */}
                {mode === 'signup' && role === 'business' && (
                  <form onSubmit={handleBusinessSignup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button type="button" className="auth-back" onClick={() => animateFormChange(() => setRole(null))}>← Choose role</button>
                    <div><h2 className="auth-form-title">Business Registration</h2><p className="auth-form-sub">List your service business on Pro Fix</p></div>

                    <div className="auth-section-lbl"><Store size={13} /> Business Details</div>
                    <div className="auth-field"><label className="auth-label"><Store size={13} /> Business Name *</label><div><input className="form-input-auth" type="text" placeholder="Kumar AC Services" value={bizForm.businessName} onChange={e => setBizForm(p => ({ ...p, businessName: e.target.value }))} required /></div></div>
                    <div className="auth-field"><label className="auth-label"><User size={13} /> Owner Name *</label><div><input className="form-input-auth" type="text" placeholder="Rajesh Kumar" value={bizForm.ownerName} onChange={e => setBizForm(p => ({ ...p, ownerName: e.target.value }))} required /></div></div>
                    <div className="auth-row">
                      <div className="auth-field"><label className="auth-label"><Mail size={13} /> Email *</label><div><input className="form-input-auth" type="email" placeholder="biz@email.com" value={bizForm.email} onChange={e => setBizForm(p => ({ ...p, email: e.target.value }))} required /></div></div>
                      <div className="auth-field"><label className="auth-label"><Phone size={13} /> Phone *</label><div><input className="form-input-auth" type="tel" placeholder="+91 98765" value={bizForm.phone} onChange={e => setBizForm(p => ({ ...p, phone: e.target.value }))} required /></div></div>
                    </div>
                    <div className="auth-field"><label className="auth-label"><Phone size={13} /> WhatsApp (optional)</label><div><input className="form-input-auth" type="tel" placeholder="Same as phone if empty" value={bizForm.whatsappNumber} onChange={e => setBizForm(p => ({ ...p, whatsappNumber: e.target.value }))} /></div></div>

                    <div className="auth-section-lbl"><Wrench size={13} /> Services Offered *</div>
                    <div className="auth-chips">
                      {SERVICE_OPTIONS.map(opt => { const Icon = opt.icon; return (
                        <button key={opt.value} type="button" onClick={() => toggleBizService(opt.value)} className={`auth-chip ${bizForm.services.includes(opt.value) ? 'on' : ''}`}>
                          <Icon size={14} /> {opt.label}
                        </button>
                      ); })}
                    </div>
                    <div className="auth-field"><label className="auth-label"><Wrench size={13} /> Description</label><textarea className="form-input-auth" rows="2" style={{ resize: 'vertical' }} placeholder="Tell customers about your business..." value={bizForm.description} onChange={e => setBizForm(p => ({ ...p, description: e.target.value }))} /></div>

                    <div className="auth-section-lbl"><MapPin size={13} /> Address & Location</div>
                    <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>Tap below to auto-detect your shop's GPS location.</p>
                    <button type="button" disabled={detectingLocation} onClick={() => {
                      if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
                      setDetectingLocation(true); setDetectedAddress('');
                      navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                          const lat = pos.coords.latitude, lng = pos.coords.longitude;
                          let au = {};
                          try {
                            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=en`);
                            const g = await r.json();
                            setDetectedAddress(g.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                            if (g.address) {
                              const a = g.address;
                              const sp = [a.house_number, a.building, a.road, a.neighbourhood, a.suburb, a.hamlet, a.residential, a.locality].filter(Boolean);
                              const city = a.city || a.town || a.village || a.state_district || a.county || '';
                              let street = sp.join(', ');
                              if (!street && g.display_name) { const ps = g.display_name.split(',').map(p => p.trim()); const sk = [city, a.state, a.country, a.postcode, a.country_code].filter(Boolean).map(w => w.toLowerCase()); street = ps.filter(p => !sk.includes(p.toLowerCase())).slice(0, 2).join(', '); }
                              au = { street, city, state: a.state || '', pincode: a.postcode || '' };
                            }
                          } catch { setDetectedAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`); }
                          setBizForm(prev => ({ ...prev, latitude: String(lat), longitude: String(lng), address: { ...prev.address, ...au } }));
                          setDetectingLocation(false); toast.success('Location & address detected!');
                        },
                        (err) => { setDetectingLocation(false); toast.error(err.code === 1 ? 'Location denied' : 'Location failed'); },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
                      );
                    }} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      width: '100%', padding: '13px 18px', borderRadius: 12,
                      border: '2px dashed var(--color-primary, #003c89)',
                      background: 'rgba(0,60,137,0.04)', color: 'var(--color-primary, #003c89)',
                      fontWeight: 700, fontSize: '0.9rem', cursor: detectingLocation ? 'wait' : 'pointer',
                      fontFamily: 'Inter, sans-serif', transition: 'all 0.25s ease',
                      opacity: detectingLocation ? 0.75 : 1,
                    }}>
                      {detectingLocation ? <><Loader size={17} style={{ animation: 'spin 1s linear infinite' }} /> Detecting...</> : <><LocateFixed size={17} /> {bizForm.latitude ? 'Re-detect Location' : 'Detect My Location'}</>}
                    </button>

                    {bizForm.latitude && bizForm.longitude && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', marginTop: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><CheckCircle size={15} color="#16a34a" /><strong style={{ fontSize: '0.84rem', color: '#166534' }}>Location detected</strong></div>
                        {detectedAddress && <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>📍 {detectedAddress}</p>}
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{parseFloat(bizForm.latitude).toFixed(5)}, {parseFloat(bizForm.longitude).toFixed(5)}</p>
                      </div>
                    )}

                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>{bizForm.latitude ? 'Auto-filled. Edit if needed.' : 'Or enter address manually below.'}</p>
                    <div className="auth-field"><label className="auth-label">Street / Area</label><div><input className="form-input-auth" type="text" placeholder="Shop No. 5, Main Road" value={bizForm.address.street} onChange={e => setBizForm(p => ({ ...p, address: { ...p.address, street: e.target.value } }))} /></div></div>
                    <div className="auth-row">
                      <div className="auth-field"><label className="auth-label">City</label><div><input className="form-input-auth" type="text" placeholder="New Delhi" value={bizForm.address.city} onChange={e => setBizForm(p => ({ ...p, address: { ...p.address, city: e.target.value } }))} /></div></div>
                      <div className="auth-field"><label className="auth-label">Pincode</label><div><input className="form-input-auth" type="text" placeholder="110001" value={bizForm.address.pincode} onChange={e => setBizForm(p => ({ ...p, address: { ...p.address, pincode: e.target.value } }))} /></div></div>
                    </div>

                    <div className="auth-section-lbl"><Lock size={13} /> Account Security</div>
                    <div className="auth-row">
                      <div className="auth-field"><label className="auth-label"><Lock size={13} /> Password *</label><div style={{ position: 'relative' }}><input className="form-input-auth" type={showPwd ? 'text' : 'password'} placeholder="Min 6 chars" value={bizForm.password} onChange={e => setBizForm(p => ({ ...p, password: e.target.value }))} required /><button type="button" className="auth-eye" onClick={togglePwd} tabIndex={-1}>{showPwd ? <EyeOff size={14} /> : <Eye size={14} />}</button></div></div>
                      <div className="auth-field"><label className="auth-label"><Lock size={13} /> Confirm *</label><div><input className="form-input-auth" type={showPwd ? 'text' : 'password'} placeholder="Repeat" value={bizForm.confirm} onChange={e => setBizForm(p => ({ ...p, confirm: e.target.value }))} required /></div></div>
                    </div>

                    <button type="submit" className="auth-submit biz" disabled={submitting}>
                      {submitting ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><span className="auth-spinner" /> Registering...</span> : 'Register Business'}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0' }}>Your listing will be reviewed by our admin team.</p>
                    <p className="auth-switch">Already have an account? <button type="button" className="auth-link" onClick={() => animateFormChange(() => setMode('signin'))}>Sign in</button></p>
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

export default AuthPage;
