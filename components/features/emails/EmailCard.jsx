import React, { useState } from 'react';
import { Mail, Trash2, Archive, Star, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from '../../ui';

const EmailCard = React.memo(({ email, onUnsubscribe, onResubscribe, onArchive }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getFrequencyIcon = () => {
    switch (email.frequency) {
      case 'daily': return <Clock className="h-4 w-4 text-red-500" />;
      case 'weekly': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'monthly': return <Clock className="h-4 w-4 text-green-500" />;
      default: return <Mail className="h-4 w-4 text-gray-400" />;
    }
  };

  const getImportanceColor = () => {
    switch (email.importance) {
      case 'high': return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'medium': return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-100';
      case 'low': return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100';
      default: return 'border-gray-200 bg-white';
    }
  };

  const handleAction = async (action) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    switch (action) {
      case 'unsubscribe': onUnsubscribe(email.id); break;
      case 'resubscribe': onResubscribe(email.id); break;
      case 'archive': onArchive(email.id); break;
    }
    setIsLoading(false);
  };

  const calculateTimeWasted = () => {
    const minutesPerEmail = 1.5;
    const weeklyTime = email.emailsPerWeek * minutesPerEmail;
    const monthlyTime = weeklyTime * 4.33;
    return { weekly: weeklyTime.toFixed(1), monthly: monthlyTime.toFixed(1) };
  };

  const timeWasted = calculateTimeWasted();

  return (
    <div className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getImportanceColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="text-2xl sm:text-3xl bg-white p-2 rounded-xl shadow-sm flex-shrink-0">
            {email.logo}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{email.sender}</h3>
            <p className="text-sm text-gray-600 font-medium truncate">{email.category}</p>
            <div className="flex items-center space-x-2 mt-2">
              {getFrequencyIcon()}
              <span className="text-sm capitalize text-gray-700 font-medium">{email.frequency}</span>
              {email.unsubscribed && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                  Unsubscribed
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0 ml-3">
          <p className="font-bold text-lg sm:text-2xl text-gray-900">{email.emailsPerWeek}</p>
          <p className="text-xs text-gray-500 font-medium">per week</p>
          <div className="flex items-center space-x-1 mt-1">
            <Star className={`h-3 w-3 ${email.importance === 'high' ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            <span className="text-xs text-gray-500 capitalize">{email.importance}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium capitalize">{email.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Time wasted weekly:</span>
          <span className="font-medium text-red-600">{timeWasted.weekly} min</span>
        </div>
        
        {showDetails && (
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Monthly emails:</span>
              <span className="font-medium">{Math.round(email.emailsPerWeek * 4.33)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Time wasted monthly:</span>
              <span className="font-medium text-red-600">{timeWasted.monthly} min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Annual emails:</span>
              <span className="font-medium">{Math.round(email.emailsPerWeek * 52)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 flex items-center justify-center sm:justify-start space-x-1"
        >
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>{showDetails ? 'Less details' : 'More details'}</span>
        </Button>
        
        <div className="flex space-x-2">
          {!email.unsubscribed ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAction('archive')}
                disabled={isLoading}
              >
                <Archive className="h-4 w-4 mr-1" />
                {isLoading ? 'Processing...' : 'Archive'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleAction('unsubscribe')}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleAction('resubscribe')}
              disabled={isLoading}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {isLoading ? 'Processing...' : 'Resubscribe'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

EmailCard.displayName = 'EmailCard';

export default EmailCard;
