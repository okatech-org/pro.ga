import { useCallback, useEffect, useMemo, useState } from "react";
import type { Invoice, InvoiceLine, InvoiceStatus } from "@/types/domain";

const STORAGE_KEY = (workspaceId: string) => `proga.invoices.${workspaceId}`;

type StoredInvoices = {
  invoices: Invoice[];
  lastSequence: number;
};

const defaultState: StoredInvoices = { invoices: [], lastSequence: 0 };

const readState = (workspaceId: string): StoredInvoices => {
  if (typeof window === "undefined") {
    return defaultState;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY(workspaceId));
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as StoredInvoices;
    return {
      invoices: parsed.invoices ?? [],
      lastSequence: parsed.lastSequence ?? 0,
    };
  } catch {
    return defaultState;
  }
};

const persistState = (workspaceId: string, state: StoredInvoices) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY(workspaceId), JSON.stringify(state));
};

const formatNumber = (sequence: number) => sequence.toString().padStart(4, "0");

const nextInvoiceNumber = (sequence: number) => {
  const year = new Date().getFullYear();
  return `FAC-${year}-${formatNumber(sequence)}`;
};

const calculateTotals = (lines: InvoiceLine[]) => {
  const totals = lines.reduce(
    (acc, line) => {
      const base = line.quantity * line.unitPrice;
      const tax = line.taxRate ? (line.taxRate / 100) * base : 0;
      return {
        ht: acc.ht + base,
        tax: acc.tax + tax,
      };
    },
    { ht: 0, tax: 0 },
  );

  return {
    ht: Math.round(totals.ht),
    tax: Math.round(totals.tax),
    ttc: Math.round(totals.ht + totals.tax),
  };
};

export type InvoiceDraftInput = {
  workspaceId: string;
  invoiceNumber?: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  customerTaxId?: string;
  currency: string;
  issuedOn?: string;
  dueOn?: string;
  status?: InvoiceStatus;
  totals?: Invoice["totals"];
  lines: InvoiceLine[];
};

export type InvoiceUpdateInput = Partial<Omit<InvoiceDraftInput, "invoiceNumber">> & {
  lines?: InvoiceLine[];
};

export const useInvoices = (workspaceId?: string | null) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sequence, setSequence] = useState(0);

  const loadInvoices = useCallback(() => {
    if (!workspaceId) {
      setInvoices([]);
      setSequence(0);
      return;
    }
    setIsLoading(true);
    const state = readState(workspaceId);
    setInvoices(state.invoices);
    setSequence(state.lastSequence);
    setIsLoading(false);
  }, [workspaceId]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const persist = useCallback(
    (nextInvoices: Invoice[], nextSequence = sequence) => {
      if (!workspaceId) return;
      persistState(workspaceId, { invoices: nextInvoices, lastSequence: nextSequence });
      setInvoices(nextInvoices);
      setSequence(nextSequence);
    },
    [workspaceId, sequence],
  );

  const createInvoice = useCallback(
    async (input: InvoiceDraftInput) => {
      if (!workspaceId) {
        throw new Error("Workspace non sélectionné");
      }

      if (input.workspaceId !== workspaceId) {
        throw new Error("Incohérence workspace lors de la création de facture");
      }

      const { workspaceId: wsId, ...invoiceData } = input;

      const lines = input.lines.map((line) => ({
        ...line,
        id: line.id ?? crypto.randomUUID(),
      }));

      const totals = invoiceData.totals ?? calculateTotals(lines);
      const nextSequence = sequence + 1;

      const invoice: Invoice = {
        ...invoiceData,
        id: crypto.randomUUID(),
        workspaceId: wsId,
        invoiceNumber: invoiceData.invoiceNumber ?? nextInvoiceNumber(nextSequence),
        lines,
        totals,
        status: invoiceData.status ?? "DRAFT",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      persist([...invoices, invoice], nextSequence);
      return invoice;
    },
    [workspaceId, invoices, persist, sequence],
  );

  const updateInvoice = useCallback(
    async (id: string, updates: InvoiceUpdateInput) => {
      const nextInvoices = invoices.map((invoice) => {
        if (invoice.id !== id) return invoice;

        const updatedLines = updates.lines?.map((line) => ({
          ...line,
          id: line.id ?? crypto.randomUUID(),
        }));

        const totals = updatedLines ? calculateTotals(updatedLines) : invoice.totals;

        return {
          ...invoice,
          ...updates,
          lines: updatedLines ?? invoice.lines,
          totals,
          updatedAt: new Date().toISOString(),
        };
      });

      persist(nextInvoices);
    },
    [invoices, persist],
  );

  const deleteInvoice = useCallback(
    async (id: string) => {
      const nextInvoices = invoices.filter((invoice) => invoice.id !== id);
      persist(nextInvoices);
    },
    [invoices, persist],
  );

  const markAsPaid = useCallback(
    async (id: string) => {
      await updateInvoice(id, { status: "PAID" });
    },
    [updateInvoice],
  );

  const getInvoiceById = useCallback(
    (id: string) => invoices.find((invoice) => invoice.id === id) ?? null,
    [invoices],
  );

  const getTotalsSummary = useMemo(() => {
    const base = invoices.reduce(
      (acc, invoice) => ({
        totalHt: acc.totalHt + invoice.totals.ht,
        totalTva: acc.totalTva + invoice.totals.tax,
        totalTtc: acc.totalTtc + invoice.totals.ttc,
        count: acc.count + 1,
        paidCount: acc.paidCount + (invoice.status === "PAID" ? 1 : 0),
      }),
      { totalHt: 0, totalTva: 0, totalTtc: 0, count: 0, paidCount: 0 },
    );
    return base;
  }, [invoices]);

  const syncWithSupabase = useCallback(async () => {
    // Placeholder : enverra plus tard vers Supabase
    console.info("Synchronisation factures - en attente d'API", { workspaceId, invoices });
  }, [workspaceId, invoices]);

  return {
    invoices,
    isLoading,
    loadInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    getInvoiceById,
    getTotalsSummary,
    syncWithSupabase,
  };
};


