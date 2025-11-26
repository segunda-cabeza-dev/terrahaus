import { useEffect, useState } from 'react'
import { USE_MOCK_DATA, mockData, type Profile, type UserRole } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { Switch } from '@beltrame/shared/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@beltrame/shared/ui/select'
import { useToast } from '@beltrame/shared'
import { Trash2, Pencil } from 'lucide-react'
import { PageHeader } from '../../shared'

interface ExtendedProfile extends Profile {
  activo?: boolean
}

export default function Usuarios() {
  const [users, setUsers] = useState<ExtendedProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<{ userId: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', role: 'empleado' as UserRole, activo: true })
  const { toast } = useToast()

  useEffect(() => {
    const usersWithStatus = USE_MOCK_DATA ? mockData.profiles.map(p => ({ ...p, activo: true })) : []
    setUsers(usersWithStatus)
    setLoading(false)
  }, [])

  function resetForm() {
    setFormData({ nombre: '', email: '', password: '', role: 'empleado', activo: true })
  }

  function startEditField(userId: string, field: string, currentValue: string) {
    setEditingField({ userId, field })
    setEditValue(currentValue)
  }

  function saveField(userId: string, field: 'nombre' | 'email') {
    if (!editValue.trim()) {
      toast({ title: 'Error', description: 'El campo no puede estar vacío', variant: 'destructive' })
      return
    }

    setUsers(users.map(u => u.id === userId ? { ...u, [field]: editValue } : u))
    setEditingField(null)
    setEditValue('')
    toast({ title: 'Campo actualizado', description: `${field} actualizado correctamente` })
  }

  function cancelEdit() {
    setEditingField(null)
    setEditValue('')
  }

  function updateUserRole(userId: string, newRole: UserRole) {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    toast({ title: 'Rol actualizado', description: 'El rol del usuario ha sido actualizado' })
  }

  function handleDelete(id: string) {
    setUsers(users.filter(u => u.id !== id))
    setDeleteUserId(null)
    toast({ title: 'Usuario eliminado' })
  }

  function toggleUserStatus(userId: string) {
    const user = users.find(u => u.id === userId)
    const newStatus = !user?.activo
    setUsers(users.map(u => u.id === userId ? { ...u, activo: newStatus } : u))
    toast({ 
      title: newStatus ? 'Usuario activado' : 'Usuario desactivado',
      description: user?.nombre
    })
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de Usuarios"
        description="Gestiona los usuarios del sistema y sus permisos"
        actions={
          <Button onClick={() => { resetForm(); setShowModal(true) }} className="bg-black text-white px-6 py-2">
            Nuevo Usuario
          </Button>
        }
      />
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Rol</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Creado</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No hay usuarios</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {editingField?.userId === user.id && editingField?.field === 'nombre' ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveField(user.id, 'nombre')
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          className="h-8"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => saveField(user.id, 'nombre')} className="h-8 px-2">✓</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 px-2">✕</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <span className="font-medium text-gray-900">{user.nombre}</span>
                        <button 
                          onClick={() => startEditField(user.id, 'nombre', user.nombre)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingField?.userId === user.id && editingField?.field === 'email' ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveField(user.id, 'email')
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          className="h-8"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => saveField(user.id, 'email')} className="h-8 px-2">✓</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 px-2">✕</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <span className="text-gray-600">{user.email}</span>
                        <button 
                          onClick={() => startEditField(user.id, 'email', user.email)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Select value={user.role} onValueChange={(role) => updateUserRole(user.id, role as UserRole)}>
                      <SelectTrigger className="w-[160px] h-9 border-gray-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg min-w-[160px]">
                        <SelectItem value="dueño">
                          Dueño
                        </SelectItem>
                        <SelectItem value="admin">
                          Admin
                        </SelectItem>
                        <SelectItem value="empleado">
                          Empleado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={user.activo ?? true}
                        onCheckedChange={() => toggleUserStatus(user.id)}
                      />
                      <span className={`text-sm ${user.activo ? 'text-green-600' : 'text-gray-400'}`}>
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setDeleteUserId(user.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
              resetForm()
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => { setShowModal(false); resetForm() }}>×</button>
            <h2 className="text-2xl font-bold mb-6">Nuevo Usuario</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              // Crear nuevo usuario
              const newUser: ExtendedProfile = {
                id: `user-${Date.now()}`,
                nombre: formData.nombre,
                email: formData.email,
                role: formData.role,
                activo: formData.activo,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
              setUsers([...users, newUser])
              toast({ title: 'Usuario creado', description: formData.nombre })
              setShowModal(false)
              resetForm()
            }} className="space-y-4">
              {/* Grid de 2 columnas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contraseña</Label>
                  <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select value={formData.role} onValueChange={role => setFormData({ ...formData, role: role as UserRole })}>
                    <SelectTrigger className="w-full h-10 border-gray-300 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="dueño">
                        Dueño
                      </SelectItem>
                      <SelectItem value="admin">
                        Admin
                      </SelectItem>
                      <SelectItem value="empleado">
                        Empleado
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-3 py-2 border-t pt-4">
                <Label htmlFor="activo" className="text-sm font-medium">Usuario Activo</Label>
                <Switch 
                  id="activo"
                  checked={formData.activo}
                  onCheckedChange={activo => setFormData({ ...formData, activo })}
                />
                <span className={`text-sm ${formData.activo ? 'text-green-600' : 'text-gray-400'}`}>
                  {formData.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800">Crear</Button>
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm() }}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de confirmación de eliminación */}
      {deleteUserId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteUserId(null)
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" 
              onClick={() => setDeleteUserId(null)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">¿Eliminar usuario?</h2>
            <p className="text-gray-600 mb-6">
              ¿Seguro que quieres eliminar a <span className="font-bold">{users.find(u => u.id === deleteUserId)?.nombre}</span>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => handleDelete(deleteUserId)} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDeleteUserId(null)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
