import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { StoreConfig, StoreProduct } from "@/types/domain";

export const useStorePublic = (slug: string) => {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStore = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch store config
      const { data: configData, error: configError } = await supabase
        .from("store_configs")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (configError) {
        setError("Boutique introuvable");
        setLoading(false);
        return;
      }

      setConfig({
        id: configData.id,
        workspaceId: configData.workspace_id,
        slug: configData.slug,
        name: configData.name,
        city: configData.city,
        address: configData.address,
        description: configData.description,
        published: configData.published,
        theme: (configData.theme as unknown) as StoreConfig["theme"],
        page: (configData.page as unknown) as StoreConfig["page"],
        metadata: configData.metadata as Record<string, unknown>,
        createdAt: configData.created_at,
        updatedAt: configData.updated_at,
      });

      // Fetch active products
      const { data: productsData, error: productsError } = await supabase
        .from("store_products")
        .select("*")
        .eq("workspace_id", configData.workspace_id)
        .eq("status", "active")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      setProducts(
        productsData.map((p) => ({
          id: p.id,
          workspaceId: p.workspace_id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          currency: p.currency,
          sku: p.sku,
          stock: p.stock,
          category: p.category,
          imageUrl: p.image_url,
          status: p.status as StoreProduct["status"],
          featured: p.featured,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
        }))
      );
    } catch (err) {
      setError("Erreur lors du chargement de la boutique");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  return { config, products, loading, error, refresh: fetchStore };
};
