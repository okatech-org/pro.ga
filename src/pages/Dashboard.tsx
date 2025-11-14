import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  User, 
  Plus, 
  LogOut, 
  FileText,
  TrendingUp,
  Users,
  Calculator
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  
  const [workspaces] = useState<Workspace[]>([
    { id: "perso-1", type: "PERSO", displayName: "Espace Personnel" },
    { id: "entreprise-1", type: "ENTREPRISE", displayName: "Ma Société SARL" },
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Workspace Switcher */}
      <nav className="asted-nav sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-foreground hidden md:block">PRO.GA</span>
            </div>
            
            {/* Workspace Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {currentWorkspace.type === "PERSO" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                  <span>{currentWorkspace.displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Mes Espaces</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {workspaces.map((ws) => (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => setCurrentWorkspace(ws)}
                    className={currentWorkspace.id === ws.id ? "bg-accent" : ""}
                  >
                    {ws.type === "PERSO" ? (
                      <User className="w-4 h-4 mr-2" />
                    ) : (
                      <Building2 className="w-4 h-4 mr-2" />
                    )}
                    {ws.displayName}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une entreprise
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-foreground hover:bg-secondary"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {currentWorkspace.type === "PERSO" ? "Espace Personnel" : "Espace Entreprise"}
          </h1>
          <p className="text-muted-foreground">
            {currentWorkspace.type === "PERSO" 
              ? "Gérez vos revenus, IRPP et emplois à domicile"
              : "Gérez votre boutique, comptabilité et taxes"}
          </p>
        </div>

        {/* Cards Grid */}
        {currentWorkspace.type === "PERSO" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="asted-card p-6 hover:scale-105 transition-all cursor-pointer">
              <Calculator className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                IRPP & Simulation
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Calculez vos impôts sur le revenu
              </p>
              <Button variant="outline" className="w-full">
                Accéder
              </Button>
            </div>

            <div className="asted-card p-6 hover:scale-105 transition-all cursor-pointer">
              <Users className="w-10 h-10 text-success mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Emploi à domicile
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Contrats et fiches de paie
              </p>
              <Button variant="outline" className="w-full">
                Gérer
              </Button>
            </div>

            <div className="asted-card p-6 hover:scale-105 transition-all cursor-pointer">
              <FileText className="w-10 h-10 text-warning mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Documents
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Bulletins, relevés, attestations
              </p>
              <Button variant="outline" className="w-full">
                Voir
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="asted-card p-6 hover:scale-105 transition-all cursor-pointer">
              <Building2 className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ma Boutique
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Gérer produits et commandes
              </p>
              <Button variant="outline" className="w-full">
                Ouvrir
              </Button>
            </div>

            <div className="asted-card p-6 hover:scale-105 transition-all cursor-pointer">
              <TrendingUp className="w-10 h-10 text-success mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Ventes & POS
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Facturation et encaissement
              </p>
              <Button variant="outline" className="w-full">
                Accéder
              </Button>
            </div>

            <div className="asted-card p-6 hover:scale-105 transition-all cursor-pointer">
              <Calculator className="w-10 h-10 text-warning mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                TVA & Taxes
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                TVA, CSS, IS/IMF
              </p>
              <Button variant="outline" className="w-full">
                Calculer
              </Button>
            </div>

            <div className="asted-card p-6 hover:scale-105 transition-all cursor-pointer">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Comptabilité
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                SYSCOHADA simplifié
              </p>
              <Button variant="outline" className="w-full">
                Gérer
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 asted-card p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Actions rapides
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button className="asted-button">
              <Plus className="w-4 h-4 mr-2" />
              {currentWorkspace.type === "PERSO" 
                ? "Nouveau contrat emploi" 
                : "Nouvelle facture"}
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Upload document IA
            </Button>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Simulation fiscale
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
