import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { TaxSimulationPanel } from "@/components/tax/TaxSimulationPanel";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, Save, RotateCcw, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { TaxBases } from "@/types/domain";

const STORAGE_KEY = (workspaceId: string) => `proga.taxes.${workspaceId}`;

const loadBases = (workspaceId: string | undefined): TaxBases | null => {
  if (!workspaceId || typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY(workspaceId));
    if (!raw) return null;
    return JSON.parse(raw) as TaxBases;
  } catch {
    return null;
  }
};

const persistBases = (workspaceId: string | undefined, bases: TaxBases) => {
  if (!workspaceId || typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY(workspaceId), JSON.stringify(bases));
  } catch (error) {
    console.error("Error persisting tax bases:", error);
  }
};

const defaultBases: TaxBases = {
  tva: { collected: 0, deductible: 0 },
  css: { base: 0, exclusions: 0 },
  is: { base: 0, rate: 0.25 },
  imf: { base: 0, rate: 0.015 },
  irpp: { base: 0, quotient: 1 },
};

const TaxesPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const [bases, setBases] = useState<TaxBases>(defaultBases);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!currentWorkspace?.id) {
      setBases(defaultBases);
      setIsDirty(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const saved = loadBases(currentWorkspace.id);
      if (saved) {
        setBases(saved);
        setIsDirty(false);
      } else {
        setBases(defaultBases);
        setIsDirty(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement des bases fiscales";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentWorkspace?.id]);

  const handleSave = useCallback(async () => {
    if (!currentWorkspace?.id) {
      const err = "Espace requis pour sauvegarder";
      setError(err);
      toast.error(err);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      persistBases(currentWorkspace.id, bases);
      setIsDirty(false);
      setSuccess("Bases fiscales sauvegardées avec succès");
      toast.success("Bases fiscales sauvegardées");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [currentWorkspace?.id, bases]);

  const handleReset = useCallback(() => {
    if (!currentWorkspace?.id) return;

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir réinitialiser toutes les bases fiscales ? Cette action est irréversible."
    );

    if (!confirmed) return;

    setError(null);
    setSuccess(null);

    try {
      setBases(defaultBases);
      persistBases(currentWorkspace.id, defaultBases);
      setIsDirty(false);
      setSuccess("Bases fiscales réinitialisées");
      toast.success("Bases fiscales réinitialisées");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la réinitialisation";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [currentWorkspace?.id]);

  const updateBase = useCallback((path: string, value: number) => {
    setBases((prev) => {
      const keys = path.split(".");
      const newBases = { ...prev };
      let current: any = newBases;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = Math.max(0, isNaN(value) ? 0 : value);
      setIsDirty(true);
      return newBases;
    });
  }, []);

  const validateBases = useMemo(() => {
    const errors: string[] = [];
    
    if (bases.irpp && bases.irpp.quotient < 0.5) {
      errors.push("Le quotient familial doit être d'au moins 0.5");
    }
    if (bases.irpp && bases.irpp.quotient > 10) {
      errors.push("Le quotient familial ne peut pas dépasser 10");
    }
    if (bases.is && bases.is.rate && (bases.is.rate < 0 || bases.is.rate > 1)) {
      errors.push("Le taux IS doit être entre 0 et 1");
    }
    if (bases.imf && bases.imf.rate && (bases.imf.rate < 0 || bases.imf.rate > 1)) {
      errors.push("Le taux IMF doit être entre 0 et 1");
    }

    return errors;
  }, [bases]);

  if (!currentWorkspace) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
              <NeuCard className="p-4 sm:p-6 max-w-md text-center">
                <Calculator className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" aria-hidden="true" />
                <h1 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Aucun espace sélectionné</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sélectionnez un espace pour accéder aux simulations fiscales.
                </p>
              </NeuCard>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
              <NeuCard className="p-8 sm:p-12 max-w-md text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" aria-label="Chargement en cours" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Chargement...</h2>
                <p className="text-sm text-muted-foreground">Chargement des bases fiscales...</p>
              </NeuCard>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
          <header className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 lg:pt-8">
            <NeuCard className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-0.5 sm:mb-1 lg:mb-2 truncate">
                      Finances & Fiscalité
                    </p>
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
                      Simulations fiscales
                    </h1>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 line-clamp-2">
                      Espace : {currentWorkspace.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                  <NeuButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
                    aria-label="Retour au dashboard"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Retour</span>
                  </NeuButton>
                  <NeuButton
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={saving || loading}
                    className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
                    aria-label="Réinitialiser les bases fiscales"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Réinitialiser</span>
                  </NeuButton>
                  <NeuButton
                    variant="premium"
                    size="sm"
                    onClick={handleSave}
                    disabled={saving || loading || !isDirty || validateBases.length > 0}
                    className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
                    aria-label={saving ? "Sauvegarde en cours..." : "Sauvegarder les bases fiscales"}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">Sauvegarde...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">Sauvegarder</span>
                      </>
                    )}
                  </NeuButton>
                </div>
              </div>

              {(error || validateBases.length > 0) && (
                <div className="mt-4 neu-inset rounded-xl p-3 sm:p-4 bg-red-50 border border-red-200 flex items-start gap-2 sm:gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-red-900 mb-0.5 sm:mb-1">
                      Erreur{validateBases.length > 0 ? " de validation" : ""}
                    </p>
                    <ul className="text-[10px] sm:text-xs text-red-700 space-y-0.5 sm:space-y-1">
                      {error && <li className="break-words">{error}</li>}
                      {validateBases.map((err, idx) => (
                        <li key={idx} className="break-words">• {err}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                    }}
                    className="text-red-600 hover:text-red-800 flex-shrink-0 text-lg sm:text-xl leading-none"
                    aria-label="Fermer le message d'erreur"
                  >
                    ×
                  </button>
                </div>
              )}

              {success && (
                <div className="mt-4 neu-inset rounded-xl p-3 sm:p-4 bg-green-50 border border-green-200 flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-green-900 mb-0.5 sm:mb-1">Succès</p>
                    <p className="text-[10px] sm:text-xs text-green-700 break-words">{success}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccess(null)}
                    className="text-green-600 hover:text-green-800 flex-shrink-0 text-lg sm:text-xl leading-none"
                    aria-label="Fermer le message de succès"
                  >
                    ×
                  </button>
                </div>
              )}
            </NeuCard>
          </header>

          <main className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4 lg:space-y-6 max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <NeuCard className="p-4 sm:p-6">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">Bases fiscales</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Saisissez vos bases pour calculer les taxes dues.
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">TVA</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="tva-collected" className="text-xs sm:text-sm">
                          Collectée (FCFA)
                        </Label>
                        <Input
                          id="tva-collected"
                          type="number"
                          min="0"
                          step="1000"
                          value={bases.tva?.collected || 0}
                          onChange={(e) => updateBase("tva.collected", Number(e.target.value))}
                          disabled={saving || loading}
                          className="text-xs sm:text-sm"
                          aria-label="TVA collectée en FCFA"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="tva-deductible" className="text-xs sm:text-sm">
                          Déductible (FCFA)
                        </Label>
                        <Input
                          id="tva-deductible"
                          type="number"
                          min="0"
                          step="1000"
                          value={bases.tva?.deductible || 0}
                          onChange={(e) => updateBase("tva.deductible", Number(e.target.value))}
                          disabled={saving || loading}
                          className="text-xs sm:text-sm"
                          aria-label="TVA déductible en FCFA"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">CSS</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="css-base" className="text-xs sm:text-sm">
                          Base HT (FCFA)
                        </Label>
                        <Input
                          id="css-base"
                          type="number"
                          min="0"
                          step="1000"
                          value={bases.css?.base || 0}
                          onChange={(e) => updateBase("css.base", Number(e.target.value))}
                          disabled={saving || loading}
                          className="text-xs sm:text-sm"
                          aria-label="Base HT CSS en FCFA"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="css-exclusions" className="text-xs sm:text-sm">
                          Exclusions (FCFA)
                        </Label>
                        <Input
                          id="css-exclusions"
                          type="number"
                          min="0"
                          step="1000"
                          value={bases.css?.exclusions || 0}
                          onChange={(e) => updateBase("css.exclusions", Number(e.target.value))}
                          disabled={saving || loading}
                          className="text-xs sm:text-sm"
                          aria-label="Exclusions CSS en FCFA"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">IS / IMF</h3>
                    <div className="space-y-1.5">
                      <Label htmlFor="is-base" className="text-xs sm:text-sm">
                        Résultat fiscal (FCFA)
                      </Label>
                      <Input
                        id="is-base"
                        type="number"
                        step="1000"
                        value={bases.is?.base || 0}
                        onChange={(e) => updateBase("is.base", Number(e.target.value))}
                        disabled={saving || loading}
                        className="text-xs sm:text-sm"
                        aria-label="Résultat fiscal IS/IMF en FCFA"
                      />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Le système calculera automatiquement le montant à payer (IS ou IMF).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">IRPP</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="irpp-base" className="text-xs sm:text-sm">
                          Base imposable (FCFA)
                        </Label>
                        <Input
                          id="irpp-base"
                          type="number"
                          min="0"
                          step="1000"
                          value={bases.irpp?.base || 0}
                          onChange={(e) => updateBase("irpp.base", Number(e.target.value))}
                          disabled={saving || loading}
                          className="text-xs sm:text-sm"
                          aria-label="Base imposable IRPP en FCFA"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="irpp-quotient" className="text-xs sm:text-sm">
                          Quotient familial
                        </Label>
                        <Input
                          id="irpp-quotient"
                          type="number"
                          min="0.5"
                          max="10"
                          step="0.5"
                          value={bases.irpp?.quotient || 1}
                          onChange={(e) => updateBase("irpp.quotient", Number(e.target.value))}
                          disabled={saving || loading}
                          className="text-xs sm:text-sm"
                          aria-label="Quotient familial IRPP"
                        />
                        {bases.irpp && bases.irpp.quotient < 0.5 && (
                          <p className="text-[10px] text-red-600">Minimum 0.5</p>
                        )}
                        {bases.irpp && bases.irpp.quotient > 10 && (
                          <p className="text-[10px] text-red-600">Maximum 10</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </NeuCard>

              <TaxSimulationPanel bases={bases} currency="XOF" />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default TaxesPage;

