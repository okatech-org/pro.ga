import { useMemo } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Badge } from "@/components/ui/badge";
import { Users, Edit2, Trash2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { EmploymentContract, EmploymentContractStatus } from "@/types/domain";

type HouseholdEmploymentListProps = {
  contracts: EmploymentContract[];
  onSelect?: (contract: EmploymentContract) => void;
  onEdit?: (contract: EmploymentContract) => void;
  onDelete?: (contract: EmploymentContract) => void;
  onTerminate?: (contract: EmploymentContract) => void;
  loading?: boolean;
  emptyStateMessage?: string;
};

const statusVariant: Record<
  EmploymentContractStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  draft: "secondary",
  active: "default",
  suspended: "outline",
  terminated: "destructive",
};

const statusLabels: Record<EmploymentContractStatus, string> = {
  draft: "Brouillon",
  active: "Actif",
  suspended: "Suspendu",
  terminated: "Terminé",
};

const contractTypeLabels: Record<string, string> = {
  household: "Employé de maison",
  nanny: "Nounou",
  driver: "Chauffeur",
  guard: "Gardien",
  custom: "Autre",
};

export const HouseholdEmploymentList = ({
  contracts,
  onSelect,
  onEdit,
  onDelete,
  onTerminate,
  loading = false,
  emptyStateMessage = "Aucun contrat enregistré pour cet espace.",
}: HouseholdEmploymentListProps) => {
  const [contractToDelete, setContractToDelete] = useState<EmploymentContract | null>(null);
  const [contractToTerminate, setContractToTerminate] = useState<EmploymentContract | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const sortedContracts = useMemo(() => {
    return [...contracts].sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [contracts]);

  if (!contracts.length) {
    return (
      <NeuCard className="p-6 sm:p-8">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            Aucun contrat
          </h3>
          <p className="text-sm text-muted-foreground px-4">{emptyStateMessage}</p>
        </div>
      </NeuCard>
    );
  }

  return (
    <>
      <NeuCard className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Contrats d'emploi à domicile
          </h2>
          <Badge variant="secondary" className="text-sm">
            {contracts.length} {contracts.length === 1 ? "contrat" : "contrats"}
          </Badge>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {sortedContracts.map((contract) => (
            <div
              key={contract.id}
              className="neu-inset rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 hover:neu-raised transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0" onClick={() => onSelect?.(contract)}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-base sm:text-lg text-slate-900 truncate">
                          {contract.employeeName}
                        </p>
                        <Badge variant={statusVariant[contract.status]} className="text-xs">
                          {statusLabels[contract.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{contract.role}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {contractTypeLabels[contract.contractType] || contract.contractType}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Taux horaire</p>
                      <p className="font-medium text-slate-900">
                        {contract.hourlyRate.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Heures / semaine</p>
                      <p className="font-medium text-slate-900">{contract.weeklyHours} h</p>
                    </div>
                    {contract.startDate && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Début</p>
                        <p className="font-medium text-slate-900">
                          {new Date(contract.startDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  {contract.status === "active" && (
                    <>
                      {onEdit && (
                        <NeuButton
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(contract)}
                          disabled={loading || actionLoading !== null}
                          className="flex-shrink-0"
                          aria-label="Modifier le contrat"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="hidden sm:inline ml-2">Modifier</span>
                        </NeuButton>
                      )}
                      {onTerminate && (
                        <NeuButton
                          variant="outline"
                          size="sm"
                          onClick={() => setContractToTerminate(contract)}
                          disabled={loading || actionLoading !== null}
                          className="flex-shrink-0"
                          aria-label="Terminer le contrat"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="hidden sm:inline ml-2">Terminer</span>
                        </NeuButton>
                      )}
                    </>
                  )}
                  {onDelete && (
                    <NeuButton
                      variant="outline"
                      size="sm"
                      onClick={() => setContractToDelete(contract)}
                      disabled={loading || actionLoading !== null}
                      className="flex-shrink-0 text-destructive hover:text-destructive"
                      aria-label="Supprimer le contrat"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline ml-2">Supprimer</span>
                    </NeuButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </NeuCard>

      <Dialog open={!!contractToDelete} onOpenChange={(open) => !open && setContractToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer le contrat</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le contrat de {contractToDelete?.employeeName} ?{" "}
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <NeuButton
              variant="outline"
              onClick={() => setContractToDelete(null)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Annuler
            </NeuButton>
            <NeuButton
              variant="premium"
              onClick={async () => {
                if (contractToDelete && onDelete) {
                  setActionLoading(contractToDelete.id);
                  try {
                    await onDelete(contractToDelete);
                    setContractToDelete(null);
                  } catch (err) {
                    console.error("Error deleting contract:", err);
                  } finally {
                    setActionLoading(null);
                  }
                }
              }}
              disabled={loading || actionLoading === contractToDelete?.id}
              className="w-full sm:w-auto"
            >
              {loading || actionLoading === contractToDelete?.id ? (
                <>
                  <span className="mr-2">⏳</span>
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </NeuButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!contractToTerminate}
        onOpenChange={(open) => !open && setContractToTerminate(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Terminer le contrat</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir terminer le contrat de {contractToTerminate?.employeeName} ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <NeuButton
              variant="outline"
              onClick={() => setContractToTerminate(null)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Annuler
            </NeuButton>
            <NeuButton
              variant="premium"
              onClick={async () => {
                if (contractToTerminate && onTerminate) {
                  setActionLoading(contractToTerminate.id);
                  try {
                    await onTerminate(contractToTerminate);
                    setContractToTerminate(null);
                  } catch (err) {
                    console.error("Error terminating contract:", err);
                  } finally {
                    setActionLoading(null);
                  }
                }
              }}
              disabled={loading || actionLoading === contractToTerminate?.id}
              className="w-full sm:w-auto"
            >
              {loading || actionLoading === contractToTerminate?.id ? (
                <>
                  <span className="mr-2">⏳</span>
                  Traitement...
                </>
              ) : (
                "Terminer"
              )}
            </NeuButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

