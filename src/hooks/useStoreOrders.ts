import { useCallback, useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { StoreOrder, OrderStatus } from "@/types/domain";
import { toast } from "sonner";

const storageKey = (workspaceId: string) => `proga.store.orders.${workspaceId}`;

const loadOrders = (workspaceId: string): StoreOrder[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(storageKey(workspaceId));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const persistOrders = (workspaceId: string, orders: StoreOrder[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(workspaceId), JSON.stringify(orders));
};

export const useStoreOrders = (workspaceId?: string | null) => {
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!workspaceId) {
      setOrders([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: supabaseOrders, error: supabaseError } = await supabase
        .from("store_orders")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.warn("Error loading orders from Supabase:", supabaseError);
      }

      const localOrders = loadOrders(workspaceId);
      const allOrders: StoreOrder[] = [
        ...(supabaseOrders || []).map((o): StoreOrder => ({
          id: o.id,
          workspaceId: o.workspace_id,
          storeSlug: o.store_slug,
          customerName: o.customer_name,
          customerEmail: o.customer_email || null,
          customerPhone: o.customer_phone || null,
          items: o.items as Array<{ productId: string; name: string; quantity: number; unitPrice: number }>,
          total: Number(o.total),
          currency: o.currency || "XOF",
          status: (o.status === "pending" || o.status === "paid" || o.status === "cancelled" ? o.status : "pending") as OrderStatus,
          createdAt: o.created_at,
          updatedAt: o.updated_at || o.created_at,
        })),
        ...localOrders,
      ];

      const uniqueOrders = Array.from(
        new Map(allOrders.map((order) => [order.id, order])).values()
      );

      setOrders(uniqueOrders);
    } catch (err) {
      setError((err as Error).message);
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateOrderStatus = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      if (!workspaceId) return;

      setLoading(true);
      try {
        const { error: supabaseError } = await supabase
          .from("store_orders")
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .eq("workspace_id", workspaceId);

        if (supabaseError) {
          console.warn("Error updating order in Supabase:", supabaseError);
        }

        const localOrders = loadOrders(workspaceId);
        const updatedOrders = localOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
            : order
        );
        persistOrders(workspaceId, updatedOrders);

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );

        toast.success(`Commande ${newStatus === "cancelled" ? "annulée" : "mise à jour"}`);
      } catch (err) {
        toast.error("Erreur lors de la mise à jour de la commande");
        console.error("Error updating order:", err);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId]
  );

  const deleteOrder = useCallback(
    async (orderId: string) => {
      if (!workspaceId) return;

      if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
        return;
      }

      setLoading(true);
      try {
        const { error: supabaseError } = await supabase
          .from("store_orders")
          .delete()
          .eq("id", orderId)
          .eq("workspace_id", workspaceId);

        if (supabaseError) {
          console.warn("Error deleting order from Supabase:", supabaseError);
        }

        const localOrders = loadOrders(workspaceId);
        const updatedOrders = localOrders.filter((order) => order.id !== orderId);
        persistOrders(workspaceId, updatedOrders);

        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        toast.success("Commande supprimée");
      } catch (err) {
        toast.error("Erreur lors de la suppression de la commande");
        console.error("Error deleting order:", err);
      } finally {
        setLoading(false);
      }
    },
    [workspaceId]
  );

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const confirmed = orders.filter((o) => o.status === "confirmed").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    const shipped = orders.filter((o) => o.status === "shipped").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    return {
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
    };
  }, [orders]);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    deleteOrder,
    refresh: load,
    stats,
  };
};
