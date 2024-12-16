import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { AppHeader } from "./components/layout/AppHeader";
import { AppRoutes } from "./components/routing/AppRoutes";
import { Navigation } from "./components/Navigation";
import { AddFoodButton } from "./components/AddFoodButton";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  const session = useSession();
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          // Clear any existing data
          queryClient.clear();
          
          // Create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert([{ 
              id: currentSession.user.id,
              daily_calories: 2000,
              daily_protein: 150,
              daily_carbs: 250,
              daily_fats: 70,
              daily_water: 2000,
              height_unit: 'cm',
              weight_unit: 'kg',
              updated_at: new Date().toISOString(),
            }], {
              onConflict: 'id'
            });

          if (insertError) {
            console.error('Error creating/updating profile:', insertError);
            await supabase.auth.signOut();
            queryClient.clear();
            toast({
              title: "Error",
              description: "There was an error setting up your profile. Please try signing in again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error('Session error:', error);
        await supabase.auth.signOut();
        queryClient.clear();
      } finally {
        setIsSessionLoading(false);
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.invalidateQueries();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isSessionLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            {session && (
              <>
                <AppHeader />
                <Navigation />
                <AddFoodButton />
              </>
            )}
            <AppRoutes />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;