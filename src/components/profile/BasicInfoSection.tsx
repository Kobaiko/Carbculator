import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoSectionProps {
  formData: {
    username: string;
    height: string;
    weight: string;
    heightUnit: string;
    weightUnit: string;
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
          value={formData.username || ''}
          onChange={(e) => handleChange('username', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <div className="flex gap-2">
            <Input
              id="height"
              type="number"
              value={formData.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
            />
            <Select
              value={formData.heightUnit}
              onValueChange={(value) => handleChange('heightUnit', value)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="in">in</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <div className="flex gap-2">
            <Input
              id="weight"
              type="number"
              value={formData.weight || ''}
              onChange={(e) => handleChange('weight', e.target.value)}
            />
            <Select
              value={formData.weightUnit}
              onValueChange={(value) => handleChange('weightUnit', value)}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lbs">lbs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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