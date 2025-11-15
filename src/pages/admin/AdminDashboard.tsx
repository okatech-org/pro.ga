import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NeuButton } from "@/components/ui/neu-button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/UserManagement";
import { WorkspaceMonitoring } from "@/components/admin/WorkspaceMonitoring";
import { AuditLogs } from "@/components/admin/AuditLogs";
import { ArrowLeft, Shield } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center gap-4">
        <NeuButton variant="outline" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </NeuButton>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Console Admin PRO.GA
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestion utilisateurs, monitoring & audit
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-4 mt-6">
          <WorkspaceMonitoring />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4 mt-6">
          <AuditLogs />
        </TabsContent>
      </Tabs>

      <Card className="bg-warning/5 border-warning/20">
        <CardHeader>
          <CardTitle className="text-sm">Note importante</CardTitle>
          <CardDescription>
            Cette console est réservée aux administrateurs système. Toutes les actions sont
            tracées dans les logs d'audit. L'accès non autorisé est sanctionné.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminDashboard;

