import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  formData: {
    username: string;
    height: string;
    weight: string;
  };
  heightUnit: string;
  weightUnit: string;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string, value: string) => void;
}

export function BasicInfoSection({
  formData,
  heightUnit = 'cm',  // Provide default values
  weightUnit = 'kg',  // Provide default values
  handleChange,
  handleBlur,
}: BasicInfoSectionProps) {
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
          <Label htmlFor="height">Height ({heightUnit || 'cm'})</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            onBlur={(e) => handleBlur('height', e.target.value)}
            placeholder={`Enter height in ${heightUnit || 'cm'}`}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({weightUnit || 'kg'})</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            onBlur={(e) => handleBlur('weight', e.target.value)}
            placeholder={`Enter weight in ${weightUnit || 'kg'}`}
          />
        </div>
      </div>
    </div>
  );
}