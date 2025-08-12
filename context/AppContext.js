import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState({ user: null, locale: 'en' });

  const value = useMemo(() => ({
    state,
    setUser: (user) => setState((s) => ({ ...s, user })),
    setLocale: (locale) => setState((s) => ({ ...s, locale })),
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
