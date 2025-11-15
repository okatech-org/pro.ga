import type { TaxBases, TaxBracket, TaxComputationResult } from "@/types/domain";

const DEFAULT_CSS_RATE = 0.032;
const DEFAULT_IS_RATE = 0.25;
const DEFAULT_IMF_RATE = 0.015;

export const defaultIrppBareme: TaxBracket[] = [
  { ceiling: 2_000_000, rate: 0 },
  { ceiling: 5_000_000, rate: 0.1 },
  { ceiling: 12_000_000, rate: 0.2 },
  { ceiling: 30_000_000, rate: 0.3 },
  { ceiling: 60_000_000, rate: 0.35 },
  { ceiling: null, rate: 0.4 },
];

export type TVAResult = TaxComputationResult & { due: number; credit: number; net: number };

export type CSSResult = TaxComputationResult & { taxable: number; rate: number };

export type ISvsIMFResult = TaxComputationResult & {
  isAmount: number;
  imfAmount: number;
  applied: "is" | "imf";
};

export type IRPPResult = TaxComputationResult & {
  parts: number;
  taxablePerPart: number;
};

export const computeTVA = (collectee: number, deductible: number): TVAResult => {
  const net = collectee - deductible;
  const due = Math.max(net, 0);
  const credit = Math.max(-net, 0);
  return {
    amount: due,
    net,
    due,
    credit,
    details: { collectee, deductible },
  };
};

export const computeCSS = (
  baseHT: number,
  exclusions = 0,
  rate = DEFAULT_CSS_RATE,
): CSSResult => {
  const taxable = Math.max(baseHT - exclusions, 0);
  const amount = taxable * rate;
  return {
    amount,
    taxable,
    rate,
    details: { base: baseHT, exclusions },
  };
};

export const computeISvsIMF = (
  resultat: number,
  chiffreAffaires: number,
  tauxIS = DEFAULT_IS_RATE,
): ISvsIMFResult => {
  const isAmount = Math.max(resultat, 0) * tauxIS;
  const imfAmount = Math.max(chiffreAffaires, 0) * DEFAULT_IMF_RATE;
  const applied = isAmount >= imfAmount ? "is" : "imf";
  const amount = applied === "is" ? isAmount : imfAmount;
  return {
    amount,
    isAmount,
    imfAmount,
    applied,
    details: { resultat, chiffreAffaires, tauxIS, tauxIMF: DEFAULT_IMF_RATE },
  };
};

export const computeIRPP = (
  baseIRPP: number,
  quotient = 1,
  bareme: TaxBracket[] = defaultIrppBareme,
): IRPPResult => {
  const parts = Math.max(1, quotient);
  const taxablePerPart = Math.max(baseIRPP, 0) / parts;
  let taxPerPart = 0;
  let previousCeiling = 0;

  for (const bracket of bareme) {
    const ceiling = bracket.ceiling ?? Number.POSITIVE_INFINITY;
    if (taxablePerPart <= previousCeiling) break;
    const slice = Math.min(taxablePerPart, ceiling) - previousCeiling;
    if (slice > 0) {
      taxPerPart += slice * bracket.rate;
      if (bracket.deduction) {
        taxPerPart -= bracket.deduction;
      }
    }
    previousCeiling = ceiling;
  }

  const amount = taxPerPart * parts;
  return {
    amount,
    parts,
    taxablePerPart,
    details: { baseIRPP, quotient: parts },
  };
};

export const evaluateTaxBases = (bases: TaxBases) => ({
  tva: bases.tva ? computeTVA(bases.tva.collected, bases.tva.deductible) : null,
  css: bases.css
    ? computeCSS(bases.css.base, bases.css.exclusions ?? 0, bases.css.rate ?? DEFAULT_CSS_RATE)
    : null,
  isVsImf:
    bases.is || bases.imf
      ? computeISvsIMF(
          bases.is?.base ?? 0,
          bases.imf?.base ?? bases.is?.base ?? 0,
          bases.is?.rate ?? DEFAULT_IS_RATE,
        )
      : null,
  irpp: bases.irpp
    ? computeIRPP(bases.irpp.base, bases.irpp.quotient, bases.irpp.brackets ?? defaultIrppBareme)
    : null,
});

