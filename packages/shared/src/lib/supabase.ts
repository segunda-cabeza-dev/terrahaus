import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User roles
export type UserRole = 'owner' | 'admin' | 'employee'

// Admin profile
export interface AdminProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Translation
export interface Translation {
  id: number
  entity_type: 'category' | 'project' | 'product' | 'site_content'
  entity_id: number
  field_name: string
  language_code: string
  value: string
  created_at: string
  updated_at: string
}

// Translated fields
export interface TranslatedFields {
  [languageCode: string]: {
    name?: string
    description?: string
    [key: string]: string | undefined
  }
}

// Contact message
export interface ContactMessage {
  id: string
  full_name: string
  email: string
  phone?: string
  message: string
  is_read: boolean
  notes?: string
  created_at: string
}

// Site content
export interface SiteContent {
  id: number
  section: string
  key: string
  value: string
  content_type: 'text' | 'image' | 'html' | 'url'
  updated_at: string
}

// Category
export interface Category {
  id: number
  slug: string
  cover_image_url?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Category with translations
export interface CategoryWithTranslations extends Category {
  translations: TranslatedFields
}

// Project
export interface Project {
  id: number
  category_id: number
  slug: string
  image_urls: string[]
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Project with translations
export interface ProjectWithTranslations extends Project {
  translations: TranslatedFields
}

// Product
export interface Product {
  id: number
  category_id?: number
  slug: string
  price?: number
  sale_price?: number
  image_urls: string[]
  main_image_url?: string
  stock: number
  is_featured: boolean
  is_active: boolean
  display_order: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

// Product with translations
export interface ProductWithTranslations extends Product {
  translations: TranslatedFields
}

// Media file
export interface MediaFile {
  id: number
  filename: string
  storage_path: string
  public_url: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
  bucket_name: 'categories' | 'projects' | 'products' | 'media'
  is_active: boolean
  created_at: string
  updated_at: string
}

// Reminder
export interface Reminder {
  id: string
  user_id: string
  title: string
  description?: string
  reminder_date: string
  is_completed: boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

// WhatsApp configuration
export interface WhatsAppConfig {
  id: number
  phone_number: string
  default_message?: string
  is_active: boolean
  updated_at: string
}

// Authentication service
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async getUserProfile(userId: string): Promise<AdminProfile | null> {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    return data
  },

  async hasRole(userId: string, roles: UserRole[]): Promise<boolean> {
    const profile = await this.getUserProfile(userId)
    if (!profile) return false
    return roles.includes(profile.role)
  }
}

// Translation service
export const translationService = {
  async getTranslations(entityType: Translation['entity_type'], entityId: number) {
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)

    if (error) {
      console.error('Error fetching translations:', error)
      return {}
    }

    const grouped: TranslatedFields = {}
    data.forEach((t: Translation) => {
      if (!grouped[t.language_code]) {
        grouped[t.language_code] = {}
      }
      grouped[t.language_code][t.field_name] = t.value
    })

    return grouped
  },

  async saveTranslation(
    entityType: Translation['entity_type'],
    entityId: number,
    fieldName: string,
    languageCode: string,
    value: string
  ) {
    const { data, error } = await supabase
      .from('translations')
      .upsert({
        entity_type: entityType,
        entity_id: entityId,
        field_name: fieldName,
        language_code: languageCode,
        value: value
      }, {
        onConflict: 'entity_type,entity_id,field_name,language_code'
      })

    return { data, error }
  }
}

// Demo mode
export const USE_MOCK_DATA = !supabaseUrl || !supabaseAnonKey

export const mockData = {
  currentUser: { id: 'mock-1', email: 'admin@demo.com' },
  adminProfiles: [
    { id: 'mock-1', email: 'admin@demo.com', full_name: 'Admin Demo', role: 'owner' as UserRole, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ],
  contactMessages: [],
  categories: [],
  projects: [],
  products: []
}

export const mockAuthService = {
  async signIn(_email: string, password: string) {
    if (password.length >= 6) {
      return { data: { user: mockData.currentUser, session: { access_token: 'mock-token' } }, error: null }
    }
    return { data: { user: null, session: null }, error: { message: 'Invalid credentials' } }
  },
  async signOut() {
    return { error: null }
  },
  async getCurrentUser() {
    return mockData.currentUser
  },
  async getUserProfile(_userId: string): Promise<AdminProfile | null> {
    return mockData.adminProfiles[0]
  },
  async hasRole(_userId: string, roles: UserRole[]): Promise<boolean> {
    return roles.includes('owner')
  }
}

export const auth = USE_MOCK_DATA ? mockAuthService : authService
