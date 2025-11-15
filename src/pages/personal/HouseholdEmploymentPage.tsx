import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useHouseholdEmployment } from "@/hooks/useHouseholdEmployment";
import { HouseholdEmploymentList } from "@/components/personal/HouseholdEmploymentList";
import { EmploymentContractForm } from "@/components/personal/EmploymentContractForm";
import { PayslipGenerator } from "@/components/personal/PayslipGenerator";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const HouseholdEmploymentPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const { contracts, payslips, addContract, generatePayslip } = useHouseholdEmployment(
    currentWorkspace?.id,
  );
  const [showNewContract, setShowNewContract] = useState(false);

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
        <NeuCard className="p-6 max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Aucun espace sélectionné</h1>
          <p className="text-sm text-muted-foreground">
            Sélectionnez un espace pour accéder au module Emploi à domicile.
          </p>
        </NeuCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-6 space-y-6">
      <header>
        <NeuCard className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <NeuButton variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4" />
              </NeuButton>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Espace personnel · Emploi à domicile
                </p>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Emploi à domicile
                </h1>
                <p className="text-sm text-muted-foreground">
                  Espace : {currentWorkspace.name}
                </p>
              </div>
            </div>

            <Dialog open={showNewContract} onOpenChange={setShowNewContract}>
              <DialogTrigger asChild>
                <NeuButton variant="premium" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nouveau contrat
                </NeuButton>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <div className="flex items-center gap-4 flex-1 mb-2">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Emploi à domicile</p>
                      <DialogTitle>Créer un contrat d'emploi</DialogTitle>
                    </div>
                  </div>
                </DialogHeader>
                <EmploymentContractForm
                  onSubmit={async (data) => {
                    await addContract(data);
                    setShowNewContract(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </NeuCard>
      </header>

      <Tabs defaultValue="contracts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contracts">Contrats</TabsTrigger>
          <TabsTrigger value="payslips">Fiches de paie</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-4">
          <HouseholdEmploymentList contracts={contracts} />
        </TabsContent>

        <TabsContent value="payslips" className="space-y-4">
          <PayslipGenerator
            contracts={contracts}
            onGenerate={async (data) => {
              await generatePayslip(data);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HouseholdEmploymentPage;

