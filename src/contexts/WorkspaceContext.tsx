import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Workspace } from "@/types/domain";
import { useWorkspaceData, type CreateWorkspaceInput } from "@/hooks/useWorkspaceData";
import { getDemoModeState, type DemoModeState } from "@/lib/demoState";

type WorkspaceContextValue = {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
  selectWorkspace: (workspaceId: string) => void;
  createWorkspace: (input: CreateWorkspaceInput) => Promise<Workspace>;
  refresh: () => Promise<void>;
  userId: string | null;
  sessionReady: boolean;
};

export const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "proga.currentWorkspaceId";

const getStoredWorkspaceId = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOCAL_STORAGE_KEY);
};

const persistWorkspaceId = (value: string | null) => {
  if (typeof window === "undefined") return;
  if (value) {
    localStorage.setItem(LOCAL_STORAGE_KEY, value);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(getStoredWorkspaceId);
  const [demoState, setDemoState] = useState<DemoModeState | null>(() => getDemoModeState());

  const isDemoMode = Boolean(demoState?.enabled);

  const {
    workspaces,
    loading: workspacesLoading,
    error,
    refresh,
    createWorkspace,
  } = useWorkspaceData(userId, { demoMode: isDemoMode, demoOwnerId: isDemoMode ? "demo-user" : userId });

  useEffect(() => {
    const demo = getDemoModeState();
    if (demo?.enabled) {
      setDemoState(demo);
      setUserId("demo-user");
      setSessionReady(true);
      return;
    }

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user?.id ?? null);
      setSessionReady(true);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setSessionReady(true);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!workspaces.length) {
      setCurrentWorkspaceId(null);
      persistWorkspaceId(null);
      return;
    }

    if (currentWorkspaceId && workspaces.some((ws) => ws.id === currentWorkspaceId)) {
      return;
    }

    const storedId = getStoredWorkspaceId();
    const fallbackId =
      storedId && workspaces.some((ws) => ws.id === storedId) ? storedId : workspaces[0].id;

    setCurrentWorkspaceId(fallbackId);
    persistWorkspaceId(fallbackId);
  }, [workspaces, currentWorkspaceId]);

  const selectWorkspace = useCallback((workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    persistWorkspaceId(workspaceId);
  }, []);

  const currentWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === currentWorkspaceId) || null,
    [workspaces, currentWorkspaceId],
  );

  const handleCreateWorkspace = useCallback(
    async (input: CreateWorkspaceInput) => {
      const workspace = await createWorkspace(input);
      selectWorkspace(workspace.id);
      return workspace;
    },
    [createWorkspace, selectWorkspace],
  );

  const value = useMemo(
    () => ({
      workspaces,
      currentWorkspace,
      loading: workspacesLoading || !sessionReady,
      error,
      selectWorkspace,
      createWorkspace: handleCreateWorkspace,
      refresh,
      userId,
      sessionReady,
    }),
    [
      workspaces,
      currentWorkspace,
      workspacesLoading,
      sessionReady,
      error,
      selectWorkspace,
      handleCreateWorkspace,
      refresh,
      userId,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

