import { useCallback } from 'react';

export default function useAnalytics() {
  const trackEvent = useCallback((name, payload = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[analytics]', name, payload);
    }
    // no-op: integrate your real analytics here
  }, []);

  return { trackEvent };
}
