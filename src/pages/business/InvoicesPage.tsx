import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { InvoiceList } from "@/components/business/InvoiceList";
import { InvoiceEditor, type InvoiceEditorResult } from "@/components/business/InvoiceEditor";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, FileText, Loader2, AlertCircle, CheckCircle2, Trash2, Edit, Check } from "lucide-react";
import { useInvoices } from "@/hooks/useInvoices";
import type { Invoice } from "@/types/domain";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { invoices, createInvoice, updateInvoice, deleteInvoice, markAsPaid, isLoading } = useInvoices(
    currentWorkspace?.id,
  );

  if (!currentWorkspace) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
              <NeuCard className="p-4 sm:p-6 max-w-md text-center">
                <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" aria-hidden="true" />
                <h1 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Aucun espace sélectionné</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sélectionnez un espace entreprise pour accéder aux factures.
                </p>
              </NeuCard>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (currentWorkspace.scope === "personal") {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
              <NeuCard className="p-4 sm:p-6 max-w-md text-center space-y-4">
                <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto" aria-hidden="true" />
                <div>
                  <h1 className="text-lg sm:text-xl font-bold mb-1">Module non disponible</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    La facturation est réservée aux espaces entreprise.
                  </p>
                </div>
                <NeuButton size="sm" onClick={() => navigate("/dashboard")} className="text-xs sm:text-sm">
                  Retour au dashboard
                </NeuButton>
              </NeuCard>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  const handleSaveInvoice = useCallback(async (payload: InvoiceEditorResult) => {
    if (!currentWorkspace) {
      const err = "Espace requis pour créer/modifier une facture";
      setError(err);
      toast.error(err);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingInvoice) {
        await updateInvoice(editingInvoice.id, payload);
        setEditingInvoice(null);
        toast.success("Facture mise à jour");
        setSuccess("Facture mise à jour avec succès");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        await createInvoice({
          workspaceId: currentWorkspace.id,
          ...payload,
        });
        setShowNewInvoice(false);
        toast.success("Facture créée");
        setSuccess("Facture créée avec succès");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la sauvegarde de la facture";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error saving invoice:", err);
    } finally {
      setSaving(false);
    }
  }, [currentWorkspace, editingInvoice, createInvoice, updateInvoice]);

  const handleDeleteInvoice = useCallback(async (invoice: Invoice) => {
    setDeletingInvoice(invoice);
  }, []);

  const confirmDeleteInvoice = useCallback(async () => {
    if (!deletingInvoice) return;

    setSaving(true);
    setError(null);

    try {
      await deleteInvoice(deletingInvoice.id);
      toast.success("Facture supprimée");
      setSuccess("Facture supprimée avec succès");
      setDeletingInvoice(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la suppression de la facture";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting invoice:", err);
    } finally {
      setSaving(false);
    }
  }, [deletingInvoice, deleteInvoice]);

  const handleMarkAsPaid = useCallback(async (invoice: Invoice) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await markAsPaid(invoice.id);
      toast.success("Facture marquée comme payée");
      setSuccess("Facture marquée comme payée");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la mise à jour de la facture";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error marking invoice as paid:", err);
    } finally {
      setSaving(false);
    }
  }, [markAsPaid]);

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
              <NeuCard className="p-8 sm:p-12 max-w-md text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" aria-label="Chargement en cours" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Chargement...</h2>
                <p className="text-sm text-muted-foreground">Chargement des factures...</p>
              </NeuCard>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
          <header className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 lg:pt-8">
            <NeuCard className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-0.5 sm:mb-1 lg:mb-2 truncate">
                      Espace entreprise · Facturation
                    </p>
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
                      Facturation
                    </h1>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 line-clamp-2">
                      Espace : {currentWorkspace.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                  <NeuButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
                    aria-label="Retour au dashboard"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Retour</span>
                  </NeuButton>
                  <Dialog open={showNewInvoice} onOpenChange={setShowNewInvoice}>
                    <DialogTrigger asChild>
                      <NeuButton
                        variant="premium"
                        size="sm"
                        className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm"
                        aria-label="Créer une nouvelle facture"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">Nouvelle facture</span>
                      </NeuButton>
                    </DialogTrigger>
                    <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 mb-1 sm:mb-2">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                            <FileText className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 sm:mb-2">
                              Facturation
                            </p>
                            <DialogTitle className="text-base sm:text-lg lg:text-xl">Créer une facture</DialogTitle>
                          </div>
                        </div>
                      </DialogHeader>
                      <InvoiceEditor
                        onSave={handleSaveInvoice}
                        onCancel={() => setShowNewInvoice(false)}
                        saving={saving}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {(error || success) && (
                <div
                  className={`mt-4 neu-inset rounded-xl p-3 sm:p-4 border flex items-start gap-2 sm:gap-3 ${
                    error
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  {error ? (
                    <>
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-red-900 mb-0.5 sm:mb-1">Erreur</p>
                        <p className="text-[10px] sm:text-xs text-red-700 break-words">{error}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setError(null)}
                        className="text-red-600 hover:text-red-800 flex-shrink-0 text-lg sm:text-xl leading-none"
                        aria-label="Fermer le message d'erreur"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-green-900 mb-0.5 sm:mb-1">Succès</p>
                        <p className="text-[10px] sm:text-xs text-green-700 break-words">{success}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSuccess(null)}
                        className="text-green-600 hover:text-green-800 flex-shrink-0 text-lg sm:text-xl leading-none"
                        aria-label="Fermer le message de succès"
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              )}
            </NeuCard>
          </header>

          <main className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4 lg:space-y-6 max-w-7xl mx-auto w-full">
            <InvoiceList
              invoices={invoices}
              onCreate={() => setShowNewInvoice(true)}
              onEdit={(invoice) => setEditingInvoice(invoice)}
              onDelete={handleDeleteInvoice}
              onMarkPaid={handleMarkAsPaid}
              saving={saving}
            />
          </main>

          {editingInvoice && (
            <Dialog open={!!editingInvoice} onOpenChange={() => setEditingInvoice(null)}>
              <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 mb-1 sm:mb-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <FileText className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 sm:mb-2">
                        Facturation
                      </p>
                      <DialogTitle className="text-base sm:text-lg lg:text-xl">Modifier la facture</DialogTitle>
                    </div>
                  </div>
                </DialogHeader>
                <InvoiceEditor
                  invoice={editingInvoice}
                  onSave={handleSaveInvoice}
                  onCancel={() => setEditingInvoice(null)}
                  saving={saving}
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!deletingInvoice} onOpenChange={() => setDeletingInvoice(null)}>
            <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md mx-4">
              <AlertDialogHeader>
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 mb-1 sm:mb-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <Trash2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 sm:mb-2">
                      Suppression
                    </p>
                    <AlertDialogTitle className="text-base sm:text-lg lg:text-xl">
                      Supprimer la facture
                    </AlertDialogTitle>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogDescription className="text-xs sm:text-sm">
                Êtes-vous sûr de vouloir supprimer la facture <strong>{deletingInvoice?.invoiceNumber}</strong> ? Cette action est irréversible.
                {deletingInvoice && (
                  <div className="mt-3 p-3 neu-inset rounded-xl bg-slate-50">
                    <p className="text-xs font-medium text-slate-900 mb-1">Client : {deletingInvoice.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      Montant : {deletingInvoice.totals.ttc.toLocaleString("fr-FR")} {deletingInvoice.currency}
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
                <AlertDialogCancel disabled={saving} className="w-full sm:w-auto text-xs sm:text-sm">
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteInvoice}
                  disabled={saving}
                  className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs sm:text-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin inline-block" aria-hidden="true" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 inline-block" aria-hidden="true" />
                      Supprimer
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default InvoicesPage;

