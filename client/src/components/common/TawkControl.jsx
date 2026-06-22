import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Routes where Tawk.to chat should be hidden
const HIDDEN_ROUTES = ['/blog', '/admin'];

export default function TawkControl() {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldHide = HIDDEN_ROUTES.some(route => pathname.startsWith(route));

    const toggle = () => {
      try {
        if (shouldHide) {
          window.Tawk_API?.hideWidget?.();
        } else {
          window.Tawk_API?.showWidget?.();
        }
      } catch (e) {
        // Tawk not ready yet
      }
    };

    // Try immediately
    toggle();

    // Retry every 500ms for 5 seconds (Tawk loads async)
    let attempts = 0;
    const interval = setInterval(() => {
      toggle();
      attempts++;
      if (attempts >= 10) clearInterval(interval);
    }, 500);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
