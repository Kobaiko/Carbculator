import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-semibold text-destructive">Error Loading Profile</h1>
      <p className="text-muted-foreground">Failed to load your profile data. Please try again.</p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  );
}