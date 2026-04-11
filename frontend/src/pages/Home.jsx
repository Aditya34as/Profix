import { useState } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { Settings, Wrench, ThermometerSnowflake, CheckCircle, ChevronDown, ShieldCheck, Search, MapPin, Store, ArrowRight, Users, Zap } from 'lucide-react';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How do I find a service provider near me?",
      a: "Simply click 'Find Services', allow location access, and we'll show you verified local businesses sorted by distance from your location."
    },
    {
      q: "How can I list my business on Pro Fix?",
      a: "Click 'List Your Business' in the navbar, fill out the registration form with your shop details and location, and submit for admin review. Once approved, customers near you will be able to find you!"
    },
    {
      q: "Is it free to register my business?",
      a: "Yes, registration is completely free. We want to help local service businesses grow by connecting them with customers who need their expertise."
    },
    {
      q: "How does the location-based search work?",
      a: "When a customer searches for services, we use their browser location (with permission) to find registered shops within their chosen radius. Results are sorted by distance, so the nearest providers show up first."
    },
    {
      q: "Do you verify the service providers?",
      a: "Yes. Every new registration goes through an admin review process. Only businesses that pass our verification are listed for customers."
    },
    {
      q: "What areas do you cover?",
      a: "Pro Fix is available across India. Any local service business can register, and customers from any location can search for providers near them."
    }
  ];

  return (
    <>
      <SEO 
        title="Pro Fix — Find Trusted Local Service Providers Near You" 
        description="Discover verified AC repair, plumbing, and home service experts near your location. Local businesses register to reach more customers."
        keywords="local services near me, AC repair near me, plumber near me, home services India, service marketplace"
      />
      
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div className="container" style={styles.heroContainer}>
          <div className="animate-fade-in-up" style={styles.heroGlassContent}>
            <span style={styles.eyebrow}>Your Local Service Marketplace</span>
            <h1 style={styles.heading1}>Find Trusted <span className="text-gradient">Service Experts</span> Near You</h1>
            <p style={styles.heroText}>
              AC repair, plumbing, electrical & more — discover verified local businesses ready to serve you. 
              Geo-tagged search finds the nearest providers instantly.
            </p>
            <div style={styles.heroActions}>
              <Link to="/find-services" className="btn-secondary" style={styles.primaryLink}>
                <Search size={20} /> Find Services Near Me
              </Link>
              <Link to="/register" style={styles.secondaryLink}>
                <Store size={18} /> List Your Business →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.servicesSection}>
        <div className="container">
          <div className="animate-fade-in-up">
            <h2 style={{...styles.heading2, textAlign: 'center'}}>Popular Service Categories</h2>
            <div style={styles.servicesGrid}>
              <Link to="/find-services?service=ac-repair" className="glass-card" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><ThermometerSnowflake size={32} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>AC & Cooling</h3>
                 <p style={styles.serviceText}>Find nearby AC repair, installation, and servicing experts. Split, window, and central AC specialists.</p>
                 <span style={styles.serviceLink}>Find AC Experts <ArrowRight size={16} /></span>
              </Link>
              <Link to="/find-services?service=plumbing" className="glass-card" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><Wrench size={32} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>Plumbing Services</h3>
                 <p style={styles.serviceText}>Emergency plumbers near you for leaks, blockages, motor repairs, and pipe replacement.</p>
                 <span style={styles.serviceLink}>Find Plumbers <ArrowRight size={16} /></span>
              </Link>
               <Link to="/find-services?service=water-heater" className="glass-card" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><Settings size={32} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>Geysers & Water Heaters</h3>
                 <p style={styles.serviceText}>Instant geyser installation, repair, and maintenance by verified local technicians.</p>
                 <span style={styles.serviceLink}>Find Geyser Experts <ArrowRight size={16} /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — FOR CUSTOMERS */}
      <section id="how-it-works" style={styles.processSection}>
        <div className="container">
          <h2 style={{...styles.heading2, textAlign: 'center'}}>How Pro Fix Works</h2>
          
          {/* For Customers */}
          <div style={styles.processLabel}><Users size={18} /> For Customers</div>
          <div style={styles.processGrid}>
             <div style={styles.processLine}></div>
             <div className="animate-fade-in-up" style={{...styles.processStep, animationDelay: '0.1s'}}>
                <div style={styles.processNumber}>1</div>
                <h3 style={styles.processTitle}>Search Nearby</h3>
                <p style={styles.processText}>Allow location access and select the service you need. We'll find providers near you.</p>
             </div>
             <div className="animate-fade-in-up" style={{...styles.processStep, animationDelay: '0.2s'}}>
                <div style={styles.processNumber}>2</div>
                <h3 style={styles.processTitle}>Compare & Contact</h3>
                <p style={styles.processText}>See ratings, distance, and services. Call or WhatsApp the right provider directly.</p>
             </div>
             <div className="animate-fade-in-up" style={{...styles.processStep, animationDelay: '0.3s'}}>
                <div style={styles.processNumber}>3</div>
                <h3 style={styles.processTitle}>Get it Fixed</h3>
                <p style={styles.processText}>A verified expert arrives, provides upfront pricing, and resolves the problem cleanly.</p>
             </div>
          </div>

          {/* For Businesses */}
          <div style={{...styles.processLabel, marginTop: '64px'}}><Store size={18} /> For Service Businesses</div>
          <div style={styles.processGrid}>
             <div style={{...styles.processLine, background: 'linear-gradient(90deg, var(--color-surface-container) 0%, var(--color-secondary) 50%, var(--color-surface-container) 100%)'}}></div>
             <div className="animate-fade-in-up" style={{...styles.processStep, animationDelay: '0.1s'}}>
                <div style={{...styles.processNumber, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))'}}>1</div>
                <h3 style={styles.processTitle}>Register Free</h3>
                <p style={styles.processText}>Add your business details, services, and shop location (latitude & longitude from Maps) in two quick steps.</p>
             </div>
             <div className="animate-fade-in-up" style={{...styles.processStep, animationDelay: '0.2s'}}>
                <div style={{...styles.processNumber, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))'}}>2</div>
                <h3 style={styles.processTitle}>Get Verified</h3>
                <p style={styles.processText}>Our admin team reviews and approves your listing. You'll go live once verified.</p>
             </div>
             <div className="animate-fade-in-up" style={{...styles.processStep, animationDelay: '0.3s'}}>
                <div style={{...styles.processNumber, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))'}}>3</div>
                <h3 style={styles.processTitle}>Receive Customers</h3>
                <p style={styles.processText}>Customers searching nearby will find you, call directly, or send service requests.</p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA — Register Your Business */}
      <section style={styles.ctaSection}>
        <div className="container" style={styles.ctaContainer}>
          <div className="animate-fade-in-up" style={styles.ctaContent}>
            <div style={styles.ctaIconRow}>
              <Zap size={40} color="var(--color-primary)" />
            </div>
            <h2 style={styles.ctaHeading}>Are You a Local Service Provider?</h2>
            <p style={styles.ctaText}>
              List your business for free and reach thousands of customers searching for services in your area. 
              AC repair, plumbing, electrical — whatever your expertise, customers are looking for you.
            </p>
            <div style={styles.ctaActions}>
              <Link to="/register" className="btn-secondary" style={styles.ctaBtn}>
                Register Your Business — Free
              </Link>
              <Link to="/login" style={styles.ctaLoginLink}>Already registered? Sign in →</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* WHY US SECTION */}
      <section id="why-us" style={styles.trustSection}>
         <div className="container" style={styles.trustContainer}>
             <div className="animate-fade-in-up" style={{flex: '1 1 400px'}}>
                 <h2 style={styles.heading2}>Why Choose Pro Fix</h2>
                 <p style={{fontSize: '1.2rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.6}}>
                    We connect customers with verified local service businesses. Every shop on our platform passes admin verification, ensuring quality and trust.
                 </p>
                 <ul style={{listStyle: 'none', padding: 0, marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <li style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>Admin-Verified Businesses Only</strong></li>
                    <li style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>Geo-Tagged Location Search</strong></li>
                    <li style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>Direct Call & WhatsApp Contact</strong></li>
                    <li style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>Free Registration for Businesses</strong></li>
                 </ul>
             </div>
             <div className="animate-fade-in-up animate-float" style={{flex: '1 1 400px', position: 'relative'}}>
                <img src="/trusted_tech.png" alt="Trusted Service Provider" style={styles.trustImage} />
                <div className="glass-panel" style={styles.trustBadge}>
                   <ShieldCheck color="#25d366" size={24} />
                   <div style={{display: 'flex', flexDirection: 'column'}}>
                     <span style={{fontWeight: '800', lineHeight: 1.2}}>Admin Verified</span>
                     <span style={{fontSize: '0.8rem', opacity: 0.8}}>Every listed business</span>
                   </div>
                </div>
             </div>
         </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" style={styles.reviewSection}>
        <div className="container">
          <h2 style={{...styles.heading2, textAlign: 'center', marginBottom: '56px'}}>Trusted Across India</h2>
          <div style={styles.reviewCards}>
            <div className="glass-card" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"Found an AC repair shop just 2km away within seconds! The technician arrived in 30 minutes and fixed everything. Pro Fix is a game changer."</p>
              <p style={styles.reviewer}>- Neha K., South Extension</p>
            </div>
            <div className="glass-card" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"As a plumbing business owner, registering on Pro Fix has doubled my customer inquiries. The geo-tagging feature shows me to people right in my area."</p>
              <p style={styles.reviewer}>- Rajesh S., Gurgaon</p>
            </div>
             <div className="glass-card" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"Had a plumbing emergency at 10 PM. Searched on Pro Fix, found a nearby shop still open, and the plumber came within an hour. Incredible!"</p>
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
    minHeight: 'calc(100vh - 80px)',
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
    gap: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  primaryLink: {
    padding: '14px 30px',
    fontSize: '1rem',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 15px 35px rgba(0, 60, 137, 0.5)',
    fontWeight: '800'
  },
  secondaryLink: {
    fontWeight: '700',
    color: '#ffffff',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '2px solid rgba(255,255,255,0.3)',
    paddingBottom: '4px',
    fontSize: '1.05rem',
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
    alignItems: 'flex-start',
    textDecoration: 'none',
    color: 'inherit',
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
  processLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '32px',
    justifyContent: 'center',
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
  ctaSection: {
    padding: 'clamp(60px, 10vw, 120px) 0',
    backgroundColor: 'var(--color-surface)',
  },
  ctaContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  ctaContent: {
    textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(0,60,137,0.04), rgba(0,60,137,0.08))',
    border: '2px solid rgba(0,60,137,0.1)',
    borderRadius: '24px',
    padding: 'clamp(32px, 6vw, 64px)',
  },
  ctaIconRow: {
    marginBottom: '24px',
  },
  ctaHeading: {
    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
    marginBottom: '16px',
  },
  ctaText: {
    fontSize: '1.1rem',
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.6,
    maxWidth: '600px',
    margin: '0 auto 32px',
  },
  ctaActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  ctaBtn: {
    padding: '16px 36px',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '800',
    display: 'inline-block',
  },
  ctaLoginLink: {
    color: 'var(--color-on-surface-variant)',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  trustSection: {
     padding: 'clamp(60px, 10vw, 140px) 0',
     backgroundColor: 'var(--color-surface-container-lowest)'
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
    backgroundColor: 'var(--color-surface)',
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
     backgroundColor: 'var(--color-surface-container-lowest)'
  }
};

export default Home;
