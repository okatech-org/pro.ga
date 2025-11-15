import { useEffect, useMemo } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { Badge } from "@/components/ui/badge";
import { useTaxEngine } from "@/hooks/useTaxEngine";
import { Calculator, TrendingUp, DollarSign, Percent } from "lucide-react";
import type { IrppRevenueValues } from "./IrppRevenueForm";

export type IrppSimulationResult = {
  taxableBase: number;
  totalIncome: number;
  quotient: number;
  taxAmount: number;
  taxablePerPart: number;
};

type IrppSimulationProps = {
  revenues: IrppRevenueValues;
  onResult?: (result: IrppSimulationResult) => void;
  currency?: string;
};

const MARITAL_PARTS: Record<IrppRevenueValues["maritalStatus"], number> = {
  single: 1,
  married: 2,
  pacsed: 2,
  divorced: 1,
  widowed: 1.5,
};

const computeParts = (maritalStatus: IrppRevenueValues["maritalStatus"], dependents: number) => {
  const base = MARITAL_PARTS[maritalStatus] ?? 1;
  if (dependents <= 0) return base;
  if (dependents === 1) return base + 0.5;
  if (dependents === 2) return base + 1;
  return base + 1 + (dependents - 2);
};

const formatCurrency = (value: number, currency = "XOF") =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const IrppSimulation = ({ revenues, onResult, currency = "XOF" }: IrppSimulationProps) => {
  const { computeIRPP } = useTaxEngine();

  const simulation = useMemo(() => {
    const totalIncome =
      revenues.salaries +
      revenues.rents +
      revenues.bic +
      revenues.bnc +
      revenues.dividends;

    const taxableBase = Math.max(totalIncome - revenues.deductions, 0);
    const quotient = computeParts(revenues.maritalStatus, revenues.dependents);
    const result = computeIRPP(taxableBase, quotient);

    return {
      taxableBase,
      totalIncome,
      quotient: result.parts,
      taxAmount: result.amount,
      taxablePerPart: result.taxablePerPart,
    } satisfies IrppSimulationResult;
  }, [computeIRPP, revenues]);

  useEffect(() => {
    onResult?.(simulation);
  }, [simulation, onResult]);

  const effectiveRate = simulation.totalIncome
    ? simulation.taxAmount / simulation.totalIncome
    : 0;

  const maritalStatusLabels: Record<IrppRevenueValues["maritalStatus"], string> = {
    single: "Célibataire",
    married: "Marié(e)",
    pacsed: "Pacsé(e)",
    divorced: "Divorcé(e)",
    widowed: "Veuf/Veuve",
  };

  return (
    <NeuCard className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" aria-hidden="true" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Simulation IRPP</h2>
          </div>
          <Badge variant="secondary" className="text-xs sm:text-sm">
            {simulation.quotient.toFixed(2)} parts
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Projection basée sur le barème progressif national.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" aria-hidden="true" />
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                Base nette
              </p>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1 truncate" title={formatCurrency(simulation.taxableBase, currency)}>
              {formatCurrency(simulation.taxableBase, currency)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              Total revenus : {formatCurrency(simulation.totalIncome, currency)}
            </p>
          </div>

          <div className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" aria-hidden="true" />
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                Impôt estimé
              </p>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-1 truncate" title={formatCurrency(simulation.taxAmount, currency)}>
              {formatCurrency(simulation.taxAmount, currency)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Taux effectif : {(effectiveRate * 100).toFixed(1)} %
            </p>
          </div>

          <div className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" aria-hidden="true" />
              <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                Taxe / part
              </p>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1 truncate" title={formatCurrency(simulation.taxablePerPart, currency)}>
              {formatCurrency(simulation.taxablePerPart, currency)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Quotient familial : {simulation.quotient.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="neu-inset rounded-xl p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-1.5 sm:mb-2">Situation familiale</p>
            <p className="text-sm sm:text-base text-muted-foreground capitalize">
              {maritalStatusLabels[revenues.maritalStatus] || revenues.maritalStatus}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              Personnes à charge : {revenues.dependents}
            </p>
          </div>
          <div className="neu-inset rounded-xl p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-1.5 sm:mb-2">Déductions</p>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              {formatCurrency(revenues.deductions, currency)}
            </p>
          </div>
        </div>
      </div>
    </NeuCard>
  );
};

