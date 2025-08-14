// pages/index.jsx - COMPLET ACTUALIZAT
import React from 'react';
import { AppProvider } from '../context';
import { Header, Navigation } from '../components/layout';
import { Dashboard } from '../components/features/dashboard';
import { SubscriptionsTab } from '../components/features/subscriptions';
import { EmailsTab } from '../components/features/emails';
import { AnalyticsTab } from '../components/features/analytics';
import { PWAInstallPrompt } from '../components/pwa';
import BankConnectionButton from '../components/features/nordigen/BankConnectionButton';
import ErrorBoundary from '../components/ErrorBoundary';
import { useApp } from '../context';
import { usePWA } from '../hooks';

// Main App Content Component
function AppContent() {
 const { state } = useApp();
 const { activeTab } = state.ui;
 const { isInstallable, installPWA } = usePWA();

 const renderActiveTab = () => {
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
   <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
     {/* Header */}
     <Header />
     
     {/* Navigation */}
     <Navigation />
     
     {/* Main Content */}
     <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8" id="main-content">
       <ErrorBoundary>
         {renderActiveTab()}
       </ErrorBoundary>
     </main>
     
     {/* Bank Connection Button */}
     <BankConnectionButton />
     
     {/* PWA Install Prompt */}
     {isInstallable && (
       <PWAInstallPrompt 
         onInstall={installPWA}
         onDismiss={() => {/* Handle dismiss */}}
       />
     )}
     
     {/* Skip to content link for accessibility */}
     <a 
       href="#main-content" 
       className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 transition-all"
     >
       Skip to main content
     </a>
   </div>
 );
}

// Main Home Component
export default function Home() {
 return (
   <AppProvider>
     <AppContent />
   </AppProvider>
 );
}
