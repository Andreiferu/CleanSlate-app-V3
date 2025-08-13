import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Clock, Trash2, Archive, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../../ui';

const EmailCard = React.memo(({ 
  email, 
  onUnsubscribe, 
  onResubscribe, 
  onArchive 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate time wasted per week (assuming 1.5 minutes per email)
  const timeWastedWeekly = email.emailsPerWeek * 1.5;
  const timeWastedMonthly = timeWastedWeekly * 4.33;
  const timeWastedAnnually = timeWastedWeekly * 52;

  const getImportanceColor = () => {
    switch (email.importance) {
      case 'high': return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'medium': return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-100';
      case 'low': return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getImportanceIcon = () => {
    const iconProps = { className: "h-4 w-4", 'aria-hidden': true };
    switch (email.importance) {
      case 'high': return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case 'medium': return <Clock {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
      case 'low': return <AlertTriangle {...iconProps} className={`${iconProps.className} text-red-500`} />;
      default: return <Mail {...iconProps} className={`${iconProps.className} text-gray-400`} />;
    }
  };

  const getTypeIcon = () => {
    switch (email.type) {
      case 'newsletter': return '📰';
      case 'promotional': return '🛍️';
      case 'notification': return '🔔';
      default: return '📧';
    }
  };

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      switch (action) {
        case 'unsubscribe': 
          onUnsubscribe(email.id); 
          break;
        case 'resubscribe': 
          onResubscribe(email.id); 
          break;
        case 'archive': 
          onArchive(email.id); 
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes.toFixed(1)} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes.toFixed(0)}m` : `${hours}h`;
  };

  const getFrequencyBadge = () => {
    const colors = {
      daily: 'bg-red-100 text-red-800',
      weekly: 'bg-yellow-100 text-yellow-800',
      monthly: 'bg-green-100 text-green-800'
    };
    return colors[email.frequency] || 'bg-gray-100 text-gray-800';
  };

  return (
    <article 
      className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 focus-within:ring-4 focus-within:ring-blue-300 ${getImportanceColor()} ${email.unsubscribed ? 'opacity-60' : ''}`}
      aria-label={`${email.sender} email subscription - ${email.unsubscribed ? 'unsubscribed' : 'active'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="text-2xl sm:text-3xl bg-white p-2 rounded-xl shadow-sm flex-shrink-0 relative" 
               role="img" 
               aria-label={`${email.sender} logo`}>
            {email.logo}
            <div className="absolute -top-1 -right-1 text-sm">
              {getTypeIcon()}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
              {email.sender}
            </h3>
            <p className="text-sm text-gray-600 font-medium truncate">
              {email.category}
            </p>
            <div className="flex items-center space-x-2 mt-2 flex-wrap gap-1">
              {getImportanceIcon()}
              <span className="text-sm capitalize text-gray-700 font-medium">
                {email.importance}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getFrequencyBadge()}`}>
                {email.frequency}
              </span>
              {email.unsubscribed && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                  Unsubscribed
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0 ml-3">
          <p className="font-bold text-lg sm:text-2xl text-gray-900" aria-label={`${email.emailsPerWeek} emails per week`}>
            {email.emailsPerWeek}
          </p>
          <p className="text-xs text-gray-500 font-medium">emails/week</p>
          <p className="text-xs text-orange-600 font-medium">
            {formatTime(timeWastedWeekly)}
          </p>
          {email.emailsPerWeek > 7 && (
            <div className="text-xs text-red-500 font-bold mt-1">
              ⚠️ High Volume
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Type:</span>
          <span className="font-medium capitalize">{email.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Importance:</span>
          <span className="font-medium capitalize">{email.importance}</span>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-3 p-3 bg-white/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{Math.round(email.emailsPerWeek * 4.33)}</div>
            <div className="text-xs text-gray-600">Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{email.emailsPerWeek * 52}</div>
            <div className="text-xs text-gray-600">Yearly</div>
          </div>
        </div>
        
        {showDetails && (
          <div className="pt-4 border-t border-gray-200" role="region" aria-label="Additional email details">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly emails:</span>
                <span className="font-medium">{Math.round(email.emailsPerWeek * 4.33)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Annual emails:</span>
                <span className="font-medium">{email.emailsPerWeek * 52}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Monthly time wasted:</span>
                <span className="font-medium text-orange-600">{formatTime(timeWastedMonthly)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Annual time wasted:</span>
                <span className="font-medium text-red-600">{formatTime(timeWastedAnnually)}</span>
              </div>
              {email.description && (
                <div className="pt-2">
                  <div className="text-sm text-gray-600 font-medium mb-1">Description:</div>
                  <p className="text-sm text-gray-700 italic bg-gray-50 p-2 rounded">
                    "{email.description}"
                  </p>
                </div>
              )}
              
              {/* Impact Analysis */}
              <div className="pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600 font-medium mb-2">📊 Impact Analysis</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-medium text-blue-800">Time Impact</div>
                    <div className="text-blue-600">{timeWastedWeekly > 10 ? 'High' : timeWastedWeekly > 5 ? 'Medium' : 'Low'}</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="font-medium text-purple-800">Priority Score</div>
                    <div className="text-purple-600">
                      {email.importance === 'low' && email.emailsPerWeek > 5 ? 'Unsubscribe' : 'Keep'}
                    </div>
                  </div>
                </div>
              </div>
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
          aria-expanded={showDetails}
        >
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>{showDetails ? 'Less details' : 'More details'}</span>
        </Button>
        
        <div className="flex space-x-2" role="group" aria-label="Email actions">
          {!email.unsubscribed ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAction('archive')}
                disabled={isLoading}
                aria-label={`Archive ${email.sender} emails`}
              >
                <Archive className="h-4 w-4 mr-1" aria-hidden="true" />
                {isLoading ? 'Processing...' : 'Archive'}
              </Button>
              
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleAction('unsubscribe')}
                disabled={isLoading}
                aria-label={`Unsubscribe from ${email.sender}`}
              >
                <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
                {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleAction('resubscribe')}
              disabled={isLoading}
              aria-label={`Resubscribe to ${email.sender}`}
            >
              <RotateCcw className="h-4 w-4 mr-1" aria-hidden="true" />
              {isLoading ? 'Resubscribing...' : 'Resubscribe'}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
});

EmailCard.displayName = 'EmailCard';

export default EmailCard;
