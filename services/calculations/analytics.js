class AnalyticsCalculator {
  calculateSubscriptionMetrics(subscriptions) {
    return {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      unused: subscriptions.filter(s => s.status === 'unused').length,
      forgotten: subscriptions.filter(s => s.status === 'forgotten').length,
      paused: subscriptions.filter(s => s.status === 'paused').length,
      cancelled: subscriptions.filter(s => s.status === 'cancelled').length
    };
  }

  calculateFinancialMetrics(subscriptions) {
    const activeSubscriptions = subscriptions.filter(s => s.status !== 'cancelled');
    const monthlySpend = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    
    const potentialSavings = subscriptions
      .filter(s => s.status !== 'active' && s.status !== 'cancelled')
      .reduce((sum, sub) => sum + sub.amount, 0);

    const yearlyDiscount = activeSubscriptions
      .reduce((sum, sub) => sum + (sub.amount * 12 * (sub.yearlyDiscount || 0) / 100), 0);

    return {
      monthlySpend: Number(monthlySpend.toFixed(2)),
      annualSpend: Number((monthlySpend * 12).toFixed(2)),
      potentialSavings: Number(potentialSavings.toFixed(2)),
      potentialAnnualSavings: Number((potentialSavings * 12).toFixed(2)),
      yearlyDiscount: Number(yearlyDiscount.toFixed(2)),
      avgSubscriptionCost: activeSubscriptions.length > 0 ? 
        Number((monthlySpend / activeSubscriptions.length).toFixed(2)) : 0
    };
  }

  calculateEmailMetrics(emails) {
    const activeEmails = emails.filter(e => !e.unsubscribed);
    const weeklyEmails = activeEmails.reduce((sum, e) => sum + e.emailsPerWeek, 0);
    
    return {
      totalSources: emails.length,
      weeklyEmails,
      timeWasted: Math.max(0, weeklyEmails * 2),
      unsubscribed: emails.filter(e => e.unsubscribed).length
    };
  }

  calculateGoalMetrics(user) {
    const progress = Math.min(100, (user.totalSaved / user.savingsGoal) * 100);
    const remaining = Math.max(0, user.savingsGoal - user.totalSaved);
    
    return {
      progress: Number(progress.toFixed(1)),
      remaining: Number(remaining.toFixed(2)),
      totalSaved: user.totalSaved,
      goal: user.savingsGoal,
      isGoalMet: user.totalSaved >= user.savingsGoal
    };
  }

  calculateTrends(currentMetrics) {
    // Simulate trends for demo
    return {
      savings: currentMetrics.financial.potentialSavings > 50 ? 12 : -5,
      spending: currentMetrics.financial.monthlySpend > 100 ? -5 : 8,
      emails: currentMetrics.emails.weeklyEmails > 40 ? -8 : 15,
      goal: currentMetrics.goals.progress > 50 ? 15 : -3
    };
  }

  generateInsights(subscriptions, emails, user) {
    const insights = [];

    // Unused subscriptions insight
    const unusedSubs = subscriptions.filter(s => s.status === 'unused' || s.status === 'forgotten');
    if (unusedSubs.length > 0) {
      const totalWaste = unusedSubs.reduce((sum, sub) => sum + sub.amount, 0);
      insights.push({
        id: Date.now() + Math.random(),
        type: 'warning',
        title: `${unusedSubs.length} Unused Subscriptions`,
        message: `You have ${unusedSubs.length} subscriptions you haven't used recently. Consider canceling to save $${totalWaste.toFixed(2)}/month.`,
        impact: totalWaste,
        priority: 'high'
      });
    }

    // Goal progress insight
    const goalProgress = (user.totalSaved / user.savingsGoal) * 100;
    if (goalProgress >= 80) {
      insights.push({
        id: Date.now() + Math.random() + 1,
        type: 'success',
        title: 'Great Progress!',
        message: `You're ${goalProgress.toFixed(0)}% to your savings goal! Only $${(user.savingsGoal - user.totalSaved).toFixed(2)} to go.`,
        impact: 0,
        priority: 'low'
      });
    }

    return insights;
  }
}

export const analyticsCalculator = new AnalyticsCalculator();
