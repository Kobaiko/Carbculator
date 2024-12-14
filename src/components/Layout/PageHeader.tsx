import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ icon: Icon, title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
        <Icon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}