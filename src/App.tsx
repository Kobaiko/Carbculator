import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { useSession } from '@supabase/auth-helpers-react';
import { AppHeader } from "./components/layout/AppHeader";
import { AppRoutes } from "./components/routing/AppRoutes";
import { Navigation } from "./components/Navigation";
import { AddFoodButton } from "./components/AddFoodButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Helper component to handle auth checks
const AuthCheck = () => {
  const session = useSession();
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/onboarding';

  // Handle session loading state and check for deleted user
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          // Clear all caches
          queryClient.clear();
          // Sign out
          await supabase.auth.signOut();
          if (!isAuthPage) {
            // Only redirect if we're not already on an auth page
            window.location.href = '/signup';
          }
          return;
        }

        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          // User exists in auth but not in profiles - likely deleted
          queryClient.clear();
          await supabase.auth.signOut();
          if (!isAuthPage) {
            // Only redirect if we're not already on an auth page
            window.location.href = '/signup';
            toast({
              title: "Account not found",
              description: "Please sign up to continue.",
              variant: "destructive",
            });
          }
          return;
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsSessionLoading(false);
      }
    };

    const timer = setTimeout(() => {
      checkUser();
    }, 100);

    return () => clearTimeout(timer);
  }, [toast, isAuthPage]);

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {session && (
        <>
          <AppHeader />
          <Navigation />
          <AddFoodButton />
        </>
      )}
      <AppRoutes />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <AuthCheck />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;