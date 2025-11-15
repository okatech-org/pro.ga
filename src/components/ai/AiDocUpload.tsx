import { useRef, useState, useCallback } from "react";
import { NeuCard } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X } from "lucide-react";
import type { AiDocumentUpload } from "@/types/domain";

type AiDocUploadProps = {
  documents: AiDocumentUpload[];
  onUpload: (files: FileList | File[]) => void;
  onRemove?: (id: string) => void;
  uploading?: boolean;
  maxFiles?: number;
};

export const AiDocUpload = ({ documents, onUpload, onRemove, uploading, maxFiles = 20 }: AiDocUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    <NeuCard className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-2">Documents IA</h3>
          <p className="text-sm text-muted-foreground">Déposez vos factures, contrats ou relevés bancaires.</p>
        </div>

        <div
          className={`neu-inset border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-colors ${
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
          <Upload className="w-12 h-12 text-primary/60 mx-auto mb-4" aria-hidden="true" />
          <p className="font-semibold mb-2">Glissez-déposez ici</p>
          <p className="text-sm text-muted-foreground mb-2">
            PDF, images ou relevés exportés. Taille max recommandée : 10 Mo.
          </p>
          <p className="text-xs text-muted-foreground mb-4">
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
            aria-label="Choisir un fichier"
          >
            <FileText className="w-4 h-4 mr-2" aria-hidden="true" />
            Choisir un fichier
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
          <div className="space-y-2">
            <p className="text-sm font-medium">Téléversement en cours...</p>
            <Progress value={uploadProgress || 0} className="h-2" aria-label={`Progression du téléversement : ${uploadProgress}%`} />
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-semibold">Documents analysés ({documents.length})</p>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun document pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="neu-inset rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(doc.size / (1024 * 1024)).toFixed(2)} Mo · {doc.type || "Inconnu"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={doc.status === "uploaded" ? "default" : "secondary"} className="text-xs">
                      {doc.status === "uploaded" ? "Prêt" : doc.status}
                    </Badge>
                    {onRemove && (
                      <NeuButton
                        size="sm"
                        variant="outline"
                        onClick={() => onRemove(doc.id)}
                        className="h-8 w-8 p-0"
                        aria-label={`Supprimer le document ${doc.name}`}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
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

