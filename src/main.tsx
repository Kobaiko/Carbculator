import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import App from './App.tsx'
import './index.css'
import { supabase } from "@/integrations/supabase/client";

createRoot(document.getElementById("root")!).render(
  <SessionContextProvider supabaseClient={supabase}>
    <App />
  </SessionContextProvider>
);