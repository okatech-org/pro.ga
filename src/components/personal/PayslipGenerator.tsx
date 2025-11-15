import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, FileText, Trash2, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";
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
  payslips?: Payslip[];
  onGenerate?: (values: PayslipGeneratorValues) => Promise<Payslip | void> | Payslip | void;
  onDelete?: (payslipId: string) => Promise<void> | void;
  latestPayslip?: Payslip | null;
  loading?: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(
    value,
  );

export const PayslipGenerator = ({
  contracts,
  payslips = [],
  onGenerate,
  onDelete,
  latestPayslip,
  loading = false,
}: PayslipGeneratorProps) => {
  const [preview, setPreview] = useState<Payslip | null>(latestPayslip ?? null);
  const [payslipToDelete, setPayslipToDelete] = useState<Payslip | null>(null);

  const activeContracts = useMemo(
    () => contracts.filter((c) => c.status === "active"),
    [contracts]
  );

  const sortedPayslips = useMemo(() => {
    return [...payslips].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [payslips]);

  const form = useForm<PayslipGeneratorValues>({
    resolver: zodResolver(payslipSchema),
    defaultValues: {
      contractId: activeContracts[0]?.id ?? "",
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

  useEffect(() => {
    if (activeContracts.length > 0 && !form.getValues("contractId")) {
      form.setValue("contractId", activeContracts[0].id);
    }
  }, [activeContracts, form]);

  const handleGenerate = async (values: PayslipGeneratorValues) => {
    if (!onGenerate || loading) return;
    try {
      const result = await onGenerate(values);
      if (result) {
        setPreview(result);
        form.reset({
          contractId: values.contractId,
          period: values.period,
          workedHours: 20,
          bonuses: 0,
        });
      }
    } catch (err) {
      console.error("Error generating payslip:", err);
      toast.error("Erreur lors de la génération de la fiche de paie");
    }
  };

  const handleDelete = async () => {
    if (!payslipToDelete || !onDelete || loading) return;
    try {
      await onDelete(payslipToDelete.id);
      if (preview?.id === payslipToDelete.id) {
        setPreview(null);
      }
      setPayslipToDelete(null);
    } catch (err) {
      console.error("Error deleting payslip:", err);
      toast.error("Erreur lors de la suppression de la fiche de paie");
    }
  };

  const getContractName = (contractId: string) => {
    const contract = contracts.find((c) => c.id === contractId);
    return contract ? `${contract.employeeName} - ${contract.role}` : "Contrat inconnu";
  };

  if (!activeContracts.length) {
    return (
      <NeuCard className="p-6 sm:p-8">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
            Aucun contrat actif
          </h3>
          <p className="text-sm text-muted-foreground px-4">
            Ajoutez d'abord un contrat actif pour produire une fiche de paie.
          </p>
        </div>
      </NeuCard>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <NeuCard className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
            Générer une fiche de paie
          </h2>
          <p className="text-sm text-muted-foreground">
            Calculez le brut, les retenues et le net à payer.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-4 sm:space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contractId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contrat</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un contrat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeContracts.map((contract) => (
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
                      <Input type="month" {...field} disabled={loading} />
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
                      <Input type="number" min={1} step="1" {...field} disabled={loading} />
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
                      <Input type="number" min={0} step="1000" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-4 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Résultats calculés selon les taux par défaut (18% patronal, 8% salarial).
              </p>
              <NeuButton type="submit" variant="premium" disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Générer
                  </>
                )}
              </NeuButton>
            </div>
          </form>
        </Form>

        {preview && (
          <div className="mt-6 pt-6 border-t border-border space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{preview.period}</p>
                <p className="text-xs text-muted-foreground">{preview.workedHours} heures</p>
              </div>
              <Badge variant="default" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Généré
              </Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="neu-inset rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Salaire brut
                </p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {formatCurrency(preview.grossSalary)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Retenues salariales : {formatCurrency(preview.employeeContributions)}
                </p>
              </div>
              <div className="neu-inset rounded-xl p-4 bg-primary/5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Net à payer
                </p>
                <p className="text-xl sm:text-2xl font-bold text-primary">
                  {formatCurrency(preview.netPayable)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Charges patronales : {formatCurrency(preview.employerContributions)}
                </p>
              </div>
            </div>
          </div>
        )}
      </NeuCard>

      {sortedPayslips.length > 0 && (
        <NeuCard className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-border">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">Historique des fiches de paie</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {sortedPayslips.length} {sortedPayslips.length === 1 ? "fiche générée" : "fiches générées"}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary opacity-50" />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Période</TableHead>
                  <TableHead className="text-xs sm:text-sm">Contrat</TableHead>
                  <TableHead className="text-xs sm:text-sm">Heures</TableHead>
                  <TableHead className="text-xs sm:text-sm">Brut</TableHead>
                  <TableHead className="text-xs sm:text-sm">Net</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPayslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="text-xs sm:text-sm font-medium">{payslip.period}</TableCell>
                    <TableCell className="text-xs sm:text-sm text-muted-foreground truncate max-w-[150px]">
                      {getContractName(payslip.contractId)}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{payslip.workedHours}h</TableCell>
                    <TableCell className="text-xs sm:text-sm font-medium">
                      {formatCurrency(payslip.grossSalary)}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm font-bold text-primary">
                      {formatCurrency(payslip.netPayable)}
                    </TableCell>
                    <TableCell className="text-right">
                      {onDelete && (
                        <NeuButton
                          variant="outline"
                          size="sm"
                          onClick={() => setPayslipToDelete(payslip)}
                          disabled={loading}
                          className="text-destructive hover:text-destructive"
                          aria-label="Supprimer la fiche de paie"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </NeuButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </NeuCard>
      )}

      <Dialog
        open={!!payslipToDelete}
        onOpenChange={(open) => !open && setPayslipToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer la fiche de paie</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la fiche de paie de {payslipToDelete?.period} ?{" "}
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <NeuButton
              variant="outline"
              onClick={() => setPayslipToDelete(null)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Annuler
            </NeuButton>
            <NeuButton
              variant="premium"
              onClick={handleDelete}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </NeuButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

