import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.footerGrid}>
          
          <div style={styles.col}>
            <div style={styles.logo}>PRO FIX</div>
            <p style={styles.footerText}>
              Delhi NCR's trusted choice for premium plumbing and HVAC repair services. Fast, honest, and certified experts.
            </p>
            <p style={styles.footerContact}>
               Helpline: <strong>+91 98765 43210</strong><br />
               Email: info@profixindia.in
            </p>
          </div>

          <div style={styles.col}>
            <h4 style={styles.colTitle}>Services</h4>
            <ul style={styles.linkList}>
              <li><Link to="/services/plumbing">Emergency Plumbing</Link></li>
              <li><span style={{color: 'var(--color-outline)'}}>Water Tank Cleaning</span></li>
              <li><Link to="/services/ac-repair">Split & Window AC Repair</Link></li>
              <li><span style={{color: 'var(--color-outline)'}}>Geyser Installation</span></li>
            </ul>
          </div>

          <div style={styles.col}>
            <div style={styles.seoAreaBox}>
              <h4 style={styles.colTitle}>NCR Areas Served</h4>
              <p style={styles.footerText}>
                 We provide rapid 90-minute response dispatch to key neighborhoods including:
              </p>
              <ul style={styles.linkList}>
                <li><span style={{color: 'var(--color-outline-variant)'}}>South Delhi (GK, Def Col)</span></li>
                <li><span style={{color: 'var(--color-outline-variant)'}}>Gurgaon (DLF Phase 1-5)</span></li>
                <li><span style={{color: 'var(--color-outline-variant)'}}>Noida (Sector 15-62)</span></li>
                <li><span style={{color: 'var(--color-outline-variant)'}}>Vasant Kunj & Dwarka</span></li>
              </ul>
            </div>
          </div>
          
        </div>
        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Pro Fix India Plumbers & HVAC. All rights reserved.</p>
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
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  seoAreaBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '32px',
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
