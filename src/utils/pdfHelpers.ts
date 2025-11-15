import type { EmploymentContract, Payslip } from "@/types/domain";

const createPdfBlob = (title: string, payload: unknown) => {
  const content = `${title}\n${JSON.stringify(payload, null, 2)}`;
  return new Blob([content], { type: "application/pdf" });
};

export const generateEmploymentContractPdf = async (contract: EmploymentContract) => {
  const blob = createPdfBlob("Contrat PRO.GA", {
    employee: contract.employeeName,
    role: contract.role,
    startDate: contract.startDate,
    hours: contract.weeklyHours,
    hourlyRate: contract.hourlyRate,
  });

  return blob;
};

export const generatePayslipPdf = async (payslip: Payslip) => {
  const blob = createPdfBlob("Fiche de paie PRO.GA", {
    period: payslip.period,
    gross: payslip.grossSalary,
    net: payslip.netPayable,
    employerContrib: payslip.employerContributions,
    employeeContrib: payslip.employeeContributions,
  });

  return blob;
};

