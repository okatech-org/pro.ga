import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { IrppSummary } from "@/components/personal/IrppSummary";
import { IrppRevenueForm } from "@/components/personal/IrppRevenueForm";
import { IrppSimulation } from "@/components/personal/IrppSimulation";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calculator } from "lucide-react";
import type { IrppRevenues } from "@/types/domain";

const IrppPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const [revenues, setRevenues] = useState<IrppRevenues>({
    salaries: 0,
    rents: 0,
    bic: 0,
    bnc: 0,
    dividends: 0,
  });

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
        <NeuCard className="p-6 max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Aucun espace sélectionné</h1>
          <p className="text-sm text-muted-foreground">
            Sélectionnez un espace pour accéder au module IRPP.
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
                  Espace personnel · IRPP
                </p>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Module IRPP
                </h1>
                <p className="text-sm text-muted-foreground">
                  Espace : {currentWorkspace.name}
                </p>
              </div>
            </div>
          </div>
        </NeuCard>
      </header>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Résumé</TabsTrigger>
          <TabsTrigger value="revenues">Revenus</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <IrppSummary revenues={revenues} />
        </TabsContent>

        <TabsContent value="revenues" className="space-y-4">
          <IrppRevenueForm
            initialRevenues={revenues}
            onSubmit={(data) => {
              setRevenues(data);
            }}
          />
        </TabsContent>

        <TabsContent value="simulation" className="space-y-4">
          <IrppSimulation revenues={revenues} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IrppPage;

