import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, User, Shield, Zap, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [userType, setUserType] = useState<"pro" | "particular" | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Nav */}
        <nav className="asted-nav sticky top-0 z-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-foreground">PRO.GA</span>
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth")}
                className="text-foreground hover:bg-secondary"
              >
                Connexion
              </Button>
              <Button
                onClick={() => navigate("/auth?signup=true")}
                className="asted-button"
              >
                Créer mon compte
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Gérez. Vendez. Déclarez.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              L'assistant pro & perso pour gérer votre vie fiscale et vos activités au Gabon.
              Simple. Intelligent. Conforme.
            </p>

            {/* User Type Selector */}
            <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
              <button
                onClick={() => setUserType("pro")}
                className={`asted-card p-8 transition-all cursor-pointer hover:scale-105 flex-1 max-w-sm ${
                  userType === "pro" ? "ring-2 ring-primary" : ""
                }`}
              >
                <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Je suis PRO</h3>
                <p className="text-muted-foreground">
                  Commerçant, entrepreneur, PME
                </p>
              </button>

              <button
                onClick={() => setUserType("particular")}
                className={`asted-card p-8 transition-all cursor-pointer hover:scale-105 flex-1 max-w-sm ${
                  userType === "particular" ? "ring-2 ring-primary" : ""
                }`}
              >
                <User className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Je suis Particulier</h3>
                <p className="text-muted-foreground">
                  Foyer, emploi à domicile, IRPP
                </p>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth?signup=true")}
                className="asted-button text-lg px-8 py-6"
              >
                Créer mon compte — Gratuit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/demo")}
                className="text-lg px-8 py-6 bg-background border-2"
              >
                Voir la démo
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="asted-card text-center p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Conforme DGI
              </h3>
              <p className="text-muted-foreground">
                Calculs fiscaux conformes aux barèmes officiels du Gabon (TVA, CSS, IS, IMF, IRPP)
              </p>
            </div>

            <div className="asted-card text-center p-8">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                IA Intégrée
              </h3>
              <p className="text-muted-foreground">
                Lecture de documents, pré-remplissage automatique, questions intelligentes
              </p>
            </div>

            <div className="asted-card text-center p-8">
              <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Export App A
              </h3>
              <p className="text-muted-foreground">
                Pré-déclarations exportables vers DIGITAX en un clic
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Features Section */}
      {userType === "pro" && (
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center text-foreground mb-4">
            Pour les Professionnels
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour gérer votre activité
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="asted-card p-8">
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Boutique en ligne {"{slug}"}.pro.ga
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Créez votre boutique ou restaurant en ligne</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Catalogue produits, commandes, paiements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Factures automatiques avec QR de vérification</span>
                </li>
              </ul>
            </div>

            <div className="asted-card p-8">
              <Building2 className="w-10 h-10 text-success mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Comptabilité & Fiscalité
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">•</span>
                  <span>SYSCOHADA simplifié</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">•</span>
                  <span>TVA, CSS, IS/IMF calculés automatiquement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">•</span>
                  <span>POS et encaissement au comptoir</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Particular Features Section */}
      {userType === "particular" && (
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-center text-foreground mb-4">
            Pour les Particuliers
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Gérez votre foyer et vos obligations fiscales en toute simplicité
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="asted-card p-8">
              <User className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-3">
                IRPP & Simulation
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Estimez vos impôts sur le revenu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Barème progressif et quotient familial</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Tous types de revenus (salaires, loyers, BIC/BNC)</span>
                </li>
              </ul>
            </div>

            <div className="asted-card p-8">
              <Shield className="w-10 h-10 text-success mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Emploi à domicile
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">•</span>
                  <span>Contrats pour ménage, gardien, nounou, chauffeur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">•</span>
                  <span>Calcul de paie et fiches automatiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success mt-1">•</span>
                  <span>Suivi des heures et présences</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="asted-card p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Prêt à simplifier votre gestion ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Rejoignez les professionnels et particuliers qui font confiance à PRO.GA
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth?signup=true")}
            className="asted-button text-lg px-8 py-6"
          >
            Créer mon compte gratuitement
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">P</span>
              </div>
              <span className="text-lg font-bold text-foreground">PRO.GA</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 PRO.GA. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
