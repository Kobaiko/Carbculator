import React from 'react';
import { User } from 'lucide-react';
import { ProfileForm } from './ProfileForm';
import { ProfileImage } from './ProfileImage';
import { PasswordChange } from './PasswordChange';
import { useProfile } from '../../hooks/useProfile';

export function ProfilePage() {
  const { profile, updateProfile, updatePassword, updateImage } = useProfile();

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
        <User className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Profile Settings</h2>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <ProfileImage
          currentImage={profile.imageUrl}
          onImageUpdate={updateImage}
        />

        <div className="bg-white dark:bg-brand-800/50 rounded-lg p-6">
          <ProfileForm
            profile={profile}
            onSubmit={updateProfile}
          />
        </div>

        <div className="bg-white dark:bg-brand-800/50 rounded-lg p-6">
          <PasswordChange onSubmit={updatePassword} />
        </div>
      </div>
    </div>
  );
}