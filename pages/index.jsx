import React, { Suspense } from 'react';
import Head from 'next/head';
import { AppProvider, useApp } from '../context';
import { Layout } from '../components/layout';
import { LoadingSpinner } from '../components/ui';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Dashboard } from '../components/features/dashboard';
import { SubscriptionsTab } from '../components/features/subscriptions';
import { EmailsTab } from '../components/features/emails';
import { AnalyticsTab } from '../components/features/analytics';

// Content switcher with all new tabs
function AppContent() {
  const { state } = useApp();
  const { activeTab } = state.ui;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'subscriptions':
        return <SubscriptionsTab />;
      case 'emails':
        return <EmailsTab />;
      case 'analytics':
        return <AnalyticsTab />;
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
        <title>CleanSlate v3 - AI-Powered Digital Life Optimization</title>
        <meta name="description" content="Advanced subscription management, email cleanup, and AI-powered insights for digital decluttering." />
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
