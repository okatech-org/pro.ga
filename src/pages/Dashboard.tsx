import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Calculator,
  Building2,
  User,
  Plus
} from "lucide-react";

type WorkspaceType = "PERSO" | "ENTREPRISE";

interface Workspace {
  id: string;
  type: WorkspaceType;
  displayName: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>({
    id: "perso-1",
    type: "PERSO",
    displayName: "Espace Personnel"
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const stats = [
    {
      icon: TrendingUp,
      label: "Chiffre d'affaires",
      value: "0 FCFA",
      color: "var(--asted-primary-500)"
    },
    {
      icon: FileText,
      label: "Factures",
      value: "0",
      color: "var(--asted-success-500)"
    },
    {
      icon: Users,
      label: "Clients",
      value: "0",
      color: "var(--asted-info-500)"
    },
    {
      icon: Calculator,
      label: "Devis",
      value: "0",
      color: "var(--asted-warning-500)"
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <main className="flex-1 p-6" style={{ background: "var(--asted-bg-base)" }}>
          {/* Header */}
          <header className="asted-card mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="asted-button-sm lg:hidden" />
                {currentWorkspace.type === "PERSO" ? (
                  <User className="w-8 h-8" style={{ color: "var(--asted-primary-500)" }} />
                ) : (
                  <Building2 className="w-8 h-8" style={{ color: "var(--asted-primary-500)" }} />
                )}
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: "var(--asted-text-primary)" }}>
                    {currentWorkspace.displayName}
                  </h1>
                  <p className="text-sm" style={{ color: "var(--asted-text-tertiary)" }}>
                    Tableau de bord
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="asted-card asted-card-hover">
                <div className="flex items-center gap-4">
                  <div 
                    className="asted-pill-icon"
                    style={{ 
                      width: 50, 
                      height: 50,
                      color: stat.color
                    }}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "var(--asted-text-tertiary)" }}>
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold" style={{ color: "var(--asted-text-primary)" }}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="asted-card">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--asted-text-primary)" }}>
              Activité récente
            </h2>
            <div className="asted-card-inset p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--asted-text-tertiary)" }} />
              <p style={{ color: "var(--asted-text-secondary)" }}>
                Aucune activité récente
              </p>
              <p className="text-sm mt-2" style={{ color: "var(--asted-text-tertiary)" }}>
                Commencez par créer votre première facture ou devis
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <button className="asted-button asted-button-primary">
              <Plus className="w-4 h-4" />
              <span>Nouvelle facture</span>
            </button>
            <button className="asted-button asted-button-secondary">
              <FileText className="w-4 h-4" />
              <span>Nouveau devis</span>
            </button>
            <button className="asted-button">
              <Users className="w-4 h-4" />
              <span>Ajouter un client</span>
            </button>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
