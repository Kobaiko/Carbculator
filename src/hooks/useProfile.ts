import { useState, useEffect } from 'react';
import type { Profile } from '../types/profile';

const DEFAULT_PROFILE: Profile = {
  name: '',
  email: '',
  height: 170,
  weight: 70,
  imageUrl: ''
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (data: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  const updatePassword = (data: { currentPassword: string; newPassword: string }) => {
    // In a real app, this would make an API call to update the password
    console.log('Password update:', data);
  };

  const updateImage = (imageData: string) => {
    setProfile(prev => ({ ...prev, imageUrl: imageData }));
  };

  return {
    profile,
    updateProfile,
    updatePassword,
    updateImage
  };
}