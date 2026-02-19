-- FlowStack Database Schema
-- 001: Core tables for tools, roles, tasks, reviews, bookmarks, and user profiles

-- =============================================================================
-- ROLES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- lucide icon name
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- TASKS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- ROLE-TASK JUNCTION (default tasks per role)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.role_tasks (
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, task_id)
);

-- =============================================================================
-- CATEGORIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- TOOLS TABLE
-- =============================================================================
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
  why_professionals_use TEXT, -- curated blurb
  average_rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- TOOL-ROLE JUNCTION
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.tool_roles (
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, role_id)
);

-- =============================================================================
-- TOOL-TASK JUNCTION
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.tool_tasks (
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, task_id)
);

-- =============================================================================
-- USER PROFILES (extends auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role_id UUID REFERENCES public.roles(id),
  custom_role TEXT, -- for "Other" role
  avatar_url TEXT,
  bio TEXT,
  is_admin BOOLEAN DEFAULT false,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- USER-TASK SELECTIONS (tasks user picked during onboarding)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_tasks (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, task_id)
);

-- =============================================================================
-- REVIEWS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  use_case TEXT, -- how they use the tool
  is_approved BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tool_id, user_id) -- one review per user per tool
);

-- =============================================================================
-- BOOKMARKS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- User tasks
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_tasks_select_own" ON public.user_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_tasks_insert_own" ON public.user_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_tasks_delete_own" ON public.user_tasks FOR DELETE USING (auth.uid() = user_id);

-- Tools (public read)
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tools_select_all" ON public.tools FOR SELECT USING (true);

-- Categories (public read)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);

-- Roles (public read)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles_select_all" ON public.roles FOR SELECT USING (true);

-- Tasks (public read)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_select_all" ON public.tasks FOR SELECT USING (true);

-- Role tasks (public read)
ALTER TABLE public.role_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "role_tasks_select_all" ON public.role_tasks FOR SELECT USING (true);

-- Tool roles (public read)
ALTER TABLE public.tool_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tool_roles_select_all" ON public.tool_roles FOR SELECT USING (true);

-- Tool tasks (public read)
ALTER TABLE public.tool_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tool_tasks_select_all" ON public.tool_tasks FOR SELECT USING (true);

-- Reviews (public read, own write)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_select_approved" ON public.reviews FOR SELECT USING (is_approved = true OR auth.uid() = user_id);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks (own only)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookmarks_select_own" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_insert_own" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks_delete_own" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- FUNCTION: Update tool rating stats when reviews change
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_tool_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.tools SET
      average_rating = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM public.reviews WHERE tool_id = OLD.tool_id AND is_approved = true), 0),
      review_count = (SELECT COUNT(*) FROM public.reviews WHERE tool_id = OLD.tool_id AND is_approved = true),
      updated_at = now()
    WHERE id = OLD.tool_id;
    RETURN OLD;
  ELSE
    UPDATE public.tools SET
      average_rating = COALESCE((SELECT AVG(rating)::NUMERIC(3,2) FROM public.reviews WHERE tool_id = NEW.tool_id AND is_approved = true), 0),
      review_count = (SELECT COUNT(*) FROM public.reviews WHERE tool_id = NEW.tool_id AND is_approved = true),
      updated_at = now()
    WHERE id = NEW.tool_id;
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS on_review_change ON public.reviews;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tool_rating();
