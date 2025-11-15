import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useHouseholdEmployment } from "@/hooks/useHouseholdEmployment";
import { HouseholdEmploymentList } from "@/components/personal/HouseholdEmploymentList";
import { EmploymentContractForm } from "@/components/personal/EmploymentContractForm";
import { PayslipGenerator } from "@/components/personal/PayslipGenerator";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { AlertCircle, Loader2, ArrowLeft, Plus, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { EmploymentContract } from "@/types/domain";
import type { EmploymentContractFormValues } from "@/components/personal/EmploymentContractForm";

const HouseholdEmploymentPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const {
    contracts,
    payslips,
    loading,
    error,
    clearError,
    addContract,
    updateContract,
    deleteContract,
    terminateContract,
    generatePayslip,
    deletePayslip,
  } = useHouseholdEmployment(currentWorkspace?.id);
  const [showNewContract, setShowNewContract] = useState(false);
  const [editingContract, setEditingContract] = useState<EmploymentContract | null>(null);

  const handleAddContract = useCallback(
    async (data: EmploymentContractFormValues) => {
      clearError();
      try {
        await addContract({
          workspaceId: currentWorkspace?.id || "",
          employeeName: data.employeeName,
          role: data.role,
          contractType: data.contractType,
          hourlyRate: data.hourlyRate,
          weeklyHours: data.weeklyHours,
          startDate: data.startDate,
          status: "active",
        });
        setShowNewContract(false);
      } catch (err) {
        console.error("Error adding contract:", err);
      }
    },
    [addContract, currentWorkspace?.id, clearError]
  );

  const handleUpdateContract = useCallback(
    async (data: EmploymentContractFormValues) => {
      if (!editingContract) return;
      clearError();
      try {
        await updateContract(editingContract.id, {
          employeeName: data.employeeName,
          role: data.role,
          contractType: data.contractType,
          hourlyRate: data.hourlyRate,
          weeklyHours: data.weeklyHours,
          startDate: data.startDate,
        });
        setEditingContract(null);
      } catch (err) {
        console.error("Error updating contract:", err);
      }
    },
    [updateContract, editingContract, clearError]
  );

  const handleDeleteContract = useCallback(
    async (contract: EmploymentContract) => {
      clearError();
      try {
        await deleteContract(contract.id);
      } catch (err) {
        console.error("Error deleting contract:", err);
      }
    },
    [deleteContract, clearError]
  );

  const handleTerminateContract = useCallback(
    async (contract: EmploymentContract) => {
      clearError();
      try {
        await terminateContract(contract.id);
      } catch (err) {
        console.error("Error terminating contract:", err);
      }
    },
    [terminateContract, clearError]
  );

  if (!currentWorkspace) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
              <NeuCard className="p-4 sm:p-6 max-w-md text-center">
                <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                <h1 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Aucun espace sélectionné</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Sélectionnez un espace pour accéder au module Emploi à domicile.
                </p>
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
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-0.5 sm:mb-1 lg:mb-2 truncate">
                      Espace personnel · Emploi à domicile
                    </p>
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
                      Emploi à domicile
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
                  <Dialog open={showNewContract} onOpenChange={setShowNewContract}>
                    <DialogTrigger asChild>
                      <NeuButton 
                        variant="premium" 
                        className="flex-1 sm:flex-none text-[11px] sm:text-xs lg:text-sm" 
                        size="sm"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">Nouveau contrat</span>
                      </NeuButton>
                    </DialogTrigger>
                    <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-1 sm:mb-2">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 sm:mb-2">
                              Emploi à domicile
                            </p>
                            <DialogTitle className="text-base sm:text-lg lg:text-xl">Créer un contrat d'emploi</DialogTitle>
                          </div>
                        </div>
                      </DialogHeader>
                      <EmploymentContractForm
                        onSubmit={handleAddContract}
                        onCancel={() => setShowNewContract(false)}
                        submitting={loading}
                      />
                    </DialogContent>
                  </Dialog>

                  {editingContract && (
                    <Dialog open={!!editingContract} onOpenChange={(open) => !open && setEditingContract(null)}>
                      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-1 sm:mb-2">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                              <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 sm:mb-2">
                                Emploi à domicile
                              </p>
                              <DialogTitle className="text-base sm:text-lg lg:text-xl">
                                Modifier le contrat d'emploi
                              </DialogTitle>
                            </div>
                          </div>
                        </DialogHeader>
                        <EmploymentContractForm
                          defaultValues={{
                            employeeName: editingContract.employeeName,
                            role: editingContract.role,
                            contractType: editingContract.contractType,
                            hourlyRate: editingContract.hourlyRate,
                            weeklyHours: editingContract.weeklyHours,
                            startDate: editingContract.startDate || new Date().toISOString().slice(0, 10),
                          }}
                          onSubmit={handleUpdateContract}
                          onCancel={() => setEditingContract(null)}
                          submitting={loading}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>

              {error && (
                <div className="mt-4 neu-inset rounded-xl p-3 sm:p-4 bg-red-50 border border-red-200 flex items-start gap-2 sm:gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-red-900 mb-0.5 sm:mb-1">Erreur</p>
                    <p className="text-[10px] sm:text-xs text-red-700 break-words">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearError}
                    className="text-red-600 hover:text-red-800 flex-shrink-0 text-lg sm:text-xl leading-none"
                    aria-label="Fermer le message d'erreur"
                  >
                    ×
                  </button>
                </div>
              )}
            </NeuCard>
          </header>

          <main className="px-3 sm:px-4 lg:px-6 xl:px-8 pt-3 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4 lg:space-y-6 max-w-7xl mx-auto w-full">
            {loading && contracts.length === 0 && (
              <NeuCard className="p-8 sm:p-12 text-center">
                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-spin text-primary mx-auto mb-3 sm:mb-4" aria-label="Chargement en cours" />
                <p className="text-xs sm:text-sm text-muted-foreground">Chargement...</p>
              </NeuCard>
            )}

            {!loading && (
              <Tabs defaultValue="contracts" className="w-full">
                <NeuCard className="p-2 sm:p-3 lg:p-4 mb-3 sm:mb-4">
                  <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto p-0 gap-1.5 sm:gap-2">
                    <TabsTrigger
                      value="contracts"
                      className="neu-card-sm px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-[10px] sm:text-xs lg:text-sm xl:text-base"
                    >
                      <span className="truncate">Contrats {contracts.length > 0 && `(${contracts.length})`}</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="payslips"
                      className="neu-card-sm px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-[10px] sm:text-xs lg:text-sm xl:text-base"
                    >
                      <span className="truncate">Fiches de paie {payslips.length > 0 && `(${payslips.length})`}</span>
                    </TabsTrigger>
                  </TabsList>
                </NeuCard>

                <TabsContent value="contracts" className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                  <HouseholdEmploymentList
                    contracts={contracts}
                    onEdit={setEditingContract}
                    onDelete={handleDeleteContract}
                    onTerminate={handleTerminateContract}
                    loading={loading}
                  />
                </TabsContent>

                <TabsContent value="payslips" className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                  <PayslipGenerator
                    contracts={contracts}
                    payslips={payslips}
                    onGenerate={async (data) => {
                      clearError();
                      try {
                        await generatePayslip(data);
                      } catch (err) {
                        console.error("Error generating payslip:", err);
                      }
                    }}
                    onDelete={async (payslipId) => {
                      clearError();
                      try {
                        await deletePayslip(payslipId);
                      } catch (err) {
                        console.error("Error deleting payslip:", err);
                      }
                    }}
                    loading={loading}
                  />
                </TabsContent>
              </Tabs>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default HouseholdEmploymentPage;

