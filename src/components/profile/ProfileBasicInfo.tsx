import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

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

  // Fetch profile data
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('username, height, weight, height_unit, weight_unit, daily_calories, daily_protein, daily_carbs, daily_fats, daily_water')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
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
    mutationFn: async (formData: {
      username?: string;
      height?: number;
      weight?: number;
      daily_calories?: number;
      daily_protein?: number;
      daily_carbs?: number;
      daily_fats?: number;
      daily_water?: number;
    }) => {
      if (!session?.user?.id) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update(formData)
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
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating profile:', error);
    },
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string, value: string) => {
    const numericFields = ['height', 'weight', 'daily_calories', 'daily_protein', 'daily_carbs', 'daily_fats', 'daily_water'];
    if (numericFields.includes(field)) {
      updateProfile.mutate({ [field]: parseFloat(value) || 0 });
    } else {
      updateProfile.mutate({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Display Name</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          onBlur={(e) => handleBlur('username', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height ({profile?.height_unit || 'cm'})</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            onBlur={(e) => handleBlur('height', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({profile?.weight_unit || 'kg'})</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            onBlur={(e) => handleBlur('weight', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Daily Goals</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="daily_calories">Daily Calories (kcal)</Label>
            <Input
              id="daily_calories"
              type="number"
              value={formData.daily_calories}
              onChange={(e) => handleChange('daily_calories', e.target.value)}
              onBlur={(e) => handleBlur('daily_calories', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily_protein">Daily Protein (g)</Label>
            <Input
              id="daily_protein"
              type="number"
              value={formData.daily_protein}
              onChange={(e) => handleChange('daily_protein', e.target.value)}
              onBlur={(e) => handleBlur('daily_protein', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily_carbs">Daily Carbs (g)</Label>
            <Input
              id="daily_carbs"
              type="number"
              value={formData.daily_carbs}
              onChange={(e) => handleChange('daily_carbs', e.target.value)}
              onBlur={(e) => handleBlur('daily_carbs', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily_fats">Daily Fats (g)</Label>
            <Input
              id="daily_fats"
              type="number"
              value={formData.daily_fats}
              onChange={(e) => handleChange('daily_fats', e.target.value)}
              onBlur={(e) => handleBlur('daily_fats', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="daily_water">Daily Water (ml)</Label>
            <Input
              id="daily_water"
              type="number"
              value={formData.daily_water}
              onChange={(e) => handleChange('daily_water', e.target.value)}
              onBlur={(e) => handleBlur('daily_water', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}