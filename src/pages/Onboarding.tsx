import { useState } from "react";
import { Navigate } from "react-router-dom";
import { MeasurementsForm } from "@/components/onboarding/MeasurementsForm";
import { GoalsForm } from "@/components/onboarding/GoalsForm";
import { AddFoodButton } from "@/components/AddFoodButton";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [showAddFood, setShowAddFood] = useState(false);

  if (step === 4) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {step === 1 && (
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Welcome to Carbculator! 👋</h1>
            <p className="text-muted-foreground">
              Let's get started by setting up your profile. First, we'll need your
              measurements.
            </p>
            <MeasurementsForm onNext={() => setStep(2)} />
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Set Your Daily Goals 🎯</h1>
            <p className="text-muted-foreground">
              Let's set your daily nutritional goals to help you stay on track.
            </p>
            <GoalsForm onNext={() => setStep(3)} />
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-bold">Add Your First Meal 📸</h1>
            <p className="text-muted-foreground">
              Let's track your first meal! Click the button below to take a photo
              or upload an image of your food.
            </p>
            <button
              onClick={() => setShowAddFood(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Add Your First Meal
            </button>
          </div>
        )}

        {showAddFood && <AddFoodButton />}
      </div>
    </div>
  );
}