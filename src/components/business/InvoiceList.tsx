import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Invoice } from "@/types/domain";
import { InvoiceStatus } from "@/types/domain";

type InvoiceListProps = {
  invoices: Invoice[];
  onCreate?: () => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
  onMarkPaid?: (invoice: Invoice) => void;
};

const statusLabel: Record<InvoiceStatus, string> = {
  DRAFT: "Brouillon",
  ISSUED: "Émise",
  PAID: "Payée",
  CANCELLED: "Annulée",
};

export const InvoiceList = ({ invoices, onCreate, onEdit, onDelete, onMarkPaid }: InvoiceListProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Factures</CardTitle>
          <CardDescription>Suivi des ventes et encaissements</CardDescription>
        </div>
        <Button type="button" onClick={onCreate}>
          Nouvelle facture
        </Button>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune facture encore. Utilisez “Nouvelle facture” pour démarrer.
          </p>
        ) : (
          <ScrollArea className="h-[420px] pr-4">
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border border-border rounded-xl p-4 hover:border-primary transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{invoice.customerName}</p>
                    </div>
                    <Badge variant={invoice.status === "PAID" ? "default" : "secondary"}>
                      {statusLabel[invoice.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {invoice.totals.ttc.toLocaleString("fr-FR")} {invoice.currency}
                    </span>
                    <span className="text-muted-foreground">
                      {invoice.issuedOn ? new Date(invoice.issuedOn).toLocaleDateString("fr-FR") : "-"}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit?.(invoice)}>
                      Ouvrir
                    </Button>
                    {invoice.status !== "PAID" && (
                      <Button variant="outline" size="sm" onClick={() => onMarkPaid?.(invoice)}>
                        Marquer payée
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => onDelete?.(invoice)}>
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

