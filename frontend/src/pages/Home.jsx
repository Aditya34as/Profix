import { useState } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronDown, ShieldCheck, Search, ArrowRight, Wind, Droplet, Thermometer, Sparkles } from 'lucide-react';

const Home = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What services does Pro Fix offer?",
      a: "We provide expert AC repair & servicing, plumbing solutions, geyser & water heater installation/repair, and professional deep cleaning services — all handled by verified, experienced technicians."
    },
    {
      q: "How quickly can I get a technician?",
      a: "Our network of local professionals ensures fast response times. Once you submit a request, a nearby expert will be assigned and typically arrives within 1–2 hours depending on availability."
    },
    {
      q: "Are your technicians verified?",
      a: "Absolutely. Every service professional on Pro Fix goes through a rigorous verification process including background checks, skill assessments, and ongoing quality reviews to ensure top-tier service."
    },
    {
      q: "What if I'm not satisfied with the service?",
      a: "Your satisfaction is our priority. If you're not happy with the work, contact us within 48 hours and we'll send another technician to resolve the issue at no extra cost."
    },
    {
      q: "How is pricing determined?",
      a: "Pricing is transparent and upfront. You'll receive a clear estimate before any work begins — no hidden charges, no surprises. You only pay after the job is completed to your satisfaction."
    },
    {
      q: "Do you offer any warranty on repairs?",
      a: "Yes, all repairs come with a service warranty. The duration varies by service type — typically 30 to 90 days. If the same issue recurs within the warranty period, we'll fix it free of charge."
    }
  ];

    /* FAQ Schema for Google Rich Snippets */
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };

    const reviewSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Pro Fix Home Services",
      "description": "India's most trusted marketplace for verified home service professionals including AC repair, plumbing, geyser installation and deep cleaning.",
      "brand": { "@type": "Brand", "name": "Pro Fix India" },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "2450",
        "bestRating": "5"
      },
      "review": [
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Neha K." },
          "reviewRating": { "@type": "Rating", "ratingValue": "5" },
          "reviewBody": "Found an AC repair shop just 2km away within seconds! The technician arrived in 30 minutes and fixed everything."
        },
        {
          "@type": "Review",
          "author": { "@type": "Person", "name": "Rajesh S." },
          "reviewRating": { "@type": "Rating", "ratingValue": "5" },
          "reviewBody": "As a plumbing business owner, registering on Pro Fix has doubled my customer inquiries."
        }
      ]
    };

    return (
    <>
      <SEO 
        title="Best Home Services Near You — AC Repair, Plumber, Geyser & Cleaning" 
        description="Pro Fix India connects you with 500+ verified AC repair, plumbing, geyser repair & deep cleaning experts in Delhi NCR. 90-minute response, transparent pricing, 30-day warranty. Rated 4.9★ by 10,000+ customers. Book now!"
        keywords="best home services near me, AC repair near me Delhi, plumber near me Gurgaon, geyser repair Noida, deep cleaning services Delhi NCR, emergency AC repair, same day plumber, Pro Fix home services, trusted technicians India, affordable home repair, local service marketplace India, book AC service online"
        url="https://profix-front.onrender.com"
        serviceSchema={[faqSchema, reviewSchema]}
      />
      
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <div className="container" style={styles.heroContainer}>
          <div className="animate-fade-in-up" style={styles.heroGlassContent}>
             <span style={styles.eyebrow}>🏆 #1 Rated Home Services in Delhi NCR</span>
            <h1 style={styles.heading1}>Expert <span className="text-gradient">AC Repair, Plumbing & Home Services</span> — Verified Pros at Your Doorstep</h1>
            <p style={styles.heroText}>
              Need an AC technician, plumber, or geyser expert near you? Pro Fix connects you with 500+ background-verified professionals in Delhi NCR.
              Transparent pricing. 90-minute response. 30-day service warranty. Rated 4.9★ by 10,000+ happy customers.
            </p>
            <div style={styles.heroActions}>
              <Link to="/find-services" className="btn-secondary" style={styles.primaryLink}>
                <Search size={20} /> Book a Service
              </Link>
              <a href="#how-it-works" style={styles.secondaryLink}>
                How It Works →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={styles.servicesSection}>
        <div className="container">
          <div>
            <h2 data-reveal="up" style={{...styles.heading2, textAlign: 'center'}}>Our Services</h2>
            <p data-reveal="up" data-delay="1" style={{textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: '1.1rem', marginBottom: '40px', marginTop: '-16px'}}>
              From emergency AC repairs to scheduled deep cleaning — Pro Fix connects you with verified local experts for every home service need in Delhi, Gurgaon, Noida & NCR.
            </p>
            <div style={styles.servicesGrid}>
              
              <Link to="/find-services?service=ac-repair" data-reveal="scale" data-delay="1" className="glass-card service-card-hover" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><Wind size={28} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>AC & Cooling</h3>
                 <span style={styles.serviceLink}>Find Experts <ArrowRight size={14} /></span>
              </Link>
              
              <Link to="/find-services?service=plumbing" data-reveal="scale" data-delay="2" className="glass-card service-card-hover" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><Droplet size={28} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>Plumbing</h3>
                 <span style={styles.serviceLink}>Find Plumbers <ArrowRight size={14} /></span>
              </Link>
               
              <Link to="/find-services?service=water-heater" data-reveal="scale" data-delay="3" className="glass-card service-card-hover" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><Thermometer size={28} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>Geysers</h3>
                 <span style={styles.serviceLink}>Find Technicians <ArrowRight size={14} /></span>
              </Link>

              <Link to="/find-services?service=cleaning" data-reveal="scale" data-delay="4" className="glass-card service-card-hover" style={styles.serviceCard}>
                 <div style={styles.iconWrapper}><Sparkles size={28} color="#fff" /></div>
                 <h3 style={styles.serviceTitle}>Cleaning</h3>
                 <span style={styles.serviceLink}>Find Cleaners <ArrowRight size={14} /></span>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={styles.processSection}>
        <div className="container">
          <h2 data-reveal="up" style={{...styles.heading2, textAlign: 'center'}}>How It Works</h2>
          <p data-reveal="up" data-delay="1" style={{textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: '1.1rem', marginBottom: '48px', marginTop: '-16px', maxWidth: '600px', margin: '-16px auto 48px'}}>Getting your home fixed is as easy as 1-2-3</p>
          
          <div style={styles.processGrid}>
             <div style={styles.processLine}></div>
             <div data-reveal="up" data-delay="1" style={styles.processStep}>
                <div style={styles.processNumber}>1</div>
                <h3 style={styles.processTitle}>Choose Your Service</h3>
                <p style={styles.processText}>Browse our categories — AC repair, plumbing, geysers, or cleaning — and tell us what you need fixed.</p>
             </div>
             <div data-reveal="up" data-delay="3" style={styles.processStep}>
                <div style={styles.processNumber}>2</div>
                <h3 style={styles.processTitle}>Get Matched Instantly</h3>
                <p style={styles.processText}>We connect you with verified professionals nearest to your location. Check ratings and reviews before you decide.</p>
             </div>
             <div data-reveal="up" data-delay="5" style={styles.processStep}>
                <div style={styles.processNumber}>3</div>
                <h3 style={styles.processTitle}>Sit Back & Relax</h3>
                <p style={styles.processText}>Your expert arrives on time, provides transparent pricing upfront, and gets the job done right — guaranteed.</p>
             </div>
          </div>
        </div>
      </section>

      {/* OUR PROMISE */}
      <section style={styles.ctaSection}>
        <div className="container" style={styles.ctaContainer}>
          <div data-reveal="blur" style={styles.ctaContent}>
            <div style={styles.ctaIconRow}>
              <ShieldCheck size={40} color="var(--color-primary)" />
            </div>
            <h2 style={styles.ctaHeading}>Our Promise to You</h2>
            <p style={styles.ctaText}>
              Every technician is background-checked and skill-certified. We stand behind our work with a satisfaction guarantee — if you're not happy, we'll make it right, no questions asked.
            </p>
            <div style={styles.ctaActions}>
              <Link to="/find-services" className="btn-secondary" style={styles.ctaBtn}>
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* WHY US SECTION */}
      <section id="why-us" style={styles.trustSection}>
         <div className="container" style={styles.trustContainer}>
             <div data-reveal="left" style={{flex: '1 1 400px'}}>
                  <h2 style={styles.heading2}>Why 10,000+ Customers Trust Pro Fix</h2>
                  <p style={{fontSize: '1.2rem', color: 'var(--color-on-surface-variant)', lineHeight: 1.6}}>
                     When something breaks at home, you need someone reliable — fast. Pro Fix India delivers experienced, background-verified service professionals who show up on time, every time across Delhi, Gurgaon, Noida, and Greater NCR.
                 </p>
                 <ul style={{listStyle: 'none', padding: 0, marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <li data-reveal="left" data-delay="2" style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>Trained & Certified Professionals</strong></li>
                    <li data-reveal="left" data-delay="3" style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>Transparent, Upfront Pricing</strong></li>
                    <li data-reveal="left" data-delay="4" style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>30-Day Service Warranty</strong></li>
                    <li data-reveal="left" data-delay="5" style={{display: 'flex', gap: '16px', alignItems: 'center', fontSize: '1.1rem'}}><CheckCircle color="var(--color-primary)" size={28}/> <strong>Available 7 Days a Week</strong></li>
                 </ul>
             </div>
             <div data-reveal="right" data-delay="2" className="animate-float" style={{flex: '1 1 400px', position: 'relative'}}>
                <img src="/trusted_tech.png" alt="Professional Technician" style={styles.trustImage} />
                <div className="glass-panel" style={styles.trustBadge}>
                   <ShieldCheck color="#25d366" size={24} />
                   <div style={{display: 'flex', flexDirection: 'column'}}>
                     <span style={{fontWeight: '800', lineHeight: 1.2}}>100% Satisfaction</span>
                     <span style={{fontSize: '0.8rem', opacity: 0.8}}>Guaranteed on every job</span>
                   </div>
                </div>
             </div>
         </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" style={styles.reviewSection}>
        <div className="container">
          <h2 data-reveal="up" style={{...styles.heading2, textAlign: 'center', marginBottom: '56px'}}>Trusted by 10,000+ Customers Across India</h2>
          <div style={styles.reviewCards}>
            <div data-reveal="scale" data-delay="1" className="glass-card" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"Found an AC repair shop just 2km away within seconds! The technician arrived in 30 minutes and fixed everything. Pro Fix is a game changer."</p>
              <p style={styles.reviewer}>- Neha K., South Extension</p>
            </div>
            <div data-reveal="scale" data-delay="3" className="glass-card" style={styles.reviewCard}>
              <div style={styles.stars}>⭐⭐⭐⭐⭐</div>
              <p style={styles.reviewText}>"As a plumbing business owner, registering on Pro Fix has doubled my customer inquiries. The geo-tagging feature shows me to people right in my area."</p>
              <p style={styles.reviewer}>- Rajesh S., Gurgaon</p>
            </div>
             <div data-reveal="scale" data-delay="5" className="glass-card" style={styles.reviewCard}>
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
             <h2 data-reveal="up" style={{...styles.heading2, textAlign: 'center'}}>Frequently Asked Questions</h2>
             
             <div data-reveal="up" data-delay="2" style={{marginTop: '40px'}}>
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
    background: 'linear-gradient(180deg, rgba(5, 15, 30, 0.45) 0%, rgba(5, 20, 40, 0.58) 100%)',
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
    background: 'linear-gradient(165deg, rgba(8, 28, 58, 0.78) 0%, rgba(5, 22, 48, 0.85) 100%)',
    border: '1px solid rgba(255,255,255,0.14)',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 30px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
    gap: '24px'
  },
  serviceCard: {
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'inherit',
    borderRadius: '24px',
  },
  iconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    boxShadow: '0 10px 20px rgba(0, 60, 137, 0.15)'
  },
  serviceTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    marginBottom: '12px'
  },
  serviceLink: {
    color: 'var(--color-primary)',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.95rem',
    marginTop: 'auto'
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
