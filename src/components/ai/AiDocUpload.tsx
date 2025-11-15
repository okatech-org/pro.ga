import { useRef, useState, useCallback, useEffect } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import type { AiDocumentUpload } from "@/types/domain";

type AiDocUploadProps = {
  documents: AiDocumentUpload[];
  onUpload: (files: FileList | File[]) => void;
  onRemove?: (id: string) => void;
  uploading?: boolean;
  maxFiles?: number;
};

export const AiDocUpload = ({ documents, onUpload, onRemove, uploading = false, maxFiles = 20 }: AiDocUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (uploading) {
      // Simuler une progression
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [uploading]);

  const handleSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    onUpload(event.target.files);
    event.target.value = "";
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      onUpload(e.dataTransfer.files);
    }
  }, [onUpload]);

  return (
    <NeuCard className="w-full p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-slate-900">Documents IA</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Déposez vos factures, contrats ou relevés bancaires.</p>
        </div>

        <div
          className={`neu-inset border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-colors ${
            isDragOver 
              ? "border-primary bg-primary/10" 
              : "border-primary/40 hover:bg-primary/5"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Zone de dépôt de fichiers"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary/60 mx-auto mb-2 sm:mb-3 lg:mb-4" aria-hidden="true" />
          <p className="font-semibold text-xs sm:text-sm lg:text-base mb-1 sm:mb-2">Glissez-déposez ici</p>
          <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mb-2 px-2">
            PDF, images ou relevés exportés. Taille max recommandée : 10 Mo.
          </p>
          <p className="text-[9px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">
            {documents.length}/{maxFiles} documents
          </p>
          <NeuButton 
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            disabled={documents.length >= maxFiles}
            className="text-[11px] sm:text-xs lg:text-sm"
            aria-label="Choisir un fichier"
          >
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">Choisir un fichier</span>
          </NeuButton>
          <input
            type="file"
            accept=".pdf,image/*"
            multiple
            className="hidden"
            ref={inputRef}
            onChange={handleSelect}
            aria-label="Sélectionner des fichiers"
            disabled={documents.length >= maxFiles}
          />
        </div>

        {uploading && (
          <div className="space-y-2 sm:space-y-3 neu-inset rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-primary flex-shrink-0" aria-hidden="true" />
              <p className="text-xs sm:text-sm font-medium text-slate-900">Téléversement en cours...</p>
            </div>
            <Progress 
              value={uploadProgress || 0} 
              className="h-1.5 sm:h-2" 
              aria-label={`Progression du téléversement : ${uploadProgress}%`} 
            />
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
              {uploadProgress}% complété
            </p>
          </div>
        )}

        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              Documents analysés ({documents.length})
            </p>
            {documents.length > 0 && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs flex-shrink-0">
                {documents.length}/{maxFiles}
              </Badge>
            )}
          </div>
          {documents.length === 0 ? (
            <div className="text-center py-6 sm:py-8 neu-inset rounded-xl">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground/40 mx-auto mb-2 sm:mb-3" aria-hidden="true" />
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Aucun document pour le moment.</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Téléversez vos documents pour commencer l'analyse.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="neu-inset rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 hover:neu-raised transition-all"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-slate-900 truncate" title={doc.name}>
                        {doc.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {(doc.size / (1024 * 1024)).toFixed(2)} Mo · {doc.type?.split("/")[1]?.toUpperCase() || "Inconnu"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge 
                      variant={doc.status === "uploaded" ? "default" : "secondary"} 
                      className="text-[10px] sm:text-xs"
                    >
                      {doc.status === "uploaded" ? "Prêt" : doc.status}
                    </Badge>
                    {onRemove && (
                      <NeuButton
                        size="sm"
                        variant="outline"
                        onClick={() => onRemove(doc.id)}
                        disabled={uploading}
                        className="h-8 w-8 p-0"
                        aria-label={`Supprimer le document ${doc.name}`}
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                      </NeuButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </NeuCard>
  );
};

