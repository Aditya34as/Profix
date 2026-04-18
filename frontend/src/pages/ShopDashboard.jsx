import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  Store, MapPin, Phone, Clock, Edit3, Save, LogOut, Upload, 
  CheckCircle, AlertCircle, Eye, Image, Star, Inbox, Activity
} from 'lucide-react';
import StarRow from '../components/Stars';

const SERVICE_OPTIONS = [
  { value: 'ac-repair', label: 'AC Repair' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'water-heater', label: 'Geyser' },
  { value: 'cleaning', label: 'Cleaning' },
];

const ShopDashboard = () => {
  const navigate = useNavigate();
  const { shop, token, loading, logout, updateShop, fetchMe, API_URL, isAuthenticated, isShopOwner, role } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);


  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (shop) {
      const [lng, lat] = shop.location?.coordinates || [];
      setFormData({
        businessName: shop.businessName || '',
        ownerName: shop.ownerName || '',
        phone: shop.phone || '',
        whatsappNumber: shop.whatsappNumber || '',
        description: shop.description || '',
        openingHours: shop.openingHours || '',
        services: shop.services || [],
        address: shop.address || { street: '', city: '', state: '', pincode: '' },
        longitude: lng != null ? String(lng) : '',
        latitude: lat != null ? String(lat) : '',
      });
    }
  }, [shop]);

  useEffect(() => {
    if (!token || !shop?._id) return;
    let cancelled = false;
    (async () => {
      setLeadsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/shops/me/leads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!cancelled && data.success) setLeads(data.leads || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLeadsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, shop?._id, API_URL]);

  useEffect(() => {
    if (!token || !shop?._id) return;
    let cancelled = false;
    (async () => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/shops/me/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!cancelled && data.success) setReviews(data.reviews || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, shop?._id, API_URL]);

  const updateLeadStatus = async (leadId, status) => {
    try {
      const res = await fetch(`${API_URL}/api/shops/me/leads/${leadId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l._id === leadId ? { ...l, status } : l)));
        toast.success('Lead updated');
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch {
      toast.error('Update failed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      const payload = { ...formData };
      delete payload.latitude;
      delete payload.longitude;
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        payload.latitude = lat;
        payload.longitude = lng;
      }
      const res = await fetch(`${API_URL}/api/shops/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        updateShop(data.shop);
        setEditing(false);
        toast.success('Profile updated!');
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (err) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('imageType', imageType);

    try {
      const res = await fetch(`${API_URL}/api/shops/me/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${imageType === 'gallery' ? 'Gallery' : 'Profile'} image uploaded!`);
        fetchMe(); // Refresh shop data
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const toggleService = (svc) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(svc)
        ? prev.services.filter(s => s !== svc)
        : [...prev.services, svc]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out');
  };

  if (loading || !formData) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid var(--color-surface-container)', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <SEO title="Dashboard | Pro Fix" />

      <div style={styles.page}>
        <div className="container">
          {/* Header */}
          <div style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>Your business hub</h1>
              <p style={styles.pageSubtitle}>
                Everything for <strong>{shop?.businessName}</strong> in one place — visibility, leads, and what customers say about you.
              </p>
              <div style={styles.statsRow}>
                <div style={styles.statCard}>
                  <Activity size={22} color="var(--color-primary)" />
                  <span style={styles.statLabel}>Listing</span>
                  <strong style={styles.statValue}>
                    {shop?.isApproved ? 'Live on search' : 'Pending review'}
                  </strong>
                </div>
                <div style={styles.statCard}>
                  <Star size={22} color="#f59e0b" />
                  <span style={styles.statLabel}>Rating</span>
                  <div style={{ marginTop: '4px' }}>
                    <StarRow value={shop?.rating || 0} size={18} showNumber />
                  </div>
                  <span style={styles.statHint}>{shop?.totalReviews || 0} reviews</span>
                </div>
                <div style={styles.statCard}>
                  <Inbox size={22} color="var(--color-secondary)" />
                  <span style={styles.statLabel}>Open leads</span>
                  <strong style={styles.statValue}>
                    {leadsLoading ? '…' : leads.filter((l) => l.status === 'new').length}
                  </strong>
                  <span style={styles.statHint}>Total {leads.length} requests</span>
                </div>
              </div>
              <p style={styles.dashboardBlurb}>
                <strong>Profile &amp; gallery</strong> — how you look to customers. <strong>Leads</strong> — form requests from your public page.
                <strong> Reviews</strong> — feedback left on your listing.
              </p>
            </div>
          </div>

          {/* Status Banner */}
          {shop && !shop.isApproved && (
            <div style={styles.pendingBanner}>
              <AlertCircle size={20} />
              <span><strong>Pending Approval</strong> — Your shop listing is under admin review. Customers cannot see your shop until approved.</span>
            </div>
          )}

          {shop?.isApproved && (
            <div style={styles.approvedBanner}>
              <CheckCircle size={20} />
              <span><strong>Verified & Live</strong> — Your shop is visible to customers searching nearby.</span>
            </div>
          )}

          {shop && !shop.location?.coordinates?.length && (
            <div style={styles.locationNudge}>
              <MapPin size={20} />
              <div style={{ flex: 1 }}>
                <span>
                  <strong>Location not set</strong> — Your shop won't appear in "near me" search results.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
                    toast.info('Detecting your shop location...');
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setFormData(prev => ({
                          ...prev,
                          latitude: String(pos.coords.latitude),
                          longitude: String(pos.coords.longitude),
                        }));
                        if (!editing) setEditing(true);
                        toast.success('Location detected! Click Save to apply.');
                      },
                      (err) => toast.error(err.code === 1 ? 'Location access denied — enable it in browser settings' : 'Location detection failed'),
                      { enableHighAccuracy: true, timeout: 15000 }
                    );
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '8px', marginTop: '10px',
                    border: '1.5px solid var(--color-primary)', background: 'rgba(0,60,137,0.06)',
                    color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.85rem',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}
                >
                  <MapPin size={14} /> Detect My Location
                </button>
              </div>
            </div>
          )}

          <div style={styles.dashboardGrid}>
            {/* Profile Card */}
            <div className="glass-card" style={styles.profileCard}>
              <div style={styles.profileHeader}>
                <div style={styles.avatarLarge}>
                  {shop?.profileImage ? (
                    <img src={`${API_URL}${shop.profileImage}`} alt="" style={styles.avatarImg} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      {shop?.businessName?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                  )}
                  <label style={styles.uploadOverlay}>
                    <Upload size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'profile')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem' }}>{shop?.businessName}</h2>
                  <p style={{ margin: 0, color: 'var(--color-on-surface-variant)' }}>{shop?.email}</p>
                </div>
              </div>

              {/* Gallery Upload */}
              <div style={styles.gallerySection}>
                <h3 style={styles.sectionTitle}><Image size={18} /> Gallery Images</h3>
                <div style={styles.galleryGrid}>
                  {shop?.galleryImages?.map((img, i) => (
                    <div key={i} style={styles.galleryThumb}>
                      <img src={`${API_URL}${img}`} alt="" style={styles.galleryImg} />
                    </div>
                  ))}
                  <label style={styles.galleryAdd}>
                    <Upload size={24} color="var(--color-outline)" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-outline)' }}>Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'gallery')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {uploading && <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>Uploading...</p>}
              </div>
            </div>

            {/* Edit Form */}
            <div className="glass-card" style={styles.editCard}>
              <div style={styles.editHeader}>
                <h3 style={styles.sectionTitle}><Store size={18} /> Business Details</h3>
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  style={editing ? styles.saveBtn : styles.editBtn}
                  disabled={saving}
                >
                  {editing ? (
                    <>{saving ? 'Saving...' : <><Save size={16} /> Save</>}</>
                  ) : (
                    <><Edit3 size={16} /> Edit</>
                  )}
                </button>
              </div>

              <div style={styles.fields}>
                <div style={styles.fieldRow}>
                  <label style={styles.fieldLabel}>Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    disabled={!editing}
                    style={{ ...styles.input, opacity: editing ? 1 : 0.7 }}
                    className="form-input-auth"
                  />
                </div>

                <div style={styles.fieldRow}>
                  <label style={styles.fieldLabel}>Owner Name</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    disabled={!editing}
                    style={{ ...styles.input, opacity: editing ? 1 : 0.7 }}
                    className="form-input-auth"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={styles.fieldRow}>
                    <label style={styles.fieldLabel}>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      style={{ ...styles.input, opacity: editing ? 1 : 0.7 }}
                      className="form-input-auth"
                    />
                  </div>
                  <div style={styles.fieldRow}>
                    <label style={styles.fieldLabel}>WhatsApp</label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      disabled={!editing}
                      style={{ ...styles.input, opacity: editing ? 1 : 0.7 }}
                      className="form-input-auth"
                    />
                  </div>
                </div>

                <div style={styles.fieldRow}>
                  <label style={styles.fieldLabel}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!editing}
                    rows="3"
                    style={{ ...styles.input, resize: 'vertical', opacity: editing ? 1 : 0.7 }}
                    className="form-input-auth"
                  />
                </div>

                <div style={styles.fieldRow}>
                  <label style={styles.fieldLabel}>Opening Hours</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    disabled={!editing}
                    style={{ ...styles.input, opacity: editing ? 1 : 0.7 }}
                    className="form-input-auth"
                  />
                </div>

                <div style={styles.fieldRow}>
                  <label style={styles.fieldLabel}>Address</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Street"
                      value={formData.address.street}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                      disabled={!editing}
                      style={{ ...styles.input, opacity: editing ? 1 : 0.7, gridColumn: '1/-1' }}
                      className="form-input-auth"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.address.city}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                      disabled={!editing}
                      style={{ ...styles.input, opacity: editing ? 1 : 0.7 }}
                      className="form-input-auth"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.address.pincode}
                      onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })}
                      disabled={!editing}
                      style={{ ...styles.input, opacity: editing ? 1 : 0.7 }}
                      className="form-input-auth"
                    />
                  </div>
                </div>



                {editing && (
                  <div style={styles.fieldRow}>
                    <label style={styles.fieldLabel}>Services Offered</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {SERVICE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleService(opt.value)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '2px solid',
                            borderColor: formData.services.includes(opt.value) ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                            background: formData.services.includes(opt.value) ? 'rgba(0,60,137,0.06)' : 'transparent',
                            color: formData.services.includes(opt.value) ? 'var(--color-primary)' : 'var(--color-on-surface)',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!editing && (
                  <div style={styles.fieldRow}>
                    <label style={styles.fieldLabel}>Services</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {formData.services.map(s => (
                        <span key={s} style={styles.serviceTag}>
                          {SERVICE_OPTIONS.find(o => o.value === s)?.label || s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map preview */}
          {shop?.location?.coordinates && (
            <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
              <h3 style={styles.sectionTitle}><MapPin size={18} /> Shop Location</h3>
              <div style={{ borderRadius: '12px', overflow: 'hidden', marginTop: '16px' }}>
                <iframe
                  title="Shop location"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${shop.location.coordinates[1]},${shop.location.coordinates[0]}&z=15&output=embed`}
                />
              </div>
            </div>
          )}

          {/* Reviews from customers */}
          <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
            <h3 style={styles.sectionTitle}><Star size={18} /> Customer reviews</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--color-on-surface-variant)', fontSize: '0.95rem' }}>
              Ratings and comments from people who used your listing on Pro Fix.
            </p>
            {reviewsLoading ? (
              <p style={{ color: 'var(--color-outline)' }}>Loading reviews…</p>
            ) : reviews.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--color-on-surface-variant)' }}>No reviews yet. Share your public profile so customers can leave feedback.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reviews.slice(0, 8).map((r) => (
                  <div
                    key={r._id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--color-surface-container)',
                      background: 'var(--color-surface-container-low)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <strong>{r.reviewerName}</strong>
                      <StarRow value={r.rating} size={16} showNumber />
                    </div>
                    {r.comment ? <p style={{ margin: '8px 0 0', fontSize: '0.95rem', lineHeight: 1.5 }}>{r.comment}</p> : null}
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-outline)' }}>
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer leads (shop-specific requests) */}
          <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
            <h3 style={styles.sectionTitle}><Phone size={18} /> Customer leads</h3>
            <p style={{ margin: '0 0 16px', color: 'var(--color-on-surface-variant)', fontSize: '0.95rem' }}>
              Requests submitted from your public profile or tagged with your shop.
            </p>
            {leadsLoading ? (
              <p style={{ color: 'var(--color-on-surface-variant)' }}>Loading leads…</p>
            ) : leads.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--color-on-surface-variant)' }}>No leads yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {leads.map((lead) => (
                  <div
                    key={lead._id}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--color-surface-container)',
                      background: 'var(--color-surface-container-low)',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                      <div>
                        <strong style={{ fontSize: '1rem' }}>{lead.name}</strong>
                        <span style={{ color: 'var(--color-on-surface-variant)', marginLeft: '8px' }}>{lead.phone}</span>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-on-surface-variant)', marginTop: '6px' }}>
                          Service: {lead.serviceRequested}
                        </div>
                        {lead.message ? (
                          <p style={{ margin: '8px 0 0', fontSize: '0.95rem', lineHeight: 1.5 }}>{lead.message}</p>
                        ) : null}
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-outline)', marginTop: '8px' }}>
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ''}
                        </div>
                      </div>
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '2px solid var(--color-surface-container)',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    padding: 'clamp(24px, 4vw, 48px) 0 clamp(48px, 6vw, 80px)',
    backgroundColor: 'var(--color-surface)',
    minHeight: 'calc(100vh - 84px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '24px',
  },
  pageTitle: {
    fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
    margin: '0 0 4px',
  },
  pageSubtitle: {
    margin: '0 0 20px',
    color: 'var(--color-on-surface-variant)',
    fontSize: '1.05rem',
    maxWidth: '640px',
    lineHeight: 1.5,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
    maxWidth: '900px',
  },
  statCard: {
    padding: '18px 20px',
    borderRadius: '14px',
    background: 'var(--color-surface-container-lowest)',
    border: '1px solid var(--color-surface-container)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
  },
  statLabel: {
    fontSize: '0.72rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--color-outline)',
  },
  statValue: {
    fontSize: '1.05rem',
    color: 'var(--color-on-surface)',
  },
  statHint: {
    fontSize: '0.8rem',
    color: 'var(--color-on-surface-variant)',
  },
  dashboardBlurb: {
    fontSize: '0.92rem',
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.6,
    maxWidth: '720px',
    margin: '0 0 8px',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  previewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    borderRadius: '10px',
    border: '2px solid var(--color-surface-container-high)',
    color: 'var(--color-on-surface)',
    fontWeight: '700',
    fontSize: '0.85rem',
    textDecoration: 'none',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 18px',
    borderRadius: '10px',
    border: '2px solid #fecaca',
    background: '#fef2f2',
    color: '#dc2626',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  pendingBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderRadius: '12px',
    background: '#fef3c7',
    border: '1px solid #fde68a',
    color: '#92400e',
    fontWeight: '600',
    fontSize: '0.95rem',
    marginBottom: '24px',
  },
  approvedBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderRadius: '12px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#166534',
    fontWeight: '600',
    fontSize: '0.95rem',
    marginBottom: '24px',
  },
  locationNudge: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px 20px',
    borderRadius: '12px',
    background: 'rgba(0, 60, 137, 0.06)',
    border: '1px solid var(--color-primary-container)',
    color: 'var(--color-on-surface)',
    fontWeight: '600',
    fontSize: '0.95rem',
    marginBottom: '24px',
    lineHeight: 1.5,
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '380px 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  profileCard: {
    padding: '24px',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid var(--color-surface-container)',
  },
  avatarLarge: {
    width: '72px',
    height: '72px',
    borderRadius: '18px',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
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
    fontSize: '1.8rem',
    fontWeight: '800',
  },
  uploadOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    cursor: 'pointer',
  },
  gallerySection: {
    marginTop: '8px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: '0 0 16px',
  },
  galleryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  galleryThumb: {
    aspectRatio: '1',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid var(--color-surface-container)',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  galleryAdd: {
    aspectRatio: '1',
    borderRadius: '10px',
    border: '2px dashed var(--color-surface-container-high)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  editCard: {
    padding: '24px',
  },
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--color-surface-container)',
  },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '2px solid var(--color-surface-container-high)',
    background: 'transparent',
    color: 'var(--color-on-surface)',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldLabel: {
    fontWeight: '700',
    fontSize: '0.8rem',
    color: 'var(--color-on-surface-variant)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '2px solid var(--color-surface-container)',
    backgroundColor: 'var(--color-surface-container-low)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--color-on-surface)',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  serviceTag: {
    background: 'var(--color-surface-container)',
    color: 'var(--color-on-surface-variant)',
    fontSize: '0.8rem',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '6px',
  },
};

export default ShopDashboard;
