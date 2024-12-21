import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BasicInfoSectionProps {
  formData: {
    username: string;
  };
  handleChange: (field: string, value: string) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function BasicInfoSection({
  formData,
  handleChange,
  onSave,
  isLoading,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Display Name</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
        />
      </div>
      <Button 
        onClick={onSave}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}