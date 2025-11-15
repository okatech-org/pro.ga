import { useState, useMemo } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { FileText, Edit, Trash2, Check, Search, Loader2, DollarSign, Calendar, User } from "lucide-react";
import type { Invoice, InvoiceStatus } from "@/types/domain";

type InvoiceListProps = {
  invoices: Invoice[];
  onCreate?: () => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
  onMarkPaid?: (invoice: Invoice) => void;
  saving?: boolean;
};

const statusLabel: Record<InvoiceStatus, string> = {
  draft: "Brouillon",
  issued: "Émise",
  sent: "Envoyée",
  paid: "Payée",
  overdue: "En retard",
  cancelled: "Annulée",
};

const statusVariant: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  issued: "outline",
  sent: "outline",
  paid: "default",
  overdue: "destructive",
  cancelled: "secondary",
};

const formatCurrency = (value: number, currency = "XOF") =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export const InvoiceList = ({ invoices, onCreate, onEdit, onDelete, onMarkPaid, saving = false }: InvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = useMemo(() => {
    if (!searchTerm.trim()) return invoices;
    const term = searchTerm.toLowerCase();
    return invoices.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        invoice.customerName.toLowerCase().includes(term) ||
        invoice.customerEmail?.toLowerCase().includes(term) ||
        invoice.status.toLowerCase().includes(term)
    );
  }, [invoices, searchTerm]);

  const totals = useMemo(() => {
    return filteredInvoices.reduce(
      (acc, invoice) => ({
        ht: acc.ht + invoice.totals.ht,
        tax: acc.tax + invoice.totals.tax,
        ttc: acc.ttc + invoice.totals.ttc,
      }),
      { ht: 0, tax: 0, ttc: 0 }
    );
  }, [filteredInvoices]);

  return (
    <NeuCard className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Factures</h2>
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                Suivi des ventes et encaissements
              </p>
            </div>
          </div>
          <NeuButton
            variant="premium"
            size="sm"
            onClick={onCreate}
            disabled={saving}
            className="w-full sm:w-auto text-xs sm:text-sm"
            aria-label="Créer une nouvelle facture"
          >
            {saving ? (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" aria-hidden="true" />
                <span className="truncate">Création...</span>
              </>
            ) : (
              <>
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">Nouvelle facture</span>
              </>
            )}
          </NeuButton>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="text"
              placeholder="Rechercher par numéro, client, email ou statut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs sm:text-sm"
              aria-label="Rechercher une facture"
            />
          </div>
        </div>
      </div>

      {filteredInvoices.length > 0 && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 neu-inset rounded-xl bg-primary/5 border-primary/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total HT</p>
              <p className="text-base sm:text-lg font-bold text-slate-900 truncate" title={formatCurrency(totals.ht)}>
                {formatCurrency(totals.ht)}
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total TVA</p>
              <p className="text-base sm:text-lg font-bold text-slate-900 truncate" title={formatCurrency(totals.tax)}>
                {formatCurrency(totals.tax)}
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total TTC</p>
              <p className="text-base sm:text-lg font-bold text-primary truncate" title={formatCurrency(totals.ttc)}>
                {formatCurrency(totals.ttc)}
              </p>
            </div>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="text-center py-8 sm:py-12 neu-inset rounded-xl">
          <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/40 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
          <p className="text-sm sm:text-base font-medium text-slate-900 mb-1 sm:mb-2">
            Aucune facture encore
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Utilisez "Nouvelle facture" pour démarrer.
          </p>
          <NeuButton
            variant="premium"
            size="sm"
            onClick={onCreate}
            disabled={saving}
            className="text-xs sm:text-sm"
            aria-label="Créer votre première facture"
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">Créer votre première facture</span>
          </NeuButton>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-8 sm:py-12 neu-inset rounded-xl">
          <Search className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/40 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
          <p className="text-sm sm:text-base font-medium text-slate-900 mb-1 sm:mb-2">
            Aucune facture trouvée
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Essayez avec d'autres critères de recherche.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] pr-2 sm:pr-4">
          <div className="space-y-2 sm:space-y-3">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all space-y-2 sm:space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={invoice.invoiceNumber}>
                          {invoice.invoiceNumber}
                        </p>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate" title={invoice.customerName}>
                            {invoice.customerName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={statusVariant[invoice.status]}
                    className="text-[10px] sm:text-xs flex-shrink-0 w-fit"
                  >
                    {statusLabel[invoice.status]}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">Montant TTC</p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 truncate" title={formatCurrency(invoice.totals.ttc, invoice.currency)}>
                        {formatCurrency(invoice.totals.ttc, invoice.currency)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {invoice.dueOn ? "Échéance" : "Émise le"}
                      </p>
                      <p className="text-sm sm:text-base font-medium text-slate-900 truncate">
                        {invoice.dueOn
                          ? new Date(invoice.dueOn).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : invoice.issuedOn
                            ? new Date(invoice.issuedOn).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-2 sm:my-3" />

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <NeuButton
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(invoice)}
                    disabled={saving}
                    className="flex-1 sm:flex-none text-[11px] sm:text-xs"
                    aria-label={`Modifier la facture ${invoice.invoiceNumber}`}
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Modifier</span>
                  </NeuButton>
                  {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                    <NeuButton
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkPaid?.(invoice)}
                      disabled={saving}
                      className="flex-1 sm:flex-none text-[11px] sm:text-xs"
                      aria-label={`Marquer la facture ${invoice.invoiceNumber} comme payée`}
                    >
                      {saving ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 animate-spin flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                      )}
                      <span className="truncate">Marquer payée</span>
                    </NeuButton>
                  )}
                  <NeuButton
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete?.(invoice)}
                    disabled={saving}
                    className="flex-1 sm:flex-none text-[11px] sm:text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Supprimer la facture ${invoice.invoiceNumber}`}
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Supprimer</span>
                  </NeuButton>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {filteredInvoices.length > 0 && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
            {filteredInvoices.length} facture{filteredInvoices.length > 1 ? "s" : ""} affichée{filteredInvoices.length > 1 ? "s" : ""}
            {searchTerm && ` sur ${invoices.length} au total`}
          </p>
        </div>
      )}
    </NeuCard>
  );
};
