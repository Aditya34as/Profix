import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';
import WhatsAppFloat from '../components/WhatsAppFloat';
import StarRow from '../components/Stars';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, MessageCircle, Star, Clock, CheckCircle, ArrowLeft, Image, Send } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SERVICE_LABELS = {
  'ac-repair': 'AC Repair',
  'plumbing': 'Plumbing',
  'water-heater': 'Geyser / Water Heater',
  'cleaning': 'Cleaning'
};

const ShopProfile = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ reviewerName: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/shops/${id}/reviews`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews || []);
    } catch {
      /* ignore */
    }
  };

  const fetchShop = async () => {
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_URL}/api/shops/${id}`, { headers });
      const data = await res.json();
      if (data.success) {
        setShop(data.shop);
        fetchReviews();
      } else {
        setError('Shop not found');
      }
    } catch (err) {
      setError('Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, [id, token]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.reviewerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/api/shops/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Thanks for your review!');
        setReviewForm({ reviewerName: '', rating: 5, comment: '' });
        fetchReviews();
        fetchShop();
      } else {
        toast.error(data.error || 'Could not submit review');
      }
    } catch {
      toast.error('Could not submit review');
    } finally {
      setSubmittingReview(false);
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
        title={`${shop.businessName} — ${shop.services?.map(s => SERVICE_LABELS[s] || s).join(', ')} | Pro Fix`}
        description={shop.description || `${shop.businessName} — verified ${shop.services?.map(s => SERVICE_LABELS[s] || s).join(', ').toLowerCase()} provider in ${shop.address?.city || 'your area'}. ${shop.rating ? `Rated ${shop.rating}★` : 'Book now'} on Pro Fix India. Transparent pricing, 30-day warranty.`}
        keywords={`${shop.businessName}, ${shop.services?.map(s => (SERVICE_LABELS[s] || s).toLowerCase()).join(', ')}, ${shop.services?.map(s => `${(SERVICE_LABELS[s] || s).toLowerCase()} ${shop.address?.city || ''}`).join(', ')}, ${shop.address?.city || ''} home services, best ${shop.services?.map(s => (SERVICE_LABELS[s] || s).toLowerCase()).join(' ')} near me`}
        url={`https://profix-front.onrender.com/shop/${id}`}
        serviceSchema={(() => {
          const schemas = [];
          // LocalBusiness schema for the shop
          const shopSchema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": shop.businessName,
            "url": `https://profix-front.onrender.com/shop/${id}`,
            "telephone": shop.phone,
            "description": shop.description || `${shop.businessName} — verified service provider on Pro Fix India`,
            "priceRange": "₹₹",
          };
          if (shop.profileImage) shopSchema.image = `${API_URL}${shop.profileImage}`;
          if (shop.address) {
            shopSchema.address = {
              "@type": "PostalAddress",
              "streetAddress": shop.address.street || '',
              "addressLocality": shop.address.city || '',
              "addressRegion": shop.address.state || '',
              "postalCode": shop.address.pincode || '',
              "addressCountry": "IN"
            };
          }
          if (shop.location?.coordinates) {
            shopSchema.geo = {
              "@type": "GeoCoordinates",
              "latitude": shop.location.coordinates[1],
              "longitude": shop.location.coordinates[0]
            };
          }
          if (shop.rating && shop.totalReviews > 0) {
            shopSchema.aggregateRating = {
              "@type": "AggregateRating",
              "ratingValue": String(shop.rating),
              "reviewCount": String(shop.totalReviews),
              "bestRating": "5",
              "worstRating": "1"
            };
          }
          if (shop.services?.length) {
            shopSchema.hasOfferCatalog = {
              "@type": "OfferCatalog",
              "name": "Services",
              "itemListElement": shop.services.map(s => ({
                "@type": "Offer",
                "itemOffered": { "@type": "Service", "name": SERVICE_LABELS[s] || s }
              }))
            };
          }
          if (shop.openingHours) {
            shopSchema.openingHoursSpecification = {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
              "opens": "08:00",
              "closes": "21:00"
            };
          }
          schemas.push(shopSchema);
          // Review schemas
          if (reviews.length > 0) {
            const reviewSchema = {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": shop.businessName,
              "review": reviews.slice(0, 5).map(r => ({
                "@type": "Review",
                "author": { "@type": "Person", "name": r.reviewerName },
                "reviewRating": { "@type": "Rating", "ratingValue": String(r.rating), "bestRating": "5" },
                ...(r.comment ? { "reviewBody": r.comment } : {}),
                ...(r.createdAt ? { "datePublished": new Date(r.createdAt).toISOString().split('T')[0] } : {})
              }))
            };
            schemas.push(reviewSchema);
          }
          return schemas;
        })()}
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
                      <StarRow value={shop.rating || 0} size={20} showNumber={shop.rating > 0} />
                      <span style={styles.ratingMeta}>
                        {shop.totalReviews > 0
                          ? `${shop.totalReviews} review${shop.totalReviews !== 1 ? 's' : ''}`
                          : 'No reviews yet — be the first'}
                      </span>
                    </div>
                  </div>
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
                          <img src={`${API_URL}${img}`} alt={`${shop.businessName} — work photo ${i + 1}`} style={styles.galleryImg} loading="lazy" />
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

                {/* Reviews */}
                <div style={{ ...styles.section, borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                  <h3 style={styles.sectionTitle}><Star size={18} /> Customer reviews</h3>
                  {reviews.length === 0 ? (
                    <p style={{ color: 'var(--color-on-surface-variant)', marginTop: 0 }}>No reviews yet.</p>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {reviews.map((r) => (
                        <li key={r._id} style={styles.reviewItem}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <strong>{r.reviewerName}</strong>
                            <StarRow value={r.rating} size={16} showNumber={false} />
                          </div>
                          {r.comment ? <p style={styles.reviewComment}>{r.comment}</p> : null}
                          <span style={styles.reviewDate}>
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <form onSubmit={submitReview} style={styles.reviewForm}>
                    <p style={styles.reviewFormTitle}>Rate your experience</p>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={reviewForm.reviewerName}
                      onChange={(e) => setReviewForm((f) => ({ ...f, reviewerName: e.target.value }))}
                      style={styles.reviewInput}
                      className="form-input-auth"
                      required
                    />
                    <div style={styles.ratingSelect}>
                      <label htmlFor="profile-rating">Rating</label>
                      <select
                        id="profile-rating"
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm((f) => ({ ...f, rating: parseInt(e.target.value, 10) }))}
                        style={styles.reviewInput}
                        className="form-input-auth"
                      >
                        {[
                          [5, '5 — Excellent'],
                          [4, '4 — Good'],
                          [3, '3 — Average'],
                          [2, '2 — Poor'],
                          [1, '1 — Very poor'],
                        ].map(([n, label]) => (
                          <option key={n} value={n}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      placeholder="Tell others about this business (optional)"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                      rows={3}
                      style={{ ...styles.reviewInput, resize: 'vertical' }}
                      className="form-input-auth"
                    />
                    <button type="submit" className="btn-secondary" style={styles.reviewSubmit} disabled={submittingReview}>
                      <Send size={16} /> {submittingReview ? 'Sending…' : 'Submit review'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar: Contact form */}
            <div style={styles.sidebar}>
              <div style={styles.stickyForm}>
                <ContactForm
                  defaultService={shop.services?.[0] || 'ac-repair'}
                  shopId={shop._id}
                  whatsappPhone={shop.whatsappNumber || shop.phone}
                  businessName={shop.businessName}
                />
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

      <WhatsAppFloat phoneNumber={shop.whatsappNumber || shop.phone} shopName={shop.businessName} visible />
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '6px',
  },
  ratingMeta: {
    fontSize: '0.85rem',
    color: 'var(--color-on-surface-variant)',
    fontWeight: '600',
  },
  reviewItem: {
    padding: '14px 16px',
    borderRadius: '12px',
    background: 'var(--color-surface-container-low)',
    border: '1px solid var(--color-surface-container)',
  },
  reviewComment: { margin: '8px 0 0', lineHeight: 1.5, color: 'var(--color-on-surface-variant)' },
  reviewDate: { fontSize: '0.75rem', color: 'var(--color-outline)' },
  reviewForm: {
    marginTop: '24px',
    padding: '20px',
    borderRadius: '12px',
    border: '2px dashed var(--color-surface-container-high)',
    background: 'var(--color-surface-container-lowest)',
  },
  reviewFormTitle: { margin: '0 0 12px', fontWeight: '700', fontSize: '0.95rem' },
  reviewInput: {
    width: '100%',
    marginBottom: '12px',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '2px solid var(--color-surface-container)',
    fontFamily: 'var(--font-body)',
    boxSizing: 'border-box',
  },
  ratingSelect: { marginBottom: '8px' },
  reviewSubmit: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    marginTop: '4px',
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
