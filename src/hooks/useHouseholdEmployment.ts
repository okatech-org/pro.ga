import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
  EmploymentContract,
  EmploymentContractStatus,
  Payslip,
} from "@/types/domain";

const employerRate = 0.18;
const employeeRate = 0.08;

const dateIso = (value?: Date | string) =>
  value instanceof Date ? value.toISOString() : value ?? new Date().toISOString();

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const STORAGE_KEY = (workspaceId: string) => `proga.employment.${workspaceId}`;

type StoredData = {
  contracts: EmploymentContract[];
  payslips: Payslip[];
};

const loadStoredData = (workspaceId: string): StoredData => {
  if (typeof window === "undefined") {
    return { contracts: [], payslips: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY(workspaceId));
    if (!raw) return { contracts: [], payslips: [] };
    const parsed = JSON.parse(raw) as StoredData;
    return {
      contracts: parsed.contracts ?? [],
      payslips: parsed.payslips ?? [],
    };
  } catch {
    return { contracts: [], payslips: [] };
  }
};

const persistData = (workspaceId: string, data: StoredData) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY(workspaceId), JSON.stringify(data));
  } catch (error) {
    console.error("Error persisting employment data:", error);
  }
};

export type ContractInput = Omit<
  EmploymentContract,
  "id" | "status" | "createdAt" | "updatedAt"
> & {
  status?: EmploymentContractStatus;
};

export type PayslipInput = {
  contractId: string;
  period: string;
  workedHours: number;
  bonuses?: number;
};

export const useHouseholdEmployment = (workspaceId?: string | null) => {
  const [contracts, setContracts] = useState<EmploymentContract[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (!workspaceId) {
      setContracts([]);
      setPayslips([]);
      return;
    }

    const stored = loadStoredData(workspaceId);
    setContracts(stored.contracts);
    setPayslips(stored.payslips);
  }, [workspaceId]);

  const persist = useCallback(
    (nextContracts: EmploymentContract[], nextPayslips: Payslip[]) => {
      if (!workspaceId) return;
      persistData(workspaceId, { contracts: nextContracts, payslips: nextPayslips });
      setContracts(nextContracts);
      setPayslips(nextPayslips);
    },
    [workspaceId]
  );

  const addContract = useCallback(
    async (input: ContractInput) => {
      if (!workspaceId && !input.workspaceId) {
        const err = "Espace requis pour créer un contrat";
        setError(err);
        throw new Error(err);
      }

      setLoading(true);
      setError(null);

      try {
        const contract: EmploymentContract = {
          ...input,
          id: generateId(),
          workspaceId: input.workspaceId || workspaceId || "",
          status: (input.status?.toLowerCase() as EmploymentContractStatus) ?? "active",
          createdAt: dateIso(),
          updatedAt: dateIso(),
        };

        const nextContracts = [...contracts, contract];
        persist(nextContracts, payslips);
        toast.success("Contrat créé avec succès");
        return contract;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la création du contrat";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [workspaceId, contracts, payslips, persist]
  );

  const updateContract = useCallback(
    async (contractId: string, updates: Partial<ContractInput>) => {
      setLoading(true);
      setError(null);

      try {
        const nextContracts = contracts.map((contract) =>
          contract.id === contractId
            ? {
                ...contract,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : contract
        );
        persist(nextContracts, payslips);
        toast.success("Contrat mis à jour");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la mise à jour";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contracts, payslips, persist]
  );

  const deleteContract = useCallback(
    async (contractId: string) => {
      setLoading(true);
      setError(null);

      try {
        const contract = contracts.find((c) => c.id === contractId);
        if (!contract) {
          throw new Error("Contrat introuvable");
        }

        const relatedPayslips = payslips.filter((p) => p.contractId === contractId);
        if (relatedPayslips.length > 0) {
          const confirmed = window.confirm(
            `Ce contrat a ${relatedPayslips.length} fiche(s) de paie associée(s). Êtes-vous sûr de vouloir le supprimer ?`
          );
          if (!confirmed) {
            setLoading(false);
            return;
          }
        }

        const nextContracts = contracts.filter((c) => c.id !== contractId);
        const nextPayslips = payslips.filter((p) => p.contractId !== contractId);
        persist(nextContracts, nextPayslips);
        toast.success("Contrat supprimé");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la suppression";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contracts, payslips, persist]
  );

  const terminateContract = useCallback(
    async (contractId: string, endDate?: Date) => {
      setLoading(true);
      setError(null);

      try {
        const nextContracts = contracts.map((contract) =>
          contract.id === contractId
            ? {
                ...contract,
                status: "terminated" as const,
                endDate: endDate ? endDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
                updatedAt: new Date().toISOString(),
              }
            : contract
        );
        persist(nextContracts, payslips);
        toast.success("Contrat terminé");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la résiliation";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contracts, payslips, persist]
  );

  const generatePayslip = useCallback(
    async ({ contractId, period, workedHours, bonuses = 0 }: PayslipInput) => {
      setLoading(true);
      setError(null);

      try {
        const contract = contracts.find((item) => item.id === contractId);
        if (!contract) {
          throw new Error("Contrat introuvable");
        }

        if (workedHours <= 0) {
          throw new Error("Le nombre d'heures doit être supérieur à 0");
        }

        const existingPayslip = payslips.find(
          (p) => p.contractId === contractId && p.period === period
        );
        if (existingPayslip) {
          const confirmed = window.confirm(
            "Une fiche de paie existe déjà pour cette période. Voulez-vous la remplacer ?"
          );
          if (!confirmed) {
            setLoading(false);
            return existingPayslip;
          }
        }

        const grossSalary = workedHours * contract.hourlyRate;
        const employerContributions = grossSalary * employerRate;
        const employeeContributions = grossSalary * employeeRate;
        const netPayable = grossSalary - employeeContributions + bonuses;

        const payslip: Payslip = {
          id: generateId(),
          workspaceId: contract.workspaceId,
          contractId,
          period,
          grossSalary,
          taxableSalary: grossSalary,
          employerContributions,
          employeeContributions,
          netPayable,
          workedHours,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        let nextPayslips: Payslip[];
        if (existingPayslip) {
          nextPayslips = payslips.map((p) => (p.id === existingPayslip.id ? payslip : p));
        } else {
          nextPayslips = [...payslips, payslip];
        }

        persist(contracts, nextPayslips);
        toast.success("Fiche de paie générée avec succès");
        return payslip;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la génération de la fiche de paie";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contracts, payslips, persist]
  );

  const deletePayslip = useCallback(
    async (payslipId: string) => {
      setLoading(true);
      setError(null);

      try {
        const nextPayslips = payslips.filter((p) => p.id !== payslipId);
        persist(contracts, nextPayslips);
        toast.success("Fiche de paie supprimée");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la suppression";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [contracts, payslips, persist]
  );

  const stats = useMemo(() => {
    const activeContracts = contracts.filter((contract) => contract.status === "active").length;
    const terminatedContracts = contracts.filter((contract) => contract.status === "terminated").length;
    const payroll = payslips.reduce((sum, slip) => sum + slip.netPayable, 0);

    return { activeContracts, terminatedContracts, payroll };
  }, [contracts, payslips]);

  return {
    contracts,
    payslips,
    loading,
    error,
    clearError,
    stats,
    addContract,
    updateContract,
    deleteContract,
    terminateContract,
    generatePayslip,
    deletePayslip,
  };
};

