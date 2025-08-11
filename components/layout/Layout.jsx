import React from 'react';
import { Header, Navigation } from './';
import { PWAInstallPrompt } from '../pwa';
import { usePWA } from '../../hooks';

const Layout = React.memo(({ children }) => {
  const { showInstallBanner, isInstalled, handleInstallApp, dismissInstallBanner } = usePWA();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <Navigation />
      {children}
      
      {/* PWA Install Prompt */}
      {showInstallBanner && !isInstalled && (
        <PWAInstallPrompt
          onInstall={handleInstallApp}
          onDismiss={dismissInstallBanner}
        />
      )}
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
