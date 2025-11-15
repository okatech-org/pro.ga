# Guide de migration PRO.GA

## Prérequis
- Docker Desktop installé et démarré
- Supabase CLI installé : `brew install supabase/tap/supabase`
- Projet Supabase configuré (voir `.env`)

## Étape 1 : Démarrer Supabase local

```bash
cd /Users/okatech/pro.ga-1

# Démarrer les services locaux (PostgreSQL, Auth, Storage, etc.)
supabase start

# Vérifier le statut
supabase status
```

**Output attendu** :
```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Anon key: eyJhbGc...
Service role key: eyJhbGc...
```

## Étape 2 : Appliquer les migrations

```bash
# Option A : Appliquer uniquement les nouvelles migrations
supabase migration up

# Option B : Reset complet + toutes migrations (recommandé pour dev)
supabase db reset
```

**Migrations appliquées** :
1. `20251114160000_create_business_tables.sql` - 10 tables métier
2. `20251114160100_enable_rls.sql` - 40 policies RLS
3. `20251114160200_create_admin_tables.sql` - Tables admin + audit

## Étape 3 : Régénérer les types TypeScript

```bash
# Générer types depuis le schéma DB
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

Ce fichier sera automatiquement mis à jour avec les nouvelles tables.

## Étape 4 : Tester l'intégration

### Test 1 : Créer un workspace
```bash
npm run dev
# Naviguer vers /onboarding
# Créer un espace personnel ou entreprise
```

### Test 2 : Tester module emploi
```bash
# Naviguer vers /dashboard/perso/emploi
# Créer un contrat
# Générer une fiche de paie
```

### Test 3 : Tester boutique
```bash
# Switcher vers espace entreprise
# Naviguer vers /dashboard/business/boutique
# Ajouter des produits
# Configurer la boutique
```

### Test 4 : Vérifier RLS
```sql
-- Dans Supabase Studio (http://localhost:54323)
-- Table Editor > employment_contracts
-- Vous devriez voir uniquement VOS contrats (filtrage auto par workspace_id)
```

## Étape 5 : Déploiement en production

### 5.1 Lier le projet Supabase distant
```bash
supabase link --project-ref <your-project-ref>
```

### 5.2 Push migrations
```bash
supabase db push
```

### 5.3 Mettre à jour les variables d'env
```bash
# Mettre à jour .env avec les clés production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

## Vérification post-migration

### Checklist tables
- [ ] `employment_contracts` créée
- [ ] `payslips` créée
- [ ] `store_products` créée
- [ ] `store_orders` créée
- [ ] `invoices` créée
- [ ] `journal_entries` créée
- [ ] `tax_profiles` créée
- [ ] `documents` créée
- [ ] `ai_jobs` créée
- [ ] `export_packets` créée
- [ ] `audit_events` créée
- [ ] `support_tickets` créée

### Checklist RLS
```sql
-- Tester isolation workspace
SELECT * FROM employment_contracts; -- Retourne uniquement vos contrats

-- Tester accès public produits
SELECT * FROM store_products WHERE is_active = true; -- OK même non connecté
```

### Checklist triggers
```sql
-- Tester auto-update updated_at
UPDATE employment_contracts SET employee_name = 'Test' WHERE id = '...';
SELECT updated_at FROM employment_contracts WHERE id = '...';
-- updated_at doit avoir changé

-- Tester audit automatique
INSERT INTO workspaces (...) VALUES (...);
SELECT * FROM audit_events WHERE event_type = 'workspace.created';
-- Doit contenir une ligne
```

## Rollback d'urgence

Si problème en production :

```bash
# Annuler la dernière migration
supabase migration repair <timestamp> --status reverted

# Re-push l'état précédent
supabase db push
```

## Support

En cas de problème :
1. Vérifier logs : `supabase functions logs`
2. Inspecter DB : Supabase Studio
3. Vérifier RLS : `EXPLAIN` sur queries problématiques

