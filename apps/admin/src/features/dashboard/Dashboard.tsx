import { useEffect, useState } from 'react'
import { auth, type Profile, USE_MOCK_DATA } from '@beltrame/shared'
import { Card, CardDescription, CardHeader, CardTitle } from '@beltrame/shared/ui/card'
import { Users, FileText, Image, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'


export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const user = await auth.getCurrentUser()
      if (user) {
        const userProfile = await auth.getUserProfile(user.id)
        setProfile(userProfile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    )
  }

  const menuItems = [
    {
      title: 'Proyectos',
      description: 'Gestiona los proyectos del sistema',
      icon: FileText,
      href: '/proyectos',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Usuarios',
      description: 'Administra usuarios y permisos',
      icon: Users,
      href: '/usuarios',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Contactos',
      description: 'Ver y gestiona los mensajes recibidos',
      icon: Mail,
      href: '/contactos',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'WhatsApp',
      description: 'Configura la integración de WhatsApp',
      icon: Image,
      href: '/whatsapp',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ]

  // Mostrar todos los items, sin filtrar por rol
  const filteredMenuItems = menuItems

  return (
    <div className="space-y-8">
      {/* Pan de miga */}
      <div className="mb-2">
        <nav className="text-sm text-gray-500 flex items-center space-x-2" aria-label="Breadcrumb">
          <Link to="/" className="hover:underline text-gray-600">Inicio</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Panel de Administración</span>
        </nav>
      </div>
      {USE_MOCK_DATA && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800">
            🎮 Modo DEMO - Usando datos de ejemplo
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Para usar datos reales, configura Supabase en el archivo .env
          </p>
        </div>
      )}
      <div className="mb-4">
        <h1 className="font-extrabold tracking-tight text-gray-900" style={{fontSize: '30px'}}>Panel de Administración</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl ml-0">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} to={item.href}>
              <Card className="rounded-lg bg-white border border-gray-200 cursor-pointer p-0">
                <CardHeader className="flex flex-row items-center py-3 px-2">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 ${item.color}`}> 
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="font-semibold text-left mb-0.5" style={{fontSize: '18px'}}>{item.title}</CardTitle>
                    <CardDescription className="text-left" style={{fontSize: '14px'}}>{item.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
