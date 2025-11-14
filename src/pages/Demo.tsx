import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Building2
} from "lucide-react";

interface DemoAccountProps {
  icon: React.ReactNode;
  title: string;
  category: string;
  description: string;
  features: string[];
  color: string;
}

const DemoAccountCard = ({ icon, title, category, description, features, color }: DemoAccountProps) => {
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
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>
      
      <Button className="w-full asted-button">
        Découvrir ce compte
      </Button>
    </div>
  );
};

const Demo = () => {
  const navigate = useNavigate();

  const demoAccounts: DemoAccountProps[] = [
    {
      icon: <Shield className="w-8 h-8 text-destructive" />,
      title: "Admin Système",
      category: "SYSTÈME",
      description: "Gestion complète de la plateforme PRO.GA avec accès aux statistiques, modération et support.",
      features: [
        "Tableau de bord global des utilisateurs",
        "Gestion des workspaces et permissions",
        "Monitoring des exports App A",
        "Support et assistance technique",
        "Statistiques et analytics avancées"
      ],
      color: "bg-destructive/10"
    },
    {
      icon: <User className="w-8 h-8 text-primary" />,
      title: "Particulier",
      category: "ESPACE PERSO",
      description: "Gérez votre foyer, vos revenus et vos obligations fiscales personnelles au Gabon.",
      features: [
        "Calcul IRPP avec barème progressif",
        "Simulation fiscale personnalisée",
        "Gestion emploi à domicile (ménage, gardien, nounou)",
        "Génération contrats et fiches de paie",
        "Suivi revenus (salaires, loyers, dividendes)"
      ],
      color: "bg-primary/10"
    },
    {
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
        "POS pour ventes en magasin"
      ],
      color: "bg-primary/10"
    },
    {
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
        "Suivi CA et taxes (CSS, IS)"
      ],
      color: "bg-success/10"
    },
    {
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
        "Calcul CSS et IMF simplifié"
      ],
      color: "bg-success/10"
    },
    {
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
        "Comptabilité SYSCOHADA restauration"
      ],
      color: "bg-warning/10"
    },
    {
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
        "Export comptable pour expert"
      ],
      color: "bg-primary/10"
    },
    {
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
        "Audit trail et traçabilité"
      ],
      color: "bg-warning/10"
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
            <DemoAccountCard key={index} {...account} />
          ))}
        </div>

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
