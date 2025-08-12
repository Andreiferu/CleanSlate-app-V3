import React, { useMemo } from 'react';
import { Search, Filter, Mail, Clock, Trash2 } from 'lucide-react';
import { useEmails } from '../../../hooks';
import { useApp } from '../../../context';
import EmailCard from './EmailCard';
import { StatCard } from '../../ui';

const EmailsTab = React.memo(() => {
  const { state, dispatch } = useApp();
  const { emails, ui } = state;
  const { searchTerm, filterStatus } = ui;

  const emailMetrics = useMemo(() => {
    const activeEmails = emails.filter(e => !e.unsubscribed);
    const weeklyEmails = activeEmails.reduce((sum, e) => sum + e.emailsPerWeek, 0);
    const timeWasted = weeklyEmails * 1.5; // 1.5 minutes per email
    const unsubscribedCount = emails.filter(e => e.unsubscribed).length;

    return {
      totalSources: emails.length,
      activeEmails: activeEmails.length,
      weeklyEmails,
      timeWasted: Math.round(timeWasted),
      unsubscribedCount,
      potentialTimeSaved: emails.filter(e => e.importance === 'low' && !e.unsubscribed)
        .reduce((sum, e) => sum + (e.emailsPerWeek * 1.5), 0)
    };
  }, [emails]);

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      const matchesSearch = email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           email.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'subscribed' && !email.unsubscribed) ||
                           (filterStatus === 'unsubscribed' && email.unsubscribed) ||
                           (filterStatus === email.importance);
      return matchesSearch && matchesFilter;
    });
  }, [emails, searchTerm, filterStatus]);

  const handleUnsubscribe = (id) => {
    dispatch({ 
      type: 'UPDATE_EMAIL', 
      payload: { id, updates: { unsubscribed: true } }
    });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        message: 'Successfully unsubscribed! You\'ll save time on email management.',
        type: 'success'
      }
    });
  };

  const handleResubscribe = (id) => {
    dispatch({ 
      type: 'UPDATE_EMAIL', 
      payload: { id, updates: { unsubscribed: false } }
    });
  };

  const handleArchive = (id) => {
    dispatch({ 
      type: 'UPDATE_EMAIL', 
      payload: { id, updates: { archived: true } }
    });
  };

  const handleBulkUnsubscribe = () => {
    const lowPriorityEmails = emails.filter(e => e.importance === 'low' && !e.unsubscribed);
    lowPriorityEmails.forEach(email => {
      dispatch({ 
        type: 'UPDATE_EMAIL', 
        payload: { id: email.id, updates: { unsubscribed: true } }
      });
    });
    
    if (lowPriorityEmails.length > 0) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          message: `Bulk unsubscribed from ${lowPriorityEmails.length} low-priority emails!`,
          type: 'success'
        }
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Email Metrics */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title="Time Saved Potential" 
            value={`${Math.round(emailMetrics.potentialTimeSaved)} min`}
            subtitle="Weekly time savings available"
            icon={Clock} 
            className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600" 
          />
          <StatCard 
            title="Weekly Email Overload" 
            value={emailMetrics.weeklyEmails}
            subtitle={`${emailMetrics.timeWasted} minutes wasted`}
            icon={Mail} 
            className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600" 
          />
          <StatCard 
            title="Active Sources" 
            value={emailMetrics.activeEmails}
            subtitle={`${emailMetrics.totalSources} total sources`}
            icon={Filter} 
            className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600" 
          />
          <StatCard 
            title="Cleaned Up" 
            value={emailMetrics.unsubscribedCount}
            subtitle="Unsubscribed sources"
            icon={Trash2} 
            className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600" 
          />
        </div>
      </section>

      {/* Bulk Actions */}
      {emails.filter(e => e.importance === 'low' && !e.unsubscribed).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Quick Cleanup Available</h3>
              <p className="text-yellow-700 text-sm">
                You have {emails.filter(e => e.importance === 'low' && !e.unsubscribed).length} low-priority 
                email sources that could save you {Math.round(emailMetrics.potentialTimeSaved)} minutes per week.
              </p>
            </div>
            <Button
              onClick={handleBulkUnsubscribe}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Bulk Unsubscribe
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search email sources..."
                value={searchTerm}
                onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => dispatch({ type: 'SET_FILTER_STATUS', payload: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sources</option>
              <option value="subscribed">Subscribed</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Email Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmails.map(email => (
          <EmailCard
            key={email.id}
            email={email}
            onUnsubscribe={handleUnsubscribe}
            onResubscribe={handleResubscribe}
            onArchive={handleArchive}
          />
        ))}
      </div>

      {filteredEmails.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No email sources found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
});

EmailsTab.displayName = 'EmailsTab';

export default EmailsTab;
