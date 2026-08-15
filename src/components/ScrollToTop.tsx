import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SCROLL_EXCLUDED_PREFIXES = ['/dashboard', '/admin'];

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (SCROLL_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
