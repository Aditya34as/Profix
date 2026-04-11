import { Link } from 'react-router-dom';
import { X, MapPin, Phone, Star, MessageCircle } from 'lucide-react';

const SERVICE_LABELS = {
  'ac-repair': 'AC Repair',
  plumbing: 'Plumbing',
  'water-heater': 'Geyser',
  cleaning: 'Cleaning',
};

const CompareModal = ({ shops, onClose, apiBase }) => {
  if (!shops?.length) return null;

  return (
    <div style={overlay} onClick={onClose} role="presentation">
      <div style={panel} onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="compare-title">
        <div style={panelHead}>
          <h2 id="compare-title" style={{ margin: 0, fontSize: '1.25rem' }}>
            Compare providers ({shops.length})
          </h2>
          <button type="button" onClick={onClose} style={closeBtn} aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: '0.9rem', color: 'var(--color-on-surface-variant)' }}>
          Compare ratings, distance, and services side by side. Tap Call or WhatsApp on a shop card, or open the full profile.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Business</th>
                <th style={th}>Rating</th>
                {shops.some((s) => s.distance != null) && <th style={th}>Distance</th>}
                <th style={th}>Services</th>
                <th style={th}>Area</th>
                <th style={th}>Contact</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop._id}>
                  <td style={td}>
                    <strong>{shop.businessName}</strong>
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      {shop.rating > 0 ? shop.rating.toFixed(1) : '—'}
                      <span style={{ color: 'var(--color-outline)', fontSize: '0.85rem' }}>
                        ({shop.totalReviews || 0})
                      </span>
                    </div>
                  </td>
                  {shops.some((s) => s.distance != null) && (
                    <td style={td}>{shop.distance != null ? `${shop.distance} km` : '—'}</td>
                  )}
                  <td style={td}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(shop.services || []).slice(0, 5).map((s) => (
                        <span key={s} style={tag}>
                          {SERVICE_LABELS[s] || s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={td}>{shop.address?.city || '—'}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <a href={`tel:${shop.phone}`} style={linkBtn}>
                        <Phone size={14} /> Call
                      </a>
                      {(shop.whatsappNumber || shop.phone) && (
                        <a
                          href={`https://wa.me/91${(shop.whatsappNumber || shop.phone).replace(/\D/g, '').slice(-10)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ ...linkBtn, background: '#25d366', color: '#fff' }}
                        >
                          <MessageCircle size={14} /> WA
                        </a>
                      )}
                      <Link to={`/shop/${shop._id}`} style={{ ...linkBtn, borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                        Profile
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.45)',
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
};

const panel = {
  background: 'var(--color-surface-container-lowest)',
  borderRadius: '16px',
  maxWidth: '960px',
  width: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  padding: '24px',
  boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
};

const panelHead = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
};

const closeBtn = {
  border: 'none',
  background: 'var(--color-surface-container)',
  borderRadius: '10px',
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.9rem',
};

const th = {
  textAlign: 'left',
  padding: '12px 10px',
  borderBottom: '2px solid var(--color-surface-container)',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--color-outline)',
};

const td = {
  padding: '14px 10px',
  borderBottom: '1px solid var(--color-surface-container)',
  verticalAlign: 'top',
};

const tag = {
  fontSize: '0.7rem',
  background: 'var(--color-surface-container)',
  padding: '2px 8px',
  borderRadius: '6px',
  fontWeight: '600',
};

const linkBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 10px',
  borderRadius: '8px',
  background: 'var(--color-secondary)',
  color: '#fff',
  fontWeight: '700',
  fontSize: '0.8rem',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
};

export default CompareModal;
