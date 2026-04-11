import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, Menu, X, ChevronDown, Search, Store, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const { isAuthenticated, shop } = useAuth();

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const getNavLinkStyle = (id) => {
    const isActive = activeSection === id || location.pathname === id;
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
            {/* Find Services — Prominent */}
            <Link to="/find-services" style={{
              ...getNavLinkStyle('/find-services'),
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <Search size={16} /> Find Services
            </Link>

            <div 
              className="service-dropdown-wrap"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              style={{position: 'relative', padding: '12px 0', borderBottom: location.pathname.startsWith('/services') ? '2px solid var(--color-primary)' : 'none'}}
            >
              <span style={{...getNavLinkStyle(''), fontWeight: location.pathname.startsWith('/services') ? '800' : '600', color: location.pathname.startsWith('/services') ? 'var(--color-primary)' : 'var(--color-on-surface-variant)', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                Categories <ChevronDown size={14} style={{marginLeft: '2px'}}/>
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
            <a href="/#reviews" style={getNavLinkStyle('reviews')}>Reviews</a>
            <Link to="/admin" style={{ ...getNavLinkStyle(''), fontSize: '0.85rem', opacity: 0.85 }} title="Approve new businesses">
              <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Admin
            </Link>
          </div>

          {/* Action Buttons */}
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="desktop-call-btn" style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', color: 'var(--color-on-primary)', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', boxShadow: '0px 10px 20px rgba(26, 83, 173, 0.2)'}}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link to="/register" className="desktop-call-btn" style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', color: 'var(--color-on-primary)', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', boxShadow: '0px 10px 20px rgba(26, 83, 173, 0.2)'}}>
                <Store size={18} />
                <span>List Your Business</span>
              </Link>
            )}
            
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
            {/* Primary Actions */}
            <Link to="/find-services" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem', textDecoration: 'none', marginBottom: '24px'}}>
              <Search size={20} /> Find Services Near Me
            </Link>

            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <p style={{fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '8px'}}>Categories</p>
              <Link to="/services/ac-repair" style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>AC Repair</Link>
              <Link to="/services/plumbing" style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Plumbing</Link>
              <Link to="/services/geysers" style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Geysers</Link>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px'}}>
              <p style={{fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '8px'}}>Navigation</p>
              <a href="/#why-us" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Why Us</a>
              <a href="/#reviews" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Reviews</a>
              <a href="/#faq" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none'}}>FAQ</a>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <Shield size={18} /> Admin
              </Link>
            </div>

            {/* Business links */}
            <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-surface-container)'}}>
              <p style={{fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '12px'}}>For Businesses</p>
              {isAuthenticated ? (
                <Link to="/dashboard" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', textDecoration: 'none'}}>
                  <LayoutDashboard size={18} /> Go to Dashboard
                </Link>
              ) : (
                <div style={{display: 'flex', gap: '10px'}}>
                  <Link to="/register" style={{flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', color: '#fff', padding: '14px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none'}}>
                    Register
                  </Link>
                  <Link to="/login" style={{flex: 1, textAlign: 'center', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', padding: '14px', borderRadius: '12px', fontWeight: '700', textDecoration: 'none'}}>
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
