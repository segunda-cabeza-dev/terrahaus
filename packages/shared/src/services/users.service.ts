/**
 * Users Service
 * Gestiona usuarios desde Supabase Auth considerando esquemas legacy y nuevo
 */

import { supabase } from '../lib/supabase'

export type UserRole = 'owner' | 'admin' | 'employee'
type LegacyUserRole = 'dueño' | 'admin' | 'empleado'
type UsersTable = 'admin_profiles' | 'profiles'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  is_active?: boolean
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  email: string
  password: string
  full_name: string
  role: UserRole
  is_active?: boolean
}

export interface UpdateUserData {
  full_name?: string
  email?: string
  role?: UserRole
  is_active?: boolean
}

let detectedTable: UsersTable | null = null
let statusColumnAvailable = false

const TABLE_PRIORITY: UsersTable[] = ['admin_profiles', 'profiles']

function mapLegacyRole(role: LegacyUserRole): UserRole {
  switch (role) {
    case 'dueño':
      return 'owner'
    case 'empleado':
      return 'employee'
    default:
      return 'admin'
  }
}

function mapModernRoleToLegacy(role: UserRole): LegacyUserRole {
  switch (role) {
    case 'owner':
      return 'dueño'
    case 'employee':
      return 'empleado'
    default:
      return 'admin'
  }
}

function normalizeRole(role: string | null | undefined): UserRole {
  if (!role) return 'employee'
  if (role === 'owner' || role === 'admin' || role === 'employee') {
    return role
  }
  return mapLegacyRole(role as LegacyUserRole)
}

function updateTableMetadata(table: UsersTable, sample?: Record<string, any>) {
  detectedTable = table
  if (table === 'profiles') {
    statusColumnAvailable = true
    return
  }
  statusColumnAvailable = sample ? 'is_active' in sample : false
}

function normalizeProfile(record: Record<string, any>, table: UsersTable): UserProfile {
  if (table === 'profiles') {
    return {
      id: record.id,
      email: record.email,
      full_name: record.nombre || record.full_name || '',
      role: normalizeRole(record.role),
      is_active: record.is_active ?? true,
      avatar_url: record.avatar_url ?? null,
      created_at: record.created_at,
      updated_at: record.updated_at ?? record.created_at
    }
  }

  return {
    id: record.id,
    email: record.email,
    full_name: record.full_name || record.nombre || '',
    role: normalizeRole(record.role),
    is_active: record.is_active,
    avatar_url: record.avatar_url ?? null,
    created_at: record.created_at,
    updated_at: record.updated_at ?? record.created_at
  }
}

async function determineUsersTable(): Promise<UsersTable> {
  if (detectedTable) {
    return detectedTable
  }

  let lastError: Error | null = null

  for (const table of TABLE_PRIORITY) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1)

    if (error) {
      lastError = error

      // Si la tabla no existe, intentar con la siguiente
      if (error.code === '42P01' || /does not exist/i.test(error.message)) {
        continue
      }

      // Otros errores (permisos, etc.) se propagan
      throw new Error(error.message || `Error accediendo a ${table}`)
    }

    updateTableMetadata(table, data?.[0])
    return detectedTable!
  }

  console.error('[Users] Unable to determine users table', lastError)
  throw new Error('No se pudo determinar la tabla de usuarios en Supabase')
}

function buildInsertPayload(table: UsersTable, user: CreateUserData, id: string) {
  if (table === 'profiles') {
    return {
      id,
      email: user.email,
      nombre: user.full_name,
      role: mapModernRoleToLegacy(user.role),
      is_active: user.is_active ?? true
    }
  }

  return {
    id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    avatar_url: null,
    ...(statusColumnAvailable ? { is_active: user.is_active ?? true } : {})
  }
}

function buildUpdatePayload(table: UsersTable, userData: UpdateUserData) {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  }

  if (userData.full_name !== undefined) {
    payload[table === 'profiles' ? 'nombre' : 'full_name'] = userData.full_name
  }

  if (userData.email !== undefined) {
    payload.email = userData.email
  }

  if (userData.role !== undefined) {
    payload.role = table === 'profiles' ? mapModernRoleToLegacy(userData.role) : userData.role
  }

  if (userData.is_active !== undefined && statusColumnAvailable) {
    payload.is_active = userData.is_active
  }

  return payload
}

export const usersService = {
  /**
   * Indica si la tabla de usuarios admite el campo is_active
   */
  hasStatusColumn() {
    return statusColumnAvailable
  },

  /**
   * Obtiene todos los usuarios/perfiles
   */
  async getUsers(retry = true): Promise<UserProfile[]> {
    const table = await determineUsersTable()

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(`[Users] Error fetching users from ${table}:`, error)

      if (retry) {
        detectedTable = null
        statusColumnAvailable = false
        return this.getUsers(false)
      }

      throw new Error(error.message || 'Error al obtener usuarios')
    }

    updateTableMetadata(table, data?.[0])
    return (data || []).map(record => normalizeProfile(record, table))
  },

  /**
   * Obtiene un usuario por ID
   */
  async getUser(id: string): Promise<UserProfile | null> {
    const table = await determineUsersTable()

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[Users] Error fetching user:', error)
      return null
    }

    updateTableMetadata(table, data)
    return data ? normalizeProfile(data, table) : null
  },

  /**
   * Crea un nuevo usuario (Auth + Profile)
   * Nota: Requiere que el usuario que ejecuta tenga permisos de admin
   */
  async createUser(userData: CreateUserData): Promise<UserProfile> {
    const table = await determineUsersTable()

    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.full_name,
        role: table === 'profiles' ? mapModernRoleToLegacy(userData.role) : userData.role
      }
    })

    if (authError) {
      console.error('[Users] Error creating auth user:', authError)

      if (authError.message.includes('not authorized') || authError.status === 403) {
        return this.createUserAlternative(userData)
      }

      throw new Error(authError.message || 'Error al crear usuario')
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario')
    }

    // 2. Crear perfil en la tabla correspondiente
    const payload = buildInsertPayload(table, userData, authData.user.id)

    const { data: profile, error: profileError } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single()

    if (profileError) {
      console.error('[Users] Error creating profile:', profileError)
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw new Error('Error al crear el perfil del usuario')
    }

    updateTableMetadata(table, profile)
    return normalizeProfile(profile, table)
  },

  /**
   * Método alternativo para crear usuario sin admin API
   * Solo crea el perfil (el usuario debe registrarse manualmente)
   */
  async createUserAlternative(userData: CreateUserData): Promise<UserProfile> {
    const table = await determineUsersTable()
    const tempId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    const payload = buildInsertPayload(table, userData, tempId)

    const { data: profile, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('[Users] Error creating profile (alternative):', error)
      throw new Error(error.message || 'Error al crear usuario')
    }

    updateTableMetadata(table, profile)
    return normalizeProfile(profile, table)
  },

  /**
   * Actualiza un usuario
   */
  async updateUser(id: string, userData: UpdateUserData): Promise<UserProfile> {
    const table = await determineUsersTable()
    const updatePayload = buildUpdatePayload(table, userData)

    const { data, error } = await supabase
      .from(table)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Users] Error updating user:', error)
      throw new Error(error.message || 'Error al actualizar usuario')
    }

    if (userData.email) {
      try {
        await supabase.auth.admin.updateUserById(id, {
          email: userData.email
        })
      } catch (authError) {
        console.warn('[Users] Could not update auth email:', authError)
      }
    }

    updateTableMetadata(table, data)
    return normalizeProfile(data, table)
  },

  /**
   * Elimina un usuario
   */
  async deleteUser(id: string): Promise<boolean> {
    const table = await determineUsersTable()

    const { error: profileError } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (profileError) {
      console.error('[Users] Error deleting profile:', profileError)
      throw new Error('Error al eliminar el perfil')
    }

    try {
      await supabase.auth.admin.deleteUser(id)
    } catch (authError) {
      console.warn('[Users] Could not delete auth user:', authError)
    }

    return true
  },

  /**
   * Cambia el estado activo/inactivo de un usuario
   */
  async toggleUserStatus(id: string, isActive: boolean): Promise<UserProfile> {
    if (!statusColumnAvailable) {
      throw new Error('La tabla de usuarios no soporta el estado activo/inactivo')
    }
    return this.updateUser(id, { is_active: isActive })
  },

  /**
   * Cambia el rol de un usuario
   */
  async updateUserRole(id: string, role: UserRole): Promise<UserProfile> {
    return this.updateUser(id, { role })
  }
}
