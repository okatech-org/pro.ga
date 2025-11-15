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
import type { EmploymentContractType } from "@/types/domain";

const contractSchema = z.object({
  employeeName: z.string().min(2, "Nom requis"),
  role: z.string().min(2, "Fonction requise"),
  contractType: z.enum(["household", "nanny", "driver", "guard", "custom"]),
  hourlyRate: z.coerce.number().min(500, "Taux invalide"),
  weeklyHours: z.coerce.number().min(1, "Heures invalides"),
  startDate: z.string().min(4, "Date requise"),
});

export type EmploymentContractFormValues = z.infer<typeof contractSchema>;

type EmploymentContractFormProps = {
  defaultValues?: Partial<EmploymentContractFormValues>;
  onSubmit?: (values: EmploymentContractFormValues) => void | Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
};

const CONTRACT_OPTIONS: { value: EmploymentContractType; label: string }[] = [
  { value: "household", label: "Employé de maison" },
  { value: "nanny", label: "Nounou" },
  { value: "driver", label: "Chauffeur" },
  { value: "guard", label: "Gardien" },
  { value: "custom", label: "Autre" },
];

export const EmploymentContractForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitting = false,
}: EmploymentContractFormProps) => {
  const form = useForm<EmploymentContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      employeeName: "",
      role: "",
      contractType: "household",
      hourlyRate: 1500,
      weeklyHours: 20,
      startDate: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  });

  const handleSubmit = async (values: EmploymentContractFormValues) => {
    if (submitting) return;
    try {
      await onSubmit?.(values);
      if (!defaultValues) {
        form.reset({
          employeeName: "",
          role: "",
          contractType: "household",
          hourlyRate: 1500,
          weeklyHours: 20,
          startDate: new Date().toISOString().slice(0, 10),
        });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleCancel = () => {
    if (submitting) return;
    form.reset();
    onCancel?.();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{defaultValues ? "Modifier le contrat" : "Créer un contrat"}</CardTitle>
        <CardDescription>
          {defaultValues
            ? "Modifiez les informations du contrat emploi à domicile."
            : "Formalisez un nouveau contrat emploi à domicile."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <CardContent className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du salarié" disabled={submitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonction</FormLabel>
                  <FormControl>
                    <Input placeholder="Fonction principale" disabled={submitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de contrat</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={submitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONTRACT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux horaire (FCFA)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="100" disabled={submitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weeklyHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures hebdomadaires</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} step="1" disabled={submitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={submitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-end gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? (
                <>
                  <span className="mr-2">⏳</span>
                  Enregistrement...
                </>
              ) : defaultValues ? (
                "Mettre à jour"
              ) : (
                "Enregistrer"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

