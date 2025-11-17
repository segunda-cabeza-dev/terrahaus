import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase con valores placeholder
// TODO: Reemplazar con tus credenciales reales de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-anon-key-aqui'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Datos hardcodeados de ejemplo
export const mockData = {
  users: [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'user' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'user' },
  ],
  products: [
    { id: 1, name: 'Producto A', price: 29.99, stock: 50 },
    { id: 2, name: 'Producto B', price: 49.99, stock: 30 },
    { id: 3, name: 'Producto C', price: 19.99, stock: 100 },
  ],
  tasks: [
    { id: 1, title: 'Completar diseño', status: 'completed', priority: 'high' },
    { id: 2, title: 'Revisar código', status: 'in-progress', priority: 'medium' },
    { id: 3, title: 'Documentar API', status: 'pending', priority: 'low' },
  ],
}
