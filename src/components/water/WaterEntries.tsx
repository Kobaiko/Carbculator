import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WaterEntry {
  id: string;
  amount: number;
  created_at: string;
}

interface WaterEntriesProps {
  entries: WaterEntry[];
}

export function WaterEntries({ entries }: WaterEntriesProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("water_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all queries that might contain water data
      queryClient.invalidateQueries({ queryKey: ["waterEntries"] });
      queryClient.invalidateQueries({ queryKey: ["water-entries"] });
      
      toast({
        title: "Success",
        description: "Water entry deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting water entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete water entry",
        variant: "destructive",
      });
    },
  });

  if (!entries.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Today's Entries</h3>
      <div className="grid gap-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="macro-card flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{entry.amount}ml</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(entry.created_at), "HH:mm")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate(entry.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}