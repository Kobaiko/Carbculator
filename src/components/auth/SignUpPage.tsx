import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const SignUpPage = () => {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        const error = new URL(window.location.href).searchParams.get('error_description');
        if (error) {
          let title = "Error";
          let description = error;

          // Map common error messages to user-friendly versions
          if (error.includes('User already registered')) {
            title = "Account Already Exists";
            description = "An account with this email already exists. Please sign in instead.";
          } else if (error.includes('Invalid email')) {
            title = "Invalid Email";
            description = "Please enter a valid email address.";
          } else if (error.includes('Password should be')) {
            title = "Password Requirements";
            description = "Your password must be at least 6 characters long and include: one uppercase letter, one lowercase letter, and one special character.";
          } else if (error.includes('Password is too short')) {
            title = "Password Too Short";
            description = "Your password must be at least 6 characters long.";
          }

          toast({
            title,
            description,
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Welcome to Carbculator</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign up to continue</p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside mt-1">
              <li>At least 6 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One special character</li>
            </ul>
          </div>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              message: {
                color: 'red',
              },
            },
          }}
          theme="light"
          providers={[]}
          view="sign_up"
        />
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};