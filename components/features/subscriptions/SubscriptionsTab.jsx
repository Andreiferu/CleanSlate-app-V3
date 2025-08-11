import React from 'react';
import { Search } from 'lucide-react';
import { useSubscriptions } from '../../../hooks';
import SubscriptionCard from './SubscriptionCard';

const SubscriptionsTab = React.memo(() => {
  const {
    filteredSubscriptions,
    searchTerm,
    filterStatus,
    sortBy,
    setSearchTerm,
    setFilterStatus,
    setSortBy,
    cancelSubscription,
    pauseSubscription,
    activateSubscription
  } = useSubscriptions();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Filter Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="unused">Unused</option>
              <option value="forgotten">Forgotten</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="amount">Sort by Amount</option>
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubscriptions.map(subscription => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onCancel={cancelSubscription}
            onPause={pauseSubscription}
            onActivate={activateSubscription}
          />
        ))}
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subscriptions found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
});

SubscriptionsTab.displayName = 'SubscriptionsTab';

export default SubscriptionsTab;
