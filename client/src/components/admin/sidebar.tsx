import { ReactNode, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Train,
  Ticket,
  Users,
  FileBarChart,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();
  
  // Navigation items
  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      label: "Trains",
      icon: <Train className="h-5 w-5" />,
      href: "/admin/trains",
    },
    {
      label: "Bookings",
      icon: <Ticket className="h-5 w-5" />,
      href: "/admin/bookings",
    },
    {
      label: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/users",
    },
    {
      label: "Reports",
      icon: <FileBarChart className="h-5 w-5" />,
      href: "/admin/reports",
    },
  ];
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Close sidebar when navigating on mobile
  const handleNavigation = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          ${sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:z-0
          bg-secondary text-white flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-secondary-dark flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white text-lg">
              <i className="fas fa-train"></i>
            </div>
            <div className="font-heading font-bold">Admin Panel</div>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={handleNavigation}
                >
                  <a
                    className={`
                      flex items-center px-3 py-2 rounded-md transition-colors
                      ${isActive 
                        ? "bg-primary text-white" 
                        : "text-white/70 hover:text-white hover:bg-secondary-dark"}
                    `}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </a>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        
        {/* User & Logout */}
        <div className="p-4 border-t border-secondary-dark">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
              <span className="font-medium text-white">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium">{user?.username}</div>
              <div className="text-xs text-white/70">Administrator</div>
            </div>
          </div>
          
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            variant="outline"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 sticky top-0 z-30">
          <div className="flex items-center gap-4 w-full">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <div className="flex-1">
              <span className="text-sm text-neutral-500">
                {navItems.find(item => item.href === location)?.label || "Admin Panel"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  View Website
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
