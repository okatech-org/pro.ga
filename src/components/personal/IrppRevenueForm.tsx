import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, FileText } from "lucide-react";

const revenueSchema = z.object({
  salaries: z.coerce.number().min(0, "Montant invalide").default(0),
  rents: z.coerce.number().min(0, "Montant invalide").default(0),
  bic: z.coerce.number().min(0, "Montant invalide").default(0),
  bnc: z.coerce.number().min(0, "Montant invalide").default(0),
  dividends: z.coerce.number().min(0, "Montant invalide").default(0),
  deductions: z.coerce.number().min(0, "Montant invalide").default(0),
  maritalStatus: z.enum(["single", "married", "pacsed", "divorced", "widowed"]).default("single"),
  dependents: z.coerce.number().min(0, "Valeur invalide").default(0),
});

export type IrppRevenueValues = z.infer<typeof revenueSchema>;

type IrppRevenueFormProps = {
  defaultValues?: Partial<IrppRevenueValues>;
  onSubmit?: (values: IrppRevenueValues) => void;
  onChange?: (values: IrppRevenueValues) => void;
  isSubmitting?: boolean;
};

const presetDefaults: IrppRevenueValues = {
  salaries: 0,
  rents: 0,
  bic: 0,
  bnc: 0,
  dividends: 0,
  deductions: 0,
  maritalStatus: "single",
  dependents: 0,
};

export const IrppRevenueForm = ({
  defaultValues,
  onSubmit,
  onChange,
  isSubmitting,
}: IrppRevenueFormProps) => {
  const form = useForm<IrppRevenueValues>({
    resolver: zodResolver(revenueSchema),
    defaultValues: { ...presetDefaults, ...defaultValues },
    mode: "onChange",
  });

  useEffect(() => {
    if (!onChange) return;
    const subscription = form.watch((values) => {
      try {
        onChange(revenueSchema.parse(values));
      } catch {
        /* noop */
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  const handleSubmit = (values: IrppRevenueValues) => {
    onSubmit?.(values);
  };

  return (
    <NeuCard className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" aria-hidden="true" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Revenus IRPP</h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Déclarez l'ensemble des bases soumises au barème progressif.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="salaries"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm">Salaires (FCFA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1000"
                      disabled={isSubmitting}
                      className="text-xs sm:text-sm"
                      aria-label="Salaires en FCFA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rents"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm">Loyers (FCFA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1000"
                      disabled={isSubmitting}
                      className="text-xs sm:text-sm"
                      aria-label="Loyers en FCFA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bic"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm">BIC (FCFA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1000"
                      disabled={isSubmitting}
                      className="text-xs sm:text-sm"
                      aria-label="BIC en FCFA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bnc"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm">BNC (FCFA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1000"
                      disabled={isSubmitting}
                      className="text-xs sm:text-sm"
                      aria-label="BNC en FCFA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dividends"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm">Dividendes (FCFA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1000"
                      disabled={isSubmitting}
                      className="text-xs sm:text-sm"
                      aria-label="Dividendes en FCFA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deductions"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm">Déductions (FCFA)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1000"
                      disabled={isSubmitting}
                      className="text-xs sm:text-sm"
                      aria-label="Déductions en FCFA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4 border-t border-border grid sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm">Situation familiale</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger className="text-xs sm:text-sm" aria-label="Situation familiale">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Célibataire</SelectItem>
                      <SelectItem value="married">Marié(e)</SelectItem>
                      <SelectItem value="pacsed">Pacsé(e)</SelectItem>
                      <SelectItem value="divorced">Divorcé(e)</SelectItem>
                      <SelectItem value="widowed">Veuf/Veuve</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dependents"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs sm:text-sm">Personnes à charge</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="1"
                      disabled={isSubmitting}
                      className="text-xs sm:text-sm"
                      aria-label="Nombre de personnes à charge"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <Label className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground font-semibold block mb-1">
                Formulaire IRPP
              </Label>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Les montants sont attendus en FCFA ou devise locale.
              </p>
            </div>
            <NeuButton
              type="submit"
              variant="premium"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
              aria-label={isSubmitting ? "Enregistrement en cours..." : "Enregistrer les revenus IRPP"}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin flex-shrink-0" aria-hidden="true" />
                  <span className="truncate">Enregistrement...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
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

