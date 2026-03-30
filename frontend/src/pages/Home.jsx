import { useState } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { Settings, Wrench, ThermometerSnowflake, CheckCircle, ChevronDown, ShieldCheck } from 'lucide-react';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Do you charge a visiting fee in Delhi NCR?",
      a: "Yes, we charge a nominal ₹299 visiting fee to cover travel. However, if you proceed with the repair work, this fee is completely waived off or adjusted into the final bill."
    },
    {
      q: "Do you provide a warranty on your AC gas filling?",
      a: "Absolutely. We provide a 90-day warranty on all AC gas refilling services and a 30-day warranty on regular service tasks. If the same issue occurs, we fix it for free."
    },
    {
      q: "Are your technicians verified and experienced?",
      a: "Yes. Every Pro Fix technician goes through a strict background verification and rigorous skill assessment. All our senior technicians have a minimum of 5 years of field experience in HVAC and Plumbing."
    },
    {
      q: "What areas do you cover in NCR?",
      a: "We actively serve all of South Delhi, Gurgaon (up to Sector 60), Faridabad, and Noida. Emergency dispatch is available in these zones within 90 minutes."
    }
  ];

  return (
    <>
      <SEO 
        title="Plumber & AC Repair Delhi NCR" 
        description="Top-rated plumbers and AC repair technicians in Delhi NCR. Pro Fix offers 24/7 service, upfront pricing, and guaranteed satisfaction."
        keywords="Plumber Delhi NCR, AC Repair Gurgaon, Noida HVAC contractors, emergency plumbing India"
      />
      
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div className="container" style={styles.heroContainer}>
          <div className="animate-fade-in-up" style={styles.heroGlassContent}>
            <span style={styles.eyebrow}>Serving Delhi, Gurgaon & Noida</span>
            <h1 style={styles.heading1}>The Architectural Standard in <span className="text-gradient"> Plumbing & AC Repair</span></h1>
            <p style={styles.heroText}>
              We deliver precision, expertise, and dependability. No generic contractor tricks. Just premium, 5-star service for your home's most critical systems.
            </p>
            <div style={styles.heroActions}>
              <Link to="/services/ac-repair" className="btn-secondary" style={styles.primaryLink}>
                Book AC Service
              </Link>
              <a href="tel:+919876543210" style={styles.secondaryLink}>
                Call us: +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.servicesSection}>
        <div className="container">
          <div className="animate-fade-in-up">
            <h2 style={{...styles.heading2, textAlign: 'center'}}>Expert Solutions for the Indian Climate</h2>
            <div style={styles.servicesGrid}>
              <div className="glass-card" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><ThermometerSnowflake size={32} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>AC & Cooling</h3>
                 <p style={styles.serviceText}>Complete Split/Window AC installations, seasonal servicing, gas charging, and emergency repair when temperatures hit 45°C.</p>
                 <Link to="/services/ac-repair" style={styles.serviceLink}>Explore AC Repair →</Link>
              </div>
              <div className="glass-card" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><Wrench size={32} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>Plumbing Services</h3>
                 <p style={styles.serviceText}>From simple pipe leaks to full motor repairs and water tank cleaning, our master plumbers handle issues cleanly.</p>
                 <Link to="/services/plumbing" style={styles.serviceLink}>Explore Plumbing →</Link>
              </div>
               <div className="glass-card" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><Settings size={32} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>Geysers & Water Heaters</h3>
                 <p style={styles.serviceText}>Instant heating upgrades and emergency replacements so your family never faces freezing water in the winters.</p>
                 <Link to="/services/geysers" style={styles.serviceLink}>Explore Geysers →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PROCESS SECTION */}
      <section id="how-it-works" style={styles.processSection}>
        <div className="container">
          <h2 style={{...styles.heading2, textAlign: 'center'}}>How Pro Fix Works</h2>
          <div style={styles.processGrid}>
             <div style={styles.processLine}></div>
             <div className="animate-fade-in-up" style={{...styles.processStep, animationDelay: '0.1s'}}>
                <div style={styles.processNumber}>1</div>
                <h3 style={styles.processTitle}>Book Instantly</h3>
                <p style={styles.processText}>Call us or chat directly on WhatsApp. Tell us what's broken and share your location in NCR.</p>
             </div>
             <div className="animate-fade-in-up" style={{...styles.processStep, animationDelay: '0.2s'}}>
                <div style={styles.processNumber}>2</div>
                <h3 style={styles.processTitle}>90-Min Dispatch</h3>
                <p style={styles.processText}>A verified, uniformed expert is dispatched to your doorstep equipped with genuine spares.</p>
             </div>
             <div className="animate-fade-in-up" style={{...styles.processStep, animationDelay: '0.3s'}}>
                <div style={styles.processNumber}>3</div>
                <h3 style={styles.processTitle}>Fixed & Guaranteed</h3>
                <p style={styles.processText}>Approve our upfront quote, get the problem resolved cleanly, and enjoy our post-service warranty.</p>
             </div>
          </div>
        </div>
      </section>
      
      {/* WHY US SECTION */}
      <section id="why-us" style={styles.trustSection}>
         <div className="container" style={styles.trustContainer}>
             <div className="animate-fade-in-up" style={{flex: '1 1 400px'}}>
                 <h2 style={styles.heading2}>Why Delhi NCR Trusts Pro Fix</h2>
                 <p style={{fontSize: '1.2rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.6}}>
                    We believe in doing the job exactly right the first time. We use premium genuine parts, offer straightforward upfront pricing in ₹, and stand behind our work with a Google verified guarantee.
                 </p>
                 <ul style={{listStyle: 'none', padding: 0, marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <li style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>No Hidden Costs or Upselling</strong></li>
                    <li style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>Mess-Free Service Guarantee</strong></li>
                    <li style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>Same-Day Emergency Resolution</strong></li>
                 </ul>
             </div>
             <div className="animate-fade-in-up animate-float" style={{flex: '1 1 400px', position: 'relative'}}>
                <img src="/trusted_tech.png" alt="Trusted HVAC Technician" style={styles.trustImage} />
                <div className="glass-panel" style={styles.trustBadge}>
                   <ShieldCheck color="#25d366" size={24} />
                   <div style={{display: 'flex', flexDirection: 'column'}}>
                     <span style={{fontWeight: '800', lineHeight: 1.2}}>Google Verified</span>
                     <span style={{fontSize: '0.8rem', opacity: 0.8}}>Professional Services</span>
                   </div>
                </div>
             </div>
         </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" style={styles.reviewSection}>
        <div className="container">
          <h2 style={{...styles.heading2, textAlign: 'center', marginBottom: '56px'}}>NCR Relies on Pro Fix</h2>
          <div style={styles.reviewCards}>
            <div className="glass-card" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"My Split AC died completely in mid-May. Pro Fix had a tech out to my apartment in South Delhi within an hour. Professional and very reasonable rates!"</p>
              <p style={styles.reviewer}>- Neha K., South Extension</p>
            </div>
            <div className="glass-card" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"Upfront pricing and no upselling. They quickly diagnosed the gas leak, repaired the copper piping, and recharged the AC. Highly recommend."</p>
              <p style={styles.reviewer}>- Sameer S., DLF Phase 3, Gurgaon</p>
            </div>
             <div className="glass-card" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"Had a major plumbing leak in the bathroom. The plumber arrived on time, was extremely polite, and left the bathroom spotless after fixing the pipe."</p>
              <p style={styles.reviewer}>- Anuj T., Noida Sector 50</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" style={styles.faqSection}>
         <div className="container" style={{maxWidth: '800px'}}>
             <h2 style={{...styles.heading2, textAlign: 'center'}}>Frequently Asked Questions</h2>
             
             <div style={{marginTop: '40px'}}>
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <div className="faq-question">
                      {faq.q}
                      <ChevronDown 
                        size={20} 
                        style={{
                          transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0)', 
                          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} 
                      />
                    </div>
                    <div className="faq-answer">
                      <p style={{margin: 0, color: 'var(--color-on-surface-variant)', lineHeight: '1.6'}}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                ))}
             </div>
         </div>
      </section>
    </>
  );
};

const styles = {
  heroSection: {
    minHeight: 'calc(100vh - 80px)', // Fit exactly into the viewport beneath navbar
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundImage: 'url("/hero_bg.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '40px 0',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(5, 15, 30, 0.7)',
    zIndex: 1
  },
  heroContainer: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '900px',
    margin: '0 auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroGlassContent: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
  },
  eyebrow: {
    color: '#a3c2ff',
    fontWeight: '800',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom: '16px',
    display: 'inline-block',
    background: 'rgba(0,0,0,0.3)',
    padding: '6px 14px',
    borderRadius: '30px',
    fontSize: '0.8rem',
  },
  heading1: {
    fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
    lineHeight: '1.1',
    color: '#ffffff',
    marginBottom: '20px',
    letterSpacing: '-0.02em',
    textShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },
  heroText: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: '1.6',
    maxWidth: '700px',
    margin: '0 auto 28px auto'
  },
  heroActions: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  primaryLink: {
    padding: '14px 30px',
    fontSize: '1rem',
    borderRadius: '12px',
    display: 'inline-block',
    boxShadow: '0 15px 35px rgba(0, 60, 137, 0.5)',
    fontWeight: '800'
  },
  secondaryLink: {
    fontWeight: '700',
    color: '#ffffff',
    borderBottom: '2px solid rgba(255,255,255,0.3)',
    paddingBottom: '4px',
    fontSize: '1.1rem',
    transition: 'border-color 0.3s'
  },
  servicesSection: {
    padding: 'clamp(60px, 10vw, 120px) 0',
    backgroundColor: 'var(--color-surface)',
    position: 'relative',
    zIndex: 10,
    marginTop: '-40px',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    boxShadow: '0 -20px 40px rgba(0,0,0,0.1)'
  },
  heading2: {
    fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
    marginBottom: 'clamp(32px, 5vw, 64px)',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: '24px'
  },
  serviceCard: {
    padding: 'clamp(24px, 4vw, 48px) clamp(20px, 3vw, 40px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  iconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    boxShadow: '0 10px 20px rgba(0, 60, 137, 0.2)'
  },
  serviceTitle: {
    fontSize: '1.6rem',
    marginBottom: '16px'
  },
  serviceText: {
    color: 'var(--color-on-surface-variant)',
    marginBottom: '32px',
    lineHeight: '1.6',
    flex: 1
  },
  serviceLink: {
    color: 'var(--color-primary)',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: '0.9rem'
  },
  processSection: {
    backgroundColor: 'var(--color-surface-container-lowest)',
    padding: 'clamp(60px, 10vw, 140px) 0'
  },
  processGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '32px',
    position: 'relative',
    zIndex: 1
  },
  processLine: {
    position: 'absolute',
    top: '40px',
    left: '10%',
    right: '10%',
    height: '4px',
    background: 'linear-gradient(90deg, var(--color-surface-container) 0%, var(--color-primary) 50%, var(--color-surface-container) 100%)',
    zIndex: -1,
    opacity: 0.3
  },
  processStep: {
    textAlign: 'center',
  },
  processNumber: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-container))',
    color: 'white',
    fontSize: '2.5rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    margin: '0 auto 32px auto',
    boxShadow: '0 15px 30px rgba(177, 45, 0, 0.3)',
    border: '6px solid white'
  },
  processTitle: {
    fontSize: '1.5rem',
    marginBottom: '16px'
  },
  processText: {
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.6,
    fontSize: '1.1rem'
  },
  trustSection: {
     padding: 'clamp(60px, 10vw, 140px) 0',
     backgroundColor: 'var(--color-surface)'
  },
  trustContainer: {
    display: 'flex', 
    alignItems: 'center', 
    gap: 'clamp(32px, 5vw, 80px)', 
    flexWrap: 'wrap-reverse'
  },
  trustImage: {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    borderRadius: '24px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
  },
  trustBadge: {
    position: 'absolute',
    bottom: '-20px',
    left: '-20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderRadius: '16px',
    color: '#fff',
    backgroundColor: 'rgba(0, 30, 80, 0.85)',
  },
  reviewSection: {
    padding: 'clamp(60px, 10vw, 140px) 0',
    backgroundColor: 'var(--color-surface-container-lowest)',
  },
  reviewCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: '24px'
  },
  reviewCard: {
    padding: 'clamp(24px, 4vw, 48px)',
  },
  stars: {
    fontSize: '1.5rem',
    marginBottom: '24px',
    letterSpacing: '4px'
  },
  reviewText: {
    fontSize: '1.15rem',
    fontStyle: 'italic',
    color: 'var(--color-on-surface-variant)',
    marginBottom: '32px',
    lineHeight: 1.6
  },
  reviewer: {
    fontWeight: '800',
    color: 'var(--color-on-surface)',
    borderTop: '1px solid var(--color-surface-container)',
    paddingTop: '24px'
  },
  faqSection: {
     padding: 'clamp(60px, 10vw, 140px) 0',
     backgroundColor: 'var(--color-surface)'
  }
};

export default Home;
