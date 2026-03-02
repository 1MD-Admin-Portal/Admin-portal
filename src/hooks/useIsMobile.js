import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile/tablet viewport
 * Uses a single breakpoint (1024px) for consistency
 * Avoids direct window.innerWidth calls in components
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize based on current window size
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    // Use ResizeObserver or resize event with debounce for better performance
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return isMobile;
};

/**
 * MediaQueryList hook for more performant detection
 * Alternative approach using native browser APIs
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e) => {
      setMatches(e.matches);
    };

    // Use addEventListener for better browser compatibility
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
};
