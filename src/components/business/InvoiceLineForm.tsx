import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NeuButton } from "@/components/ui/neu-button";
import { Trash2, Package, Hash, DollarSign, Percent } from "lucide-react";
import type { InvoiceLine } from "@/types/domain";

type InvoiceLineFormProps = {
  line: InvoiceLine;
  onChange: (line: InvoiceLine) => void;
  onRemove?: () => void;
  disabled?: boolean;
};

export const InvoiceLineForm = ({ line, onChange, onRemove, disabled = false }: InvoiceLineFormProps) => {
  const update = (field: keyof InvoiceLine, value: string | number) => {
    onChange({ ...line, [field]: typeof value === "number" ? value : value });
  };

  const lineTotal = (line.quantity || 0) * (line.unitPrice || 0);
  const lineTax = line.taxRate ? (line.taxRate / 100) * lineTotal : 0;

  return (
    <div className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor={`designation-${line.id}`} className="text-[10px] sm:text-xs flex items-center gap-1.5">
            <Package className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            Désignation *
          </Label>
          <Input
            id={`designation-${line.id}`}
            value={line.designation}
            placeholder="Description de la prestation"
            onChange={(event) => update("designation", event.target.value)}
            className="text-xs sm:text-sm"
            disabled={disabled}
            required
            aria-label="Désignation de la ligne"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`quantity-${line.id}`} className="text-[10px] sm:text-xs flex items-center gap-1.5">
            <Hash className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            Quantité *
          </Label>
          <Input
            id={`quantity-${line.id}`}
            type="number"
            value={line.quantity}
            min={0.01}
            step={0.01}
            onChange={(event) => update("quantity", Math.max(0, Number(event.target.value) || 0))}
            className="text-xs sm:text-sm"
            disabled={disabled}
            required
            aria-label="Quantité"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`unitPrice-${line.id}`} className="text-[10px] sm:text-xs flex items-center gap-1.5">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            Prix unitaire *
          </Label>
          <Input
            id={`unitPrice-${line.id}`}
            type="number"
            value={line.unitPrice}
            min={0}
            step={100}
            onChange={(event) => update("unitPrice", Math.max(0, Number(event.target.value) || 0))}
            className="text-xs sm:text-sm"
            disabled={disabled}
            required
            aria-label="Prix unitaire"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`taxRate-${line.id}`} className="text-[10px] sm:text-xs flex items-center gap-1.5">
            <Percent className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            Taux TVA (%)
          </Label>
          <Input
            id={`taxRate-${line.id}`}
            type="number"
            value={line.taxRate ?? 0}
            min={0}
            max={100}
            step={0.1}
            onChange={(event) => update("taxRate", Math.max(0, Math.min(100, Number(event.target.value) || 0)))}
            className="text-xs sm:text-sm"
            disabled={disabled}
            aria-label="Taux de TVA en pourcentage"
          />
        </div>
      </div>

      {(lineTotal > 0 || lineTax > 0) && (
        <div className="pt-2 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-[10px] sm:text-xs">
          <div>
            <p className="text-muted-foreground mb-0.5">HT</p>
            <p className="font-semibold text-slate-900">{lineTotal.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}</p>
          </div>
          {lineTax > 0 && (
            <div>
              <p className="text-muted-foreground mb-0.5">TVA</p>
              <p className="font-semibold text-slate-900">{lineTax.toLocaleString("fr-FR", { maximumFractionDigits: 2 })}</p>
            </div>
          )}
          <div className={lineTax > 0 ? "" : "sm:col-span-2"}>
            <p className="text-muted-foreground mb-0.5">TTC</p>
            <p className="font-bold text-primary">
              {(lineTotal + lineTax).toLocaleString("fr-FR", { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      )}

      {onRemove && (
        <div className="flex justify-end pt-2 border-t border-border">
          <NeuButton
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            disabled={disabled}
            className="text-[11px] sm:text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label="Supprimer cette ligne"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">Supprimer</span>
          </NeuButton>
        </div>
      )}
    </div>
  );
};


