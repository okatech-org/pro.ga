import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
import {
  ArrowLeft,
  Settings,
  Lock,
  Bell,
  Shield,
  Database,
  LogOut,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Save,
} from "lucide-react";
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
  type: string;
}

interface NotificationSettings {
  taxReminders: boolean;
  declarationUpdates: boolean;
  tips: boolean;
}

const STORAGE_KEY = "proga.notifications";

const loadNotificationSettings = (): NotificationSettings => {
  if (typeof window === "undefined") {
    return { taxReminders: true, declarationUpdates: false, tips: false };
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as NotificationSettings;
    }
  } catch {
    // Ignore
  }
  return { taxReminders: true, declarationUpdates: false, tips: false };
};

const saveNotificationSettings = (settings: NotificationSettings) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore
  }
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState<NotificationSettings>(loadNotificationSettings());
  const [exportingData, setExportingData] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isPasswordDirty, setIsPasswordDirty] = useState(false);

  useEffect(() => {
    loadData();
    const savedNotifications = loadNotificationSettings();
    setNotifications(savedNotifications);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Vérifier le mode démo d'abord
      const demoModeState = localStorage.getItem("proga.demoMode");
      const isDemoMode = demoModeState ? JSON.parse(demoModeState).enabled : false;

      if (isDemoMode) {
        // En mode démo, simuler des données
        setUser({ email: "demo@pro.ga", id: "demo-user" });
        setProfile({
          id: "demo-profile",
          full_name: "Utilisateur Démo",
          phone: null,
          account_type: "individual",
        });
        setFullName("Utilisateur Démo");
        setPhone("");
        setWorkspaces([]);
        setLoading(false);
        return;
      }

      // Vérifier la session pour les utilisateurs réels
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Si pas de session, on ne redirige pas immédiatement
      // On permet l'accès à la page mais certaines fonctionnalités seront désactivées
      if (!session) {
        console.warn("No session found, allowing access in limited mode");
        setWorkspaces([]);
        setLoading(false);
        return;
      }

      if (sessionError) {
        console.error("Session error:", sessionError);
        // Ne pas rediriger, juste logger l'erreur
      }

      setUser(session.user);

      // Charger le profil
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.warn("Profile error (non-fatal):", profileError);
        }

        if (profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || "");
          setPhone(profileData.phone || "");
        }
      } catch (profileErr) {
        console.warn("Could not load profile:", profileErr);
        // Continue même si le profil ne charge pas
      }

      // Charger les workspaces
      try {
        const { data: workspacesData, error: workspacesError } = await supabase
          .from("workspaces")
          .select("id, name, slug, type")
          .eq("owner_id", session.user.id);

        if (workspacesError) {
          console.warn("Workspaces error (non-fatal):", workspacesError);
        }

        if (workspacesData && Array.isArray(workspacesData)) {
          setWorkspaces(
            workspacesData.map((ws: any) => ({
              ...(ws && typeof ws === 'object' ? ws : {}),
              scope: ws?.type || ws?.scope || 'personal',
            })) as Workspace[]
          );
        }
      } catch (workspaceErr) {
        console.warn("Could not load workspaces:", workspaceErr);
        // Continue même si les workspaces ne chargent pas
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors du chargement des paramètres";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = useCallback(async () => {
    // Vérifier le mode démo
    const demoModeState = localStorage.getItem("proga.demoMode");
    const isDemoMode = demoModeState ? JSON.parse(demoModeState).enabled : false;
    
    if (isDemoMode) {
      toast.success("Mode démo : les modifications ne sont pas sauvegardées");
      setSuccess("Mode démo : les modifications ne sont pas sauvegardées");
      setIsDirty(false);
      setTimeout(() => setSuccess(null), 3000);
      return;
    }

    if (!profile) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour mettre à jour votre profil");
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        const { error: insertError } = await supabase.from("profiles").insert({
          user_id: session.user.id,
          full_name: fullName,
          phone: phone,
          account_type: "individual",
        });

        if (insertError) throw insertError;
        toast.success("Profil créé avec succès");
        setSuccess("Profil créé avec succès");
        setIsDirty(false);
        await loadData();
      } catch (err: any) {
        const errorMessage = err.message || "Erreur lors de la création du profil";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setSaving(false);
        setTimeout(() => setSuccess(null), 3000);
      }
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;
      toast.success("Profil mis à jour avec succès");
      setSuccess("Profil mis à jour avec succès");
      setIsDirty(false);
      await loadData();
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la mise à jour du profil";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  }, [profile, fullName, phone]);

  const handleChangePassword = useCallback(async () => {
    // Vérifier le mode démo
    const demoModeState = localStorage.getItem("proga.demoMode");
    const isDemoMode = demoModeState ? JSON.parse(demoModeState).enabled : false;
    
    if (isDemoMode) {
      toast.info("Mode démo : le changement de mot de passe n'est pas disponible");
      return;
    }

    // Vérifier la session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Vous devez être connecté pour changer votre mot de passe");
      return;
    }

    if (!newPassword || !confirmPassword) {
      const err = "Veuillez remplir tous les champs";
      setError(err);
      toast.error(err);
      return;
    }

    if (newPassword !== confirmPassword) {
      const err = "Les mots de passe ne correspondent pas";
      setError(err);
      toast.error(err);
      return;
    }

    if (newPassword.length < 6) {
      const err = "Le mot de passe doit faire au moins 6 caractères";
      setError(err);
      toast.error(err);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;
      toast.success("Mot de passe changé avec succès");
      setSuccess("Mot de passe changé avec succès");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordDirty(false);
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors du changement de mot de passe";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  }, [newPassword, confirmPassword]);

  const handleNotificationChange = useCallback((key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...notifications, [key]: value };
    setNotifications(newSettings);
    saveNotificationSettings(newSettings);
    toast.success("Préférences de notification sauvegardées");
  }, [notifications]);

  const handleLogout = useCallback(async () => {
    try {
      // Vérifier le mode démo
      const demoModeState = localStorage.getItem("proga.demoMode");
      const isDemoMode = demoModeState ? JSON.parse(demoModeState).enabled : false;
      
      if (isDemoMode) {
        // Nettoyer le mode démo
        localStorage.removeItem("proga.demoMode");
        toast.success("Mode démo désactivé");
        navigate("/");
        return;
      }

      await supabase.auth.signOut();
      toast.success("Déconnecté avec succès");
      navigate("/");
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la déconnexion";
      toast.error(errorMessage);
      console.error("Error during logout:", err);
    }
  }, [navigate]);

  const handleExportData = useCallback(async () => {
    // Vérifier le mode démo
    const demoModeState = localStorage.getItem("proga.demoMode");
    const isDemoMode = demoModeState ? JSON.parse(demoModeState).enabled : false;
    
    if (isDemoMode) {
      toast.info("Mode démo : l'export de données n'est pas disponible");
      return;
    }

    setExportingData(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const err = "Vous devez être connecté pour exporter vos données";
        setError(err);
        toast.error(err);
        setExportingData(false);
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
          const { data: invoices } = await (supabase.from("invoices") as any)
            .select("*")
            .eq("workspace_id", ws.id);
          if (invoices) workspaceData.invoices = invoices;

          const { data: storeProducts } = await (supabase.from("store_products") as any)
            .select("*")
            .eq("workspace_id", ws.id);
          if (storeProducts) workspaceData.storeProducts = storeProducts;
        }

        if (ws.scope === "personal") {
          const { data: contracts } = await (supabase.from("employment_contracts") as any)
            .select("*")
            .eq("workspace_id", ws.id);
          if (contracts) workspaceData.contracts = contracts;

          const { data: payslips } = await (supabase.from("payslips") as any)
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
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de l'export des données";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error exporting data:", err);
    } finally {
      setExportingData(false);
    }
  }, [profile, workspaces]);

  const handleDeleteAccount = useCallback(async () => {
    // Vérifier le mode démo
    const demoModeState = localStorage.getItem("proga.demoMode");
    const isDemoMode = demoModeState ? JSON.parse(demoModeState).enabled : false;
    
    if (isDemoMode) {
      toast.info("Mode démo : la suppression de compte n'est pas disponible");
      setShowDeleteConfirm(false);
      return;
    }

    setDeletingAccount(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté");
        setDeletingAccount(false);
        setShowDeleteConfirm(false);
        return;
      }

      const userId = session.user.id;

      for (const ws of workspaces) {
        if (ws.scope === "business") {
          await (supabase.from("invoices") as any).delete().eq("workspace_id", ws.id);
          await (supabase.from("store_products") as any).delete().eq("workspace_id", ws.id);
          await (supabase.from("store_orders") as any).delete().eq("workspace_id", ws.id);
          await (supabase.from("journal_entries") as any).delete().eq("workspace_id", ws.id);
        }

        if (ws.scope === "personal") {
          await (supabase.from("employment_contracts") as any).delete().eq("workspace_id", ws.id);
          await (supabase.from("payslips") as any).delete().eq("workspace_id", ws.id);
        }

        await (supabase.from("documents") as any).delete().eq("workspace_id", ws.id);
        await (supabase.from("tax_profiles") as any).delete().eq("workspace_id", ws.id);
        await (supabase.from("ai_jobs") as any).delete().eq("workspace_id", ws.id);
        await (supabase.from("export_packets") as any).delete().eq("workspace_id", ws.id);

        await (supabase.from("workspaces") as any).delete().eq("id", ws.id);
      }

      await supabase.from("profiles").delete().eq("user_id", userId);

      toast.success("Toutes vos données ont été supprimées. Pour supprimer complètement votre compte d'authentification, veuillez contacter le support.");

      await supabase.auth.signOut();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || "Erreur lors de la suppression des données";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error deleting account:", err);
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  }, [workspaces, navigate]);

  useEffect(() => {
    const isProfileDirty =
      fullName !== (profile?.full_name || "") || phone !== (profile?.phone || "");
    setIsDirty(isProfileDirty);
  }, [fullName, phone, profile]);

  useEffect(() => {
    setIsPasswordDirty(newPassword.length > 0 || confirmPassword.length > 0);
  }, [newPassword, confirmPassword]);

  const passwordValid = useMemo(() => {
    if (!newPassword && !confirmPassword) return true;
    return (
      newPassword.length >= 6 &&
      confirmPassword.length >= 6 &&
      newPassword === confirmPassword
    );
  }, [newPassword, confirmPassword]);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex-1 bg-background pl-2 sm:pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
              <NeuCard className="p-8 sm:p-12 max-w-md text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" aria-label="Chargement en cours" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Chargement...</h2>
                <p className="text-sm text-muted-foreground">Chargement des paramètres...</p>
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
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Settings className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-[0.3em] text-slate-400 mb-0.5 sm:mb-1 lg:mb-2 truncate">
                      ACTIONS & GESTION · Paramètres
                    </p>
                    <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
                      Paramètres
                    </h1>
                    <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 line-clamp-2">
                      Gérez votre profil, votre sécurité et vos notifications
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
            <Tabs defaultValue="profile" className="w-full">
              <NeuCard className="p-2 sm:p-3 lg:p-4 mb-3 sm:mb-4">
                <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0 gap-1.5 sm:gap-2">
                  <TabsTrigger
                    value="profile"
                    className="neu-card-sm px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-[10px] sm:text-xs lg:text-sm xl:text-base"
                  >
                    <span className="truncate">Profil</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="neu-card-sm px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-[10px] sm:text-xs lg:text-sm xl:text-base"
                  >
                    <span className="truncate">Sécurité</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="neu-card-sm px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-[10px] sm:text-xs lg:text-sm xl:text-base"
                  >
                    <span className="truncate">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="data"
                    className="neu-card-sm px-2 sm:px-3 lg:px-4 xl:px-6 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-[10px] sm:text-xs lg:text-sm xl:text-base"
                  >
                    <span className="truncate">Données</span>
                  </TabsTrigger>
                </TabsList>
              </NeuCard>

              {/* Profile Tab */}
              <TabsContent value="profile" className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <NeuCard className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" aria-hidden="true" />
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Informations Personnelles</h2>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs sm:text-sm">
                        Nom complet
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Marie Laurent"
                        className="text-xs sm:text-sm"
                        aria-label="Nom complet"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs sm:text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4" aria-hidden="true" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="opacity-60 text-xs sm:text-sm"
                        aria-label="Email (non modifiable)"
                      />
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Non modifiable pour des raisons de sécurité
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs sm:text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+241 XX XX XX XX"
                        className="text-xs sm:text-sm"
                        aria-label="Numéro de téléphone"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="accountType" className="text-xs sm:text-sm">
                        Type de compte
                      </Label>
                      <Input
                        id="accountType"
                        type="text"
                        value={
                          profile?.account_type === "individual"
                            ? "Particulier"
                            : profile?.account_type || "Non défini"
                        }
                        disabled
                        className="opacity-60 text-xs sm:text-sm"
                        aria-label="Type de compte (non modifiable)"
                      />
                    </div>
                  </div>

                  <NeuButton
                    onClick={handleUpdateProfile}
                    disabled={saving || !isDirty}
                    variant="premium"
                    size="sm"
                    className="w-full sm:w-auto text-xs sm:text-sm"
                    aria-label={saving ? "Enregistrement en cours..." : "Enregistrer les modifications"}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">Enregistrer les modifications</span>
                      </>
                    )}
                  </NeuButton>
                </NeuCard>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <NeuCard className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-warning flex-shrink-0" aria-hidden="true" />
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Sécurité</h2>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Changer votre mot de passe</h3>
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="newPassword" className="text-xs sm:text-sm">
                            Nouveau mot de passe
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 6 caractères"
                            className="text-xs sm:text-sm"
                            disabled={saving}
                            aria-label="Nouveau mot de passe"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">
                            Confirmer le mot de passe
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Répétez le mot de passe"
                            className="text-xs sm:text-sm"
                            disabled={saving}
                            aria-label="Confirmer le mot de passe"
                          />
                          {!passwordValid && isPasswordDirty && (
                            <p className="text-[10px] sm:text-xs text-red-600">
                              Les mots de passe ne correspondent pas ou sont trop courts (min. 6 caractères)
                            </p>
                          )}
                        </div>
                      </div>

                      <NeuButton
                        onClick={handleChangePassword}
                        disabled={saving || !passwordValid || !isPasswordDirty}
                        variant="outline"
                        size="sm"
                        className="mt-3 sm:mt-4 w-full sm:w-auto text-xs sm:text-sm"
                        aria-label={saving ? "Mise à jour en cours..." : "Mettre à jour le mot de passe"}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" aria-hidden="true" />
                            <span className="truncate">Mise à jour...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
                            <span className="truncate">Mettre à jour le mot de passe</span>
                          </>
                        )}
                      </NeuButton>
                    </div>

                    <Separator className="my-4 sm:my-6" />

                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" aria-hidden="true" />
                        Sécurité du compte
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" aria-hidden="true" />
                          <span>Authentification sécurisée via Supabase</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" aria-hidden="true" />
                          <span>Données chiffrées en transit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" aria-hidden="true" />
                          <span>Protection des données personnelles</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </NeuCard>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <NeuCard className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-info flex-shrink-0" aria-hidden="true" />
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Notifications</h2>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="neu-inset rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:neu-raised transition-all">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1">Rappels fiscaux</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Alertes pour les échéances IRPP, TVA, CSS
                        </p>
                      </div>
                      <Switch
                        checked={notifications.taxReminders}
                        onCheckedChange={(checked) => handleNotificationChange("taxReminders", checked)}
                        aria-label="Activer/désactiver les rappels fiscaux"
                      />
                    </div>

                    <div className="neu-inset rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:neu-raised transition-all">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1">Mises à jour des déclarations</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Notifications sur le statut de vos déclarations
                        </p>
                      </div>
                      <Switch
                        checked={notifications.declarationUpdates}
                        onCheckedChange={(checked) => handleNotificationChange("declarationUpdates", checked)}
                        disabled
                        aria-label="Activer/désactiver les mises à jour des déclarations (bientôt disponible)"
                      />
                    </div>

                    <div className="neu-inset rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 hover:neu-raised transition-all opacity-60">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1">Conseils et astuces</h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Conseils fiscaux personnalisés et optimisations
                        </p>
                      </div>
                      <Switch
                        checked={notifications.tips}
                        onCheckedChange={(checked) => handleNotificationChange("tips", checked)}
                        disabled
                        aria-label="Activer/désactiver les conseils et astuces (bientôt disponible)"
                      />
                    </div>

                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                      <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                        💡 Plus de paramètres de notification seront disponibles bientôt
                      </p>
                    </div>
                  </div>
                </NeuCard>
              </TabsContent>

              {/* Data Tab */}
              <TabsContent value="data" className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <NeuCard className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" aria-hidden="true" />
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Gestion des données</h2>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-3">Mes espaces de travail</h3>
                      <div className="space-y-2">
                        {workspaces.length > 0 ? (
                          workspaces.map((ws) => (
                            <div
                              key={ws.id}
                              className="neu-inset rounded-xl p-3 sm:p-4 hover:neu-raised transition-all"
                            >
                              <div className="flex items-center justify-between gap-2 sm:gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-xs sm:text-sm text-slate-900 truncate">
                                    {ws.name}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                    {ws.scope === "personal" ? "Espace personnel" : "Espace entreprise"}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-[10px] sm:text-xs flex-shrink-0">
                                  {ws.slug}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 sm:py-8 neu-inset rounded-xl">
                            <Database className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/40 mx-auto mb-3" aria-hidden="true" />
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                              Aucun espace de travail créé
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              Créez un espace depuis le dashboard pour commencer.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="my-4 sm:my-6" />

                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-3">Export et suppression</h3>
                      <div className="space-y-2 sm:space-y-3">
                        <NeuButton
                          variant="outline"
                          size="sm"
                          className="w-full justify-start gap-2 text-xs sm:text-sm"
                          onClick={handleExportData}
                          disabled={exportingData}
                          aria-label={exportingData ? "Export en cours..." : "Exporter mes données"}
                        >
                          {exportingData ? (
                            <>
                              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin flex-shrink-0" aria-hidden="true" />
                              <span className="truncate">Export en cours...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                              <span className="truncate">Télécharger mes données (JSON)</span>
                            </>
                          )}
                        </NeuButton>
                        <NeuButton
                          variant="outline"
                          size="sm"
                          className="w-full justify-start gap-2 text-destructive hover:text-destructive text-xs sm:text-sm"
                          onClick={() => setShowDeleteConfirm(true)}
                          disabled={deletingAccount}
                          aria-label="Supprimer mon compte définitivement"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                          <span className="truncate">Supprimer mon compte définitivement</span>
                        </NeuButton>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3">
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
                className="w-full gap-2 border border-destructive text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
                variant="outline"
                size="sm"
                aria-label="Se déconnecter"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">Déconnexion</span>
              </NeuButton>
            </div>
          </main>

          {/* Delete Account Confirmation Dialog */}
          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
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
                      Supprimer votre compte
                    </AlertDialogTitle>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogDescription className="text-xs sm:text-sm">
                Cette action est définitive et irréversible. Toutes vos données seront supprimées :
                <ul className="list-disc list-inside mt-2 sm:mt-3 space-y-1 text-xs sm:text-sm">
                  <li>Votre profil et vos informations personnelles</li>
                  <li>Tous vos espaces de travail</li>
                  <li>Toutes vos factures et documents</li>
                  <li>Tous vos contrats et données fiscales</li>
                </ul>
                <p className="mt-2 sm:mt-3 font-semibold text-destructive">
                  Êtes-vous sûr de vouloir continuer ?
                </p>
              </AlertDialogDescription>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
                <AlertDialogCancel disabled={deletingAccount} className="w-full sm:w-auto text-xs sm:text-sm">
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs sm:text-sm"
                >
                  {deletingAccount ? (
                    <>
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin inline-block" aria-hidden="true" />
                      Suppression...
                    </>
                  ) : (
                    "Supprimer définitivement"
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

export default SettingsPage;
