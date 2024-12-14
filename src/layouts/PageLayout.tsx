import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8 lg:py-8 space-y-6">
      {children}
    </div>
  );
}