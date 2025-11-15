import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Workspace, WorkspaceScope, WorkspaceType } from "@/types/domain";
import { loadDemoWorkspaces, persistDemoWorkspaces } from "@/lib/demoState";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapWorkspaceRow = (row: Tables<"workspaces">): Workspace => ({
  id: row.id,
  name: row.name,
  slug: row.eshop_name || slugify(row.name),
  scope: row.type === "personal" ? "personal" : "business",
  type: (row.type as WorkspaceType) || ("other" as WorkspaceType),
  status: "active",
  ownerId: row.owner_id,
  businessName: row.business_name,
  siret: row.siret,
  activityType: row.activity_type,
  hasEshop: Boolean(row.has_eshop),
  eshopName: row.eshop_name,
  city: null,
  country: null,
  metadata: undefined,
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString(),
});

export type CreateWorkspaceInput = {
  name: string;
  type?: Workspace["type"];
  scope?: WorkspaceScope;
  businessName?: string | null;
  hasEshop?: boolean;
  eshopName?: string | null;
  siret?: string | null;
  activityType?: string | null;
};

type WorkspaceDataOptions = {
  demoMode?: boolean;
  demoOwnerId?: string | null;
};

export const useWorkspaceData = (userId?: string | null, options?: WorkspaceDataOptions) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const demoMode = options?.demoMode ?? false;
  const demoOwnerId = options?.demoOwnerId ?? "demo-user";

  const fetchWorkspaces = useCallback(async () => {
    if (demoMode) {
      setLoading(true);
      const demoState = loadDemoWorkspaces(demoOwnerId);
      setWorkspaces(demoState.workspaces);
      setError(null);
      setLoading(false);
      return;
    }

    if (!userId) {
      setWorkspaces([]);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(queryError.message);
      setWorkspaces([]);
    } else if (data) {
      setWorkspaces(data.map(mapWorkspaceRow));
    }

    setLoading(false);
  }, [userId, demoMode, demoOwnerId]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const createWorkspace = useCallback(
    async (input: CreateWorkspaceInput) => {
      if (demoMode) {
        const state = loadDemoWorkspaces(demoOwnerId);
        const id = `demo-workspace-${state.sequence + 1}`;
        const workspace: Workspace = {
          id,
          name: input.name,
          slug: input.eshopName || slugify(input.name),
          scope: input.scope === "personal" ? "personal" : "business",
          type: (input.type || "services") as WorkspaceType,
          status: "active",
          ownerId: demoOwnerId,
          businessName: input.businessName ?? null,
          siret: input.siret ?? null,
          activityType: input.activityType ?? null,
          hasEshop: input.hasEshop ?? false,
          eshopName: input.eshopName || null,
          city: null,
          country: null,
          metadata: { demo: true },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const nextState = {
          workspaces: [...state.workspaces, workspace],
          sequence: state.sequence + 1,
        };
        persistDemoWorkspaces(nextState);
        setWorkspaces(nextState.workspaces);
        return workspace;
      }

      if (!userId) {
        throw new Error("Aucun utilisateur connecté");
      }

      const payload = {
        name: input.name,
        owner_id: userId,
        type: input.type || (input.scope === "personal" ? "personal" : "services"),
        business_name: input.businessName ?? null,
        has_eshop: input.hasEshop ?? false,
        eshop_name: input.eshopName || slugify(input.name),
        siret: input.siret ?? null,
        activity_type: input.activityType ?? null,
      };

      const { data, error: insertError } = await supabase
        .from("workspaces")
        .insert(payload)
        .select()
        .single();

      if (insertError || !data) {
        throw new Error(insertError?.message || "Création de workspace impossible");
      }

      const workspace = mapWorkspaceRow(data);
      setWorkspaces((prev) => [...prev, workspace]);
      return workspace;
    },
    [userId, demoMode, demoOwnerId],
  );

  const refresh = useCallback(async () => {
    await fetchWorkspaces();
  }, [fetchWorkspaces]);

  return useMemo(
    () => ({
      workspaces,
      loading,
      error,
      refresh,
      createWorkspace,
    }),
    [workspaces, loading, error, refresh, createWorkspace],
  );
};

