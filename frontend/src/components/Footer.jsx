import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, Clock, MapPin, Wind, Droplet, Thermometer, Sparkles } from 'lucide-react';

const SERVICE_LINKS = [
  { to: '/find-services?service=ac-repair', label: 'AC Repair & Servicing', icon: Wind },
  { to: '/find-services?service=plumbing', label: 'Plumbing Solutions', icon: Droplet },
  { to: '/find-services?service=water-heater', label: 'Geyser & Water Heater', icon: Thermometer },
  { to: '/find-services?service=cleaning', label: 'Deep Cleaning', icon: Sparkles },
];

/* ─── Social Media SVG Icons ─── */
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const TwitterXIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const YouTubeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/profixindia', Icon: InstagramIcon, color: '#E4405F' },
  { label: 'Facebook', href: 'https://www.facebook.com/profixindia', Icon: FacebookIcon, color: '#1877F2' },
  { label: 'X (Twitter)', href: 'https://x.com/profixindia', Icon: TwitterXIcon, color: '#fff' },
  { label: 'YouTube', href: 'https://www.youtube.com/@profixindia', Icon: YouTubeIcon, color: '#FF0000' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/profixindia', Icon: LinkedInIcon, color: '#0A66C2' },
  { label: 'WhatsApp', href: 'https://wa.me/919876543210', Icon: WhatsAppIcon, color: '#25D366' },
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
              India's trusted marketplace for verified home service professionals. AC repair, plumbing, geyser installation & deep cleaning — all at your doorstep with transparent pricing and a 30-day warranty.
            </p>
            <div style={styles.contactList}>
               <div style={styles.contactItem}>
                 <Phone size={15} color="var(--color-primary-container)" />
                 <a href="tel:+919876543210" style={styles.contactLink}>+91 98765 43210</a>
               </div>
               <div style={styles.contactItem}>
                 <Mail size={15} color="var(--color-primary-container)" />
                 <a href="mailto:info@profixindia.in" style={styles.contactLink}>info@profixindia.in</a>
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

        {/* ─── Social Media Row ─── */}
        <div style={styles.socialSection}>
          <h4 style={styles.socialTitle}>Follow Us</h4>
          <div style={styles.socialRow}>
            {SOCIAL_LINKS.map(({ label, href, Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow Pro Fix on ${label}`}
                title={label}
                style={styles.socialLink}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = color;
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Pro Fix India — Professional Home Services. All rights reserved.</p>
          <p style={styles.seoLine}>
            AC Repair Near Me · Plumber Near Me · Geyser Repair Delhi NCR · Home Cleaning Services · Trusted Service Professionals India
          </p>
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
    marginBottom: '48px'
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
  contactLink: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    transition: 'color 0.2s',
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

  /* Social media section */
  socialSection: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '32px',
    marginBottom: '32px',
    textAlign: 'center',
  },
  socialTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '20px',
  },
  socialRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },
  socialLink: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textDecoration: 'none',
    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
  },

  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '32px',
    textAlign: 'center',
    color: 'var(--color-outline-variant)',
    fontSize: '0.9rem'
  },
  seoLine: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.25)',
    marginTop: '8px',
    letterSpacing: '0.02em',
  },
};

export default Footer;
