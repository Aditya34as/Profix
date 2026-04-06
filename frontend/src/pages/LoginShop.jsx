import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, LogIn } from 'lucide-react';

const LoginShop = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Shop Login | Pro Fix" description="Login to your Pro Fix business dashboard." />

      <div style={styles.page}>
        <div className="animate-fade-in-up" style={styles.card}>
          <div style={styles.iconCircle}>
            <LogIn size={28} color="var(--color-primary)" />
          </div>
          
          <h1 style={styles.title}>Shop Owner Login</h1>
          <p style={styles.subtitle}>Access your business dashboard</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}><Mail size={16} /> Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                className="form-input-auth"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}><Lock size={16} /> Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                className="form-input-auth"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-secondary"
              style={styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={styles.registerPrompt}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Register your business</Link>
          </p>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: 'calc(100vh - 84px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: 'var(--color-surface)',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    padding: 'clamp(32px, 5vw, 48px)',
    backgroundColor: 'var(--color-surface-container-lowest)',
    borderRadius: '24px',
    border: '1px solid var(--color-surface-container)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
    textAlign: 'center',
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(0, 60, 137, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  title: {
    fontSize: '1.6rem',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--color-on-surface-variant)',
    marginBottom: '32px',
    fontSize: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    textAlign: 'left',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '700',
    fontSize: '0.85rem',
    color: 'var(--color-on-surface-variant)',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '10px',
    border: '2px solid var(--color-surface-container)',
    backgroundColor: 'var(--color-surface-container-low)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    color: 'var(--color-on-surface)',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  submitBtn: {
    padding: '16px',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '700',
    marginTop: '8px',
  },
  registerPrompt: {
    marginTop: '24px',
    color: 'var(--color-on-surface-variant)',
    fontSize: '0.9rem',
  },
};

export default LoginShop;
