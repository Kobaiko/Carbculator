import { useState, useEffect } from "react";
import type { ProfileFormData } from "./useProfileData";

export function useProfileForm(profile: any) {
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    height: '',
    weight: '',
    daily_calories: '',
    daily_protein: '',
    daily_carbs: '',
    daily_fats: '',
    daily_water: '',
  });

  useEffect(() => {
    if (!profile) return;

    console.log('Setting form data from profile:', profile);
    setFormData({
      username: profile.username || '',
      height: profile.height !== undefined && profile.height !== null ? profile.height.toString() : '',
      weight: profile.weight !== undefined && profile.weight !== null ? profile.weight.toString() : '',
      daily_calories: profile.daily_calories?.toString() || '',
      daily_protein: profile.daily_protein?.toString() || '',
      daily_carbs: profile.daily_carbs?.toString() || '',
      daily_fats: profile.daily_fats?.toString() || '',
      daily_water: profile.daily_water?.toString() || '',
    });
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    console.log('Handling change:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange,
  };
}