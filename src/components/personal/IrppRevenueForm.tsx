import { useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenus IRPP</CardTitle>
        <CardDescription>Déclarez l'ensemble des bases soumises au barème progressif.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <CardContent className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="salaries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaires</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loyers</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BIC</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bnc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BNC</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dividends"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dividendes</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deductions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Déductions</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardContent className="grid md:grid-cols-2 gap-4 pt-0">
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Situation familiale</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
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
                <FormItem>
                  <FormLabel>Personnes à charge</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Formulaire IRPP
              </Label>
              <p className="text-sm text-muted-foreground">
                Les montants sont attendus en FCFA ou devise locale.
              </p>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Simuler
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

