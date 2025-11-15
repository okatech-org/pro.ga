import { useCallback, useMemo, useState } from "react";
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

export const useHouseholdEmployment = (workspaceId?: string) => {
  const [contracts, setContracts] = useState<EmploymentContract[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);

  const addContract = useCallback(
    async (input: ContractInput) => {
      if (!workspaceId && !input.workspaceId) {
        throw new Error("workspaceId requis pour créer un contrat");
      }

      setLoading(true);

      const contract: EmploymentContract = {
        ...input,
        id: generateId(),
        workspaceId: input.workspaceId || workspaceId || "",
        status: input.status ?? "active",
        createdAt: dateIso(),
        updatedAt: dateIso(),
      };

      setContracts((prev) => [...prev, contract]);
      setLoading(false);
      return contract;
    },
    [workspaceId],
  );

  const terminateContract = useCallback((contractId: string, endDate?: string) => {
    setContracts((prev) =>
      prev.map((contract) =>
        contract.id === contractId
          ? {
              ...contract,
              status: "terminated",
              endDate: endDate || dateIso(),
              updatedAt: dateIso(),
            }
          : contract,
      ),
    );
  }, []);

  const generatePayslip = useCallback(
    async ({ contractId, period, workedHours, bonuses = 0 }: PayslipInput) => {
      const contract = contracts.find((item) => item.id === contractId);
      if (!contract) {
        throw new Error("Contrat introuvable");
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
        metadata: { bonuses },
        createdAt: dateIso(),
        updatedAt: dateIso(),
      };

      setPayslips((prev) => [...prev, payslip]);
      return payslip;
    },
    [contracts],
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
    stats,
    addContract,
    terminateContract,
    generatePayslip,
  };
};

