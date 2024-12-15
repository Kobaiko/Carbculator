import { Brain } from "lucide-react";

export function LoadingSection() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        <div className="absolute w-full h-full border-4 border-primary/20 rounded-full animate-[spin_3s_linear_infinite]" />
        <div className="absolute w-full h-full border-4 border-primary rounded-full animate-[spin_2s_linear_infinite] border-t-transparent" />
        <Brain className="w-10 h-10 text-primary animate-pulse" />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-medium text-foreground animate-pulse">
          AI is analyzing your meal...
        </p>
        <p className="text-sm text-muted-foreground">
          Identifying ingredients and calculating nutrition facts
        </p>
      </div>
    </div>
  );
}