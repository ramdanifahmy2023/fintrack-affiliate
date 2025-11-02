import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Clock,
  DollarSign,
  Wallet,
  Building2,
  CreditCard,
  Package,
  Smartphone,
  Users,
  FolderKanban,
  BookOpen,
  BarChart3,
  Target,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Utama",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Performa Tim", url: "/performance", icon: TrendingUp },
      { title: "Laporan Harian", url: "/daily-report", icon: FileText },
      { title: "Absensi", url: "/attendance", icon: Clock },
    ],
  },
  {
    title: "Keuangan",
    items: [
      { title: "Data Komisi", url: "/commission", icon: DollarSign },
      { title: "Cashflow", url: "/cashflow", icon: Wallet },
      { title: "Laba Rugi", url: "/profit-loss", icon: BarChart3 },
      { title: "Hutang Piutang", url: "/debt-receivable", icon: CreditCard },
    ],
  },
  {
    title: "Manajemen",
    items: [
      { title: "Karyawan", url: "/employees", icon: Users },
      { title: "Device", url: "/devices", icon: Smartphone },
      { title: "Akun Affiliate", url: "/accounts", icon: Package },
      { title: "Group", url: "/groups", icon: FolderKanban },
      { title: "Asset", url: "/assets", icon: Building2 },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { title: "Knowledge Base", url: "/knowledge", icon: BookOpen },
      { title: "Target KPI", url: "/kpi", icon: Target },
      { title: "Pengaturan", url: "/profile", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-accent text-accent-foreground font-medium"
      : "hover:bg-accent/50 hover:text-accent-foreground";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-6">
          {open ? (
            <h1 className="text-lg font-bold text-primary">FAHMYID</h1>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground font-bold">
              F
            </div>
          )}
        </div>

        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavClass}>
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
