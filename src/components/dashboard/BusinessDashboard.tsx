import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calculator, CreditCard, Store, DollarSign, Receipt, TrendingUp, Building2, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuIconPill } from "@/components/ui/neu-icon-pill";
import { NeuCard } from "@/components/ui/neu-card";
import { CircularProgress } from "@/components/charts/CircularProgress";
import { MiniBarChart } from "@/components/charts/MiniBarChart";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useInvoices } from "@/hooks/useInvoices";

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XAF",
  maximumFractionDigits: 0,
});

export const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { getCurrentBusinessWorkspace } = useWorkspaces();
  const business = getCurrentBusinessWorkspace();
  const { invoices, createInvoice, getTotalsSummary } = useInvoices(business?.id);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!business?.id || seededRef.current || invoices.length > 0) return;
    seededRef.current = true;

    (async () => {
      await createInvoice({
        workspaceId: business.id,
        customerName: "Marie Dupont",
        currency: "XOF",
        issuedOn: new Date().toISOString(),
        status: "issued",
        lines: [
          { designation: "Robe wax", quantity: 2, unitPrice: 65000, taxRate: 18 },
          { designation: "Accessoires", quantity: 1, unitPrice: 35000, taxRate: 18 },
        ],
      });
      await createInvoice({
        workspaceId: business.id,
        customerName: "Agence Ebène",
        currency: "XOF",
        issuedOn: new Date().toISOString(),
        status: "issued",
        lines: [{ designation: "Commande B2B", quantity: 10, unitPrice: 45000, taxRate: 18 }],
      });
    })();
  }, [business?.id, invoices.length, createInvoice]);

  if (!business) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pas d'espace entreprise</CardTitle>
          <CardDescription>Ajoutez une activité professionnelle pour voir ce module.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const summary = getTotalsSummary;
  const caHt = summary.totalHt || 0;
  const tva = summary.totalTva || 0;
  const css = Math.round(caHt * 0.01);

  const kpis = [
    {
      label: "CA mensuel (HT)",
      value: currency.format(caHt),
      description: "Chiffre d'affaires hors taxes",
      accent: "text-primary",
      icon: DollarSign,
      iconColor: "primary" as const,
    },
    {
      label: "TVA collectée",
      value: currency.format(tva),
      description: "Taxe sur la valeur ajoutée",
      accent: "text-warning",
      icon: Receipt,
      iconColor: "warning" as const,
    },
    {
      label: "CSS (1%)",
      value: currency.format(css),
      description: "Contribution sociale de solidarité",
      accent: "text-info",
      icon: TrendingUp,
      iconColor: "info" as const,
    },
    {
      label: "Factures émises",
      value: `${summary.count}`,
      description: "Nombre de factures créées",
      accent: "text-success",
      icon: FileText,
      iconColor: "success" as const,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {business.eshopName && (
        <div className="flex justify-end">
          <a
            href={`https://${business.eshopName}.pro.ga`}
            target="_blank"
            rel="noreferrer"
            className="neu-button-outline px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Store className="w-4 h-4" />
            {business.eshopName}.pro.ga
          </a>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <NeuCard key={kpi.label} className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <NeuIconPill icon={kpi.icon} color={kpi.iconColor} size="md" className="flex-shrink-0" />
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className={`text-2xl sm:text-3xl font-bold ${kpi.accent} mb-1 truncate`} title={kpi.value}>
                  {kpi.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-0.5 truncate" title={kpi.label}>
                  {kpi.label}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2" title={kpi.description}>
                  {kpi.description}
                </p>
              </div>
            </div>
          </NeuCard>
        ))}
      </section>

      {/* Section Graphiques et Analytics */}
      <section className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NeuCard className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <NeuIconPill icon={BarChart3} color="primary" size="sm" className="flex-shrink-0" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Évolution CA</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <MiniBarChart
              data={[
                { label: "Jan", value: 2500000, color: "from-primary/60 to-primary" },
                { label: "Fév", value: 3200000, color: "from-primary/60 to-primary" },
                { label: "Mar", value: 2800000, color: "from-primary/60 to-primary" },
                { label: "Avr", value: 3500000, color: "from-success/60 to-success" },
                { label: "Mai", value: 4200000, color: "from-success/60 to-success" },
              ]}
              height={100}
              className="sm:h-[120px]"
            />
            <div className="pt-3 sm:pt-4 border-t border-border">
              <div className="flex justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
                <span className="text-muted-foreground truncate pr-2">Croissance</span>
                <span className="font-semibold text-success whitespace-nowrap">+28%</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground truncate pr-2">Objectif mensuel</span>
                <span className="font-semibold whitespace-nowrap">{currency.format(5000000)}</span>
              </div>
            </div>
          </div>
        </NeuCard>

        <NeuCard className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <NeuIconPill icon={PieChart} color="warning" size="sm" className="flex-shrink-0" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Répartition taxes</h3>
          </div>
          <div className="flex justify-center mb-3 sm:mb-4">
            <CircularProgress
              value={tva}
              max={tva + css}
              size={120}
              strokeWidth={12}
              color="warning"
              label="TVA"
              className="sm:w-[140px] sm:h-[140px]"
            />
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-3 h-3 rounded-full bg-warning flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground truncate">TVA (18%)</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap ml-2">{currency.format(tva)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-3 h-3 rounded-full bg-info flex-shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground truncate">CSS (1%)</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold whitespace-nowrap ml-2">{currency.format(css)}</span>
            </div>
            <div className="pt-2 sm:pt-3 border-t border-border">
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate pr-2">Total taxes</span>
                <span className="font-semibold text-primary whitespace-nowrap">{currency.format(tva + css)}</span>
              </div>
            </div>
          </div>
        </NeuCard>

        <NeuCard className="p-4 sm:p-6 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <NeuIconPill icon={TrendingUp} color="success" size="sm" className="flex-shrink-0" />
            <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Performance</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-muted-foreground truncate pr-2">Taux de conversion</span>
                <span className="text-xs sm:text-sm font-semibold text-success whitespace-nowrap">68%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                <div className="bg-success h-1.5 sm:h-2 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-muted-foreground truncate pr-2">Panier moyen</span>
                <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">{currency.format(125000)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                <div className="bg-primary h-1.5 sm:h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-muted-foreground truncate pr-2">Clients actifs</span>
                <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">47</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
                <div className="bg-info h-1.5 sm:h-2 rounded-full" style={{ width: '47%' }} />
              </div>
            </div>
          </div>
        </NeuCard>
      </section>

      <section className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <NeuCard className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <NeuIconPill icon={Receipt} color="warning" size="sm" className="flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Dernières factures</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Suivi de vos ventes récentes</p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {invoices.length === 0 ? (
              <div className="rounded-xl bg-gray-50 px-3 sm:px-4 py-6 sm:py-8 text-center">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-muted-foreground">Aucune facture émise</p>
                <NeuButton 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 sm:mt-3"
                  onClick={() => navigate("/dashboard/business/factures")}
                >
                  Créer une facture
                </NeuButton>
              </div>
            ) : (
              <>
                {invoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="rounded-xl bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-2">
                      <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate flex-1 min-w-0">{invoice.numero}</p>
                      <span className={`text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex-shrink-0 whitespace-nowrap ${
                        invoice.status === "paid" 
                          ? "text-success bg-success/10" 
                          : invoice.status === "issued"
                          ? "text-warning bg-warning/10"
                          : "text-muted-foreground bg-muted/10"
                      }`}>
                        {invoice.status === "paid" ? "Payée" : invoice.status === "issued" ? "Émise" : "Brouillon"}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">{invoice.customerName}</p>
                    <p className="text-xs sm:text-sm font-bold text-primary truncate">{currency.format(invoice.totalTtc)}</p>
                  </div>
                ))}
                <NeuButton 
                  variant="outline" 
                  className="w-full mt-2 text-xs sm:text-sm" 
                  onClick={() => navigate("/dashboard/business/factures")}
                >
                  Voir toutes les factures
                </NeuButton>
              </>
            )}
          </div>
        </NeuCard>

        <NeuCard className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <NeuIconPill icon={TrendingUp} color="success" size="sm" className="flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Aperçu fiscal</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Obligations déclaratives</p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="neu-inset rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate pr-2">TVA à reverser</p>
                <Receipt className="w-3 h-3 sm:w-4 sm:h-4 text-warning flex-shrink-0" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-warning mb-0.5 sm:mb-1 truncate">{currency.format(tva)}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Déclaration mensuelle</p>
            </div>

            <div className="neu-inset rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate pr-2">CSS calculée</p>
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-info flex-shrink-0" />
              </div>
              <p className="text-xl sm:text-2xl font-bold text-info mb-0.5 sm:mb-1 truncate">{currency.format(css)}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">1% du CA HT</p>
            </div>

            <NeuButton 
              variant="outline" 
              className="w-full text-xs sm:text-sm" 
              onClick={() => navigate("/dashboard/taxes")}
            >
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="truncate">Simulation complète</span>
            </NeuButton>
          </div>
        </NeuCard>
      </section>

      <NeuCard className="p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <NeuIconPill icon={CreditCard} color="primary" size="sm" className="flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">Actions rapides</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Gérez votre activité en un clic</p>
          </div>
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          <NeuButton className="py-4 sm:py-6 flex flex-col items-start gap-1.5 sm:gap-2 justify-start" onClick={() => navigate("/dashboard/business/factures")}>
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <div className="min-w-0 w-full">
              <p className="font-semibold text-xs sm:text-sm truncate">Nouvelle facture</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Émettre une facture client</p>
            </div>
          </NeuButton>
          <NeuButton
            variant="outline"
            className="py-4 sm:py-6 flex flex-col items-start gap-1.5 sm:gap-2 justify-start"
            onClick={() => navigate("/dashboard/business/pos")}
          >
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <div className="min-w-0 w-full">
              <p className="font-semibold text-xs sm:text-sm truncate">Ouvrir POS</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Encaissement rapide</p>
            </div>
          </NeuButton>
          <NeuButton
            variant="outline"
            className="py-4 sm:py-6 flex flex-col items-start gap-1.5 sm:gap-2 justify-start"
            onClick={() => navigate("/dashboard/business/boutique")}
          >
            <Store className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <div className="min-w-0 w-full">
              <p className="font-semibold text-xs sm:text-sm truncate">Ma boutique</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Gérer ma vitrine</p>
            </div>
          </NeuButton>
        </div>
      </NeuCard>
    </div>
  );
};

