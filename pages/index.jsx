import React, { Suspense } from 'react';
import Head from 'next/head';
import { AppProvider, useApp } from '../context';
import { Layout } from '../components/layout';
import { LoadingSpinner } from '../components/ui';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Dashboard } from '../components/features/dashboard';

// Simple content switcher for tabs
function AppContent() {
  const { state } = useApp();
  const { activeTab } = state.ui;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'subscriptions':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>
            <p>Subscriptions management coming soon in next phase!</p>
          </div>
        );
      case 'emails':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Email Cleanup</h2>
            <p>Email management coming soon in next phase!</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <p>Advanced analytics coming soon in next phase!</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8" role="main">
      <Suspense fallback={<LoadingSpinner />}>
        {renderContent()}
      </Suspense>
    </main>
  );
}

function CleanSlateApp() {
  return (
    <>
      <Head>
        <title>CleanSlate v3 - Digital Life Decluttering</title>
        <meta name="description" content="Modular subscription and email management with smart analytics and AI recommendations." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CleanSlate v3" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>

      <ErrorBoundary>
        <AppProvider>
          <Layout>
            <AppContent />
          </Layout>
        </AppProvider>
      </ErrorBoundary>
    </>
  );
}

export default CleanSlateApp;
