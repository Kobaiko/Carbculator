import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      <span className="ml-3 text-brand-600">Analyzing your meal...</span>
    </div>
  );
}