import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { Shield, CheckCircle, XCircle, Loader, ArrowLeft, MapPin, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminPanel = () => {
  const { token, isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/auth', { replace: true });
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  const fetchPending = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/shops/admin/pending`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        setError('Access denied. You do not have admin privileges.');
        return;
      }
      if (data.success) setShops(data.shops || []);
      else setError(data.error || 'Failed to load');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && isAdmin) fetchPending();
  }, [token, isAdmin, fetchPending]);

  const setApproval = async (id, approved) => {
    setActionId(id);
    try {
      const res = await fetch(`${API_URL}/api/shops/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ approved }),
      });
      const data = await res.json();
      if (data.success) {
        setShops((prev) => prev.filter((s) => s._id !== id));
      } else {
        setError(data.error || 'Action failed');
      }
    } catch {
      setError('Request failed');
    } finally {
      setActionId(null);
    }
  };

  // Show nothing while auth is loading
  if (authLoading) {
    return (
      <div style={styles.gatePage}>
        <Loader size={32} className="spin" style={{ color: 'var(--color-primary)' }} />
        <style>{`.spin{animation:spin 0.8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // Access denied for non-admins
  if (!isAdmin) {
    return (
      <div style={styles.gatePage}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <AlertTriangle size={48} color="#dc2626" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#1e293b' }}>Access Denied</h2>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>
            You do not have admin privileges. Please sign in with an admin account.
          </p>
          <Link to="/auth" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '10px',
            backgroundColor: 'var(--color-primary)', color: '#fff',
            fontWeight: '700', textDecoration: 'none',
          }}>
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin Console" />
      <div style={styles.page}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Link to="/" style={styles.back}>
              <ArrowLeft size={16} /> Exit Admin
            </Link>
          </div>

          <div style={styles.hero}>
            <Shield size={40} color="var(--color-primary)" />
            <h1 style={styles.h1}>Admin Console</h1>
            <p style={styles.lead}>
              Review pending business registrations.
            </p>
          </div>

          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={styles.h2}>Pending Verification</h2>
              <button type="button" onClick={fetchPending} disabled={loading} style={styles.refresh}>
                {loading ? <Loader size={16} className="spin" /> : null} Refresh
              </button>
            </div>
            
            {error ? <p style={styles.err}>{error}</p> : null}

            {loading && shops.length === 0 ? (
              <p style={styles.muted}>Loading…</p>
            ) : shops.length === 0 ? (
              <p style={styles.muted}>No pending shops. You're all caught up.</p>
            ) : (
              <ul style={styles.list}>
                {shops.map((s) => (
                  <li key={s._id} style={styles.row}>
                    <div>
                      <strong>{s.businessName}</strong>
                      <div style={styles.meta}>Owner: {s.ownerName} | Email: {s.email} | Phone: {s.phone}</div>
                      {s.address?.city ? (
                        <div style={styles.meta}>
                          <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 
                          {s.address.street ? `${s.address.street}, ` : ''}{s.address.city}
                          {s.address.state ? `, ${s.address.state}` : ''}
                          {s.address.pincode ? ` - ${s.address.pincode}` : ''}
                        </div>
                      ) : null}
                      <div style={styles.meta}>Services: {s.services?.join(', ')}</div>
                    </div>
                    <div style={styles.actions}>
                      <button
                        type="button"
                        onClick={() => setApproval(s._id, true)}
                        disabled={actionId === s._id}
                        style={styles.approve}
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setApproval(s._id, false)}
                        disabled={actionId === s._id}
                        style={styles.reject}
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <style>{`.spin{animation:spin 0.8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

const styles = {
  gatePage: {
    minHeight: 'calc(100vh - 84px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  page: {
    padding: 'clamp(32px, 5vw, 64px) 0',
    backgroundColor: 'var(--color-surface)',
    minHeight: 'calc(100vh - 84px)',
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--color-on-surface-variant)',
    fontWeight: '600',
    textDecoration: 'none',
  },
  hero: { marginBottom: '28px' },
  h1: { fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '12px 0 8px' },
  lead: { fontSize: '1.05rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.6, margin: 0 },
  card: {
    background: 'var(--color-surface-container-lowest)',
    border: '1px solid var(--color-surface-container)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
  },
  h2: { 
    fontSize: '1.15rem', 
    margin: 0,
  },
  refresh: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid var(--color-primary)',
    background: 'transparent',
    color: 'var(--color-primary)',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  err: { color: '#b91c1c', marginBottom: '12px', fontWeight: '500' },
  muted: { color: 'var(--color-outline)' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    padding: '16px 0',
    borderBottom: '1px solid var(--color-surface-container)',
  },
  meta: { fontSize: '0.85rem', color: 'var(--color-on-surface-variant)', marginTop: '6px' },
  actions: { display: 'flex', gap: '8px', alignItems: 'flex-start' },
  approve: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    background: '#16a34a',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  reject: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid #fca5a5',
    background: '#fef2f2',
    color: '#b91c1c',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default AdminPanel;
