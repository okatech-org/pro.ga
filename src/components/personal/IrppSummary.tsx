import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    { label: "Salaires", value: revenues.salaries },
    { label: "Loyers", value: revenues.rents },
    { label: "BIC", value: revenues.bic },
    { label: "BNC", value: revenues.bnc },
    { label: "Dividendes", value: revenues.dividends },
  ].filter((row) => row.value > 0);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Résumé fiscal</CardTitle>
          <CardDescription>
            Base nette et effort contributif pour la déclaration IRPP.
          </CardDescription>
        </div>
        <Badge variant="outline">{quotient.toFixed(2)} parts</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Revenus totaux</p>
          <p className="text-2xl font-bold">{formatCurrency(totalIncome, currency)}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Base taxable</p>
            <p className="text-lg font-semibold">{formatCurrency(taxableBase, currency)}</p>
            <p className="text-xs text-muted-foreground">
              Déductions : {formatCurrency(revenues.deductions, currency)}
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Impôt estimé</p>
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(taxAmount, currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              Taux effectif : {(effectiveRate * 100).toFixed(1)} %
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Effort contributif</span>
            <span className="text-sm text-muted-foreground">{contribution.toFixed(1)} %</span>
          </div>
          <Progress value={contribution} />
        </div>

        <div className="space-y-2">
          {rows.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aucun revenu ventilé, renseignez les montants pour suivre la contribution.
            </p>
          )}
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium">{formatCurrency(row.value, currency)}</span>
            </div>
          ))}
        </div>

        {lastSimulationAt && (
          <p className="text-xs text-muted-foreground">
            Dernière simulation : {new Date(lastSimulationAt).toLocaleString("fr-FR")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

