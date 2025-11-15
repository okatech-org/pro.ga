-- Create store_configs table
CREATE TABLE IF NOT EXISTS public.store_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT,
  address TEXT,
  description TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  theme JSONB NOT NULL DEFAULT '{"primaryColor": "#000000", "accentColor": "#666666", "background": "light", "typography": "sans"}'::jsonb,
  page JSONB NOT NULL DEFAULT '{"heroTitle": "", "heroSubtitle": "", "heroImage": null, "highlights": [], "trustBadges": []}'::jsonb,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create store_products table
CREATE TABLE IF NOT EXISTS public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'XAF',
  sku TEXT,
  stock INTEGER CHECK (stock >= 0),
  category TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create store_orders table
CREATE TABLE IF NOT EXISTS public.store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  store_slug TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  currency TEXT NOT NULL DEFAULT 'XAF',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_store_configs_workspace ON public.store_configs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_store_configs_slug ON public.store_configs(slug);
CREATE INDEX IF NOT EXISTS idx_store_products_workspace ON public.store_products(workspace_id);
CREATE INDEX IF NOT EXISTS idx_store_products_status ON public.store_products(status);
CREATE INDEX IF NOT EXISTS idx_store_orders_workspace ON public.store_orders(workspace_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_store_slug ON public.store_orders(store_slug);

-- Add triggers for updated_at
CREATE TRIGGER update_store_configs_updated_at
  BEFORE UPDATE ON public.store_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_store_products_updated_at
  BEFORE UPDATE ON public.store_products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_store_orders_updated_at
  BEFORE UPDATE ON public.store_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.store_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for store_configs
CREATE POLICY "Workspace owners can manage their store configs"
  ON public.store_configs
  FOR ALL
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can view published store configs"
  ON public.store_configs
  FOR SELECT
  USING (published = true);

-- RLS Policies for store_products
CREATE POLICY "Workspace owners can manage their products"
  ON public.store_products
  FOR ALL
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can view active products"
  ON public.store_products
  FOR SELECT
  USING (status = 'active');

-- RLS Policies for store_orders
CREATE POLICY "Workspace owners can view their orders"
  ON public.store_orders
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can create orders"
  ON public.store_orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Workspace owners can update their orders"
  ON public.store_orders
  FOR UPDATE
  USING (
    workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    )
  );