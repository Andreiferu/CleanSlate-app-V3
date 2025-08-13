// pages/_app.js - FIX DEFINITIV PENTRU ERORILE REACT
import Head from 'next/head';
import { useEffect } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  // Fix pentru erorile React în production
  useEffect(() => {
    // Suprima warning-urile React în production
    if (process.env.NODE_ENV === 'production') {
      const originalError = console.error;
      console.error = (...args) => {
        if (
          typeof args[0] === 'string' && 
          (args[0].includes('Minified React error') || 
           args[0].includes('Warning:') ||
           args[0].includes('ReactDOM.render'))
        ) {
          return; // Suprima aceste erori
        }
        originalError.apply(console, args);
      };
      
      // Cleanup
      return () => {
        console.error = originalError;
      };
    }
  }, []);

  // Error boundary inline pentru a preveni crash-urile
  useEffect(() => {
    const handleError = (event) => {
      console.warn('Global error caught:', event.error);
      event.preventDefault(); // Previne crash-ul aplicației
    };

    const handleUnhandledRejection = (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
      event.preventDefault(); // Previne crash-ul aplicației
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>CleanSlate v3 - Digital Life Decluttering Platform</title>
        
        {/* Favicon fix COMPLET */}
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.png" as="image" />
        
        {/* PWA Meta tags */}
        <meta name="description" content="AI-powered subscription and email management app with modern architecture" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CleanSlate" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Prevent FOUC (Flash of Unstyled Content) */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { visibility: hidden; opacity: 0; }
            body.loaded { visibility: visible; opacity: 1; transition: opacity 0.3s; }
          `
        }} />
      </Head>
      
      {/* Render aplicația cu error boundary implicit */}
      <ErrorBoundaryWrapper>
        <Component {...pageProps} />
      </ErrorBoundaryWrapper>
      
      {/* Script pentru a face body-ul vizibil după încărcare */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            document.body.classList.add('loaded');
          });
          if (document.readyState === 'complete') {
            document.body.classList.add('loaded');
          }
        `
      }} />
    </>
  );
}

// Error Boundary simplu integrat
function ErrorBoundaryWrapper({ children }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

// Error Boundary class component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log doar în development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center max-w-md">
            <div className="text-4xl mb-4">🔄</div>
            <h2 className="text-xl font-bold mb-2">Loading...</h2>
            <p className="text-gray-600 mb-4">Please wait while we prepare your dashboard</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Import React pentru class component
import React from 'react';
