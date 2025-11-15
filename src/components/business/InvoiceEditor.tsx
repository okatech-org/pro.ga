import { useMemo, useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InvoiceLineForm } from "./InvoiceLineForm";
import { FileText, Plus, Save, X, Loader2, DollarSign, Hash, User, Mail, MapPin, Calendar } from "lucide-react";
import type { Invoice, InvoiceLine, InvoiceStatus } from "@/types/domain";

const schema = z.object({
  customerName: z.string().min(2, "Le nom du client doit contenir au moins 2 caractères"),
  customerEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  customerAddress: z.string().optional(),
  dueOn: z.string().optional(),
  invoiceNumber: z.string().min(1, "Le numéro de facture est requis"),
  currency: z.string().min(1, "La devise est requise"),
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
  saving?: boolean;
};

const defaultLine = (): InvoiceLine => ({
  designation: "Prestation",
  quantity: 1,
  unitPrice: 0,
});

const formatCurrency = (value: number, currency = "XOF") =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const InvoiceEditor = ({ invoice, onSave, onCancel, saving = false }: InvoiceEditorProps) => {
  const [lines, setLines] = useState<InvoiceLine[]>(invoice?.lines ?? [defaultLine()]);

  const form = useForm<InvoiceEditorValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoiceNumber: invoice?.invoiceNumber ?? "INV-001",
      customerName: invoice?.customerName ?? "",
      customerEmail: invoice?.customerEmail ?? "",
      customerAddress: invoice?.customerAddress ?? "",
      dueOn: invoice?.dueOn ?? undefined,
      currency: invoice?.currency ?? "XOF",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (invoice) {
      setLines(invoice.lines.length > 0 ? invoice.lines : [defaultLine()]);
      form.reset({
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerName,
        customerEmail: invoice.customerEmail ?? "",
        customerAddress: invoice.customerAddress ?? "",
        dueOn: invoice.dueOn ?? undefined,
        currency: invoice.currency,
      });
    }
  }, [invoice, form]);

  const totals = useMemo(() => {
    const ht = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
    const tax = lines.reduce(
      (sum, line) => sum + (line.taxRate ? (line.taxRate / 100) * line.quantity * line.unitPrice : 0),
      0,
    );
    return { ht: Math.round(ht * 100) / 100, tax: Math.round(tax * 100) / 100, ttc: Math.round((ht + tax) * 100) / 100 };
  }, [lines]);

  const handleSave = useCallback((values: InvoiceEditorValues) => {
    if (lines.length === 0) {
      form.setError("root", { message: "Au moins une ligne est requise" });
      return;
    }

    const hasInvalidLine = lines.some(
      (line) => !line.designation.trim() || line.quantity <= 0 || line.unitPrice < 0
    );
    if (hasInvalidLine) {
      form.setError("root", { message: "Veuillez vérifier les lignes de la facture" });
      return;
    }

    const payload: InvoiceEditorResult = {
      invoiceNumber: values.invoiceNumber,
      customerName: values.customerName,
      customerEmail: values.customerEmail || undefined,
      customerAddress: values.customerAddress || undefined,
      dueOn: values.dueOn || undefined,
      currency: values.currency,
      lines,
      totals,
      issuedOn: invoice?.issuedOn ?? new Date().toISOString(),
      status: (invoice?.status ?? "draft") as InvoiceStatus,
    };
    onSave?.(payload);
  }, [lines, totals, invoice, form, onSave]);

  const updateLine = useCallback((index: number, line: InvoiceLine) => {
    setLines((previous) => previous.map((item, idx) => (idx === index ? line : item)));
  }, []);

  const addLine = useCallback(() => {
    setLines((previous) => [...previous, defaultLine()]);
  }, []);

  const removeLine = useCallback((index: number) => {
    setLines((previous) => {
      if (previous.length <= 1) return previous;
      return previous.filter((_, idx) => idx !== index);
    });
  }, []);

  const currency = form.watch("currency") || "XOF";

  return (
    <NeuCard className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" aria-hidden="true" />
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
            {invoice ? "Modifier la facture" : "Nouvelle facture"}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Structurer les informations client et les lignes produits.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 sm:space-y-6">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm flex items-center gap-2">
                    <Hash className="w-4 h-4" aria-hidden="true" />
                    Numéro de facture
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="FAC-2024-0001"
                      className="text-xs sm:text-sm"
                      disabled={saving}
                      aria-label="Numéro de facture"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm flex items-center gap-2">
                    <DollarSign className="w-4 h-4" aria-hidden="true" />
                    Devise
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="XOF"
                      className="text-xs sm:text-sm"
                      disabled={saving}
                      aria-label="Devise"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:col-span-2">
                  <FormLabel className="text-xs sm:text-sm flex items-center gap-2">
                    <User className="w-4 h-4" aria-hidden="true" />
                    Nom du client *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nom complet du client"
                      className="text-xs sm:text-sm"
                      disabled={saving}
                      aria-label="Nom du client"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    Email client
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="client@example.com"
                      className="text-xs sm:text-sm"
                      disabled={saving}
                      aria-label="Email du client"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueOn"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    Date d'échéance
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      className="text-xs sm:text-sm"
                      disabled={saving}
                      aria-label="Date d'échéance"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerAddress"
              render={({ field }) => (
                <FormItem className="space-y-1.5 sm:col-span-2">
                  <FormLabel className="text-xs sm:text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    Adresse client
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Adresse complète du client"
                      className="text-xs sm:text-sm min-h-[80px] resize-none"
                      disabled={saving}
                      aria-label="Adresse du client"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-4 sm:my-6" />

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <p className="text-sm sm:text-base font-semibold text-slate-900">Lignes de facturation</p>
              <NeuButton
                type="button"
                variant="outline"
                size="sm"
                onClick={addLine}
                disabled={saving}
                className="text-xs sm:text-sm"
                aria-label="Ajouter une ligne de facturation"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">Ajouter une ligne</span>
              </NeuButton>
            </div>

            {lines.length === 0 && (
              <div className="text-center py-6 sm:py-8 neu-inset rounded-xl">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Aucune ligne de facturation
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Ajoutez au moins une ligne pour créer la facture.
                </p>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              {lines.map((line, index) => (
                <InvoiceLineForm
                  key={line.id ?? index}
                  line={line}
                  onChange={(updated) => updateLine(index, updated)}
                  onRemove={lines.length > 1 ? () => removeLine(index) : undefined}
                  disabled={saving}
                />
              ))}
            </div>

            {form.formState.errors.root && (
              <div className="neu-inset rounded-xl p-3 sm:p-4 bg-red-50 border-red-200">
                <p className="text-xs sm:text-sm text-red-700">{form.formState.errors.root.message}</p>
              </div>
            )}
          </div>

          <Separator className="my-4 sm:my-6" />

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">HT</span>
              <span className="font-medium text-slate-900" title={formatCurrency(totals.ht, currency)}>
                {formatCurrency(totals.ht, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Taxes</span>
              <span className="font-medium text-slate-900" title={formatCurrency(totals.tax, currency)}>
                {formatCurrency(totals.tax, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between text-base sm:text-lg font-bold pt-2 border-t border-border">
              <span className="text-slate-900">Total TTC</span>
              <span className="text-primary" title={formatCurrency(totals.ttc, currency)}>
                {formatCurrency(totals.ttc, currency)}
              </span>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
            <NeuButton
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={saving}
              className="w-full sm:w-auto text-xs sm:text-sm"
              aria-label="Annuler la création/modification"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">Annuler</span>
            </NeuButton>
            <NeuButton
              type="submit"
              variant="premium"
              size="sm"
              disabled={saving || lines.length === 0}
              className="w-full sm:w-auto text-xs sm:text-sm"
              aria-label={saving ? "Enregistrement en cours..." : "Enregistrer la facture"}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Enregistrer</span>
                </>
              )}
            </NeuButton>
          </div>
        </form>
      </Form>
    </NeuCard>
  );
};
