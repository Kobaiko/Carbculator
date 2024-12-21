import { useProfileData } from "@/hooks/useProfileData";
import { useProfileForm } from "@/hooks/useProfileForm";
import { BasicInfoSection } from "./BasicInfoSection";

export function ProfileBasicInfo() {
  const { profile, isLoading, updateProfile } = useProfileData();
  const { formData, handleChange } = useProfileForm(profile);

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
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
    </div>
  );
}