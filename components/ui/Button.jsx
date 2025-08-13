import React from 'react';

const Button = React.forwardRef(({ 
  as: Component = 'button', 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '', 
  children, 
  ...props 
}, ref) => {
  
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  // Size variants
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs rounded-md',
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl'
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 focus:ring-blue-300 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 focus:ring-gray-300 shadow-sm hover:shadow-md',
    success: 'bg-green-600 text-white border border-green-600 hover:bg-green-700 focus:ring-green-300 shadow-lg hover:shadow-xl',
    danger: 'bg-red-600 text-white border border-red-600 hover:bg-red-700 focus:ring-red-300 shadow-lg hover:shadow-xl',
    warning: 'bg-yellow-600 text-white border border-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300 shadow-lg hover:shadow-xl',
    info: 'bg-cyan-600 text-white border border-cyan-600 hover:bg-cyan-700 focus:ring-cyan-300 shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100 focus:ring-gray-300',
    outline: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 focus:ring-blue-300',
    link: 'bg-transparent text-blue-600 border border-transparent hover:text-blue-700 focus:ring-blue-300 underline-offset-4 hover:underline'
  };
  
  // Combine all styles
  const combinedStyles = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${className}
  `.trim();

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <Component
      ref={ref}
      className={combinedStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
