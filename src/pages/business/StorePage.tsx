import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useStoreConfig } from "@/hooks/useStoreConfig";
import { useStoreOrders } from "@/hooks/useStoreOrders";
import { StoreSetupWizard } from "@/components/business/StoreSetupWizard";
import { StoreHomepageEditor } from "@/components/business/StoreHomepageEditor";
import { CatalogManager } from "@/components/business/CatalogManager";
import { OrdersManager } from "@/components/business/OrdersManager";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, ShoppingBag } from "lucide-react";

const StorePage = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useCurrentWorkspace();
  const { config, updateConfig, products, addProduct, updateProduct, deleteProduct, initTestData } =
    useStoreConfig(currentWorkspace?.id);
  const { orders, loading: ordersLoading, updateOrderStatus, deleteOrder, stats } =
    useStoreOrders(currentWorkspace?.id);

  const handleViewStore = useCallback(() => {
    if (config?.slug) {
      window.open(`/store/${config.slug}`, "_blank");
    }
  }, [config?.slug]);

  if (!currentWorkspace) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex-1 bg-background pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-6">
              <NeuCard className="p-6 max-w-md text-center">
                <h1 className="text-xl font-bold mb-2">Aucun espace sélectionné</h1>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez un espace entreprise pour accéder à la boutique.
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
          <SidebarInset className="flex-1 bg-background pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-6">
              <NeuCard className="p-6 max-w-md text-center space-y-4">
                <div>
                  <h1 className="text-xl font-bold mb-1">Module non disponible</h1>
                  <p className="text-sm text-muted-foreground">
                    La boutique est réservée aux espaces entreprise. Créez un espace entreprise pour y accéder.
                  </p>
                </div>
                <NeuButton onClick={() => navigate("/dashboard")}>Retour au dashboard</NeuButton>
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
        <SidebarInset className="flex-1 bg-background pl-4 lg:pl-6">
          <header className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
            <NeuCard className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 sm:mb-2 truncate">
                      Espace entreprise · Boutique
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 truncate">
                      Ma boutique en ligne
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                      Espace : {currentWorkspace.name}
                    </p>
                  </div>
                </div>

                {config?.published && (
                  <NeuButton
                    variant="premium"
                    onClick={handleViewStore}
                    className="flex-shrink-0 text-xs sm:text-sm"
                    aria-label="Ouvrir la boutique publique dans un nouvel onglet"
                  >
                    <ExternalLink className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">Voir la boutique</span>
                  </NeuButton>
                )}
              </div>
            </NeuCard>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 sm:pb-10 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
            <Tabs defaultValue="setup" className="w-full">
              <NeuCard className="p-3 sm:p-4 mb-4">
                <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto p-0 gap-2">
                  <TabsTrigger
                    value="setup"
                    className="neu-card-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-xs sm:text-sm lg:text-base"
                  >
                    Configuration
                  </TabsTrigger>
                  <TabsTrigger
                    value="homepage"
                    className="neu-card-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-xs sm:text-sm lg:text-base"
                  >
                    Page d'accueil
                  </TabsTrigger>
                  <TabsTrigger
                    value="catalog"
                    className="neu-card-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-xs sm:text-sm lg:text-base"
                  >
                    Catalogue
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="neu-card-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-xs sm:text-sm lg:text-base"
                  >
                    Commandes {orders.length > 0 && `(${orders.length})`}
                  </TabsTrigger>
                </TabsList>
              </NeuCard>

              <TabsContent value="setup" className="space-y-4 mt-4">
                {(!config || products.length === 0) && (
                  <NeuCard className="p-6 mb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">Données de test</h3>
                        <p className="text-sm text-muted-foreground">
                          Initialisez des données de test pour tester rapidement la boutique
                        </p>
                      </div>
                      <NeuButton variant="outline" onClick={initTestData}>
                        Initialiser les données de test
                      </NeuButton>
                    </div>
                  </NeuCard>
                )}
                <StoreSetupWizard
                  config={config}
                  onComplete={(data) => {
                    updateConfig(data);
                  }}
                />
              </TabsContent>

              <TabsContent value="homepage" className="space-y-4 mt-4">
                {config ? (
                  <StoreHomepageEditor
                    page={config.page}
                    onSave={(page) => {
                      updateConfig({ ...config, page });
                    }}
                  />
                ) : (
                  <NeuCard className="p-6 sm:p-8">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto shadow-lg">
                        <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2">Configuration requise</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground px-4">
                          Complétez d'abord la configuration de votre boutique.
                        </p>
                      </div>
                    </div>
                  </NeuCard>
                )}
              </TabsContent>

              <TabsContent value="catalog" className="space-y-4 mt-4">
                <CatalogManager
                  products={products}
                  onAdd={addProduct}
                  onUpdate={updateProduct}
                  onDelete={deleteProduct}
                />
              </TabsContent>

              <TabsContent value="orders" className="space-y-4 mt-4">
                <OrdersManager
                  orders={orders}
                  loading={ordersLoading}
                  onUpdateStatus={updateOrderStatus}
                  onDelete={deleteOrder}
                  stats={stats}
                />
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StorePage;

