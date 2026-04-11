import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Shield, KeyRound, CheckCircle, XCircle, Loader, ArrowLeft, MapPin } from 'lucide-react';

const STORAGE_KEY = 'profix_admin_key';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminPanel = () => {
  const [keyInput, setKeyInput] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
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

  const clearKey = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey('');
    setKeyInput('');
    setShops([]);
  };

  const fetchPending = async () => {
    if (!adminKey) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/shops/admin/pending`, {
        headers: { 'x-admin-key': adminKey },
      });
      const data = await res.json();
      if (res.status === 403) {
        setError('Invalid admin key. It must match ADMIN_KEY in your server .env file.');
        setShops([]);
        return;
      }
      if (data.success) setShops(data.shops || []);
      else setError(data.error || 'Failed to load');
    } catch {
      setError('Could not reach the server. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) fetchPending();
  }, [adminKey]);

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

  return (
    <>
      <SEO title="Admin — Approve businesses | Pro Fix" />
      <div style={styles.page}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <Link to="/" style={styles.back}>
            <ArrowLeft size={16} /> Back to site
          </Link>

          <div style={styles.hero}>
            <Shield size={40} color="var(--color-primary)" />
            <h1 style={styles.h1}>Admin — verify businesses</h1>
            <p style={styles.lead}>
              New shops register with <strong>pending</strong> status. Only <strong>approved</strong> listings appear in customer search.
              Use the same secret as <code style={styles.code}>ADMIN_KEY</code> in your backend <code style={styles.code}>.env</code>.
            </p>
          </div>

          <div style={styles.card}>
            <h2 style={styles.h2}><KeyRound size={20} /> Step 1 — Enter admin key</h2>
            <p style={styles.p}>
              On your machine, open <code style={styles.code}>pro-fix-mern/backend/.env</code> and copy the value of <code style={styles.code}>ADMIN_KEY</code>.
              Paste it here (stored only in this browser session until you refresh or clear).
            </p>
            <form onSubmit={saveKey} style={styles.formRow}>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Admin key"
                style={styles.input}
                className="form-input-auth"
              />
              <button type="submit" className="btn-secondary" style={styles.btn}>
                Save key
              </button>
              {adminKey ? (
                <button type="button" onClick={clearKey} style={styles.ghostBtn}>
                  Clear
                </button>
              ) : null}
            </form>
            {adminKey ? (
              <p style={{ ...styles.ok, marginTop: '12px' }}>Key saved for this session. Pending shops load below.</p>
            ) : null}
          </div>

          <div style={styles.card}>
            <h2 style={styles.h2}>Step 2 — Pending shops</h2>
            <p style={styles.p}>
              Review each business. <strong>Approve</strong> to make them discoverable on Find Services. <strong>Reject</strong> keeps them hidden.
            </p>
            <button type="button" onClick={fetchPending} disabled={loading || !adminKey} style={styles.refresh}>
              {loading ? <Loader size={16} className="spin" /> : null} Refresh list
            </button>
            {error ? <p style={styles.err}>{error}</p> : null}

            {!adminKey ? (
              <p style={styles.muted}>Enter the admin key above to load pending registrations.</p>
            ) : loading && shops.length === 0 ? (
              <p style={styles.muted}>Loading…</p>
            ) : shops.length === 0 ? (
              <p style={styles.muted}>No pending shops. You’re all caught up.</p>
            ) : (
              <ul style={styles.list}>
                {shops.map((s) => (
                  <li key={s._id} style={styles.row}>
                    <div>
                      <strong>{s.businessName}</strong>
                      <div style={styles.meta}>{s.email} · {s.phone}</div>
                      {s.address?.city ? (
                        <div style={styles.meta}>
                          <MapPin size={14} style={{ verticalAlign: 'middle' }} /> {s.address.city}
                          {s.address.state ? `, ${s.address.state}` : ''}
                        </div>
                      ) : null}
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

          <p style={styles.foot}>
            Alternative: use{' '}
            <a href="https://www.postman.com/" target="_blank" rel="noreferrer">Postman</a> or curl with header{' '}
            <code style={styles.code}>x-admin-key: YOUR_KEY</code> — <code style={styles.code}>GET /api/shops/admin/pending</code> and{' '}
            <code style={styles.code}>PUT /api/shops/:id/approve</code> with body <code style={styles.code}>{'{"approved":true}'}</code>.
          </p>
        </div>
      </div>
      <style>{`.spin{animation:spin 0.8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
};

const styles = {
  page: {
    padding: 'clamp(32px, 5vw, 64px) 0',
    backgroundColor: 'var(--color-surface)',
    minHeight: 'calc(100vh - 84px)',
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--color-primary)',
    fontWeight: '700',
    textDecoration: 'none',
    marginBottom: '24px',
  },
  hero: { marginBottom: '28px' },
  h1: { fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '12px 0 8px' },
  lead: { fontSize: '1.05rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.6, margin: 0 },
  code: {
    background: 'var(--color-surface-container)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.9em',
  },
  card: {
    background: 'var(--color-surface-container-lowest)',
    border: '1px solid var(--color-surface-container)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
  },
  h2: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', margin: '0 0 12px' },
  p: { margin: '0 0 12px', color: 'var(--color-on-surface-variant)', lineHeight: 1.55 },
  formRow: { display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' },
  input: { flex: '1 1 220px', minWidth: '200px', padding: '12px 14px' },
  btn: { padding: '12px 20px' },
  ghostBtn: {
    padding: '12px 16px',
    border: '2px solid var(--color-surface-container-high)',
    background: 'transparent',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  ok: { color: '#166534', fontWeight: '600', fontSize: '0.9rem' },
  refresh: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '2px solid var(--color-primary)',
    background: 'transparent',
    color: 'var(--color-primary)',
    fontWeight: '700',
    cursor: 'pointer',
  },
  err: { color: '#b91c1c', marginBottom: '12px' },
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
  meta: { fontSize: '0.85rem', color: 'var(--color-on-surface-variant)', marginTop: '4px' },
  actions: { display: 'flex', gap: '8px' },
  approve: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    background: '#16a34a',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
  },
  reject: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '2px solid #fecaca',
    background: '#fef2f2',
    color: '#b91c1c',
    fontWeight: '700',
    cursor: 'pointer',
  },
  foot: { fontSize: '0.85rem', color: 'var(--color-outline)', lineHeight: 1.6 },
};

export default AdminPanel;
