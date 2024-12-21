import { useProfileData } from "@/hooks/useProfileData";
import { useProfileForm } from "@/hooks/useProfileForm";
import { BasicInfoSection } from "./BasicInfoSection";

export function ProfileBasicInfo() {
  const { profile, isLoading, updateProfile } = useProfileData();
  const { formData, handleChange } = useProfileForm(profile);

  const handleSave = () => {
    console.log('Saving profile:', formData);
    updateProfile.mutate({
      username: formData.username,
      height: formData.height,
      weight: formData.weight,
      height_unit: formData.heightUnit,
      weight_unit: formData.weightUnit,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <BasicInfoSection
        formData={formData}
        handleChange={handleChange}
        onSave={handleSave}
        isLoading={updateProfile.isPending}
      />
    </div>
  );
}