import { useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Loader2, LogOut } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ProfileUpdateData = Partial<{
  username: string;
  height: number;
  weight: number;
  height_unit: string;
  weight_unit: string;
  avatar_url: string;
}>;

export default function Profile() {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (formData: ProfileUpdateData) => {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', session?.user?.id);

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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${session?.user?.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile.mutateAsync({ avatar_url: publicUrl });

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;

      toast({
        title: "Email update initiated",
        description: "Please check your new email for confirmation.",
      });
      setNewEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      setNewPassword("");
      setCurrentPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>{profile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Click the camera icon to upload a new profile picture
          </p>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Display Name</Label>
            <Input
              id="username"
              defaultValue={profile?.username || ''}
              onChange={(e) => updateProfile.mutate({ username: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height ({profile?.height_unit})</Label>
              <Input
                id="height"
                type="number"
                defaultValue={profile?.height || ''}
                onChange={(e) => updateProfile.mutate({ height: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight ({profile?.weight_unit})</Label>
              <Input
                id="weight"
                type="number"
                defaultValue={profile?.weight || ''}
                onChange={(e) => updateProfile.mutate({ weight: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          {/* Email Update Section */}
          <div className="space-y-2 pt-4 border-t">
            <h2 className="text-lg font-semibold">Update Email</h2>
            <div className="space-y-2">
              <Label htmlFor="new-email">New Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button 
                onClick={handleUpdateEmail}
                disabled={!newEmail}
              >
                Update Email
              </Button>
            </div>
          </div>

          {/* Password Update Section */}
          <div className="space-y-2 pt-4 border-t">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button 
                onClick={handleUpdatePassword}
                disabled={!currentPassword || !newPassword}
              >
                Update Password
              </Button>
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="pt-4 border-t">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}