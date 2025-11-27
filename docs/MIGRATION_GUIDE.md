# 🔄 Database Migration Guide - New Schema

## What Changed?

### ✅ Major Improvements

1. **Dynamic Translation System**
   - ❌ **Before**: Fixed columns for each language (`name_es`, `name_en`, `name_it`)
   - ✅ **Now**: Separate `translations` table supporting ANY number of languages
   - Add new languages without schema changes!

2. **English Table Names**
   - All tables now use English names for better standardization
   - Example: `categorias` → `categories`, `proyectos` → `projects`

3. **Better Field Names**
   - More descriptive and consistent naming
   - Example: `activo` → `is_active`, `orden` → `display_order`

### 📊 New Database Structure

#### Core Tables
- `admin_profiles` - Admin user profiles (only authenticated users)
- `translations` - Universal translation table
- `contact_messages` - Contact form submissions
- `site_content` - Editable website content
- `categories` - Project/Product categories
- `projects` - Portfolio projects
- `products` - Product catalog
- `media_files` - Centralized file tracking
- `reminders` - Task reminders
- `whatsapp_config` - WhatsApp button configuration

#### How Translations Work

**Old way (Limited):**
```sql
CREATE TABLE categories (
  id INT,
  nombre TEXT,
  nombre_en TEXT,
  nombre_it TEXT  -- Limited to these 3 languages!
);
```

**New way (Unlimited):**
```sql
-- Main table (language-agnostic)
CREATE TABLE categories (
  id INT,
  slug TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN
);

-- Translations (supports ANY language)
CREATE TABLE translations (
  entity_type TEXT,  -- 'category'
  entity_id INT,     -- references categories.id
  field_name TEXT,   -- 'name' or 'description'
  language_code TEXT,-- 'es', 'en', 'it', 'fr', 'de', 'pt', etc.
  value TEXT
);
```

**Example data:**
```sql
-- Category
INSERT INTO categories (id, slug) VALUES (1, 'railings');

-- Translations
INSERT INTO translations VALUES ('category', 1, 'name', 'es', 'Barandillas');
INSERT INTO translations VALUES ('category', 1, 'name', 'en', 'Railings');
INSERT INTO translations VALUES ('category', 1, 'name', 'it', 'Ringhiere');
INSERT INTO translations VALUES ('category', 1, 'name', 'fr', 'Garde-corps');
-- Add as many languages as you want!
```

## 🚀 Migration Steps

### Step 1: Backup Your Data (If needed)

If you have important data in the old schema, backup before proceeding:

```sql
-- Backup categories
SELECT * FROM public.categorias;

-- Backup projects
SELECT * FROM public.proyectos;

-- Backup products
SELECT * FROM public.productos;

-- Backup contacts
SELECT * FROM public.contactos;
```

Save the results as CSV or JSON.

### Step 2: Drop Old Tables

1. Go to Supabase Dashboard → SQL Editor
2. Run the script: `docs/supabase-drop-all.sql`

```sql
-- This will delete ALL existing tables
-- Make sure you backed up important data first!
```

### Step 3: Create New Schema

1. In Supabase SQL Editor
2. Run the script: `docs/supabase-setup-complete.sql`

This creates:
- ✅ All tables with new structure
- ✅ RLS policies
- ✅ Storage buckets
- ✅ Helper views
- ✅ Triggers and functions

### Step 4: Create First Admin User

1. Go to Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. Enable "Auto Confirm User"
5. Create the user

6. Update the user role to 'owner':
```sql
UPDATE public.admin_profiles
SET role = 'owner'
WHERE email = 'your-email@example.com';
```

### Step 5: Add Sample Data (Optional)

If you want to test with sample data:

1. Run the script: `docs/supabase-seed-data.sql` (coming soon)

## 💻 Code Changes

### Update Your Imports

**Before:**
```typescript
import { Profile, Category, Project } from '@beltrame/shared'
```

**After:**
```typescript
import { 
  AdminProfile,          // renamed from Profile
  Category, 
  CategoryWithTranslations, // new!
  Project,
  ProjectWithTranslations,  // new!
  translationService        // new!
} from '@beltrame/shared'
```

### Working with Translations in Code

**Fetching a category with translations:**
```typescript
// Option 1: Use the view (automatic)
const { data } = await supabase
  .from('categories_with_translations')
  .select('*')
  .eq('id', categoryId)
  .single()

// Result:
{
  id: 1,
  slug: 'railings',
  translations: {
    es: { name: 'Barandillas', description: '...' },
    en: { name: 'Railings', description: '...' },
    it: { name: 'Ringhiere', description: '...' }
  }
}

// Option 2: Use translation service
import { translationService } from '@beltrame/shared'

const translations = await translationService.getTranslations('category', categoryId)
```

**Saving translations:**
```typescript
// Save single translation
await translationService.saveTranslation(
  'category',    // entity type
  categoryId,    // entity id
  'name',        // field name
  'es',          // language code
  'Barandillas'  // value
)

// Save multiple translations at once
await translationService.saveTranslations('category', categoryId, {
  es: { name: 'Barandillas', description: 'Descripción...' },
  en: { name: 'Railings', description: 'Description...' },
  it: { name: 'Ringhiere', description: 'Descrizione...' }
})
```

### Example: Creating a Category

```typescript
// 1. Create the category
const { data: category } = await supabase
  .from('categories')
  .insert({
    slug: 'modern-stairs',
    cover_image_url: 'https://...',
    display_order: 10,
    is_active: true
  })
  .select()
  .single()

// 2. Add translations
await translationService.saveTranslations('category', category.id, {
  es: {
    name: 'Escaleras Modernas',
    description: 'Escaleras de diseño contemporáneo'
  },
  en: {
    name: 'Modern Stairs',
    description: 'Contemporary design stairs'
  },
  it: {
    name: 'Scale Moderne',
    description: 'Scale dal design contemporaneo'
  },
  fr: {
    name: 'Escaliers Modernes',
    description: 'Escaliers au design contemporain'
  }
})
```

## 🎯 Benefits

### Before (Old Schema)
- ❌ Limited to 3 languages (es, en, it)
- ❌ Adding new language = ALTER TABLE
- ❌ Mixed Spanish/English column names
- ❌ Redundant columns

### After (New Schema)
- ✅ Unlimited languages
- ✅ Add language without schema changes
- ✅ Consistent English naming
- ✅ Normalized, efficient structure
- ✅ Easy to query specific languages
- ✅ Better for SEO (one URL per language)

## 📝 Quick Reference

### Table Name Changes
| Old Name | New Name |
|----------|----------|
| `profiles` | `admin_profiles` |
| `contactos` | `contact_messages` |
| `contenido_sitio` | `site_content` |
| `categorias` | `categories` |
| `proyectos` | `projects` |
| `productos` | `products` |
| `archivos_media` | `media_files` |
| `recordatorios` | `reminders` |
| `whatsapp_config` | `whatsapp_config` (unchanged) |

### Field Name Changes
| Old | New |
|-----|-----|
| `nombre` | `full_name` (users) or stored in translations |
| `activo` | `is_active` |
| `orden` | `display_order` |
| `leido` | `is_read` |
| `telefono` | `phone` |
| `mensaje` | `message` |

## 🆘 Troubleshooting

### Issue: "relation does not exist"
**Solution**: Make sure you ran the setup script completely

### Issue: "translations not showing"
**Solution**: Check that you inserted translations for that entity_id and language_code

### Issue: "permission denied"
**Solution**: Verify RLS policies are created correctly

## 📚 Additional Resources

- [Full Setup Guide](./SUPABASE_SETUP_GUIDE.md)
- [SQL Scripts](./supabase-setup-complete.sql)
- [TypeScript Types](../packages/shared/src/lib/supabase.ts)

---

Need help? Check the documentation or review the SQL scripts for detailed table structures.
