import { useState, useCallback } from "react";
import { useCurrentWorkspace } from "@/hooks/useCurrentWorkspace";
import { useAiCopilot } from "@/hooks/useAiCopilot";
import { useDocuments } from "@/hooks/useDocuments";
import { AiDocUpload } from "@/components/ai/AiDocUpload";
import { AiExtractionResult } from "@/components/ai/AiExtractionResult";
import { AiQuestionnaire } from "@/components/ai/AiQuestionnaire";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard } from "@/components/ui/neu-card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, RotateCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const MAX_FILES_COUNT = 20;

const AiCopilotPage = () => {
  const { currentWorkspace } = useCurrentWorkspace();
  const { uploadDocument: saveDocumentRecord, removeDocument: removeDocumentRecord } = useDocuments(currentWorkspace?.id);
  const {
    documents,
    messages,
    currentJob,
    loading,
    uploadDocuments,
    removeDocument,
    startExtraction,
    askQuestion,
    reset,
  } = useAiCopilot(currentWorkspace?.id);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const validateFiles = useCallback((files: FileList | File[]): { valid: File[]; errors: string[] } => {
    const fileArray = Array.from(files);
    const valid: File[] = [];
    const errors: string[] = [];

    if (documents.length + fileArray.length > MAX_FILES_COUNT) {
      errors.push(`Vous ne pouvez pas dépasser ${MAX_FILES_COUNT} documents au total`);
      return { valid, errors };
    }

    fileArray.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} : taille maximale dépassée (10 Mo)`);
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name} : type de fichier non supporté (PDF ou images uniquement)`);
        return;
      }
      const isDuplicate = documents.some((doc) => doc.name === file.name && doc.size === file.size);
      if (isDuplicate) {
        errors.push(`${file.name} : ce document est déjà présent`);
        return;
      }
      valid.push(file);
    });

    return { valid, errors };
  }, [documents]);

  const handleExtract = useCallback(async () => {
    if (!currentWorkspace) return;
    
    setExtractionError(null);

    if (documents.length === 0) {
      const errorMsg = "Ajoutez au moins un document avant de lancer l'extraction";
      setExtractionError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      const job = await startExtraction();
      if (job.status === "completed") {
        toast.success("Extraction terminée avec succès !");
        setExtractionError(null);
      } else if (job.status === "failed") {
        const errorMsg = "L'extraction a échoué. Veuillez réessayer.";
        setExtractionError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur lors de l'extraction";
      setExtractionError(errorMsg);
      toast.error(errorMsg);
      console.error("Error during extraction:", error);
    }
  }, [currentWorkspace, documents.length, startExtraction]);

  const handleUploadDocuments = useCallback(async (files: FileList | File[]) => {
    if (!currentWorkspace) return;
    
    setUploadError(null);

    try {
      const { valid, errors } = validateFiles(files);

      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
        if (valid.length === 0) {
          setUploadError(errors.join(", "));
          return;
        }
      }

      if (valid.length > 0) {
        await uploadDocuments(valid);
        await saveDocumentRecord(valid);
        toast.success(`${valid.length} document(s) ajouté(s) avec succès`);
        setUploadError(null);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur lors du téléversement des documents";
      setUploadError(errorMsg);
      toast.error(errorMsg);
      console.error("Error uploading documents:", error);
    }
  }, [currentWorkspace, validateFiles, uploadDocuments, saveDocumentRecord]);

  const handleRemoveDocument = useCallback((id: string) => {
    if (!currentWorkspace) return;
    
    setUploadError(null);
    try {
      removeDocument(id);
      removeDocumentRecord(id);
      toast.success("Document supprimé");
    } catch (error) {
      const errorMsg = "Erreur lors de la suppression du document";
      setUploadError(errorMsg);
      toast.error(errorMsg);
      console.error("Error removing document:", error);
    }
  }, [currentWorkspace, removeDocument, removeDocumentRecord]);

  const handleReset = useCallback(() => {
    if (!currentWorkspace) return;
    
    setUploadError(null);
    setExtractionError(null);
    setQuestionError(null);
    try {
      reset();
      toast.success("Copilote réinitialisé");
      setShowResetConfirm(false);
    } catch (error) {
      const errorMsg = "Erreur lors de la réinitialisation";
      toast.error(errorMsg);
      console.error("Error resetting copilot:", error);
    }
  }, [currentWorkspace, reset]);

  const handleAskQuestion = useCallback(async (question: string) => {
    if (!currentWorkspace) return;
    
    setQuestionError(null);

    if (!question.trim()) {
      const errorMsg = "Veuillez saisir une question";
      setQuestionError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (question.length > 1000) {
      const errorMsg = "La question ne peut pas dépasser 1000 caractères";
      setQuestionError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      await askQuestion(question);
      setQuestionError(null);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur lors de l'envoi de la question";
      setQuestionError(errorMsg);
      toast.error(errorMsg);
      console.error("Error asking question:", error);
    }
  }, [currentWorkspace, askQuestion]);

  if (!currentWorkspace) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <SidebarInset className="flex-1 bg-background pl-4 lg:pl-6">
            <div className="flex items-center justify-center min-h-screen p-6">
              <NeuCard className="p-6 max-w-md text-center">
                <h1 className="text-xl font-bold mb-2">Aucun espace sélectionné</h1>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez un espace pour accéder au Copilote IA.
                </p>
              </NeuCard>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1 bg-background pl-4 lg:pl-6">
          <header className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
            <NeuCard className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-400 mb-1 sm:mb-2 truncate">
                      Copilote IA
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 truncate">
                      Copilote IA PRO.GA
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
                      Analyse intelligente de documents et assistance fiscale
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
                  {documents.length > 0 && !currentJob && (
                    <NeuButton 
                      variant="premium" 
                      onClick={handleExtract} 
                      disabled={loading}
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                      aria-label={loading ? "Extraction en cours..." : "Lancer l'extraction des documents"}
                    >
                      {loading ? "Extraction..." : "Lancer l'extraction"}
                    </NeuButton>
                  )}
                  {(documents.length > 0 || messages.length > 0 || currentJob) && (
                    <NeuButton 
                      variant="outline" 
                      onClick={() => setShowResetConfirm(true)} 
                      disabled={loading}
                      className="flex-1 sm:flex-none text-xs sm:text-sm"
                      aria-label="Réinitialiser le copilote IA"
                    >
                      <RotateCcw className="w-4 h-4 mr-2 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate">Réinitialiser</span>
                    </NeuButton>
                  )}
                </div>
              </div>
            </NeuCard>
          </header>

          <main className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 sm:pb-10 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
            <Tabs defaultValue="upload" className="w-full">
              <NeuCard className="p-3 sm:p-4 mb-4">
                <TabsList className="grid w-full grid-cols-3 bg-transparent h-auto p-0 gap-2">
                  <TabsTrigger 
                    value="upload"
                    className="neu-card-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-xs sm:text-sm lg:text-base"
                  >
                    Documents
                  </TabsTrigger>
                  <TabsTrigger 
                    value="extraction"
                    className="neu-card-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-xs sm:text-sm lg:text-base"
                  >
                    Extraction
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat"
                    className="neu-card-sm px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 data-[state=active]:bg-white data-[state=active]:shadow-[inset_3px_3px_6px_rgba(15,23,42,0.12)] data-[state=active]:text-primary data-[state=inactive]:text-slate-600 font-semibold rounded-xl transition-all text-xs sm:text-sm lg:text-base"
                  >
                    Questionnaire
                  </TabsTrigger>
                </TabsList>
              </NeuCard>

              <TabsContent value="upload" className="space-y-4 mt-4">
                {uploadError && (
                  <NeuCard className="p-4 border-l-4 border-l-red-500 bg-red-50/50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-red-900 mb-1">Erreur de téléversement</p>
                        <p className="text-xs text-red-700">{uploadError}</p>
                      </div>
                      <button
                        onClick={() => setUploadError(null)}
                        className="text-red-600 hover:text-red-800 flex-shrink-0"
                        aria-label="Fermer le message d'erreur"
                      >
                        ×
                      </button>
                    </div>
                  </NeuCard>
                )}
                <AiDocUpload
                  documents={documents}
                  onUpload={handleUploadDocuments}
                  onRemove={handleRemoveDocument}
                  uploading={loading}
                  maxFiles={MAX_FILES_COUNT}
                />
              </TabsContent>

              <TabsContent value="extraction" className="space-y-4 mt-4">
                {extractionError && (
                  <NeuCard className="p-4 border-l-4 border-l-red-500 bg-red-50/50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-red-900 mb-1">Erreur d'extraction</p>
                        <p className="text-xs text-red-700">{extractionError}</p>
                      </div>
                    </div>
                  </NeuCard>
                )}
                {currentJob && currentJob.status === "completed" && currentJob.extraction ? (
                  <AiExtractionResult 
                    summary={currentJob.extraction} 
                    loading={loading}
                  />
                ) : currentJob && currentJob.status === "failed" ? (
                  <NeuCard className="p-6 sm:p-8">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto shadow-lg">
                        <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl mb-2">Extraction échouée</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground px-4 mb-4">
                          L'extraction n'a pas pu être effectuée. Veuillez réessayer ou vérifier vos documents.
                        </p>
                        <NeuButton 
                          variant="premium" 
                          onClick={handleExtract}
                          disabled={loading || documents.length === 0}
                          size="sm"
                        >
                          Réessayer l'extraction
                        </NeuButton>
                      </div>
                    </div>
                  </NeuCard>
                ) : currentJob && currentJob.status === "running" ? (
                  <NeuCard className="p-6 sm:p-8">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/50 border-t-transparent rounded-full animate-spin mx-auto" aria-label="Extraction en cours" />
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl mb-2">Extraction en cours...</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Analyse de {documents.length} document(s). Veuillez patienter.
                        </p>
                      </div>
                    </div>
                  </NeuCard>
                ) : (
                  <NeuCard className="p-6 sm:p-8">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto shadow-lg" aria-hidden="true">
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl mb-2">Aucune extraction disponible</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground px-4">
                          Ajoutez des documents puis lancez l'extraction pour voir les résultats.
                        </p>
                      </div>
                    </div>
                  </NeuCard>
                )}
              </TabsContent>

              <TabsContent value="chat" className="space-y-4 mt-4">
                {questionError && (
                  <NeuCard className="p-4 border-l-4 border-l-red-500 bg-red-50/50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-red-900 mb-1">Erreur</p>
                        <p className="text-xs text-red-700">{questionError}</p>
                      </div>
                      <button
                        onClick={() => setQuestionError(null)}
                        className="text-red-600 hover:text-red-800 flex-shrink-0"
                        aria-label="Fermer le message d'erreur"
                      >
                        ×
                      </button>
                    </div>
                  </NeuCard>
                )}
                <AiQuestionnaire
                  messages={messages}
                  onSubmit={handleAskQuestion}
                  busy={loading}
                  maxLength={1000}
                />
              </TabsContent>
            </Tabs>
          </main>

          {/* Reset Confirmation Dialog */}
          <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="flex items-center gap-4 flex-1 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
                    <RotateCcw className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-2">Réinitialisation</p>
                    <AlertDialogTitle>Réinitialiser le Copilote IA</AlertDialogTitle>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogDescription>
                Cette action supprimera définitivement :
                <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                  {documents.length > 0 && <li>Tous les documents ({documents.length})</li>}
                  {messages.length > 0 && <li>Tous les messages ({messages.length})</li>}
                  {currentJob && <li>Les résultats d'extraction en cours</li>}
                </ul>
                <p className="mt-3 font-semibold">
                  Êtes-vous sûr de vouloir continuer ?
                </p>
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  disabled={loading}
                  className="bg-orange-600 text-white hover:bg-orange-700"
                >
                  {loading ? "Réinitialisation..." : "Réinitialiser"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AiCopilotPage;

