import { supabase } from "@/integrations/supabase/client";

export const AppHeader = () => {
  return (
    <header className="py-4 px-6 border-b">
      <div className="max-w-7xl mx-auto flex justify-end items-center">
        <button 
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};