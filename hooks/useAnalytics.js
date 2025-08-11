import { useMemo } from 'react';
import { useApp } from '../context';
import { analyticsCalculator } from '../services';
import { formatCurrency, formatPercentage } from '../utils';

export function useAnalytics() {
  const { state } = useApp();
  const { subscriptions, emails, user } = state;

  const analytics = useMemo(() => {
    const subscriptionMetrics = analyticsCalculator.calculateSubscriptionMetrics(subscriptions);
    const financialMetrics = analyticsCalculator.calculateFinancialMetrics(subscriptions);
    const emailMetrics = analyticsCalculator.calculateEmailMetrics(emails);
    const goalMetrics = analyticsCalculator.calculateGoalMetrics(user);
    
    const allMetrics = {
      subscriptions: subscriptionMetrics,
      financial: financialMetrics,
      emails: emailMetrics,
      goals: goalMetrics
    };
    
    const trends = analyticsCalculator.calculateTrends(allMetrics);

    return {
      ...allMetrics,
      trends
    };
  }, [subscriptions, emails, user]);

  return {
    analytics,
    formatCurrency,
    formatPercentage
  };
}
