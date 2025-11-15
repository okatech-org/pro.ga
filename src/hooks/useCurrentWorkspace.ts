import { useContext } from "react";
import { WorkspaceContext } from "@/contexts/WorkspaceContext";

export const useCurrentWorkspace = () => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("WorkspaceContext absent : entourez l'app avec WorkspaceProvider");
  }

  return context;
};

