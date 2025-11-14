import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Building2, User, Check } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [workspaceType, setWorkspaceType] = useState<"perso" | "entreprise" | null>(null);
  
  // Personal info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Company info
  const [companyName, setCompanyName] = useState("");
  const [companyNif, setCompanyNif] = useState("");
  const [wantsBoutique, setWantsBoutique] = useState<"yes" | "no">("no");
  const [storeSlug, setStoreSlug] = useState("");

  const handleNext = () => {
    if (step === 1 && (!firstName || !lastName)) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    if (step === 2 && !workspaceType) {
      toast.error("Veuillez choisir un type d'espace");
      return;
    }
    
    if (step === 3 && workspaceType === "entreprise" && !companyName) {
      toast.error("Veuillez renseigner le nom de votre entreprise");
      return;
    }
    
    setStep(step + 1);
  };

  const handleComplete = () => {
    toast.success("Configuration terminée !");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-full h-2 rounded-full mx-1 transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm">
            Étape {step} sur 4
          </p>
        </div>

        <div className="asted-card p-8">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Bienvenue sur PRO.GA
                </h2>
                <p className="text-muted-foreground">
                  Commençons par vos informations personnelles
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="asted-input"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="asted-input"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="asted-input"
                    placeholder="+241..."
                  />
                </div>
              </div>

              <Button onClick={handleNext} className="w-full asted-button">
                Continuer
              </Button>
            </div>
          )}

          {/* Step 2: Workspace Type */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Que souhaitez-vous configurer ?
                </h2>
                <p className="text-muted-foreground">
                  Vous pourrez ajouter d'autres espaces plus tard
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setWorkspaceType("perso")}
                  className={`asted-card p-6 text-center transition-all hover:scale-105 ${
                    workspaceType === "perso" ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <User className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Espace Perso</h3>
                  <p className="text-sm text-muted-foreground">
                    IRPP, foyer, emploi à domicile
                  </p>
                </button>

                <button
                  onClick={() => setWorkspaceType("entreprise")}
                  className={`asted-card p-6 text-center transition-all hover:scale-105 ${
                    workspaceType === "entreprise" ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Building2 className="w-12 h-12 text-success mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-2">Espace Entreprise</h3>
                  <p className="text-sm text-muted-foreground">
                    Boutique, compta, TVA/CSS
                  </p>
                </button>
              </div>

              <Button onClick={handleNext} className="w-full asted-button">
                Continuer
              </Button>
            </div>
          )}

          {/* Step 3: Workspace Config */}
          {step === 3 && (
            <div className="space-y-6">
              {workspaceType === "perso" ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Configuration Espace Perso
                    </h2>
                    <p className="text-muted-foreground">
                      Configurez votre espace personnel
                    </p>
                  </div>
                  <div className="asted-card-pressed p-6 text-center">
                    <Check className="w-12 h-12 text-success mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Votre espace personnel est prêt. Vous pourrez ajouter vos revenus et emplois à domicile depuis le dashboard.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Configuration Entreprise
                    </h2>
                    <p className="text-muted-foreground">
                      Renseignez les informations de votre entreprise
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Raison sociale</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="asted-input"
                        placeholder="Ma Société SARL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyNif">NIF Entreprise (optionnel)</Label>
                      <Input
                        id="companyNif"
                        value={companyNif}
                        onChange={(e) => setCompanyNif(e.target.value)}
                        className="asted-input"
                      />
                    </div>

                    <div>
                      <Label>Souhaitez-vous créer une boutique en ligne ?</Label>
                      <RadioGroup
                        value={wantsBoutique}
                        onValueChange={(v) => setWantsBoutique(v as "yes" | "no")}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes" className="font-normal cursor-pointer">
                            Oui, je veux une boutique
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no" className="font-normal cursor-pointer">
                            Non, pas maintenant
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </>
              )}

              <Button onClick={handleNext} className="w-full asted-button">
                Continuer
              </Button>
            </div>
          )}

          {/* Step 4: Store Config or Complete */}
          {step === 4 && (
            <div className="space-y-6">
              {wantsBoutique === "yes" && workspaceType === "entreprise" ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Configuration Boutique
                    </h2>
                    <p className="text-muted-foreground">
                      Choisissez votre URL boutique
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="slug">URL de votre boutique</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          id="slug"
                          value={storeSlug}
                          onChange={(e) => setStoreSlug(e.target.value.toLowerCase())}
                          className="asted-input"
                          placeholder="ma-boutique"
                        />
                        <span className="text-muted-foreground whitespace-nowrap">
                          .pro.ga
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Exemple: ma-boutique.pro.ga
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Check className="w-16 h-16 text-success mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Configuration terminée !
                  </h2>
                  <p className="text-muted-foreground">
                    Votre espace est prêt à être utilisé
                  </p>
                </div>
              )}

              <Button onClick={handleComplete} className="w-full asted-button">
                Accéder au Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
