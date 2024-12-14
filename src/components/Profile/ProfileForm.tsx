import React from 'react';
import { Button } from '../UI/Button';
import type { Profile } from '../../types/profile';

interface ProfileFormProps {
  profile: Profile;
  onSubmit: (data: Partial<Profile>) => void;
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = React.useState({
    name: profile.name,
    email: profile.email,
    height: profile.height,
    weight: profile.weight
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-medium text-brand-700 dark:text-brand-300">
        Personal Information
      </h3>

      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-600 dark:text-brand-400">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-brand-200 dark:border-brand-700 
                     bg-white dark:bg-brand-800/50 text-brand-700 dark:text-brand-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-600 dark:text-brand-400">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-brand-200 dark:border-brand-700 
                     bg-white dark:bg-brand-800/50 text-brand-700 dark:text-brand-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-600 dark:text-brand-400">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border border-brand-200 dark:border-brand-700 
                       bg-white dark:bg-brand-800/50 text-brand-700 dark:text-brand-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-600 dark:text-brand-400">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
              className="mt-1 block w-full rounded-md border border-brand-200 dark:border-brand-700 
                       bg-white dark:bg-brand-800/50 text-brand-700 dark:text-brand-300 px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}