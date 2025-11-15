import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { InvoiceLineForm } from "./InvoiceLineForm";
import type { Invoice, InvoiceLine, InvoiceStatus } from "@/types/domain";

const schema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email().optional(),
  customerAddress: z.string().optional(),
  dueOn: z.string().optional(),
  invoiceNumber: z.string().min(1),
  currency: z.string().min(1),
});

type InvoiceEditorValues = z.infer<typeof schema>;

export type InvoiceEditorResult = {
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  dueOn?: string;
  currency: string;
  lines: InvoiceLine[];
  totals: Invoice["totals"];
  issuedOn: string;
  status: InvoiceStatus;
};

type InvoiceEditorProps = {
  invoice?: Invoice;
  onSave?: (invoice: InvoiceEditorResult) => void;
  onCancel?: () => void;
};

const defaultLine = (): InvoiceLine => ({
  designation: "Prestation",
  quantity: 1,
  unitPrice: 0,
});

export const InvoiceEditor = ({ invoice, onSave, onCancel }: InvoiceEditorProps) => {
  const [lines, setLines] = useState<InvoiceLine[]>(invoice?.lines ?? [defaultLine()]);

  const form = useForm<InvoiceEditorValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoiceNumber: invoice?.invoiceNumber ?? "INV-001",
      customerName: invoice?.customerName ?? "",
      customerEmail: invoice?.customerEmail ?? "",
      customerAddress: invoice?.customerAddress ?? "",
      dueOn: invoice?.dueOn ?? "",
      currency: invoice?.currency ?? "XOF",
    },
  });

  const totals = useMemo(() => {
    const ht = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
    const tax = lines.reduce(
      (sum, line) => sum + (line.taxRate ? (line.taxRate / 100) * line.quantity * line.unitPrice : 0),
      0,
    );
    return { ht, tax, ttc: ht + tax };
  }, [lines]);

  const handleSave = (values: InvoiceEditorValues) => {
    const payload: InvoiceEditorResult = {
      invoiceNumber: values.invoiceNumber,
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      customerAddress: values.customerAddress,
      dueOn: values.dueOn,
      currency: values.currency,
      lines,
      totals,
      issuedOn: invoice?.issuedOn ?? new Date().toISOString(),
      status: invoice?.status ?? "draft",
    };
    onSave?.(payload);
  };

  const updateLine = (index: number, line: InvoiceLine) => {
    setLines((previous) => previous.map((item, idx) => (idx === index ? line : item)));
  };

  const addLine = () => {
    setLines((previous) => [...previous, defaultLine()]);
  };

  const removeLine = (index: number) => {
    setLines((previous) => previous.filter((_, idx) => idx !== index));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{invoice ? "Modifier la facture" : "Nouvelle facture"}</CardTitle>
        <CardDescription>Structurer les informations client et les lignes produits.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="N° facture" {...form.register("invoiceNumber")} />
            <Input placeholder="Devise" {...form.register("currency")} />
            <Input placeholder="Client" {...form.register("customerName")} />
            <Input placeholder="Email client" {...form.register("customerEmail")} />
            <Textarea placeholder="Adresse client" {...form.register("customerAddress")} />
            <Input type="date" {...form.register("dueOn")} />
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">Lignes</p>
              <Button type="button" variant="outline" onClick={addLine}>
                Ajouter une ligne
              </Button>
            </div>
            <div className="space-y-3">
              {lines.map((line, index) => (
                <InvoiceLineForm
                  key={index}
                  line={line}
                  onChange={(updated) => updateLine(index, updated)}
                  onRemove={() => removeLine(index)}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>HT</span>
              <span>{totals.ht.toLocaleString("fr-FR")} {form.watch("currency")}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>{totals.tax.toLocaleString("fr-FR")} {form.watch("currency")}</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Total TTC</span>
              <span>{totals.ttc.toLocaleString("fr-FR")} {form.watch("currency")}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

