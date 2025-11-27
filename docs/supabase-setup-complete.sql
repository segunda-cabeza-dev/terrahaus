-- =====================================================
-- BELTRAME WEB - COMPLETE DATABASE SETUP
-- =====================================================
-- This script creates all tables, RLS policies,
-- functions and triggers needed for the application
--
-- Features:
-- - Dynamic translations system (supports N languages)
-- - All table names in English
-- - Supabase Auth for admin authentication only
-- - Supabase Storage for images
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. ADMIN PROFILES TABLE
-- =====================================================
-- Stores additional information for admin users
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'employee')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);

-- RLS (Row Level Security)
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
    ON public.admin_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Only owners and admins can view all profiles"
    ON public.admin_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners can insert profiles"
    ON public.admin_profiles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

CREATE POLICY "Users can update their own profile"
    ON public.admin_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Only owners can update other profiles"
    ON public.admin_profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

CREATE POLICY "Only owners can delete profiles"
    ON public.admin_profiles FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =====================================================
-- 2. TRANSLATIONS TABLE (Dynamic Multi-language Support)
-- =====================================================
-- Stores all translatable content in any language
CREATE TABLE IF NOT EXISTS public.translations (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'category', 'project', 'product', 'site_content'
    entity_id INTEGER NOT NULL, -- ID of the related entity
    field_name TEXT NOT NULL, -- 'name', 'description', etc.
    language_code TEXT NOT NULL, -- 'es', 'en', 'it', 'fr', etc.
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id, field_name, language_code)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_translations_entity ON public.translations(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_translations_language ON public.translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON public.translations(entity_type, entity_id, field_name, language_code);

-- RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read translations"
    ON public.translations FOR SELECT
    USING (true);

CREATE POLICY "Only authenticated admins can insert translations"
    ON public.translations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only authenticated admins can update translations"
    ON public.translations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners can delete translations"
    ON public.translations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =====================================================
-- 3. CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON public.contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);

-- RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can insert contact messages"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Only authenticated admins can view contact messages"
    ON public.contact_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Only owners and admins can update contact messages"
    ON public.contact_messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners can delete contact messages"
    ON public.contact_messages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =====================================================
-- 4. SITE CONTENT TABLE
-- =====================================================
-- Editable content for the website
-- Note: Text translations are stored in the translations table
CREATE TABLE IF NOT EXISTS public.site_content (
    id SERIAL PRIMARY KEY,
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL, -- For default language or images
    content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'html', 'url')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(section, key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_site_content_section ON public.site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_key ON public.site_content(key);

-- RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read site content"
    ON public.site_content FOR SELECT
    USING (true);

CREATE POLICY "Only owners and admins can insert site content"
    ON public.site_content FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners and admins can update site content"
    ON public.site_content FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners can delete site content"
    ON public.site_content FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =====================================================
-- 5. CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    cover_image_url TEXT, -- Stored in Supabase Storage
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: name and description are stored in translations table
-- Example: translations where entity_type='category' and entity_id=1 and field_name='name' and language_code='es'

-- Indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order);

-- RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read active categories"
    ON public.categories FOR SELECT
    USING (is_active = true OR EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
    ));

CREATE POLICY "Only owners and admins can insert categories"
    ON public.categories FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners and admins can update categories"
    ON public.categories FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners can delete categories"
    ON public.categories FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =====================================================
-- 6. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    image_urls TEXT[] DEFAULT '{}', -- Array of URLs from Supabase Storage
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: name and description are in translations table

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_active ON public.projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(display_order);

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read active projects"
    ON public.projects FOR SELECT
    USING (is_active = true OR EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
    ));

CREATE POLICY "Only owners and admins can insert projects"
    ON public.projects FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners and admins can update projects"
    ON public.projects FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners can delete projects"
    ON public.projects FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =====================================================
-- 7. PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    price DECIMAL(10, 2),
    sale_price DECIMAL(10, 2),
    image_urls TEXT[] DEFAULT '{}', -- Array of URLs from Supabase Storage
    main_image_url TEXT, -- Primary image
    stock INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}', -- For any additional flexible data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: name and description are in translations table

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_order ON public.products(display_order);

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read active products"
    ON public.products FOR SELECT
    USING (is_active = true OR EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
    ));

CREATE POLICY "Only owners and admins can insert products"
    ON public.products FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners and admins can update products"
    ON public.products FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners can delete products"
    ON public.products FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =====================================================
-- 8. MEDIA FILES TABLE
-- =====================================================
-- Centralized tracking of all uploaded files
CREATE TABLE IF NOT EXISTS public.media_files (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE, -- Path in Supabase Storage
    public_url TEXT NOT NULL UNIQUE,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    bucket_name TEXT NOT NULL, -- 'categories', 'projects', 'products', 'media'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_files_active ON public.media_files(is_active);
CREATE INDEX IF NOT EXISTS idx_media_files_bucket ON public.media_files(bucket_name);
CREATE INDEX IF NOT EXISTS idx_media_files_created ON public.media_files(created_at DESC);

-- RLS
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read active media files"
    ON public.media_files FOR SELECT
    USING (is_active = true OR EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE id = auth.uid()
    ));

CREATE POLICY "Only authenticated admins can insert media files"
    ON public.media_files FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Only owners and admins can update media files"
    ON public.media_files FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Only owners can delete media files"
    ON public.media_files FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =====================================================
-- 9. REMINDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    reminder_date TIMESTAMPTZ NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reminders_user ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_date ON public.reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminders_completed ON public.reminders(is_completed);

-- RLS
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own reminders"
    ON public.reminders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders"
    ON public.reminders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders"
    ON public.reminders FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders"
    ON public.reminders FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 10. WHATSAPP CONFIGURATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_config (
    id SERIAL PRIMARY KEY,
    phone_number TEXT NOT NULL,
    default_message TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read WhatsApp config"
    ON public.whatsapp_config FOR SELECT
    USING (true);

CREATE POLICY "Only owners and admins can modify WhatsApp config"
    ON public.whatsapp_config FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

-- =====================================================
-- 11. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON public.translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON public.media_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON public.reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_updated_at BEFORE UPDATE ON public.whatsapp_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create admin profile automatically on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 12. STORAGE CONFIGURATION (Buckets)
-- =====================================================

-- Create bucket for category images
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Create bucket for general media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies - Categories
CREATE POLICY "Anyone can view category images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'categories');

CREATE POLICY "Authenticated admins can upload category images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'categories' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated admins can update category images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'categories' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Only owners can delete category images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'categories' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- Storage policies - Projects
CREATE POLICY "Anyone can view project images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'projects');

CREATE POLICY "Authenticated admins can manage project images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'projects' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated admins can update project images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'projects' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Only owners can delete project images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'projects' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- Storage policies - Products
CREATE POLICY "Anyone can view product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');

CREATE POLICY "Authenticated admins can manage product images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'products' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated admins can update product images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'products' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Only owners can delete product images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'products' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- Storage policies - Media
CREATE POLICY "Anyone can view media files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

CREATE POLICY "Authenticated admins can manage media files"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'media' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated admins can update media files"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'media' AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Only owners can delete media files"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'media' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE id = auth.uid() AND role = 'owner'
        )
    );

-- =====================================================
-- 13. INITIAL DATA (OPTIONAL)
-- =====================================================

-- Insert initial WhatsApp configuration
INSERT INTO public.whatsapp_config (phone_number, default_message, is_active)
VALUES ('+34600000000', 'Hello, I would like more information about your services', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 14. HELPER VIEWS (OPTIONAL)
-- =====================================================

-- View to get categories with their translations
CREATE OR REPLACE VIEW public.categories_with_translations AS
SELECT 
    c.id,
    c.slug,
    c.cover_image_url,
    c.display_order,
    c.is_active,
    c.created_at,
    c.updated_at,
    COALESCE(
        jsonb_object_agg(
            t.language_code,
            jsonb_build_object(
                'name', t.name_value,
                'description', t.description_value
            )
        ) FILTER (WHERE t.language_code IS NOT NULL),
        '{}'::jsonb
    ) as translations
FROM public.categories c
LEFT JOIN (
    SELECT 
        entity_id,
        language_code,
        MAX(CASE WHEN field_name = 'name' THEN value END) as name_value,
        MAX(CASE WHEN field_name = 'description' THEN value END) as description_value
    FROM public.translations
    WHERE entity_type = 'category'
    GROUP BY entity_id, language_code
) t ON t.entity_id = c.id
GROUP BY c.id, c.slug, c.cover_image_url, c.display_order, c.is_active, c.created_at, c.updated_at;

-- View to get projects with their translations
CREATE OR REPLACE VIEW public.projects_with_translations AS
SELECT 
    p.id,
    p.category_id,
    p.slug,
    p.image_urls,
    p.display_order,
    p.is_active,
    p.created_at,
    p.updated_at,
    COALESCE(
        jsonb_object_agg(
            t.language_code,
            jsonb_build_object(
                'name', t.name_value,
                'description', t.description_value
            )
        ) FILTER (WHERE t.language_code IS NOT NULL),
        '{}'::jsonb
    ) as translations
FROM public.projects p
LEFT JOIN (
    SELECT 
        entity_id,
        language_code,
        MAX(CASE WHEN field_name = 'name' THEN value END) as name_value,
        MAX(CASE WHEN field_name = 'description' THEN value END) as description_value
    FROM public.translations
    WHERE entity_type = 'project'
    GROUP BY entity_id, language_code
) t ON t.entity_id = p.id
GROUP BY p.id, p.category_id, p.slug, p.image_urls, p.display_order, p.is_active, p.created_at, p.updated_at;

-- View to get products with their translations
CREATE OR REPLACE VIEW public.products_with_translations AS
SELECT 
    p.id,
    p.category_id,
    p.slug,
    p.price,
    p.sale_price,
    p.image_urls,
    p.main_image_url,
    p.stock,
    p.is_featured,
    p.is_active,
    p.display_order,
    p.metadata,
    p.created_at,
    p.updated_at,
    COALESCE(
        jsonb_object_agg(
            t.language_code,
            jsonb_build_object(
                'name', t.name_value,
                'description', t.description_value
            )
        ) FILTER (WHERE t.language_code IS NOT NULL),
        '{}'::jsonb
    ) as translations
FROM public.products p
LEFT JOIN (
    SELECT 
        entity_id,
        language_code,
        MAX(CASE WHEN field_name = 'name' THEN value END) as name_value,
        MAX(CASE WHEN field_name = 'description' THEN value END) as description_value
    FROM public.translations
    WHERE entity_type = 'product'
    GROUP BY entity_id, language_code
) t ON t.entity_id = p.id
GROUP BY p.id, p.category_id, p.slug, p.price, p.sale_price, p.image_urls, p.main_image_url, 
         p.stock, p.is_featured, p.is_active, p.display_order, p.metadata, p.created_at, p.updated_at;

-- =====================================================
-- END OF SETUP SCRIPT
-- =====================================================
-- To execute this script:
-- 1. First run: supabase-drop-all.sql (to clean existing tables)
-- 2. Then run this script
-- 3. Go to your project at https://supabase.com/dashboard
-- 4. Go to SQL Editor
-- 5. Copy and paste this entire script
-- 6. Run the script
-- =====================================================
