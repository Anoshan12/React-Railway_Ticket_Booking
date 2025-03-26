import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Train,
  Ticket,
  Users,
  BarChart,
  Settings,
  Menu,
  X,
  LogOut,
  Gauge
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AdminLayoutProps = {
  children: ReactNode;
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const sidebarItems = [
    { path: "/admin", icon: <Gauge className="mr-3 h-5 w-5" />, label: "Dashboard" },
    { path: "/admin/trains", icon: <Train className="mr-3 h-5 w-5" />, label: "Train Management" },
    { path: "/admin/bookings", icon: <Ticket className="mr-3 h-5 w-5" />, label: "Booking Management" },
    { path: "/admin/users", icon: <Users className="mr-3 h-5 w-5" />, label: "User Management" },
    { path: "/admin/reports", icon: <BarChart className="mr-3 h-5 w-5" />, label: "Reports" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-primary shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <div className="flex items-center cursor-pointer">
                    <Train className="h-6 w-6 text-white mr-2" />
                    <span className="font-bold text-xl text-white">SLR Admin</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="md:hidden">
                <button
                  type="button"
                  className="p-2 rounded-md text-white hover:text-gray-200 focus:outline-none"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
              <div className="hidden md:flex md:items-center">
                <span className="text-white mr-4">Admin Panel</span>
                <Button
                  variant="ghost"
                  className="p-1 rounded-full text-white hover:text-gray-200 focus:outline-none"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto bg-white shadow">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {sidebarItems.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <a
                        className={`${
                          isActive(item.path)
                            ? "bg-secondary text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                      >
                        {item.icon}
                        {item.label}
                      </a>
                    </Link>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded-md"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </Button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-shrink-0 flex items-center px-4">
                <Train className="h-6 w-6 text-secondary mr-2" />
                <span className="font-bold text-xl text-primary">SLR Admin</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {sidebarItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a
                      className={`${
                        isActive(item.path)
                          ? "bg-secondary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded-md"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </Button>
                </div>
              </nav>
            </div>
            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
