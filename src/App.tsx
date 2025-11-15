import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import AdminGaDemo from "./pages/AdminGaDemo";
import AdminGaLanding from "./pages/AdminGaLanding";
import NeuDemo from "./pages/NeuDemo";
import NotFound from "./pages/NotFound";
import IrppPage from "./pages/personal/IrppPage";
import HouseholdEmploymentPage from "./pages/personal/HouseholdEmploymentPage";
import StorePage from "./pages/business/StorePage";
import PosPage from "./pages/business/PosPage";
import InvoicesPage from "./pages/business/InvoicesPage";
import AccountingPage from "./pages/business/AccountingPage";
import TaxesPage from "./pages/TaxesPage";
import AiCopilotPage from "./pages/AiCopilotPage";
import SettingsPage from "./pages/SettingsPage";
import StorePublicPage from "./pages/store/StorePublicPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WorkspaceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:section" element={<Dashboard />} />
            
            {/* Espace Personnel */}
            <Route path="/dashboard/perso/irpp" element={<IrppPage />} />
            <Route path="/dashboard/perso/emploi" element={<HouseholdEmploymentPage />} />
            
            {/* Espace Entreprise */}
            <Route path="/dashboard/business/boutique" element={<StorePage />} />
            <Route path="/dashboard/business/pos" element={<PosPage />} />
            <Route path="/dashboard/business/factures" element={<InvoicesPage />} />
            <Route path="/dashboard/business/compta" element={<AccountingPage />} />
            
            {/* Modules transversaux */}
            <Route path="/dashboard/taxes" element={<TaxesPage />} />
            <Route path="/dashboard/ia" element={<AiCopilotPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            
            {/* Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Demo & Admin */}
            <Route path="/demo" element={<Demo />} />
            <Route path="/admin-ga-demo" element={<AdminGaDemo />} />
            <Route path="/admin-ga-landing" element={<AdminGaLanding />} />
            <Route path="/neu-demo" element={<NeuDemo />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            {/* Boutique publique - doit être avant le catch-all */}
            <Route path="/store/:slug" element={<StorePublicPage />} />
            <Route path="/:slug" element={<StorePublicPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WorkspaceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
