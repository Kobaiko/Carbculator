import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";

export function ProfileBasicInfo() {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: '',
    height: '',
    weight: '',
  });

  // Fetch profile data
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('username, height, weight, height_unit, weight_unit')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      // Update form data when profile is loaded
      setFormData({
        username: data.username || '',
        height: data.height?.toString() || '',
        weight: data.weight?.toString() || '',
      });

      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (formData: {
      username?: string;
      height?: number;
      weight?: number;
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
    if (field === 'height' || field === 'weight') {
      updateProfile.mutate({ [field]: parseFloat(value) || 0 });
    } else {
      updateProfile.mutate({ [field]: value });
    }
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
}