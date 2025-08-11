import React, { useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, Pause, X, Play, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../ui';

const SubscriptionCard = React.memo(({ 
  subscription, 
  onCancel, 
  onPause, 
  onActivate 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    const iconProps = { className: "h-4 w-4 sm:h-5 sm:w-5", 'aria-hidden': true };
    switch (subscription.status) {
      case 'active': return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case 'unused': return <Clock {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
      case 'forgotten': return <AlertTriangle {...iconProps} className={`${iconProps.className} text-red-500`} />;
      case 'paused': return <Pause {...iconProps} className={`${iconProps.className} text-blue-500`} />;
      case 'cancelled': return <X {...iconProps} className={`${iconProps.className} text-gray-500`} />;
      default: return <Clock {...iconProps} className={`${iconProps.className} text-gray-400`} />;
    }
  };

  const getStatusColor = () => {
    switch (subscription.status) {
      case 'active': return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'unused': return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-100';
      case 'forgotten': return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100';
      case 'paused': return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'cancelled': return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100';
      default: return 'border-gray-200 bg-white';
    }
  };

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      switch (action) {
        case 'cancel': onCancel(subscription.id); break;
        case 'pause': onPause(subscription.id); break;
        case 'activate': onActivate(subscription.id); break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article 
      className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 focus-within:ring-4 focus-within:ring-blue-300 ${getStatusColor()}`}
      aria-label={`${subscription.name} subscription - ${subscription.status}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="text-2xl sm:text-3xl bg-white p-2 rounded-xl shadow-sm flex-shrink-0" 
               role="img" 
               aria-label={`${subscription.name} logo`}>
            {subscription.logo}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{subscription.name}</h3>
            <p className="text-sm text-gray-600 font-medium truncate">{subscription.category}</p>
            <div className="flex items-center space-x-2 mt-2">
              {getStatusIcon()}
              <span className="text-sm capitalize text-gray-700 font-medium">{subscription.status}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0 ml-3">
          <p className="font-bold text-lg sm:text-2xl text-gray-900" aria-label={`${subscription.amount} dollars per month`}>
            ${subscription.amount}
          </p>
          <p className="text-xs text-gray-500 font-medium">per month</p>
          {subscription.yearlyDiscount > 0 && (
            <p className="text-xs text-green-600 font-medium">Save {subscription.yearlyDiscount}% yearly</p>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Last used:</span>
          <span className="font-medium">{subscription.lastUsed}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Next billing:</span>
          <span className="font-medium">{subscription.nextBilling}</span>
        </div>
        
        {showDetails && (
          <div className="pt-2 border-t border-gray-200" role="region" aria-label="Additional subscription details">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Annual cost:</span>
              <span className="font-medium">${(subscription.amount * 12).toFixed(2)}</span>
            </div>
            {subscription.yearlyDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Yearly savings:</span>
                <span className="font-medium text-green-600">${(subscription.amount * 12 * subscription.yearlyDiscount / 100).toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 flex items-center justify-center sm:justify-start space-x-1"
          aria-expanded={showDetails}
        >
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>{showDetails ? 'Less details' : 'More details'}</span>
        </Button>
        
        {subscription.status !== 'cancelled' && (
          <div className="flex space-x-2" role="group" aria-label="Subscription actions">
            {subscription.status === 'active' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAction('pause')}
                disabled={isLoading}
                aria-label={`Pause ${subscription.name} subscription`}
              >
                <Pause className="h-4 w-4 mr-1" aria-hidden="true" />
                {isLoading ? 'Processing...' : 'Pause'}
              </Button>
            )}
            
            {subscription.status === 'paused' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => handleAction('activate')}
                disabled={isLoading}
                aria-label={`Reactivate ${subscription.name} subscription`}
              >
                <Play className="h-4 w-4 mr-1" aria-hidden="true" />
                {isLoading ? 'Processing...' : 'Reactivate'}
              </Button>
            )}
            
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleAction('cancel')}
              disabled={isLoading}
              aria-label={`Cancel ${subscription.name} subscription`}
            >
              <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
              {isLoading ? 'Cancelling...' : 'Cancel'}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
});

SubscriptionCard.displayName = 'SubscriptionCard';

export default SubscriptionCard;
