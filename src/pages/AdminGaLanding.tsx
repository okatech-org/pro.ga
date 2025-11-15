import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuIconPill } from "@/components/ui/neu-icon-pill";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Users, 
  FileText,
  TrendingUp,
  Globe,
  Building2,
  FileCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminGaLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <NeuCard className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                GA
              </div>
              <div>
                <h1 className="text-2xl font-bold">ADMIN.GA – Portail de la Fonction Publique</h1>
                <p className="text-sm text-muted-foreground">
                  Plateforme officielle du Ministère de la Fonction Publique de la République Gabonaise
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <ThemeToggle />
              <NeuButton variant="admin" className="px-6">
                Connexion administration
              </NeuButton>
              <NeuButton variant="citizen" className="px-6">
                Connexion agent / citoyen
              </NeuButton>
            </div>
          </div>
        </NeuCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Portail Digital Officiel
              </p>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                ADMIN.GA – La Fonction Publique gabonaise, au service du citoyen
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Digitalisation des démarches, simplification des procédures, transparence et
                modernisation : ADMIN.GA centralise la gestion des agents publics et l'accès aux
                concours de la Fonction Publique.
              </p>
              <p className="text-sm italic text-muted-foreground mt-4">
                « Servir l'État, c'est servir chaque citoyen. »
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <NeuButton 
                variant="admin" 
                className="px-8"
                onClick={() => navigate("/admin-ga-demo")}
              >
                Je suis fonctionnaire
              </NeuButton>
              <NeuButton 
                variant="citizen" 
                className="px-8"
                onClick={() => navigate("/admin-ga-demo")}
              >
                Je suis citoyen / candidat
              </NeuButton>
            </div>
          </div>

          <div className="relative">
            <NeuCard className="aspect-[4/3] bg-gradient-to-br from-muted/50 to-background flex items-center justify-center overflow-hidden">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 via-purple-500 to-cyan-400 flex items-center justify-center">
                <Globe className="w-16 h-16 text-white" />
              </div>
            </NeuCard>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NeuCard className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Agents recensés</p>
                <p className="text-3xl font-bold">92 000+</p>
              </div>
              <NeuIconPill icon={Users} color="success" size="md" />
            </div>
            <p className="text-xs text-muted-foreground">Fonctionnaires et contractuels</p>
          </NeuCard>

          <NeuCard className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Concours ouverts</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <NeuIconPill icon={FileText} color="warning" size="md" />
            </div>
            <p className="text-xs text-muted-foreground">Inscriptions en ligne</p>
          </NeuCard>

          <NeuCard className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Actes traités</p>
                <p className="text-3xl font-bold">1 248</p>
              </div>
              <NeuIconPill icon={FileCheck} color="success" size="md" />
            </div>
            <p className="text-xs text-muted-foreground">Titularisations, promotions...</p>
          </NeuCard>

          <NeuCard className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Services en ligne</p>
                <p className="text-3xl font-bold">15+</p>
              </div>
              <NeuIconPill icon={TrendingUp} color="info" size="md" />
            </div>
            <p className="text-xs text-muted-foreground">Démarches dématérialisées</p>
          </NeuCard>
        </div>

        <NeuCard className="p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Comprendre la Fonction Publique gabonaise
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Organisation, carrières, statuts et démarches administratives pour les agents et
            les citoyens candidats aux concours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <NeuCard variant="inset" className="p-6">
              <Building2 className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Organigramme</h3>
              <p className="text-sm text-muted-foreground">
                Découvrez la structure des ministères et directions
              </p>
            </NeuCard>

            <NeuCard variant="inset" className="p-6">
              <Users className="w-10 h-10 text-success mx-auto mb-3" />
              <h3 className="font-bold mb-2">Carrière</h3>
              <p className="text-sm text-muted-foreground">
                Évolution, grilles salariales et promotions
              </p>
            </NeuCard>

            <NeuCard variant="inset" className="p-6">
              <FileText className="w-10 h-10 text-info mx-auto mb-3" />
              <h3 className="font-bold mb-2">Concours</h3>
              <p className="text-sm text-muted-foreground">
                Consultez les concours ouverts et inscrivez-vous
              </p>
            </NeuCard>
          </div>
        </NeuCard>

        <footer className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">GA</span>
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                Ministère de la Fonction Publique - République Gabonaise
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 ADMIN.GA. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

