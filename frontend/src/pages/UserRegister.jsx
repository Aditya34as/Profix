import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';

const UserRegister = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email, and password are required');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      if (result.success) {
        toast.success('Account created! Welcome to Pro Fix 🎉');
        navigate('/find-services');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Create Account | Pro Fix" description="Sign up for Pro Fix to discover and book trusted local service providers." />

      <div style={styles.page}>
        <div className="animate-fade-in-up" style={styles.card}>
          <div style={styles.iconCircle}>
            <UserPlus size={28} color="var(--color-primary)" />
          </div>

          <h1 style={styles.title}>Create Your Account</h1>
          <p style={styles.subtitle}>Join Pro Fix to discover trusted local services</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}><User size={16} /> Full Name</label>
              <input
                id="user-register-name"
                type="text"
                placeholder="Rahul Kumar"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                style={styles.input}
                className="form-input-auth"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Mail size={16} /> Email</label>
              <input
                id="user-register-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                style={styles.input}
                className="form-input-auth"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}><Phone size={16} /> Phone <span style={{ fontWeight: '400', color: 'var(--color-outline)' }}>(optional)</span></label>
              <input
                id="user-register-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                style={styles.input}
                className="form-input-auth"
              />
            </div>

            <div style={styles.fieldRow}>
              <div style={styles.field}>
                <label style={styles.label}><Lock size={16} /> Password</label>
                <input
                  id="user-register-password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  style={styles.input}
                  className="form-input-auth"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}><Lock size={16} /> Confirm</label>
                <input
                  id="user-register-confirm"
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  style={styles.input}
                  className="form-input-auth"
                  required
                />
              </div>
            </div>

            <button
              id="user-register-submit"
              type="submit"
              className="btn-secondary"
              style={styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={styles.loginPrompt}>
            Already have an account? <Link to="/user/login" style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Sign in</Link>
          </p>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>

          <p style={styles.businessPrompt}>
            Want to list your business? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Register as a Business →</Link>
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
    maxWidth: '480px',
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
    flex: 1,
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
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
  loginPrompt: {
    marginTop: '24px',
    color: 'var(--color-on-surface-variant)',
    fontSize: '0.9rem',
  },
  divider: {
    position: 'relative',
    margin: '24px 0 16px',
    borderBottom: '1px solid var(--color-surface-container)',
  },
  dividerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'var(--color-surface-container-lowest)',
    padding: '0 16px',
    color: 'var(--color-outline)',
    fontSize: '0.85rem',
  },
  businessPrompt: {
    marginTop: '16px',
    color: 'var(--color-on-surface-variant)',
    fontSize: '0.9rem',
  },
};

export default UserRegister;
