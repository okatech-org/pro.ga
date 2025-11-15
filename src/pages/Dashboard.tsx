import { Navigate } from "react-router-dom";
import { WorkspaceSwitcher } from "@/components/layout/WorkspaceSwitcher";
import { PersonalDashboard } from "@/components/dashboard/PersonalDashboard";
import { BusinessDashboard } from "@/components/dashboard/BusinessDashboard";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { NeuCard } from "@/components/ui/neu-card";
import { Building2, User, Shield } from "lucide-react";
import { NeuIconPill } from "@/components/ui/neu-icon-pill";

const Dashboard = () => {
  const { person, currentWorkspace, isPersonalSpace, isBusinessSpace, isLoading } = useWorkspaces();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary/50 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Chargement de votre espace…</p>
        </div>
      </div>
    );
  }

  if (!currentWorkspace) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1 bg-background pl-4 lg:pl-6">
          <header className="px-8 pt-8">
            <NeuCard className="p-8">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    isPersonalSpace ? "bg-gradient-to-br from-blue-400 to-blue-600" : "bg-gradient-to-br from-green-400 to-green-600"
                  }`}>
                    {isPersonalSpace ? (
                      <User className="w-8 h-8 text-white" />
                    ) : (
                      <Building2 className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">
                      {isPersonalSpace ? "Espace personnel" : "Espace entreprise"}
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1 truncate">
                      {isPersonalSpace ? "Espace Personnel" : currentWorkspace?.name || "Espace Entreprise"}
                    </h1>
                    <p className="text-sm text-slate-500">
                      {isPersonalSpace
                        ? "Gérez votre foyer, vos revenus et vos obligations fiscales"
                        : "Pilotez vos ventes, votre boutique et vos obligations fiscales"}
                    </p>
                  </div>
                </div>
                <WorkspaceSwitcher />
              </div>
            </NeuCard>
          </header>

          <main className="px-8 pt-6 pb-10 space-y-8 max-w-7xl mx-auto w-full">
            {isPersonalSpace && <PersonalDashboard />}
            {isBusinessSpace && <BusinessDashboard />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;


