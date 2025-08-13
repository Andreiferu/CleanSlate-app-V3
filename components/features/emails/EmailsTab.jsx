import React, { useState, useMemo } from 'react';
import { Search, Filter, Mail, Clock, Trash2, Archive, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useEmails } from '../../../hooks';
import EmailCard from './EmailCard';
import { Button } from '../../ui';

const EmailsTab = React.memo(() => {
  const {
    emails,
    activeEmails,
    unsubscribedEmails,
    priorityEmails,
    emailStats,
    unsubscribeEmail,
    resubscribeEmail,
    archiveEmail
  } = useEmails();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterImportance, setFilterImportance] = useState('all');
  const [sortBy, setSortBy] = useState('emailsPerWeek');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState(new Set());

  // Filtered and sorted emails
  const filteredEmails = useMemo(() => {
    let filtered = emails.filter(email => {
      const matchesSearch = email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           email.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           email.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || 
                         (filterType === 'active' && !email.unsubscribed) ||
                         (filterType === 'unsubscribed' && email.unsubscribed);
      
      const matchesImportance = filterImportance === 'all' || email.importance === filterImportance;
      
      return matchesSearch && matchesType && matchesImportance;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'emailsPerWeek': return b.emailsPerWeek - a.emailsPerWeek;
        case 'sender': return a.sender.localeCompare(b.sender);
        case 'category': return a.category.localeCompare(b.category);
        case 'importance': 
          const importanceOrder = { high: 3, medium: 2, low: 1 };
          return importanceOrder[b.importance] - importanceOrder[a.importance];
        default: return 0;
      }
    });
  }, [emails, searchTerm, filterType, filterImportance, sortBy]);

  // Quick stats
  const quickStats = useMemo(() => {
    const activeCount = activeEmails.length;
    const unsubscribedCount = unsubscribedEmails.length;
    const highVolumeCount = activeEmails.filter(email => email.emailsPerWeek > 7).length;
    const lowImportanceCount = activeEmails.filter(email => email.importance === 'low').length;
    
    return {
      activeCount,
      unsubscribedCount,
      highVolumeCount,
      lowImportanceCount,
      totalWeeklyEmails: emailStats.totalWeeklyEmails,
      totalTimeWasted: emailStats.totalTimeWasted
    };
  }, [activeEmails, unsubscribedEmails, emailStats]);

  // Bulk actions
  const handleSelectEmail = (emailId) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId);
    } else {
      newSelected.add(emailId);
    }
    setSelectedEmails(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEmails.size === filteredEmails.length) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(filteredEmails.map(email => email.id)));
    }
  };

  const handleBulkUnsubscribe = async () => {
    for (const emailId of selectedEmails) {
      await unsubscribeEmail(emailId);
    }
    setSelectedEmails(new Set());
    setShowBulkActions(false);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Quick Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Cleanup</h1>
            <p className="text-gray-600">Manage your email subscriptions and reduce digital clutter</p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex space-x-3 mt-4 lg:mt-0">
            <Button
              variant="success"
              size="sm"
              onClick={() => setFilterType('all')}
              className="whitespace-nowrap"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              View All
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => setFilterImportance('low')}
              className="whitespace-nowrap"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Low Priority
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{quickStats.activeCount}</div>
            <div className="text-sm text-blue-700">Active Subscriptions</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{quickStats.unsubscribedCount}</div>
            <div className="text-sm text-green-700">Unsubscribed</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{quickStats.totalWeeklyEmails}</div>
            <div className="text-sm text-orange-700">Weekly Emails</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{formatTime(quickStats.totalTimeWasted)}</div>
            <div className="text-sm text-red-700">Time Wasted/Week</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by sender, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>

            <select
              value={filterImportance}
              onChange={(e) => setFilterImportance(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Importance</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="emailsPerWeek">Sort by Volume</option>
              <option value="sender">Sort by Sender</option>
              <option value="category">Sort by Category</option>
              <option value="importance">Sort by Importance</option>
            </select>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowBulkActions(!showBulkActions)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Bulk Actions
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedEmails.size === filteredEmails.length && filteredEmails.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  {selectedEmails.size} of {filteredEmails.length} selected
                </span>
              </div>
              
              {selectedEmails.size > 0 && (
                <div className="flex space-x-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleBulkUnsubscribe}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Unsubscribe Selected
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Priority Recommendations */}
      {priorityEmails.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="font-bold text-yellow-800">🎯 Priority Cleanup Recommendations</h3>
              <p className="text-sm text-yellow-700">
                These high-volume, low-importance emails are wasting the most time
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorityEmails.slice(0, 3).map(email => (
              <div key={email.id} className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{email.logo}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{email.sender}</h4>
                    <p className="text-sm text-gray-600">{email.emailsPerWeek} emails/week</p>
                    <p className="text-xs text-orange-600">
                      Wastes {formatTime(email.emailsPerWeek * 1.5)}/week
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={() => unsubscribeEmail(email.id)}
                  >
                    Unsubscribe
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmails.map(email => (
          <div key={email.id} className="relative">
            {showBulkActions && (
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedEmails.has(email.id)}
                  onChange={() => handleSelectEmail(email.id)}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 bg-white"
                />
              </div>
            )}
            <EmailCard
              email={email}
              onUnsubscribe={unsubscribeEmail}
              onResubscribe={resubscribeEmail}
              onArchive={archiveEmail}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEmails.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No emails found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' || filterImportance !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Your email list is empty.'}
          </p>
          {(searchTerm || filterType !== 'all' || filterImportance !== 'all') && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterImportance('all');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Summary Card */}
      {filteredEmails.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{filteredEmails.length}</div>
              <div className="text-sm text-blue-700">Email Subscriptions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatTime(filteredEmails.reduce((sum, email) => sum + (email.emailsPerWeek * 1.5), 0))}
              </div>
              <div className="text-sm text-green-700">Potential Time Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {filteredEmails.filter(email => !email.unsubscribed && email.importance === 'low').length}
              </div>
              <div className="text-sm text-purple-700">Quick Win Opportunities</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

EmailsTab.displayName = 'EmailsTab';

export default EmailsTab;
