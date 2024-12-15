import { Routes, Route, Navigate } from "react-router-dom";
import { AuthMiddleware } from "../auth/AuthMiddleware";
import { LoginPage } from "../auth/LoginPage";
import { SignUpPage } from "../auth/SignUpPage";
import { OnboardingPage } from "../auth/OnboardingPage";
import Index from "../../pages/Index";
import DailyMeals from "../../pages/DailyMeals";
import DailyGoals from "../../pages/DailyGoals";
import Profile from "../../pages/Profile";
import Calendar from "../../pages/Calendar";
import WaterIntake from "../../pages/WaterIntake";
import { useSession } from '@supabase/auth-helpers-react';

export const AppRoutes = () => {
  const session = useSession();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!session ? <LoginPage /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/signup" 
        element={!session ? <SignUpPage /> : <Navigate to="/onboarding" replace />} 
      />
      <Route
        path="/onboarding"
        element={
          <AuthMiddleware>
            <OnboardingPage />
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
            <DailyMeals />
          </AuthMiddleware>
        }
      />
      <Route
        path="/goals"
        element={
          <AuthMiddleware>
            <DailyGoals />
          </AuthMiddleware>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthMiddleware>
            <Profile />
          </AuthMiddleware>
        }
      />
      <Route
        path="/calendar"
        element={
          <AuthMiddleware>
            <Calendar />
          </AuthMiddleware>
        }
      />
      <Route
        path="/water"
        element={
          <AuthMiddleware>
            <WaterIntake />
          </AuthMiddleware>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}