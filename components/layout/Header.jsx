import React from 'react';
import { useApp } from '../../context';

const Header = React.memo(() => {
  const { state } = useApp();
  const { user, pwa } = state;

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              CleanSlate v3
            </h1>
            <span className="hidden sm:inline-block text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
              Modular Architecture
            </span>
            {pwa.isInstalled && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium"
                    role="status" 
                    aria-label="App is installed">
                📱 App
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-6">
            {/* Desktop user info */}
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-600 font-medium">
                Welcome back, <span className="text-gray-900">{user.name}</span>
              </p>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-xs text-green-600 font-bold" aria-label={`Total saved: ${user.totalSaved} dollars`}>
                  💰 Saved: ${user.totalSaved}
                </p>
                <p className="text-xs text-blue-600 font-bold" aria-label={`Savings goal: ${user.savingsGoal} dollars`}>
                  🎯 Goal: ${user.savingsGoal}
                </p>
              </div>
            </div>
            
            {/* Mobile user info */}
            <div className="md:hidden text-right">
              <p className="text-xs text-green-600 font-bold">${user.totalSaved} saved</p>
              <p className="text-xs text-blue-600 font-bold">
                {Math.round((user.totalSaved / user.savingsGoal) * 100)}% goal
              </p>
            </div>
            
            {/* User avatar */}
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg"
                 role="img"
                 aria-label={`User avatar for ${user.name}`}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
