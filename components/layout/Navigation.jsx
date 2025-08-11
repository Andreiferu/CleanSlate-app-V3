import React from 'react';
import { Home as HomeIcon, CreditCard, Mail, BarChart3 } from 'lucide-react';
import { useApp } from '../../context';

const Navigation = React.memo(() => {
  const { state, actions } = useApp();
  const { activeTab } = state.ui;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'emails', label: 'Email Cleanup', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-16 sm:top-20 z-40"
         role="navigation"
         aria-label="Main navigation">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto px-3 sm:px-6 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => actions.setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-3 px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap min-w-[80px] sm:min-w-0 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  isActive 
                    ? 'border-blue-500 text-blue-600 bg-gradient-to-t from-blue-50 to-transparent rounded-t-lg shadow-sm' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 rounded-t-lg active:scale-95'
                }`}
                role="tab"
                aria-selected={isActive}
                aria-label={`Navigate to ${tab.label}`}
              >
                <Icon className="h-4 w-4 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="mt-1 sm:mt-0">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
