import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollReset from './components/ScrollReset';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'sonner';

// Lazy load pages
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Home = lazy(() => import('./pages/Home'));
const ACRepair = lazy(() => import('./pages/ACRepair'));
const Plumbing = lazy(() => import('./pages/Plumbing'));
const Geyser = lazy(() => import('./pages/Geyser'));
const FindServices = lazy(() => import('./pages/FindServices'));
const ShopDashboard = lazy(() => import('./pages/ShopDashboard'));
const ShopProfile = lazy(() => import('./pages/ShopProfile'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading spinner
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

/* ─── Route guards ─── */

// Requires authentication — redirects to /auth if not logged in
const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
};

// Only for customers — redirects shop owners to dashboard
const CustomerOnly = ({ children }) => {
  const { isAuthenticated, isCustomer, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isCustomer) return <Navigate to="/dashboard" replace />;
  return children;
};

// Only for shop owners — redirects customers to find-services
const ShopOnly = ({ children }) => {
  const { isAuthenticated, isShopOwner, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!isShopOwner) return <Navigate to="/find-services" replace />;
  return children;
};

// Guest only — redirects authenticated users to their home
const GuestOnly = ({ children }) => {
  const { isAuthenticated, isShopOwner, isCustomer, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (isAuthenticated) {
    if (isShopOwner) return <Navigate to="/dashboard" replace />;
    if (isCustomer) return <Navigate to="/find-services" replace />;
  }
  return children;
};

/* ─── App layout wrapper — hides Navbar/Footer on auth page ─── */
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <>
      <ScrollReset />
      {/* Show Navbar & Footer only when authenticated */}
      {isAuthenticated && <Navbar />}
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* ── Public: Auth page ── */}
            <Route path="/auth" element={
              <GuestOnly><AuthPage /></GuestOnly>
            } />

            {/* ── Root redirect ── */}
            <Route path="/" element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            } />

            {/* ── Customer pages ── */}
            <Route path="/find-services" element={
              <CustomerOnly><FindServices /></CustomerOnly>
            } />
            <Route path="/services/ac-repair" element={
              <CustomerOnly><ACRepair /></CustomerOnly>
            } />
            <Route path="/services/plumbing" element={
              <CustomerOnly><Plumbing /></CustomerOnly>
            } />
            <Route path="/services/geysers" element={
              <CustomerOnly><Geyser /></CustomerOnly>
            } />
            <Route path="/shop/:id" element={
              <RequireAuth><ShopProfile /></RequireAuth>
            } />

            {/* ── Business pages ── */}
            <Route path="/dashboard" element={
              <ShopOnly><ShopDashboard /></ShopOnly>
            } />

            {/* ── Admin ── */}
            <Route path="/admin" element={
              <RequireAuth><AdminPanel /></RequireAuth>
            } />

            {/* ── Catch-all ── */}
            <Route path="*" element={
              loading ? <LoadingFallback /> :
              isAuthenticated ? <NotFound /> : <Navigate to="/auth" replace />
            } />
          </Routes>
        </Suspense>
      </main>
      {isAuthenticated && <ScrollToTop />}
      <Toaster position="bottom-right" richColors />
      {isAuthenticated && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
