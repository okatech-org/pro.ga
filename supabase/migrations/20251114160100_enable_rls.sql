-- Migration: Activer RLS sur toutes les tables métier
-- Créé le: 2025-01-14 16:01:00

-- Activer RLS
ALTER TABLE employment_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_packets ENABLE ROW LEVEL SECURITY;

-- Policies pour employment_contracts
CREATE POLICY "Users can view their workspace contracts"
  ON employment_contracts FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert contracts in their workspace"
  ON employment_contracts FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace contracts"
  ON employment_contracts FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace contracts"
  ON employment_contracts FOR DELETE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Policies pour payslips
CREATE POLICY "Users can view their workspace payslips"
  ON payslips FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert payslips in their workspace"
  ON payslips FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace payslips"
  ON payslips FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace payslips"
  ON payslips FOR DELETE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Policies pour store_products
CREATE POLICY "Users can view their workspace products"
  ON store_products FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Public can view active products"
  ON store_products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can insert products in their workspace"
  ON store_products FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace products"
  ON store_products FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace products"
  ON store_products FOR DELETE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Policies pour store_orders
CREATE POLICY "Users can view their workspace orders"
  ON store_orders FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Anyone can insert orders"
  ON store_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their workspace orders"
  ON store_orders FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Policies pour invoices
CREATE POLICY "Users can view their workspace invoices"
  ON invoices FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert invoices in their workspace"
  ON invoices FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace invoices"
  ON invoices FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace invoices"
  ON invoices FOR DELETE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Policies pour journal_entries
CREATE POLICY "Users can view their workspace journal entries"
  ON journal_entries FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert journal entries in their workspace"
  ON journal_entries FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace journal entries"
  ON journal_entries FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace journal entries"
  ON journal_entries FOR DELETE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Policies pour tax_profiles
CREATE POLICY "Users can view their workspace tax profiles"
  ON tax_profiles FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert tax profiles in their workspace"
  ON tax_profiles FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace tax profiles"
  ON tax_profiles FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace tax profiles"
  ON tax_profiles FOR DELETE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Policies pour documents
CREATE POLICY "Users can view their workspace documents"
  ON documents FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert documents in their workspace"
  ON documents FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace documents"
  ON documents FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace documents"
  ON documents FOR DELETE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Policies pour ai_jobs
CREATE POLICY "Users can view their workspace ai jobs"
  ON ai_jobs FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert ai jobs in their workspace"
  ON ai_jobs FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace ai jobs"
  ON ai_jobs FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace ai jobs"
  ON ai_jobs FOR DELETE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Policies pour export_packets
CREATE POLICY "Users can view their workspace export packets"
  ON export_packets FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can insert export packets in their workspace"
  ON export_packets FOR INSERT
  WITH CHECK (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can update their workspace export packets"
  ON export_packets FOR UPDATE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Users can delete their workspace export packets"
  ON export_packets FOR DELETE
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

