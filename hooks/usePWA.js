import { useEffect, useState, useCallback } from 'react';
import { useApp } from '../context';

export function usePWA() {
  const { state, actions } = useApp();
  const { pwa } = state;
  
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
      setIsStandalone(standalone);
      
      if (standalone) {
        actions.setPWAInstalled(true);
      }
    };

    checkStandalone();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      actions.setPWAInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      actions.setPWAInstalled(true);
      setDeferredPrompt(null);
    };

    // Listen for display mode changes
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        setIsStandalone(true);
        actions.setPWAInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeListener(handleDisplayModeChange);
    };
  }, [actions]);

  // Install the PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) {
      console.warn('No install prompt available');
      return false;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('PWA install prompt outcome:', outcome);
      
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
        actions.setPWAInstalled(true);
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      
      // Clear the deferred prompt
      setDeferredPrompt(null);
      actions.setPWAInstallable(false);
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    }
  }, [deferredPrompt, actions]);

  // Check if PWA features are supported
  const isSupported = useCallback(() => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!isSupported()) {
      console.warn('Service workers not supported');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered:', registration.scope);
      return true;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return false;
    }
  }, [isSupported]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Show a test notification
  const showNotification = useCallback(async (title, options = {}) => {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: 'cleanslate-notification',
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);
      
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }, []);

  return {
    // State
    isInstallable: pwa.isInstallable,
    isInstalled: pwa.isInstalled,
    isStandalone,
    isSupported: isSupported(),
    canInstall: deferredPrompt !== null,
    
    // Actions
    installPWA,
    registerServiceWorker,
    requestNotificationPermission,
    showNotification,
    
    // Utils
    isSupported
  };
}

// Export for backward compatibility
export default usePWA;
