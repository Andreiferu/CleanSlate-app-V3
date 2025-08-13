import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = React.memo(({ 
  title, 
  value, 
  subtitle,
  hint, // backward compatibility
  icon: Icon,
  className = '',
  trend = null,
  loading = false
}) => {
  // Use subtitle or hint for backward compatibility
  const description = subtitle || hint;
  
  // Trend indicator
  const getTrendIcon = () => {
    if (trend === null || trend === undefined) return null;
    
    const iconProps = { className: "h-4 w-4", 'aria-hidden': true };
    
    if (trend > 0) {
      return <TrendingUp {...iconProps} className={`${iconProps.className} text-green-500`} />;
    } else if (trend < 0) {
      return <TrendingDown {...iconProps} className={`${iconProps.className} text-red-500`} />;
    } else {
      return <Minus {...iconProps} className={`${iconProps.className} text-gray-400`} />;
    }
  };

  const getTrendColor = () => {
    if (trend === null || trend === undefined) return '';
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const formatTrend = () => {
    if (trend === null || trend === undefined) return '';
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend}%`;
  };

  if (loading) {
    return (
      <div className={`rounded-2xl border bg-white p-6 shadow-lg animate-pulse ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          {Icon && <div className="h-6 w-6 bg-gray-200 rounded"></div>}
        </div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div 
      className={`rounded-2xl border bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
      role="region"
      aria-label={`${title} statistics`}
    >
      {/* Header with title and icon */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <div className="p-2 rounded-lg bg-gray-50">
            <Icon className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="flex items-baseline space-x-2 mb-2">
        <span className="text-3xl font-bold text-gray-900" aria-label={`Value: ${value}`}>
          {value}
        </span>
        
        {/* Trend indicator */}
        {trend !== null && trend !== undefined && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium" aria-label={`Trend: ${formatTrend()}`}>
              {formatTrend()}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      )}

      {/* Progress bar for percentage values */}
      {typeof value === 'string' && value.includes('%') && (
        <div className="mt-3">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, parseFloat(value) || 0)}%` }}
              aria-label={`Progress: ${value}`}
            />
          </div>
        </div>
      )}
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
