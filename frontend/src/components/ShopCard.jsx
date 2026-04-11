import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, ArrowRight, ShieldCheck, Clock, Star } from 'lucide-react';
import StarRow from './Stars';

const SERVICE_LABELS = {
  'ac-repair': 'AC Repair',
  'plumbing': 'Plumbing',
  'water-heater': 'Geyser',
  'cleaning': 'Cleaning'
};

const ShopCard = ({
  shop,
  showDistance = false,
  showCompare = false,
  compareSelected = false,
  onCompareToggle,
  compareDisabled = false,
}) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="glass-card shop-card" style={styles.card}>
      {/* ——— Top Row: Avatar + Info ——— */}
      <div style={styles.header}>
        <Link to={`/shop/${shop._id}`} style={styles.avatar}>
          {shop.profileImage ? (
            <img
              src={`${API_URL}${shop.profileImage}`}
              alt={shop.businessName}
              style={styles.avatarImg}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {shop.businessName?.charAt(0)?.toUpperCase() || 'S'}
            </div>
          )}
        </Link>
        <div style={styles.headerInfo}>
          <Link to={`/shop/${shop._id}`} style={styles.nameLink}>
            <h3 style={styles.name}>{shop.businessName}</h3>
          </Link>
          <p style={styles.ownerLabel}>by {shop.ownerName}</p>
          <div style={styles.ratingRow}>
            <StarRow value={shop.rating || 0} size={15} showNumber={shop.rating > 0} />
            <span style={styles.reviewCount}>
              {shop.totalReviews > 0
                ? `(${shop.totalReviews} review${shop.totalReviews !== 1 ? 's' : ''})`
                : 'New'}
            </span>
          </div>
        </div>
      </div>

      {/* ——— Badges row ——— */}
      <div style={styles.badgesRow}>
        {shop.isApproved && (
          <span style={styles.verifiedBadge}>
            <ShieldCheck size={13} /> Verified
          </span>
        )}
        {!shop.isApproved && (
          <span style={styles.pendingBadge}>Pending Review</span>
        )}
        {showDistance && shop.distance !== undefined && (
          <span style={styles.distanceBadge}>
            <MapPin size={13} /> {shop.distance} km
          </span>
        )}
        {shop.openingHours && (
          <span style={styles.hoursBadge}>
            <Clock size={13} /> {shop.openingHours}
          </span>
        )}
      </div>

      {/* ——— Service Tags ——— */}
      <div style={styles.services}>
        {shop.services?.slice(0, 4).map(s => (
          <span key={s} style={styles.serviceTag}>
            {SERVICE_LABELS[s] || s}
          </span>
        ))}
        {shop.services?.length > 4 && (
          <span style={styles.moreTag}>+{shop.services.length - 4}</span>
        )}
      </div>

      {/* ——— Address ——— */}
      {shop.address?.city && (
        <p style={styles.address}>
          <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
          {[shop.address.street, shop.address.city, shop.address.pincode].filter(Boolean).join(', ')}
        </p>
      )}

      {/* ——— Description ——— */}
      {shop.description && (
        <p style={styles.description}>
          {shop.description.length > 120 ? shop.description.slice(0, 120) + '…' : shop.description}
        </p>
      )}

      {/* ——— Compare checkbox ——— */}
      {showCompare && (
        <label style={styles.compareLabel}>
          <input
            type="checkbox"
            checked={compareSelected}
            disabled={compareDisabled && !compareSelected}
            onChange={() => onCompareToggle?.(shop._id)}
            style={styles.compareCheckbox}
          />
          <span>{compareSelected ? 'Selected' : 'Compare'}</span>
        </label>
      )}

      {/* ——— Actions ——— */}
      <div style={styles.actions}>
        <a href={`tel:${shop.phone}`} style={styles.callBtn} title="Call">
          <Phone size={15} /> Call
        </a>
        {(shop.whatsappNumber || shop.phone) && (
          <a
            href={`https://wa.me/91${(shop.whatsappNumber || shop.phone).replace(/\D/g, '').slice(-10)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.waBtn}
            title="WhatsApp"
          >
            <MessageCircle size={15} /> WhatsApp
          </a>
        )}
        <Link to={`/shop/${shop._id}`} style={styles.profileBtn}>
          View Profile <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    borderRadius: '20px',
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '16px',
    overflow: 'hidden',
    flexShrink: 0,
    textDecoration: 'none',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameLink: { textDecoration: 'none', color: 'inherit' },
  name: {
    fontSize: '1.15rem',
    fontWeight: '800',
    margin: '0 0 2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.3,
  },
  ownerLabel: {
    margin: '0 0 4px',
    fontSize: '0.8rem',
    color: 'var(--color-outline)',
    fontWeight: '500',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  reviewCount: {
    color: 'var(--color-outline)',
    fontWeight: '500',
    fontSize: '0.8rem',
  },

  /* Badges */
  badgesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  verifiedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: '#f0fdf4',
    color: '#15803d',
    fontWeight: '700',
    fontSize: '0.75rem',
    padding: '5px 10px',
    borderRadius: '50px',
    border: '1px solid #bbf7d0',
  },
  pendingBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    background: '#fef3c7',
    color: '#92400e',
    fontSize: '0.72rem',
    fontWeight: '700',
    padding: '5px 10px',
    borderRadius: '50px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  distanceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(0, 60, 137, 0.07)',
    color: 'var(--color-primary)',
    fontWeight: '700',
    fontSize: '0.75rem',
    padding: '5px 10px',
    borderRadius: '50px',
  },
  hoursBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'var(--color-surface-container)',
    color: 'var(--color-on-surface-variant)',
    fontWeight: '600',
    fontSize: '0.75rem',
    padding: '5px 10px',
    borderRadius: '50px',
  },

  services: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  serviceTag: {
    background: 'var(--color-surface-container)',
    color: 'var(--color-on-surface-variant)',
    fontSize: '0.73rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  moreTag: {
    background: 'var(--color-surface-container-high)',
    color: 'var(--color-outline)',
    fontSize: '0.73rem',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  address: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    fontSize: '0.88rem',
    color: 'var(--color-on-surface-variant)',
    margin: 0,
    lineHeight: 1.4,
  },
  description: {
    fontSize: '0.88rem',
    color: 'var(--color-outline)',
    margin: 0,
    lineHeight: 1.5,
  },

  compareLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  compareCheckbox: {
    accentColor: 'var(--color-primary)',
    width: '16px',
    height: '16px',
  },

  /* Actions */
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid var(--color-surface-container)',
    flexWrap: 'wrap',
  },
  callBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '9px 16px',
    borderRadius: '50px',
    backgroundColor: 'var(--color-secondary)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.82rem',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(177,45,0,0.15)',
  },
  waBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '9px 16px',
    borderRadius: '50px',
    backgroundColor: '#25d366',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.82rem',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 12px rgba(37,211,102,0.15)',
  },
  profileBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '9px 16px',
    borderRadius: '50px',
    border: '1.5px solid var(--color-surface-container-high)',
    color: 'var(--color-primary)',
    fontWeight: '700',
    fontSize: '0.82rem',
    textDecoration: 'none',
    marginLeft: 'auto',
    transition: 'all 0.2s',
  },
};

export default ShopCard;
