import { useProfileData } from "@/hooks/useProfileData";
import { useProfileForm } from "@/hooks/useProfileForm";
import { BasicInfoSection } from "./BasicInfoSection";
import { DailyGoalsSection } from "./DailyGoalsSection";

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