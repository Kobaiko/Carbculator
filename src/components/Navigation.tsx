import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, CalendarDays, Droplets, Pizza, Target } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/" },
  { name: "Daily Meals", icon: Pizza, path: "/meals" },
  { name: "Daily Goals", icon: Target, path: "/goals" },
  { name: "Calendar", icon: CalendarDays, path: "/calendar" },
  { name: "Water Intake", icon: Droplets, path: "/water" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
        <div className="px-2">
          <div className="flex flex-col space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <div className="w-16 h-10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-[opacity,visibility] duration-200 group-hover:delay-150 delay-0">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}