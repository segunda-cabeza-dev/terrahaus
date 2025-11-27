/**
 * Users Service
 * Gestiona usuarios desde Supabase Auth y tabla profiles
 */

import { supabase } from '../lib/supabase'

export interface UserProfile {
  id: string
  email: string
  nombre: string
  role: 'dueño' | 'admin' | 'empleado'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  email: string
  password: string
  nombre: string
  role: 'dueño' | 'admin' | 'empleado'
  is_active?: boolean
}

export interface UpdateUserData {
  nombre?: string
  email?: string
  role?: 'dueño' | 'admin' | 'empleado'
  is_active?: boolean
}

export const usersService = {
  /**
   * Obtiene todos los usuarios/perfiles
   */
  async getUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Users] Error fetching users:', error)
      throw new Error('Error al obtener usuarios')
    }

    return (data || []).map(profile => ({
      ...profile,
      is_active: profile.is_active ?? true
    }))
  },

  /**
   * Obtiene un usuario por ID
   */
  async getUser(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[Users] Error fetching user:', error)
      return null
    }

    return data ? { ...data, is_active: data.is_active ?? true } : null
  },

  /**
   * Crea un nuevo usuario (Auth + Profile)
   * Nota: Requiere que el usuario que ejecuta tenga permisos de admin
   */
  async createUser(userData: CreateUserData): Promise<UserProfile> {
    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        nombre: userData.nombre,
        role: userData.role
      }
    })

    if (authError) {
      console.error('[Users] Error creating auth user:', authError)
      
      // Intentar método alternativo si admin API no está disponible
      if (authError.message.includes('not authorized') || authError.status === 403) {
        return this.createUserAlternative(userData)
      }
      
      throw new Error(authError.message || 'Error al crear usuario')
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario')
    }

    // 2. Crear perfil en la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: userData.email,
        nombre: userData.nombre,
        role: userData.role,
        is_active: userData.is_active ?? true
      })
      .select()
      .single()

    if (profileError) {
      console.error('[Users] Error creating profile:', profileError)
      // Intentar eliminar el usuario de auth si falla el perfil
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw new Error('Error al crear el perfil del usuario')
    }

    return {
      ...profile,
      is_active: profile.is_active ?? true
    }
  },

  /**
   * Método alternativo para crear usuario sin admin API
   * Solo crea el perfil (el usuario debe registrarse manualmente)
   */
  async createUserAlternative(userData: CreateUserData): Promise<UserProfile> {
    // Generar un ID temporal
    const tempId = crypto.randomUUID()
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        id: tempId,
        email: userData.email,
        nombre: userData.nombre,
        role: userData.role,
        is_active: userData.is_active ?? true
      })
      .select()
      .single()

    if (error) {
      console.error('[Users] Error creating profile (alternative):', error)
      throw new Error(error.message || 'Error al crear usuario')
    }

    return {
      ...profile,
      is_active: profile.is_active ?? true
    }
  },

  /**
   * Actualiza un usuario
   */
  async updateUser(id: string, userData: UpdateUserData): Promise<UserProfile> {
    const updateData: Record<string, unknown> = {
      ...userData,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Users] Error updating user:', error)
      throw new Error(error.message || 'Error al actualizar usuario')
    }

    // Si se cambió el email, también actualizar en Auth
    if (userData.email) {
      try {
        await supabase.auth.admin.updateUserById(id, {
          email: userData.email
        })
      } catch (authError) {
        console.warn('[Users] Could not update auth email:', authError)
      }
    }

    return {
      ...data,
      is_active: data.is_active ?? true
    }
  },

  /**
   * Elimina un usuario
   */
  async deleteUser(id: string): Promise<boolean> {
    // 1. Eliminar perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (profileError) {
      console.error('[Users] Error deleting profile:', profileError)
      throw new Error('Error al eliminar el perfil')
    }

    // 2. Intentar eliminar de Auth (puede fallar si no hay permisos admin)
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
    return this.updateUser(id, { is_active: isActive })
  },

  /**
   * Cambia el rol de un usuario
   */
  async updateUserRole(id: string, role: 'dueño' | 'admin' | 'empleado'): Promise<UserProfile> {
    return this.updateUser(id, { role })
  }
}
