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
  heightUnit = 'cm',
  weightUnit = 'kg',
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
          <Label htmlFor="height">Height ({heightUnit})</Label>
          <Input
            id="height"
            type="number"
            step="0.01"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            onBlur={(e) => handleBlur('height', e.target.value)}
            placeholder={`Enter height in ${heightUnit}`}
          />
          <p className="text-sm text-muted-foreground">
            Current height: {formData.height} {heightUnit}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight ({weightUnit})</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            onBlur={(e) => handleBlur('weight', e.target.value)}
            placeholder={`Enter weight in ${weightUnit}`}
          />
        </div>
      </div>
    </div>
  );
}