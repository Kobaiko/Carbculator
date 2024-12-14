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
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors group relative ${
            location.pathname === item.path
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }`}
          onClick={() => setOpen(false)}
        >
          <item.icon className="h-5 w-5" />
          <span className="md:hidden md:group-hover:block">{item.name}</span>
          {/* Tooltip for desktop */}
          <span className="hidden md:group-hover:block absolute left-full ml-2 bg-background px-2 py-1 rounded-md shadow-md whitespace-nowrap border z-50">
            {item.name}
          </span>
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
      <div className="hidden md:flex fixed left-0 top-0 h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-r shadow-sm hover:w-64 transition-[width] duration-300 w-16 flex-col py-4">
        <div className="px-2">
          <NavLinks />
        </div>
      </div>
    </>
  );
}