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
          <NeuCard className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center shadow-lg flex-shrink-0 ${
                isPersonalSpace 
                  ? "bg-gradient-to-br from-[#4A90E2] to-[#357ABD]" 
                  : "bg-gradient-to-br from-green-400 to-green-600"
              }`}>
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-slate-900 leading-tight truncate">PRO.GA</h2>
                <p className="text-sm text-slate-500 truncate mt-0.5">
                  {isPersonalSpace ? "Espace Personnel" : "Espace Entreprise"}
                </p>
              </div>
            </div>
          </NeuCard>
        </SidebarHeader>

        {/* Menu Content */}
        <SidebarContent className="flex-1 overflow-y-auto overflow-x-visible py-4 pr-2 pl-0">
          <NeuCard className="p-5 space-y-6">
            {menuSections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="px-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  {section.label}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === "/dashboard"}
                      className="flex items-center gap-4 px-4 py-3 text-base font-normal text-slate-900 hover:bg-white/40 rounded-xl transition-all duration-200"
                      activeClassName=""
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 stroke-[1.8]" />
                      <span className="truncate flex-1 min-w-0">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </NeuCard>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-0">
          <NeuCard className="p-5 space-y-3">
            <div>
              <p className="text-xs text-slate-400 mb-1.5 truncate">Connecté en tant que</p>
              <p className="text-base font-bold text-slate-900 truncate">
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
              className="w-full flex items-center gap-4 px-4 py-3 text-base text-slate-900 hover:bg-white/40 rounded-xl transition-all duration-200"
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

