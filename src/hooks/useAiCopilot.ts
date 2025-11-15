import { useCallback, useEffect, useMemo, useState } from "react";
import type { AiDocumentUpload, AiJob, AiMessage, TaxBases } from "@/types/domain";

const STORAGE_KEY = (workspaceId: string) => `proga.ai.${workspaceId}`;

type CopilotState = {
  documents: AiDocumentUpload[];
  messages: AiMessage[];
  lastJob?: AiJob | null;
};

const makeMessage = (role: AiMessage["role"], content: string): AiMessage => ({
  id: `${role}-${Date.now()}`,
  role,
  content,
  createdAt: new Date().toISOString(),
});

const loadState = (workspaceId: string): CopilotState => {
  if (typeof window === "undefined") return { documents: [], messages: [] };
  const raw = localStorage.getItem(STORAGE_KEY(workspaceId));
  if (!raw) return { documents: [], messages: [] };
  try {
    return JSON.parse(raw);
  } catch {
    return { documents: [], messages: [] };
  }
};

const persistState = (workspaceId: string, state: CopilotState) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY(workspaceId), JSON.stringify(state));
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const fakeExtraction = (documents: AiDocumentUpload[]): TaxBases => {
  const base = documents.reduce(
    (acc, doc) => acc + Math.round(doc.size / 100_000) * 100_000,
    2_000_000,
  );
  return {
    tva: {
      collected: Math.round(base * 0.18),
      deductible: Math.round(base * 0.04),
    },
    css: {
      base,
      exclusions: Math.round(base * 0.1),
    },
    is: {
      base: Math.round(base * 0.25),
      rate: 0.25,
    },
    irpp: {
      base: Math.round(base * 0.3),
      quotient: 1.5,
    },
  };
};

export const useAiCopilot = (workspaceId?: string | null) => {
  const [documents, setDocuments] = useState<AiDocumentUpload[]>([]);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [currentJob, setCurrentJob] = useState<AiJob | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspaceId) {
      setDocuments([]);
      setMessages([]);
      setCurrentJob(null);
      return;
    }
    const data = loadState(workspaceId);
    setDocuments(data.documents);
    setMessages(data.messages);
    setCurrentJob(data.lastJob ?? null);
  }, [workspaceId]);

  const persist = useCallback(
    (next: Partial<CopilotState>) => {
      if (!workspaceId) return;
      const snapshot: CopilotState = {
        documents,
        messages,
        lastJob: currentJob,
        ...next,
      };
      persistState(workspaceId, snapshot);
    },
    [workspaceId, documents, messages, currentJob],
  );

  const uploadDocuments = useCallback(
    async (files: FileList | File[]) => {
      if (!workspaceId) {
        throw new Error("Selectionnez un workspace avant dépôt.");
      }
      setLoading(true);
      const fileArray = Array.from(files);
      const uploads: AiDocumentUpload[] = fileArray.map((file) => ({
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploaded",
      }));
      const nextDocuments = [...documents, ...uploads];
      setDocuments(nextDocuments);
      persist({ documents: nextDocuments });
      setLoading(false);
      return uploads;
    },
    [workspaceId, documents, persist],
  );

  const removeDocument = useCallback(
    (id: string) => {
      const nextDocuments = documents.filter((doc) => doc.id !== id);
      setDocuments(nextDocuments);
      persist({ documents: nextDocuments });
    },
    [documents, persist],
  );

  const startExtraction = useCallback(async () => {
    if (!workspaceId || documents.length === 0) {
      throw new Error("Ajoutez des documents avant extraction.");
    }
    setLoading(true);
    const job: AiJob = {
      id: generateId(),
      workspaceId,
      status: "running",
      type: "extraction",
      documents: documents.map((doc) => doc.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentJob(job);
    persist({ lastJob: job });

    // Simule un appel backend
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const extractionBases = fakeExtraction(documents);

    const completedJob: AiJob = {
      ...job,
      status: "completed",
      updatedAt: new Date().toISOString(),
      extraction: {
        taxes: extractionBases,
        summary: "Synthèse générée automatiquement par PRO.GA Copilot.",
        keywords: ["TVA", "CSS", "IS/IMF"],
      },
    };

    setCurrentJob(completedJob);
    const assistantMessage = makeMessage(
      "assistant",
      "Analyse effectuée. Bases fiscales mises à jour dans le module Taxes.",
    );
    const nextMessages = [...messages, assistantMessage];
    setMessages(nextMessages);
    persist({ lastJob: completedJob, messages: nextMessages });
    setLoading(false);
    return completedJob;
  }, [workspaceId, documents, messages, persist]);

  const askQuestion = useCallback(
    async (question: string) => {
      if (!question.trim()) return;
      const userMessage = makeMessage("user", question);
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      persist({ messages: nextMessages });

      // Simule une réponse IA
      await new Promise((resolve) => setTimeout(resolve, 600));
      const answer = makeMessage(
        "assistant",
        "Je recommande d'exporter les écritures d'ici vendredi pour respecter l'échéance CSS.",
      );
      const finalMessages = [...nextMessages, answer];
      setMessages(finalMessages);
      persist({ messages: finalMessages });
      return answer;
    },
    [messages, persist],
  );

  const reset = useCallback(() => {
    setDocuments([]);
    setMessages([]);
    setCurrentJob(null);
    persist({ documents: [], messages: [], lastJob: null });
  }, [persist]);

  const stats = useMemo(
    () => ({
      documents: documents.length,
      messages: messages.length,
      lastJobStatus: currentJob?.status ?? null,
    }),
    [documents.length, messages.length, currentJob],
  );

  return {
    documents,
    messages,
    currentJob,
    loading,
    stats,
    uploadDocuments,
    removeDocument,
    startExtraction,
    askQuestion,
    reset,
  };
};

