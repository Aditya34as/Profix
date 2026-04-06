import { useState, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import ShopCard from './ShopCard';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const NearbyShops = ({ service = 'all', limit = 3, title = 'Nearby Service Providers' }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    requestLocation();
  }, [service]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationGranted(true);
        fetchNearbyShops(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError('Enable location to see nearby shops');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const fetchNearbyShops = async (lat, lng) => {
    try {
      const res = await fetch(
        `${API_URL}/api/shops/search?lat=${lat}&lng=${lng}&service=${service}&radius=25`
      );
      const data = await res.json();
      if (data.success) {
        setShops(data.shops.slice(0, limit));
      }
    } catch (err) {
      console.error('Failed to fetch nearby shops:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.loadingState}>
          <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} color="var(--color-primary)" />
          <p style={styles.loadingText}>Finding service providers near you...</p>
        </div>
      </div>
    );
  }

  if (error || shops.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.emptyState}>
          <MapPin size={32} color="var(--color-outline)" />
          <p style={styles.emptyText}>
            {error || 'No service providers found nearby yet.'}
          </p>
          <Link to="/find-services" style={styles.findLink}>
            Browse all service providers →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>{title}</h3>
        <Link to={`/find-services?service=${service}`} style={styles.viewAll}>
          View all →
        </Link>
      </div>
      <div style={styles.grid}>
        {shops.map(shop => (
          <ShopCard key={shop._id} shop={shop} showDistance={true} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: 'clamp(40px, 6vw, 80px) 0',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '800',
    margin: 0,
    color: 'var(--color-on-surface)',
  },
  viewAll: {
    color: 'var(--color-primary)',
    fontWeight: '700',
    fontSize: '0.9rem',
    textDecoration: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
    gap: '20px',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '40px 20px',
    background: 'var(--color-surface-container-low)',
    borderRadius: '16px',
    marginTop: '16px',
  },
  loadingText: {
    margin: 0,
    color: 'var(--color-on-surface-variant)',
    fontWeight: '600',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '40px 20px',
    background: 'var(--color-surface-container-low)',
    borderRadius: '16px',
    textAlign: 'center',
    marginTop: '16px',
  },
  emptyText: {
    margin: 0,
    color: 'var(--color-on-surface-variant)',
    fontSize: '1rem',
  },
  findLink: {
    color: 'var(--color-primary)',
    fontWeight: '700',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },
};

export default NearbyShops;
