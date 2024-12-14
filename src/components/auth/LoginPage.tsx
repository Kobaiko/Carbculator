import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const LoginPage = () => {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        const error = new URL(window.location.href).searchParams.get('error_description');
        if (error) {
          let title = "Error";
          let description = error;

          // Map common error messages to user-friendly versions
          if (error.includes('Invalid login credentials')) {
            title = "Invalid Credentials";
            description = "The email or password you entered is incorrect. Please try again.";
          } else if (error.includes('Email not confirmed')) {
            title = "Email Not Verified";
            description = "Please check your email and click the verification link to complete your registration.";
          } else if (error.includes('Invalid email')) {
            title = "Invalid Email";
            description = "Please enter a valid email address.";
          } else if (error.includes('Password is too short')) {
            title = "Invalid Password";
            description = "Please enter your password correctly.";
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
          <h1 className="text-2xl font-semibold">Welcome Back to Carbculator</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue</p>
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
          view="sign_in"
        />
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};