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
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            location.pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
          onClick={() => setOpen(false)}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.name}</span>
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
      <div className="hidden md:block fixed right-4 top-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 p-4 rounded-lg border shadow-sm">
        <NavLinks />
      </div>
    </>
  );
}