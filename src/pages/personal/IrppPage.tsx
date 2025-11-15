import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { IrppSummary } from "@/components/personal/IrppSummary";
import { IrppRevenueForm, type IrppRevenueValues } from "@/components/personal/IrppRevenueForm";
import { IrppSimulation, type IrppSimulationResult } from "@/components/personal/IrppSimulation";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calculator, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = (workspaceId: string) => `proga.irpp.${workspaceId}`;

const loadRevenues = (workspaceId: string | undefined): IrppRevenueValues | null => {
  if (!workspaceId || typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY(workspaceId));
    if (!raw) return null;
    return JSON.parse(raw) as IrppRevenueValues;
  } catch {
    return null;
  }
};

const persistRevenues = (workspaceId: string | undefined, revenues: IrppRevenueValues) => {
  if (!workspaceId || typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY(workspaceId), JSON.stringify(revenues));
  } catch (error) {
    console.error("Error persisting IRPP revenues:", error);
  }
};

const defaultRevenues: IrppRevenueValues = {
  salaries: 0,
  rents: 0,
  bic: 0,
  bnc: 0,
  dividends: 0,
  deductions: 0,
  maritalStatus: "single",
  dependents: 0,
};

const IrppPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const [revenues, setRevenues] = useState<IrppRevenueValues>(defaultRevenues);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<IrppSimulationResult | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!currentWorkspace?.id) {
      setRevenues(defaultRevenues);
      setIsDirty(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const saved = loadRevenues(currentWorkspace.id);
      if (saved) {
        setRevenues(saved);
        setIsDirty(false);
      } else {
        setRevenues(defaultRevenues);
        setIsDirty(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement des revenus IRPP";
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
      persistRevenues(currentWorkspace.id, revenues);
      setIsDirty(false);
      setSuccess("Revenus IRPP sauvegardés avec succès");
      toast.success("Revenus IRPP sauvegardés");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [currentWorkspace?.id, revenues]);

  const handleSubmit = useCallback(
    (data: IrppRevenueValues) => {
      setRevenues(data);
      setIsDirty(true);
      persistRevenues(currentWorkspace?.id, data);
      toast.success("Revenus mis à jour");
    },
    [currentWorkspace?.id]
  );

  const handleSimulationResult = useCallback((result: IrppSimulationResult) => {
    setSimulationResult(result);
  }, []);

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
                  Sélectionnez un espace pour accéder au module IRPP.
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
                <p className="text-sm text-muted-foreground">Chargement des revenus IRPP...</p>
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
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-0.5 sm:mb-1 lg:mb-2 truncate">
                      Espace personnel · IRPP
                    </p>
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
                      Module IRPP
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
                  {isDirty && (
                    <NeuButton
                      variant="premium"
                      size="sm"
                      onClick={handleSave}
                      disabled={saving || loading}
                      className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
                      aria-label={saving ? "Sauvegarde en cours..." : "Sauvegarder les revenus IRPP"}
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
                  )}
                </div>
              </div>

              {(error || success) && (
                <div
                  className={`mt-4 neu-inset rounded-xl p-3 sm:p-4 border flex items-start gap-2 sm:gap-3 ${
                    error
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  {error ? (
                    <>
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-red-900 mb-0.5 sm:mb-1">Erreur</p>
                        <p className="text-[10px] sm:text-xs text-red-700 break-words">{error}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setError(null)}
                        className="text-red-600 hover:text-red-800 flex-shrink-0 text-lg sm:text-xl leading-none"
                        aria-label="Fermer le message d'erreur"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              )}
            </NeuCard>
          </header>

          <main className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4 lg:space-y-6 max-w-7xl mx-auto w-full">
            <Tabs defaultValue="summary" className="w-full">
              <NeuCard className="p-2 sm:p-3 lg:p-4 mb-3 sm:mb-4">
                <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0 gap-1.5 sm:gap-2">
                  <TabsTrigger
                    value="summary"
                    className="neu-card-sm px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-[10px] sm:text-xs lg:text-sm xl:text-base"
                  >
                    Résumé
                  </TabsTrigger>
                  <TabsTrigger
                    value="revenues"
                    className="neu-card-sm px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-[10px] sm:text-xs lg:text-sm xl:text-base"
                  >
                    Revenus
                  </TabsTrigger>
                  <TabsTrigger
                    value="simulation"
                    className="neu-card-sm px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-[10px] sm:text-xs lg:text-sm xl:text-base"
                  >
                    Simulation
                  </TabsTrigger>
                </TabsList>
              </NeuCard>

              <TabsContent value="summary" className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <IrppSummary
                  revenues={revenues}
                  taxAmount={simulationResult?.taxAmount}
                  taxableBase={simulationResult?.taxableBase}
                  quotient={simulationResult?.quotient}
                  effectiveRate={
                    simulationResult?.totalIncome
                      ? simulationResult.taxAmount / simulationResult.totalIncome
                      : 0
                  }
                  lastSimulationAt={simulationResult ? new Date().toISOString() : undefined}
                  currency="XOF"
                />
              </TabsContent>

              <TabsContent value="revenues" className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <IrppRevenueForm
                  defaultValues={revenues}
                  onSubmit={handleSubmit}
                  isSubmitting={saving}
                />
              </TabsContent>

              <TabsContent value="simulation" className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <IrppSimulation revenues={revenues} onResult={handleSimulationResult} currency="XOF" />
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default IrppPage;

