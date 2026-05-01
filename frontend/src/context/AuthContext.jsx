import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ─── Idle timeout config ─── */
const IDLE_LIMIT_MS = 8 * 60 * 1000;       // 8 minutes
const WARNING_BEFORE_MS = 60 * 1000;        // show warning 1 min before logout
const WARNING_MS = IDLE_LIMIT_MS - WARNING_BEFORE_MS; // 7 min idle → show warning

/* ─── Idle Timeout Warning Modal (inline, no deps) ─── */
const IdleWarningModal = ({ secondsLeft, onStayLoggedIn, onLogout }) => (
  <>
    <style>{`
      @keyframes idle-fade-in {
        from { opacity: 0; transform: scale(0.94); }
        to   { opacity: 1; transform: scale(1); }
      }
      @keyframes idle-bar {
        from { width: 100%; }
        to   { width: 0%; }
      }
      .idle-modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(5,7,20,0.72);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .idle-modal-box {
        background: #fff;
        border-radius: 20px;
        padding: 36px 32px 28px;
        max-width: 400px;
        width: 100%;
        box-shadow: 0 24px 80px rgba(5,7,20,0.35), 0 0 0 1px rgba(99,102,241,0.12);
        animation: idle-fade-in 0.3s cubic-bezier(0.16,1,0.3,1);
        text-align: center;
      }
      .idle-icon-wrap {
        width: 64px; height: 64px;
        border-radius: 50%;
        background: rgba(239,68,68,0.08);
        border: 2px solid rgba(239,68,68,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 28px;
      }
      .idle-title {
        font-size: 1.25rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 8px;
        letter-spacing: -0.03em;
      }
      .idle-desc {
        font-size: 0.9rem;
        color: #64748b;
        margin: 0 0 24px;
        line-height: 1.55;
      }
      .idle-countdown {
        font-size: 2.2rem;
        font-weight: 900;
        color: #ef4444;
        letter-spacing: -0.05em;
        line-height: 1;
        margin-bottom: 6px;
      }
      .idle-countdown-label {
        font-size: 0.78rem;
        color: #94a3b8;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 24px;
      }
      .idle-progress-track {
        height: 4px;
        background: #f1f5f9;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 28px;
      }
      .idle-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #6366f1, #ef4444);
        border-radius: 4px;
        transition: width 1s linear;
      }
      .idle-btn-row {
        display: flex;
        gap: 10px;
      }
      .idle-btn-stay {
        flex: 1;
        padding: 13px 16px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.25s;
        box-shadow: 0 4px 16px rgba(99,102,241,0.3);
      }
      .idle-btn-stay:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
      .idle-btn-logout {
        flex: 1;
        padding: 13px 16px;
        border-radius: 12px;
        border: 1.5px solid #e2e8f0;
        background: transparent;
        color: #ef4444;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.25s;
      }
      .idle-btn-logout:hover { background: rgba(239,68,68,0.06); border-color: #ef4444; }
    `}</style>
    <div className="idle-modal-overlay">
      <div className="idle-modal-box">
        <div className="idle-icon-wrap">⏱️</div>
        <h2 className="idle-title">Still there?</h2>
        <p className="idle-desc">
          You've been inactive for a while. For your security, you'll be automatically signed out in:
        </p>
        <div className="idle-countdown">{secondsLeft}s</div>
        <div className="idle-countdown-label">seconds remaining</div>
        <div className="idle-progress-track">
          <div
            className="idle-progress-bar"
            style={{ width: `${(secondsLeft / 60) * 100}%` }}
          />
        </div>
        <div className="idle-btn-row">
          <button className="idle-btn-stay" onClick={onStayLoggedIn}>
            Stay Logged In
          </button>
          <button className="idle-btn-logout" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </>
);

export const AuthProvider = ({ children }) => {
  const [shop, setShop] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('profix_token'));
  const [role, setRole] = useState(localStorage.getItem('profix_role'));
  const [loading, setLoading] = useState(true);

  /* ─── Skip fetchMe after fresh login/register (profile already in response) ─── */
  const skipFetchRef = useRef(false);

  /* ─── Idle timeout state ─── */
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const [idleSecondsLeft, setIdleSecondsLeft] = useState(60);
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const countdownRef = useRef(null);

  // On mount, verify token and load profile (skip if login/register just set it)
  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      setLoading(false);
      return;
    }
    if (token && role) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      if (role === 'shop') {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setShop(data.shop);
        } else {
          logout();
        }
      } else if (role === 'customer' || role === 'admin') {
        const res = await fetch(`${API_URL}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          if (data.role === 'admin' && role !== 'admin') {
            setRole('admin');
            localStorage.setItem('profix_role', 'admin');
          }
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────────────
     IDLE TIMEOUT — 8 minutes
  ──────────────────────────────────────────── */
  const clearAllTimers = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    clearTimeout(warningTimerRef.current);
    clearInterval(countdownRef.current);
  }, []);

  const doLogout = useCallback(() => {
    clearAllTimers();
    setShowIdleWarning(false);
    logout();
  }, []); // eslint-disable-line

  const resetIdleTimer = useCallback(() => {
    // Only track idle if authenticated
    if (!localStorage.getItem('profix_token')) return;

    clearAllTimers();
    setShowIdleWarning(false);

    // After 7 min idle → show warning modal
    warningTimerRef.current = setTimeout(() => {
      setShowIdleWarning(true);
      setIdleSecondsLeft(60);

      // Countdown tick
      countdownRef.current = setInterval(() => {
        setIdleSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // After another 1 min (total 8 min) → auto logout
      idleTimerRef.current = setTimeout(() => {
        doLogout();
      }, WARNING_BEFORE_MS);
    }, WARNING_MS);
  }, [clearAllTimers, doLogout]);

  // Attach activity listeners when authenticated
  useEffect(() => {
    if (!token) {
      clearAllTimers();
      setShowIdleWarning(false);
      return;
    }

    const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    const handler = () => resetIdleTimer();

    EVENTS.forEach(e => window.addEventListener(e, handler, { passive: true }));
    resetIdleTimer(); // start immediately on login

    return () => {
      EVENTS.forEach(e => window.removeEventListener(e, handler));
      clearAllTimers();
    };
  }, [token, resetIdleTimer, clearAllTimers]);

  const handleStayLoggedIn = useCallback(() => {
    clearAllTimers();
    setShowIdleWarning(false);
    resetIdleTimer();
  }, [clearAllTimers, resetIdleTimer]);

  /* ——— Shop Owner Auth ——— */
  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      skipFetchRef.current = true; // profile already in response — skip fetchMe
      localStorage.setItem('profix_token', data.token);
      localStorage.setItem('profix_role', 'shop');
      setToken(data.token);
      setRole('shop');
      setShop(data.shop);
      setUser(null);
      setLoading(false);
    }
    return data;
  };

  const register = async (formData) => {
    const { confirmPassword: _c, confirm: _cf, ...rest } = formData;
    const payload = {
      businessName: rest.businessName?.trim(),
      ownerName: rest.ownerName?.trim(),
      email: rest.email?.trim(),
      password: rest.password,
      phone: rest.phone?.trim(),
      whatsappNumber: (rest.whatsappNumber || '').trim(),
      services: rest.services,
      address: rest.address || {},
      description: (rest.description || '').trim(),
      openingHours: rest.openingHours || 'Mon-Sat 8AM-8PM',
      latitude: rest.latitude || '',
      longitude: rest.longitude || '',
    };
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('profix_token', data.token);
      localStorage.setItem('profix_role', 'shop');
      setToken(data.token);
      setRole('shop');
      setShop(data.shop);
      setUser(null);
    }
    return data;
  };

  /* ——— Customer Auth ——— */
  const loginUser = async (email, password) => {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      const userRole = data.role || 'customer';
      skipFetchRef.current = true; // profile already in response — skip fetchMe
      localStorage.setItem('profix_token', data.token);
      localStorage.setItem('profix_role', userRole);
      setToken(data.token);
      setRole(userRole);
      setUser(data.user);
      setShop(null);
      setLoading(false);
    }
    return data;
  };

  const registerUser = async ({ name, email, password, phone }) => {
    const res = await fetch(`${API_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name?.trim(), email: email?.trim(), password, phone: (phone || '').trim() })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('profix_token', data.token);
      localStorage.setItem('profix_role', 'customer');
      setToken(data.token);
      setRole('customer');
      setUser(data.user);
      setShop(null);
    }
    return data;
  };

  /* ——— Shared ——— */
  const logout = () => {
    clearAllTimers();
    setShowIdleWarning(false);
    localStorage.removeItem('profix_token');
    localStorage.removeItem('profix_role');
    setToken(null);
    setRole(null);
    setShop(null);
    setUser(null);
  };

  const updateShop = (updatedShop) => {
    setShop(updatedShop);
  };

  return (
    <AuthContext.Provider value={{
      shop, user, token, role, loading,
      login, register, loginUser, registerUser,
      logout, updateShop, fetchMe,
      isAuthenticated: !!token,
      isShopOwner: role === 'shop',
      isCustomer: role === 'customer' || role === 'admin',
      isAdmin: role === 'admin',
      API_URL
    }}>
      {children}

      {/* Idle timeout warning modal — rendered globally */}
      {showIdleWarning && (
        <IdleWarningModal
          secondsLeft={idleSecondsLeft}
          onStayLoggedIn={handleStayLoggedIn}
          onLogout={doLogout}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
