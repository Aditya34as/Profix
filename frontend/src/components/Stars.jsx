import { Star } from 'lucide-react';

/** Read-only stars (1–5). Value can be decimal (e.g. 4.3). */
export const StarRow = ({ value = 0, size = 18, showNumber = true }) => {
  const v = Math.min(5, Math.max(0, Number(value) || 0));
  const rounded = Math.round(v);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexWrap: 'wrap' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          color="#f59e0b"
          fill={i < rounded ? '#f59e0b' : 'none'}
          style={{ opacity: i < rounded ? 1 : 0.25 }}
        />
      ))}
      {showNumber && v > 0 && (
        <span style={{ fontWeight: '700', fontSize: '0.95rem', marginLeft: '6px' }}>{v.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRow;
