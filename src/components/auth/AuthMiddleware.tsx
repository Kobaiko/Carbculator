import { useSession } from '@supabase/auth-helpers-react';
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

export function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const session = useSession();
  const location = useLocation();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkProfile() {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('height')
          .eq('id', session.user.id)
          .single();
        
        setHasProfile(!!data?.height);
      }
    }
    
    checkProfile();
  }, [session]);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Only redirect to onboarding if we've checked the profile and it's not complete
  if (hasProfile === false && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Only show onboarding page if profile is not complete
  if (hasProfile === true && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}