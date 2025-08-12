import React from 'react';
import { focusManager } from '../utils/a11y';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
    this.errorRef = React.createRef();
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    this.logErrorToService(error, errorInfo);

    // Announce error to screen readers
    focusManager.announceToScreenReader(
      'An error occurred. Please try refreshing the page or contact support if the problem persists.',
      'assertive'
    );

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps, prevState) {
    // Focus pe error message când apare
    if (!prevState.hasError && this.state.hasError && this.errorRef.current) {
      this.errorRef.current.focus();
    }
  }

  logErrorToService = (error, errorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.props.userId || 'anonymous',
      errorId: this.state.errorId
    };

    // Send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(err => {
        console.error('Failed to log error to service:', err);
      });
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    });
    
    focusManager.announceToScreenReader('Retrying the application');
  };

  handleRefresh = () => {
    focusManager.announceToScreenReader('Refreshing the page');
    window.location.reload();
  };

  handleReportError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      timestamp: new Date().toISOString(),
      userDescription: ''
    };

    // Open error report modal sau redirect
    const subject = encodeURIComponent(`Error Report - ${errorReport.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${errorReport.errorId}
Time: ${errorReport.timestamp}
Message: ${errorReport.message}

Please describe what you were doing when this error occurred:
    `);
    
    window.open(`mailto:support@cleanslate.app?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full"
            role="alert"
            aria-labelledby="error-title"
            aria-describedby="error-description"
          >
            <div className="text-center">
              <div className="text-6xl mb-4" role="img" aria-label="Error">😔</div>
              
              <h1 
                id="error-title"
                className="text-2xl font-bold text-gray-900 mb-4"
                ref={this.errorRef}
                tabIndex="-1"
              >
                Oops! Something went wrong
              </h1>
              
              <p id="error-description" className="text-gray-600 mb-6">
               We&apos;re sorry, but something unexpected happened. You can try refreshing the page 
                or contact our support team if the problem continues.
              </p>

              {this.state.errorId && (
                <div className="bg-gray-50 p-3 rounded-lg mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>Error ID:</strong> <code>{this.state.errorId}</code>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Please include this ID when contacting support
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={this.handleRefresh}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors font-medium"
                  aria-describedby="refresh-description"
                >
                  Refresh Page
                </button>
                <span id="refresh-description" className="sr-only">
                  This will reload the entire page
                </span>
                
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-colors font-medium"
                  aria-describedby="retry-description"
                >
                  Try Again
                </button>
                <span id="retry-description" className="sr-only">
                  This will attempt to recover without refreshing
                </span>

                <button
                  onClick={this.handleReportError}
                  className="w-full bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 focus:bg-red-200 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors font-medium text-sm"
                >
                  Report This Error
                </button>
              </div>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer font-medium text-red-600 mb-2 focus:outline-none focus:ring-2 focus:ring-red-300 rounded">
                  Technical Details (Development)
                </summary>
                <div className="bg-red-50 p-3 rounded text-xs overflow-auto text-red-800 max-h-40">
                  <h4 className="font-semibold mb-2">Error:</h4>
                  <pre className="whitespace-pre-wrap mb-3">{this.state.error.toString()}</pre>
                  
                  <h4 className="font-semibold mb-2">Component Stack:</h4>
                  <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
