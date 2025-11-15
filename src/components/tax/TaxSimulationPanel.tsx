import { useMemo, useEffect } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { Badge } from "@/components/ui/badge";
import { useTaxEngine } from "@/hooks/useTaxEngine";
import { TrendingUp, Calculator, Receipt, DollarSign } from "lucide-react";
import type { TaxBases } from "@/types/domain";

type TaxSimulationPanelProps = {
  bases: TaxBases;
  currency?: string;
  onResult?: (result: ReturnType<ReturnType<typeof useTaxEngine>["runAll"]>) => void;
};

const formatCurrency = (value: number, currency = "XOF") =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const TaxSimulationPanel = ({ bases, currency = "XOF", onResult }: TaxSimulationPanelProps) => {
  const { runAll } = useTaxEngine();
  const result = useMemo(() => runAll(bases), [runAll, bases]);

  useEffect(() => {
    onResult?.(result);
  }, [onResult, result]);

  const totalTax = useMemo(
    () =>
      (result.tva?.amount ?? 0) +
      (result.css?.amount ?? 0) +
      (result.isVsImf?.amount ?? 0) +
      (result.irpp?.amount ?? 0),
    [result]
  );

  return (
    <NeuCard className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" aria-hidden="true" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Simulations fiscales</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Vue unifiée des taxes TVA / CSS / IS-IMF / IRPP.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <TaxCard
          title="TVA"
          amount={result.tva?.amount ?? 0}
          subtitle={`Collectée : ${formatCurrency(bases.tva?.collected ?? 0, currency)} · Déductible : ${formatCurrency(bases.tva?.deductible ?? 0, currency)}`}
          currency={currency}
          icon={Receipt}
          color="warning"
        />
        <TaxCard
          title="CSS"
          amount={result.css?.amount ?? 0}
          subtitle={`Base : ${formatCurrency(bases.css?.base ?? 0, currency)}`}
          currency={currency}
          icon={TrendingUp}
          color="info"
        />
        <TaxCard
          title="IS / IMF"
          amount={result.isVsImf?.amount ?? 0}
          subtitle={`Mode : ${result.isVsImf?.applied === "is" ? "IS" : "IMF"}`}
          currency={currency}
          icon={Calculator}
          color="success"
        />
        <TaxCard
          title="IRPP"
          amount={result.irpp?.amount ?? 0}
          subtitle={`Quotient : ${result.irpp?.parts ?? 1} parts`}
          currency={currency}
          icon={DollarSign}
          color="primary"
        />
      </div>

      <div className="pt-4 sm:pt-6 border-t border-border space-y-3">
        <div className="neu-inset rounded-xl p-4 sm:p-5 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" aria-hidden="true" />
              <p className="text-sm sm:text-base font-semibold text-slate-900">Effort fiscal global</p>
            </div>
            <Badge variant="default" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
              {formatCurrency(totalTax, currency)}
            </Badge>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Total calculé automatiquement à partir des bases saisies. Les montants peuvent être ajustés depuis les modules dédiés.
          </p>
        </div>

        {result.tva && result.tva.credit > 0 && (
          <div className="neu-inset rounded-xl p-3 sm:p-4 bg-info/5 border-info/20">
            <p className="text-xs sm:text-sm text-info">
              <strong>Crédit TVA disponible :</strong> {formatCurrency(result.tva.credit, currency)}
            </p>
          </div>
        )}
      </div>
    </NeuCard>
  );
};

const TaxCard = ({
  title,
  amount,
  subtitle,
  currency,
  icon: Icon,
  color = "primary",
}: {
  title: string;
  amount: number;
  subtitle: string;
  currency: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: "primary" | "success" | "warning" | "info";
}) => {
  const colorClasses = {
    primary: "from-blue-400 to-blue-600 text-blue-600",
    success: "from-green-400 to-green-600 text-green-600",
    warning: "from-orange-400 to-orange-600 text-orange-600",
    info: "from-purple-400 to-purple-600 text-purple-600",
  }[color];

  return (
    <div className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {Icon && (
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${colorClasses} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
            </div>
          )}
          <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{title}</p>
        </div>
      </div>
      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-1 truncate" title={formatCurrency(amount, currency)}>
        {formatCurrency(amount, currency)}
      </p>
      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2" title={subtitle}>
        {subtitle}
      </p>
    </div>
  );
};

