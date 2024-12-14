import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface BasicInfoStepProps {
  onNext: (data: {
    username: string;
    height: string;
    weight: string;
    heightUnit: string;
    weightUnit: string;
  }) => void;
}

export function BasicInfoStep({ onNext }: BasicInfoStepProps) {
  const [formData, setFormData] = useState({
    username: "",
    height: "",
    weight: "",
    heightUnit: "cm",
    weightUnit: "kg",
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Welcome to Carbculator! 👋</h1>
        <p className="text-muted-foreground">Let's get to know you better</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">How should we call you?</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height</Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                required
              />
              <Select
                value={formData.heightUnit}
                onValueChange={(value) => handleChange("heightUnit", value)}
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
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                required
              />
              <Select
                value={formData.weightUnit}
                onValueChange={(value) => handleChange("weightUnit", value)}
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
      </div>

      <Button type="submit" className="w-full">Next</Button>
    </form>
  );
}