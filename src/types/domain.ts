// Domain types pour PRO.GA
// Ces interfaces modélisent les données partagées entre le frontend et Supabase.

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

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "paid" | "cancelled";

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
  status: OrderStatus;
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

