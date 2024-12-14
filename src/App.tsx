import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import { AuthMiddleware } from "./components/auth/AuthMiddleware";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const EmptyPage = () => <div className="p-4">Coming soon...</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <header className="py-4 px-6 border-b">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-semibold">Health Tracker</h1>
              <div>
                <SignedOut>
                  <SignInButton mode="modal" />
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/sign-in" />
                </SignedIn>
              </div>
            </div>
          </header>
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
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;