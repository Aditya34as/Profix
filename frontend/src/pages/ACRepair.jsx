import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';
import AnnouncementBar from '../components/AnnouncementBar';
import NearbyShops from '../components/NearbyShops';
import { Phone, CheckCircle, Shield, Clock } from 'lucide-react';

const acServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "AC Repair & Servicing",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Pro Fix Plumbing & HVAC"
  },
  "areaServed": [
    { "@type": "City", "name": "New Delhi" },
    { "@type": "City", "name": "Gurgaon" },
    { "@type": "City", "name": "Noida" }
  ],
  "description": "Emergency AC repair, gas filling, compressor repair, and seasonal servicing for split and window ACs across Delhi NCR.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  }
};

const acFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why isn't my AC cooling?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most common reasons are gas leakage (refrigerant), clogged condenser coils from Delhi dust, and capacitor failure due to voltage fluctuations. Pro Fix technicians diagnose and fix all three daily across NCR."
      }
    },
    {
      "@type": "Question",
      "name": "How fast can Pro Fix send a technician for AC repair?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We guarantee a verified technician at your door within 90 minutes for priority calls in Delhi and Gurgaon."
      }
    }
  ]
};

const ACRepair = () => {
  return (
    <>
      <SEO 
        title="Same-Day AC Repair & Servicing in Delhi NCR" 
        description="Priority dispatched emergency AC repair in Delhi NCR. Expert technicians for freezing ACs, gas filling, and compressor repairs. Book now."
        keywords="AC Repair Delhi, AC Gas filling Gurgaon, Noida HVAC service, 24 hour AC repair near me"
        url="https://www.profixindia.in/services/ac-repair"
        serviceSchema={[acServiceSchema, acFaqSchema]}
      />
      
      {/* Announcement Bar */}
      <AnnouncementBar message="Beat the heatwave — Technicians en route in Delhi NCR today" />

      {/* Hero Section perfectly sized to viewport */}
      <section className="service-hero-section" style={styles.heroSection}>
        <div className="container service-hero-grid" style={styles.heroGrid}>
          <div style={styles.heroContent}>
            <div style={styles.badgeLabel}>ISO Certified Cooling Experts</div>
            <h1 style={styles.heading1}>Emergency AC Repair & Servicing</h1>
            <p style={styles.heroText}>
              Sweating through the 45°C Indian summer? Don't panic. Our verified technicians are on standby to restore your comfort, 7 days a week.
            </p>
            
            <div style={styles.heroActions}>
              <a href="tel:+919876543210" style={styles.callButtonPrimary}>
                <Phone size={24} /> Call Now: +91 98765 43210
              </a>
            </div>
          </div>
          <div style={styles.formContainer}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Troubleshooting Problem Content */}
      <section style={styles.problemSection}>
        <div className="container">
          <div className="problem-grid" style={{ padding: 'clamp(24px, 5vw, 60px)', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '16px' }}>
            <div>
              <h2 style={styles.heading2}>Why isn't my AC Cooling?</h2>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.1rem', marginBottom: '24px' }}>
                It's blistering hot outside, but your AC is just blowing warm air. Here are the common culprits we fix daily across the NCR:
              </p>
              
              <ul style={styles.bulletList}>
                <li style={styles.bulletItem}><CheckCircle color="var(--color-primary)" /> <strong>Gas Leakage (Refrigerant):</strong> The #1 issue. We trace the leak, braze the copper coils, and provide fresh gas filling.</li>
                <li style={styles.bulletItem}><CheckCircle color="var(--color-primary)" /> <strong>Clogged Condenser Coils:</strong> Dust from the Delhi streets clogs the outdoor unit. We perform thorough jet pump cleaning.</li>
                <li style={styles.bulletItem}><CheckCircle color="var(--color-primary)" /> <strong>Capacitor Failure:</strong> Voltage fluctuations fry the start capacitors, preventing the compressor from turning on.</li>
              </ul>
            </div>
            
            <div style={styles.trustBox}>
              <h3 style={styles.heading3}>The Pro Fix Guarantee</h3>
              <div style={styles.trustItem}>
                <Clock color="var(--color-secondary)" size={32} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>90-Minute Response</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-on-surface-variant)' }}>We guarantee a technician at your door within 90 minutes for priority calls in Delhi and Gurgaon.</p>
                </div>
              </div>
              <div style={styles.trustItem}>
                <Shield color="var(--color-secondary)" size={32} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Verified Professionals</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-on-surface-variant)' }}>Our technicians undergo strict background checks and use genuine spare parts for long-lasting repairs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section style={styles.reviewSection}>
        <div className="container">
          <h2 style={{...styles.heading2, textAlign: 'center', marginBottom: '40px'}}>NCR Relies on Pro Fix</h2>
          <div style={styles.reviewCards}>
            <div style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"My Split AC died completely in mid-May. Pro Fix had a tech out to my apartment in South Delhi within an hour. Professional and very reasonable rates!"</p>
              <p style={styles.reviewer}>- Neha K., South Extension</p>
            </div>
            <div style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"Upfront pricing and no upselling. They quickly diagnosed the gas leak, repaired the copper piping, and recharged the refrigerant. Highly recommend."</p>
              <p style={styles.reviewer}>- Sameer S., DLF Phase 3, Gurgaon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby AC Repair Shops */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '0 0 20px' }}>
        <div className="container">
          <NearbyShops service="ac-repair" title="AC Repair Shops Near You" limit={3} />
        </div>
      </section>
      
      {/* Sticky Mobile Footer — only visible on mobile via CSS */}
      <div className="sticky-mobile-cta">
         <a href="tel:+919876543210" style={{...styles.callButtonPrimary, width: '100%', justifyContent: 'center', padding: '12px' }}>
            <Phone size={20} /> Call +91 98765 43210
          </a>
      </div>
    </>
  );
};

const styles = {
  heroSection: {
    minHeight: 'calc(100vh - 84px - 42px)', // navbar offset + announcement bar
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--color-surface)',
    padding: '32px 0',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 380px',
    gap: '40px',
    alignItems: 'center',
    width: '100%'
  },
  heroContent: {
    maxWidth: '600px',
  },
  badgeLabel: {
    display: 'inline-block',
    backgroundColor: 'var(--color-surface-container-high)',
    color: 'var(--color-on-surface-variant)',
    padding: '6px 12px',
    borderRadius: '4px',
    fontWeight: '700',
    fontSize: '0.8rem',
    marginBottom: '24px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  },
  heading1: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    lineHeight: '1.2',
    color: 'var(--color-on-surface)',
    marginBottom: '24px',
  },
  heroText: {
    fontSize: '1.25rem',
    color: 'var(--color-on-surface-variant)',
    marginBottom: '40px',
    lineHeight: '1.6'
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  callButtonPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'var(--color-secondary)',
    color: 'var(--color-on-secondary)',
    padding: '18px 32px',
    borderRadius: '8px',
    fontSize: '1.2rem',
    fontWeight: '800',
    textDecoration: 'none',
    boxShadow: '0px 10px 20px rgba(177, 45, 0, 0.2)',
    transition: 'transform 0.2s',
  },
  problemSection: {
    position: 'relative',
    padding: 'clamp(60px, 10vw, 120px) 0'
  },
  heading2: {
    fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
    marginBottom: '16px'
  },
  heading3: {
    fontSize: '1.5rem',
    marginBottom: '24px',
  },
  bulletList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  bulletItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    fontSize: '1.1rem',
    color: 'var(--color-on-surface)'
  },
  trustBox: {
    backgroundColor: 'var(--color-surface-container-lowest)',
    border: '1px solid var(--color-surface-container)',
    padding: 'clamp(24px, 4vw, 40px)',
    borderRadius: '16px',
    height: 'fit-content',
    marginTop: '40px',
  },
  trustItem: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
  },
  reviewSection: {
    position: 'relative',
    padding: 'clamp(60px, 10vw, 120px) 0',
    backgroundColor: 'var(--color-surface-container-lowest)'
  },
  reviewCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: '24px'
  },
  reviewCard: {
    backgroundColor: 'var(--color-surface-container-lowest)',
    padding: 'clamp(24px, 4vw, 40px)',
    borderRadius: '8px',
    boxShadow: '0 10px 30px rgba(25, 28, 30, 0.04)',
    border: '1px solid var(--color-surface-container)'
  },
  stars: {
    fontSize: '1.5rem',
    marginBottom: '16px'
  },
  reviewText: {
    fontSize: '1.1rem',
    fontStyle: 'italic',
    color: 'var(--color-on-surface-variant)',
    marginBottom: '24px'
  },
  reviewer: {
    fontWeight: '700',
    color: 'var(--color-on-surface)'
  },
  stickyMobileCall: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-surface-container-lowest)',
    padding: '16px',
    borderTop: '1px solid var(--color-outline-variant)',
    zIndex: 1000,
  }
};

export default ACRepair;
