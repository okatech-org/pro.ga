import { useState } from "react";
import { User, Building2, Store, Plus, ChevronDown, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { cn } from "@/lib/utils";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";

export const WorkspaceSwitcher = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {
    currentWorkspace,
    personalWorkspace,
    businessWorkspaces,
    switchToPersonal,
    switchToBusiness,
    isPersonalSpace,
  } = useWorkspaces();

  if (!currentWorkspace) return null;

  const handleSwitch = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  return (
    <>
      <NeuCard
        className="flex items-center gap-3 rounded-2xl px-5 py-3 min-w-[260px] cursor-pointer hover:shadow-[var(--shadow-neu-button-hover)] transition-all"
        onClick={() => setOpen(true)}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0",
            isPersonalSpace 
              ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white" 
              : "bg-gradient-to-br from-green-400 to-green-600 text-white"
          )}
        >
          {isPersonalSpace ? <User className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 mb-0.5 truncate">
            {isPersonalSpace ? "Mon espace" : "Espace entreprise"}
          </p>
          <p className="text-sm font-semibold text-slate-900 truncate">{currentWorkspace.name}</p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
      </NeuCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-4 flex-1 mb-2">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                isPersonalSpace 
                  ? "bg-gradient-to-br from-blue-400 to-blue-600" 
                  : "bg-gradient-to-br from-green-400 to-green-600"
              }`}>
                {isPersonalSpace ? (
                  <User className="w-8 h-8 text-white" />
                ) : (
                  <Building2 className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">
                  {isPersonalSpace ? "Mon espace" : "Espace entreprise"}
                </p>
                <DialogTitle>Changer d'espace</DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-2">
            {personalWorkspace && (
              <button
                onClick={() => handleSwitch(switchToPersonal)}
                className={cn(
                  "neu-card w-full flex items-center justify-between px-4 py-4 rounded-2xl cursor-pointer transition-all",
                  isPersonalSpace 
                    ? "bg-white shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)]" 
                    : "hover:shadow-[var(--shadow-neu-button-hover)]"
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">Espace Personnel</p>
                    <p className="text-xs text-slate-500 truncate">Foyer & IRPP</p>
                  </div>
                </div>
                {isPersonalSpace && <Check className="w-5 h-5 text-primary flex-shrink-0" />}
              </button>
            )}

            {businessWorkspaces.length > 0 && (
              <div className="space-y-2 mt-4">
                {businessWorkspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => handleSwitch(() => switchToBusiness(workspace.id))}
                    className={cn(
                      "neu-card w-full flex items-center justify-between px-4 py-4 rounded-2xl cursor-pointer transition-all",
                      workspace.id === currentWorkspace?.id
                        ? "bg-white shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)]"
                        : "hover:shadow-[var(--shadow-neu-button-hover)]"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{workspace.name}</p>
                        {workspace.slugProGa && (
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                            <Store className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{workspace.slugProGa}.pro.ga</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {workspace.id === currentWorkspace?.id && (
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="pt-4 mt-4 border-t border-border">
              <NeuButton
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setOpen(false);
                  navigate("/onboarding/business");
                }}
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une entreprise</span>
              </NeuButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};


