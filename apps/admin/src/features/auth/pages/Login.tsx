import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { auth, USE_MOCK_DATA } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { Card, CardContent } from '@beltrame/shared/ui/card'
import { useToast } from '@beltrame/shared'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await auth.signIn(email, password)

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
        return
      }

      if (data.user) {
        toast({
          title: 'Bienvenido',
          description: 'Inicio de sesión exitoso',
        })
        navigate('/admin')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ha ocurrido un error inesperado',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/terrahaus-logo.png" 
              alt="Terrahaus Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-sm text-gray-500">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        {/* Card del formulario */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-6 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@beltrame.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 px-4 border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 px-4 pr-12 border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      toast({
                        title: 'Recuperación de contraseña',
                        description: 'Contacta al administrador del sistema para restablecer tu contraseña.',
                      })
                    }}
                    className="text-sm text-gray-600 hover:text-black transition-colors font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 mt-6" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            {USE_MOCK_DATA && (
              <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎮</span>
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      MODO DEMO ACTIVADO
                    </p>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>
                        <span className="font-medium">Email:</span>{' '}
                        <code className="bg-blue-100 px-1.5 py-0.5 rounded">admin@demo.com</code>
                      </p>
                      <p>
                        <span className="font-medium">Contraseña:</span>{' '}
                        <code className="bg-blue-100 px-1.5 py-0.5 rounded">cualquiera (min. 6 caracteres)</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Terrahaus. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
