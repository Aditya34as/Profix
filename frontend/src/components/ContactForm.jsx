import { useState } from 'react';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PLACEHOLDERS = {
  'ac-repair': 'Describe your issue (e.g. AC is blowing warm air, not cooling)...',
  'plumbing': 'Describe your issue (e.g. kitchen tap is leaking, low water pressure)...',
  'water-heater': 'Describe your issue (e.g. geyser not heating, water too hot)...',
};

const ContactForm = ({
  defaultService = 'ac-repair',
  shopId = null,
  onSuccess,
  /** For WhatsApp CTA on shop profile */
  whatsappPhone = null,
  businessName = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceRequested: defaultService,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Build payload with optional shopId and location
    const payload = { ...formData };
    if (shopId) payload.shopId = shopId;

    // Try to get customer location
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        payload.latitude = pos.coords.latitude;
        payload.longitude = pos.coords.longitude;
      } catch {
        // Location optional, continue without it
      }
    }

    const submitPromise = fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      const data = await res.json();
      if (!data.success) {
        throw new Error('Error submitting form');
      }
      return data;
    });

    toast.promise(submitPromise, {
      loading: 'Sending your request...',
      success: () => {
        setFormData({ name: '', phone: '', serviceRequested: defaultService, message: '' });
        onSuccess?.();
        return 'Request sent! The service provider will contact you shortly.';
      },
      error: 'Error submitting form. Please call directly.',
    });
    
    submitPromise.catch(console.error).finally(() => setIsSubmitting(false));
  };

  return (
    <div className="glass-card" style={styles.card}>
      <h3 style={styles.heading}>
        {shopId ? 'Send Service Request' : 'Request Immediate Service'}
      </h3>
      {shopId ? (
        <p style={styles.hintShop}>
          Book a service by sending your details below, or start a WhatsApp chat with this business anytime.
        </p>
      ) : null}
      {shopId && whatsappPhone ? (
        <a
          href={`https://wa.me/91${String(whatsappPhone).replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
            `Hi${businessName ? ` ${businessName}` : ''}! I'm interested in a service via Pro Fix. `
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.waCta}
        >
          <MessageCircle size={20} />
          <span>
            <strong>WhatsApp this shop</strong>
            <span style={styles.waSub}>Fast replies for bookings & questions</span>
          </span>
        </a>
      ) : null}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
          style={styles.input}
          className="form-input-auth"
          id="contact-name"
        />
        <input 
          type="tel" 
          placeholder="Phone Number (+91)" 
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required 
          style={styles.input}
          className="form-input-auth"
          id="contact-phone"
        />
        <select 
          value={formData.serviceRequested}
          onChange={(e) => setFormData({...formData, serviceRequested: e.target.value})}
          style={{...styles.input, cursor: 'pointer'}}
          className="form-input-auth"
          id="contact-service"
        >
          <option value="ac-repair">AC Repair</option>
          <option value="plumbing">Plumbing</option>
          <option value="water-heater">Water Heater / Geyser</option>
          <option value="electrical">Electrical</option>
          <option value="carpentry">Carpentry</option>
          <option value="painting">Painting</option>
          <option value="cleaning">Cleaning</option>
          <option value="pest-control">Pest Control</option>
        </select>
        <textarea 
          placeholder={PLACEHOLDERS[formData.serviceRequested] || PLACEHOLDERS['ac-repair']}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows="4"
          style={{...styles.input, resize: 'vertical', minHeight: '100px'}}
          className="form-input-auth"
          id="contact-message"
        ></textarea>
        
        <button type="submit" className="btn-secondary" style={styles.button} disabled={isSubmitting} id="contact-submit">
          {isSubmitting ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: {
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  heading: {
    color: 'var(--color-on-surface)',
    marginBottom: '12px',
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    textAlign: 'center'
  },
  hintShop: {
    margin: '0 0 16px',
    fontSize: '0.88rem',
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.5,
    textAlign: 'center',
  },
  waCta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    marginBottom: '20px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #128c4a, #25d366)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '700',
    boxShadow: '0 8px 24px rgba(37,211,102,0.25)',
  },
  waSub: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '600',
    opacity: 0.95,
    marginTop: '2px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    padding: '14px 18px',
    borderRadius: '8px',
    border: '2px solid var(--color-surface-container)',
    backgroundColor: 'var(--color-surface-container-low)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    color: 'var(--color-on-surface)',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  button: {
    marginTop: '10px',
    padding: '16px',
    fontSize: '1.1rem',
    letterSpacing: '0.05em'
  }
};

export default ContactForm;
