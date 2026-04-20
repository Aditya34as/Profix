import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <>
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />
      <section style={styles.section}>
        <div className="container" style={styles.container}>
          <div data-reveal="scale" style={styles.errorCode}>404</div>
          <h1 data-reveal="up" data-delay="1" style={styles.heading}>Page Not Found</h1>
          <p data-reveal="up" data-delay="2" style={styles.text}>
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div data-reveal="up" data-delay="3" style={styles.actions}>
            <Link to="/" className="btn-secondary" style={styles.homeBtn}>
              Back to Home
            </Link>
            <a href="tel:+919336124550" style={styles.callLink}>
              Or call us: +91 93361 24550
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

const styles = {
  section: {
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-surface)',
    padding: '40px 20px',
  },
  container: {
    textAlign: 'center',
    maxWidth: '560px',
  },
  errorCode: {
    fontSize: 'clamp(6rem, 15vw, 10rem)',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1,
    marginBottom: '16px',
    letterSpacing: '-0.04em',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '16px',
    color: 'var(--color-on-surface)',
  },
  text: {
    fontSize: '1.1rem',
    color: 'var(--color-on-surface-variant)',
    lineHeight: 1.6,
    marginBottom: '40px',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  homeBtn: {
    padding: '14px 36px',
    fontSize: '1rem',
    borderRadius: '12px',
    display: 'inline-block',
    fontWeight: '700',
  },
  callLink: {
    color: 'var(--color-on-surface-variant)',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
};

export default NotFound;
