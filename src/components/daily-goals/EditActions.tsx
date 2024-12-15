import { Button } from "@/components/ui/button";

interface EditActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export function EditActions({ isEditing, onEdit, onCancel, onSave }: EditActionsProps) {
  return (
    <div className="flex justify-center mt-8">
      {!isEditing ? (
        <Button onClick={onEdit}>Edit Goals</Button>
      ) : (
        <div className="space-x-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave}>Save Goals</Button>
        </div>
      )}
    </div>
  );
}