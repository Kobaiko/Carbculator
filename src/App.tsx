import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp } from "@clerk/clerk-react";
import { AuthMiddleware } from "./components/auth/AuthMiddleware";
import Index from "./pages/Index";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key. Please check your environment variables.");
}

const queryClient = new QueryClient();

const EmptyPage = () => <div className="p-4">Coming soon...</div>;

const App = () => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY || ""}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
            <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;