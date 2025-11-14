-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  account_type TEXT NOT NULL CHECK (account_type IN ('individual', 'clothing_store', 'salon', 'fruit_veg', 'restaurant', 'services', 'multi_activity', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('personal', 'business')),
  business_name TEXT,
  siret TEXT,
  activity_type TEXT,
  has_eshop BOOLEAN DEFAULT false,
  eshop_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user roles enum and table
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create demo accounts table
CREATE TABLE IF NOT EXISTS public.demo_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_type TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  workspace_name TEXT,
  business_name TEXT,
  demo_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_accounts ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for workspaces
CREATE POLICY "Users can view their own workspaces"
  ON public.workspaces FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create their own workspaces"
  ON public.workspaces FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own workspaces"
  ON public.workspaces FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own workspaces"
  ON public.workspaces FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for demo_accounts (public read for demo purposes)
CREATE POLICY "Anyone can view demo accounts"
  ON public.demo_accounts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert demo accounts data
INSERT INTO public.demo_accounts (account_type, email, password, full_name, workspace_name, business_name, demo_data) VALUES
('admin', 'admin@proga.demo', 'DemoAdmin2024!', 'Admin Système', 'Administration PRO.GA', NULL, 
  '{"monthly_users": 1250, "active_workspaces": 890, "total_declarations": 3420}'::jsonb),
  
('individual', 'particulier@proga.demo', 'DemoParticulier2024!', 'Jean Dupont', 'Mon Espace Personnel', NULL,
  '{"monthly_income": 2500, "tax_declarations": 12, "documents": 45}'::jsonb),
  
('clothing_store', 'vetements@proga.demo', 'DemoVetements2024!', 'Marie Laurent', 'Boutique Mode & Style', 'Mode & Style SARL',
  '{"monthly_turnover": 45000, "customers": 320, "products": 850, "tax_rate": 0.20}'::jsonb),
  
('salon', 'beaute@proga.demo', 'DemoBeaute2024!', 'Sophie Martin', 'Salon Beauté Zen', 'Beauté Zen',
  '{"monthly_turnover": 12000, "appointments": 180, "clients": 95, "services": 25}'::jsonb),
  
('fruit_veg', 'primeurs@proga.demo', 'DemoPrimeurs2024!', 'Pierre Dubois', 'Les Primeurs du Marché', 'Primeurs Dubois',
  '{"monthly_turnover": 8500, "customers": 145, "products": 120, "market_days": 3}'::jsonb),
  
('restaurant', 'restaurant@proga.demo', 'DemoRestaurant2024!', 'Lucas Bernard', 'Restaurant Le Gourmet', 'Le Gourmet SARL',
  '{"monthly_turnover": 35000, "covers": 850, "employees": 8, "menu_items": 45}'::jsonb),
  
('services', 'services@proga.demo', 'DemoServices2024!', 'Émilie Rousseau', 'Services Pro+', 'Services Pro+ EURL',
  '{"monthly_turnover": 15000, "clients": 28, "projects": 45, "invoices": 120}'::jsonb),
  
('multi_activity', 'pme@proga.demo', 'DemoPME2024!', 'Antoine Moreau', 'Entreprise Multi-Services', 'Multi-Services SA',
  '{"monthly_turnover": 125000, "employees": 15, "departments": 4, "clients": 180}'::jsonb)
ON CONFLICT (account_type) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_workspaces_updated_at ON public.workspaces;
CREATE TRIGGER handle_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, account_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'individual')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();