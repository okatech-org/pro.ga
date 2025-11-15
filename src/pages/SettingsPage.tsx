import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import { ArrowLeft, Settings, Lock, Bell, Shield, Database, LogOut, Download, Trash2 } from "lucide-react";
import { createExportBlob } from "@/utils/exportPacket";

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  account_type: string;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
  scope: string;
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [exportingData, setExportingData] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const { businessWorkspaces, personalWorkspace } = useWorkspaces();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || "");
        setPhone(profileData.phone || "");
      }

      const { data: workspacesData } = await supabase
        .from("workspaces")
        .select("id, name, slug, scope")
        .eq("owner_id", session.user.id);

      if (workspacesData && Array.isArray(workspacesData) && !workspacesData.some((ws: any) => ws.error)) {
        setWorkspaces(workspacesData as Workspace[]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erreur lors du chargement des paramètres");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit faire au moins 6 caractères");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      toast.success("Mot de passe changé avec succès");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.message || "Erreur lors du changement de mot de passe");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnecté avec succès");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const handleExportData = async () => {
    setExportingData(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour exporter vos données");
        return;
      }

      const userId = session.user.id;
      const exportData: any = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        user: {
          id: userId,
          email: session.user.email,
        },
        profile: profile || null,
        workspaces: [],
        data: {},
      };

      for (const ws of workspaces) {
        const workspaceData: any = {
          workspace: ws,
          invoices: [],
          contracts: [],
          documents: [],
          accountingEntries: [],
        };

        if (ws.scope === "business") {
          const { data: invoices } = await supabase
            .from("invoices")
            .select("*")
            .eq("workspace_id", ws.id);
          if (invoices) workspaceData.invoices = invoices;

          const { data: storeProducts } = await supabase
            .from("store_products")
            .select("*")
            .eq("workspace_id", ws.id);
          if (storeProducts) workspaceData.storeProducts = storeProducts;
        }

        if (ws.scope === "personal") {
          const { data: contracts } = await supabase
            .from("employment_contracts")
            .select("*")
            .eq("workspace_id", ws.id);
          if (contracts) workspaceData.contracts = contracts;

          const { data: payslips } = await supabase
            .from("payslips")
            .select("*")
            .eq("workspace_id", ws.id);
          if (payslips) workspaceData.payslips = payslips;
        }

        const { data: documents } = await supabase
          .from("documents")
          .select("*")
          .eq("workspace_id", ws.id);
        if (documents) workspaceData.documents = documents;

        exportData.workspaces.push(workspaceData);
      }

      const blob = createExportBlob(exportData);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `proga-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Données exportées avec succès");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Erreur lors de l'export des données");
    } finally {
      setExportingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté");
        return;
      }

      const userId = session.user.id;

      for (const ws of workspaces) {
        if (ws.scope === "business") {
          await supabase.from("invoices").delete().eq("workspace_id", ws.id);
          await supabase.from("store_products").delete().eq("workspace_id", ws.id);
          await supabase.from("store_orders").delete().eq("workspace_id", ws.id);
          await supabase.from("journal_entries").delete().eq("workspace_id", ws.id);
        }

        if (ws.scope === "personal") {
          await supabase.from("employment_contracts").delete().eq("workspace_id", ws.id);
          await supabase.from("payslips").delete().eq("workspace_id", ws.id);
        }

        await supabase.from("documents").delete().eq("workspace_id", ws.id);
        await supabase.from("tax_profiles").delete().eq("workspace_id", ws.id);
        await supabase.from("ai_jobs").delete().eq("workspace_id", ws.id);
        await supabase.from("export_packets").delete().eq("workspace_id", ws.id);
        
        await supabase.from("workspaces").delete().eq("id", ws.id);
      }

      await supabase.from("profiles").delete().eq("user_id", userId);

      toast.success("Toutes vos données ont été supprimées. Pour supprimer complètement votre compte d'authentification, veuillez contacter le support.");
      
      await supabase.auth.signOut();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Erreur lors de la suppression des données");
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-6 space-y-6">
      {/* Header */}
      <NeuCard className="p-6 mb-4">
        <div className="flex items-start gap-4">
          <NeuButton variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </NeuButton>
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">
              Compte & préférences
            </p>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="w-7 h-7 text-primary" />
              Paramètres
            </h1>
            <p className="text-sm text-muted-foreground">
              Gérez votre profil, votre sécurité et vos notifications
            </p>
          </div>
        </div>
      </NeuCard>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <NeuCard className="p-6">
            <h2 className="text-2xl font-bold mb-6">Informations Personnelles</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Marie Laurent"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Non modifiable pour des raisons de sécurité
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+241 XX XX XX XX"
                />
              </div>

              <div>
                <Label>Type de compte</Label>
                <Input
                  type="text"
                  value={profile?.account_type === "individual" ? "Particulier" : profile?.account_type || ""}
                  disabled
                  className="opacity-60"
                />
              </div>
            </div>

            <NeuButton
              onClick={handleUpdateProfile}
              disabled={saving}
              className="gap-2"
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </NeuButton>
          </NeuCard>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <NeuCard className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-warning" />
              Sécurité
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Changer votre code à 6 chiffres</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="newPassword">Nouveau code (6 chiffres)</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le code</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                    />
                  </div>
                </div>

                <NeuButton
                  onClick={handleChangePassword}
                  disabled={saving}
                  variant="outline"
                  className="mt-4 gap-2"
                >
                  {saving ? "Mise à jour..." : "Mettre à jour le code"}
                </NeuButton>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  Sécurité du compte
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>✓ Authentification par code à 6 chiffres activée</p>
                  <p>✓ Accès sécurisé via Supabase</p>
                  <p>✓ Données chiffrées en transit</p>
                </div>
              </div>
            </div>
          </NeuCard>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <NeuCard className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Bell className="w-6 h-6 text-info" />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 neu-inset rounded-lg">
                <div>
                  <h3 className="font-semibold">Rappels fiscaux</h3>
                  <p className="text-sm text-muted-foreground">
                    Alertes pour les échéances IRPP, TVA, CSS
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 neu-inset rounded-lg opacity-60">
                <div>
                  <h3 className="font-semibold">Mises à jour des déclarations</h3>
                  <p className="text-sm text-muted-foreground">
                    Notifications sur le statut de vos déclarations
                  </p>
                </div>
                <input
                  type="checkbox"
                  disabled
                  className="w-5 h-5 cursor-not-allowed"
                />
              </div>

              <div className="flex items-center justify-between p-4 neu-inset rounded-lg opacity-60">
                <div>
                  <h3 className="font-semibold">Conseils et astuces</h3>
                  <p className="text-sm text-muted-foreground">
                    Conseils fiscaux personnalisés et optimisations
                  </p>
                </div>
                <input
                  type="checkbox"
                  disabled
                  className="w-5 h-5 cursor-not-allowed"
                />
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                💡 Plus de paramètres de notification seront disponibles bientôt
              </p>
            </div>
          </NeuCard>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-4">
          <NeuCard className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              Gestion des données
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Mes espaces de travail</h3>
                <div className="space-y-2">
                  {workspaces.length > 0 ? (
                    workspaces.map((ws) => (
                      <div key={ws.id} className="p-3 neu-inset rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{ws.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {ws.scope === "personal" ? "Espace personnel" : "Entreprise"}
                            </p>
                          </div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {ws.slug}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Aucun espace de travail créé
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-3">Export et suppression</h3>
                <div className="space-y-2">
                  <NeuButton 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={handleExportData}
                    disabled={exportingData}
                  >
                    <Download className="w-4 h-4" />
                    {exportingData ? "Export en cours..." : "Télécharger mes données (JSON)"}
                  </NeuButton>
                  <NeuButton 
                    variant="outline" 
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deletingAccount}
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer mon compte définitivement
                  </NeuButton>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ Ces actions sont irréversibles
                </p>
              </div>
            </div>
          </NeuCard>
        </TabsContent>
      </Tabs>

      {/* Logout */}
      <div className="max-w-4xl">
        <NeuButton
          onClick={handleLogout}
          className="w-full gap-2 border border-destructive text-destructive hover:bg-destructive/10"
          variant="outline"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </NeuButton>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-4 flex-1 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Suppression</p>
                <AlertDialogTitle>Supprimer votre compte</AlertDialogTitle>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Cette action est définitive et irréversible. Toutes vos données seront supprimées :
            <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
              <li>Votre profil et vos informations personnelles</li>
              <li>Tous vos espaces de travail</li>
              <li>Toutes vos factures et documents</li>
              <li>Tous vos contrats et données fiscales</li>
            </ul>
            <p className="mt-3 font-semibold text-destructive">
              Êtes-vous sûr de vouloir continuer ?
            </p>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingAccount}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingAccount ? "Suppression..." : "Supprimer définitivement"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;

