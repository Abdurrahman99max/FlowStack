-- FlowStack: Core tables

CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE   TABLE IF NOT EXISTS public.role_tasks (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, task_id)
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  screenshot_url TEXT,
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('free', 'freemium', 'paid', 'enterprise', 'open-source')),
  category_id UUID REFERENCES public.categories(id),
  is_verified BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  featured_at TIMESTAMPTZ,
  trending_reason TEXT,
  why_professionals_use TEXT,
  average_rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tool_roles (
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, role_id)
);

CREATE TABLE IF NOT EXISTS public.tool_tasks (
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, task_id)
);
