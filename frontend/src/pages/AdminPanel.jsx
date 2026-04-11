import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Shield, CheckCircle, XCircle, Loader, ArrowLeft, MapPin } from 'lucide-react';

const STORAGE_KEY = 'profix_admin_key';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminPanel = () => {
  const [keyInput, setKeyInput] = useState('');
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState(null);

  const saveKey = (e) => {
    e.preventDefault();
    const k = keyInput.trim();
    if (!k) return;
    sessionStorage.setItem(STORAGE_KEY, k);
    setAdminKey(k);
    setError('');
  };

  const clearKey = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey('');
    setKeyInput('');
    setShops([]);
  }, []);

  const fetchPending = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/shops/admin/pending`, {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (res.status === 403) {
        setError('Invalid admin key.');
        clearKey(); // Drop back to login
        return;
      }
      if (data.success) setShops(data.shops || []);
      else setError(data.error || 'Failed to load');
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, [adminKey, clearKey]);

  useEffect(() => {
    if (adminKey) fetchPending();
  }, [adminKey, fetchPending]);

  const setApproval = async (id, approved) => {
    setActionId(id);
    try {
      const res = await fetch(`${API_URL}/api/shops/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
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

  // The hidden gate
  if (!adminKey) {
    return (
      <div style={styles.gatePage}>
        <form onSubmit={saveKey} style={styles.gateForm}>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="System Access"
            style={styles.gateInput}
            autoFocus
          />
          <button type="submit" style={styles.gateBtn}>
            Enter
          </button>
        </form>
        {error && <p style={styles.gateError}>{error}</p>}
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
            <button onClick={clearKey} style={styles.ghostBtn}>
              Logout
            </button>
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
              <p style={styles.muted}>No pending shops. You’re all caught up.</p>
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
  gateForm: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  gateInput: {
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '1rem',
    outline: 'none',
    width: '240px',
  },
  gateBtn: {
    padding: '12px 24px',
    borderRadius: '6px',
    backgroundColor: '#111827',
    color: '#ffffff',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  gateError: {
    marginTop: '16px',
    color: '#dc2626',
    fontSize: '0.9rem',
    fontWeight: '500',
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
  ghostBtn: {
    padding: '8px 16px',
    border: '1px solid var(--color-outline-variant)',
    background: 'transparent',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem',
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
