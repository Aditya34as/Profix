import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'

/* ── SPA Redirect Fix ──
   Render's static site does a 301 redirect (URL changes to /index.html)
   instead of a 200 rewrite (URL stays the same). This breaks React Router.
   Fix: Before React mounts, if we landed on /index.html, restore the
   original path the user was on. */
;(() => {
  const path = window.location.pathname;
  // If server redirected to /index.html, restore the saved path
  if (path === '/index.html' || path === '/index') {
    const savedPath = sessionStorage.getItem('profix_path') || '/';
    if (savedPath !== '/index.html' && savedPath !== '/index') {
      window.history.replaceState(null, '', savedPath);
    } else {
      window.history.replaceState(null, '', '/');
    }
  }
  // Continuously save current path so it survives server redirects
  const savePath = () => {
    const p = window.location.pathname + window.location.search;
    if (p !== '/index.html' && p !== '/index') {
      sessionStorage.setItem('profix_path', p);
    }
  };
  savePath();
  // Patch pushState/replaceState to track navigation
  const origPush = history.pushState.bind(history);
  const origReplace = history.replaceState.bind(history);
  history.pushState = (...args) => { origPush(...args); savePath(); };
  history.replaceState = (...args) => { origReplace(...args); savePath(); };
  window.addEventListener('popstate', savePath);
})()

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
