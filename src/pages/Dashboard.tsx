import { Navigate } from "react-router-dom";
import { WorkspaceSwitcher } from "@/components/layout/WorkspaceSwitcher";
import { PersonalDashboard } from "@/components/dashboard/PersonalDashboard";
import { BusinessDashboard } from "@/components/dashboard/BusinessDashboard";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { NeuCard } from "@/components/ui/neu-card";
import { Building2, User, Loader2, AlertCircle } from "lucide-react";
import { NeuIconPill } from "@/components/ui/neu-icon-pill";

const Dashboard = () => {
  const { person, currentWorkspace, isPersonalSpace, isBusinessSpace, isLoading, error } = useWorkspaces();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <NeuCard className="p-8 sm:p-12 max-w-md text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Chargement...</h2>
          <p className="text-sm text-muted-foreground">Chargement de votre espace…</p>
        </NeuCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <NeuCard className="p-8 sm:p-12 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Erreur de chargement</h2>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
          </div>
        </NeuCard>
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
        <SidebarInset className="flex-1 bg-background pl-0 sm:pl-4 lg:pl-6">
          <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
            <NeuCard className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    isPersonalSpace ? "bg-gradient-to-br from-blue-400 to-blue-600" : "bg-gradient-to-br from-green-400 to-green-600"
                  }`}>
                    {isPersonalSpace ? (
                      <User className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    ) : (
                      <Building2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 sm:mb-2 truncate">
                      {isPersonalSpace ? "Espace personnel" : "Espace entreprise"}
                    </p>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 truncate">
                      {isPersonalSpace ? "Espace Personnel" : currentWorkspace?.name || "Espace Entreprise"}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                      {isPersonalSpace
                        ? "Gérez votre foyer, vos revenus et vos obligations fiscales"
                        : "Pilotez vos ventes, votre boutique et vos obligations fiscales"}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <WorkspaceSwitcher />
                </div>
              </div>
            </NeuCard>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8 lg:pb-10 space-y-4 sm:space-y-6 lg:space-y-8 max-w-7xl mx-auto w-full">
            {isPersonalSpace && <PersonalDashboard />}
            {isBusinessSpace && <BusinessDashboard />}
            {!isPersonalSpace && !isBusinessSpace && (
              <NeuCard className="p-6 sm:p-8 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <Building2 className="w-16 h-16 text-muted-foreground/40 mx-auto" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Espace non configuré</h3>
                    <p className="text-sm text-muted-foreground">
                      Cet espace n'est pas encore configuré. Veuillez compléter votre profil.
                    </p>
                  </div>
                </div>
              </NeuCard>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;


