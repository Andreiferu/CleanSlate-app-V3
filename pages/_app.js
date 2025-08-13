// pages/_app.js - VERSIUNEA COMPLETĂ REPARATĂ
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>CleanSlate v3 - Digital Life Decluttering Platform</title>
        
        {/* Favicon fix complet */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        
        {/* PWA Meta tags */}
        <meta name="description" content="AI-powered subscription and email management app" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="background-color" content="#f8f9fa" />
        <meta name="display" content="standalone" />
        <meta name="orientation" content="portrait" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="CleanSlate v3" />
        <meta property="og:description" content="Digital Life Decluttering Platform" />
        <meta property="og:image" content="/icons/icon-512x512.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CleanSlate v3" />
        <meta name="twitter:description" content="Digital Life Decluttering Platform" />
        <meta name="twitter:image" content="/icons/icon-512x512.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.png" as="image" type="image/png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
