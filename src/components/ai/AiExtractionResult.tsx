import { NeuCard } from "@/components/ui/neu-card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Loader2, CheckCircle2 } from "lucide-react";
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
    <NeuCard className="w-full p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-bold text-lg">Résultats IA</h3>
            <p className="text-sm text-muted-foreground">Synthèse des bases détectées par PRO.GA Copilot.</p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" aria-label="Analyse en cours" />
            <div>
              <p className="text-sm font-medium text-slate-900 mb-1">Analyse en cours...</p>
              <p className="text-xs text-muted-foreground">
                L'IA analyse vos documents. Cela peut prendre quelques instants.
              </p>
            </div>
          </div>
        )}

        {!hasData && !loading && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-semibold text-base mb-1 text-slate-900">Aucune extraction disponible</h4>
              <p className="text-sm text-muted-foreground px-4">
                Lancez une extraction pour obtenir les premiers montants fiscaux.
              </p>
            </div>
          </div>
        )}

        {hasData && (
          <>
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">Extraction terminée</p>
                <p className="text-xs text-muted-foreground">
                  Les données ont été extraites avec succès
                </p>
              </div>
            </div>

            {summary?.notes && (
              <div className="neu-inset rounded-xl p-4 mb-4 bg-primary/5 border-primary/20">
                <p className="text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-wrap break-words">
                  {summary.notes}
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <ExtractionCard title="TVA collectée" value={formatCurrency(taxes?.tva?.collected)} />
              <ExtractionCard title="TVA déductible" value={formatCurrency(taxes?.tva?.deductible)} />
              <ExtractionCard title="CSS base" value={formatCurrency(taxes?.css?.base)} />
              <ExtractionCard title="CSS exclusions" value={formatCurrency(taxes?.css?.exclusions)} />
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
  <div className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all">
    <p className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground mb-1.5 sm:mb-2 font-semibold truncate">
      {title}
    </p>
    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate" title={value}>
      {value}
    </p>
  </div>
);

