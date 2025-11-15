import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useStoreConfig } from "@/hooks/useStoreConfig";
import { useInvoices } from "@/hooks/useInvoices";
import { PosScreen } from "@/components/business/PosScreen";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard } from "lucide-react";

const PosPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const { products } = useStoreConfig(currentWorkspace?.id);
  const { createInvoice } = useInvoices(currentWorkspace?.id);

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
        <NeuCard className="p-6 max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Aucun espace sélectionné</h1>
          <p className="text-sm text-muted-foreground">
            Sélectionnez un espace entreprise pour accéder au POS.
          </p>
        </NeuCard>
      </div>
    );
  }

  if (currentWorkspace.scope === "personal") {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
        <NeuCard className="p-6 max-w-md text-center space-y-4">
          <div>
            <h1 className="text-xl font-bold mb-1">Module non disponible</h1>
            <p className="text-sm text-muted-foreground">
              Le POS est réservé aux espaces entreprise.
            </p>
          </div>
          <NeuButton onClick={() => navigate("/dashboard")}>Retour au dashboard</NeuButton>
        </NeuCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-4 sm:space-y-6">
      <header>
        <NeuCard className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <NeuButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex-shrink-0"
              aria-label="Retour au dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Retour</span>
            </NeuButton>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide mb-1 sm:mb-2">
                Espace entreprise · Ventes
              </p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                <span className="truncate">Point de vente (POS)</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Espace : {currentWorkspace.name}
              </p>
            </div>
          </div>
        </NeuCard>
      </header>

      <PosScreen
        products={products}
        currency="XOF"
        onCheckout={async ({ items, total, paymentMethod }) => {
          if (!currentWorkspace) {
            throw new Error("Espace non sélectionné");
          }

          if (!items || items.length === 0) {
            throw new Error("Le panier est vide");
          }

          try {
            await createInvoice({
              workspaceId: currentWorkspace.id,
              customerName: "Vente comptoir",
              customerEmail: null,
              currency: "XOF",
              issuedOn: new Date().toISOString(),
              status: "issued",
              lines: items.map((item) => ({
                designation: item.name,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: 18,
              })),
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Impossible d'enregistrer la vente POS";
            console.error("Erreur lors de l'encaissement:", error);
            throw new Error(errorMessage);
          }
        }}
      />
    </div>
  );
};

export default PosPage;

