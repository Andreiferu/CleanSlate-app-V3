import { useMemo, useCallback } from 'react';
import { useApp } from '../context';

export function useAnalytics() {
  const { state } = useApp();
  const { subscriptions, emails, user } = state;

  // Calculate analytics data
  const analytics = useMemo(() => {
    // Financial calculations
    const activeSubscriptions = subscriptions.filter(sub => 
      sub.status === 'active' || sub.status === 'unused' || sub.status === 'forgotten'
    );
    
    const activeSpend = subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((sum, sub) => sum + sub.amount, 0);
    
    const potentialSavings = subscriptions
      .filter(sub => sub.status === 'unused' || sub.status === 'forgotten')
      .reduce((sum, sub) => sum + sub.amount, 0);
    
    const totalMonthlySpend = activeSubscriptions
      .reduce((sum, sub) => sum + sub.amount, 0);

    // Email calculations
    const activeEmails = emails.filter(email => !email.unsubscribed);
    const weeklyEmails = activeEmails.reduce((sum, email) => sum + email.emailsPerWeek, 0);
    const monthlyEmails = weeklyEmails * 4.33; // Average weeks per month
    const annualEmails = weeklyEmails * 52;

    // Goals calculations
    const progressPercentage = (user.totalSaved / user.savingsGoal) * 100;
    const remainingToGoal = Math.max(0, user.savingsGoal - user.totalSaved);

    // Trends (mock data for demo - in real app would come from historical data)
    const trends = {
      savings: Math.round(Math.random() * 20 + 5), // 5-25% increase
      spending: Math.round(Math.random() * 10 - 15), // -15 to -5% decrease
      emails: Math.round(Math.random() * 10 - 20), // -20 to -10% decrease
      goal: Math.round(Math.random() * 20 + 10) // 10-30% progress
    };

    // Time savings from emails (assuming 1.5 minutes per email)
    const weeklyTimeWasted = weeklyEmails * 1.5; // minutes
    const monthlyTimeWasted = weeklyTimeWasted * 4.33;
    const annualTimeWasted = weeklyTimeWasted * 52;

    return {
      financial: {
        monthlySpend: activeSpend.toFixed(2),
        potentialSavings: potentialSavings.toFixed(2),
        annualSpend: (totalMonthlySpend * 12).toFixed(2),
        totalMonthlySpend: totalMonthlySpend.toFixed(2),
        activeSubscriptions: activeSubscriptions.length,
        cancelledSubscriptions: subscriptions.filter(sub => sub.status === 'cancelled').length
      },
      emails: {
        weeklyEmails,
        monthlyEmails: Math.round(monthlyEmails),
        annualEmails: Math.round(annualEmails),
        activeSubscriptions: activeEmails.length,
        unsubscribedCount: emails.filter(email => email.unsubscribed).length,
        timeWasted: {
          weekly: Math.round(weeklyTimeWasted),
          monthly: Math.round(monthlyTimeWasted),
          annual: Math.round(annualTimeWasted)
        }
      },
      goals: {
        progress: progressPercentage.toFixed(1),
        remaining: remainingToGoal.toFixed(2),
        savedSoFar: user.totalSaved.toFixed(2),
        goalAmount: user.savingsGoal.toFixed(2),
        completionPercentage: Math.min(100, progressPercentage).toFixed(1)
      },
      trends,
      insights: {
        topCategory: getTopSpendingCategory(subscriptions),
        biggestSaver: getBiggestSavingOpportunity(subscriptions),
        emailOverload: getEmailOverloadInsight(emails)
      }
    };
  }, [subscriptions, emails, user]);

  // Helper functions
  function getTopSpendingCategory(subs) {
    const categorySpend = {};
    subs.filter(sub => sub.status === 'active').forEach(sub => {
      categorySpend[sub.category] = (categorySpend[sub.category] || 0) + sub.amount;
    });
    
    const topCategory = Object.entries(categorySpend)
      .sort(([,a], [,b]) => b - a)[0];
    
    return topCategory ? {
      category: topCategory[0],
      amount: topCategory[1].toFixed(2)
    } : null;
  }

  function getBiggestSavingOpportunity(subs) {
    const unused = subs.filter(sub => sub.status === 'unused' || sub.status === 'forgotten');
    const biggest = unused.sort((a, b) => b.amount - a.amount)[0];
    
    return biggest ? {
      name: biggest.name,
      amount: biggest.amount.toFixed(2),
      category: biggest.category
    } : null;
  }

  function getEmailOverloadInsight(emailList) {
    const highVolumeEmails = emailList.filter(email => 
      !email.unsubscribed && email.emailsPerWeek > 5
    );
    
    const totalWastedTime = highVolumeEmails.reduce((sum, email) => 
      sum + (email.emailsPerWeek * 1.5), 0
    );

    return {
      count: highVolumeEmails.length,
      weeklyTimeWasted: Math.round(totalWastedTime),
      topSender: highVolumeEmails.sort((a, b) => b.emailsPerWeek - a.emailsPerWeek)[0]?.sender
    };
  }

  // Formatting utilities
  const formatCurrency = useCallback((amount, currency = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(Number(amount) || 0);
    } catch (error) {
      return `$${Number(amount || 0).toFixed(2)}`;
    }
  }, []);

  const formatPercentage = useCallback((value, decimals = 1) => {
    return `${Number(value || 0).toFixed(decimals)}%`;
  }, []);

  const formatTime = useCallback((minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }, []);

  // Track analytics events (for real analytics integration)
  const trackEvent = useCallback((eventName, properties = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics]', eventName, properties);
    }
    
    // Here you would integrate with real analytics services like:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - Custom analytics endpoint
    
    // Example:
    // gtag('event', eventName, properties);
    // mixpanel.track(eventName, properties);
  }, []);

  return {
    analytics,
    formatCurrency,
    formatPercentage,
    formatTime,
    trackEvent
  };
}

// Export for backward compatibility if imported differently in some files
export default useAnalytics;
