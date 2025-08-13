import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Mail, Target, Clock, BarChart3, PieChart, Calendar, Download } from 'lucide-react';
import { useAnalytics, useSubscriptions, useEmails } from '../../../hooks';
import { StatCard, Button } from '../../ui';

const AnalyticsTab = React.memo(() => {
  const { analytics, formatCurrency, formatPercentage, formatTime } = useAnalytics();
  const { subscriptions } = useSubscriptions();
  const { emails, emailStats } = useEmails();
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedView, setSelectedView] = useState('overview');

  // Mock historical data pentru grafice
  const mockHistoricalData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    return {
      savings: months.map((month, i) => ({
        month,
        amount: 45 + (i * 8) + Math.random() * 10,
        subscriptions: 12 + Math.floor(Math.random() * 5)
      })),
      emails: months.map((month, i) => ({
        month,
        volume: 150 - (i * 5) + Math.random() * 20,
        unsubscribed: i * 2 + Math.random() * 3
      })),
      categories: [
        { name: 'Entertainment', spend: 45.97, subscriptions: 3, color: '#3B82F6' },
        { name: 'Software', spend: 65.98, subscriptions: 2, color: '#8B5CF6' },
        { name: 'Music', spend: 9.99, subscriptions: 1, color: '#10B981' },
        { name: 'Professional', spend: 29.99, subscriptions: 1, color: '#F59E0B' },
        { name: 'Design', spend: 12.99, subscriptions: 1, color: '#EF4444' }
      ]
    };
  }, []);

  // Insights și recomandări
  const insights = useMemo(() => [
    {
      id: 1,
      type: 'success',
      icon: TrendingUp,
      title: 'Great Progress!',
      description: `You're ${analytics.goals.progress}% towards your savings goal. Keep it up!`,
      action: 'View Goal Details',
      color: 'green'
    },
    {
      id: 2,
      type: 'warning',
      icon: DollarSign,
      title: 'High Potential Savings',
      description: `${formatCurrency(analytics.financial.potentialSavings)} could be saved by canceling unused subscriptions.`,
      action: 'Review Subscriptions',
      color: 'orange'
    },
    {
      id: 3,
      type: 'info',
      icon: Mail,
      title: 'Email Overload',
      description: `${analytics.emails.weeklyEmails} weekly emails could be reduced by 60% with smart unsubscribing.`,
      action: 'Clean Emails',
      color: 'blue'
    },
    {
      id: 4,
      type: 'tip',
      icon: Target,
      title: 'Optimization Tip',
      description: 'Consider annual plans for active subscriptions to save 15-20% yearly.',
      action: 'See Recommendations',
      color: 'purple'
    }
  ], [analytics, formatCurrency]);

  // Chart components (simplified pentru demo)
  const SimpleBarChart = ({ data, dataKey, color = '#3B82F6' }) => (
    <div className="flex items-end space-x-2 h-32">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="w-full rounded-t transition-all duration-500 hover:opacity-75"
            style={{ 
              height: `${(item[dataKey] / Math.max(...data.map(d => d[dataKey]))) * 100}%`,
              backgroundColor: color,
              minHeight: '8px'
            }}
          />
          <span className="text-xs text-gray-500 mt-1">{item.month}</span>
        </div>
      ))}
    </div>
  );

  const SimplePieChart = ({ data }) => (
    <div className="grid grid-cols-1 gap-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm text-gray-600">{formatCurrency(item.spend)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(item.spend / Math.max(...data.map(d => d.spend))) * 100}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const exportData = () => {
    const data = {
      summary: {
        totalSavings: analytics.financial.potentialSavings,
        monthlySpend: analytics.financial.monthlySpend,
        emailVolume: analytics.emails.weeklyEmails,
        goalProgress: analytics.goals.progress
      },
      subscriptions: subscriptions.map(sub => ({
        name: sub.name,
        amount: sub.amount,
        status: sub.status,
        category: sub.category
      })),
      emails: emails.map(email => ({
        sender: email.sender,
        category: email.category,
        weeklyVolume: email.emailsPerWeek,
        importance: email.importance
      })),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleanslate-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your savings progress and optimization opportunities</p>
          </div>
          
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <Button variant="secondary" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-1" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Potential Savings" 
          value={formatCurrency(analytics.financial.potentialSavings)}
          subtitle="Per month from optimization"
          icon={DollarSign} 
          className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white border-0" 
          trend={analytics.trends.savings}
        />
        <StatCard 
          title="Current Monthly Spend" 
          value={formatCurrency(analytics.financial.monthlySpend)}
          subtitle={`${formatCurrency(analytics.financial.annualSpend)} annually`}
          icon={BarChart3} 
          className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white border-0" 
          trend={analytics.trends.spending}
        />
        <StatCard 
          title="Weekly Email Volume" 
          value={`${analytics.emails.weeklyEmails}`}
          subtitle={`${formatTime(analytics.emails.timeWasted.weekly)} wasted weekly`}
          icon={Mail} 
          className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 text-white border-0" 
          trend={analytics.trends.emails}
        />
        <StatCard 
          title="Savings Goal Progress" 
          value={`${analytics.goals.progress}%`}
          subtitle={`${formatCurrency(analytics.goals.remaining)} remaining`}
          icon={Target} 
          className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 text-white border-0" 
          trend={analytics.trends.goal}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Trend */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Savings Trend</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <SimpleBarChart 
            data={mockHistoricalData.savings} 
            dataKey="amount" 
            color="#10B981"
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Average monthly savings: <span className="font-semibold text-green-600">
                {formatCurrency(mockHistoricalData.savings.reduce((sum, item) => sum + item.amount, 0) / mockHistoricalData.savings.length)}
              </span>
            </p>
          </div>
        </div>

        {/* Email Volume Trend */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Email Volume Reduction</h3>
            <TrendingDown className="h-5 w-5 text-blue-500" />
          </div>
          <SimpleBarChart 
            data={mockHistoricalData.emails} 
            dataKey="volume" 
            color="#3B82F6"
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total emails unsubscribed: <span className="font-semibold text-blue-600">
                {Math.round(mockHistoricalData.emails.reduce((sum, item) => sum + item.unsubscribed, 0))}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Spending by Category</h3>
          <PieChart className="h-5 w-5 text-purple-500" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SimplePieChart data={mockHistoricalData.categories} />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Category Insights</h4>
            {mockHistoricalData.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <div className="text-sm text-gray-600">
                      {category.subscriptions} subscription{category.subscriptions !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(category.spend)}</div>
                  <div className="text-sm text-gray-600">
                    {formatPercentage((category.spend / mockHistoricalData.categories.reduce((sum, cat) => sum + cat.spend, 0)) * 100, 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">AI Insights & Recommendations</h3>
          <div className="flex space-x-2">
            <Button
              variant={selectedView === 'overview' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedView('overview')}
            >
              Overview
            </Button>
            <Button
              variant={selectedView === 'detailed' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedView('detailed')}
            >
              Detailed
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight) => {
            const IconComponent = insight.icon;
            const colorClasses = {
              green: 'bg-green-50 border-green-200 text-green-800',
              orange: 'bg-orange-50 border-orange-200 text-orange-800',
              blue: 'bg-blue-50 border-blue-200 text-blue-800',
              purple: 'bg-purple-50 border-purple-200 text-purple-800'
            };

            return (
              <div key={insight.id} className={`border rounded-xl p-4 ${colorClasses[insight.color]}`}>
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-white/80">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm mb-3 opacity-90">{insight.description}</p>
                    <Button variant="ghost" size="xs" className="text-xs">
                      {insight.action} →
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Analytics */}
      {selectedView === 'detailed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription Analytics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Subscription Breakdown</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active</span>
                <span className="font-medium">{subscriptions.filter(s => s.status === 'active').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unused</span>
                <span className="font-medium text-yellow-600">{subscriptions.filter(s => s.status === 'unused').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Forgotten</span>
                <span className="font-medium text-red-600">{subscriptions.filter(s => s.status === 'forgotten').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Paused</span>
                <span className="font-medium text-blue-600">{subscriptions.filter(s => s.status === 'paused').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="font-medium text-gray-600">{subscriptions.filter(s => s.status === 'cancelled').length}</span>
              </div>
            </div>
          </div>

          {/* Email Analytics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Email Efficiency</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Priority</span>
                <span className="font-medium text-green-600">
                  {emails.filter(e => e.importance === 'high').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medium Priority</span>
                <span className="font-medium text-yellow-600">
                  {emails.filter(e => e.importance === 'medium').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Low Priority</span>
                <span className="font-medium text-red-600">
                  {emails.filter(e => e.importance === 'low').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Time Wasted</span>
                <span className="font-medium">{formatTime(emailStats.totalTimeWasted)}/week</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unsubscribed</span>
                <span className="font-medium text-gray-600">{emailStats.unsubscribed}</span>
              </div>
            </div>
          </div>

          {/* Goals & Progress */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Progress Tracking</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Savings Goal</span>
                  <span className="font-medium">{analytics.goals.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, parseFloat(analytics.goals.progress))}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatCurrency(analytics.goals.savedSoFar)} of {formatCurrency(analytics.goals.goalAmount)}
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Monthly Targets</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subscription Review</span>
                    <span className="text-green-600">✓ Complete</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Email Cleanup</span>
                    <span className="text-yellow-600">⏳ In Progress</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Savings Goal</span>
                    <span className="text-blue-600">🎯 On Track</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-blue-900 mb-2">🎉 Your CleanSlate Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(analytics.financial.potentialSavings)}</div>
              <div className="text-sm text-blue-700">Monthly Savings Potential</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{analytics.emails.weeklyEmails}</div>
              <div className="text-sm text-green-700">Emails per Week</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{formatTime(emailStats.totalTimeWasted)}</div>
              <div className="text-sm text-purple-700">Time Reclaimed Weekly</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{analytics.goals.progress}%</div>
              <div className="text-sm text-orange-700">Goal Achievement</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/80 rounded-xl">
            <p className="text-sm text-gray-700">
              <strong>Keep it up!</strong> You're making excellent progress in decluttering your digital life. 
              Your consistent efforts are paying off with real savings and time reclaimed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

AnalyticsTab.displayName = 'AnalyticsTab';

export default AnalyticsTab;
