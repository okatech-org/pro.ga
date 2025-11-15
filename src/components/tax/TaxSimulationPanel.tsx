import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTaxEngine } from "@/hooks/useTaxEngine";
import type { TaxBases } from "@/types/domain";

type TaxSimulationPanelProps = {
  bases: TaxBases;
  currency?: string;
  onResult?: (result: ReturnType<typeof useTaxEngine>["runAll"]) => void;
};

const formatCurrency = (value: number, currency = "XOF") =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const TaxSimulationPanel = ({ bases, currency = "XOF" }: TaxSimulationPanelProps) => {
  const { runAll } = useTaxEngine();
  const result = runAll(bases);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Simulations fiscales</CardTitle>
        <CardDescription>Vue unifiée des taxes TVA / CSS / IS-IMF / IRPP.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <TaxCard
            title="TVA"
            amount={result.tva?.amount ?? 0}
            subtitle={`Collectée : ${formatCurrency(bases.tva?.collected ?? 0, currency)} · Déductible : ${formatCurrency(bases.tva?.deductible ?? 0, currency)}`}
            currency={currency}
          />
          <TaxCard
            title="CSS"
            amount={result.css?.amount ?? 0}
            subtitle={`Base : ${formatCurrency(bases.css?.base ?? 0, currency)}`}
            currency={currency}
          />
          <TaxCard
            title="IS / IMF"
            amount={result.isVsImf?.amount ?? 0}
            subtitle={`Mode : ${result.isVsImf?.applied === "is" ? "IS" : "IMF"}`}
            currency={currency}
          />
          <TaxCard
            title="IRPP"
            amount={result.irpp?.amount ?? 0}
            subtitle={`Quotient : ${result.irpp?.parts ?? 1}`}
            currency={currency}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Effort global</p>
            <Badge variant="outline">
              {formatCurrency(
                (result.tva?.amount ?? 0) +
                  (result.css?.amount ?? 0) +
                  (result.isVsImf?.amount ?? 0) +
                  (result.irpp?.amount ?? 0),
                currency,
              )}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Total basé sur les dernières bases déclarées. Ajustez les montants depuis les modules IRPP/TVA.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const TaxCard = ({
  title,
  amount,
  subtitle,
  currency,
}: {
  title: string;
  amount: number;
  subtitle: string;
  currency: string;
}) => (
  <div className="rounded-xl border border-border p-4 space-y-2">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-semibold">{formatCurrency(amount, currency)}</p>
    <p className="text-xs text-muted-foreground">{subtitle}</p>
  </div>
);

