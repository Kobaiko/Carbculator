import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, CalendarDays, GlassWater, Pizza, Target, UserCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Daily Meals", icon: Pizza, path: "/meals" },
  { name: "Daily Goals", icon: Target, path: "/goals" },
  { name: "Calendar", icon: CalendarDays, path: "/calendar" },
  { name: "Water Intake", icon: GlassWater, path: "/water" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const session = useSession();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const NavLinks = () => (
    <div className="flex flex-col space-y-3">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            location.pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
          onClick={() => setOpen(false)}
        >
          <div className="w-5 h-5">
            <item.icon className="h-5 w-5" />
          </div>
          <span className="ml-3 md:hidden">{item.name}</span>
        </Link>
      ))}
      <div className="mt-auto">
        <Separator className="my-3" />
        <Link
          to="/profile"
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            location.pathname === "/profile"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
          onClick={() => setOpen(false)}
        >
          {profile?.avatar_url ? (
            <Avatar className="h-5 w-5">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>
                {profile.username?.[0]?.toUpperCase() || <UserCircle2 className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>
          ) : (
            <UserCircle2 className="h-5 w-5" />
          )}
          <span className="ml-3 md:hidden">Profile</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu (Hamburger) */}
      <div className="md:hidden fixed left-4 top-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="mt-8">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex fixed left-0 top-0 h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-r shadow-sm hover:w-64 transition-[width] duration-300 w-16 flex-col py-4 group">
        <div className="flex flex-col h-full space-y-3 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="absolute left-12 whitespace-nowrap opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-[opacity,visibility] duration-200 group-hover:delay-150 delay-0">
                {item.name}
              </span>
            </Link>
          ))}
          <div className="mt-auto">
            <Separator className="my-3" />
            <Link
              to="/profile"
              className={`relative flex items-center rounded-lg transition-colors ${
                location.pathname === "/profile"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback>
                      {profile.username?.[0]?.toUpperCase() || <UserCircle2 className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <UserCircle2 className="h-5 w-5" />
                )}
              </div>
              <span className="absolute left-12 whitespace-nowrap opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-[opacity,visibility] duration-200 group-hover:delay-150 delay-0">
                Profile
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}