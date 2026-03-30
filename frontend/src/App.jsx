import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import ScrollReset from './components/ScrollReset';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'sonner';

// Lazy load pages for better performance on slow Indian mobile networks
const Home = lazy(() => import('./pages/Home'));
const ACRepair = lazy(() => import('./pages/ACRepair'));
const Plumbing = lazy(() => import('./pages/Plumbing'));
const Geyser = lazy(() => import('./pages/Geyser'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Branded loading spinner matching the Blue Guard design system
const LoadingFallback = () => (
  <div style={{
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-surface)',
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      border: '4px solid var(--color-surface-container)',
      borderTop: '4px solid var(--color-primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollReset />
      <Navbar />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services/ac-repair" element={<ACRepair />} />
            <Route path="/services/plumbing" element={<Plumbing />} />
            <Route path="/services/geysers" element={<Geyser />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <WhatsAppFloat />
      <ScrollToTop />
      <Toaster position="bottom-right" richColors />
      <Footer />
    </Router>
  );
}

export default App;
