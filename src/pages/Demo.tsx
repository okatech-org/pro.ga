import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuIconPill } from "@/components/ui/neu-icon-pill";
import { useDemoLogin } from "@/hooks/useDemoLogin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Shield, 
  User, 
  ShoppingBag, 
  Scissors, 
  Apple, 
  UtensilsCrossed,
  Briefcase,
  Check,
  Building2,
  ArrowRight,
  TrendingUp,
  FileText,
  Calculator,
  type LucideIcon,
} from "lucide-react";

interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface DemoData {
  label: string;
  value: string;
}

interface DemoAccountProps {
  accountType: string;
  icon: LucideIcon;
  title: string;
  category: string;
  description: string;
  features: string[];
  color: string;
  workflow: WorkflowStep[];
  demoData: DemoData[];
  screenshot?: string;
}

const DemoAccountCard = ({ 
  accountType,
  icon, 
  title, 
  category, 
  description, 
  features, 
  color,
  workflow,
  demoData,
  onDiscover,
  onLoginDemo,
  isLoading
}: DemoAccountProps & { onDiscover: () => void; onLoginDemo: () => void; isLoading: boolean }) => {
  const getIconColor = () => {
    if (color.includes('destructive')) return 'error';
    if (color.includes('success')) return 'success';
    if (color.includes('warning')) return 'warning';
    return 'primary';
  };

  return (
    <NeuCard className="p-6 hover:scale-105 transition-all">
      <NeuIconPill 
        icon={icon} 
        color={getIconColor()} 
        size="lg" 
        className="mb-4"
      />
      <div className="mb-2">
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">
          {category}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {description}
      </p>
      
      <div className="space-y-2 mb-6">
        {features.slice(0, 4).map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
        {features.length > 4 && (
          <p className="text-xs text-muted-foreground pl-6">
            +{features.length - 4} autres fonctionnalités
          </p>
        )}
      </div>
      
      <div className="flex gap-2">
        <NeuButton onClick={onDiscover} variant="outline" className="flex-1">
          Découvrir
        </NeuButton>
        <NeuButton 
          onClick={onLoginDemo} 
          disabled={isLoading}
          variant="default"
          className="flex-1"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </NeuButton>
      </div>
    </NeuCard>
  );
};

const DemoDetailModal = ({ 
  account, 
  isOpen, 
  onClose,
  onLoginDemo,
  isLoading 
}: { 
  account: DemoAccountProps | null; 
  isOpen: boolean; 
  onClose: () => void;
  onLoginDemo: () => void;
  isLoading: boolean;
}) => {
  if (!account) return null;

  const getIconGradient = () => {
    if (account.accountType === "admin") {
      return "bg-gradient-to-br from-red-400 to-red-600";
    }
    if (account.accountType === "salon" || account.accountType === "fruit_veg") {
      return "bg-gradient-to-br from-green-400 to-green-600";
    }
    if (account.accountType === "restaurant" || account.accountType === "multi_activity") {
      return "bg-gradient-to-br from-yellow-400 to-yellow-600";
    }
    return "bg-gradient-to-br from-blue-400 to-blue-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center gap-4 flex-1 mb-2">
            <div className={`w-16 h-16 ${getIconGradient()} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
              {React.cloneElement(account.icon as React.ReactElement, { className: "w-8 h-8 text-white" })}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">{account.category}</p>
              <DialogTitle>{account.title}</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {account.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Workflow Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Workflow Typique
            </h3>
            <div className="space-y-4">
              {account.workflow.map((step, index) => (
                <div key={index} className="neu-inset p-4 rounded-xl">
                  <div className="flex items-start gap-4">
                    <NeuIconPill icon={Check} color="primary" size="sm" className="flex-shrink-0">
                      <span className="font-bold text-lg">{step.step}</span>
                    </NeuIconPill>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <div className="text-primary flex-shrink-0">
                      {step.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Data Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-success" />
              Données de Démonstration
            </h3>
            <NeuCard className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {account.demoData.map((data, index) => (
                  <div key={index} className="flex justify-between items-center p-3 neu-inset rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground">
                      {data.label}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {data.value}
                    </span>
                  </div>
                ))}
              </div>
            </NeuCard>
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Check className="w-6 h-6 text-success" />
              Fonctionnalités Complètes
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {account.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 p-3 neu-inset rounded-lg">
                  <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <NeuCard className="p-6 text-center">
            <h4 className="text-xl font-bold text-foreground mb-2">
              Prêt à essayer ce type de compte ?
            </h4>
            <p className="text-muted-foreground mb-4">
              Testez ce type de compte immédiatement ou créez votre propre compte personnalisé.
            </p>
            <div className="flex gap-3">
              <NeuButton 
                onClick={onLoginDemo}
                disabled={isLoading}
                variant="default"
                className="flex-1"
              >
                {isLoading ? "Connexion..." : "Se connecter en tant que démo"}
              </NeuButton>
              <NeuButton 
                onClick={() => window.location.href = "/auth?signup=true"} 
                variant="premium"
                className="flex-1"
              >
                Créer mon compte
              </NeuButton>
            </div>
          </NeuCard>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Demo = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState<DemoAccountProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loginAsDemo, isLoading } = useDemoLogin();

  const handleDiscover = (account: DemoAccountProps) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleLoginDemo = (accountType: string) => {
    loginAsDemo(accountType);
  };

  const demoAccounts: DemoAccountProps[] = [
    {
      accountType: "admin",
      icon: Shield,
      title: "Admin Système",
      category: "SYSTÈME",
      description: "Supervisez l’ensemble de l’écosystème PRO.GA : monitorings temps réel, audit des workspaces et gestion du support.",
      features: [
        "Tableau de bord global des utilisateurs",
        "Gestion des workspaces et permissions",
        "Monitoring des exports App A",
        "Support et assistance technique",
        "Statistiques et analytics avancées",
        "Gestion des incidents et tickets",
        "Configuration système globale"
      ],
      color: "bg-destructive/10",
      workflow: [
        {
          step: 1,
          title: "Connexion admin",
          description: "Authentification renforcée, journalisation automatique de chaque action critique.",
          icon: <Shield className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Dashboard global",
          description: "KPIs en temps réel : workspaces actifs, exports App A, taux d’erreur, capacité compute.",
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Monitoring",
          description: "Alertes déploiement / Edge Functions, redémarrage ciblé des services, audit des quotas.",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Support",
          description: "Dashboard tickets + escalade Slack, historique conversations et macros d’assistance.",
          icon: <User className="w-5 h-5" />
        }
      ],
      demoData: [
        { label: "Utilisateurs actifs", value: "1,247" },
        { label: "Workspaces totaux", value: "2,834" },
        { label: "Exports App A (mois)", value: "543" },
        { label: "Tickets résolus", value: "98%" },
        { label: "Temps de réponse moyen", value: "< 2h" },
        { label: "Uptime système", value: "99.9%" }
      ]
    },
    {
      accountType: "individual",
      icon: User,
      title: "Particulier",
      category: "ESPACE PERSO",
      description: "Déclarer ses revenus, simuler l’IRPP et gérer l’emploi à domicile dans la même interface.",
      features: [
        "Calcul IRPP avec barème progressif",
        "Simulation fiscale personnalisée",
        "Gestion emploi à domicile (ménage, gardien, nounou)",
        "Génération contrats et fiches de paie"
      ],
      color: "bg-primary/10",
      workflow: [
        {
          step: 1,
          title: "Profil fiscal",
          description: "Renseignez quotient familial, NIF perso et pièces justificatives (PDF / photo).",
          icon: <User className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Déclaration revenus",
          description: "Salaires, loyers, BIC/BNC, dividendes : import CSV, OCR PDF, rapprochement automatique.",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Simulation IRPP",
          description: "IRPP recalculé en temps réel avec crédit d’impôt, abattement et comparatif année N-1.",
          icon: <Calculator className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Export App A",
          description: "Génération App A DIGITAX + QR de vérification, signature JWS, archivage Supabase.",
          icon: <Check className="w-5 h-5" />
        }
      ],
      demoData: [
        { label: "Revenus annuels", value: "12,000,000 FCFA" },
        { label: "Situation familiale", value: "Marié, 2 enfants" },
        { label: "IRPP estimé", value: "720,000 FCFA" },
        { label: "Taux effectif", value: "6%" },
        { label: "Emplois domicile", value: "2 (ménage, gardien)" },
        { label: "Documents uploadés", value: "8" }
      ]
    },
    {
      accountType: "clothing_store",
      icon: ShoppingBag,
      title: "Boutique de Vêtements",
      category: "COMMERCE",
      description: "Créez votre boutique {slug}.pro.ga, synchronisez POS et stock, encaissez en Mobile Money.",
      features: [
        "Boutique en ligne {slug}.pro.ga personnalisable",
        "Catalogue produits avec tailles et couleurs",
        "Gestion stock et variantes",
        "Facturation automatique avec TVA 18%",
        "Calcul TVA, CSS (1% CA), IS/IMF",
        "POS pour ventes en magasin",
        "Suivi commandes et livraisons",
        "Photos produits illimitées"
      ],
      color: "bg-primary/10",
      workflow: [
        {
          step: 1,
          title: "Création boutique",
          description: "Identité visuelle, sections de contenu, SEO, mode bac à sable pour prévisualiser.",
          icon: <Building2 className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Catalogue produits",
          description: "Catalogue multi-variantes (taille/couleur), import Excel/CSV, photos optimisées.",
          icon: <ShoppingBag className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Réception commandes",
          description: "Commandes web + POS fusionnées, notifications WhatsApp/SMS, suivi logistique.",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Taxes automatiques",
          description: "TVA collectée/déductible, CSS 3.2%, export App A prêt pour dépôt DIGITAX.",
          icon: <Calculator className="w-5 h-5" />
        }
      ],
      demoData: [
        { label: "CA mensuel (HT)", value: "4,500,000 FCFA" },
        { label: "Produits actifs", value: "147" },
        { label: "Commandes (mois)", value: "89" },
        { label: "TVA collectée", value: "810,000 FCFA" },
        { label: "CSS (1% CA)", value: "45,000 FCFA" },
        { label: "Panier moyen", value: "50,562 FCFA" }
      ]
    },
    {
      accountType: "salon",
      icon: Scissors,
      title: "Salon Coiffure & Beauté",
      category: "SERVICES",
      description: "Planning en ligne, CRM clients et encaissement POS pour salons de beauté/coiffure.",
      features: [
        "Catalogue prestations (coupe, coloration, soin)",
        "Prise de rendez-vous en ligne",
        "Gestion clientèle et historique",
        "Facturation prestations de services",
        "TVA 18% automatique sur services",
        "Suivi CA et taxes (CSS, IS)",
        "Gestion planning équipe",
        "SMS rappels rendez-vous"
      ],
      color: "bg-success/10",
      workflow: [
        {
          step: 1,
          title: "Catalogue services",
          description: "Catalogue prestations (coupe, coloration, soins) avec durée, prix, commissions staff.",
          icon: <Scissors className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Réservations clients",
          description: "Réservations web/app, confirmation SMS, gestion no-show et liste d’attente.",
          icon: <User className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Encaissement POS",
          description: "POS tactile avec caisses multiples, factures TVA 18%, split paiement.",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Déclarations fiscales",
          description: "CSS, TVA, IS/IMF automatisés, export App A et archivage bulletins caisse.",
          icon: <TrendingUp className="w-5 h-5" />
        }
      ],
      demoData: [
        { label: "CA mensuel (HT)", value: "2,800,000 FCFA" },
        { label: "Prestations actives", value: "24" },
        { label: "Clients fidèles", value: "156" },
        { label: "Rendez-vous (mois)", value: "340" },
        { label: "TVA collectée", value: "504,000 FCFA" },
        { label: "Taux occupation", value: "78%" }
      ]
    },
    {
      accountType: "fruit_veg",
      icon: Apple,
      title: "Vente Fruits & Légumes",
      category: "ARTISANAL",
      description: "Vendez vos produits frais avec catalogue saisonnier, gestion de lots et tournées de livraison.",
      features: [
        "Boutique fruitsetlegumes.pro.ga",
        "Catalogue produits frais avec photos",
        "Gestion stock et dates de péremption",
        "Commandes et livraisons",
        "TVA exonérée (produits agricoles locaux)",
        "Calcul CSS et IMF simplifié",
        "Prix au kilo ou à l'unité",
        "Alertes stock faible"
      ],
      color: "bg-success/10",
      workflow: [
        {
          step: 1,
          title: "Catalogue produits frais",
          description: "Catalogue par calibre / unité, calcul marge brute, import prix marché ONASA.",
          icon: <Apple className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Gestion fraîcheur",
          description: "Gestion DLC, alertes détérioration, génération automatique de promotions anti-gaspillage.",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Commandes clients",
          description: "Préparation paniers, affectation livreurs, routes optimisées, paiement à la livraison.",
          icon: <ShoppingBag className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Fiscalité simplifiée",
          description: "TVA exonération agricole, CSS 1%, IMF annuelle, export App A prérempli.",
          icon: <Calculator className="w-5 h-5" />
        }
      ],
      demoData: [
        { label: "CA mensuel", value: "1,850,000 FCFA" },
        { label: "Produits saison", value: "32" },
        { label: "Commandes (mois)", value: "124" },
        { label: "TVA", value: "Exonérée" },
        { label: "CSS (1% CA)", value: "18,500 FCFA" },
        { label: "Taux fraîcheur", value: "96%" }
      ]
    },
    {
      accountType: "restaurant",
      icon: UtensilsCrossed,
      title: "Restaurant",
      category: "RESTAURATION",
      description: "Menu digital, commandes à emporter, POS salle et comptabilité restauration.",
      features: [
        "Menu en ligne monrestaurant.pro.ga",
        "Commandes à emporter et livraison",
        "POS pour service en salle",
        "Gestion tables et réservations",
        "TVA 18% sur consommation sur place",
        "Comptabilité SYSCOHADA restauration",
        "Menu du jour personnalisable",
        "Gestion ingrédients et recettes"
      ],
      color: "bg-warning/10",
      workflow: [
        {
          step: 1,
          title: "Création menu",
          description: "Construisez votre menu (entrées/plats/desserts), photos optimisées, multi-langues.",
          icon: <UtensilsCrossed className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Prises de commandes",
          description: "Commandes emporter/livraison + POS salles avec plan des tables et KDS cuisine.",
          icon: <ShoppingBag className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Service & facturation",
          description: "Tickets cuisine, addition en un clic, split facture, TVA 18% appliquée automatiquement.",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Compta restauration",
          description: "Analyse coût matière, charges personnel, TVA/CSS/IS consolidées, export App A.",
          icon: <Calculator className="w-5 h-5" />
        }
      ],
      demoData: [
        { label: "CA mensuel (HT)", value: "6,200,000 FCFA" },
        { label: "Plats menu", value: "48" },
        { label: "Services (mois)", value: "1,240" },
        { label: "TVA collectée", value: "1,116,000 FCFA" },
        { label: "CSS (1% CA)", value: "62,000 FCFA" },
        { label: "Ticket moyen", value: "5,000 FCFA" }
      ]
    },
    {
      accountType: "services",
      icon: Briefcase,
      title: "Prestations Services Divers",
      category: "SERVICES PRO",
      description: "Consultants, artisans, freelances : pipeline devis → mission → facture → export fiscal.",
      features: [
        "Devis et factures professionnelles",
        "Suivi missions et projets clients",
        "Gestion temps et facturation horaire",
        "TVA 18% sur prestations BtoB",
        "Calcul BNC (Bénéfices Non Commerciaux)",
        "Export comptable pour expert",
        "Multi-devises (FCFA, EUR, USD)",
        "Relances automatiques"
      ],
      color: "bg-primary/10",
      workflow: [
        {
          step: 1,
          title: "Création devis",
          description: "Devis multi-lots, signature électronique, workflows d’approbation client.",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Suivi missions",
          description: "Timesheet, jalons projets, portail client avec validation et retours.",
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Facturation",
          description: "Transformation devis → facture, relances automatiques, encaissement Mobile Money.",
          icon: <Calculator className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Déclarations BNC",
          description: "BNC/BIC, charges déductibles, TVA/CSS automatisées, export App A mensuel.",
          icon: <Check className="w-5 h-5" />
        }
      ],
      demoData: [
        { label: "CA mensuel (HT)", value: "3,400,000 FCFA" },
        { label: "Missions actives", value: "7" },
        { label: "Clients récurrents", value: "12" },
        { label: "TVA collectée", value: "612,000 FCFA" },
        { label: "BNC estimé", value: "2,100,000 FCFA" },
        { label: "Taux honoraires/h", value: "15,000 FCFA" }
      ]
    },
    {
      accountType: "multi_activity",
      icon: Building2,
      title: "PME Multi-activités",
      category: "ENTREPRISE",
      description: "Groupes multi-activités : workspaces par BU, équipes distinctes, consolidation SYSCOHADA.",
      features: [
        "Multi-workspaces (ventes, services, production)",
        "Gestion multi-utilisateurs et rôles",
        "Comptabilité SYSCOHADA complète",
        "Consolidation TVA, CSS, IS",
        "Export FEC pour expert-comptable",
        "Audit trail et traçabilité",
        "Tableaux de bord analytiques",
        "Validation comptable expert"
      ],
      color: "bg-warning/10",
      workflow: [
        {
          step: 1,
          title: "Structure groupe",
          description: "Structurez vos BU (boutique, services, production) avec indicateurs dédiés.",
          icon: <Building2 className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Rôles & permissions",
          description: "Rôles granulaires (gérant, comptable, auditeur) et audit log complet.",
          icon: <User className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Consolidation compta",
          description: "Ecritures multi-workspaces, plan SYSCOHADA, consolidation GL + balance.",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Export expert",
          description: "Exports FEC + App A consolidés, signatures multiples, archivage légal 10 ans.",
          icon: <TrendingUp className="w-5 h-5" />
        }
      ],
      demoData: [
        { label: "CA groupe (HT)", value: "18,500,000 FCFA" },
        { label: "Workspaces actifs", value: "5" },
        { label: "Utilisateurs", value: "23" },
        { label: "TVA collectée", value: "3,330,000 FCFA" },
        { label: "CSS groupe", value: "185,000 FCFA" },
        { label: "IS annuel estimé", value: "4,800,000 FCFA" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <NeuButton
              variant="outline"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </NeuButton>
          </div>
          
          <div className="flex items-center gap-2">
            <NeuIconPill icon={Shield} color="primary" size="md" />
            <span className="text-xl font-bold text-foreground">PRO.GA</span>
          </div>
          
          <NeuButton
            onClick={() => navigate("/auth?signup=true")}
            variant="premium"
          >
            Créer mon compte
          </NeuButton>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Découvrez PRO.GA en action
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explorez les différents types de comptes adaptés à chaque profil : 
            particuliers, commerçants, artisans, restaurateurs, prestataires de services...
          </p>
        </div>

        {/* Demo Accounts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoAccounts.map((account, index) => (
            <DemoAccountCard 
              key={index} 
              {...account} 
              onDiscover={() => handleDiscover(account)}
              onLoginDemo={() => handleLoginDemo(account.accountType)}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Demo Detail Modal */}
        <DemoDetailModal
          account={selectedAccount}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLoginDemo={() => selectedAccount && handleLoginDemo(selectedAccount.accountType)}
          isLoading={isLoading}
        />

        {/* CTA Section */}
        <NeuCard className="mt-16 p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Prêt à créer votre compte ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choisissez le type de compte qui vous correspond et commencez à gérer 
            votre activité en toute conformité avec la réglementation gabonaise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NeuButton
              onClick={() => navigate("/auth?signup=true")}
              variant="premium"
              className="px-8 py-6 text-lg"
            >
              Créer mon compte gratuit
            </NeuButton>
            <NeuButton
              variant="outline"
              onClick={() => navigate("/")}
              className="px-8 py-6 text-lg font-medium"
            >
              En savoir plus
            </NeuButton>
          </div>
        </NeuCard>

        {/* Info Banner */}
        <div className="mt-8 neu-inset p-6 text-center rounded-2xl">
          <p className="text-sm text-muted-foreground">
            <strong>Note :</strong> Les simulations fiscales sont indicatives. 
            La déclaration et le paiement officiels se font via l'App A (DIGITAX).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demo;
