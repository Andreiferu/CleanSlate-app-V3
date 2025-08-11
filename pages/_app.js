import Head from 'next/head';
import { useEffect } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker quietly in background
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('PWA: Service Worker registered');
        })
        .catch((registrationError) => {
          console.log('PWA: Service Worker registration failed');
        });
    }
  }, []);

  return (
    <>
      <Head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CleanSlate v3" />
        
        {/* Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" href="/icons/icon-192x192.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
