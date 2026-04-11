import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.footerGrid}>
          
          <div style={styles.col}>
            <div style={styles.logo}>PRO FIX</div>
            <p style={styles.footerText}>
              India's trusted platform connecting customers with verified local home service providers. 
              Find the nearest experts for AC repair, plumbing, and more.
            </p>
            <p style={styles.footerContact}>
               Helpline: <strong>+91 98765 43210</strong><br />
               Email: info@profixindia.in
            </p>
          </div>

          <div style={styles.col}>
            <h4 style={styles.colTitle}>For Customers</h4>
            <ul style={styles.linkList}>
              <li><Link to="/find-services">Find Services Near Me</Link></li>
              <li><Link to="/find-services?service=ac-repair">AC Repair</Link></li>
              <li><Link to="/find-services?service=plumbing">Plumbing</Link></li>
              <li><Link to="/find-services?service=water-heater">Geyser / Water Heater</Link></li>
              <li><Link to="/find-services?service=cleaning">Cleaning</Link></li>
            </ul>
          </div>

          <div style={styles.col}>
            <h4 style={styles.colTitle}>For Businesses</h4>
            <ul style={styles.linkList}>
              <li><Link to="/register">Register Your Business</Link></li>
              <li><Link to="/login">Shop Owner Login</Link></li>
              <li><Link to="/dashboard">Business Dashboard</Link></li>
            </ul>
            <div style={styles.seoAreaBox}>
              <Store size={18} color="var(--color-primary-container)" />
              <span style={{fontSize: '0.85rem', color: 'var(--color-outline-variant)'}}>
                Free registration — Join 100s of local service businesses
              </span>
            </div>
          </div>
          
        </div>
        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Pro Fix India — Local Services Marketplace. All rights reserved.</p>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    marginBottom: '64px'
  },
  col: {},
  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    color: 'var(--color-primary-container)',
    marginBottom: '24px'
  },
  colTitle: {
    fontSize: '1.2rem',
    marginBottom: '24px',
    color: '#ffffff'
  },
  footerText: {
    color: 'var(--color-outline-variant)',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  footerContact: {
    color: '#ffffff',
    lineHeight: '1.6',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  seoAreaBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)'
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
