import { useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { EmploymentContract, Payslip } from "@/types/domain";

const payslipSchema = z.object({
  contractId: z.string().min(1, "Contrat requis"),
  period: z.string().min(6, "Période requise"),
  workedHours: z.coerce.number().min(1, "Heures invalides"),
  bonuses: z.coerce.number().min(0, "Prime invalide").default(0),
});

export type PayslipGeneratorValues = z.infer<typeof payslipSchema>;

type PayslipGeneratorProps = {
  contracts: EmploymentContract[];
  onGenerate?: (values: PayslipGeneratorValues) => Promise<Payslip | void> | Payslip | void;
  latestPayslip?: Payslip | null;
  loading?: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(
    value,
  );

export const PayslipGenerator = ({
  contracts,
  onGenerate,
  latestPayslip,
  loading,
}: PayslipGeneratorProps) => {
  const [preview, setPreview] = useState<Payslip | null>(latestPayslip ?? null);

  const form = useForm<PayslipGeneratorValues>({
    resolver: zodResolver(payslipSchema),
    defaultValues: {
      contractId: contracts[0]?.id ?? "",
      period: new Date().toISOString().slice(0, 7),
      workedHours: 20,
      bonuses: 0,
    },
  });

  useEffect(() => {
    if (latestPayslip) {
      setPreview(latestPayslip);
    }
  }, [latestPayslip]);

  const handleGenerate = async (values: PayslipGeneratorValues) => {
    if (!onGenerate) return;
    const result = await onGenerate(values);
    if (result) {
      setPreview(result);
    }
  };

  if (!contracts.length) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Générer une fiche de paie</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ajoutez d'abord un contrat pour produire une fiche de paie.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Générer une fiche de paie</CardTitle>
        <CardDescription>Calculez le brut, les retenues et le net à payer.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
          <CardContent className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contrat</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un contrat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contracts.map((contract) => (
                        <SelectItem key={contract.id} value={contract.id}>
                          {contract.employeeName} · {contract.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Période (AAAA-MM)</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workedHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures travaillées</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bonuses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primes / avantages</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Résultats calculés selon les taux par défaut (18% patronal, 8% salarial).
            </div>
            <Button type="submit" disabled={loading}>
              Générer
            </Button>
          </CardFooter>
        </form>
      </Form>

      {preview && (
        <CardContent className="border-t border-border mt-6 pt-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{preview.period}</p>
            <p className="text-sm text-muted-foreground">{preview.workedHours} heures</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Salaire brut</p>
              <p className="text-lg font-semibold">{formatCurrency(preview.grossSalary)}</p>
              <p className="text-xs text-muted-foreground">
                Retenues salariales : {formatCurrency(preview.employeeContributions)}
              </p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Net à payer</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(preview.netPayable)}</p>
              <p className="text-xs text-muted-foreground">
                Charges patronales : {formatCurrency(preview.employerContributions)}
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

