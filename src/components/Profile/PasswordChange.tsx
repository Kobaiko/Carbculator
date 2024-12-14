import React, { useState } from 'react';
import { Button } from '../UI/Button';

interface PasswordChangeProps {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => void;
}

export function PasswordChange({ onSubmit }: PasswordChangeProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    onSubmit({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-medium text-brand-700 dark:text-brand-300">
        Change Password
      </h3>

      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-600 dark:text-brand-400">
            Current Password
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-brand-200 dark:border-brand-700 
                     bg-white dark:bg-brand-800/50 text-brand-700 dark:text-brand-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-600 dark:text-brand-400">
            New Password
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-brand-200 dark:border-brand-700 
                     bg-white dark:bg-brand-800/50 text-brand-700 dark:text-brand-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-600 dark:text-brand-400">
            Confirm New Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-brand-200 dark:border-brand-700 
                     bg-white dark:bg-brand-800/50 text-brand-700 dark:text-brand-300 px-3 py-2"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Update Password
        </Button>
      </div>
    </form>
  );
}