import { useMemo } from 'react';
import { useApp } from '../context';

export function useSubscriptions() {
  const { state, actions } = useApp();
  const { subscriptions, ui } = state;
  const { searchTerm, filterStatus, sortBy } = ui;

  // Filtered and sorted subscriptions
  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sub.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount': return b.amount - a.amount;
        case 'name': return a.name.localeCompare(b.name);
        case 'status': return a.status.localeCompare(b.status);
        case 'category': return a.category.localeCompare(b.category);
        default: return 0;
      }
    });
  }, [subscriptions, searchTerm, filterStatus, sortBy]);

  // Priority subscriptions (unused/forgotten)
  const prioritySubscriptions = useMemo(() => {
    return subscriptions
      .filter(s => s.status === 'unused' || s.status === 'forgotten')
      .sort((a, b) => b.amount - a.amount);
  }, [subscriptions]);

  return {
    subscriptions,
    filteredSubscriptions,
    prioritySubscriptions,
    // Actions
    cancelSubscription: actions.cancelSubscription,
    pauseSubscription: actions.pauseSubscription,
    activateSubscription: actions.activateSubscription,
    // Filters
    searchTerm,
    filterStatus,
    sortBy,
    setSearchTerm: actions.setSearchTerm,
    setFilterStatus: actions.setFilterStatus,
    setSortBy: actions.setSortBy
  };
}
