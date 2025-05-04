
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar, 
  ClipboardList, 
  CreditCard, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  User, 
  Users, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  isActive, 
  onClick 
}) => {
  return (
    <button
      className={cn(
        "flex items-center w-full gap-3 px-4 py-3 text-left transition-colors rounded-lg",
        isActive 
          ? "bg-primary text-primary-foreground font-medium" 
          : "hover:bg-accent text-foreground/80 hover:text-foreground"
      )}
      onClick={onClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = window.location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileSidebarOpen(false);
  };

  const employeeNavItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Calendar size={20} />, label: "Attendance", path: "/attendance" },
    { icon: <ClipboardList size={20} />, label: "Leave Requests", path: "/leave" },
    { icon: <CreditCard size={20} />, label: "Payroll", path: "/payroll" },
    { icon: <User size={20} />, label: "Profile", path: "/profile" },
  ];

  const adminNavItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/admin" },
    { icon: <Users size={20} />, label: "Employees", path: "/admin/employees" },
    { icon: <Calendar size={20} />, label: "Attendance", path: "/admin/attendance" },
    { icon: <ClipboardList size={20} />, label: "Leave Requests", path: "/admin/leave" },
    { icon: <CreditCard size={20} />, label: "Payroll", path: "/admin/payroll" },
    { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" },
  ];

  const navItems = isAdmin() ? adminNavItems : employeeNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-card border-r">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-primary">SalaryBox</h1>
          </div>
          
          <div className="flex-1 overflow-auto p-3 space-y-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location === item.path}
                onClick={() => handleNavigation(item.path)}
              />
            ))}
          </div>
          
          <div className="p-3 border-t">
            <div className="flex items-center justify-between mb-4 p-2">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2" 
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative flex flex-col w-full max-w-xs h-full bg-card shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-primary">SalaryBox</h1>
            <button
              className="p-2 text-muted-foreground rounded-md hover:bg-muted"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-3 space-y-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location === item.path}
                onClick={() => handleNavigation(item.path)}
              />
            ))}
          </div>
          
          <div className="p-3 border-t">
            <div className="flex items-center justify-between mb-4 p-2">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2" 
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 -z-10 bg-black/50" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="sticky top-0 z-30 flex h-16 items-center bg-background/95 backdrop-blur border-b px-4 md:px-6">
          <button
            className="md:hidden p-2 mr-2 text-muted-foreground rounded-md hover:bg-muted"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-medium">
            {navItems.find(item => item.path === location)?.label || "Dashboard"}
          </h1>
        </div>
        
        <main className="p-4 md:p-6 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
