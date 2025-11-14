import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Calculator
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
  icon: React.ReactNode;
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
  return (
    <div className="asted-card p-6 hover:scale-105 transition-all">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
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
        <Button onClick={onDiscover} variant="outline" className="flex-1">
          Découvrir
        </Button>
        <Button 
          onClick={onLoginDemo} 
          disabled={isLoading}
          className="flex-1 asted-button"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>
      </div>
    </div>
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 ${account.color} rounded-2xl flex items-center justify-center`}>
              {account.icon}
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold">{account.title}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {account.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* Workflow Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Workflow Typique
            </h3>
            <div className="space-y-4">
              {account.workflow.map((step, index) => (
                <div key={index} className="asted-card-pressed p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-lg">
                        {step.step}
                      </span>
                    </div>
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
            <div className="asted-card p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {account.demoData.map((data, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground">
                      {data.label}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {data.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Check className="w-6 h-6 text-success" />
              Fonctionnalités Complètes
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {account.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 p-3 asted-card-pressed">
                  <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="asted-card p-6 text-center">
            <h4 className="text-xl font-bold text-foreground mb-2">
              Prêt à essayer ce type de compte ?
            </h4>
            <p className="text-muted-foreground mb-4">
              Testez ce type de compte immédiatement ou créez votre propre compte personnalisé.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={onLoginDemo}
                disabled={isLoading}
                variant="default"
                className="flex-1 asted-button"
              >
                {isLoading ? "Connexion..." : "Se connecter en tant que démo"}
              </Button>
              <Button 
                onClick={() => window.location.href = "/auth?signup=true"} 
                variant="outline"
                className="flex-1"
              >
                Créer mon compte
              </Button>
            </div>
          </div>
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
      icon: <Shield className="w-8 h-8 text-destructive" />,
      title: "Admin Système",
      category: "SYSTÈME",
      description: "Gestion complète de la plateforme PRO.GA avec accès aux statistiques, modération et support.",
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
          description: "Accès sécurisé avec authentification renforcée et logs d'accès",
          icon: <Shield className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Dashboard global",
          description: "Vue d'ensemble des utilisateurs, workspaces actifs et exports App A",
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Monitoring",
          description: "Suivi des performances, erreurs et alertes système en temps réel",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Support",
          description: "Réponse aux tickets utilisateurs et assistance technique",
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
      icon: <User className="w-8 h-8 text-primary" />,
      title: "Particulier",
      category: "ESPACE PERSO",
      description: "Gérez votre foyer, vos revenus et vos obligations fiscales personnelles au Gabon.",
      features: [
        "Calcul IRPP avec barème progressif",
        "Simulation fiscale personnalisée",
        "Gestion emploi à domicile (ménage, gardien, nounou)",
        "Génération contrats et fiches de paie",
        "Suivi revenus (salaires, loyers, dividendes)",
        "Upload documents (bulletins, relevés)",
        "Export pré-déclaration DIGITAX"
      ],
      color: "bg-primary/10",
      workflow: [
        {
          step: 1,
          title: "Profil fiscal",
          description: "Renseignez votre situation familiale et nombre de personnes à charge",
          icon: <User className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Déclaration revenus",
          description: "Saisissez vos revenus (salaires, loyers, BIC/BNC) ou uploadez vos documents",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Simulation IRPP",
          description: "Calculez automatiquement votre IRPP avec barème et quotient familial",
          icon: <Calculator className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Export App A",
          description: "Générez votre pré-déclaration pour DIGITAX avec QR de vérification",
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
      icon: <ShoppingBag className="w-8 h-8 text-primary" />,
      title: "Boutique de Vêtements",
      category: "COMMERCE",
      description: "Vendez en ligne avec votre boutique vêtements.pro.ga et gérez votre stock facilement.",
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
          description: "Configurez votreboutique.pro.ga avec logo, couleurs et présentation",
          icon: <Building2 className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Catalogue produits",
          description: "Ajoutez vos vêtements avec photos, prix, tailles, couleurs et stock",
          icon: <ShoppingBag className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Réception commandes",
          description: "Gérez les commandes clients avec statuts et notifications",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Taxes automatiques",
          description: "TVA, CSS et IS/IMF calculés automatiquement, export App A mensuel",
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
      icon: <Scissors className="w-8 h-8 text-success" />,
      title: "Salon Coiffure & Beauté",
      category: "SERVICES",
      description: "Réservations en ligne, gestion clients et facturation pour votre salon de beauté.",
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
          description: "Créez vos prestations (coupe 5000 FCFA, coloration 15000 FCFA, etc.)",
          icon: <Scissors className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Réservations clients",
          description: "Vos clients réservent en ligne, vous gérez le planning en temps réel",
          icon: <User className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Encaissement POS",
          description: "Encaissez au salon, facture automatique avec TVA 18%",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Déclarations fiscales",
          description: "CSS et IS calculés mensuellement, export App A en un clic",
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
      icon: <Apple className="w-8 h-8 text-success" />,
      title: "Vente Fruits & Légumes",
      category: "ARTISANAL",
      description: "Commercialisez vos produits frais locaux avec une boutique en ligne simple et efficace.",
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
          description: "Ajoutez vos fruits et légumes : mangues 1500 FCFA/kg, tomates 800 FCFA/kg",
          icon: <Apple className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Gestion fraîcheur",
          description: "Suivez dates de péremption, alertes automatiques stock faible",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Commandes clients",
          description: "Réception commandes, préparation paniers, organisation livraisons",
          icon: <ShoppingBag className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Fiscalité simplifiée",
          description: "TVA exonérée, calcul CSS 1% et IMF annuel, export App A",
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
      icon: <UtensilsCrossed className="w-8 h-8 text-warning" />,
      title: "Restaurant",
      category: "RESTAURATION",
      description: "Menu en ligne, commandes à emporter et gestion complète de votre restaurant.",
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
          description: "Publiez votre menu : entrées, plats, desserts avec photos et prix",
          icon: <UtensilsCrossed className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Prises de commandes",
          description: "Commandes en ligne (emporter/livraison) + POS salle avec plans de tables",
          icon: <ShoppingBag className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Service & facturation",
          description: "Tickets cuisine, addition automatique, split de facture, TVA 18%",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Compta restauration",
          description: "Matières premières, charges personnel, TVA/CSS/IS, export App A",
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
      icon: <Briefcase className="w-8 h-8 text-primary" />,
      title: "Prestations Services Divers",
      category: "SERVICES PRO",
      description: "Consultants, artisans, freelances : gérez vos missions et votre facturation.",
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
          description: "Devis détaillé avec prestations, quantités, prix unitaires et TVA",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Suivi missions",
          description: "Suivi temps passé, jalons projets, tableau de bord client",
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Facturation",
          description: "Transformation devis en facture, paiements, relances automatiques",
          icon: <Calculator className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Déclarations BNC",
          description: "Calcul BNC, charges déductibles, TVA/CSS, export App A mensuel",
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
      icon: <Building2 className="w-8 h-8 text-warning" />,
      title: "PME Multi-activités",
      category: "ENTREPRISE",
      description: "Grande entreprise avec plusieurs départements, multi-utilisateurs et comptabilité avancée.",
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
          description: "Créez workspaces par activité : boutique, services, production",
          icon: <Building2 className="w-5 h-5" />
        },
        {
          step: 2,
          title: "Rôles & permissions",
          description: "Gérant, comptable, opérateur POS, auditeur avec accès différenciés",
          icon: <User className="w-5 h-5" />
        },
        {
          step: 3,
          title: "Consolidation compta",
          description: "Plan SYSCOHADA, écritures par workspace, grand-livre consolidé",
          icon: <FileText className="w-5 h-5" />
        },
        {
          step: 4,
          title: "Export expert",
          description: "FEC normalisé, TVA/CSS/IS consolidées, export App A groupe",
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
      <nav className="asted-nav sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-foreground hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold text-foreground">PRO.GA</span>
          </div>
          
          <Button
            onClick={() => navigate("/auth?signup=true")}
            className="asted-button"
          >
            Créer mon compte
          </Button>
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
        <div className="mt-16 asted-card p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Prêt à créer votre compte ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choisissez le type de compte qui vous correspond et commencez à gérer 
            votre activité en toute conformité avec la réglementation gabonaise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth?signup=true")}
              className="asted-button text-lg px-8 py-6"
            >
              Créer mon compte gratuit
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/")}
              className="text-lg px-8 py-6 bg-background border-2"
            >
              En savoir plus
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 asted-card-pressed p-6 text-center">
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
