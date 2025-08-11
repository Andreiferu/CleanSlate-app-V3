import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = React.memo(({ 
  title, 
  value, 
  icon: Icon, 
  className = '', 
  subtitle = '', 
  trend = null, 
  onClick = null,
  loading = false,
  'aria-label': ariaLabel
}) => (
  <div 
    className={`p-4 sm:p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer backdrop-blur-sm active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 ${className} ${loading ? 'animate-pulse' : ''}`}
    onClick={onClick}
    onKeyPress={(e) => e.key === 'Enter' && onClick && onClick()}
    tabIndex={onClick ? 0 : -1}
    role={onClick ? 'button' : 'article'}
    aria-label={ariaLabel || `${title}: ${value}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm opacity-90 font-medium truncate">{title}</p>
        <div className="flex items-baseline space-x-1 sm:space-x-2">
          <p className="text-xl sm:text-3xl font-bold truncate" aria-live="polite">
            {loading ? '...' : value}
          </p>
          {trend && !loading && (
            <span className={`text-xs sm:text-sm flex items-center ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}
                  aria-label={`Trend: ${trend > 0 ? 'up' : 'down'} ${Math.abs(trend)}%`}>
              <TrendingUp className={`h-2 w-2 sm:h-3 sm:w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs opacity-80 mt-1 truncate">{subtitle}</p>}
      </div>
      <div className="ml-2 sm:ml-4 flex-shrink-0">
        <Icon className="h-8 w-8 sm:h-12 sm:w-12 opacity-80" aria-hidden="true" />
      </div>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

export default StatCard;
