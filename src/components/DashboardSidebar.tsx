import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Calculator,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  Store,
  Users,
  Building2,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NeuCard } from "@/components/ui/neu-card";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { clearDemoModeState } from "@/lib/demoState";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type MenuSection = {
  label: string;
  items: MenuItem[];
};

const navigationItems: MenuItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Copilote IA", href: "/dashboard/ia", icon: Sparkles },
];

const personalItems: MenuItem[] = [
  { label: "IRPP & Revenus", href: "/dashboard/perso/irpp", icon: FileText },
  { label: "Emploi à domicile", href: "/dashboard/perso/emploi", icon: Users },
];

const businessItems: MenuItem[] = [
  { label: "Factures & POS", href: "/dashboard/business/factures", icon: FileText },
  { label: "Point de vente", href: "/dashboard/business/pos", icon: Store },
  { label: "Boutique en ligne", href: "/dashboard/business/boutique", icon: Activity },
  { label: "Comptabilité", href: "/dashboard/business/compta", icon: Calculator },
];

const financeItems: MenuItem[] = [
  { label: "Simulations fiscales", href: "/dashboard/taxes", icon: Calculator },
];

const actionsItems: MenuItem[] = [
  { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { person, currentWorkspace, isPersonalSpace, isBusinessSpace } = useWorkspaces();

  const menuSections = useMemo(() => {
    const sections: MenuSection[] = [
      { label: "NAVIGATION", items: navigationItems },
    ];

    if (isPersonalSpace) {
      sections.push({ label: "ESPACE PERSONNEL", items: personalItems });
    }

    if (isBusinessSpace) {
      sections.push({ label: "ESPACE ENTREPRISE", items: businessItems });
    }

    sections.push(
      { label: "FINANCES & FISCALITÉ", items: financeItems },
      { label: "ACTIONS & GESTION", items: actionsItems }
    );

    return sections;
  }, [isPersonalSpace, isBusinessSpace]);

  return (
    <Sidebar className="w-[300px] bg-transparent border-r-0 text-slate-800 overflow-visible">
      <div className="h-full flex flex-col gap-6 p-6 pl-7 pr-6 pb-6 overflow-visible">
        {/* Header */}
        <SidebarHeader className="p-0">
          <NeuCard className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                isPersonalSpace 
                  ? "bg-gradient-to-br from-blue-400 to-blue-600" 
                  : "bg-gradient-to-br from-green-400 to-green-600"
              }`}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-slate-900 leading-tight truncate">PRO.GA</h2>
                <p className="text-xs text-slate-500 truncate">
                  {isPersonalSpace ? "Espace Personnel" : "Espace Entreprise"}
                </p>
              </div>
            </div>
          </NeuCard>
        </SidebarHeader>

        {/* Menu Content */}
        <SidebarContent className="flex-1 overflow-y-auto overflow-x-visible space-y-6 py-4 pr-2 pl-0">
          {menuSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="px-2 mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                {section.label}
              </h3>
              <NeuCard className="p-3 space-y-1.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === "/dashboard"}
                    className="nav-menu-item flex items-center gap-3 rounded-full px-4 py-2.5 text-base font-normal text-slate-900 hover:bg-white/40 transition-all duration-200 group relative"
                    activeClassName=""
                  >
                    <div className="nav-menu-icon flex items-center justify-center flex-shrink-0 transition-all duration-200">
                      <item.icon className="w-5 h-5 flex-shrink-0 stroke-[1.8]" />
                    </div>
                    <span className="truncate flex-1 min-w-0">{item.label}</span>
                  </NavLink>
                ))}
              </NeuCard>
            </div>
          ))}
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-0">
          <NeuCard className="p-5 space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-1 truncate">Connecté en tant que</p>
              <p className="text-sm font-bold text-slate-900 truncate">
                {person?.email || "marie.dupont@pro.ga"}
              </p>
            </div>
            
            <button
              onClick={async () => {
                try {
                  clearDemoModeState();
                  await supabase.auth.signOut();
                  toast.success("Déconnexion effectuée");
                  navigate("/auth");
                } catch (error) {
                  console.error(error);
                  toast.error("Impossible de se déconnecter");
                }
              }}
              className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-base text-slate-900 hover:bg-white/40 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 stroke-[1.8]" />
              <span className="truncate">Déconnexion</span>
            </button>
          </NeuCard>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

