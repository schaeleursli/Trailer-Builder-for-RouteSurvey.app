import React from 'react';
import { RefreshCwIcon } from 'lucide-react';
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}
export function ErrorFallback({
  error,
  resetErrorBoundary
}: ErrorFallbackProps) {
  return <div className="h-full flex items-center justify-center">
      <div className="bg-surface rounded-card shadow-card p-6 max-w-md mx-auto text-center">
        <div className="text-danger-500 mb-4">
          <RefreshCwIcon className="h-10 w-10 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-sm text-surface-400 mb-4">
          {error.message || 'There was an error loading the 3D viewer'}
        </p>
        <button onClick={resetErrorBoundary} className="h-8 px-3 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm">
          Try again
        </button>
      </div>
    </div>;
}