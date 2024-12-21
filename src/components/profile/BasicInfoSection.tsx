import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  formData: {
    username: string;
  };
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string, value: string) => void;
}

export function BasicInfoSection({
  formData,
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
    </div>
  );
}