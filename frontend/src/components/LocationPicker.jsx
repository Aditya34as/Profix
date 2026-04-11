import { useState } from 'react';
import { MapPin, LocateFixed, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * @param {object} props
 * @param {string} props.latitude
 * @param {string} props.longitude
 * @param {(p: { latitude: string, longitude: string, address?: object }) => void} props.onLocationSelect
 * @param {string} [props.geocodeBaseUrl]
 */
const LocationPicker = ({
  latitude,
  longitude,
  onLocationSelect,
  geocodeBaseUrl = API_URL,
  /** When false, hide auto-detect (e.g. business registration — enter coordinates manually). */
  enableAutoDetect = true,
}) => {
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState('');

  const handleManualChange = (field, value) => {
    if (field === 'lat') {
      onLocationSelect?.({ latitude: value, longitude: longitude ?? '' });
    } else {
      onLocationSelect?.({ latitude: latitude ?? '', longitude: value });
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setDetectError('Geolocation is not supported in this browser.');
      return;
    }
    setDetectError('');
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const latStr = String(lat);
        const lngStr = String(lng);
        try {
          const res = await fetch(
            `${geocodeBaseUrl}/api/geocode/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`
          );
          const data = await res.json();
          if (data.success && data.address) {
            onLocationSelect?.({
              latitude: latStr,
              longitude: lngStr,
              address: data.address,
            });
          } else {
            onLocationSelect?.({ latitude: latStr, longitude: lngStr });
          }
        } catch {
          onLocationSelect?.({ latitude: latStr, longitude: lngStr });
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        setDetectError('Could not access your location. Allow location permission or enter coordinates below.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div style={styles.container}>
      <label style={styles.label}>
        <MapPin size={18} /> Shop location
      </label>

      <p style={styles.hint}>
        {enableAutoDetect
          ? 'Use auto-detect to fill coordinates and address fields, or type latitude and longitude manually.'
          : 'Enter your shop’s latitude and longitude (from Google Maps: right-click your pin → copy coordinates). Address fields above help customers find you.'}
      </p>

      {enableAutoDetect ? (
        <>
          <button
            type="button"
            onClick={detectLocation}
            disabled={detecting}
            style={{
              ...styles.detectBtn,
              opacity: detecting ? 0.75 : 1,
              cursor: detecting ? 'wait' : 'pointer',
            }}
          >
            {detecting ? (
              <>
                <Loader size={18} style={{ animation: 'spin 0.9s linear infinite' }} /> Detecting…
              </>
            ) : (
              <>
                <LocateFixed size={18} /> Auto-detect my location
              </>
            )}
          </button>
          {detectError ? <p style={styles.error}>{detectError}</p> : null}
        </>
      ) : null}

      <div style={styles.coordsRow}>
        <div style={styles.coordField}>
          <label style={styles.smallLabel}>Latitude *</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 28.6139"
            value={latitude}
            onChange={(e) => handleManualChange('lat', e.target.value)}
            style={styles.input}
            className="form-input-auth"
          />
        </div>
        <div style={styles.coordField}>
          <label style={styles.smallLabel}>Longitude *</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 77.2090"
            value={longitude}
            onChange={(e) => handleManualChange('lng', e.target.value)}
            style={styles.input}
            className="form-input-auth"
          />
        </div>
      </div>

      {latitude && longitude && !Number.isNaN(parseFloat(latitude)) && !Number.isNaN(parseFloat(longitude)) && (
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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    fontFamily: 'var(--font-body)',
    transition: 'all 0.2s',
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
    fontSize: '0.85rem',
    color: 'var(--color-outline)',
    margin: 0,
    lineHeight: 1.5,
  },
};

export default LocationPicker;
