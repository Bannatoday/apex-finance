import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Routes where Tawk.to chat should be hidden
const HIDDEN_ROUTES = ['/blog', '/admin'];

export default function TawkControl() {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldHide = HIDDEN_ROUTES.some(route => pathname.startsWith(route));

    // Wait for Tawk to load, then toggle visibility
    const toggle = () => {
      if (window.Tawk_API?.hideWidget && window.Tawk_API?.showWidget) {
        if (shouldHide) {
          window.Tawk_API.hideWidget();
        } else {
          window.Tawk_API.showWidget();
        }
      }
    };

    // Tawk might not be loaded yet on first render
    if (window.Tawk_API?.onLoad) {
      window.Tawk_API.onLoad = toggle;
    }
    // Also try immediately (for subsequent navigations)
    toggle();
  }, [pathname]);

  return null;
}
