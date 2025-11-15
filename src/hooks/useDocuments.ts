import { useCallback, useEffect, useMemo, useState } from "react";
import type { Document } from "@/types/domain";

const STORAGE_KEY = (workspaceId: string) => `proga.documents.${workspaceId}`;

type StoredDocuments = {
  items: Document[];
};

const defaultState: StoredDocuments = { items: [] };

const readDocuments = (workspaceId: string): StoredDocuments => {
  if (typeof window === "undefined") return defaultState;
  const raw = localStorage.getItem(STORAGE_KEY(workspaceId));
  if (!raw) return defaultState;
  try {
    return JSON.parse(raw) as StoredDocuments;
  } catch {
    return defaultState;
  }
};

const persistDocuments = (workspaceId: string, state: StoredDocuments) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY(workspaceId), JSON.stringify(state));
};

const computeHash = async (file: File) => {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buffer = await file.arrayBuffer();
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  return `${file.name}-${file.size}-${Date.now()}`;
};

export const useDocuments = (workspaceId?: string | null) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!workspaceId) {
      setDocuments([]);
      return;
    }
    const stored = readDocuments(workspaceId);
    setDocuments(stored.items);
  }, [workspaceId]);

  const persist = useCallback(
    (next: Document[]) => {
      if (!workspaceId) return;
      persistDocuments(workspaceId, { items: next });
      setDocuments(next);
    },
    [workspaceId],
  );

  const uploadDocument = useCallback(
    async (files: FileList | File[]) => {
      if (!workspaceId) throw new Error("Sélectionnez un workspace avant dépôt.");
      const list = Array.isArray(files) ? files : Array.from(files);
      setIsLoading(true);
      const uploads: Document[] = [];

      for (const file of list) {
        const hash = await computeHash(file);
        uploads.push({
          id: crypto.randomUUID(),
          workspaceId,
          type: "AUTRE",
          filename: file.name,
          mimeType: file.type || "application/octet-stream",
          url: URL.createObjectURL(file),
          sha256: hash,
          ocrText: undefined,
          tags: [],
          createdAt: new Date().toISOString(),
        });
      }

      persist([...documents, ...uploads]);
      setIsLoading(false);
      return uploads;
    },
    [workspaceId, documents, persist],
  );

  const removeDocument = useCallback(
    (id: string) => {
      const next = documents.filter((doc) => doc.id !== id);
      persist(next);
    },
    [documents, persist],
  );

  const tagDocument = useCallback(
    (id: string, tags: string[]) => {
      const next = documents.map((doc) => (doc.id === id ? { ...doc, tags } : doc));
      persist(next);
    },
    [documents, persist],
  );

  const searchDocuments = useCallback(
    (term: string) => {
      const normalized = term.trim().toLowerCase();
      if (!normalized) return documents;
      return documents.filter(
        (doc) =>
          doc.filename.toLowerCase().includes(normalized) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(normalized)),
      );
    },
    [documents],
  );

  const filteredDocuments = useMemo(() => searchDocuments(query), [query, searchDocuments]);

  return {
    documents,
    filteredDocuments,
    isLoading,
    uploadDocument,
    removeDocument,
    tagDocument,
    searchDocuments,
    setQuery,
  };
};


