import { useCallback, useEffect, useMemo, useState } from "react";
import type { AccountingEntry, BalanceSheetSection, LedgerAccountBalance } from "@/types/domain";

const ledgerKey = (workspaceId: string) => `proga.ledger.${workspaceId}`;

const loadEntries = (workspaceId: string): AccountingEntry[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ledgerKey(workspaceId));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const persistEntries = (workspaceId: string, entries: AccountingEntry[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ledgerKey(workspaceId), JSON.stringify(entries));
};

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const accountLabels: Record<string, string> = {
  "10": "Capital",
  "12": "Résultat net",
  "20": "Immobilisations",
  "30": "Stocks",
  "40": "Clients",
  "41": "Fournisseurs",
  "50": "Trésorerie",
  "60": "Charges",
  "70": "Produits",
};

const labelForAccount = (account: string) => {
  const key = account.slice(0, 2);
  return accountLabels[key] || "";
};

const categorizeAccount = (account: string) => {
  const code = account[0];
  if (["1", "2"].includes(code)) return "equity";
  if (["3", "4", "5"].includes(code)) return "assets";
  if (["6"].includes(code)) return "expenses";
  if (["7"].includes(code)) return "revenues";
  return "others";
};

export const useLedger = (workspaceId?: string | null) => {
  const [entries, setEntries] = useState<AccountingEntry[]>([]);

  useEffect(() => {
    if (!workspaceId) return;
    setEntries(loadEntries(workspaceId));
  }, [workspaceId]);

  const saveEntries = useCallback(
    (next: AccountingEntry[]) => {
      if (!workspaceId) return;
      setEntries(next);
      persistEntries(workspaceId, next);
    },
    [workspaceId],
  );

  const addEntry = useCallback(
    (entry: Omit<AccountingEntry, "id" | "createdAt" | "updatedAt" | "workspaceId">) => {
      if (!workspaceId) throw new Error("workspaceId requis pour un journal");
      const payload: AccountingEntry = {
        ...entry,
        id: generateId(),
        workspaceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveEntries([...entries, payload]);
      return payload;
    },
    [workspaceId, entries, saveEntries],
  );

  const deleteEntry = useCallback(
    (id: string) => {
      saveEntries(entries.filter((entry) => entry.id !== id));
    },
    [entries, saveEntries],
  );

  const resetLedger = useCallback(() => {
    saveEntries([]);
  }, [saveEntries]);

  const balances = useMemo<LedgerAccountBalance[]>(() => {
    const map = new Map<string, LedgerAccountBalance>();
    entries.forEach((entry) => {
      if (!map.has(entry.debitAccount)) {
        map.set(entry.debitAccount, {
          account: entry.debitAccount,
          label: labelForAccount(entry.debitAccount),
          debit: 0,
          credit: 0,
          balance: 0,
        });
      }
      if (!map.has(entry.creditAccount)) {
        map.set(entry.creditAccount, {
          account: entry.creditAccount,
          label: labelForAccount(entry.creditAccount),
          debit: 0,
          credit: 0,
          balance: 0,
        });
      }

      const debitLine = map.get(entry.debitAccount)!;
      debitLine.debit += entry.amount;
      debitLine.balance = debitLine.debit - debitLine.credit;

      const creditLine = map.get(entry.creditAccount)!;
      creditLine.credit += entry.amount;
      creditLine.balance = creditLine.debit - creditLine.credit;
    });

    return Array.from(map.values()).sort((a, b) => a.account.localeCompare(b.account));
  }, [entries]);

  const balanceSheet = useMemo<BalanceSheetSection[]>(() => {
    const assets = balances.filter((balance) => categorizeAccount(balance.account) === "assets");
    const liabilities = balances.filter((balance) => categorizeAccount(balance.account) === "equity");
    const income = balances.filter((balance) => categorizeAccount(balance.account) === "revenues");
    const expenses = balances.filter((balance) => categorizeAccount(balance.account) === "expenses");

    const sum = (items: LedgerAccountBalance[]) => items.reduce((acc, item) => acc + item.balance, 0);

    return [
      { title: "Actif", accounts: assets, total: sum(assets) },
      { title: "Passif / Capitaux", accounts: liabilities, total: sum(liabilities) },
      { title: "Produits", accounts: income, total: sum(income) },
      { title: "Charges", accounts: expenses, total: sum(expenses) },
    ];
  }, [balances]);

  const stats = useMemo(() => {
    const totalDebit = balances.reduce((sum, balance) => sum + balance.debit, 0);
    const totalCredit = balances.reduce((sum, balance) => sum + balance.credit, 0);
    return { totalDebit, totalCredit, delta: totalDebit - totalCredit };
  }, [balances]);

  return {
    entries,
    balances,
    balanceSheet,
    stats,
    addEntry,
    deleteEntry,
    resetLedger,
  };
};

