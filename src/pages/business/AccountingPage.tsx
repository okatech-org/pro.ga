import { useNavigate } from "react-router-dom";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useLedger } from "@/hooks/useLedger";
import { AccountingJournal } from "@/components/business/AccountingJournal";
import { LedgerView } from "@/components/business/LedgerView";
import { BalanceSheet } from "@/components/business/BalanceSheet";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen } from "lucide-react";

const AccountingPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const { entries, balances, balanceSheet, addEntry, stats } = useLedger(currentWorkspace?.id);

  if (!currentWorkspace) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center p-6">
        <NeuCard className="p-6 max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Aucun espace sélectionné</h1>
          <p className="text-sm text-muted-foreground">
            Sélectionnez un espace entreprise pour accéder à la comptabilité.
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
              La comptabilité SYSCOHADA est réservée aux espaces entreprise.
            </p>
          </div>
          <NeuButton onClick={() => navigate("/dashboard")}>Retour au dashboard</NeuButton>
        </NeuCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-6 space-y-6">
      <NeuCard className="p-6 mb-2">
        <div className="flex items-start gap-4">
          <NeuButton variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </NeuButton>
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">
              Espace entreprise · Comptabilité
            </p>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Comptabilité SYSCOHADA
            </h1>
            <p className="text-sm text-muted-foreground">
              Espace : {currentWorkspace.name}
            </p>
          </div>
        </div>
      </NeuCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NeuCard className="p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total débits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalDebit.toLocaleString("fr-FR")} FCFA</p>
          </CardContent>
        </NeuCard>
        <NeuCard className="p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total crédits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalCredit.toLocaleString("fr-FR")} FCFA</p>
          </CardContent>
        </NeuCard>
        <NeuCard className="p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Écritures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{entries.length}</p>
          </CardContent>
        </NeuCard>
      </div>

      <Tabs defaultValue="journal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="ledger">Grand-livre</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-4">
          <AccountingJournal 
            entries={entries} 
            onAdd={(values) => {
              addEntry({
                date: values.date,
                description: values.description,
                debitAccount: values.debitAccount,
                creditAccount: values.creditAccount,
                amount: values.amount,
                reference: values.reference || undefined,
              });
            }} 
          />
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
          <LedgerView balances={balances} />
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          <BalanceSheet sections={balanceSheet} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingPage;

