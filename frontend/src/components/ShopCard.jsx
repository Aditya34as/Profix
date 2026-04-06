import { Link } from 'react-router-dom';
import { MapPin, Phone, Star, MessageCircle, ArrowRight } from 'lucide-react';

const SERVICE_LABELS = {
  'ac-repair': 'AC Repair',
  'plumbing': 'Plumbing',
  'water-heater': 'Geyser',
  'electrical': 'Electrical',
  'carpentry': 'Carpentry',
  'painting': 'Painting',
  'cleaning': 'Cleaning',
  'pest-control': 'Pest Control'
};

const ShopCard = ({ shop, showDistance = false }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="glass-card shop-card" style={styles.card}>
      {/* Header with image */}
      <div style={styles.header}>
        <div style={styles.avatar}>
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
        </div>
        <div style={styles.headerInfo}>
          <h3 style={styles.name}>{shop.businessName}</h3>
          <div style={styles.ratingRow}>
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <span style={styles.ratingText}>
              {shop.rating > 0 ? shop.rating.toFixed(1) : 'New'} 
              {shop.totalReviews > 0 && <span style={styles.reviewCount}>({shop.totalReviews})</span>}
            </span>
          </div>
        </div>

        {/* Approval badge */}
        {!shop.isApproved && (
          <span style={styles.pendingBadge}>Pending</span>
        )}
      </div>

      {/* Distance */}
      {showDistance && shop.distance !== undefined && (
        <div style={styles.distanceBadge}>
          <MapPin size={14} />
          <span>{shop.distance} km away</span>
        </div>
      )}

      {/* Services */}
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

      {/* Address */}
      {shop.address?.city && (
        <p style={styles.address}>
          <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} />
          {[shop.address.street, shop.address.city, shop.address.pincode].filter(Boolean).join(', ')}
        </p>
      )}

      {/* Description */}
      {shop.description && (
        <p style={styles.description}>
          {shop.description.length > 100 ? shop.description.slice(0, 100) + '...' : shop.description}
        </p>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <a href={`tel:${shop.phone}`} style={styles.callBtn}>
          <Phone size={16} /> Call
        </a>
        {shop.whatsappNumber && (
          <a
            href={`https://wa.me/91${shop.whatsappNumber.replace(/\D/g, '').slice(-10)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.waBtn}
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        )}
        <Link to={`/shop/${shop._id}`} style={styles.profileBtn}>
          View <ArrowRight size={14} />
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
    gap: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    position: 'relative'
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    overflow: 'hidden',
    flexShrink: 0,
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
    fontSize: '1.4rem',
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: '1.15rem',
    fontWeight: '700',
    margin: '0 0 4px 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  ratingText: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--color-on-surface)',
  },
  reviewCount: {
    color: 'var(--color-outline)',
    fontWeight: '400',
    marginLeft: '2px',
  },
  pendingBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    background: '#fef3c7',
    color: '#92400e',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  distanceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(0, 60, 137, 0.08)',
    color: 'var(--color-primary)',
    fontWeight: '700',
    fontSize: '0.85rem',
    padding: '6px 12px',
    borderRadius: '8px',
    width: 'fit-content',
  },
  services: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  serviceTag: {
    background: 'var(--color-surface-container)',
    color: 'var(--color-on-surface-variant)',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  moreTag: {
    background: 'var(--color-surface-container-high)',
    color: 'var(--color-outline)',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '6px',
  },
  address: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    fontSize: '0.9rem',
    color: 'var(--color-on-surface-variant)',
    margin: 0,
    lineHeight: 1.4,
  },
  description: {
    fontSize: '0.9rem',
    color: 'var(--color-outline)',
    margin: 0,
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '8px',
    borderTop: '1px solid var(--color-surface-container)',
  },
  callBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: 'var(--color-secondary)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.85rem',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  waBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#25d366',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.85rem',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '2px solid var(--color-surface-container)',
    color: 'var(--color-primary)',
    fontWeight: '700',
    fontSize: '0.85rem',
    textDecoration: 'none',
    marginLeft: 'auto',
    transition: 'all 0.2s',
  },
};

export default ShopCard;
