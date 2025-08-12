class AnalyticsCalculator {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minute cache
  }

  calculateSubscriptionMetrics(subscriptions) {
    const cacheKey = `sub_metrics_${JSON.stringify(subscriptions.map(s => ({ id: s.id, status: s.status, amount: s.amount })))}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const metrics = {
        total: subscriptions.length,
        active: subscriptions.filter(s => s.status === 'active').length,
        unused: subscriptions.filter(s => s.status === 'unused').length,
        forgotten: subscriptions.filter(s => s.status === 'forgotten').length,
        paused: subscriptions.filter(s => s.status === 'paused').length,
        cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
        
        // Metrici avansate
        averageAmount: this.calculateAverage(subscriptions.map(s => s.amount)),
        medianAmount: this.calculateMedian(subscriptions.map(s => s.amount)),
        categoryDistribution: this.calculateCategoryDistribution(subscriptions),
        statusDistribution: this.calculateStatusDistribution(subscriptions)
      };

      this.cache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;
    } catch (error) {
      console.error('Error calculating subscription metrics:', error);
      return this.getDefaultSubscriptionMetrics();
    }
  }

  calculateFinancialMetrics(subscriptions) {
    const cacheKey = `fin_metrics_${JSON.stringify(subscriptions.map(s => ({ id: s.id, amount: s.amount, status: s.status, yearlyDiscount: s.yearlyDiscount })))}`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const activeSubscriptions = subscriptions.filter(s => s.status !== 'cancelled');
      const monthlySpend = activeSubscriptions.reduce((sum, sub) => sum + (sub.amount || 0), 0);
      
      const potentialSavings = subscriptions
        .filter(s => s.status === 'unused' || s.status === 'forgotten')
        .reduce((sum, sub) => sum + (sub.amount || 0), 0);

      const yearlyDiscount = activeSubscriptions
        .reduce((sum, sub) => {
          const discount = (sub.yearlyDiscount || 0) / 100;
          return sum + (sub.amount * 12 * discount);
        }, 0);

      // Forecasting pentru următoarele 12 luni
      const monthlyForecast = this.calculateMonthlyForecast(activeSubscriptions);

      const metrics = {
        monthlySpend: Number(monthlySpend.toFixed(2)),
        annualSpend: Number((monthlySpend * 12).toFixed(2)),
        potentialSavings: Number(potentialSavings.toFixed(2)),
        potentialAnnualSavings: Number((potentialSavings * 12).toFixed(2)),
        yearlyDiscount: Number(yearlyDiscount.toFixed(2)),
        avgSubscriptionCost: activeSubscriptions.length > 0 ? 
          Number((monthlySpend / activeSubscriptions.length).toFixed(2)) : 0,
        
        // Metrici avansate
        monthlyForecast,
        categorySpending: this.calculateCategorySpending(activeSubscriptions),
        savingsOpportunities: this.identifySavingsOpportunities(subscriptions),
        costEfficiency: this.calculateCostEfficiency(subscriptions)
      };

      this.cache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;
    } catch (error) {
      console.error('Error calculating financial metrics:', error);
      return this.getDefaultFinancialMetrics();
    }
  }

  calculateEmailMetrics(emails) {
    try {
      const activeEmails = emails.filter(e => !e.unsubscribed);
      const weeklyEmails = activeEmails.reduce((sum, e) => sum + (e.emailsPerWeek || 0), 0);
      
      return {
        totalSources: emails.length,
        weeklyEmails,
        monthlyEmails: weeklyEmails * 4.33, // Average weeks per month
        timeWasted: Math.max(0, weeklyEmails * 2), // 2 minutes per email
        unsubscribed: emails.filter(e => e.unsubscribed).length,
        
        // Breakdown by category
        categoryBreakdown: this.calculateEmailCategoryBreakdown(emails),
        importanceDistribution: this.calculateEmailImportanceDistribution(emails),
        frequencyAnalysis: this.calculateEmailFrequencyAnalysis(emails)
      };
    } catch (error) {
      console.error('Error calculating email metrics:', error);
      return this.getDefaultEmailMetrics();
    }
  }

  calculateGoalMetrics(user) {
    try {
      const progress = Math.min(100, (user.totalSaved / user.savingsGoal) * 100);
      const remaining = Math.max(0, user.savingsGoal - user.totalSaved);
      
      return {
        progress: Number(progress.toFixed(1)),
        remaining: Number(remaining.toFixed(2)),
        totalSaved: user.totalSaved,
        goal: user.savingsGoal,
        isGoalMet: user.totalSaved >= user.savingsGoal,
        
        // Predicții
        monthsToGoal: remaining > 0 ? Math.ceil(remaining / 50) : 0, // Assuming $50/month savings
        projectedCompletion: this.calculateProjectedCompletion(remaining),
        milestones: this.calculateMilestones(user.savingsGoal, user.totalSaved)
      };
    } catch (error) {
      console.error('Error calculating goal metrics:', error);
      return this.getDefaultGoalMetrics();
    }
  }

  calculateTrends(currentMetrics, historicalData = []) {
    try {
      // Simulare trends pentru demo
      const baseTrends = {
        savings: currentMetrics.financial?.potentialSavings > 50 ? 12 : -5,
        spending: currentMetrics.financial?.monthlySpend > 100 ? -5 : 8,
        emails: currentMetrics.emails?.weeklyEmails > 40 ? -8 : 15,
        goal: currentMetrics.goals?.progress > 50 ? 15 : -3
      };

      // În producție, aici calculezi trends din date istorice
      if (historicalData.length > 1) {
        return this.calculateRealTrends(historicalData);
      }

      return baseTrends;
    } catch (error) {
      console.error('Error calculating trends:', error);
      return { savings: 0, spending: 0, emails: 0, goal: 0 };
    }
  }

  generateInsights(subscriptions, emails, user) {
    try {
      const insights = [];

      // Subscription insights
      const unusedSubs = subscriptions.filter(s => s.status === 'unused' || s.status === 'forgotten');
      if (unusedSubs.length > 0) {
        const totalWaste = unusedSubs.reduce((sum, sub) => sum + sub.amount, 0);
        insights.push({
          id: `unused_subs_${Date.now()}`,
          type: 'warning',
          title: `${unusedSubs.length} Unused Subscriptions`,
          message: `You have ${unusedSubs.length} subscriptions you haven't used recently. Consider canceling to save ${totalWaste.toFixed(2)}/month.`,
          impact: totalWaste,
          priority: totalWaste > 30 ? 'high' : 'medium',
          actionable: true,
          actions: [
            { type: 'cancel', subscriptionIds: unusedSubs.map(s => s.id) },
            { type: 'review', subscriptionIds: unusedSubs.map(s => s.id) }
          ]
        });
      }

      // Yearly discount opportunities
      const discountOpportunities = subscriptions
        .filter(s => s.status === 'active' && s.yearlyDiscount > 15)
        .filter(s => !s.billingCycle || s.billingCycle === 'monthly');
      
      if (discountOpportunities.length > 0) {
        const potentialSavings = discountOpportunities.reduce((sum, sub) => {
          return sum + (sub.amount * 12 * (sub.yearlyDiscount / 100));
        }, 0);

        insights.push({
          id: `yearly_discount_${Date.now()}`,
          type: 'tip',
          title: 'Switch to Annual Billing',
          message: `Save ${potentialSavings.toFixed(2)}/year by switching ${discountOpportunities.length} subscriptions to annual billing.`,
          impact: potentialSavings,
          priority: 'medium',
          actionable: true,
          actions: [{ type: 'switch_billing', subscriptionIds: discountOpportunities.map(s => s.id) }]
        });
      }

      // Goal progress insights
      const goalProgress = (user.totalSaved / user.savingsGoal) * 100;
      if (goalProgress >= 80) {
        insights.push({
          id: `goal_progress_${Date.now()}`,
          type: 'success',
          title: 'Great Progress!',
          message: `You're ${goalProgress.toFixed(0)}% to your savings goal! Only ${(user.savingsGoal - user.totalSaved).toFixed(2)} to go.`,
          impact: 0,
          priority: 'low',
          actionable: false
        });
      }

      // Email overload insights
      const activeEmails = emails.filter(e => !e.unsubscribed);
      const weeklyEmails = activeEmails.reduce((sum, e) => sum + e.emailsPerWeek, 0);
      
      if (weeklyEmails > 50) {
        insights.push({
          id: `email_overload_${Date.now()}`,
          type: 'warning',
          title: 'Email Overload Detected',
          message: `You receive ${weeklyEmails} promotional emails per week. Consider unsubscribing from low-priority senders.`,
          impact: weeklyEmails * 2, // 2 minutes per email
          priority: 'medium',
          actionable: true,
          actions: [{ type: 'bulk_unsubscribe', emailIds: activeEmails.filter(e => e.importance === 'low').map(e => e.id) }]
        });
      }

      return insights.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  // Helper methods
  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  calculateMedian(numbers) {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  calculateCategoryDistribution(subscriptions) {
    const distribution = {};
    subscriptions.forEach(sub => {
      distribution[sub.category] = (distribution[sub.category] || 0) + 1;
    });
    return distribution;
  }

  calculateStatusDistribution(subscriptions) {
    const distribution = {};
    subscriptions.forEach(sub => {
      distribution[sub.status] = (distribution[sub.status] || 0) + 1;
    });
    return distribution;
  }

  calculateCategorySpending(subscriptions) {
    const spending = {};
    subscriptions.forEach(sub => {
      spending[sub.category] = (spending[sub.category] || 0) + sub.amount;
    });
    return spending;
  }

  calculateMonthlyForecast(subscriptions) {
    // Simulare forecast pentru următoarele 12 luni
    const baseMonthly = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const forecast = [];
    
    for (let i = 1; i <= 12; i++) {
      // Add some realistic variance
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      forecast.push({
        month: i,
        amount: Number((baseMonthly * (1 + variance)).toFixed(2))
      });
    }
    
    return forecast;
  }

  identifySavingsOpportunities(subscriptions) {
    return subscriptions
      .filter(sub => sub.status === 'unused' || sub.status === 'forgotten' || sub.yearlyDiscount > 20)
      .map(sub => ({
        id: sub.id,
        type: sub.status === 'active' ? 'billing_optimization' : 'cancellation',
        potentialSaving: sub.status === 'active' 
          ? sub.amount * 12 * (sub.yearlyDiscount / 100)
          : sub.amount * 12,
        description: sub.status === 'active' 
          ? `Switch to annual billing for ${sub.yearlyDiscount}% discount`
          : `Cancel unused ${sub.name} subscription`
      }))
      .sort((a, b) => b.potentialSaving - a.potentialSaving);
  }

  calculateCostEfficiency(subscriptions) {
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
    const unusedSubscriptions = subscriptions.filter(s => s.status === 'unused' || s.status === 'forgotten');
    
    const totalSpend = activeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const wastedSpend = unusedSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    
    return {
      efficiency: totalSpend > 0 ? ((totalSpend - wastedSpend) / totalSpend) * 100 : 100,
      wastedPercentage: totalSpend > 0 ? (wastedSpend / (totalSpend + wastedSpend)) * 100 : 0,
      optimizationScore: this.calculateOptimizationScore(subscriptions)
    };
  }

  calculateOptimizationScore(subscriptions) {
    let score = 100;
    
    // Penalty pentru unused subscriptions
    const unusedCount = subscriptions.filter(s => s.status === 'unused' || s.status === 'forgotten').length;
    score -= unusedCount * 10;
    
    // Bonus pentru yearly discounts folosite
    const yearlyDiscountUsed = subscriptions.filter(s => s.billingCycle === 'yearly' && s.yearlyDiscount > 0).length;
    score += yearlyDiscountUsed * 5;
    
    return Math.max(0, Math.min(100, score));
  }

  calculateProjectedCompletion(remaining) {
    if (remaining <= 0) return null;
    
    const avgMonthlySavings = 50; // Estimated
    const monthsRemaining = Math.ceil(remaining / avgMonthlySavings);
    const projectedDate = new Date();
    projectedDate.setMonth(projectedDate.getMonth() + monthsRemaining);
    
    return projectedDate.toISOString().split('T')[0];
  }

  calculateMilestones(goal, current) {
    const milestones = [];
    const percentages = [25, 50, 75, 90, 100];
    
    percentages.forEach(percent => {
      const amount = (goal * percent) / 100;
      milestones.push({
        percentage: percent,
        amount: amount,
        achieved: current >= amount,
        remaining: Math.max(0, amount - current)
      });
    });
    
    return milestones;
  }

  calculateEmailCategoryBreakdown(emails) {
    const breakdown = {};
    emails.forEach(email => {
      breakdown[email.category] = (breakdown[email.category] || 0) + email.emailsPerWeek;
    });
    return breakdown;
  }

  calculateEmailImportanceDistribution(emails) {
    const distribution = { high: 0, medium: 0, low: 0 };
    emails.forEach(email => {
      distribution[email.importance] = (distribution[email.importance] || 0) + 1;
    });
    return distribution;
  }

  calculateEmailFrequencyAnalysis(emails) {
    const analysis = { daily: 0, weekly: 0, monthly: 0 };
    emails.forEach(email => {
      analysis[email.frequency] = (analysis[email.frequency] || 0) + 1;
    });
    return analysis;
  }

  // Fallback methods pentru error cases
  getDefaultSubscriptionMetrics() {
    return {
      total: 0, active: 0, unused: 0, forgotten: 0, paused: 0, cancelled: 0,
      averageAmount: 0, medianAmount: 0, categoryDistribution: {}, statusDistribution: {}
    };
  }

  getDefaultFinancialMetrics() {
    return {
      monthlySpend: 0, annualSpend: 0, potentialSavings: 0, potentialAnnualSavings: 0,
      yearlyDiscount: 0, avgSubscriptionCost: 0, monthlyForecast: [],
      categorySpending: {}, savingsOpportunities: [], costEfficiency: { efficiency: 100, wastedPercentage: 0, optimizationScore: 100 }
    };
  }

  getDefaultEmailMetrics() {
    return {
      totalSources: 0, weeklyEmails: 0, monthlyEmails: 0, timeWasted: 0, unsubscribed: 0,
      categoryBreakdown: {}, importanceDistribution: { high: 0, medium: 0, low: 0 }, frequencyAnalysis: { daily: 0, weekly: 0, monthly: 0 }
    };
  }

  getDefaultGoalMetrics() {
    return {
      progress: 0, remaining: 0, totalSaved: 0, goal: 0, isGoalMet: false,
      monthsToGoal: 0, projectedCompletion: null, milestones: []
    };
  }

  clearCache() {
    this.cache.clear();
  }
}

export const analyticsCalculator = new AnalyticsCalculator();
