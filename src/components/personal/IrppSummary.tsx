import { NeuCard } from "@/components/ui/neu-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, TrendingUp, Receipt, DollarSign } from "lucide-react";
import type { IrppRevenueValues } from "./IrppRevenueForm";

type IrppSummaryProps = {
  revenues: IrppRevenueValues;
  taxAmount?: number;
  taxableBase?: number;
  quotient?: number;
  effectiveRate?: number;
  lastSimulationAt?: string;
  currency?: string;
};

const formatCurrency = (value: number, currency = "XOF") =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const IrppSummary = ({
  revenues,
  taxAmount = 0,
  taxableBase = 0,
  quotient = 1,
  effectiveRate = 0,
  lastSimulationAt,
  currency = "XOF",
}: IrppSummaryProps) => {
  const totalIncome =
    revenues.salaries +
    revenues.rents +
    revenues.bic +
    revenues.bnc +
    revenues.dividends;

  const contribution = totalIncome ? Math.min((taxAmount / totalIncome) * 100, 100) : 0;

  const rows = [
    { label: "Salaires", value: revenues.salaries, icon: Receipt },
    { label: "Loyers", value: revenues.rents, icon: DollarSign },
    { label: "BIC", value: revenues.bic, icon: TrendingUp },
    { label: "BNC", value: revenues.bnc, icon: TrendingUp },
    { label: "Dividendes", value: revenues.dividends, icon: DollarSign },
  ].filter((row) => row.value > 0);

  return (
    <NeuCard className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" aria-hidden="true" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Résumé fiscal</h2>
          </div>
          <Badge variant="secondary" className="text-xs sm:text-sm">
            {quotient.toFixed(2)} parts
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Base nette et effort contributif pour la déclaration IRPP.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="neu-inset rounded-xl p-4 sm:p-5 bg-primary/5 border-primary/20">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">Revenus totaux</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 truncate" title={formatCurrency(totalIncome, currency)}>
            {formatCurrency(totalIncome, currency)}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all">
            <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground mb-1.5 sm:mb-2 font-semibold">
              Base taxable
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1 truncate" title={formatCurrency(taxableBase, currency)}>
              {formatCurrency(taxableBase, currency)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Déductions : {formatCurrency(revenues.deductions, currency)}
            </p>
          </div>
          <div className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all bg-primary/5 border-primary/20">
            <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground mb-1.5 sm:mb-2 font-semibold">
              Impôt estimé
            </p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-1 truncate" title={formatCurrency(taxAmount, currency)}>
              {formatCurrency(taxAmount, currency)}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Taux effectif : {(effectiveRate * 100).toFixed(1)} %
            </p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-900">Effort contributif</span>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">{contribution.toFixed(1)} %</span>
          </div>
          <Progress value={contribution} className="h-2 sm:h-3" aria-label={`Effort contributif : ${contribution.toFixed(1)}%`} />
        </div>

        {rows.length > 0 && (
          <div className="pt-4 border-t border-border space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3">
              Détail des revenus
            </p>
            <div className="space-y-2">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="neu-inset rounded-xl px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 hover:neu-raised transition-all"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {row.icon && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                        <row.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                      </div>
                    )}
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium truncate">{row.label}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap" title={formatCurrency(row.value, currency)}>
                    {formatCurrency(row.value, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {rows.length === 0 && (
          <div className="text-center py-6 sm:py-8 neu-inset rounded-xl">
            <Calculator className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              Aucun revenu ventilé
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Renseignez les montants pour suivre la contribution.
            </p>
          </div>
        )}

        {lastSimulationAt && (
          <div className="pt-4 border-t border-border">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Dernière simulation : {new Date(lastSimulationAt).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        )}
      </div>
    </NeuCard>
  );
};

