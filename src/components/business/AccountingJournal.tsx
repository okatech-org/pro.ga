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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AccountingEntry } from "@/types/domain";

const schema = z.object({
  date: z.string().min(4),
  description: z.string().min(2),
  debitAccount: z.string().min(2),
  creditAccount: z.string().min(2),
  amount: z.coerce.number().min(0),
  reference: z.string().optional(),
});

type JournalFormValues = z.infer<typeof schema>;

type AccountingJournalProps = {
  entries: AccountingEntry[];
  onAdd: (entry: JournalFormValues) => void;
  onDelete?: (id: string) => void;
};

export const AccountingJournal = ({ entries, onAdd, onDelete }: AccountingJournalProps) => {
  const form = useForm<JournalFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      description: "",
      debitAccount: "401",
      creditAccount: "512",
      amount: 0,
      reference: "",
    },
  });

  const handleSubmit = (values: JournalFormValues) => {
    onAdd(values);
    form.reset({
      ...values,
      description: "",
      amount: 0,
      reference: "",
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Journal comptable</CardTitle>
        <CardDescription>Saisissez vos écritures SYSCOHADA.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid md:grid-cols-6 gap-3">
          <Input type="date" {...form.register("date")} className="md:col-span-2" />
          <Input placeholder="Débit" {...form.register("debitAccount")} />
          <Input placeholder="Crédit" {...form.register("creditAccount")} />
          <Input type="number" placeholder="Montant" {...form.register("amount")} />
          <Input placeholder="Réf." {...form.register("reference")} />
          <Input
            placeholder="Description"
            {...form.register("description")}
            className="md:col-span-3"
          />
          <Button type="submit" className="md:col-span-3">
            Ajouter
          </Button>
        </form>

        <ScrollArea className="h-[260px] pr-4">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="text-left py-2">Date</th>
                <th className="text-left">Réf.</th>
                <th className="text-left">Libellé</th>
                <th className="text-left">Débit</th>
                <th className="text-left">Crédit</th>
                <th className="text-right">Montant</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border/80">
                  <td className="py-2">{new Date(entry.date).toLocaleDateString("fr-FR")}</td>
                  <td>{entry.reference || "-"}</td>
                  <td>{entry.description}</td>
                  <td>{entry.debitAccount}</td>
                  <td>{entry.creditAccount}</td>
                  <td className="text-right">{entry.amount.toLocaleString("fr-FR")} FCFA</td>
                  <td className="text-right">
                    {onDelete && (
                      <Button variant="ghost" size="sm" type="button" onClick={() => onDelete(entry.id)}>
                        Supprimer
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune écriture enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Référentiel SYSCOHADA : utilisez les comptes 1/5 pour immobilisations, trésorerie et capitaux.
      </CardFooter>
    </Card>
  );
};

