import Head from 'next/head';
import { useEffect } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('SW registered: ', registration);
          },
          (error) => {
            console.log('SW registration failed: ', error);
          }
        );
      });
    }

    // iOS PWA fixes
    if ('standalone' in window.navigator && window.navigator.standalone) {
      // App is running in standalone mode (iOS)
      document.addEventListener('click', (event) => {
        let target = event.target;
        while (target && target.tagName !== 'A') {
          target = target.parentNode;
        }
        if (target && target.href && !target.href.startsWith('http')) {
          event.preventDefault();
          window.location = target.href;
        }
      });
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <title>CleanSlate - Subscription Manager</title>
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="CleanSlate" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CleanSlate" />
        <meta name="description" content="Manage all your subscriptions in one place" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/icon-192x192.png" color="#2563eb" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        
        {/* iOS Splash Screens */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}
