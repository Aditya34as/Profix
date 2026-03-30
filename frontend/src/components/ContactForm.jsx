import { useState } from 'react';
import { toast } from 'sonner';

const PLACEHOLDERS = {
  'ac-repair': 'Describe your issue (e.g. AC is blowing warm air, not cooling)...',
  'plumbing': 'Describe your issue (e.g. kitchen tap is leaking, low water pressure)...',
  'water-heater': 'Describe your issue (e.g. geyser not heating, water too hot)...',
};

const ContactForm = ({ defaultService = 'ac-repair' }) => {
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
    
    const submitPromise = fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then(async (res) => {
      const data = await res.json();
      if (!data.success) {
        throw new Error('Error submitting form');
      }
      return data;
    });

    toast.promise(submitPromise, {
      loading: 'Dispatching technician...',
      success: () => {
        setFormData({ name: '', phone: '', serviceRequested: defaultService, message: '' });
        return 'Message received! We will dispatch a technician shortly.';
      },
      error: 'Error submitting form. Please call us directly.',
    });
    
    submitPromise.catch(console.error).finally(() => setIsSubmitting(false));
  };

  return (
    <div className="glass-card" style={styles.card}>
      <h3 style={styles.heading}>Request Immediate Service</h3>
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
          {isSubmitting ? 'Dispatching...' : 'Dispatch Technician'}
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
    marginBottom: '24px',
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
    textAlign: 'center'
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
