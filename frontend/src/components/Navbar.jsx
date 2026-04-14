import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu, X, ChevronDown, Search, Store, LayoutDashboard,
  Wind, Droplet, Thermometer, Sparkles, User, LogOut, Eye, Shield
} from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isShopOwner, isCustomer, isAdmin, shop, user, logout } = useAuth();

  const CATEGORIES = [
    { label: 'AC Repair', path: '/find-services?service=ac-repair', value: 'ac-repair', icon: Wind },
    { label: 'Plumbing', path: '/find-services?service=plumbing', value: 'plumbing', icon: Droplet },
    { label: 'Geyser/Heater', path: '/find-services?service=water-heater', value: 'water-heater', icon: Thermometer },
    { label: 'Cleaning', path: '/find-services?service=cleaning', value: 'cleaning', icon: Sparkles },
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
    if (location.pathname.startsWith('/services')) setActiveSection(location.pathname);
  }, [location.pathname]);

  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

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

  const displayName = isShopOwner
    ? (shop?.businessName?.split(' ')[0] || 'Business')
    : (user?.name?.split(' ')[0] || 'Account');

  return (
    <>
      <nav className={`site-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/favicon.svg" alt="Pro Fix" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
            <span style={{
              fontSize: '1.45rem',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, var(--color-primary), #4d94ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}>
              PRO<span style={{ WebkitTextFillColor: 'var(--color-on-surface)', fontWeight: '600' }}> FIX</span>
            </span>
          </Link>

          {/* ── Desktop Links ── */}
          <div className="desktop-nav-links">
            {isCustomer && (
              <>
                <Link to="/find-services" style={{
                  ...getNavLinkStyle('/find-services'),
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <Search size={16} /> Find Services
                </Link>

                <div
                  className="service-dropdown-wrap"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  style={{ position: 'relative', padding: '12px 0', borderBottom: location.pathname.startsWith('/services') ? '2px solid var(--color-primary)' : 'none' }}
                >
                  <span style={{ ...getNavLinkStyle(''), fontWeight: location.pathname.startsWith('/services') ? '800' : '600', color: location.pathname.startsWith('/services') ? 'var(--color-primary)' : 'var(--color-on-surface-variant)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    Categories <ChevronDown size={14} style={{ marginLeft: '2px' }} />
                  </span>
                  {dropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: '-50px', backgroundColor: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', borderRadius: '16px', padding: '16px', minWidth: '420px', border: '1px solid var(--color-surface-container-high)', zIndex: 200, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = location.search.includes(cat.value);
                        return (
                          <Link
                            key={cat.label}
                            to={cat.path}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface)', backgroundColor: isActive ? 'var(--color-primary-container)' : 'transparent', borderRadius: '10px', fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive ? 'var(--color-primary-container)' : 'transparent'}
                            onClick={() => setDropdownOpen(false)}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: isActive ? 'rgba(0,60,137,0.1)' : 'var(--color-surface-container)' }}>
                              <Icon size={16} />
                            </div>
                            {cat.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
                <a href="/#why-us" style={getNavLinkStyle('why-us')}>Why Us</a>
                <a href="/#reviews" style={getNavLinkStyle('reviews')}>Reviews</a>
              </>
            )}

            {isShopOwner && (
              <>
                <Link to="/dashboard" style={{
                  ...getNavLinkStyle('/dashboard'),
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                {shop?._id && (
                  <Link to={`/shop/${shop._id}`} style={{
                    ...getNavLinkStyle(`/shop/${shop._id}`),
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Eye size={16} /> Public Profile
                  </Link>
                )}
              </>
            )}

            {isAdmin && (
              <Link to="/admin" style={{
                ...getNavLinkStyle('/admin'),
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <Shield size={16} /> Admin Console
              </Link>
            )}
          </div>

          {/* ── Action area ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="desktop-call-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--color-on-surface)', fontSize: '0.9rem' }}>
                {isShopOwner ? <Store size={16} /> : <User size={16} />} {displayName}
              </span>
              <button
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', borderRadius: '8px', border: '2px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
            >
              {mobileMenuOpen ? <X size={28} color="var(--color-on-surface)" /> : <Menu size={28} color="var(--color-on-surface)" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>

            {isCustomer && (
              <>
                <Link to="/find-services" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem', textDecoration: 'none', marginBottom: '24px' }}>
                  <Search size={20} /> Find Services Near Me
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '8px' }}>Categories</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.label}
                          to={cat.path}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', padding: '16px', borderRadius: '12px', background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', fontWeight: '700', textDecoration: 'none', border: '1px solid var(--color-surface-container)' }}
                        >
                          <Icon size={20} />
                          <span style={{ fontSize: '0.9rem' }}>{cat.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '8px' }}>Navigation</p>
                  <a href="/#why-us" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)' }}>Why Us</a>
                  <a href="/#reviews" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none', borderBottom: '1px solid var(--color-surface-container)' }}>Reviews</a>
                  <a href="/#faq" onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 0', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-on-surface)', textDecoration: 'none' }}>FAQ</a>
                </div>
              </>
            )}

            {isShopOwner && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem', textDecoration: 'none', marginBottom: '16px' }}>
                  <LayoutDashboard size={20} /> Go to Dashboard
                </Link>
                {shop?._id && (
                  <Link to={`/shop/${shop._id}`} onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', marginBottom: '16px' }}>
                    <Eye size={18} /> View Public Profile
                  </Link>
                )}
              </>
            )}

            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'linear-gradient(135deg, #dc2626, #f87171)', color: '#fff', padding: '14px', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', textDecoration: 'none', marginBottom: '16px' }}>
                <Shield size={18} /> Admin Console
              </Link>
            )}

            {/* Account section */}
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--color-surface-container)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-outline)', marginBottom: '12px' }}>Your Account</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '12px', background: 'var(--color-surface-container-low)', marginBottom: '10px' }}>
                {isShopOwner ? <Store size={20} color="var(--color-primary)" /> : <User size={20} color="var(--color-primary)" />}
                <div>
                  <span style={{ fontWeight: '700', color: 'var(--color-on-surface)', display: 'block' }}>{displayName}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-outline)' }}>{isShopOwner ? 'Business Account' : 'Customer Account'}</span>
                </div>
              </div>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '12px', border: '2px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
