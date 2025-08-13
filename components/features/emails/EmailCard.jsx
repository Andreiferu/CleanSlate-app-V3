import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Clock, Trash2, RotateCcw, Archive } from 'lucide-react';
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
      case 'high': return <Mail {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case 'medium': return <Clock {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
      case 'low': return <Trash2 {...iconProps} className={`${iconProps.className} text-red-500`} />;
      default: return <Mail {...iconProps} className={`${iconProps.className} text-gray-400`} />;
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
    if (minutes < 60) {
      return `${minutes.toFixed(1)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes.toFixed(0)}m` : `${hours}h`;
  };

  return (
    <article 
      className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 focus-within:ring-4 focus-within:ring-blue-300 ${getImportanceColor()} ${email.unsubscribed ? 'opacity-60' : ''}`}
      aria-label={`${email.sender} email subscription - ${email.unsubscribed ? 'unsubscribed' : 'active'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="text-2xl sm:text-3xl bg-white p-2 rounded-xl shadow-sm flex-shrink-0" 
               role="img" 
               aria-label={`${email.sender} logo`}>
            {email.logo}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
              {email.sender}
            </h3>
            <p className="text-sm text-gray-600 font-medium truncate">
              {email.category}
