import { useMemo } from "react";
import type { TaxBases } from "@/types/domain";
import {
  computeCSS,
  computeIRPP,
  computeISvsIMF,
  computeTVA,
  defaultIrppBareme,
  evaluateTaxBases,
} from "@/utils/taxFormulas";

export const useTaxEngine = () => {
  const runAll = (bases: TaxBases) => evaluateTaxBases(bases);

  return useMemo(
    () => ({
      computeTVA,
      computeCSS,
      computeISvsIMF,
      computeIRPP,
      runAll,
      defaultIrppBareme,
    }),
    [],
  );
};

