import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Upload, Users, Calendar, Calculator, DollarSign, FolderOpen, TrendingUp, Activity } from "lucide-react";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuIconPill } from "@/components/ui/neu-icon-pill";
import { NeuCard } from "@/components/ui/neu-card";
import { CircularProgress } from "@/components/charts/CircularProgress";
import { MiniBarChart } from "@/components/charts/MiniBarChart";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useHouseholdEmployment } from "@/hooks/useHouseholdEmployment";
import { useDocuments } from "@/hooks/useDocuments";
import { useTaxEngine } from "@/hooks/useTaxEngine";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XAF",
  maximumFractionDigits: 0,
});

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
};

export const PersonalDashboard = () => {
  const navigate = useNavigate();
  const { currentWorkspace, person, isPersonalSpace } = useWorkspaces();
  const workspaceId = currentWorkspace?.id;
  const { contracts, stats, addContract, loading: contractsLoading, error: contractsError } = useHouseholdEmployment(workspaceId);
  const { documents, isLoading: documentsLoading } = useDocuments(workspaceId);
  const { computeIRPP } = useTaxEngine();
  const seededRef = useRef(false);

  useEffect(() => {
    if (!isPersonalSpace || !workspaceId || seededRef.current || contracts.length > 0 || contractsLoading) return;
    seededRef.current = true;

    (async () => {
      try {
        await addContract({
          workspaceId,
          employeeName: "Nounou - Awa",
          role: "Assistante familiale",
          contractType: "nanny",
          hourlyRate: 2500,
          weeklyHours: 40,
          startDate: new Date().toISOString().split("T")[0],
          status: "active",
        });
        await addContract({
          workspaceId,
          employeeName: "Chauffeur - Léon",
          role: "Chauffeur",
          contractType: "driver",
          hourlyRate: 3000,
          weeklyHours: 35,
          startDate: new Date().toISOString().split("T")[0],
          status: "active",
        });
      } catch (error) {
        console.error("Erreur lors de l'initialisation des contrats:", error);
      }
    })();
  }, [isPersonalSpace, workspaceId, contracts.length, contractsLoading, addContract]);

  const irppResult = useMemo(() => {
    const base = 12_000_000;
    const quotient = person?.foyerInfo?.quotientFamilial ?? 1;
    return computeIRPP(base, quotient);
  }, [person?.foyerInfo?.quotientFamilial, computeIRPP]);

  const kpis = [
    {
      label: "IRPP estimé",
      value: currency.format(irppResult.amount),
      description: "Impôt sur le revenu des personnes physiques",
      accent: "text-primary",
      icon: Calculator,
      iconColor: "primary" as const,
    },
    {
      label: "Contrats domicile",
      value: `${stats.activeContracts} actif${stats.activeContracts > 1 ? "s" : ""}`,
      description: "Emploi à domicile actif",
      accent: "text-success",
      icon: Users,
      iconColor: "success" as const,
    },
    {
      label: "Documents",
      value: `${documents.length} fichier${documents.length > 1 ? "s" : ""}`,
      description: "Justificatifs et pièces jointes",
      accent: "text-foreground",
      icon: FolderOpen,
      iconColor: "info" as const,
    },
    {
      label: "Taux effectif",
      value: `${((irppResult.amount / 12_000_000) * 100).toFixed(1)}%`,
      description: "Pourcentage de revenu imposé",
      accent: "text-emerald-600",
      icon: TrendingUp,
      iconColor: "warning" as const,
    },
  ];

  const upcomingContracts = contracts.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fadeIn">
        {kpis.map((kpi) => (
          <NeuCard key={kpi.label} className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <NeuIconPill icon={kpi.icon} color={kpi.iconColor} size="md" className="flex-shrink-0" />
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className={`text-2xl sm:text-3xl font-bold ${kpi.accent} mb-1 truncate`} title={kpi.value}>
                  {kpi.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-0.5 truncate" title={kpi.label}>
                  {kpi.label}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2" title={kpi.description}>
                  {kpi.description}
                </p>
              </div>
            </div>
          </NeuCard>
        ))}
      </section>

      {/* Section Graphiques et Statistiques */}
      <section className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slideIn" style={{ animationDelay: '0.1s' }}>
        <NeuCard className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <NeuIconPill icon={TrendingUp} color="primary" size="sm" className="flex-shrink-0" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Répartition IRPP</h3>
          </div>
          <div className="flex justify-center">
            <CircularProgress
              value={irppResult.amount}
              max={12_000_000}
              size={120}
              strokeWidth={12}
              color="primary"
              label="du revenu"
              showValue={true}
              className="sm:w-[140px] sm:h-[140px]"
            />
          </div>
          <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground truncate pr-2">Revenu imposable</span>
              <span className="font-semibold whitespace-nowrap">{currency.format(12_000_000)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground truncate pr-2">IRPP à payer</span>
              <span className="font-semibold text-primary whitespace-nowrap">{currency.format(irppResult.amount)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground truncate pr-2">Taux effectif</span>
              <span className="font-semibold whitespace-nowrap">{((irppResult.amount / 12_000_000) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </NeuCard>

        <NeuCard className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <NeuIconPill icon={Activity} color="success" size="sm" className="flex-shrink-0" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Charges mensuelles</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <MiniBarChart
              data={[
                { label: "Jan", value: 350000, color: "from-primary/60 to-primary" },
                { label: "Fév", value: 380000, color: "from-primary/60 to-primary" },
                { label: "Mar", value: 420000, color: "from-success/60 to-success" },
                { label: "Avr", value: 390000, color: "from-primary/60 to-primary" },
                { label: "Mai", value: 410000, color: "from-success/60 to-success" },
              ]}
              height={100}
              className="sm:h-[120px]"
            />
            <div className="pt-3 sm:pt-4 border-t border-border">
              <div className="flex justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                <span className="text-muted-foreground truncate pr-2">Moyenne mensuelle</span>
                <span className="font-semibold whitespace-nowrap">{currency.format(390000)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground truncate pr-2">Total annuel projeté</span>
                <span className="font-semibold text-primary whitespace-nowrap">{currency.format(4680000)}</span>
              </div>
            </div>
          </div>
        </NeuCard>

        <NeuCard className="p-4 sm:p-6 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <NeuIconPill icon={Calendar} color="info" size="sm" className="flex-shrink-0" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Échéances fiscales</h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-1.5 animate-pulse flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">Déclaration IRPP</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Échéance dans 45 jours</p>
                  <div className="mt-1.5 sm:mt-2 w-full bg-muted rounded-full h-1.5">
                    <div className="bg-warning h-1.5 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">CSS Personnel</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Payé le 15/01/2025</p>
                  <div className="mt-1.5 sm:mt-2 w-full bg-muted rounded-full h-1.5">
                    <div className="bg-success h-1.5 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">Taxe foncière</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Prochaine échéance en septembre</p>
                  <div className="mt-1.5 sm:mt-2 w-full bg-muted rounded-full h-1.5">
                    <div className="bg-muted-foreground h-1.5 rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NeuCard>
      </section>

      <section className="grid gap-4 sm:gap-6 md:grid-cols-2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <NeuCard className="p-4 sm:p-6">
          <div className="flex flex-row items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <NeuIconPill icon={Users} color="success" size="sm" className="flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Emploi à domicile</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Suivez vos contrats actifs</p>
              </div>
            </div>
            <NeuButton size="sm" variant="outline" onClick={() => navigate("/dashboard/perso/emploi")} className="flex-shrink-0 ml-2">
              <Plus className="w-4 h-4" />
            </NeuButton>
          </div>
          
              <div className="space-y-2 sm:space-y-3">
                {upcomingContracts.length === 0 ? (
                    <div className="rounded-xl bg-gray-50 px-3 sm:px-4 py-6 sm:py-8 text-center">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">Aucun contrat pour le moment</p>
                    <NeuButton 
                      size="sm" 
                      variant="outline" 
                      className="mt-2 sm:mt-3"
                      onClick={() => navigate("/dashboard/perso/emploi")}
                    >
                      Créer un contrat
                    </NeuButton>
                  </div>
                ) : (
                  <>
                    {upcomingContracts.map((contract) => (
                      <div key={contract.id} className="rounded-xl bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">{contract.employeeName}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                              {contract.role} · Prochaine paie : {formatDate(contract.updatedAt)}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-success bg-success/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full capitalize flex-shrink-0 whitespace-nowrap">
                          {contract.status}
                        </span>
                      </div>
                    ))}
                    <NeuButton 
                      variant="outline" 
                      className="w-full mt-2 text-xs sm:text-sm" 
                      onClick={() => navigate("/dashboard/perso/emploi")}
                    >
                      Voir tous les contrats
                    </NeuButton>
                  </>
                )}
              </div>
        </NeuCard>

            <NeuCard className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <NeuIconPill icon={Calculator} color="primary" size="sm" className="flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Simulation IRPP</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Quotient familial : {person?.foyerInfo?.quotientFamilial ?? 1} parts
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-xl bg-gray-50 px-3 sm:px-5 py-3 sm:py-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate pr-2">Revenu net imposable</p>
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5 sm:mb-2 truncate">{currency.format(12_000_000)}</p>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs">
                    <div className="flex-1 bg-primary/10 rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-primary rounded-full h-1.5 sm:h-2" 
                        style={{ width: `${Math.min((irppResult.amount / 12_000_000 * 100), 100)}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground font-medium whitespace-nowrap">
                      {(irppResult.amount / 12_000_000 * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 px-3 sm:px-5 py-3 sm:py-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5 sm:mb-1 truncate">IRPP estimé</p>
                      <p className="text-xl sm:text-2xl font-bold text-primary truncate">{currency.format(irppResult.amount)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Taux effectif</p>
                      <p className="text-base sm:text-lg font-bold text-slate-900 whitespace-nowrap">
                        {(irppResult.amount / 12_000_000 * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-1.5 sm:gap-2">
                  <NeuButton variant="default" className="flex items-center justify-center gap-2 w-full text-xs sm:text-sm" onClick={() => navigate("/dashboard/perso/irpp")}>
                    <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">Lancer une simulation complète</span>
                  </NeuButton>
                  <NeuButton variant="outline" className="flex items-center justify-center gap-2 w-full text-xs sm:text-sm" onClick={() => navigate("/dashboard/ia")}>
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate">Importer justificatifs</span>
                  </NeuButton>
                </div>
              </div>
            </NeuCard>
      </section>

          <NeuCard className="p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-0.5 sm:mb-1 truncate">Actions rapides</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 truncate">Gérez votre foyer en un clic</p>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              <NeuButton variant="outline" className="py-4 sm:py-6 flex flex-col items-start gap-1.5 sm:gap-2 justify-start" onClick={() => navigate("/dashboard/perso/emploi")}>
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <div className="min-w-0 w-full">
                  <p className="font-semibold text-xs sm:text-sm truncate">Ajouter un emploi</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Contrat, fiche de paie…</p>
                </div>
              </NeuButton>
              <NeuButton variant="outline" className="py-4 sm:py-6 flex flex-col items-start gap-1.5 sm:gap-2 justify-start" onClick={() => navigate("/dashboard/taxes")}>
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" />
                <div className="min-w-0 w-full">
                  <p className="font-semibold text-xs sm:text-sm truncate">Planifier ma déclaration</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Rappels IRPP & CSS</p>
                </div>
              </NeuButton>
              <NeuButton variant="outline" className="py-4 sm:py-6 flex flex-col items-start gap-1.5 sm:gap-2 justify-start" onClick={() => navigate("/dashboard/ia")}>
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-warning flex-shrink-0" />
                <div className="min-w-0 w-full">
                  <p className="font-semibold text-xs sm:text-sm truncate">Uploader un justificatif</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Bulletins, contrats, relevés</p>
                </div>
              </NeuButton>
            </div>
          </NeuCard>
    </div>
  );
};

