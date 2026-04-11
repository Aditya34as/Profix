import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, Menu, X, ChevronDown, Search, Store, LayoutDashboard, Shield, Wind, Droplet, Thermometer, Zap, Hammer, Paintbrush, Sparkles, Bug } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, shop } = useAuth();

  const CATEGORIES = [
    { label: 'AC Repair', path: '/services/ac-repair', value: 'ac-repair', icon: Wind },
    { label: 'Plumbing', path: '/services/plumbing', value: 'plumbing', icon: Droplet },
    { label: 'Geyser/Heater', path: '/services/geysers', value: 'water-heater', icon: Thermometer },
    { label: 'Electrical', path: '/find-services?service=electrical', value: 'electrical', icon: Zap },
    { label: 'Carpentry', path: '/find-services?service=carpentry', value: 'carpentry', icon: Hammer },
    { label: 'Painting', path: '/find-services?service=painting', value: 'painting', icon: Paintbrush },
    { label: 'Cleaning', path: '/find-services?service=cleaning', value: 'cleaning', icon: Sparkles },
    { label: 'Pest Control', path: '/find-services?service=pest-control', value: 'pest-control', icon: Bug },
  ];

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
                <div style={{position: 'absolute', top: '100%', left: '-50px', backgroundColor: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', borderRadius: '16px', padding: '16px', minWidth: '420px', border: '1px solid var(--color-surface-container-high)', zIndex: 200, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeSection === cat.path || location.search.includes(cat.value);
                    return (
                      <Link 
                        key={cat.label} 
                        to={cat.path} 
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', 
                          color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface)', 
                          backgroundColor: isActive ? 'var(--color-primary-container)' : 'transparent',
                          borderRadius: '10px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive ? 'var(--color-primary-container)' : 'transparent'}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: isActive ? 'rgba(0,60,137,0.1)' : 'var(--color-surface-container)'}}>
                          <Icon size={16} />
                        </div>
                        {cat.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
            <a href="/#why-us" style={getNavLinkStyle('why-us')}>Why Us</a>
            <a href="/#reviews" style={getNavLinkStyle('reviews')}>Reviews</a>
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
              <p style={{fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '8px'}}>Full Categories</p>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeSection === cat.path || location.search.includes(cat.value);
                  return (
                    <Link 
                      key={cat.label} 
                      to={cat.path} 
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', 
                        padding: '16px', borderRadius: '12px',
                        background: isActive ? 'var(--color-primary-container)' : 'var(--color-surface-container-low)',
                        color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface)',
                        fontWeight: '700', textDecoration: 'none', border: '1px solid var(--color-surface-container)'
                      }}
                    >
                      <Icon size={20} />
                      <span style={{fontSize: '0.9rem'}}>{cat.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px'}}>
              <p style={{fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '8px'}}>Navigation</p>
              <a href="/#why-us" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Why Us</a>
              <a href="/#reviews" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)'}}>Reviews</a>
              <a href="/#faq" onClick={() => setMobileMenuOpen(false)} style={{padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none'}}>FAQ</a>
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
