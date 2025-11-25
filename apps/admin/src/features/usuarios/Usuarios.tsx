import { useEffect, useState } from 'react'
import { USE_MOCK_DATA, mockData, type Profile, type UserRole } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { Badge } from '@beltrame/shared/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@beltrame/shared/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@beltrame/shared/ui/select'
import { useToast } from '@beltrame/shared'
import { Pencil, Trash2 } from 'lucide-react'

export default function Usuarios() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '', role: 'empleado' as UserRole })
  const { toast } = useToast()

  useEffect(() => {
    setTimeout(() => {
      setUsers(USE_MOCK_DATA ? mockData.profiles : [])
      setLoading(false)
    }, 500)
  }, [])

  function resetForm() {
    setFormData({ nombre: '', email: '', password: '', role: 'empleado' })
  }

  function startEdit(user: Profile) {
    setEditingUser(user)
    setFormData({ nombre: user.nombre, email: user.email, password: '', role: user.role })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingUser) {
      toast({ title: 'Usuario editado', description: formData.nombre })
    } else {
      toast({ title: 'Usuario creado', description: formData.nombre })
    }
    setShowModal(false)
    setEditingUser(null)
    resetForm()
  }

  function handleDelete(id: string) {
    setUsers(users.filter(u => u.id !== id))
    toast({ title: 'Usuario eliminado' })
  }

  function getRoleBadgeColor(role: UserRole) {
    switch (role) {
      case 'dueño': return 'bg-yellow-100 text-yellow-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="flex flex-col gap-8 px-10 pt-8 pb-12 min-h-screen bg-gray-50">
      <nav className="text-sm text-gray-500 flex items-center space-x-2 mb-2">
        <a href="/dashboard" className="hover:underline text-gray-600">Panel de Administración</a>
        <span>/</span>
        <span className="text-gray-800 font-medium">Usuarios</span>
      </nav>
      <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
      <div className="flex justify-end">
        <Button onClick={() => { setEditingUser(null); resetForm(); setShowModal(true) }} className="bg-black text-white px-6 py-2">Nuevo Usuario</Button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Rol</th>
              <th className="px-6 py-3 text-left">Creado</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400">No hay usuarios</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{user.nombre}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3"><Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge></td>
                  <td className="px-6 py-3 text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { startEdit(user); setShowModal(true) }}><Pencil className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="sm" variant="outline" className="text-red-600"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                          <AlertDialogDescription>¿Seguro que quieres eliminar a <span className="font-bold">{user.nombre}</span>?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(user.id)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => { setShowModal(false); setEditingUser(null); resetForm() }}>×</button>
            <h2 className="text-2xl font-bold mb-6">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label>Nombre</Label>
                <Input value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required disabled={!!editingUser} />
              </div>
              {!editingUser && (
                <div>
                  <Label>Contraseña</Label>
                  <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                </div>
              )}
              <div>
                <Label>Rol</Label>
                <Select value={formData.role} onValueChange={role => setFormData({ ...formData, role: role as UserRole })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dueño">Dueño</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="empleado">Empleado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-black text-white">{editingUser ? 'Guardar' : 'Crear'}</Button>
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); setEditingUser(null); resetForm() }}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
