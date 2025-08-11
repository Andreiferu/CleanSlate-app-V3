import { useState, useEffect } from 'react';
import { useApp } from '../context';

export function usePWA() {
  const { state, actions } = useApp();
  const { pwa } = state;
  
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false);
  const [manifestValid, setManifestValid] = useState(false);

  // PWA Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('PWA: Service Worker registered successfully:', registration);
          setServiceWorkerRegistered(true);
        })
        .catch((error) => {
          console.log('PWA: Service Worker registration failed:', error);
          setServiceWorkerRegistered(false);
        });
    }

    // Check manifest validity
    fetch('/manifest.json')
      .then(response => response.json())
      .then(manifest => {
        console.log('PWA: Manifest loaded successfully:', manifest);
        setManifestValid(true);
      })
      .catch(error => {
        console.log('PWA: Manifest load failed:', error);
        setManifestValid(false);
      });
  }, []);

  // PWA Install Prompt Handling
  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = window.navigator && window.navigator.standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;

    actions.setPWAState({ isInstalled });

    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      actions.setPWAState({ deferredPrompt: e });
      
      if (!isInstalled) {
        // Show install banner after user engagement
        setTimeout(() => {
          actions.setPWAState({ showInstallBanner: true });
        }, 5000);
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA: App was installed');
      actions.setPWAState({ 
        isInstalled: true, 
        showInstallBanner: false, 
        deferredPrompt: null 
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [actions]);

  const handleInstallApp = async () => {
    if (pwa.deferredPrompt) {
      try {
        pwa.deferredPrompt.prompt();
        const { outcome } = await pwa.deferredPrompt.userChoice;
        console.log('PWA: Install prompt outcome:', outcome);
        actions.setPWAState({ deferredPrompt: null, showInstallBanner: false });
      } catch (error) {
        console.log('PWA: Install prompt failed:', error);
      }
    }
  };

  const dismissInstallBanner = () => {
    actions.setPWAState({ showInstallBanner: false });
  };

  return {
    ...pwa,
    serviceWorkerRegistered,
    manifestValid,
    handleInstallApp,
    dismissInstallBanner,
    canInstall: !!pwa.deferredPrompt && !pwa.isInstalled
  };
}
