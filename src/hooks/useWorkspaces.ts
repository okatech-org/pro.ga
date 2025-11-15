import type { Workspace, Person } from "@/types/domain";
import { useCurrentWorkspace } from "./useCurrentWorkspace";

type PersonalWorkspace = Workspace & { scope: "personal" };
type BusinessWorkspace = Workspace & { scope: "business" };

const MOCK_PERSON: Person = {
  id: "person-1",
  userId: "user-1",
  fullName: "Marie Dupont",
  email: "marie.dupont@pro.ga",
  firstName: "Marie",
  lastName: "Dupont",
  phone: "+241 06 00 00 00",
  accountType: "individual",
  locale: "fr-FR",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useWorkspaces = () => {
  const context = useCurrentWorkspace();
  const { workspaces, currentWorkspace, selectWorkspace, loading } = context;

  const personalWorkspace = workspaces.find(
    (workspace) => workspace.scope === "personal",
  ) as PersonalWorkspace | undefined;

  const businessWorkspaces = workspaces.filter(
    (workspace) => workspace.scope === "business",
  ) as BusinessWorkspace[];

  const isPersonalSpace = currentWorkspace?.scope === "personal";
  const isBusinessSpace = currentWorkspace?.scope === "business";

  const switchToPersonal = () => {
    if (personalWorkspace) {
      selectWorkspace(personalWorkspace.id);
    }
  };

  const switchToBusiness = (id: string) => {
    const target = businessWorkspaces.find((workspace) => workspace.id === id);
    if (target) {
      selectWorkspace(target.id);
    }
  };

  const getCurrentBusinessWorkspace = (): BusinessWorkspace | null => {
    if (currentWorkspace?.scope === "business") {
      return currentWorkspace as BusinessWorkspace;
    }
    return null;
  };

  return {
    ...context,
    person: MOCK_PERSON,
    personalWorkspace,
    businessWorkspaces,
    isPersonalSpace,
    isBusinessSpace,
    switchToPersonal,
    switchToBusiness,
    getCurrentBusinessWorkspace,
    isLoading: loading,
    error: context.error,
  };
};

