import { NeuCard } from "@/components/ui/neu-card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp } from "lucide-react";
import type { TaxBases } from "@/types/domain";

type AiExtractionResultProps = {
  summary?: {
    taxes?: Partial<TaxBases>;
    keywords?: string[];
    notes?: string;
  };
  loading?: boolean;
};

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(
    value,
  );

export const AiExtractionResult = ({ summary, loading }: AiExtractionResultProps) => {
  const taxes = summary?.taxes;
  const hasData = Boolean(taxes);

  return (
    <NeuCard className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-bold text-lg">Résultats IA</h3>
            <p className="text-sm text-muted-foreground">Synthèse des bases détectées par PRO.GA Copilot.</p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-primary/50 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Analyse en cours...</p>
          </div>
        )}

        {!hasData && !loading && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Lancez une extraction pour obtenir les premiers montants fiscaux.
            </p>
          </div>
        )}

        {hasData && (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              <ExtractionCard title="TVA collectée" value={formatCurrency(taxes?.tva?.collected)} />
              <ExtractionCard title="TVA déductible" value={formatCurrency(taxes?.tva?.deductible)} />
              <ExtractionCard title="CSS base" value={formatCurrency(taxes?.css?.base)} />
              <ExtractionCard title="IS Base" value={formatCurrency(taxes?.is?.base)} />
              <ExtractionCard title="IRPP Base" value={formatCurrency(taxes?.irpp?.base)} />
              <ExtractionCard title="IRPP Quotient" value={(taxes?.irpp?.quotient ?? 1).toString()} />
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Mots-clés détectés</p>
              <div className="flex flex-wrap gap-2">
                {(summary?.keywords ?? ["TVA trimestrielle", "IRPP salarié"]).map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {summary?.notes && (
              <div className="neu-inset rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{summary.notes}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </NeuCard>
  );
};

const ExtractionCard = ({ title, value }: { title: string; value: string }) => (
  <div className="neu-inset rounded-xl p-4">
    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 font-semibold">{title}</p>
    <p className="text-xl sm:text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

