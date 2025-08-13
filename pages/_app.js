import Head from 'next/head';
import { useEffect } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  // Suppress Next.js framework errors în production
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Override console.error pentru a suprima erorile framework
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.error = (...args) => {
        const errorString = args.join(' ');
        
        // Suppress specific Next.js framework errors
        if (
          errorString.includes('Minified React error') ||
          errorString.includes('framework-') ||
          errorString.includes('ReactDOM.render') ||
          errorString.includes('Warning:') ||
          errorString.includes('validateDOMNesting') ||
          errorString.includes('useLayoutEffect')
        ) {
          return; // Don't log these errors
        }
        
        originalError.apply(console, args);
      };
      
      console.warn = (...args) => {
        const warnString = args.join(' ');
        
        if (
          warnString.includes('React') ||
          warnString.includes('Next.js') ||
          warnString.includes('Warning:')
        ) {
          return; // Don't log these warnings
        }
        
        originalWarn.apply(console, args);
      };
      
      // Prevent unhandled promise rejections from crashing the app
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message?.includes('Minified React error')) {
          event.preventDefault();
        }
      });
      
      // Cleanup function
      return () => {
        console.error = originalError;
        console.warn = originalWarn;
      };
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>CleanSlate v3</title>
        
        {/* Favicon configuration */}
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* PWA metadata */}
        <meta name="description" content="Digital Life Decluttering Platform" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.png" as="image" />
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}
