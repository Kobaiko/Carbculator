import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { BasicInfoSection } from "./BasicInfoSection";
import { DailyGoalsSection } from "./DailyGoalsSection";

export function ProfileBasicInfo() {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: '',
    height: '',
    weight: '',
    daily_calories: '',
    daily_protein: '',
    daily_carbs: '',
    daily_fats: '',
    daily_water: '',
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      console.log('Profile data fetched:', data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      console.log('Setting form data from profile:', profile);
      setFormData({
        username: profile.username || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        daily_calories: profile.daily_calories?.toString() || '',
        daily_protein: profile.daily_protein?.toString() || '',
        daily_carbs: profile.daily_carbs?.toString() || '',
        daily_fats: profile.daily_fats?.toString() || '',
        daily_water: profile.daily_water?.toString() || '',
      });
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async (updateData: Record<string, any>) => {
      if (!session?.user?.id) throw new Error('No user found');

      console.log('Updating profile with:', updateData);

      // Convert empty strings to null for numeric fields
      const processedData = Object.entries(updateData).reduce((acc, [key, value]) => {
        const numericFields = ['height', 'weight', 'daily_calories', 'daily_protein', 'daily_carbs', 'daily_fats', 'daily_water'];
        if (numericFields.includes(key)) {
          acc[key] = value === '' ? null : parseFloat(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const { error } = await supabase
        .from('profiles')
        .update({
          ...processedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: string, value: string) => {
    console.log('Handling change:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string, value: string) => {
    console.log('Handling blur:', field, value);
    updateProfile.mutate({ [field]: value });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <BasicInfoSection
        formData={formData}
        heightUnit={profile.height_unit}
        weightUnit={profile.weight_unit}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
      
      <DailyGoalsSection
        formData={formData}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
    </div>
  );
}