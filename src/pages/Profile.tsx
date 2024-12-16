import { useSession } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileBasicInfo } from "@/components/profile/ProfileBasicInfo";
import { ProfileAuth } from "@/components/profile/ProfileAuth";

export default function Profile() {
  const session = useSession();

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
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information
        </p>
      </div>

      <div className="space-y-8">
        <ProfileAvatar profile={profile} />
        
        <div className="space-y-6">
          <ProfileBasicInfo profile={profile} />
          
          <div className="border-t pt-6">
            <ProfileAuth />
          </div>
        </div>
      </div>
    </div>
  );
}