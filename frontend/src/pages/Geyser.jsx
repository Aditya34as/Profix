import SEO from '../components/SEO';
import ContactForm from '../components/ContactForm';
import AnnouncementBar from '../components/AnnouncementBar';
import NearbyShops from '../components/NearbyShops';
import { Phone, CheckCircle, Shield, Clock } from 'lucide-react';

const geyserServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Geyser & Water Heater Repair",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Pro Fix Plumbing & HVAC"
  },
  "areaServed": [
    { "@type": "City", "name": "New Delhi" },
    { "@type": "City", "name": "Gurgaon" },
    { "@type": "City", "name": "Noida" }
  ],
  "description": "Geyser and water heater repair, thermostat replacement, heating element replacement, and leak fixing for all major brands.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  }
};

const geyserFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why is my geyser not heating water?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Common causes include a burnt heating element (hard water in Delhi NCR burns copper elements fast), a broken thermostat, or internal tank leakage."
      }
    },
    {
      "@type": "Question",
      "name": "Do you repair all geyser brands?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Pro Fix technicians are trained to repair all major brands including Bajaj, Havells, Crompton, AO Smith, and Racold."
      }
    }
  ]
};

const Geyser = () => {
  return (
    <>
      <SEO 
        title="Geyser & Water Heater Repair Delhi NCR" 
        description="Instant geyser repair in Delhi NCR. Thermostat changes, element replacements, and leakage fixes for all geyser brands. Book now."
        keywords="Geyser repair Delhi, Water heater fixing Gurgaon, Noida geyser service, Instant hot water repair"
        url="https://www.profixindia.in/services/geysers"
        serviceSchema={[geyserServiceSchema, geyserFaqSchema]}
      />
      
      {/* Announcement Bar */}
      <AnnouncementBar message="No hot water? — Same-day geyser repair in Delhi NCR" />

      {/* Hero Section perfectly sized to viewport */}
      <section className="service-hero-section" style={styles.heroSection}>
        <div className="container service-hero-grid" style={styles.heroGrid}>
          <div data-reveal="left" style={styles.heroContent}>
            <div style={styles.badgeLabel}>All Brands Supported</div>
            <h1 style={styles.heading1}>Fast Geyser & Heater Repair</h1>
            <p style={styles.heroText}>
              Winter chills and your geyser stopped working? Our technicians are ready to restore your hot water instantly, with genuine spare parts for absolute safety.
            </p>
            
            <div style={styles.heroActions}>
              <a href="tel:+919876543210" style={styles.callButtonPrimary}>
                <Phone size={24} /> Call Now: +91 98765 43210
              </a>
            </div>
          </div>
          <div data-reveal="right" data-delay="2" style={styles.formContainer}>
            <ContactForm defaultService="water-heater" />
          </div>
        </div>
      </section>

      {/* Troubleshooting Problem Content */}
      <section style={styles.problemSection}>
        <div className="container">
          <div data-reveal="up" className="problem-grid" style={{ padding: 'clamp(24px, 5vw, 60px)', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '16px' }}>
            <div>
              <h2 style={styles.heading2}>Is Your Geyser Not Heating?</h2>
              <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '1.1rem', marginBottom: '24px' }}>
                Don't tolerate ice-cold showers. Here are the common geyser and water heater faults we troubleshoot:
              </p>
              
              <ul style={styles.bulletList}>
                <li style={styles.bulletItem}><CheckCircle color="var(--color-primary)" /> <strong>Heating Element Deceased:</strong> Hard water in Delhi NCR burns out copper elements fast. We replace them with authentic branded elements.</li>
                <li style={styles.bulletItem}><CheckCircle color="var(--color-primary)" /> <strong>Broken Thermostat:</strong> Geyser suddenly overheating or completely cold? The thermostat needs an immediate replacement.</li>
                <li style={styles.bulletItem}><CheckCircle color="var(--color-primary)" /> <strong>Tank Leakage:</strong> Internal pipe ruptures or valve leakage? We seal the tank gaps or advise for replacement if permanently corroded.</li>
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
          <h2 data-reveal="up" style={{...styles.heading2, textAlign: 'center', marginBottom: '40px'}}>NCR Relies on Pro Fix</h2>
          <div style={styles.reviewCards}>
            <div data-reveal="scale" data-delay="1" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"My Bajaj geyser was short-circuiting every time I turned it on. The technician replaced the dead element and safely rewired it in under an hour."</p>
              <p style={styles.reviewer}>- Swati Verma, Gurgaon</p>
            </div>
            <div data-reveal="scale" data-delay="3" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"Prompt and polite service. They didn't overcharge for the thermostat and fixed the water leakage cleanly."</p>
              <p style={styles.reviewer}>- Dinesh K., South Delhi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Geyser Repair Shops */}
      <section style={{ backgroundColor: 'var(--color-surface)', padding: '0 0 20px' }}>
        <div className="container">
          <NearbyShops service="water-heater" title="Water Heater Shops Near You" limit={3} />
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
    minHeight: 'calc(100vh - 84px - 42px)',
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
    fontSize: '2.5rem',
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
    padding: '40px',
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
    gap: '32px'
  },
  reviewCard: {
    backgroundColor: 'var(--color-surface-container-lowest)',
    padding: '40px',
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

export default Geyser;
