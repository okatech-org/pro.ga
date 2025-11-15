import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { InvoiceList } from "@/components/business/InvoiceList";
import { InvoiceEditor, type InvoiceEditorResult } from "@/components/business/InvoiceEditor";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { invoices, createInvoice, updateInvoice, deleteInvoice, markAsPaid, isLoading } = useInvoices(
    currentWorkspace?.id,
  );

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
        <NeuCard className="p-6 max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Aucun espace sélectionné</h1>
          <p className="text-sm text-muted-foreground">
            Sélectionnez un espace entreprise pour accéder aux factures.
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
              La facturation est réservée aux espaces entreprise.
            </p>
          </div>
          <NeuButton onClick={() => navigate("/dashboard")}>Retour au dashboard</NeuButton>
        </NeuCard>
      </div>
    );
  }

  const handleSaveInvoice = async (payload: InvoiceEditorResult) => {
    if (!currentWorkspace) return;

    if (editingInvoice) {
      await updateInvoice(editingInvoice.id, payload);
      setEditingInvoice(null);
      toast.success("Facture mise à jour");
    } else {
      await createInvoice({
        workspaceId: currentWorkspace.id,
        ...payload,
      });
      setShowNewInvoice(false);
      toast.success("Facture créée");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Chargement des factures…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-6 space-y-6">
      <NeuCard className="p-6 mb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <NeuButton variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </NeuButton>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                Espace entreprise · Facturation
              </p>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Facturation
              </h1>
              <p className="text-sm text-muted-foreground">
                Espace : {currentWorkspace.name}
              </p>
            </div>
          </div>

          <Dialog open={showNewInvoice} onOpenChange={setShowNewInvoice}>
            <DialogTrigger asChild>
              <NeuButton variant="premium" className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle facture
              </NeuButton>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <div className="flex items-center gap-4 flex-1 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Facturation</p>
                    <DialogTitle>Créer une facture</DialogTitle>
                  </div>
                </div>
              </DialogHeader>
              <InvoiceEditor onSave={handleSaveInvoice} onCancel={() => setShowNewInvoice(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </NeuCard>

      <InvoiceList
        invoices={invoices}
        onCreate={() => setShowNewInvoice(true)}
        onEdit={(invoice) => setEditingInvoice(invoice)}
        onDelete={(invoice) => deleteInvoice(invoice.id)}
        onMarkPaid={(invoice) => markAsPaid(invoice.id)}
      />

      {editingInvoice && (
        <Dialog open={!!editingInvoice} onOpenChange={() => setEditingInvoice(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center gap-4 flex-1 mb-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Facturation</p>
                  <DialogTitle>Modifier la facture</DialogTitle>
                </div>
              </div>
            </DialogHeader>
            <InvoiceEditor invoice={editingInvoice} onSave={handleSaveInvoice} onCancel={() => setEditingInvoice(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InvoicesPage;

