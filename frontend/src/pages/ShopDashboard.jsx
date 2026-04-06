import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  Store, MapPin, Phone, Clock, Edit3, Save, LogOut, Upload, 
  CheckCircle, AlertCircle, Eye, Image, X
} from 'lucide-react';

const SERVICE_OPTIONS = [
  { value: 'ac-repair', label: 'AC Repair' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'water-heater', label: 'Geyser' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'painting', label: 'Painting' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'pest-control', label: 'Pest Control' },
];

const ShopDashboard = () => {
  const navigate = useNavigate();
  const { shop, token, loading, logout, updateShop, fetchMe, API_URL, isAuthenticated } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (shop) {
      setFormData({
        businessName: shop.businessName || '',
        ownerName: shop.ownerName || '',
        phone: shop.phone || '',
        whatsappNumber: shop.whatsappNumber || '',
        description: shop.description || '',
        openingHours: shop.openingHours || '',
        services: shop.services || [],
        address: shop.address || { street: '', city: '', state: '', pincode: '' },
      });
    }
  }, [shop]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/shops/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
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
              <h1 style={styles.pageTitle}>Business Dashboard</h1>
              <p style={styles.pageSubtitle}>Manage your shop profile and settings</p>
            </div>
            <div style={styles.headerActions}>
              <Link to={`/shop/${shop?._id}`} style={styles.previewBtn}>
                <Eye size={16} /> View Public Profile
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <LogOut size={16} /> Logout
              </button>
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
    margin: 0,
    color: 'var(--color-on-surface-variant)',
    fontSize: '1.05rem',
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
