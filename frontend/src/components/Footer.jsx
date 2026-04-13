import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Wind, Droplet, Thermometer, Sparkles } from 'lucide-react';

const SERVICE_LINKS = [
  { to: '/find-services?service=ac-repair', label: 'AC Repair & Servicing', icon: Wind },
  { to: '/find-services?service=plumbing', label: 'Plumbing Solutions', icon: Droplet },
  { to: '/find-services?service=water-heater', label: 'Geyser & Water Heater', icon: Thermometer },
  { to: '/find-services?service=cleaning', label: 'Deep Cleaning', icon: Sparkles },
];

const Footer = () => {
  const navigate = useNavigate();

  const handleServiceClick = (to) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.footerGrid}>
          
          {/* Brand & Contact */}
          <div data-reveal="up" data-delay="1" style={styles.col}>
            <div style={styles.logo}>
              <img src="/favicon.svg" alt="Pro Fix" style={{ width: '32px', height: '32px', borderRadius: '7px' }} />
              <span>PRO<span style={{ fontWeight: '500', opacity: 0.7 }}> FIX</span></span>
            </div>
            <p style={styles.footerText}>
              Professional home repair & maintenance services delivered by verified, experienced technicians. Transparent pricing, guaranteed satisfaction.
            </p>
            <div style={styles.contactList}>
               <div style={styles.contactItem}>
                 <Phone size={15} color="var(--color-primary-container)" />
                 <span>+91 98765 43210</span>
               </div>
               <div style={styles.contactItem}>
                 <Mail size={15} color="var(--color-primary-container)" />
                 <span>info@profixindia.in</span>
               </div>
               <div style={styles.contactItem}>
                 <Clock size={15} color="var(--color-primary-container)" />
                 <span>Mon–Sun, 8 AM – 9 PM</span>
               </div>
               <div style={styles.contactItem}>
                 <MapPin size={15} color="var(--color-primary-container)" />
                 <span>Delhi NCR & Expanding</span>
               </div>
            </div>
          </div>

          {/* Services */}
          <div data-reveal="up" data-delay="3" style={styles.col}>
            <h4 style={styles.colTitle}>Our Services</h4>
            <ul style={styles.linkList}>
              {SERVICE_LINKS.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <button onClick={() => handleServiceClick(to)} style={styles.footerLinkBtn}>
                    <Icon size={14} /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div data-reveal="up" data-delay="5" style={styles.col}>
            <h4 style={styles.colTitle}>Quick Links</h4>
            <ul style={styles.linkList}>
              <li><Link to="/find-services">Book a Service</Link></li>
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><a href="/#why-us">Why Choose Us</a></li>
              <li><a href="/#reviews">Customer Reviews</a></li>
              <li><a href="/#faq">FAQs</a></li>
            </ul>
            <div style={styles.promiseBox}>
              <strong style={{color: '#fff', fontSize: '0.85rem'}}>✓ 30-Day Service Warranty</strong>
              <span style={{fontSize: '0.8rem', color: 'var(--color-outline-variant)'}}>
                On every repair & installation
              </span>
            </div>
          </div>
          
        </div>
        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Pro Fix India — Professional Home Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--color-on-surface)',
    color: '#ffffff',
    padding: '80px 0 40px 0',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '40px',
    marginBottom: '64px'
  },
  col: {},
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    color: 'var(--color-primary-container)',
    marginBottom: '16px'
  },
  colTitle: {
    fontSize: '1.2rem',
    marginBottom: '24px',
    color: '#ffffff'
  },
  footerText: {
    color: 'var(--color-outline-variant)',
    lineHeight: '1.6',
    marginBottom: '20px',
    fontSize: '0.92rem',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.9rem',
  },
  footerLinkBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    padding: 0,
    color: 'var(--color-primary-container)',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  promiseBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '32px',
    textAlign: 'center',
    color: 'var(--color-outline-variant)',
    fontSize: '0.9rem'
  }
};

export default Footer;
