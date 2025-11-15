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
    <div className="min-h-screen bg-[#f6f7fb] p-6 space-y-6">
      <header>
        <NeuCard className="p-6 mb-2">
          <div className="flex items-start gap-4">
            <NeuButton variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </NeuButton>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                Espace entreprise · Ventes
              </p>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Point de vente (POS)
              </h1>
              <p className="text-sm text-muted-foreground">
                Espace : {currentWorkspace.name}
              </p>
            </div>
          </div>
        </NeuCard>
      </header>

      <PosScreen
        products={products}
        onCheckout={async ({ items, total, paymentMethod }) => {
          if (!currentWorkspace) return;
          try {
            await createInvoice({
              workspaceId: currentWorkspace.id,
              customerName: "Vente comptoir",
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
            toast.success(`Encaissement ${paymentMethod} enregistré (${total.toLocaleString("fr-FR")} XOF)`);
          } catch (error) {
            console.error(error);
            toast.error("Impossible d'enregistrer la vente POS");
          }
        }}
      />
    </div>
  );
};

export default PosPage;

