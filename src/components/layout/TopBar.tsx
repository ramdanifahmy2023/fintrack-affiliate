import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, Moon, Sun, User as UserIcon, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const TopBar = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout berhasil. Sampai jumpa!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal logout. Silakan coba lagi.");
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      superadmin: "Superadmin",
      leader: "Leader", 
      admin: "Admin",
      staff: "Staff",
      viewer: "Viewer",
    };
    return roleMap[role] || role;
  };

  const getJobPositionDisplay = (position: string) => {
    const positionMap: Record<string, string> = {
      'Superadmin': 'Superadmin',
      'Leader': 'Team Leader',
      'Admin': 'Administrator',
      'Host Live': 'Live Host',
      'Kreator': 'Content Creator',
      'Viewer': 'Viewer',
    };
    return positionMap[position] || position;
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            FAHMYID Digital Marketing
          </h2>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Sistem Manajemen Affiliate Marketing
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white">
            3
          </span>
        </Button>

        {/* Theme Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Terang
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Gelap
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <UserIcon className="mr-2 h-4 w-4" />
              Sistem
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-3 py-2 h-auto">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.profile?.avatar_url || ""}
                  alt={user?.profile?.full_name || user?.email || ""}
                />
                <AvatarFallback className="text-xs font-medium">
                  {user?.profile?.full_name 
                    ? getUserInitials(user.profile.full_name)
                    : user?.email?.charAt(0).toUpperCase() || "U"
                  }
                </AvatarFallback>
              </Avatar>
              
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium leading-tight">
                  {user?.profile?.full_name || user?.email?.split('@')[0] || "User"}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {user?.profile?.role 
                    ? getRoleDisplay(user.profile.role)
                    : "Loading..."
                  }
                  {user?.profile?.job_position && (
                    <span className="text-muted-foreground/60">
                      {" • "}{getJobPositionDisplay(user.profile.job_position)}
                    </span>
                  )}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">
                {user?.profile?.full_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
              {user?.profile?.group_id && (
                <p className="text-xs text-muted-foreground">
                  Group ID: {user.profile.group_id}
                </p>
              )}
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <Settings className="mr-2 h-4 w-4" />
              Pengaturan Akun
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};