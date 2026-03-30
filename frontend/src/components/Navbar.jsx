import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (location.pathname === '/') {
        const sections = ['how-it-works', 'why-us', 'reviews', 'faq'];
        let current = '';
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 + 100 && rect.bottom >= 100) {
              current = section;
              break;
            }
          }
        }
        if (window.scrollY < 300) current = '';
        setActiveSection(current);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith('/services')) {
      setActiveSection(location.pathname);
    }
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const getNavLinkStyle = (id) => {
    const isActive = activeSection === id;
    return {
      color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
      fontWeight: isActive ? '800' : '600',
      borderBottom: isActive ? '2px solid var(--color-primary)' : 'none',
      paddingBottom: isActive ? '4px' : '0',
      fontSize: '1rem',
      textDecoration: 'none',
      cursor: 'pointer',
    };
  };

  return (
    <>
      <nav className={`site-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          
          {/* Logo */}
          <Link to="/" style={{fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--color-primary)', textDecoration: 'none'}}>
            PRO FIX
          </Link>
          
          {/* Desktop Links */}
          <div className="desktop-nav-links">
            <div 
              className="service-dropdown-wrap"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              style={{position: 'relative', padding: '12px 0', borderBottom: location.pathname.startsWith('/services') ? '2px solid var(--color-primary)' : 'none'}}
            >
              <span style={{...getNavLinkStyle(''), fontWeight: location.pathname.startsWith('/services') ? '800' : '600', color: location.pathname.startsWith('/services') ? 'var(--color-primary)' : 'var(--color-on-surface-variant)', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                Services <ChevronDown size={14} style={{marginLeft: '2px'}}/>
              </span>
              {dropdownOpen && (
                <div style={{position: 'absolute', top: '100%', left: '-16px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '12px', padding: '12px 0', minWidth: '220px', border: '1px solid var(--color-surface-container-high)', zIndex: 200}}>
                  <Link to="/services/ac-repair" style={{display: 'block', padding: '12px 24px', color: activeSection === '/services/ac-repair' ? 'var(--color-primary)' : 'var(--color-on-surface)', fontWeight: '600', textDecoration: 'none'}}>AC Repair</Link>
                  <Link to="/services/plumbing" style={{display: 'block', padding: '12px 24px', color: activeSection === '/services/plumbing' ? 'var(--color-primary)' : 'var(--color-on-surface)', fontWeight: '600', textDecoration: 'none'}}>Plumbing</Link>
                  <Link to="/services/geysers" style={{display: 'block', padding: '12px 24px', color: activeSection === '/services/geysers' ? 'var(--color-primary)' : 'var(--color-on-surface)', fontWeight: '600', textDecoration: 'none'}}>Geysers</Link>
                </div>
              )}
            </div>
            <a href="/#why-us" style={getNavLinkStyle('why-us')}>Why Us</a>
            <a href="/#how-it-works" style={getNavLinkStyle('how-it-works')}>Process</a>
            <a href="/#reviews" style={getNavLinkStyle('reviews')}>Reviews</a>
            <a href="/#faq" style={getNavLinkStyle('faq')}>FAQ</a>
          </div>

          {/* Action Buttons */}
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <a href="tel:+919876543210" className="desktop-call-btn" style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', color: 'var(--color-on-primary)', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', boxShadow: '0px 10px 20px rgba(26, 83, 173, 0.2)'}}>
              <Phone size={20} />
              <span>+91 98765 43210</span>
            </a>
            
            {/* Mobile hamburger */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{background: 'none', border: 'none', padding: '8px', cursor: 'pointer'}}
            >
              {mobileMenuOpen ? <X size={28} color="var(--color-on-surface)" /> : <Menu size={28} color="var(--color-on-surface)" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <p style={{fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '8px'}}>Services</p>
              <Link to="/services/ac-repair" style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>AC Repair</Link>
              <Link to="/services/plumbing" style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Plumbing</Link>
              <Link to="/services/geysers" style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Geysers</Link>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px'}}>
              <p style={{fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '8px'}}>Navigation</p>
              <a href="/#why-us" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Why Us</a>
              <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Process</a>
              <a href="/#reviews" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Reviews</a>
              <a href="/#faq" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none'}}>FAQ</a>
            </div>
            <a href="tel:+919876543210" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem', textDecoration: 'none', marginTop: '32px'}}>
              <Phone size={22} /> Call +91 98765 43210
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
