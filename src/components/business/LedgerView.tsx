import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LedgerAccountBalance } from "@/types/domain";

type LedgerViewProps = {
  balances: LedgerAccountBalance[];
};

export const LedgerView = ({ balances }: LedgerViewProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Grand livre</CardTitle>
        <CardDescription>Soldes par compte comptable.</CardDescription>
      </CardHeader>
      <CardContent>
        {balances.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun solde disponible.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Compte</TableHead>
                <TableHead>Libellé</TableHead>
                <TableHead>Débit</TableHead>
                <TableHead>Crédit</TableHead>
                <TableHead>Solde</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((balance) => (
                <TableRow key={balance.account}>
                  <TableCell>{balance.account}</TableCell>
                  <TableCell>{balance.label || "-"}</TableCell>
                  <TableCell>{balance.debit.toLocaleString("fr-FR")}</TableCell>
                  <TableCell>{balance.credit.toLocaleString("fr-FR")}</TableCell>
                  <TableCell className={balance.balance >= 0 ? "text-success" : "text-destructive"}>
                    {balance.balance.toLocaleString("fr-FR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

