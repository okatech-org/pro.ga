import { LayoutDashboard, Users, Settings, LogOut, Package } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Produits", url: "/dashboard/products", icon: Package },
  { title: "Clients", url: "/dashboard/clients", icon: Users },
  { title: "Paramètres", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("Déconnecté avec succès");
    }
  };

  return (
    <Sidebar className={open ? "w-60" : "w-14"} collapsible="icon">
      <div className="asted-card m-2 p-4">
        <div className="flex items-center justify-between mb-4">
          {open && (
            <div className="flex items-center gap-2">
              <div className="asted-pill-icon text-primary" style={{ width: 40, height: 40 }}>
                A
              </div>
              <span className="font-bold text-lg">PRO.GA</span>
            </div>
          )}
          <SidebarTrigger className="asted-button-sm" />
        </div>

        {open && (
          <div className="mb-4">
            <ThemeToggle />
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="asted-button-flat hover:bg-muted/50"
                      activeClassName="asted-button-primary"
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="asted-button-danger">
                  <LogOut className="h-4 w-4" />
                  {open && <span>Déconnexion</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
