import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';
import { MapPin, Phone, MessageCircle, Star, Clock, CheckCircle, ArrowLeft, Image } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SERVICE_LABELS = {
  'ac-repair': 'AC Repair',
  'plumbing': 'Plumbing',
  'water-heater': 'Geyser / Water Heater',
  'electrical': 'Electrical',
  'carpentry': 'Carpentry',
  'painting': 'Painting',
  'cleaning': 'Cleaning',
  'pest-control': 'Pest Control'
};

const ShopProfile = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    fetchShop();
  }, [id]);

  const fetchShop = async () => {
    try {
      const res = await fetch(`${API_URL}/api/shops/${id}`);
      const data = await res.json();
      if (data.success) {
        setShop(data.shop);
      } else {
        setError('Shop not found');
      }
    } catch (err) {
      setError('Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid var(--color-surface-container)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <h2>{error || 'Shop not found'}</h2>
        <Link to="/find-services" className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '10px' }}>
          <ArrowLeft size={16} /> Find Services
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${shop.businessName} | Pro Fix`}
        description={shop.description || `${shop.businessName} — local service provider on Pro Fix.`}
      />

      <div style={styles.page}>
        <div className="container">
          {/* Back nav */}
          <Link to="/find-services" style={styles.backLink}>
            <ArrowLeft size={16} /> Back to Search
          </Link>

          <div style={styles.layoutGrid}>
            {/* Main content */}
            <div>
              {/* Hero card */}
              <div className="glass-card" style={styles.heroCard}>
                <div style={styles.heroHeader}>
                  <div style={styles.avatar}>
                    {shop.profileImage ? (
                      <img src={`${API_URL}${shop.profileImage}`} alt={shop.businessName} style={styles.avatarImg} />
                    ) : (
                      <div style={styles.avatarPlaceholder}>
                        {shop.businessName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h1 style={styles.shopName}>{shop.businessName}</h1>
                    <p style={styles.ownerName}>by {shop.ownerName}</p>
                    <div style={styles.ratingRow}>
                      <Star size={18} color="#f59e0b" fill="#f59e0b" />
                      <span style={styles.ratingText}>
                        {shop.rating > 0 ? shop.rating.toFixed(1) : 'New Business'}
                        {shop.totalReviews > 0 && ` (${shop.totalReviews} reviews)`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact buttons */}
                <div style={styles.contactRow}>
                  <a href={`tel:${shop.phone}`} style={styles.callBtn}>
                    <Phone size={18} /> Call Now
                  </a>
                  {shop.whatsappNumber && (
                    <a
                      href={`https://wa.me/91${shop.whatsappNumber.replace(/\D/g, '').slice(-10)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.waBtn}
                    >
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="glass-card" style={styles.detailCard}>
                {/* Services */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Services Offered</h3>
                  <div style={styles.serviceTags}>
                    {shop.services?.map(s => (
                      <span key={s} style={styles.serviceTag}>
                        <CheckCircle size={14} /> {SERVICE_LABELS[s] || s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {shop.description && (
                  <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>About</h3>
                    <p style={styles.descText}>{shop.description}</p>
                  </div>
                )}

                {/* Info */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Business Info</h3>
                  <div style={styles.infoGrid}>
                    {shop.openingHours && (
                      <div style={styles.infoItem}>
                        <Clock size={18} color="var(--color-primary)" />
                        <div>
                          <p style={styles.infoLabel}>Hours</p>
                          <p style={styles.infoValue}>{shop.openingHours}</p>
                        </div>
                      </div>
                    )}
                    {shop.address?.city && (
                      <div style={styles.infoItem}>
                        <MapPin size={18} color="var(--color-primary)" />
                        <div>
                          <p style={styles.infoLabel}>Location</p>
                          <p style={styles.infoValue}>
                            {[shop.address.street, shop.address.city, shop.address.pincode].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                    )}
                    <div style={styles.infoItem}>
                      <Phone size={18} color="var(--color-primary)" />
                      <div>
                        <p style={styles.infoLabel}>Phone</p>
                        <p style={styles.infoValue}>{shop.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                {shop.galleryImages?.length > 0 && (
                  <div style={styles.section}>
                    <h3 style={styles.sectionTitle}><Image size={18} /> Photos</h3>
                    <div style={styles.galleryGrid}>
                      {shop.galleryImages.map((img, i) => (
                        <div key={i} style={styles.galleryThumb} onClick={() => setActiveImage(img)}>
                          <img src={`${API_URL}${img}`} alt="" style={styles.galleryImg} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Map */}
                {shop.location?.coordinates && (
                  <div style={styles.section}>
                    <h3 style={styles.sectionTitle}><MapPin size={18} /> Location</h3>
                    <div style={styles.mapContainer}>
                      <iframe
                        title="Shop location"
                        width="100%"
                        height="300"
                        style={{ border: 0, borderRadius: '12px' }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${shop.location.coordinates[1]},${shop.location.coordinates[0]}&z=15&output=embed`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Contact form */}
            <div style={styles.sidebar}>
              <div style={styles.stickyForm}>
                <ContactForm defaultService={shop.services?.[0] || 'ac-repair'} shopId={shop._id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {activeImage && (
        <div style={styles.lightbox} onClick={() => setActiveImage(null)}>
          <img src={`${API_URL}${activeImage}`} alt="" style={styles.lightboxImg} />
        </div>
      )}
    </>
  );
};

const styles = {
  page: {
    padding: 'clamp(24px, 4vw, 48px) 0 clamp(48px, 6vw, 80px)',
    backgroundColor: 'var(--color-surface)',
    minHeight: 'calc(100vh - 84px)',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--color-on-surface-variant)',
    fontWeight: '700',
    fontSize: '0.9rem',
    marginBottom: '24px',
    textDecoration: 'none',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '32px',
    alignItems: 'start',
  },
  heroCard: {
    padding: '32px',
    marginBottom: '24px',
  },
  heroHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '24px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
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
    fontSize: '2rem',
    fontWeight: '800',
  },
  shopName: {
    fontSize: 'clamp(1.4rem, 3vw, 2rem)',
    margin: '0 0 4px',
    lineHeight: 1.2,
  },
  ownerName: {
    margin: '0 0 8px',
    color: 'var(--color-on-surface-variant)',
    fontSize: '0.95rem',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ratingText: {
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  contactRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  callBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    borderRadius: '10px',
    backgroundColor: 'var(--color-secondary)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    textDecoration: 'none',
    boxShadow: '0 8px 20px rgba(177,45,0,0.2)',
  },
  waBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    borderRadius: '10px',
    backgroundColor: '#25d366',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    textDecoration: 'none',
    boxShadow: '0 8px 20px rgba(37,211,102,0.2)',
  },
  detailCard: {
    padding: '32px',
  },
  section: {
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '1px solid var(--color-surface-container)',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.2rem',
    fontWeight: '700',
    margin: '0 0 16px',
  },
  serviceTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  serviceTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(0,60,137,0.06)',
    color: 'var(--color-primary)',
    fontWeight: '600',
    fontSize: '0.9rem',
    padding: '8px 14px',
    borderRadius: '8px',
  },
  descText: {
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.7,
    fontSize: '1.05rem',
    margin: 0,
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  infoLabel: {
    margin: 0,
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--color-outline)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  infoValue: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--color-on-surface)',
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px',
  },
  galleryThumb: {
    aspectRatio: '1',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    border: '1px solid var(--color-surface-container)',
    transition: 'transform 0.2s',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  mapContainer: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid var(--color-surface-container)',
  },
  sidebar: {
    position: 'relative',
  },
  stickyForm: {
    position: 'sticky',
    top: '100px',
  },
  lightbox: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    cursor: 'pointer',
    padding: '40px',
  },
  lightboxImg: {
    maxWidth: '90%',
    maxHeight: '90vh',
    objectFit: 'contain',
    borderRadius: '12px',
  },
};

export default ShopProfile;
