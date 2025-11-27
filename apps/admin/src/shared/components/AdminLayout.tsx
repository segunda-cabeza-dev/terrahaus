import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth, type Profile } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { LogOut, Image as ImageIcon, Users, Mail, Package, Menu, X } from 'lucide-react'
import { WhatsAppSidebarLink } from './WhatsAppSidebarLink'
import { useToast } from '@beltrame/shared'

export default function AdminLayout() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
      name: 'Contactos',
      href: '/contactos',
      icon: Mail,
      role: ['dueño', 'admin', 'empleado'],
    },
    {
      name: 'Galería',
      href: '/galeria',
      icon: ImageIcon,
      role: ['dueño', 'admin', 'empleado'],
    },
    {
      name: 'Proyectos',
      href: '/productos',
      icon: Package,
      role: ['dueño', 'admin', 'empleado'],
    },
    // {
    //   name: 'Recordatorios',
    //   href: '/recordatorios',
    //   icon: Bell,
    //   role: ['dueño', 'admin'],
    // },
    {
      name: 'Usuarios',
      href: '/usuarios',
      icon: Users,
      role: ['dueño', 'admin'],
    },
  ]

  const filteredMenuItems = menuItems.filter(item =>
    profile && item.role.includes(profile.role)
  )

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 h-16 flex items-center justify-between px-4">
        <img src="/beltrame-logo.png" alt="Logo Beltrame" className="h-10 w-auto object-contain" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-800" />
          ) : (
            <Menu className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo - Hidden on mobile (shown in header instead) */}
          <div className="hidden lg:flex p-6 border-b items-center justify-center">
            <img src="/beltrame-logo.png" alt="Logo Beltrame" className="h-16 w-auto object-contain" />
          </div>

          {/* Mobile header space */}
          <div className="lg:hidden h-16" />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-800 hover:bg-black hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            {/* WhatsApp Sidebar Link */}
            <div onClick={closeMobileMenu}>
              <WhatsAppSidebarLink className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-800 hover:bg-black hover:text-white transition-colors" />
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button
              onClick={() => {
                handleLogout()
                closeMobileMenu()
              }}
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
      <main className="lg:ml-64 pt-24 lg:pt-0 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
