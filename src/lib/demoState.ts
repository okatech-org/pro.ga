import type { Workspace } from "@/types/domain";

export const DEMO_MODE_KEY = "proga.demoMode";
export const DEMO_WORKSPACES_KEY = "proga.demoWorkspaces";

export type DemoModeState = {
  enabled: boolean;
  accountType?: string;
};

export type DemoWorkspaceState = {
  workspaces: Workspace[];
  sequence: number;
};

const defaultPersonalWorkspace = (ownerId: string): Workspace => ({
  id: "demo-personal",
  name: "Mon espace personnel",
  slug: "demo-personal",
  scope: "personal",
  type: "household",
  status: "active",
  ownerId,
  businessName: null,
  siret: null,
  activityType: null,
  hasEshop: false,
  eshopName: null,
  city: null,
  country: null,
  metadata: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const defaultBusinessWorkspace = (ownerId: string): Workspace => ({
  id: "demo-business-1",
  name: "Boutique Mode Gabon",
  slug: "boutique-mode",
  scope: "business",
  type: "commerce",
  status: "active",
  ownerId,
  businessName: "Boutique Mode Gabon SARL",
  siret: "BG-2024-0001",
  activityType: "retail",
  hasEshop: true,
  eshopName: "boutique-mode",
  city: "Libreville",
  country: "Gabon",
  metadata: { demo: true },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const defaultDemoWorkspaces = (ownerId: string): DemoWorkspaceState => ({
  workspaces: [defaultPersonalWorkspace(ownerId), defaultBusinessWorkspace(ownerId)],
  sequence: 1,
});

export const getDemoModeState = (): DemoModeState | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DEMO_MODE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DemoModeState;
    return parsed.enabled ? parsed : null;
  } catch {
    return null;
  }
};

export const clearDemoModeState = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_MODE_KEY);
  localStorage.removeItem(DEMO_WORKSPACES_KEY);
};

export const loadDemoWorkspaces = (ownerId: string): DemoWorkspaceState => {
  if (typeof window === "undefined") return defaultDemoWorkspaces(ownerId);
  const raw = localStorage.getItem(DEMO_WORKSPACES_KEY);
  if (!raw) {
    const initial = defaultDemoWorkspaces(ownerId);
    localStorage.setItem(DEMO_WORKSPACES_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(raw) as DemoWorkspaceState;
    if (!parsed.workspaces?.length) {
      const fallback = defaultDemoWorkspaces(ownerId);
      localStorage.setItem(DEMO_WORKSPACES_KEY, JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
  } catch {
    const fallback = defaultDemoWorkspaces(ownerId);
    localStorage.setItem(DEMO_WORKSPACES_KEY, JSON.stringify(fallback));
    return fallback;
  }
};

export const persistDemoWorkspaces = (state: DemoWorkspaceState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_WORKSPACES_KEY, JSON.stringify(state));
};


