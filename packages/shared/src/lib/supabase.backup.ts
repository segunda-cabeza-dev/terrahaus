import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase con valores placeholder
// TODO: Reemplazar con tus credenciales reales de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key-aqui'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de roles de usuario
export type UserRole = 'dueño' | 'admin' | 'empleado'

// Tipos de base de datos
export interface Profile {
  id: string
  email: string
  nombre: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface ContactForm {
  id: number
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  leido: boolean
  created_at: string
}

export interface SiteContent {
  id: number
  seccion: string
  clave: string
  valor: string
  tipo: 'texto' | 'imagen' | 'html'
  updated_at: string
}

export interface Category {
  id: number
  nombre: string
  nombre_en?: string
  slug: string
  descripcion?: string
  descripcion_en?: string
  imagen_portada?: string
  orden: number
  activa: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  categoria_id: number
  nombre: string
  nombre_en?: string
  descripcion?: string
  descripcion_en?: string
  imagenes?: string[] // Array de URLs de imágenes
  orden: number
  activo: boolean
  created_at: string
  updated_at: string
}

// Funciones de autenticación
export const authService = {
  // Iniciar sesión
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Obtener perfil del usuario con rol
  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    return data
  },

  // Verificar si el usuario tiene un rol específico
  async hasRole(userId: string, roles: UserRole[]): Promise<boolean> {
    const profile = await this.getUserProfile(userId)
    if (!profile) return false
    return roles.includes(profile.role)
  }
}

// Modo DEMO - Para probar sin Supabase
export const USE_MOCK_DATA = supabaseUrl === 'https://tu-proyecto.supabase.co'

// Datos mock para modo DEMO
export const mockData = {
  currentUser: {
    id: 'mock-user-1',
    email: 'admin@demo.com',
  },
  profiles: [
    {
      id: 'mock-user-1',
      email: 'admin@demo.com',
      nombre: 'Admin Demo',
      role: 'dueño' as UserRole,
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
    {
      id: 'mock-user-2',
      email: 'manager@demo.com',
      nombre: 'Manager Demo',
      role: 'admin' as UserRole,
      created_at: new Date('2024-01-15').toISOString(),
      updated_at: new Date('2024-01-15').toISOString(),
    },
    {
      id: 'mock-user-3',
      email: 'empleado@demo.com',
      nombre: 'Empleado Demo',
      role: 'empleado' as UserRole,
      created_at: new Date('2024-02-01').toISOString(),
      updated_at: new Date('2024-02-01').toISOString(),
    },
  ],
  contacts: [
    {
      id: 1,
      nombre: 'Carlos Rodríguez',
      email: 'carlos@ejemplo.com',
      telefono: '+34 123 456 789',
      mensaje: 'Me interesa solicitar información sobre sus servicios de construcción. ¿Podrían enviarme un presupuesto?',
      leido: false,
      created_at: new Date('2024-11-18T10:30:00').toISOString(),
    },
    {
      id: 2,
      nombre: 'Ana Martínez',
      email: 'ana.martinez@empresa.com',
      telefono: '+34 987 654 321',
      mensaje: 'Estamos interesados en renovar nuestras oficinas. Necesitamos una reunión para discutir el proyecto.',
      leido: false,
      created_at: new Date('2024-11-19T14:20:00').toISOString(),
    },
    {
      id: 3,
      nombre: 'Pedro García',
      email: 'pedro.garcia@mail.com',
      telefono: undefined,
      mensaje: 'Hola, vi su portfolio y me gustó mucho su trabajo. Me gustaría más información sobre tiempos de entrega.',
      leido: true,
      created_at: new Date('2024-11-15T09:15:00').toISOString(),
    },
    {
      id: 4,
      nombre: 'Laura Sánchez',
      email: 'laura.s@hotmail.com',
      telefono: '+34 555 123 456',
      mensaje: '¿Realizan trabajos de remodelación de viviendas? Necesito renovar mi cocina y baño.',
      leido: true,
      created_at: new Date('2024-11-10T16:45:00').toISOString(),
    },
  ],
  siteContent: [
    {
      id: 1,
      seccion: 'inicio',
      clave: 'titulo-principal',
      valor: 'Bienvenido a Beltrame',
      tipo: 'texto' as const,
      updated_at: new Date('2024-11-01').toISOString(),
    },
    {
      id: 2,
      seccion: 'inicio',
      clave: 'subtitulo',
      valor: 'Expertos en construcción y diseño',
      tipo: 'texto' as const,
      updated_at: new Date('2024-11-01').toISOString(),
    },
    {
      id: 3,
      seccion: 'inicio',
      clave: 'descripcion',
      valor: 'Con más de 20 años de experiencia transformando espacios y construyendo sueños',
      tipo: 'texto' as const,
      updated_at: new Date('2024-11-01').toISOString(),
    },
    {
      id: 4,
      seccion: 'quienes-somos',
      clave: 'titulo',
      valor: 'Quiénes Somos',
      tipo: 'texto' as const,
      updated_at: new Date('2024-10-15').toISOString(),
    },
    {
      id: 5,
      seccion: 'quienes-somos',
      clave: 'descripcion',
      valor: '<p>Somos una empresa familiar dedicada a la construcción y el diseño desde hace más de dos décadas.</p><p>Nuestro compromiso es la excelencia en cada proyecto.</p>',
      tipo: 'html' as const,
      updated_at: new Date('2024-10-15').toISOString(),
    },
    {
      id: 6,
      seccion: 'servicios',
      clave: 'titulo-construccion',
      valor: 'Construcción Integral',
      tipo: 'texto' as const,
      updated_at: new Date('2024-10-20').toISOString(),
    },
    {
      id: 7,
      seccion: 'servicios',
      clave: 'descripcion-construccion',
      valor: 'Proyectos de construcción desde cero con los más altos estándares de calidad',
      tipo: 'texto' as const,
      updated_at: new Date('2024-10-20').toISOString(),
    },
    {
      id: 8,
      seccion: 'contacto',
      clave: 'titulo',
      valor: 'Contáctanos',
      tipo: 'texto' as const,
      updated_at: new Date('2024-09-10').toISOString(),
    },
  ],
  images: [
    {
      name: 'proyecto-1.jpg',
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      size: 245680,
      created_at: new Date('2024-10-01').toISOString(),
    },
    {
      name: 'proyecto-2.jpg',
      url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      size: 312450,
      created_at: new Date('2024-10-05').toISOString(),
    },
    {
      name: 'equipo.jpg',
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
      size: 198720,
      created_at: new Date('2024-09-20').toISOString(),
    },
    {
      name: 'oficina.jpg',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      size: 276890,
      created_at: new Date('2024-09-15').toISOString(),
    },
  ],
  categories: [
    {
      id: 1,
      nombre: 'Barandillas',
      nombre_en: 'Railings',
      slug: 'barandillas',
      descripcion: 'Barandillas de hierro para escaleras y terrazas',
      descripcion_en: 'Iron railings for stairs and terraces',
      imagen_portada: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      orden: 1,
      activa: true,
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
    {
      id: 2,
      nombre: 'Barbacoas',
      nombre_en: 'Barbecues',
      slug: 'barbacoas',
      descripcion: 'Barbacoas de hierro personalizadas',
      descripcion_en: 'Custom iron barbecues',
      imagen_portada: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      orden: 2,
      activa: true,
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
    {
      id: 3,
      nombre: 'Carteles',
      nombre_en: 'Signs',
      slug: 'carteles',
      descripcion: 'Carteles y señalética en hierro',
      descripcion_en: 'Signs and signage in iron',
      imagen_portada: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      orden: 3,
      activa: true,
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
    {
      id: 4,
      nombre: 'Pérgolas',
      nombre_en: 'Pergolas',
      slug: 'pergolas',
      descripcion: 'Pérgolas de hierro para exteriores',
      descripcion_en: 'Iron pergolas for outdoors',
      imagen_portada: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      orden: 4,
      activa: true,
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
  ],
  projects: [
    {
      id: 1,
      categoria_id: 1,
      nombre: 'Pasamanos Moderno',
      nombre_en: 'Modern Handrail',
      descripcion: 'Pasamanos de hierro con diseño minimalista para escalera interior',
      descripcion_en: 'Iron handrail with minimalist design for interior staircase',
      imagenes: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      ],
      orden: 1,
      activo: true,
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
    {
      id: 2,
      categoria_id: 1,
      nombre: 'Barandilla en Escalera',
      nombre_en: 'Staircase Railing',
      descripcion: 'Barandilla de hierro negro forjado para escalera interior',
      descripcion_en: 'Black wrought iron railing for interior staircase',
      imagenes: [
        'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
      ],
      orden: 2,
      activo: true,
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
    {
      id: 3,
      categoria_id: 2,
      nombre: 'Barbacoa Rústica',
      nombre_en: 'Rustic Barbecue',
      descripcion: 'Barbacoa de hierro forjado con diseño rústico y parrilla grande',
      descripcion_en: 'Wrought iron barbecue with rustic design and large grill',
      imagenes: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      ],
      orden: 1,
      activo: true,
      created_at: new Date('2024-01-01').toISOString(),
      updated_at: new Date('2024-01-01').toISOString(),
    },
  ],
}

// Mock Auth Service para modo DEMO
export const mockAuthService = {
  async signIn(_email: string, password: string) {
    // Simular login exitoso
    if (password.length >= 6) {
      return {
        data: {
          user: mockData.currentUser,
          session: { access_token: 'mock-token' }
        },
        error: null
      }
    }
    return {
      data: { user: null, session: null },
      error: { message: 'Credenciales inválidas' }
    }
  },

  async signOut() {
    return { error: null }
  },

  async getCurrentUser() {
    return mockData.currentUser
  },

  async getUserProfile(userId: string): Promise<Profile | null> {
    return mockData.profiles.find(p => p.id === userId) || mockData.profiles[0]
  },

  async hasRole(userId: string, roles: UserRole[]): Promise<boolean> {
    const profile = await this.getUserProfile(userId)
    if (!profile) return false
    return roles.includes(profile.role)
  }
}

// Exportar el servicio correcto según el modo
export const auth = USE_MOCK_DATA ? mockAuthService : authService
