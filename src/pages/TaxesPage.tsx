import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { TaxSimulationPanel } from "@/components/tax/TaxSimulationPanel";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator } from "lucide-react";
import type { TaxBases } from "@/types/domain";

const TaxesPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const [bases, setBases] = useState<TaxBases>({
    tva: { collected: 0, deductible: 0 },
    css: { base: 0, exclusions: 0 },
    is: { base: 0, rate: 0.25 },
    imf: { base: 0, rate: 0.015 },
    irpp: { base: 0, quotient: 1 },
  });

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
        <NeuCard className="p-6 max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Aucun espace sélectionné</h1>
          <p className="text-sm text-muted-foreground">
            Sélectionnez un espace pour accéder aux simulations fiscales.
          </p>
        </NeuCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-6 space-y-6">
      <header>
        <NeuCard className="p-6 mb-2">
          <div className="flex items-start gap-4">
            <NeuButton variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </NeuButton>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                Finances & Fiscalité
              </p>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Simulations fiscales
              </h1>
              <p className="text-sm text-muted-foreground">
                Espace : {currentWorkspace.name}
              </p>
            </div>
          </div>
        </NeuCard>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <NeuCard className="p-6">
          <h2 className="text-lg font-semibold mb-1">Bases fiscales</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Saisissez vos bases pour calculer les taxes dues.
          </p>
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold">TVA</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="tva-collected">Collectée (FCFA)</Label>
                  <Input
                    id="tva-collected"
                    type="number"
                    value={bases.tva?.collected || 0}
                    onChange={(e) =>
                      setBases({
                        ...bases,
                        tva: { ...bases.tva!, collected: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="tva-deductible">Déductible (FCFA)</Label>
                  <Input
                    id="tva-deductible"
                    type="number"
                    value={bases.tva?.deductible || 0}
                    onChange={(e) =>
                      setBases({
                        ...bases,
                        tva: { ...bases.tva!, deductible: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">CSS</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="css-base">Base HT (FCFA)</Label>
                  <Input
                    id="css-base"
                    type="number"
                    value={bases.css?.base || 0}
                    onChange={(e) =>
                      setBases({
                        ...bases,
                        css: { ...bases.css!, base: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="css-exclusions">Exclusions (FCFA)</Label>
                  <Input
                    id="css-exclusions"
                    type="number"
                    value={bases.css?.exclusions || 0}
                    onChange={(e) =>
                      setBases({
                        ...bases,
                        css: { ...bases.css!, exclusions: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">IS / IMF</h3>
              <div>
                <Label htmlFor="is-base">Résultat (FCFA)</Label>
                <Input
                  id="is-base"
                  type="number"
                  value={bases.is?.base || 0}
                  onChange={(e) =>
                    setBases({
                      ...bases,
                      is: { ...bases.is!, base: Number(e.target.value) },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Le système calculera automatiquement le montant à payer (IS ou IMF).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">IRPP</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="irpp-base">Base (FCFA)</Label>
                  <Input
                    id="irpp-base"
                    type="number"
                    value={bases.irpp?.base || 0}
                    onChange={(e) =>
                      setBases({
                        ...bases,
                        irpp: { ...bases.irpp!, base: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="irpp-quotient">Quotient familial</Label>
                  <Input
                    id="irpp-quotient"
                    type="number"
                    step="0.5"
                    value={bases.irpp?.quotient || 1}
                    onChange={(e) =>
                      setBases({
                        ...bases,
                        irpp: { ...bases.irpp!, quotient: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </NeuCard>

        <TaxSimulationPanel bases={bases} currency="XOF" />
      </div>
    </div>
  );
};

export default TaxesPage;

