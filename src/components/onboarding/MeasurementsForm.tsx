import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function MeasurementsForm({ onNext }: { onNext: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          height: Number(height),
          weight: Number(weight),
          height_unit: heightUnit,
          weight_unit: weightUnit,
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your measurements have been saved.",
      });
      onNext();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to save measurements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="John"
          />
        </div>

        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Doe"
          />
        </div>

        <div className="space-y-2">
          <Label>Height</Label>
          <div className="flex gap-4">
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min="1"
              step="0.01"
              placeholder={heightUnit === "cm" ? "175" : "69"}
              className="flex-1"
            />
            <RadioGroup
              value={heightUnit}
              onValueChange={setHeightUnit}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cm" id="cm" />
                <Label htmlFor="cm">cm</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in" id="in" />
                <Label htmlFor="in">inches</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Weight</Label>
          <div className="flex gap-4">
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="1"
              step="0.01"
              placeholder={weightUnit === "kg" ? "70" : "154"}
              className="flex-1"
            />
            <RadioGroup
              value={weightUnit}
              onValueChange={setWeightUnit}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kg" id="kg" />
                <Label htmlFor="kg">kg</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lb" id="lb" />
                <Label htmlFor="lb">pounds</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Next"}
      </Button>
    </form>
  );
}