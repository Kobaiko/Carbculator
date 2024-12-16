import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

type ProfileBasicInfoProps = {
  profile: {
    username?: string | null;
    height?: number | null;
    weight?: number | null;
    height_unit?: string;
    weight_unit?: string;
  } | null;
};

export function ProfileBasicInfo({ profile }: ProfileBasicInfoProps) {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (formData: Partial<typeof profile>) => {
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Display Name</Label>
        <Input
          id="username"
          value={profile?.username || ''}
          onChange={(e) => updateProfile.mutate({ username: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height ({profile?.height_unit || 'cm'})</Label>
          <Input
            id="height"
            type="number"
            value={profile?.height || ''}
            onChange={(e) => updateProfile.mutate({ height: parseFloat(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({profile?.weight_unit || 'kg'})</Label>
          <Input
            id="weight"
            type="number"
            value={profile?.weight || ''}
            onChange={(e) => updateProfile.mutate({ weight: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );
}