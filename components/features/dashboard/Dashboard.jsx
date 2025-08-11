import React from 'react';
import { useAnalytics, useSubscriptions } from '../../../hooks';
import { StatCard } from '../../ui';
import { DollarSign, CreditCard, Mail, Target } from 'lucide-react';

const Dashboard = React.memo(() => {
  const { analytics, formatCurrency } = useAnalytics();
  const { prioritySubscriptions } = useSubscriptions();

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in" role="region" aria-label="Dashboard">
      
      {/* Stats Grid */}
      <section aria-label="Key metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title="Monthly Savings Potential" 
            value={formatCurrency(analytics.financial.potentialSavings)}
            subtitle="From optimizing subscriptions"
            icon={DollarSign} 
            className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600" 
            trend={analytics.trends.savings}
          />
          <StatCard 
            title="Current Monthly Spend" 
            value={formatCurrency(analytics.financial.monthlySpend)}
            subtitle={`${formatCurrency(analytics.financial.annualSpend)} annually`}
            icon={CreditCard} 
            className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" 
            trend={analytics.trends.spending}
          />
          <StatCard 
            title="Email Overload" 
            value={`${analytics.emails.weeklyEmails}`}
            subtitle="Weekly promotional emails"
            icon={Mail} 
            className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600" 
            trend={analytics.trends.emails}
          />
          <StatCard 
            title="Savings Goal Progress" 
            value={`${analytics.goals.progress}%`}
            subtitle={`${formatCurrency(analytics.goals.remaining)} to go`}
            icon={Target} 
            className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600" 
            trend={analytics.trends.goal}
          />
        </div>
      </section>

      {/* Success Message */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">CleanSlate v3 is Ready!</h2>
        <p className="text-gray-600 mb-4">
          Modular architecture successfully implemented with:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-green-100 text-green-800 p-3 rounded-lg font-medium">
            ✅ Context API
          </div>
          <div className="bg-blue-100 text-blue-800 p-3 rounded-lg font-medium">
            ✅ Custom Hooks
          </div>
          <div className="bg-purple-100 text-purple-800 p-3 rounded-lg font-medium">
            ✅ Modular Components
          </div>
          <div className="bg-orange-100 text-orange-800 p-3 rounded-lg font-medium">
            ✅ PWA Support
          </div>
        </div>
        
        {prioritySubscriptions.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">Priority Action Needed</h3>
            <p className="text-yellow-700 text-sm">
              You have {prioritySubscriptions.length} unused subscriptions that could save you{' '}
              ${prioritySubscriptions.reduce((sum, sub) => sum + sub.amount, 0).toFixed(2)}/month!
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
