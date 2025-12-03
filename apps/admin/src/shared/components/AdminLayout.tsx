import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth, type Profile, supabase } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { LogOut, Image as ImageIcon, Users, Mail, Package, Menu, X, ExternalLink } from 'lucide-react'
// import { WhatsAppSidebarLink } from './WhatsAppSidebarLink'
import { useToast } from '@beltrame/shared'

// Logo URL desde variable de entorno
const LOGO_URL = import.meta.env.VITE_LOGO_URL || '/beltrame-logo.png'

export default function AdminLayout() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadContactsCount, setUnreadContactsCount] = useState(0)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
    loadUnreadContactsCount()
    
    // Suscribirse a cambios en contact_messages para actualizar el contador
    const channel = supabase
      .channel('contact_messages_badge')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages'
        },
        () => {
          // Recargar contador cuando hay cambios
          loadUnreadContactsCount()
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadProfile = async () => {
    const user = await auth.getCurrentUser()
    if (user) {
      const userProfile = await auth.getUserProfile(user.id)
      setProfile(userProfile)
    }
  }

  const loadUnreadContactsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
      
      if (!error && count !== null) {
        setUnreadContactsCount(count)
      }
    } catch (error) {
      console.error('Error loading unread contacts count:', error)
    }
  }

  const handleLogout = async () => {
    const { error } = await auth.signOut()
    if (!error) {
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      })
      navigate('/admin/login')
    }
  }

  const menuItems = [
    {
      name: 'Contactos',
      href: '/admin/contactos',
      icon: Mail,
      role: ['dueño', 'admin', 'empleado'],
    },
    {
      name: 'Galería',
      href: '/admin/galeria',
      icon: ImageIcon,
      role: ['dueño', 'admin', 'empleado'],
    },
    {
      name: 'Proyectos',
      href: '/admin/proyectos',
      icon: Package,
      role: ['dueño', 'admin', 'empleado'],
    },
    // {
    //   name: 'WP Importer',
    //   href: '/admin/wp-importer',
    //   icon: Download,
    //   role: ['dueño', 'admin'],
    // },
    // {
    //   name: 'Recordatorios',
    //   href: '/recordatorios',
    //   icon: Bell,
    //   role: ['dueño', 'admin'],
    // },
    {
      name: 'Usuarios',
      href: '/admin/usuarios',
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
      {/* Mobile Header con hamburguesa */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-40 h-16 flex items-center justify-between px-4">
        <img src={LOGO_URL} alt="Logo Beltrame" className="h-10 w-auto object-contain" />
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

      {/* Desktop Topbar */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="px-6 lg:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <img src={LOGO_URL} alt="Logo Beltrame" className="h-10 w-auto object-contain" />
          
          {/* Desktop Navigation */}
          <nav className="flex items-center gap-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              const isContactos = item.name === 'Contactos'
              const showBadge = isContactos && unreadContactsCount > 0
              const isProyectos = item.name === 'Proyectos'
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  state={isProyectos ? { resetView: true } : undefined}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-colors relative"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full">
                      {unreadContactsCount > 9 ? '9+' : unreadContactsCount}
                    </span>
                  )}
                </Link>
              )
            })}
            
            {/* Vista Web Button */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-black hover:text-white transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="font-medium">Vista Web</span>
            </a>
          </nav>

          {/* Desktop Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar (desliza desde la izquierda) */}
      <aside className={`
        lg:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile header space */}
          <div className="h-16" />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              const isContactos = item.name === 'Contactos'
              const showBadge = isContactos && unreadContactsCount > 0
              const isProyectos = item.name === 'Proyectos'
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  state={isProyectos ? { resetView: true } : undefined}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-800 hover:bg-black hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {showBadge && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-600 text-white text-xs font-bold rounded-full group-hover:bg-red-500">
                      {unreadContactsCount > 9 ? '+9' : unreadContactsCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
          
          {/* Mobile Logout */}
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
      <main className="pt-20 lg:pt-28 px-4 pb-6 sm:px-6 sm:pb-8 lg:px-12 lg:pb-12">
        <Outlet />
      </main>
    </div>
  )
}
