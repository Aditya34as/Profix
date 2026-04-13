import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'

/* ── Global Scroll-Reveal Observer ── */
const initScrollReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Observe all [data-reveal] elements
  const observe = () => {
    document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el) => {
      observer.observe(el);
    });
  };

  // Initial scan + re-scan on route changes (MutationObserver)
  observe();
  const mutObs = new MutationObserver(() => {
    requestAnimationFrame(observe);
  });
  mutObs.observe(document.getElementById('root'), {
    childList: true,
    subtree: true,
  });
};

// Start after first paint
if (document.readyState === 'complete') {
  initScrollReveal();
} else {
  window.addEventListener('load', initScrollReveal);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
