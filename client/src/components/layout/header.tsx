import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobile } from "@/hooks/use-mobile";
import { User, LogOut, Menu, X } from "lucide-react";

export default function Header() {
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMobile();

  // Close mobile menu on window resize
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Sri Lanka Railways Logo" className="w-16 h-16" />
              <div>
                <span className="font-heading font-bold text-lg text-primary">Sri Lanka</span>
                <span className="font-heading font-bold text-lg text-primary">Railways</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <a className="font-medium text-neutral-900 hover:text-primary transition-colors">Home</a>
            </Link>
            <Link href="/#schedules">
              <a className="font-medium text-neutral-600 hover:text-primary transition-colors">Schedules</a>
            </Link>
            {user && (
              <Link href="/profile">
                <a className="font-medium text-neutral-600 hover:text-primary transition-colors">My Bookings</a>
              </Link>
            )}
            <a href="#" className="font-medium text-neutral-600 hover:text-primary transition-colors">About</a>
            <a href="#" className="font-medium text-neutral-600 hover:text-primary transition-colors">Contact</a>
          </nav>
          
          <div className="flex items-center gap-3">
            {/* User Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-primary hover:bg-secondary-dark text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    My Profile
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="bg-secondary hover:bg-secondary-dark text-white"
                onClick={() => navigate("/auth")}
              >
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Account</span>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-2">
          <Link href="/">
            <a className="block py-2 font-medium text-primary">Home</a>
          </Link>
          <Link href="/#schedules">
            <a className="block py-2 font-medium text-neutral-600 hover:text-primary">Schedules</a>
          </Link>
          {user && (
            <Link href="/profile">
              <a className="block py-2 font-medium text-neutral-600 hover:text-primary">My Bookings</a>
            </Link>
          )}
          <a href="#" className="block py-2 font-medium text-neutral-600 hover:text-primary">About</a>
          <a href="#" className="block py-2 font-medium text-neutral-600 hover:text-primary">Contact</a>
        </div>
      )}
    </header>
  );
}
