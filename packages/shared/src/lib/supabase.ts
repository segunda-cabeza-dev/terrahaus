import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://api.segundacabeza.net'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZmF1bHQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc2MzkxNzk5NiwiZXhwIjoyMDc5Mjc3OTk2fQ.SX8rgU4H7f8b1q-eWeP8xF97gpyUGzrQ6EZvYuT9MrQ'

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
  id: string
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  leido: boolean
  notas?: string
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
  nombre_it?: string
  slug: string
  descripcion?: string
  descripcion_en?: string
  descripcion_it?: string
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
  nombre_it?: string
  descripcion?: string
  descripcion_en?: string
  descripcion_it?: string
  imagenes?: string[] // Array de URLs de imágenes
  orden: number
  activo: boolean
  created_at: string
  updated_at: string
}

export interface MediaFile {
  id: number
  name: string
  url: string
  size: number
  type: string
  active: boolean
  thumbnail_url?: string
  medium_url?: string
  large_url?: string
  created_at: string
  updated_at: string
}

export interface ImageUsage {
  type: 'project' | 'category' | 'product'
  id: number
  name: string
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
export const USE_MOCK_DATA = supabaseUrl === 'https://tu-proyecto.supabase.co' || supabaseUrl === 'https://api.segundacabeza.net'

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
      id: 'mock-contact-1',
      nombre: 'Carlos Rodríguez',
      email: 'carlos@ejemplo.com',
      telefono: '+34 123 456 789',
      mensaje: 'Me interesa solicitar información sobre sus servicios de construcción. ¿Podrían enviarme un presupuesto?',
      leido: false,
      created_at: new Date('2024-11-18T10:30:00').toISOString(),
    },
    {
      id: 'mock-contact-2',
      nombre: 'Ana Martínez',
      email: 'ana.martinez@empresa.com',
      telefono: '+34 987 654 321',
      mensaje: 'Estamos interesados en renovar nuestras oficinas. Necesitamos una reunión para discutir el proyecto.',
      leido: false,
      created_at: new Date('2024-11-19T14:20:00').toISOString(),
    },
    {
      id: 'mock-contact-3',
      nombre: 'Pedro García',
      email: 'pedro.garcia@mail.com',
      telefono: undefined,
      mensaje: 'Hola, vi su portfolio y me gustó mucho su trabajo. Me gustaría más información sobre tiempos de entrega.',
      leido: true,
      created_at: new Date('2024-11-15T09:15:00').toISOString(),
    },
    {
      id: 'mock-contact-4',
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
    { id: 1, nombre: 'Barandillas', nombre_en: 'Railings', slug: 'barandillas', descripcion: 'Barandillas de hierro', descripcion_en: 'Iron railings', imagen_portada: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600', orden: 1, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, nombre: 'Barbacoas', nombre_en: 'BBQ', slug: 'barbacoas', descripcion: 'Barbacoas de hierro', descripcion_en: 'Iron BBQ', imagen_portada: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', orden: 2, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, nombre: 'Carteles', nombre_en: 'Signs', slug: 'carteles', descripcion: 'Carteles metálicos', descripcion_en: 'Metal signs', imagen_portada: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', orden: 3, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 4, nombre: 'Cobre', nombre_en: 'Copper', slug: 'cobre', descripcion: 'Trabajos en cobre', descripcion_en: 'Copper work', imagen_portada: 'https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?w=600', orden: 4, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 5, nombre: 'Corte Láser', nombre_en: 'Laser Cutting', slug: 'corte-laser', descripcion: 'Precisión con corte láser', descripcion_en: 'Laser cutting precision', imagen_portada: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600', orden: 5, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 6, nombre: 'Cristaleras y Cerramientos', nombre_en: 'Glass Walls', slug: 'cristaleras', descripcion: 'Cristaleras metálicas', descripcion_en: 'Metal glass walls', imagen_portada: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600', orden: 6, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 7, nombre: 'Escaleras', nombre_en: 'Stairs', slug: 'escaleras', descripcion: 'Escaleras metálicas', descripcion_en: 'Metal stairs', imagen_portada: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600', orden: 7, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 8, nombre: 'Espejos', nombre_en: 'Mirrors', slug: 'espejos', descripcion: 'Espejos con marcos metálicos', descripcion_en: 'Mirrors with metal frames', imagen_portada: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600', orden: 8, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 9, nombre: 'Fogoneros', nombre_en: 'Fire Pits', slug: 'fogoneros', descripcion: 'Fogoneros decorativos', descripcion_en: 'Decorative fire pits', imagen_portada: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600', orden: 9, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 10, nombre: 'Latón', nombre_en: 'Brass', slug: 'laton', descripcion: 'Trabajos en latón', descripcion_en: 'Brass work', imagen_portada: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600', orden: 10, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 11, nombre: 'Mamparas', nombre_en: 'Shower Screens', slug: 'mamparas', descripcion: 'Mamparas de baño', descripcion_en: 'Bathroom screens', imagen_portada: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600', orden: 11, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 12, nombre: 'Muebles', nombre_en: 'Furniture', slug: 'muebles', descripcion: 'Muebles de hierro y madera', descripcion_en: 'Iron and wood furniture', imagen_portada: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600', orden: 12, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 13, nombre: 'Pérgolas', nombre_en: 'Pergolas', slug: 'pergolas', descripcion: 'Pérgolas metálicas', descripcion_en: 'Metal pergolas', imagen_portada: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600', orden: 13, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 14, nombre: 'Puertas', nombre_en: 'Doors', slug: 'puertas', descripcion: 'Puertas metálicas', descripcion_en: 'Metal doors', imagen_portada: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600', orden: 14, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 15, nombre: 'Tarimas', nombre_en: 'Platforms', slug: 'tarimas', descripcion: 'Tarimas y plataformas', descripcion_en: 'Platforms', imagen_portada: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600', orden: 15, activa: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  projects: [
    // Barandillas - 12 proyectos
    { id: 1, categoria_id: 1, nombre: 'Pasamanos', nombre_en: 'Handrail', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'], slug: 'pasamanos', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, categoria_id: 1, nombre: 'Barandilla en escalera', nombre_en: 'Stair railing', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600'], slug: 'barandilla-escalera-1', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, categoria_id: 1, nombre: 'Barandilla en terraza', nombre_en: 'Terrace railing', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'], slug: 'barandilla-terraza-1', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 4, categoria_id: 1, nombre: 'Barandilla Orgánica', nombre_en: 'Organic railing', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'], slug: 'barandilla-organica', orden: 4, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 5, categoria_id: 1, nombre: 'Barandilla en escalera de madera', nombre_en: 'Wood stair railing', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600'], slug: 'barandilla-madera', orden: 5, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 6, categoria_id: 1, nombre: 'Barandilla en escalera de piedras', nombre_en: 'Stone stair railing', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'], slug: 'barandilla-piedras', orden: 6, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 7, categoria_id: 1, nombre: 'Barandilla de interior', nombre_en: 'Interior railing', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'], slug: 'barandilla-interior', orden: 7, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 8, categoria_id: 1, nombre: 'Barandilla', nombre_en: 'Railing', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'], slug: 'barandilla-8', orden: 8, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Barbacoas - 7 proyectos
    { id: 10, categoria_id: 2, nombre: 'Barbacoa', nombre_en: 'BBQ', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'], slug: 'barbacoa-1', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 11, categoria_id: 2, nombre: 'Barbacoa Rustica', nombre_en: 'Rustic BBQ', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'], slug: 'barbacoa-rustica', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 12, categoria_id: 2, nombre: 'Barbacoa con hierro negro', nombre_en: 'Black iron BBQ', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'], slug: 'barbacoa-hierro-negro', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 13, categoria_id: 2, nombre: 'Barbacoa BBBQ', nombre_en: 'BBBQ', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'], slug: 'barbacoa-bbbq', orden: 4, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 14, categoria_id: 2, nombre: 'Barbacoa de acero inoxidable con campana', nombre_en: 'Stainless steel BBQ', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'], slug: 'barbacoa-inoxidable', orden: 5, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 15, categoria_id: 2, nombre: 'Barbacoa con mueble incorporado', nombre_en: 'BBQ with furniture', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'], slug: 'barbacoa-mueble', orden: 6, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 16, categoria_id: 2, nombre: 'Barbacoa empotrada', nombre_en: 'Built-in BBQ', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600'], slug: 'barbacoa-empotrada', orden: 7, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Carteles - 21 proyectos
    { id: 20, categoria_id: 3, nombre: 'Cartel Villa Cupina', nombre_en: 'Villa Cupina Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-villa-cupina', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 21, categoria_id: 3, nombre: 'Cartel Villa Clara', nombre_en: 'Villa Clara Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-villa-clara', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 22, categoria_id: 3, nombre: 'Cartel Solivera', nombre_en: 'Solivera Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-solivera', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 23, categoria_id: 3, nombre: 'Cartel Sir Fausto', nombre_en: 'Sir Fausto Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-sir-fausto', orden: 4, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 24, categoria_id: 3, nombre: 'Cartel San Pedro', nombre_en: 'San Pedro Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-san-pedro', orden: 5, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 25, categoria_id: 3, nombre: 'Cartel Morena', nombre_en: 'Morena Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-morena', orden: 6, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 26, categoria_id: 3, nombre: 'Cartel Love', nombre_en: 'Love Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-love', orden: 7, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 27, categoria_id: 3, nombre: 'Cartel La Tiendita', nombre_en: 'La Tiendita Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-la-tiendita', orden: 8, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 28, categoria_id: 3, nombre: 'Cartel Ibiza Campo', nombre_en: 'Ibiza Campo Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-ibiza-campo', orden: 9, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 29, categoria_id: 3, nombre: 'Cartel Ferre construcciones', nombre_en: 'Ferre construcciones', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-ferre', orden: 10, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 30, categoria_id: 3, nombre: 'Cartel Es bistro', nombre_en: 'Es bistro Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-es-bistro', orden: 11, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 31, categoria_id: 3, nombre: 'Cartel El Chiquitin', nombre_en: 'El Chiquitin', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-el-chiquitin', orden: 12, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 32, categoria_id: 3, nombre: 'Cas Furmente', nombre_en: 'Cas Furmente', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cas-furmente', orden: 13, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 33, categoria_id: 3, nombre: 'Carteles Minimal', nombre_en: 'Minimal Signs', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'carteles-minimal', orden: 14, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 34, categoria_id: 3, nombre: 'Can Vich de Dalt', nombre_en: 'Can Vich de Dalt', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'can-vich-de-dalt', orden: 15, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 35, categoria_id: 3, nombre: 'Can Lobo', nombre_en: 'Can Lobo', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'can-lobo', orden: 16, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 36, categoria_id: 3, nombre: 'Cartel Can Cuine', nombre_en: 'Can Cuine Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-can-cuine', orden: 17, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 37, categoria_id: 3, nombre: 'Cartel Can California', nombre_en: 'Can California', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-can-california', orden: 18, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 38, categoria_id: 3, nombre: 'Cartel Bloom studio', nombre_en: 'Bloom studio', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-bloom-studio', orden: 19, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 39, categoria_id: 3, nombre: 'Cartel Berlina', nombre_en: 'Berlina Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-berlina', orden: 20, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 40, categoria_id: 3, nombre: 'Cartel 2k20', nombre_en: '2k20 Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'], slug: 'cartel-2k20', orden: 21, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Cobre - 4 proyectos
    { id: 45, categoria_id: 4, nombre: 'Puerta de cobre', nombre_en: 'Copper door', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?w=600'], slug: 'puerta-cobre-1', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 46, categoria_id: 4, nombre: 'Soporte para elementos de cocina', nombre_en: 'Kitchen support', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?w=600'], slug: 'soporte-cocina', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 47, categoria_id: 4, nombre: 'Repisa en Cobre', nombre_en: 'Copper shelf', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?w=600'], slug: 'repisa-cobre', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Corte Láser - 7 proyectos
    { id: 50, categoria_id: 5, nombre: 'Mascara para frente local', nombre_en: 'Store front mask', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600'], slug: 'mascara-frente-local', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 51, categoria_id: 5, nombre: 'Simbolo Corte Laser', nombre_en: 'Laser Symbol', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600'], slug: 'simbolo-corte-laser', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 52, categoria_id: 5, nombre: 'Piso en Corte Laser', nombre_en: 'Laser Floor', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600'], slug: 'piso-corte-laser', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 53, categoria_id: 5, nombre: 'Pieza Corte Laser', nombre_en: 'Laser Piece', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600'], slug: 'pieza-corte-laser', orden: 4, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 54, categoria_id: 5, nombre: 'Elementos en Corte Laser', nombre_en: 'Laser Elements', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600'], slug: 'elementos-corte-laser', orden: 5, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 55, categoria_id: 5, nombre: 'Corte Laser', nombre_en: 'Laser Cut', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600'], slug: 'corte-laser-6', orden: 6, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 56, categoria_id: 5, nombre: 'Cartel Corte Laser', nombre_en: 'Laser Sign', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=600'], slug: 'cartel-corte-laser', orden: 7, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Cristaleras - 13 proyectos
    { id: 60, categoria_id: 6, nombre: 'Cristalera divisoria', nombre_en: 'Divider glass', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600'], slug: 'cristalera-divisoria', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 61, categoria_id: 6, nombre: 'Cristalera repartida', nombre_en: 'Divided glass', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600'], slug: 'cristalera-repartida', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 62, categoria_id: 6, nombre: 'Cristalera hierro negro', nombre_en: 'Black iron glass', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600'], slug: 'cristalera-hierro-negro', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 63, categoria_id: 6, nombre: 'Ventana', nombre_en: 'Window', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600'], slug: 'ventana', orden: 4, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 64, categoria_id: 6, nombre: 'Cerramiento', nombre_en: 'Enclosure', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600'], slug: 'cerramiento', orden: 5, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Espejos - 9 proyectos
    { id: 70, categoria_id: 8, nombre: 'Espejo de baño', nombre_en: 'Bathroom mirror', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=600'], slug: 'espejo-bano-1', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 71, categoria_id: 8, nombre: 'Espejos gemelos', nombre_en: 'Twin mirrors', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=600'], slug: 'espejos-gemelos', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 72, categoria_id: 8, nombre: 'Espejo horizontal', nombre_en: 'Horizontal mirror', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=600'], slug: 'espejo-horizontal', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 73, categoria_id: 8, nombre: 'Espejo Circular', nombre_en: 'Circular mirror', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=600'], slug: 'espejo-circular', orden: 4, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 74, categoria_id: 8, nombre: 'Espejo Vertical', nombre_en: 'Vertical mirror', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=600'], slug: 'espejo-vertical', orden: 5, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Fogoneros - 3 proyectos
    { id: 80, categoria_id: 9, nombre: 'Fogonero Circular de hojas', nombre_en: 'Leaf circular fire pit', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600'], slug: 'fogonero-hojas', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 81, categoria_id: 9, nombre: 'Fogonero Circular Can California', nombre_en: 'Can California fire pit', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600'], slug: 'fogonero-can-california', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 82, categoria_id: 9, nombre: 'Fogonero Circular PC', nombre_en: 'PC circular fire pit', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600'], slug: 'fogonero-pc', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Latón - 10 proyectos
    { id: 90, categoria_id: 10, nombre: 'Riel de latón', nombre_en: 'Brass rail', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'], slug: 'riel-laton', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 91, categoria_id: 10, nombre: 'Pérgola de Latón', nombre_en: 'Brass Pergola', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'], slug: 'pergola-laton', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 92, categoria_id: 10, nombre: 'Pared de Latón', nombre_en: 'Brass Wall', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'], slug: 'pared-laton', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 93, categoria_id: 10, nombre: 'Mesa Latón', nombre_en: 'Brass Table', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'], slug: 'mesa-laton', orden: 4, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 94, categoria_id: 10, nombre: 'Barra de Latón', nombre_en: 'Brass Bar', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'], slug: 'barra-laton', orden: 5, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Mamparas - 4 proyectos
    { id: 100, categoria_id: 11, nombre: 'Mampara baño', nombre_en: 'Shower screen', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600'], slug: 'mampara-bano-1', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 101, categoria_id: 11, nombre: 'Mampara baño moderna', nombre_en: 'Modern shower screen', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600'], slug: 'mampara-bano-2', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Muebles - 21 proyectos
    { id: 110, categoria_id: 12, nombre: 'Silla de Hierro Minimalista', nombre_en: 'Minimalist Chair', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600'], slug: 'silla-hierro', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 111, categoria_id: 12, nombre: 'Muebles de baño', nombre_en: 'Bathroom furniture', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600'], slug: 'muebles-bano', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 112, categoria_id: 12, nombre: 'Mueble de hierro y madera', nombre_en: 'Iron and wood furniture', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600'], slug: 'mueble-hierro-madera', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 113, categoria_id: 12, nombre: 'Mostrador de hierro', nombre_en: 'Iron counter', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600'], slug: 'mostrador-hierro-1', orden: 4, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 114, categoria_id: 12, nombre: 'Mesa de trabajo', nombre_en: 'Work table', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600'], slug: 'mesa-trabajo', orden: 5, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 115, categoria_id: 12, nombre: 'Mesa de hierro', nombre_en: 'Iron table', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600'], slug: 'mesa-hierro', orden: 6, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 116, categoria_id: 12, nombre: 'Mesa circular exterior', nombre_en: 'Outdoor table', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600'], slug: 'mesa-circular', orden: 7, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 117, categoria_id: 12, nombre: 'Lampara Moderna de Hierro', nombre_en: 'Modern Lamp', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600'], slug: 'lampara-moderna', orden: 8, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 118, categoria_id: 12, nombre: 'Barra de Cocina', nombre_en: 'Kitchen Bar', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600'], slug: 'barra-cocina', orden: 9, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Pérgolas - 11 proyectos
    { id: 130, categoria_id: 13, nombre: 'Pérgola', nombre_en: 'Pergola', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600'], slug: 'pergola-1', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 131, categoria_id: 13, nombre: 'Pérgola con madera', nombre_en: 'Pergola with wood', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600'], slug: 'pergola-madera', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 132, categoria_id: 13, nombre: 'Pérgola moderna', nombre_en: 'Modern pergola', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600'], slug: 'pergola-moderna', orden: 3, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Puertas - 2 proyectos
    { id: 140, categoria_id: 14, nombre: 'Puerta', nombre_en: 'Door', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600'], slug: 'puerta-1', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 141, categoria_id: 14, nombre: 'Puerta moderna', nombre_en: 'Modern door', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600'], slug: 'puerta-2', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    // Tarimas - 2 proyectos
    { id: 150, categoria_id: 15, nombre: 'Tarima Rectangular', nombre_en: 'Rectangular Platform', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600'], slug: 'tarima-rectangular', orden: 1, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 151, categoria_id: 15, nombre: 'Tarima Circular', nombre_en: 'Circular Platform', descripcion: '', descripcion_en: '', imagenes: ['https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600'], slug: 'tarima-circular', orden: 2, activo: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
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
