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
    const handleSignOut = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Clear query client cache
        queryClient.clear();
        
        // Redirect to signup page
        window.location.href = '/signup';
      } catch (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error",
          description: "There was an error signing out. Please try again.",
          variant: "destructive",
        });
      }
    };

    // Immediately execute sign out
    handleSignOut();
  }, []); // Run once on component mount

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