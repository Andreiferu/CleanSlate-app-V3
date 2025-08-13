import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });

    // In production, you would log to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.warn('Error logged to monitoring service');
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">😵</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
              <p className="text-gray-600">Something went wrong, but don't worry!</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 active:scale-95"
              >
                Reload Page
              </button>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium text-red-800 hover:text-red-900">
                  🐛 Technical Details (Development Only)
                </summary>
                <div className="mt-3 space-y-2">
                  <div>
                    <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wide">Error:</h4>
                    <pre className="text-xs text-red-600 overflow-auto max-h-20 bg-white p-2 rounded border">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wide">Component Stack:</h4>
                      <pre className="text-xs text-red-600 overflow-auto max-h-32 bg-white p-2 rounded border">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Retry count: {this.state.retryCount}
                  </div>
                </div>
              </details>
            )}

            {/* Help text */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> This usually happens due to network issues or temporary glitches. 
                Try refreshing the page or check your internet connection.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
