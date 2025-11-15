import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { BalanceSheetSection } from "@/types/domain";

type BalanceSheetProps = {
  sections: BalanceSheetSection[];
};

export const BalanceSheet = ({ sections }: BalanceSheetProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Balance SYSCOHADA</CardTitle>
        <CardDescription>Actif, passif et comptes de résultat.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                {section.title}
              </p>
              <p className="font-semibold">{section.total.toLocaleString("fr-FR")} FCFA</p>
            </div>
            <div className="space-y-1">
              {section.accounts.length === 0 ? (
                <p className="text-xs text-muted-foreground">Aucune écriture sur cette section.</p>
              ) : (
                section.accounts.map((account) => (
                  <div key={account.account} className="flex items-center justify-between text-sm">
                    <span>
                      {account.account} · {account.label || "Compte"}
                    </span>
                    <span>{account.balance.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                ))
              )}
            </div>
            <Separator className="my-4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

