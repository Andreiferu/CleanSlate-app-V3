import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      console.log('PWA install prompt ready');
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!promptInstall) {
      setShowInstructions(true);
      return;
    }
    
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setPromptInstall(null);
  };

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Install Button - Floating */}
      <button
        onClick={installApp}
        className="fixed bottom-20 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2 z-40 animate-pulse"
      >
        <Download className="h-5 w-5" />
        <span>Install App</span>
      </button>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Install CleanSlate</h3>
              <button onClick={() => setShowInstructions(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center mb-4">
              <Smartphone className="h-16 w-16 text-blue-600 mx-auto mb-3" />
            </div>

            {isIOS() ? (
              <div className="space-y-3">
                <h4 className="font-semibold">For iPhone/iPad:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Tap the Share button <span className="inline-block">⬆️</span> in Safari</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right corner</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3">
                <h4 className="font-semibold">For Android:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Tap the menu button (3 dots) in Chrome</li>
                  <li>Tap "Install app" or "Add to Home screen"</li>
                  <li>Follow the prompts to install</li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
