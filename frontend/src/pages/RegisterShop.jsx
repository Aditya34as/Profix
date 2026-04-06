import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import LocationPicker from '../components/LocationPicker';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Store, User, Mail, Lock, Phone, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

const SERVICE_OPTIONS = [
  { value: 'ac-repair', label: 'AC Repair & HVAC' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'water-heater', label: 'Geyser / Water Heater' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'painting', label: 'Painting' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'pest-control', label: 'Pest Control' },
];

const RegisterShop = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsappNumber: '',
    services: [],
    address: { street: '', city: '', state: '', pincode: '' },
    latitude: '',
    longitude: '',
    description: '',
    openingHours: 'Mon-Sat 8AM-8PM',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const toggleService = (svc) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(svc)
        ? prev.services.filter(s => s !== svc)
        : [...prev.services, svc]
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.businessName || !formData.ownerName || !formData.email || !formData.password || !formData.phone) {
        toast.error('Please fill all required fields');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
    }
    if (step === 2) {
      if (formData.services.length === 0) {
        toast.error('Select at least one service');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.latitude || !formData.longitude) {
        toast.error('Please set your shop location');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);

    try {
      const result = await register(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <SEO title="Registration Successful | Pro Fix" />
        <div style={styles.successPage}>
          <div className="animate-fade-in-up" style={styles.successCard}>
            <div style={styles.successIcon}>
              <CheckCircle size={64} color="#22c55e" />
            </div>
            <h1 style={styles.successTitle}>Registration Successful! 🎉</h1>
            <p style={styles.successText}>
              Your shop <strong>{formData.businessName}</strong> has been registered.
              Your listing is currently <strong>pending admin approval</strong>.
            </p>
            <p style={styles.successSubtext}>
              You'll be able to manage your profile from the dashboard once approved. 
              We'll review your application shortly.
            </p>
            <div style={styles.successActions}>
              <Link to="/dashboard" className="btn-secondary" style={styles.dashboardBtn}>
                Go to Dashboard
              </Link>
              <Link to="/" style={styles.homeLink}>← Back to Home</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Register Your Business | Pro Fix" 
        description="List your local service business on Pro Fix. Reach thousands of customers searching for trusted service providers near them."
      />

      <div style={styles.pageContainer}>
        <div className="container" style={styles.innerContainer}>
          {/* Left: Info */}
          <div className="animate-fade-in-up" style={styles.infoSide}>
            <h1 style={styles.infoTitle}>
              Grow your business with <span className="text-gradient">Pro Fix</span>
            </h1>
            <p style={styles.infoText}>
              Join our network of verified local service providers. Get discovered by 
              customers searching for services in your area.
            </p>
            <ul style={styles.benefitList}>
              <li style={styles.benefitItem}><CheckCircle size={20} color="var(--color-primary)" /> Get listed on location-based search</li>
              <li style={styles.benefitItem}><CheckCircle size={20} color="var(--color-primary)" /> Receive customer leads directly</li>
              <li style={styles.benefitItem}><CheckCircle size={20} color="var(--color-primary)" /> Manage your business profile</li>
              <li style={styles.benefitItem}><CheckCircle size={20} color="var(--color-primary)" /> Free to register — no hidden fees</li>
            </ul>
            <p style={styles.loginPrompt}>
              Already registered? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Sign in here</Link>
            </p>
          </div>

          {/* Right: Form */}
          <div className="animate-fade-in-up" style={styles.formSide}>
            {/* Progress bar */}
            <div style={styles.progressBar}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{
                  ...styles.progressStep,
                  background: step >= s 
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))'
                    : 'var(--color-surface-container)',
                  color: step >= s ? '#fff' : 'var(--color-outline)',
                }}>
                  {s}
                </div>
              ))}
              <div style={styles.progressLine}>
                <div style={{...styles.progressFill, width: `${((step - 1) / 2) * 100}%`}} />
              </div>
            </div>

            <div className="glass-card" style={styles.formCard}>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <>
                  <h2 style={styles.stepTitle}><Store size={22} /> Business Details</h2>
                  <div style={styles.formGrid}>
                    <div style={styles.fieldFull}>
                      <label style={styles.fieldLabel}>Business Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sharma AC & Plumbing"
                        value={formData.businessName}
                        onChange={(e) => updateField('businessName', e.target.value)}
                        style={styles.input}
                        className="form-input-auth"
                      />
                    </div>
                    <div>
                      <label style={styles.fieldLabel}>Owner Name *</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={formData.ownerName}
                        onChange={(e) => updateField('ownerName', e.target.value)}
                        style={styles.input}
                        className="form-input-auth"
                      />
                    </div>
                    <div>
                      <label style={styles.fieldLabel}>Phone *</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        style={styles.input}
                        className="form-input-auth"
                      />
                    </div>
                    <div style={styles.fieldFull}>
                      <label style={styles.fieldLabel}>Email *</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        style={styles.input}
                        className="form-input-auth"
                      />
                    </div>
                    <div>
                      <label style={styles.fieldLabel}>Password *</label>
                      <input
                        type="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        style={styles.input}
                        className="form-input-auth"
                      />
                    </div>
                    <div>
                      <label style={styles.fieldLabel}>Confirm Password *</label>
                      <input
                        type="password"
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        style={styles.input}
                        className="form-input-auth"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Services & Address */}
              {step === 2 && (
                <>
                  <h2 style={styles.stepTitle}>Services & Address</h2>
                  
                  <label style={styles.fieldLabel}>Select Services You Offer *</label>
                  <div style={styles.serviceGrid}>
                    {SERVICE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleService(opt.value)}
                        style={{
                          ...styles.serviceChip,
                          ...(formData.services.includes(opt.value) ? styles.serviceChipActive : {})
                        }}
                      >
                        {formData.services.includes(opt.value) && <CheckCircle size={16} />}
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <label style={styles.fieldLabel}>Business Address</label>
                    <div style={styles.formGrid}>
                      <div style={styles.fieldFull}>
                        <input
                          type="text"
                          placeholder="Street address / Shop number"
                          value={formData.address.street}
                          onChange={(e) => updateAddress('street', e.target.value)}
                          style={styles.input}
                          className="form-input-auth"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.address.city}
                          onChange={(e) => updateAddress('city', e.target.value)}
                          style={styles.input}
                          className="form-input-auth"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Pincode"
                          value={formData.address.pincode}
                          onChange={(e) => updateAddress('pincode', e.target.value)}
                          style={styles.input}
                          className="form-input-auth"
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <label style={styles.fieldLabel}>Description (Optional)</label>
                    <textarea
                      placeholder="Tell customers about your business, experience, specializations..."
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      rows="3"
                      style={{ ...styles.input, resize: 'vertical' }}
                      className="form-input-auth"
                    />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={styles.fieldLabel}>WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="Same as phone if left empty"
                      value={formData.whatsappNumber}
                      onChange={(e) => updateField('whatsappNumber', e.target.value)}
                      style={styles.input}
                      className="form-input-auth"
                    />
                  </div>
                </>
              )}

              {/* Step 3: Location */}
              {step === 3 && (
                <>
                  <h2 style={styles.stepTitle}><MapPin size={22} /> Shop Location</h2>
                  <p style={{ color: 'var(--color-on-surface-variant)', marginTop: 0 }}>
                    This helps customers find you when searching for nearby services. 
                    The more accurate, the better!
                  </p>
                  <LocationPicker
                    initialLat={formData.latitude}
                    initialLng={formData.longitude}
                    onLocationSelect={({ latitude, longitude }) => {
                      updateField('latitude', latitude);
                      updateField('longitude', longitude);
                    }}
                  />
                </>
              )}

              {/* Navigation buttons */}
              <div style={styles.navButtons}>
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)} style={styles.backBtn}>
                    <ChevronLeft size={18} /> Back
                  </button>
                )}
                <div style={{ flex: 1 }} />
                {step < 3 ? (
                  <button onClick={handleNext} className="btn-secondary" style={styles.nextBtn}>
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="btn-secondary"
                    style={styles.nextBtn}
                    disabled={submitting}
                  >
                    {submitting ? 'Registering...' : 'Register My Business'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 84px)',
    padding: 'clamp(32px, 5vw, 80px) 0',
    backgroundColor: 'var(--color-surface)',
  },
  innerContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: 'clamp(32px, 5vw, 80px)',
    alignItems: 'start',
  },
  infoSide: {
    position: 'sticky',
    top: '120px',
  },
  infoTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    lineHeight: 1.15,
    marginBottom: '24px',
  },
  infoText: {
    fontSize: '1.15rem',
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.6,
    marginBottom: '32px',
  },
  benefitList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 32px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
  },
  loginPrompt: {
    color: 'var(--color-on-surface-variant)',
    fontSize: '0.95rem',
  },
  formSide: {},
  progressBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px',
    marginBottom: '32px',
    position: 'relative',
  },
  progressStep: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '1rem',
    zIndex: 2,
    transition: 'all 0.3s',
  },
  progressLine: {
    position: 'absolute',
    top: '50%',
    left: '60px',
    right: '60px',
    height: '4px',
    backgroundColor: 'var(--color-surface-container)',
    transform: 'translateY(-50%)',
    borderRadius: '2px',
    zIndex: 1,
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
    borderRadius: '2px',
    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  formCard: {
    padding: 'clamp(24px, 4vw, 40px)',
  },
  stepTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.4rem',
    marginBottom: '24px',
    color: 'var(--color-on-surface)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  fieldFull: {
    gridColumn: '1 / -1',
  },
  fieldLabel: {
    display: 'block',
    fontWeight: '700',
    fontSize: '0.85rem',
    color: 'var(--color-on-surface-variant)',
    marginBottom: '6px',
    letterSpacing: '0.02em',
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '8px',
    border: '2px solid var(--color-surface-container)',
    backgroundColor: 'var(--color-surface-container-low)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--color-on-surface)',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  serviceGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '8px',
  },
  serviceChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '2px solid var(--color-surface-container-high)',
    background: 'transparent',
    color: 'var(--color-on-surface)',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.2s',
  },
  serviceChipActive: {
    borderColor: 'var(--color-primary)',
    background: 'rgba(0, 60, 137, 0.06)',
    color: 'var(--color-primary)',
  },
  navButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid var(--color-surface-container)',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 20px',
    borderRadius: '10px',
    border: '2px solid var(--color-surface-container-high)',
    background: 'transparent',
    color: 'var(--color-on-surface)',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  nextBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
  },
  successPage: {
    minHeight: 'calc(100vh - 84px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: 'var(--color-surface)',
  },
  successCard: {
    maxWidth: '500px',
    textAlign: 'center',
    padding: '48px',
    backgroundColor: 'var(--color-surface-container-lowest)',
    borderRadius: '24px',
    border: '1px solid var(--color-surface-container)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
  },
  successIcon: {
    marginBottom: '24px',
  },
  successTitle: {
    fontSize: '1.8rem',
    marginBottom: '16px',
  },
  successText: {
    fontSize: '1.05rem',
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.6,
    marginBottom: '12px',
  },
  successSubtext: {
    fontSize: '0.9rem',
    color: 'var(--color-outline)',
    lineHeight: 1.6,
    marginBottom: '32px',
  },
  successActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  dashboardBtn: {
    padding: '14px 32px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    display: 'inline-block',
  },
  homeLink: {
    color: 'var(--color-on-surface-variant)',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
};

// Responsive override
const mediaQuery = `@media (max-width: 900px) { .register-grid { grid-template-columns: 1fr !important; } }`;

export default RegisterShop;
