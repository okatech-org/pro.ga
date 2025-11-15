import { useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTaxEngine } from "@/hooks/useTaxEngine";
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

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Simulation IRPP</CardTitle>
            <CardDescription>Projection basée sur le barème progressif national.</CardDescription>
          </div>
          <Badge variant="secondary">{simulation.quotient.toFixed(2)} parts</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Base nette</p>
            <p className="text-xl font-semibold">
              {formatCurrency(simulation.taxableBase, currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              Total revenus : {formatCurrency(simulation.totalIncome, currency)}
            </p>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Impôt estimé</p>
            <p className="text-xl font-semibold text-primary">
              {formatCurrency(simulation.taxAmount, currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              Taux effectif : {(effectiveRate * 100).toFixed(1)} %
            </p>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Taxe / part</p>
            <p className="text-xl font-semibold">{formatCurrency(simulation.taxablePerPart, currency)}</p>
            <p className="text-xs text-muted-foreground">
              Quotient familial : {simulation.quotient.toFixed(2)}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Situation familiale</p>
            <p className="text-sm text-muted-foreground capitalize">{revenues.maritalStatus}</p>
            <p className="text-xs text-muted-foreground">
              Personnes à charge : {revenues.dependents}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Déductions</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(revenues.deductions, currency)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

