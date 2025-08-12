import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught', error, info);
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-xl border bg-white">
          <h2 className="text-lg font-semibold mb-2">Something went wrong.</h2>
          <pre className="text-xs text-red-600 overflow-auto">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
