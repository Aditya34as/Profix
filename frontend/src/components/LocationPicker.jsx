import { useState } from 'react';
import { MapPin, LocateFixed, Loader } from 'lucide-react';

const LocationPicker = ({ onLocationSelect, initialLat, initialLng }) => {
  const [latitude, setLatitude] = useState(initialLat || '');
  const [longitude, setLongitude] = useState(initialLng || '');
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState('');
  const [detected, setDetected] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setDetecting(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);
        setDetecting(false);
        setDetected(true);
        onLocationSelect?.({ latitude: lat, longitude: lng });
      },
      (err) => {
        setDetecting(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enter coordinates manually or allow browser location access.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An unknown error occurred.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualChange = (field, value) => {
    if (field === 'lat') {
      setLatitude(value);
      if (value && longitude) {
        onLocationSelect?.({ latitude: value, longitude });
      }
    } else {
      setLongitude(value);
      if (latitude && value) {
        onLocationSelect?.({ latitude, longitude: value });
      }
    }
    setDetected(false);
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        <MapPin size={18} /> Shop Location
      </label>

      {/* Auto-detect button */}
      <button
        type="button"
        onClick={detectLocation}
        disabled={detecting}
        style={{
          ...styles.detectBtn,
          opacity: detecting ? 0.7 : 1,
        }}
      >
        {detecting ? (
          <><Loader size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Detecting your location...</>
        ) : detected ? (
          <><LocateFixed size={18} color="#22c55e" /> Location detected — {latitude}, {longitude}</>
        ) : (
          <><LocateFixed size={18} /> Auto-detect my location</>
        )}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.divider}>
        <span style={styles.dividerText}>or enter manually</span>
      </div>

      <div style={styles.coordsRow}>
        <div style={styles.coordField}>
          <label style={styles.smallLabel}>Latitude</label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 28.6139"
            value={latitude}
            onChange={(e) => handleManualChange('lat', e.target.value)}
            style={styles.input}
            className="form-input-auth"
          />
        </div>
        <div style={styles.coordField}>
          <label style={styles.smallLabel}>Longitude</label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 77.2090"
            value={longitude}
            onChange={(e) => handleManualChange('lng', e.target.value)}
            style={styles.input}
            className="form-input-auth"
          />
        </div>
      </div>

      {/* Google Maps preview */}
      {latitude && longitude && (
        <div style={styles.mapPreview}>
          <iframe
            title="Shop location preview"
            width="100%"
            height="200"
            style={{ border: 0, borderRadius: '12px' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
          />
        </div>
      )}

      <p style={styles.hint}>
        💡 Tip: Use Google Maps to find your exact coordinates. Right-click on your location → "What's here?"
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '700',
    fontSize: '1rem',
    color: 'var(--color-on-surface)',
  },
  detectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 20px',
    borderRadius: '10px',
    border: '2px dashed var(--color-primary)',
    background: 'rgba(0, 60, 137, 0.04)',
    color: 'var(--color-primary)',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  },
  error: {
    color: '#dc2626',
    fontSize: '0.85rem',
    margin: 0,
    padding: '8px 12px',
    background: '#fef2f2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dividerText: {
    fontSize: '0.8rem',
    color: 'var(--color-outline)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  coordsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  coordField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  smallLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--color-on-surface-variant)',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '2px solid var(--color-surface-container)',
    backgroundColor: 'var(--color-surface-container-low)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--color-on-surface)',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  mapPreview: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid var(--color-surface-container)',
  },
  hint: {
    fontSize: '0.8rem',
    color: 'var(--color-outline)',
    margin: 0,
    lineHeight: 1.5,
  },
};

export default LocationPicker;
