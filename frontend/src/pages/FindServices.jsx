import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ShopCard from '../components/ShopCard';
import CompareModal from '../components/CompareModal';
import {
  Search, MapPin, Loader, LocateFixed, GitCompare,
  Wind, Droplet, Thermometer, Sparkles, LayoutGrid
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = [
  { value: 'all', label: 'All Services', icon: LayoutGrid },
  { value: 'ac-repair', label: 'AC Repair', icon: Wind },
  { value: 'plumbing', label: 'Plumbing', icon: Droplet },
  { value: 'water-heater', label: 'Geyser', icon: Thermometer },
  { value: 'cleaning', label: 'Cleaning', icon: Sparkles },
];

/* ————— Skeleton placeholder while loading ————— */
const SkeletonCard = () => (
  <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={sk.avatar} />
      <div style={{ flex: 1 }}>
        <div style={{ ...sk.line, width: '60%', height: '16px' }} />
        <div style={{ ...sk.line, width: '35%', height: '12px', marginTop: '8px' }} />
      </div>
    </div>
    <div style={{ display: 'flex', gap: '8px' }}>
      <div style={{ ...sk.line, width: '64px', height: '24px', borderRadius: '6px' }} />
      <div style={{ ...sk.line, width: '72px', height: '24px', borderRadius: '6px' }} />
      <div style={{ ...sk.line, width: '56px', height: '24px', borderRadius: '6px' }} />
    </div>
    <div style={{ ...sk.line, width: '80%', height: '12px' }} />
    <div style={{ ...sk.line, width: '55%', height: '12px' }} />
    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
      <div style={{ ...sk.line, width: '80px', height: '36px', borderRadius: '8px' }} />
      <div style={{ ...sk.line, width: '96px', height: '36px', borderRadius: '8px' }} />
      <div style={{ ...sk.line, width: '72px', height: '36px', borderRadius: '8px', marginLeft: 'auto' }} />
    </div>
  </div>
);

const sk = {
  avatar: {
    width: 56, height: 56, borderRadius: 14,
    background: 'linear-gradient(110deg, #eee 30%, #f5f5f5 50%, #eee 70%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer-sk 1.5s ease-in-out infinite',
    flexShrink: 0,
  },
  line: {
    borderRadius: 6,
    background: 'linear-gradient(110deg, #eee 30%, #f5f5f5 50%, #eee 70%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer-sk 1.5s ease-in-out infinite',
  },
};

/* ————— Component ————— */
const FindServices = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(searchParams.get('service') || 'all');
  const [radius, setRadius] = useState(15);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [hasAttemptedLocation, setHasAttemptedLocation] = useState(false);

  /* keep URL in sync with category */
  const changeService = useCallback((v) => {
    setService(v);
    if (v === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ service: v });
    }
  }, [setSearchParams]);

  /* sync service state when URL search params change (e.g. footer/navbar link clicks) */
  useEffect(() => {
    const urlService = searchParams.get('service') || 'all';
    if (urlService !== service) {
      setService(urlService);
    }
  }, [searchParams]);

  /* Auto-detect location once on mount */
  useEffect(() => {
    if (navigator.geolocation && !hasAttemptedLocation) {
      setHasAttemptedLocation(true);
      setLocationStatus('detecting');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus('granted');
        },
        () => {
          setLocationStatus('denied');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  /* Fetch on filter or location change */
  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops();
    } else if (locationStatus === 'denied' || locationStatus === 'idle') {
      // Fallback: show all local providers if location unavailable
      fetchAllShops();
    }
  }, [service, radius, userLocation, locationStatus]);

  /* ——— Compare logic ——— */
  const toggleCompare = (id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };
  const compareShops = useMemo(
    () => shops.filter(s => compareIds.includes(s._id)),
    [shops, compareIds]
  );



  /* ——— Fetchers ——— */
  const fetchNearbyShops = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/shops/search?lat=${userLocation.lat}&lng=${userLocation.lng}&service=${service}&radius=${radius}`
      );
      const data = await res.json();
      if (data.success) {
        setShops(data.shops);
      } else {
        // Geo-search failed — fall back to regular filtered list
        console.warn('Geo-search failed, falling back to all shops with filter');
        await fetchAllShops();
      }
    } catch (err) {
      console.error('Search error:', err);
      // Fall back to regular filtered list
      await fetchAllShops();
    }
    finally { setLoading(false); }
  };

  const fetchAllShops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/shops?service=${service}`);
      const data = await res.json();
      if (data.success) setShops(data.shops);
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { setLocationStatus('denied'); return; }
    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('granted');
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ——— active category label for subtitle ——— */
  const activeCat = CATEGORIES.find(c => c.value === service);

  return (
    <>
      <SEO
        title={`${activeCat?.label || 'Home Services'} Near You — Verified Pros in Delhi NCR | Pro Fix India`}
        description={`Find the best ${(activeCat?.label || 'home service').toLowerCase()} professionals near your location. Pro Fix India connects you with 500+ verified, rated experts in Delhi, Gurgaon, Noida & NCR. Compare ratings, read reviews, and book instantly. 30-day warranty on all services.`}
        keywords={`${(activeCat?.label || 'home services').toLowerCase()} near me, best ${(activeCat?.label || 'services').toLowerCase()} Delhi NCR, verified ${(activeCat?.label || 'service').toLowerCase()} professionals, affordable ${(activeCat?.label || 'home repair').toLowerCase()}, book ${(activeCat?.label || 'service').toLowerCase()} online India, same day ${(activeCat?.label || 'service').toLowerCase()}, emergency ${(activeCat?.label || 'repair').toLowerCase()} near me`}
        url={`https://www.profixindia.in/find-services${service !== 'all' ? `?service=${service}` : ''}`}
      />

      {/* Skeleton keyframes */}
      <style>{`
        @keyframes shimmer-sk {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .category-pill { transition: all 0.25s cubic-bezier(.16,1,.3,1); }
        .category-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,30,80,0.08); }
        .category-pill.active { background: var(--color-primary) !important; color: #fff !important; box-shadow: 0 6px 20px rgba(0,60,137,0.25); }
        .location-nudge { animation: nudge-bounce 0.6s ease; }
        @keyframes nudge-bounce {
          0%,100% { transform: translateY(0); }
          40%     { transform: translateY(-6px); }
        }

        /* ─── Mobile Responsive ─── */
        @media (max-width: 768px) {
          .cat-bar { padding: 0 12px !important; }
          .sticky-controls { top: 56px !important; padding: 8px 0 !important; }
        }
        @media (max-width: 480px) {
          .cat-bar { padding: 0 8px !important; gap: 6px !important; }
          .sticky-controls { top: 52px !important; }
        }
      `}</style>

      {/* ═══════════ HERO ═══════════ */}
      <section style={styles.heroSection}>
        <div className="container">
          <div data-reveal="up" style={styles.heroContent}>
            <h1 style={styles.heading1}>
              {service === 'all'
                ? <>Find Trusted <span className="text-gradient">Service Experts</span> Near You</>
                : <>{activeCat?.label} <span className="text-gradient">Experts</span> Near You</>}
            </h1>
            <p style={styles.heroText}>
              {service === 'all'
                ? 'Browse verified local service providers near your area.'
                : `Showing all verified ${activeCat?.label?.toLowerCase()} providers near you.`}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORY PILL BAR ═══════════ */}
      <section style={styles.categoryBar} className="cat-bar">
        <div className="container">
          <div style={styles.pillScroll}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = service === cat.value;
              return (
                <button
                  key={cat.value}
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => changeService(cat.value)}
                  style={{
                    ...styles.pill,
                    ...(isActive ? styles.pillActive : {}),
                  }}
                >
                  <Icon size={16} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ STICKY CONTROLS ═══════════ */}
      <section style={styles.stickyControls} className="sticky-controls">
        <div className="container">
          <div style={styles.controlsRow}>
            {/* Left: Location */}
            <div style={styles.controlsLeft}>
              {locationStatus !== 'granted' ? (
                <button onClick={detectLocation} style={styles.locationBtn} disabled={locationStatus === 'detecting'} className="location-nudge">
                  {locationStatus === 'detecting' ? (
                    <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Detecting...</>
                  ) : (
                    <><LocateFixed size={16} /> Use My Location</>
                  )}
                </button>
              ) : (
                <div style={styles.locationActive}>
                  <MapPin size={14} color="#22c55e" />
                  <span>Location active</span>
                  <select
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    style={styles.radiusSelect}
                  >
                    <option value={1}>1 km</option>
                    <option value={2}>2 km</option>
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Location denied info */}
          {locationStatus === 'denied' && (
            <div style={styles.deniedCard}>
              📍 Location access was denied. Showing all local providers in your area. Enable location in your browser settings for distance-sorted results.
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ MAP ═══════════ */}
      {userLocation && (
        <section style={{ padding: '0 0 20px' }}>
          <div className="container">
            <div style={styles.mapContainer}>
              <iframe
                title="Nearby services map"
                width="100%"
                height="260"
                style={{ border: 0, borderRadius: '16px', display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&z=12&output=embed`}
              />
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ RESULTS ═══════════ */}
      <section style={styles.resultsSection}>
        <div className="container">
          {loading ? (
            /* —— Skeleton loading state —— */
            <>
              <div style={styles.resultCountSkeleton}>
                <div style={{ ...sk.line, width: '180px', height: '14px' }} />
              </div>
              <div style={styles.shopGrid}>
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
              </div>
            </>
          ) : shops.length > 0 ? (
            <>
              <div style={styles.resultHeader}>
                <p style={styles.resultCount}>
                  <Search size={16} /> <strong>{shops.length}</strong> provider{shops.length !== 1 ? 's' : ''} found
                  {userLocation ? ` within ${radius} km` : ' in your area'}
                  {service !== 'all' ? ` for ${activeCat?.label}` : ''}
                </p>
                {compareIds.length === 0 && (
                  <p style={styles.compareHint}>
                    💡 Tip: Select up to 3 shops to <strong>compare side-by-side</strong>
                  </p>
                )}
              </div>

              <div style={styles.shopGrid}>
                {shops.map(shop => (
                  <ShopCard
                    key={shop._id}
                    shop={shop}
                    showDistance={!!userLocation}
                    showCompare
                    compareSelected={compareIds.includes(shop._id)}
                    onCompareToggle={toggleCompare}
                    compareDisabled={compareIds.length >= 3 && !compareIds.includes(shop._id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <Search size={52} color="var(--color-outline)" style={{ opacity: 0.4 }} />
              <h3 style={styles.emptyTitle}>No Providers Found</h3>
              <p style={styles.emptyText}>
                No providers found in your area for this category. Try increasing the search radius.
              </p>
              <div style={styles.emptyActions}>
                {userLocation && radius < 10 && (
                  <button onClick={() => setRadius(10)} style={styles.emptyBtn}>
                    Extend to 10 km
                  </button>
                )}
                {service !== 'all' && (
                  <button onClick={() => { changeService('all'); setRadius(10); }} style={styles.emptyBtnOutline}>
                    Show All Categories
                  </button>
                )}
                {!userLocation && (
                  <button onClick={detectLocation} style={styles.emptyBtn}>
                    📍 Enable Location
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ COMPARE BAR ═══════════ */}
      {compareIds.length > 0 && (
        <div style={styles.compareBar}>
          <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCompare size={18} />
            {compareIds.length} selected
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setCompareIds([])} style={styles.compareClear}>Clear</button>
            <button onClick={() => setCompareOpen(true)} style={styles.compareGo}>Compare now</button>
          </div>
        </div>
      )}

      {compareOpen && (
        <CompareModal shops={compareShops} onClose={() => setCompareOpen(false)} />
      )}
    </>
  );
};

/* ═══════════ STYLES ═══════════ */
const styles = {
  heroSection: {
    padding: 'clamp(32px, 5vw, 56px) 0 clamp(16px, 2vw, 24px)',
    backgroundColor: 'var(--color-surface)',
  },
  heroContent: { maxWidth: '700px' },
  heading1: {
    fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
    lineHeight: 1.1,
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
  heroText: {
    fontSize: '1.05rem',
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.6,
    marginBottom: 0,
  },

  /* Category pill bar */
  categoryBar: {
    padding: '0 0 16px',
    backgroundColor: 'var(--color-surface)',
  },
  pillScroll: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '8px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '10px 18px',
    borderRadius: '50px',
    border: '1.5px solid var(--color-surface-container-high)',
    background: 'var(--color-surface-container-lowest)',
    color: 'var(--color-on-surface)',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  pillActive: {
    border: '1.5px solid var(--color-primary)',
  },

  /* Sticky controls */
  stickyControls: {
    position: 'sticky',
    top: '84px',
    zIndex: 50,
    backgroundColor: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-surface-container)',
    padding: '12px 0',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
  },
  controlsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  controlsLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },

  locationBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '50px',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.85rem',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap',
  },
  locationActive: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '50px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#166534',
    fontWeight: '700',
    fontSize: '0.82rem',
    whiteSpace: 'nowrap',
  },
  radiusSelect: {
    marginLeft: '4px',
    padding: '2px 6px',
    background: 'transparent',
    border: '1px solid #86efac',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.8rem',
    color: '#166534',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },

  deniedCard: {
    padding: '12px 18px',
    marginTop: '12px',
    backgroundColor: '#fef3c7',
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: '#92400e',
  },
  inlineBtn: {
    background: 'none', border: 'none', color: 'var(--color-primary)',
    fontWeight: '700', textDecoration: 'underline', cursor: 'pointer',
    fontSize: 'inherit', fontFamily: 'inherit', padding: 0,
  },

  mapContainer: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '2px solid var(--color-surface-container)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },

  /* Results */
  resultsSection: {
    padding: 'clamp(20px, 3vw, 40px) 0 clamp(40px, 6vw, 80px)',
    backgroundColor: 'var(--color-surface)',
    minHeight: '400px',
  },
  resultCountSkeleton: { marginBottom: '20px' },
  resultHeader: {
    marginBottom: '20px',
  },
  resultCount: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '0.95rem', fontWeight: '600',
    color: 'var(--color-on-surface-variant)', margin: '0 0 4px',
  },
  compareHint: {
    fontSize: '0.85rem', color: 'var(--color-outline)',
    margin: 0, lineHeight: 1.5,
  },
  shopGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
    gap: '20px',
  },

  /* Empty state */
  emptyState: {
    textAlign: 'center', padding: '60px 20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
  },
  emptyTitle: { margin: '12px 0 4px', fontSize: '1.4rem' },
  emptyText: {
    color: 'var(--color-on-surface-variant)', maxWidth: '420px',
    margin: '0 auto 20px', lineHeight: 1.6,
  },
  emptyActions: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' },
  emptyBtn: {
    padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
    color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)',
  },
  emptyBtnOutline: {
    padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem',
    border: '2px solid var(--color-surface-container-high)', background: 'transparent',
    color: 'var(--color-on-surface)', cursor: 'pointer', fontFamily: 'var(--font-body)',
  },

  /* Compare bar */
  compareBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '16px', flexWrap: 'wrap', padding: '14px 24px',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
    color: '#fff', boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
  },
  compareClear: {
    padding: '10px 16px', borderRadius: '10px', border: '2px solid rgba(255,255,255,0.5)',
    background: 'transparent', color: '#fff', fontWeight: '700', cursor: 'pointer',
  },
  compareGo: {
    padding: '10px 20px', borderRadius: '10px', border: 'none',
    background: '#fff', color: 'var(--color-primary)', fontWeight: '800', cursor: 'pointer',
  },
};

export default FindServices;
