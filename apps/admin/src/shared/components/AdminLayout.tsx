import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth, type Profile } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { LogOut, LayoutDashboard, Users, FileText, Image, Mail, Package } from 'lucide-react'
import { WhatsAppSidebarLink } from './WhatsAppSidebarLink'
import { useToast } from '@beltrame/shared'

export default function AdminLayout() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const user = await auth.getCurrentUser()
    if (user) {
      const userProfile = await auth.getUserProfile(user.id)
      setProfile(userProfile)
    }
  }

  const handleLogout = async () => {
    const { error } = await auth.signOut()
    if (!error) {
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      })
      navigate('/login')
    }
  }

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      role: ['dueño', 'admin', 'empleado'],
    },
    {
      name: 'Usuarios',
      href: '/usuarios',
      icon: Users,
      role: ['dueño', 'admin'],
    },
    {
      name: 'Proyectos',
      href: '/productos',
      icon: Package,
      role: ['dueño', 'admin', 'empleado'],
    },
    {
      name: 'Contactos',
      href: '/contactos',
      icon: Mail,
      role: ['dueño', 'admin', 'empleado'],
    },
  ]

  const filteredMenuItems = menuItems.filter(item =>
    profile && item.role.includes(profile.role)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b flex flex-col items-start">
            <img src="/beltrame-logo.png" alt="Logo Beltrame" className="h-20 w-auto mb-4" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg font-bold text-gray-800 hover:bg-black hover:text-white transition-colors"
                  style={{ fontWeight: 700 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            {/* WhatsApp Sidebar Link */}
            <WhatsAppSidebarLink className="font-bold text-gray-800 hover:bg-black hover:text-white transition-colors" />
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
