// Domain types pour PRO.GA
// Ces interfaces modélisent les données partagées entre le frontend et Supabase.

export type UUID = string;

// -----------------------------------------------------------------------------
// 1) Personne physique (compte principal)
// -----------------------------------------------------------------------------
export interface FoyerInfo {
  situationFamiliale: "CELIBATAIRE" | "MARIE" | "DIVORCE" | "VEUF" | "PACSE";
  nombreEnfants: number;
  nombreAutresCharges: number;
  quotientFamilial: number;
}

export interface Person {
  id: UUID;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  nifPerso?: string;
  foyerInfo: FoyerInfo;
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// 2) Workspaces (cellules)
// -----------------------------------------------------------------------------
export type WorkspaceType = "PERSO" | "ENTREPRISE";

export interface Workspace {
  id: UUID;
  ownerId: UUID;
  type: WorkspaceType;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalWorkspace extends Workspace {
  type: "PERSO";
}

export interface BusinessWorkspace extends Workspace {
  type: "ENTREPRISE";
  raisonSociale: string;
  nif?: string;
  formeJuridique: "EI" | "EURL" | "SARL" | "SA" | "SAS" | "SASU" | "AUTRE";
  regimeTVA: "ASSUJETTI" | "NON_ASSUJETTI";
  secteurActivite: string;
  slugProGa?: string;
  storeConfig?: StoreConfig;
}

// -----------------------------------------------------------------------------
// 3) Members
// -----------------------------------------------------------------------------
export type MemberRole =
  | "OWNER"
  | "COMPTABLE"
  | "OPERATEUR_POS"
  | "AUDITEUR"
  | "CONJOINT";

export interface Member {
  id: UUID;
  workspaceId: UUID;
  userId: UUID;
  role: MemberRole;
  invitedAt: Date;
  acceptedAt?: Date;
}

// -----------------------------------------------------------------------------
// 4) Profils fiscaux
// -----------------------------------------------------------------------------
export type TaxType = "TVA" | "CSS" | "IS_IMF" | "IRPP";

export interface BaremeTranche {
  de: number;
  a: number;
  taux: number;
}

export interface TaxParams {
  tauxStandard?: number;
  tauxReduit?: number;
  tauxCSS?: number;
  exclusionsSectorielles?: string[];
  tauxIS?: number;
  tauxIMF?: number;
  baremeIRPP?: BaremeTranche[];
  quotientFamilialMax?: number;
}

export interface TaxProfile {
  id: UUID;
  workspaceId: UUID;
  annee: number;
  type: TaxType;
  params: TaxParams;
  sourceUrl?: string;
  version: number;
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// 5) Facturation
// -----------------------------------------------------------------------------
export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "CANCELLED";

export interface InvoiceLine {
  id: UUID;
  invoiceId: UUID;
  libelle: string;
  quantity: number;
  unitPriceHtXaf: number;
  tvaRate: number;
  tvaXaf: number;
  totalHtXaf: number;
}

export interface Invoice {
  id: UUID;
  workspaceId: UUID;
  numero: string;
  date: Date;
  customerName: string;
  customerNif?: string;
  totalHtXaf: number;
  totalTvaXaf: number;
  totalTtcXaf: number;
  status: InvoiceStatus;
  pdfUrl?: string;
  qrHash?: string;
  lines: InvoiceLine[];
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// 6) Emploi à domicile
// -----------------------------------------------------------------------------
export type DomesticJobType =
  | "MENAGE"
  | "GARDIEN"
  | "NOUNOU"
  | "CHAUFFEUR"
  | "CUISINIER"
  | "AUTRE";

export type ContractStatus = "DRAFT" | "ACTIVE" | "ENDED";
export type SalaryType = "MONTHLY" | "HOURLY";

export interface WorkSchedule {
  joursParSemaine: number[];
  heuresParJour: number;
  heureDebut: string;
  heureFin: string;
}

export interface EmploymentContract {
  id: UUID;
  workspaceId: UUID;
  employeeName: string;
  employeeIdInfo: string;
  jobType: DomesticJobType;
  startDate: Date;
  endDate?: Date;
  schedule: WorkSchedule;
  salaryType: SalaryType;
  salaryAmountXaf: number;
  status: ContractStatus;
  pdfUrl?: string;
  createdAt: Date;
}

export type RetenueType = "FIXE" | "POURCENTAGE";

export interface Retenue {
  libelle: string;
  montantXaf: number;
  type: RetenueType;
}

export interface Payslip {
  id: UUID;
  workspaceId: UUID;
  contractId: UUID;
  periodStart: Date;
  periodEnd: Date;
  brutXaf: number;
  retenues: Retenue[];
  netXaf: number;
  pdfUrl?: string;
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// 7) Documents
// -----------------------------------------------------------------------------
export type DocumentType =
  | "BILAN"
  | "GRAND_LIVRE"
  | "STATUTS"
  | "FACTURE_ACHAT"
  | "FACTURE_VENTE"
  | "RELEVE_BANCAIRE"
  | "CONTRAT_DOMICILE"
  | "BULLETIN_SALAIRE"
  | "AUTRE";

export interface Document {
  id: UUID;
  workspaceId: UUID;
  type: DocumentType;
  filename: string;
  size?: number;
  mimeType: string;
  url: string;
  sha256: string;
  ocrText?: string;
  tags: string[];
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// 8) Bases fiscales et exports
// -----------------------------------------------------------------------------
export interface TaxBases {
  periode: { debut: Date; fin: Date };
  tva: {
    collectee: number;
    deductible: number;
    due: number;
  };
  css: {
    baseHT: number;
    exclusions: number;
    montant: number;
  };
  isImf: {
    resultatFiscal: number;
    caHTAnnuel: number;
    isTheorique: number;
    imf: number;
    retenu: number;
  };
  irpp?: {
    baseImposable: number;
    quotientFamilial: number;
    impot: number;
    tauxEffectif: number;
  };
}

export interface ExportPacket {
  id: UUID;
  workspaceId: UUID;
  periodStart: Date;
  periodEnd: Date;
  bases: TaxBases;
  jsonUrl: string;
  pdfUrl: string;
  hash: string;
  signature?: string;
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// 9) Boutique en ligne
// -----------------------------------------------------------------------------
export interface StoreSection {
  id: UUID;
  title: string;
  content: string;
  order: number;
}

export interface StoreConfig {
  workspaceId: UUID;
  slug: string;
  brandName: string;
  city: string;
  address: string;
  phone?: string;
  paymentInfo: string;
  deliveryInfo: string;
  logoUrl?: string;
  bannerUrl?: string;
  sections: StoreSection[];
}

export interface Product {
  id: UUID;
  workspaceId: UUID;
  name: string;
  description?: string;
  priceHtXaf: number;
  tvaRate: number;
  category: string;
  imageUrl?: string;
  stock?: number;
  isActive: boolean;
}

export type UUID = string;

export interface BaseEntity {
  id: UUID;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type WorkspaceScope = "personal" | "business";

export type WorkspaceType =
  | "household"
  | "sole_trader"
  | "commerce"
  | "services"
  | "hospitality"
  | "professional"
  | "association"
  | "startup"
  | "other"
  | string;

export type WorkspaceStatus = "draft" | "active" | "suspended" | "archived";

export interface Person extends BaseEntity {
  userId: string;
  fullName: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  accountType: "admin" | "individual" | "business" | string;
  locale: string;
  avatarUrl?: string | null;
  metadata?: Record<string, unknown>;
}

export type WorkspaceRole =
  | "owner"
  | "admin"
  | "manager"
  | "accountant"
  | "viewer"
  | "guest";

export type MemberStatus = "pending" | "active" | "disabled" | "revoked";

export type MemberPermission =
  | "billing.read"
  | "billing.write"
  | "commerce.read"
  | "commerce.write"
  | "hr.read"
  | "hr.write"
  | "taxes.read"
  | "taxes.write";

export interface Member extends BaseEntity {
  workspaceId: string;
  personId: string;
  role: WorkspaceRole;
  status: MemberStatus;
  permissions: Partial<Record<MemberPermission, boolean>>;
}

export interface Workspace extends BaseEntity {
  name: string;
  slug: string;
  scope: WorkspaceScope;
  type: WorkspaceType;
  status: WorkspaceStatus;
  ownerId: string;
  businessName?: string | null;
  siret?: string | null;
  activityType?: string | null;
  hasEshop: boolean;
  eshopName?: string | null;
  city?: string | null;
  country?: string | null;
  metadata?: Record<string, unknown>;
}

export type TaxRegime =
  | "irpp"
  | "is"
  | "imf"
  | "forfait"
  | "micro_bic"
  | "micro_bnc"
  | "auto"
  | string;

export interface TaxBracket {
  ceiling: number | null;
  rate: number;
  deduction?: number;
}

export interface TaxBase {
  base: number;
  rate: number;
  deductions?: number;
}

export interface IRPPFamilySituation {
  dependents: number;
  maritalStatus: "single" | "married" | "pacsed" | "widowed" | "divorced";
  parts?: number;
}

export interface TaxBases {
  tva?: {
    collected: number;
    deductible: number;
    rate?: number;
  };
  css?: {
    base: number;
    exclusions?: number;
    rate?: number;
  };
  is?: TaxBase;
  imf?: TaxBase;
  irpp?: {
    base: number;
    quotient: number;
    brackets?: TaxBracket[];
  };
}

export interface TaxProfile extends BaseEntity {
  workspaceId: string;
  year: number;
  regime: TaxRegime;
  fiscalNumber?: string | null;
  taxBases: TaxBases;
  family?: IRPPFamilySituation;
  options?: Record<string, unknown>;
}

export type DocumentCategory =
  | "identity"
  | "invoice"
  | "contract"
  | "payslip"
  | "tax"
  | "report"
  | "other";

export type DocumentStatus = "draft" | "final" | "signed" | "archived";

export interface Document extends BaseEntity {
  workspaceId: string;
  size?: number | null;
  category: DocumentCategory;
  title: string;
  status: DocumentStatus;
  storagePath?: string | null;
  hash?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface InvoiceLine {
  id?: string;
  designation: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  discountRate?: number;
  accountCode?: string;
}

export type InvoiceStatus =
  | "draft"
  | "issued"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

export interface Invoice extends BaseEntity {
  workspaceId: string;
  documentId?: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string | null;
  customerAddress?: string | null;
  customerTaxId?: string | null;
  status: InvoiceStatus;
  currency: string;
  issuedOn: string;
  dueOn?: string | null;
  lines: InvoiceLine[];
  totals: {
    ht: number;
    tax: number;
    ttc: number;
  };
  metadata?: Record<string, unknown>;
}

export type EmploymentContractType =
  | "household"
  | "nanny"
  | "driver"
  | "guard"
  | "custom";

export type EmploymentContractStatus =
  | "draft"
  | "active"
  | "suspended"
  | "terminated";

export interface EmploymentContract extends BaseEntity {
  workspaceId: string;
  employeeName: string;
  role: string;
  contractType: EmploymentContractType;
  hourlyRate: number;
  weeklyHours: number;
  startDate: string;
  endDate?: string | null;
  status: EmploymentContractStatus;
  benefits?: Record<string, unknown>;
  documentId?: string | null;
}

export interface Payslip extends BaseEntity {
  workspaceId: string;
  contractId: string;
  period: string;
  grossSalary: number;
  taxableSalary: number;
  employerContributions: number;
  employeeContributions: number;
  netPayable: number;
  workedHours: number;
  metadata?: Record<string, unknown>;
  documentId?: string | null;
}

export type ExportFormat = "json" | "pdf" | "zip";

export type ExportStatus = "draft" | "ready" | "sent" | "failed";

export interface ExportPacket extends BaseEntity {
  workspaceId: string;
  type: "app_a" | "audit" | "custom" | string;
  periodStart: string;
  periodEnd: string;
  status: ExportStatus;
  format: ExportFormat;
  checksum?: string | null;
  payloadUrl?: string | null;
  metadata?: Record<string, unknown>;
}

export interface TaxComputationResult {
  amount: number;
  details?: Record<string, number>;
}

export interface StoreTheme {
  primaryColor: string;
  accentColor: string;
  background: "light" | "dark";
  typography: "sans" | "serif" | "mono";
}

export interface StorePageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string | null;
  highlights: { title: string; description: string }[];
  trustBadges: string[];
}

export interface StoreConfig extends BaseEntity {
  workspaceId: string;
  slug: string;
  name: string;
  city?: string | null;
  address?: string | null;
  description?: string | null;
  published: boolean;
  theme: StoreTheme;
  page: StorePageContent;
  metadata?: Record<string, unknown>;
}

export type StoreProductStatus = "draft" | "active" | "archived";

export interface StoreProduct extends BaseEntity {
  workspaceId: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  sku?: string | null;
  stock?: number | null;
  category?: string | null;
  imageUrl?: string | null;
  status: StoreProductStatus;
  featured: boolean;
}

export interface StoreOrder extends BaseEntity {
  workspaceId: string;
  storeSlug: string;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  currency: string;
  status: "pending" | "paid" | "cancelled";
}

export interface PosCartItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AccountingEntry extends BaseEntity {
  workspaceId: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  reference?: string | null;
  tags?: string[];
}

export interface LedgerAccountBalance {
  account: string;
  label?: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface BalanceSheetSection {
  title: string;
  accounts: LedgerAccountBalance[];
  total: number;
}

export type AiJobStatus = "pending" | "running" | "completed" | "failed";

export type AiJobType = "extraction" | "questionnaire" | "classification";

export interface AiJob extends BaseEntity {
  workspaceId: string;
  status: AiJobStatus;
  type: AiJobType;
  documents: string[];
  extraction?: {
    taxes?: Partial<TaxBases>;
    keywords?: string[];
    summary?: string;
  };
  error?: string | null;
}

export interface AiDocumentUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploaded" | "processing" | "failed";
  url?: string;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

