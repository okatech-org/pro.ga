import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuStatCard } from "@/components/ui/neu-stat-card";
import { NeuProfileCard } from "@/components/ui/neu-profile-card";
import { NeuIconPill } from "@/components/ui/neu-icon-pill";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText,
  Crown,
  ScrollText,
  Folder,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Globe
} from "lucide-react";

export default function AdminGaDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <NeuCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="neu-button p-3">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <NeuIconPill icon={Building2} color="primary" size="md" />
              <div>
                <h1 className="text-2xl font-bold">Comptes Démo - Accès Direct</h1>
                <p className="text-sm text-muted-foreground">
                  Découvrez ADMIN.GA avec différents profils d'utilisateurs
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </NeuCard>

        <NeuCard className="p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Explorez les Fonctionnalités d'ADMIN.GA
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Chaque compte démo vous permet d'accéder directement au système avec un profil spécifique de la
            fonction publique gabonaise. Découvrez les interfaces, fonctionnalités et permissions correspondant à
            chaque rôle.
          </p>
          
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Accès instantané</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Données fictives</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Aucune inscription</span>
            </div>
          </div>
        </NeuCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NeuProfileCard
            title="Ministre de la Fonction Publique"
            subtitle="MINISTRE"
            description="Autorité politique suprême du ministère, définit les orientations stratégiques"
            icon={Crown}
            iconColor="primary"
            attributions={[
              "Vision stratégique et orientations politiques",
              "Validation des grandes réformes",
              "Arbitrage des décisions majeures",
              "Tableaux de bord exécutifs"
            ]}
          />

          <NeuProfileCard
            title="Secrétaire Général du Ministère"
            subtitle="SECRETAIRE_GENERAL"
            description="Coordination administrative et supervision de l'ensemble des services du ministère"
            icon={ScrollText}
            iconColor="info"
            attributions={[
              "Coordination des directions du ministère",
              "Supervision administrative générale",
              "Préparation des conseils ministériels",
              "Suivi des directives ministérielles"
            ]}
          />

          <NeuProfileCard
            title="Directeur de Cabinet"
            subtitle="DIRECTEUR_CABINET"
            description="Bras droit du Ministre, gère le cabinet politique et les relations institutionnelles"
            icon={Folder}
            iconColor="warning"
            attributions={[
              "Coordination du cabinet ministériel",
              "Relations avec les institutions",
              "Préparation des dossiers ministériels",
              "Interface politique et administrative"
            ]}
          />
        </div>

        <div className="h-px bg-border my-8" />

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Espace Ministre</h2>
              <p className="text-sm text-muted-foreground">
                Ministère de la Fonction Publique - République Gabonaise
              </p>
            </div>
            <NeuIconPill icon={Building2} color="success" size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <NeuStatCard
              title="Total Agents"
              value="0"
              subtitle="Fonction publique gabonaise"
              icon={Users}
              iconColor="success"
            />
            <NeuStatCard
              title="Structures"
              value="0"
              subtitle="Ministères et directions"
              icon={Building2}
              iconColor="info"
            />
            <NeuStatCard
              title="Postes Vacants"
              value="0"
              subtitle="Sur 0 postes"
              icon={Briefcase}
              iconColor="primary"
            />
            <NeuStatCard
              title="Actes en attente"
              value="0"
              subtitle="Nécessitent votre validation"
              icon={FileText}
              iconColor="warning"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeuCard className="p-6">
              <h3 className="text-lg font-bold mb-2">Répartition par Type d'Agent</h3>
              <p className="text-sm text-muted-foreground mb-6">Catégories de personnels</p>
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune donnée disponible</p>
                </div>
              </div>
            </NeuCard>

            <NeuCard className="p-6">
              <h3 className="text-lg font-bold mb-2">Équilibre Homme/Femme</h3>
              <p className="text-sm text-muted-foreground mb-6">Répartition par genre</p>
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune donnée disponible</p>
                </div>
              </div>
            </NeuCard>
          </div>
        </div>

        <div className="h-px bg-border my-8" />

        <NeuCard className="p-12 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 via-purple-500 to-cyan-400 flex items-center justify-center">
              <Globe className="w-12 h-12 text-white" />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Portail Digital Officiel
            </p>
            <h2 className="text-3xl font-bold mb-4">
              ADMIN.GA – La Fonction Publique gabonaise, au service du citoyen
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Digitalisation des démarches, simplification des procédures, transparence et
              modernisation : ADMIN.GA centralise la gestion des agents publics et l'accès aux
              concours de la Fonction Publique.
            </p>
            <p className="text-sm italic text-muted-foreground mt-4">
              « Servir l'État, c'est servir chaque citoyen. »
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <NeuButton variant="admin" className="px-8">
              Je suis fonctionnaire
            </NeuButton>
            <NeuButton variant="citizen" className="px-8">
              Je suis citoyen / candidat
            </NeuButton>
          </div>
        </NeuCard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <NeuCard className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Agents recensés</p>
            <p className="text-3xl font-bold mb-2">92 000+</p>
            <p className="text-xs text-muted-foreground">Fonctionnaires et contractuels</p>
            <div className="mt-4">
              <NeuIconPill icon={Users} color="success" size="sm" />
            </div>
          </NeuCard>

          <NeuCard className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Concours ouverts</p>
            <p className="text-3xl font-bold mb-2">3</p>
            <p className="text-xs text-muted-foreground">Inscriptions en ligne</p>
            <div className="mt-4">
              <NeuIconPill icon={FileText} color="warning" size="sm" />
            </div>
          </NeuCard>

          <NeuCard className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Actes traités</p>
            <p className="text-3xl font-bold mb-2">1 248</p>
            <p className="text-xs text-muted-foreground">Titularisations, promotions...</p>
            <div className="mt-4">
              <NeuIconPill icon={FileCheck} color="success" size="sm" />
            </div>
          </NeuCard>

          <NeuCard className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Services en ligne</p>
            <p className="text-3xl font-bold mb-2">15+</p>
            <p className="text-xs text-muted-foreground">Démarches dématérialisées</p>
            <div className="mt-4">
              <NeuIconPill icon={Globe} color="info" size="sm" />
            </div>
          </NeuCard>
        </div>
      </div>
    </div>
  );
}

