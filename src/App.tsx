import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthMiddleware } from "./components/auth/AuthMiddleware";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react'
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient();

const EmptyPage = () => <div className="p-4">Coming soon...</div>;

const LoginPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="w-full max-w-md space-y-8 px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Welcome to Carbculator</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue</p>
      </div>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        options={{
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          additionalData: {
            first_name: {
              label: 'First Name',
              required: true,
            },
            last_name: {
              label: 'Last Name',
              required: true,
            },
          },
        }}
      />
    </div>
  </div>
);

const App = () => {
  const session = useSession();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            {session && (
              <header className="py-4 px-6 border-b">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-semibold">Carbculator</h1>
                  </div>
                  <button 
                    onClick={() => supabase.auth.signOut()}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Sign Out
                  </button>
                </div>
              </header>
            )}
            <Routes>
              <Route 
                path="/login" 
                element={!session ? <LoginPage /> : <Navigate to="/" replace />} 
              />
              <Route
                path="/onboarding"
                element={
                  <AuthMiddleware>
                    <Onboarding />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/"
                element={
                  <AuthMiddleware>
                    <Index />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/meals"
                element={
                  <AuthMiddleware>
                    <EmptyPage />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/goals"
                element={
                  <AuthMiddleware>
                    <EmptyPage />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/calendar"
                element={
                  <AuthMiddleware>
                    <EmptyPage />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/water"
                element={
                  <AuthMiddleware>
                    <EmptyPage />
                  </AuthMiddleware>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;