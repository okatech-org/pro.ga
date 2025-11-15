import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { StoreConfig, StorePageContent, StoreProduct } from "@/types/domain";

const baseTheme: StoreConfig["theme"] = {
  primaryColor: "#6a5af9",
  accentColor: "#f97316",
  background: "light",
  typography: "sans",
};

const basePage: StorePageContent = {
  heroTitle: "Votre boutique PRO.GA",
  heroSubtitle: "Présentez vos offres, encaissez et gérez vos commandes en quelques clics.",
  heroImage: null,
  highlights: [
    { title: "Paiements sécurisés", description: "Support mobile money et cartes Visa." },
    { title: "Stocks synchronisés", description: "Connecté à vos ventes POS." },
    { title: "Livraison locale", description: "Tarification dynamique par zone." },
  ],
  trustBadges: ["Paiement sécurisé", "Support 7/7", "Collecte TVA prête"],
};

const makeDefaultConfig = (workspaceId: string): StoreConfig => ({
  id: workspaceId,
  workspaceId,
  slug: `eshop-${workspaceId.slice(0, 6)}`,
  name: "Nouvelle boutique",
  city: null,
  address: null,
  description: "Configurez votre vitrine digitale et partagez votre lien {slug}.pro.ga",
  published: false,
  theme: baseTheme,
  page: basePage,
  metadata: {},
});

const storageKey = (workspaceId: string) => `proga.store.${workspaceId}`;

type StoreState = {
  config: StoreConfig;
  products: StoreProduct[];
};

const loadState = (workspaceId: string): StoreState => {
  const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey(workspaceId)) : null;
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      /* ignore */
    }
  }
  return { config: makeDefaultConfig(workspaceId), products: [] };
};

const persistState = (workspaceId: string, state: StoreState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(workspaceId), JSON.stringify(state));
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const useStoreConfig = (workspaceId?: string | null) => {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncWithWorkspace = useCallback(
    async (nextConfig: StoreConfig) => {
      if (!workspaceId) return;
      await supabase
        .from("workspaces")
        .update({
          has_eshop: nextConfig.published,
          eshop_name: nextConfig.slug,
          activity_type: nextConfig.metadata?.category || null,
          // city or address columns may not exist in schema; guard is handled at db level.
        })
        .eq("id", workspaceId);
    },
    [workspaceId],
  );

  const load = useCallback(() => {
    if (!workspaceId) {
      setConfig(null);
      setProducts([]);
      return;
    }

    const { config: storedConfig, products: storedProducts } = loadState(workspaceId);
    setConfig(storedConfig);
    setProducts(storedProducts);
  }, [workspaceId]);

  useEffect(() => {
    load();
  }, [load]);

  const persist = useCallback(
    (next: StoreState) => {
      if (!workspaceId) return;
      persistState(workspaceId, next);
    },
    [workspaceId],
  );

  const updateConfig = useCallback(
    async (partial: Partial<StoreConfig>) => {
      if (!workspaceId || !config) return;
      setLoading(true);
      setError(null);

      const nextConfig: StoreConfig = {
        ...config,
        ...partial,
        slug: partial.slug ? slugify(partial.slug) : config.slug,
        page: partial.page || config.page,
        theme: partial.theme || config.theme,
        updatedAt: new Date().toISOString(),
      };

      const nextState = { config: nextConfig, products };
      persist(nextState);
      setConfig(nextConfig);
      try {
        await syncWithWorkspace(nextConfig);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
      return nextConfig;
    },
    [workspaceId, config, products, persist, syncWithWorkspace],
  );

  const updatePageContent = useCallback(
    async (page: StorePageContent) => updateConfig({ page }),
    [updateConfig],
  );

  const addProduct = useCallback(
    (input: Omit<StoreProduct, "id" | "workspaceId" | "createdAt" | "updatedAt" | "status" | "featured"> & Partial<Pick<StoreProduct, "status" | "featured">>) => {
      if (!workspaceId || !config) throw new Error("workspaceId requis");
      const product: StoreProduct = {
        id: generateId(),
        workspaceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: input.status ?? "active",
        featured: input.featured ?? false,
        ...input,
      };
      const nextProducts = [...products, product];
      setProducts(nextProducts);
      persist({ config, products: nextProducts });
      return product;
    },
    [workspaceId, config, products, persist],
  );

  const updateProduct = useCallback(
    (productId: string, partial: Partial<StoreProduct>) => {
      if (!config) return;
      const nextProducts = products.map((product) =>
        product.id === productId
          ? { ...product, ...partial, updatedAt: new Date().toISOString() }
          : product,
      );
      setProducts(nextProducts);
      if (workspaceId) persist({ config, products: nextProducts });
    },
    [config, products, persist, workspaceId],
  );

  const deleteProduct = useCallback(
    (productId: string) => {
      if (!config) return;
      const nextProducts = products.filter((product) => product.id !== productId);
      setProducts(nextProducts);
      if (workspaceId) persist({ config, products: nextProducts });
    },
    [config, products, persist, workspaceId],
  );

  const toggleAvailability = useCallback(
    (productId: string) => {
      if (!config) return;
      const product = products.find((item) => item.id === productId);
      if (!product) return;
      const nextStatus = product.status === "active" ? "archived" : "active";
      updateProduct(productId, { status: nextStatus });
    },
    [config, updateProduct, products],
  );

  const refresh = useCallback(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({
      config,
      products,
      loading,
      error,
      updateConfig,
      updatePageContent,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleAvailability,
      refresh,
    }),
    [
      config,
      products,
      loading,
      error,
      updateConfig,
      updatePageContent,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleAvailability,
      refresh,
    ],
  );

  return value;
};

