// components/features/nordigen/BankConnectionButton.jsx
import React, { useState } from 'react';
import { Building2, Loader2, CheckCircle, X } from 'lucide-react';
import { useApp } from '../../../context';

export default function BankConnectionButton() {
  const { state, actions } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select');
  const [detectedSubs, setDetectedSubs] = useState([]);

  const banks = [
    { id: 'BCR', name: 'BCR', logo: '🏦' },
    { id: 'BRD', name: 'BRD', logo: '🏛️' },
    { id: 'ING', name: 'ING Bank', logo: '🦁' },
    { id: 'BT', name: 'Banca Transilvania', logo: '🏢' },
    { id: 'REVOLUT', name: 'Revolut', logo: '💳' }
  ];

  const handleBankSelect = async (bank) => {
    setLoading(true);
    setStep('processing');
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 3000));
    
    // Mock detected subscriptions
    setDetectedSubs([
      { name: 'Netflix', amount: 15.99, logo: '🎬' },
      { name: 'Spotify', amount: 9.99, logo: '🎵' },
      { name: 'Adobe', amount: 52.99, logo: '🎨' }
    ]);
    
    setStep('complete');
    setLoading(false);
  };

  const handleImport = () => {
    // Here you would import subscriptions to state
    console.log('Importing:', detectedSubs);
    setIsOpen(false);
    setStep('select');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2 z-40"
      >
        <Building2 className="h-5 w-5" />
        <span>Connect Bank</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Connect Your Bank</h2>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'select' && (
            <div>
              <p className="text-gray-600 mb-4">Select your bank to auto-detect subscriptions:</p>
              <div className="grid grid-cols-2 gap-3">
                {banks.map(bank => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankSelect(bank)}
                    className="p-4 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="text-2xl mb-1">{bank.logo}</div>
                    <div className="text-sm font-medium">{bank.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Analyzing your transactions...</p>
            </div>
          )}

          {step === 'complete' && (
            <div>
              <div className="text-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Found {detectedSubs.length} subscriptions!</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                {detectedSubs.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{sub.logo}</span>
                      <span className="font-medium">{sub.name}</span>
                    </div>
                    <span className="font-semibold">€{sub.amount}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleImport}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Import All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
