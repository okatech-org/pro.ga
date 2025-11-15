import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { StorePublicPage as StorePublicPageComponent } from "@/components/store/StorePublicPage";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { AlertCircle, Loader2 } from "lucide-react";
import type { StoreConfig, StoreProduct } from "@/types/domain";
import { toast } from "sonner";
import { initTestStoreData } from "@/lib/storeTestData";

const loadStoreBySlug = async (slug: string): Promise<{ config: StoreConfig | null; products: StoreProduct[] }> => {
  try {
    const { data: workspaces, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id")
      .eq("eshop_name", slug)
      .eq("has_eshop", true)
      .maybeSingle();

    if (workspaceError || !workspaces) {
      const allStorageKeys = Object.keys(localStorage).filter((key) => key.startsWith("proga.store."));
      for (const key of allStorageKeys) {
        try {
          const state = JSON.parse(localStorage.getItem(key) || "{}");
          if (state.config && state.config.slug === slug && state.config.published) {
            const workspaceId = key.replace("proga.store.", "");
            const { data: products } = await supabase
              .from("store_products")
              .select("*")
              .eq("workspace_id", workspaceId)
              .eq("is_active", true)
              .order("created_at", { ascending: false });

            return {
              config: state.config as StoreConfig,
              products: (products || []).map((p: any) => ({
                id: p.id,
                workspaceId: p.workspace_id,
                name: p.name,
                description: p.description || null,
                price: Number(p.price),
                currency: p.currency || "XOF",
                sku: p.sku || null,
                stock: p.stock_quantity != null ? Number(p.stock_quantity) : null,
                category: p.category || null,
                imageUrl: p.image_url || null,
                status: (p.is_active ? "active" : "archived") as StoreProduct["status"],
                featured: (p.metadata as any)?.featured || false,
                createdAt: p.created_at,
                updatedAt: p.updated_at,
              })) as StoreProduct[],
            };
          }
        } catch {
          continue;
        }
      }
      
      if (slug === "boutique-mode") {
        const testWorkspaceId = "demo-business-1";
        try {
          const { config: testConfig, products: testProducts } = initTestStoreData(testWorkspaceId);
          if (testConfig.slug === slug && testConfig.published) {
            const { data: products } = await supabase
              .from("store_products")
              .select("*")
              .eq("workspace_id", testWorkspaceId)
              .eq("is_active", true)
              .order("created_at", { ascending: false });

            const allProducts = [
              ...testProducts,
              ...((products || []).map((p: any) => ({
                id: p.id,
                workspaceId: p.workspace_id,
                name: p.name,
                description: p.description || null,
                price: Number(p.price),
                currency: p.currency || "XOF",
                sku: p.sku || null,
                stock: p.stock_quantity != null ? Number(p.stock_quantity) : null,
                category: p.category || null,
                imageUrl: p.image_url || null,
                status: (p.is_active ? "active" : "archived") as StoreProduct["status"],
                featured: (p.metadata as any)?.featured || false,
                createdAt: p.created_at,
                updatedAt: p.updated_at,
              })) as StoreProduct[]),
            ];

            const uniqueProducts = Array.from(
              new Map(allProducts.map((p) => [p.id, p])).values()
            );

            return {
              config: testConfig,
              products: uniqueProducts,
            };
          }
        } catch (err) {
          console.error("Error initializing test store data:", err);
        }
      }
      
      return { config: null, products: [] };
    }

    const workspaceId = workspaces.id;
    const storageKey = `proga.store.${workspaceId}`;
    const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    
    if (!raw) {
      return { config: null, products: [] };
    }

    try {
      const state = JSON.parse(raw);
      if (!state.config || state.config.slug !== slug || !state.config.published) {
        return { config: null, products: [] };
      }

      const { data: products, error: productsError } = await supabase
        .from("store_products")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (productsError) {
        console.error("Error loading products:", productsError);
      }

      return {
        config: state.config as StoreConfig,
        products: (products || []).map((p: any) => ({
          id: p.id,
          workspaceId: p.workspace_id,
          name: p.name,
          description: p.description || null,
          price: Number(p.price),
          currency: p.currency || "XOF",
          sku: p.sku || null,
          stock: p.stock_quantity != null ? Number(p.stock_quantity) : null,
          category: p.category || null,
          imageUrl: p.image_url || null,
          status: (p.is_active ? "active" : "archived") as StoreProduct["status"],
          featured: (p.metadata as any)?.featured || false,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        })) as StoreProduct[],
      };
    } catch (parseError) {
      console.error("Error parsing store config:", parseError);
      return { config: null, products: [] };
    }
  } catch (error) {
    console.error("Error loading store:", error);
    return { config: null, products: [] };
  }
};

const StorePublicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      if (!slug) {
        setError("Slug de boutique manquant");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { config: storeConfig, products: storeProducts } = await loadStoreBySlug(slug);

        if (!storeConfig) {
          setError("Boutique non trouvée ou non publiée");
          setLoading(false);
          return;
        }

        setConfig(storeConfig);
        setProducts(storeProducts);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur lors du chargement de la boutique";
        setError(errorMsg);
        console.error("Error loading store:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [slug]);

  const handleOrderSubmit = useCallback(
    async (payload: {
      customerName: string;
      customerEmail: string;
      items: { productId: string; name: string; quantity: number; unitPrice: number }[];
      total: number;
    }) => {
      if (!config || !slug) {
        toast.error("Configuration de boutique manquante");
        return;
      }

      setSubmittingOrder(true);

      try {
        const { data: workspace } = await supabase
          .from("workspaces")
          .select("id")
          .eq("eshop_name", slug)
          .single();

        if (!workspace) {
          throw new Error("Espace de travail non trouvé");
        }

        const order = {
          workspace_id: workspace.id,
          customer_name: payload.customerName,
          customer_email: payload.customerEmail || null,
          customer_phone: null,
          customer_address: null,
          items: payload.items,
          subtotal: payload.total,
          tax_amount: 0,
          total: payload.total,
          currency: products[0]?.currency || "XOF",
          status: "pending" as const,
          metadata: { storeSlug: slug } as Record<string, unknown>,
        };

        const { error: orderError } = await supabase.from("store_orders").insert(order);

        if (orderError) {
          console.warn("Error saving order to Supabase, saving to localStorage:", orderError);
          const storageKey = `proga.store.orders.${workspace.id}`;
          const existingOrders = JSON.parse(localStorage.getItem(storageKey) || "[]");
          existingOrders.push({
            id: crypto.randomUUID(),
            ...order,
            storeSlug: slug,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          localStorage.setItem(storageKey, JSON.stringify(existingOrders));
        }

        toast.success("Commande enregistrée avec succès ! Vous serez contacté prochainement.");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur lors de l'enregistrement de la commande";
        toast.error(errorMsg);
        console.error("Error submitting order:", err);
      } finally {
        setSubmittingOrder(false);
      }
    },
    [config, slug, products],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <NeuCard className="p-8 max-w-md text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" aria-label="Chargement en cours" />
          <h2 className="text-xl font-bold mb-2">Chargement de la boutique...</h2>
          <p className="text-sm text-muted-foreground">Veuillez patienter</p>
        </NeuCard>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <NeuCard className="p-8 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Boutique non disponible</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {error || "Cette boutique n'existe pas ou n'est pas encore publiée."}
            </p>
          </div>
          <NeuButton variant="outline" onClick={() => navigate("/")} aria-label="Retour à l'accueil">
            Retour à l'accueil
          </NeuButton>
        </NeuCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StorePublicPageComponent
        config={config}
        products={products}
        onOrderSubmit={handleOrderSubmit}
        submitting={submittingOrder}
      />
    </div>
  );
};

export default StorePublicPage;

