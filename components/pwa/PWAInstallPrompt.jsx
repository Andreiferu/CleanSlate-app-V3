import React from 'react';
import { X } from 'lucide-react';

const PWAInstallPrompt = React.memo(({ onInstall, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="text-2xl">📱</div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm">Install CleanSlate v3</h4>
            <p className="text-xs opacity-90">Add to your home screen for quick access!</p>
          </div>
        </div>
        <div className="flex space-x-2 flex-shrink-0 ml-3">
          <button
            onClick={onInstall}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Install
          </button>
          <button
            onClick={onDismiss}
            className="text-white hover:bg-white/20 p-1 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

PWAInstallPrompt.displayName = 'PWAInstallPrompt';

export default PWAInstallPrompt;
