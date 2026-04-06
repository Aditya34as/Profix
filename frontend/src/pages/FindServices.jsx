import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import ShopCard from '../components/ShopCard';
import { Search, MapPin, Filter, Loader, LocateFixed } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SERVICE_OPTIONS = [
  { value: 'all', label: 'All Services' },
  { value: 'ac-repair', label: 'AC Repair' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'water-heater', label: 'Geyser / Water Heater' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'painting', label: 'Painting' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'pest-control', label: 'Pest Control' },
];

const FindServices = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState('all');
  const [radius, setRadius] = useState(15);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, detecting, granted, denied
  const [searchMode, setSearchMode] = useState('nearby'); // nearby, all

  // Read initial service from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const svc = params.get('service');
    if (svc) setService(svc);
  }, []);

  useEffect(() => {
    if (searchMode === 'all') {
      fetchAllShops();
    } else if (userLocation) {
      fetchNearbyShops();
    }
  }, [service, radius, userLocation, searchMode]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setLocationStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationStatus('granted');
        setSearchMode('nearby');
      },
      () => {
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fetchNearbyShops = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/shops/search?lat=${userLocation.lat}&lng=${userLocation.lng}&service=${service}&radius=${radius}`
      );
      const data = await res.json();
      if (data.success) setShops(data.shops);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllShops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/shops?service=${service}`);
      const data = await res.json();
      if (data.success) setShops(data.shops);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Find Local Service Providers Near You | Pro Fix"
        description="Find trusted AC repair, plumbing, and home service experts near you. Geo-tagged local businesses ready to serve."
        keywords="services near me, AC repair near me, plumber near me, local services India"
      />

      {/* Hero */}
      <section style={styles.heroSection}>
        <div className="container">
          <div className="animate-fade-in-up" style={styles.heroContent}>
            <h1 style={styles.heading1}>
              Find Trusted <span className="text-gradient">Service Experts</span> Near You
            </h1>
            <p style={styles.heroText}>
              Search from verified local businesses — AC repair, plumbing, electrical & more. 
              We'll show you the nearest providers based on your location.
            </p>
          </div>
        </div>
      </section>

      {/* Search Controls */}
      <section style={styles.searchSection}>
        <div className="container">
          <div style={styles.searchBar}>
            {/* Location button */}
            {locationStatus !== 'granted' ? (
              <button onClick={detectLocation} style={styles.locationBtn} disabled={locationStatus === 'detecting'}>
                {locationStatus === 'detecting' ? (
                  <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Detecting...</>
                ) : (
                  <><LocateFixed size={18} /> Use My Location</>
                )}
              </button>
            ) : (
              <div style={styles.locationActive}>
                <MapPin size={16} color="#22c55e" />
                <span>Location active</span>
              </div>
            )}

            {/* Service filter */}
            <div style={styles.filterGroup}>
              <Filter size={16} color="var(--color-outline)" />
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={styles.filterSelect}
                className="form-input-auth"
              >
                {SERVICE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Radius */}
            {searchMode === 'nearby' && (
              <div style={styles.filterGroup}>
                <MapPin size={16} color="var(--color-outline)" />
                <select
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  style={styles.filterSelect}
                  className="form-input-auth"
                >
                  <option value={5}>Within 5 km</option>
                  <option value={10}>Within 10 km</option>
                  <option value={15}>Within 15 km</option>
                  <option value={25}>Within 25 km</option>
                  <option value={50}>Within 50 km</option>
                </select>
              </div>
            )}

            {/* Toggle */}
            <button
              onClick={() => setSearchMode(searchMode === 'nearby' ? 'all' : 'nearby')}
              style={styles.toggleBtn}
            >
              {searchMode === 'nearby' ? 'Browse All' : 'Search Nearby'}
            </button>
          </div>

          {/* Prompt to enable location */}
          {locationStatus === 'idle' && searchMode === 'nearby' && (
            <div style={styles.promptCard}>
              <MapPin size={40} color="var(--color-primary)" />
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>Enable Location to Find Nearby Services</h3>
                <p style={{ margin: 0, color: 'var(--color-on-surface-variant)' }}>
                  Click "Use My Location" above to see service providers sorted by distance from you.
                </p>
              </div>
            </div>
          )}

          {locationStatus === 'denied' && searchMode === 'nearby' && (
            <div style={styles.deniedCard}>
              <p style={{ margin: 0 }}>
                📍 Location access denied. You can still <button onClick={() => setSearchMode('all')} style={styles.inlineBtn}>browse all providers</button> or enable location in your browser settings.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Google Map */}
      {userLocation && searchMode === 'nearby' && (
        <section style={{ padding: '0 0 20px 0' }}>
          <div className="container">
            <div style={styles.mapContainer}>
              <iframe
                title="Nearby services map"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '16px' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=12&output=embed`}
              />
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <section style={styles.resultsSection}>
        <div className="container">
          {loading ? (
            <div style={styles.loadingState}>
              <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} color="var(--color-primary)" />
              <p>Searching for service providers...</p>
            </div>
          ) : shops.length > 0 ? (
            <>
              <p style={styles.resultCount}>
                <Search size={16} /> {shops.length} service provider{shops.length !== 1 ? 's' : ''} found
                {searchMode === 'nearby' ? ' near you' : ''}
              </p>
              <div style={styles.shopGrid}>
                {shops.map(shop => (
                  <ShopCard
                    key={shop._id}
                    shop={shop}
                    showDistance={searchMode === 'nearby'}
                  />
                ))}
              </div>
            </>
          ) : (searchMode === 'all' || userLocation) ? (
            <div style={styles.emptyState}>
              <Search size={48} color="var(--color-outline)" />
              <h3 style={{ margin: '16px 0 8px' }}>No Service Providers Found</h3>
              <p style={{ color: 'var(--color-on-surface-variant)', maxWidth: '400px', margin: '0 auto' }}>
                {searchMode === 'nearby'
                  ? 'No providers found in your area. Try increasing the search radius or browse all providers.'
                  : 'No providers registered yet for this service category.'}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

const styles = {
  heroSection: {
    padding: 'clamp(40px, 6vw, 80px) 0 clamp(20px, 3vw, 40px)',
    backgroundColor: 'var(--color-surface)',
  },
  heroContent: {
    maxWidth: '700px',
  },
  heading1: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    lineHeight: 1.1,
    marginBottom: '20px',
    letterSpacing: '-0.02em',
  },
  heroText: {
    fontSize: '1.15rem',
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.6,
    marginBottom: 0,
  },
  searchSection: {
    padding: '0 0 32px',
    backgroundColor: 'var(--color-surface)',
    position: 'sticky',
    top: '84px',
    zIndex: 50,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    backgroundColor: 'var(--color-surface-container-lowest)',
    borderRadius: '16px',
    border: '1px solid var(--color-surface-container)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    flexWrap: 'wrap',
  },
  locationBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap',
  },
  locationActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    borderRadius: '10px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#166534',
    fontWeight: '700',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flex: '1 1 160px',
    minWidth: '140px',
  },
  filterSelect: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: '2px solid var(--color-surface-container)',
    backgroundColor: 'var(--color-surface-container-low)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'var(--color-on-surface)',
    cursor: 'pointer',
    outline: 'none',
  },
  toggleBtn: {
    padding: '10px 18px',
    borderRadius: '10px',
    border: '2px solid var(--color-surface-container-high)',
    background: 'transparent',
    color: 'var(--color-on-surface)',
    fontWeight: '700',
    fontSize: '0.85rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  promptCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '32px',
    marginTop: '24px',
    backgroundColor: 'var(--color-surface-container-low)',
    borderRadius: '16px',
    border: '2px dashed var(--color-primary)',
  },
  deniedCard: {
    padding: '16px 20px',
    marginTop: '16px',
    backgroundColor: '#fef3c7',
    borderRadius: '12px',
    fontSize: '0.95rem',
    color: '#92400e',
  },
  inlineBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    fontWeight: '700',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    padding: 0,
  },
  mapContainer: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '2px solid var(--color-surface-container)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  resultsSection: {
    padding: 'clamp(20px, 4vw, 60px) 0 clamp(40px, 6vw, 80px)',
    backgroundColor: 'var(--color-surface)',
    minHeight: '300px',
  },
  resultCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--color-on-surface-variant)',
    marginBottom: '24px',
  },
  shopGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
    gap: '20px',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '60px 20px',
    color: 'var(--color-on-surface-variant)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
};

export default FindServices;
