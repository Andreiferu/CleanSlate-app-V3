import React, { useMemo } from 'react';
import { useAnalytics, useSubscriptions } from '../../../hooks';
import { useApp } from '../../../context';
import { 
  BarChart3, PieChart, TrendingUp, DollarSign, Clock, 
  Users, Target, Zap, Award, AlertCircle 
} from 'lucide-react';
import { StatCard } from '../../ui';

// Simple Chart Components (pentru că nu avem externe disponibile)
const PieChartComponent = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-900">{title}</h3>
      <div className="flex items-center space-x-6">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 42 42" className="w-32 h-32 transform -rotate-90">
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="3"/>
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const offset = 100 - cumulativePercentage;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth="3"
                  strokeDasharray={`${percentage} ${100 - percentage}`}
                  strokeDashoffset={offset}
                  className="transition-all duration-300 hover:stroke-width-4"
                />
              );
            })}
          </svg>
        </div>
        <div className="flex-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600">{item.name}</span>
              <span className="text-sm font-medium text-gray-900">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500">
                (${item.value.toFixed(2)})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BarChartComponent = ({ data, title, yAxisLabel }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-900">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const color = index % 2 === 0 ? 'bg-blue-500' : 'bg-indigo-500';
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name}</span>
                <span className="font-medium text-gray-900">
                  {yAxisLabel === '$' ? `$${item.value.toFixed(2)}` : item.value}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${color} transition-all duration-500 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TrendLineComponent = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
      <h3 className="font-bold text-lg mb-4 text-gray-900">{title}</h3>
      <div className="relative h-32 bg-gradient-to-t from-blue-50 to-transparent rounded-lg p-4">
        <svg className="w-full h-full" viewBox="0 0 300 100">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="300"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Trend line */}
          <polyline
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * 300;
              const y = 100 - ((item.value - minValue) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="transition-all duration-500"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 300;
            const y = 100 - ((item.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                className="transition-all duration-300 hover:r-6"
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsTab = React.memo(() => {
  const { state } = useApp();
  const { subscriptions, emails } = state;
  const { analytics } = useAnalytics(subscriptions, emails, state.user);

  // Prepare chart data
  const categorySpendingData = useMemo(() => {
    const categorySpending = {};
    subscriptions.filter(s => s.status === 'active').forEach(sub => {
      categorySpending[sub.category] = (categorySpending[sub.category] || 0) + sub.amount;
    });
    
    return Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [subscriptions]);

  const statusDistributionData = useMemo(() => {
    const statusCounts = {};
    subscriptions.forEach(sub => {
      statusCounts[sub.status] = (statusCounts[sub.status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      value 
    }));
  }, [subscriptions]);

  const monthlyTrendData = useMemo(() => {
    // Simulate 6-month trend
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseSpend = parseFloat(analytics.financial.monthlySpend);
    
    return months.map((month, index) => ({
      label: month,
      value: baseSpend + (Math.random() - 0.5) * 20 // Add some variance
    }));
  }, [analytics.financial.monthlySpend]);

  const emailCategoryData = useMemo(() => {
    const categoryCount = {};
    emails.filter(e => !e.unsubscribed).forEach(email => {
      categoryCount[email.category] = (categoryCount[email.category] || 0) + email.emailsPerWeek;
    });
    
    return Object.entries(categoryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [emails]);

  const savingsOpportunities = useMemo(() => {
    const unused = subscriptions.filter(s => s.status === 'unused' || s.status === 'forgotten');
    const yearlyDiscounts = subscriptions.filter(s => s.status === 'active' && s.yearlyDiscount > 15);
    
    const opportunities = [
      {
        type: 'Cancel Unused',
        amount: unused.reduce((sum, sub) => sum + sub.amount, 0),
        count: unused.length,
        description: 'Cancel subscriptions you don\'t use',
        priority: 'high'
      },
      {
        type: 'Switch to Annual',
        amount: yearlyDiscounts.reduce((sum, sub) => sum + (sub.amount * 12 * sub.yearlyDiscount / 100), 0),
        count: yearlyDiscounts.length,
        description: 'Switch to annual billing for discounts',
        priority: 'medium'
      }
    ].filter(opp => opp.count > 0);
    
    return opportunities;
  }, [subscriptions]);

  const insights = useMemo(() => {
    const totalMonthly = parseFloat(analytics.financial.monthlySpend);
    const potentialSavings = parseFloat(analytics.financial.potentialSavings);
    const emailOverload = analytics.emails.weeklyEmails;
    
    return [
      {
        title: 'Spending Analysis',
        value: `${totalMonthly.toFixed(2)}/month`,
        insight: totalMonthly > 100 ? 'Above average for subscription spending' : 'Reasonable subscription budget',
        color: totalMonthly > 100 ? 'text-red-600' : 'text-green-600',
        icon: DollarSign
      },
      {
        title: 'Optimization Score',
        value: `${Math.round(((totalMonthly - potentialSavings) / totalMonthly) * 100)}%`,
        insight: potentialSavings > 50 ? 'High optimization potential' : 'Well-optimized subscriptions',
        color: potentialSavings > 50 ? 'text-orange-600' : 'text-green-600',
        icon: Target
      },
      {
        title: 'Email Efficiency',
        value: `${emailOverload} emails/week`,
        insight: emailOverload > 50 ? 'Email overload detected' : 'Manageable email volume',
        color: emailOverload > 50 ? 'text-red-600' : 'text-green-600',
        icon: Clock
      }
    ];
  }, [analytics]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title="Total Monthly Spend" 
            value={`${analytics.financial.monthlySpend}`}
            subtitle={`${analytics.financial.annualSpend} annually`}
            icon={DollarSign} 
            className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" 
          />
          <StatCard 
            title="Optimization Potential" 
            value={`${analytics.financial.potentialSavings}`}
            subtitle="Monthly savings available"
            icon={Target} 
            className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600" 
          />
          <StatCard 
            title="Active Subscriptions" 
            value={subscriptions.filter(s => s.status === 'active').length}
            subtitle={`${subscriptions.length} total managed`}
            icon={Users} 
            className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600" 
          />
          <StatCard 
            title="Email Sources" 
            value={emails.filter(e => !e.unsubscribed).length}
            subtitle={`${analytics.emails.weeklyEmails} weekly emails`}
            icon={Clock} 
            className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600" 
          />
        </div>
      </section>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent 
          data={categorySpendingData} 
          title="Spending by Category" 
        />
        
        <BarChartComponent 
          data={statusDistributionData} 
          title="Subscription Status Distribution" 
          yAxisLabel="#"
        />
        
        <TrendLineComponent 
          data={monthlyTrendData} 
          title="Monthly Spending Trend" 
        />
        
        <BarChartComponent 
          data={emailCategoryData} 
          title="Email Volume by Category" 
          yAxisLabel="emails/week"
        />
      </div>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <insight.icon className="h-6 w-6 text-blue-500" />
              <h3 className="font-bold text-lg text-gray-900">{insight.title}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">{insight.value}</p>
            <p className={`text-sm font-medium ${insight.color}`}>{insight.insight}</p>
          </div>
        ))}
      </div>

      {/* Savings Opportunities */}
      {savingsOpportunities.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
            <Zap className="h-6 w-6 text-yellow-500 mr-2" />
            Savings Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsOpportunities.map((opportunity, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl border-l-4 ${
                  opportunity.priority === 'high' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{opportunity.type}</h4>
                  <span className="text-2xl font-bold text-green-600">
                    ${opportunity.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{opportunity.description}</p>
                <p className="text-xs text-gray-500">
                  {opportunity.count} item{opportunity.count > 1 ? 's' : ''} affected
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Reports */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
        <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-6 w-6 text-blue-500 mr-2" />
          Detailed Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cost per Category */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Average Cost by Category</h4>
            {categorySpendingData.map((category, index) => {
              const categoryCount = subscriptions.filter(s => 
                s.category === category.name && s.status === 'active'
              ).length;
              const avgCost = category.value / categoryCount;
              
              return (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{category.name}</span>
                  <span className="font-medium">${avgCost.toFixed(2)}/sub</span>
                </div>
              );
            })}
          </div>

          {/* Email Time Analysis */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Time Wasted by Email Type</h4>
            {['promotional', 'newsletter', 'notification'].map(type => {
              const typeEmails = emails.filter(e => e.type === type && !e.unsubscribed);
              const weeklyTime = typeEmails.reduce((sum, e) => sum + e.emailsPerWeek, 0) * 1.5;
              
              return (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{type}</span>
                  <span className="font-medium">{weeklyTime.toFixed(1)} min/week</span>
                </div>
              );
            })}
          </div>

          {/* ROI Analysis */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Value Score by Service</h4>
            {subscriptions
              .filter(s => s.status === 'active')
              .map(sub => {
                // Simple value score: lower cost + recent usage = higher score
                const costScore = (50 - Math.min(sub.amount, 50)) / 50;
                const usageScore = sub.lastUsed.includes('hour') || sub.lastUsed.includes('Today') ? 1 : 
                                 sub.lastUsed.includes('day') ? 0.8 : 0.3;
                const valueScore = (costScore + usageScore) / 2;
                
                return { name: sub.name, score: valueScore };
              })
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium">
                    {(item.score * 100).toFixed(0)}% value
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
});

AnalyticsTab.displayName = 'AnalyticsTab';

export default AnalyticsTab;
