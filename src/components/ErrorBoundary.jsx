// src/components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h2>
          <p className="text-slate-400 mb-6">We've encountered an unexpected error. Please try refreshing the page.</p>
          {/* Independence Day Theme Start */}
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors"
          >
            Refresh Page
          </button>
          {/* Independence Day Theme End */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
