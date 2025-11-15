import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { InvoiceLine } from "@/types/domain";

type InvoiceLineFormProps = {
  line: InvoiceLine;
  onChange: (line: InvoiceLine) => void;
  onRemove?: () => void;
};

export const InvoiceLineForm = ({ line, onChange, onRemove }: InvoiceLineFormProps) => {
  const update = (field: keyof InvoiceLine, value: string | number) => {
    onChange({ ...line, [field]: typeof value === "number" ? value : value });
  };

  return (
    <div className="grid md:grid-cols-5 gap-2 items-center border border-border rounded-lg p-3">
      <Input
        value={line.designation}
        placeholder="Description"
        onChange={(event) => update("designation", event.target.value)}
        className="md:col-span-2"
      />
      <Input
        type="number"
        value={line.quantity}
        min={1}
        onChange={(event) => update("quantity", Number(event.target.value))}
      />
      <Input
        type="number"
        value={line.unitPrice}
        min={0}
        onChange={(event) => update("unitPrice", Number(event.target.value))}
      />
      <Input
        type="number"
        value={line.taxRate ?? 0}
        min={0}
        onChange={(event) => update("taxRate", Number(event.target.value))}
      />
      {onRemove && (
        <Button type="button" variant="ghost" onClick={onRemove} className="md:col-span-5">
          Supprimer
        </Button>
      )}
    </div>
  );
};

