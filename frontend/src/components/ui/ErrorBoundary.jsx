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
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 p-4 text-center">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-lg w-full">
            <h2 className="text-2xl text-red-400 mb-4 font-display font-semibold">Something went wrong.</h2>
            <p className="text-slate-400 mb-6">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary w-full"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
