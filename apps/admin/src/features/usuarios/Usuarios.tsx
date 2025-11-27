import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { usersService, type UserProfile, type CreateUserData, type UpdateUserData } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { Switch } from '@beltrame/shared/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@beltrame/shared/ui/select'
import { useToast } from '@beltrame/shared'
import { Trash2, Pencil, Plus, RefreshCw, Users, UserCheck, UserX, Shield } from 'lucide-react'
import { PageHeader } from '../../shared'

type UserRole = 'dueño' | 'admin' | 'empleado'

export default function Usuarios() {
  const [showModal, setShowModal] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<{ userId: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [formData, setFormData] = useState<CreateUserData>({ nombre: '', email: '', password: '', role: 'empleado', is_active: true })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query para obtener usuarios
  const { data: users = [], isLoading, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers(),
  })

  // Mutation para crear usuario
  const createMutation = useMutation({
    mutationFn: (data: CreateUserData) => usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: 'Usuario creado', description: formData.nombre })
      setShowModal(false)
      resetForm()
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  })

  // Mutation para actualizar usuario
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => usersService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: 'Usuario actualizado' })
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  })

  // Mutation para eliminar usuario
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: 'Usuario eliminado' })
      setDeleteUserId(null)
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    }
  })

  function resetForm() {
    setFormData({ nombre: '', email: '', password: '', role: 'empleado', is_active: true })
  }

  function startEditField(userId: string, field: string, currentValue: string) {
    setEditingField({ userId, field })
    setEditValue(currentValue)
  }

  function saveField(userId: string, field: 'nombre' | 'email') {
    if (!editValue.trim()) {
      toast({ title: 'Error', description: 'El campo no puede estar vacio', variant: 'destructive' })
      return
    }
    updateMutation.mutate({ id: userId, data: { [field]: editValue } })
    setEditingField(null)
    setEditValue('')
  }

  function cancelEdit() {
    setEditingField(null)
    setEditValue('')
  }

  function updateUserRole(userId: string, newRole: UserRole) {
    updateMutation.mutate({ id: userId, data: { role: newRole } })
  }

  function toggleUserStatus(userId: string, currentStatus: boolean) {
    updateMutation.mutate({ id: userId, data: { is_active: !currentStatus } })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  function getRoleColor(role: UserRole): string {
    switch (role) {
      case 'dueño': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'empleado': return 'bg-gray-100 text-gray-800'
    }
  }

  // Stats
  const activeUsers = users.filter(u => u.is_active).length
  const adminCount = users.filter(u => u.role === 'admin' || u.role === 'dueño').length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Cargando usuarios...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion de Usuarios"
        description="Gestiona los usuarios del sistema y sus permisos"
        actions={
          <Button onClick={() => { resetForm(); setShowModal(true) }} className="bg-black text-white px-6 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-gray-400" />
            <div>
              <div className="text-2xl font-bold">{users.length}</div>
              <div className="text-sm text-gray-500">Total usuarios</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
              <div className="text-sm text-gray-500">Activos</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <UserX className="w-8 h-8 text-red-400" />
            <div>
              <div className="text-2xl font-bold text-red-600">{users.length - activeUsers}</div>
              <div className="text-sm text-gray-500">Inactivos</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-purple-600">{adminCount}</div>
              <div className="text-sm text-gray-500">Administradores</div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Usuarios
            {isFetching && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
          </h2>
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })} disabled={isFetching}>
            <RefreshCw className={'w-4 h-4 mr-2 ' + (isFetching ? 'animate-spin' : '')} />
            Actualizar
          </Button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Rol</th>
              <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
              <th className="hidden sm:table-cell px-6 py-4 text-left text-sm font-medium text-gray-700">Creado</th>
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
                        <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saveField(user.id, 'nombre'); if (e.key === 'Escape') cancelEdit() }} className="h-8 text-sm" autoFocus />
                        <Button size="sm" onClick={() => saveField(user.id, 'nombre')} className="h-8 px-2">OK</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 px-2">X</Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-medium text-gray-900">{user.nombre}</span>
                        <div className="md:hidden text-xs text-gray-500">{user.email}</div>
                        <button onClick={() => startEditField(user.id, 'nombre', user.nombre)} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    {editingField?.userId === user.id && editingField?.field === 'email' ? (
                      <div className="flex items-center gap-2">
                        <Input type="email" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') saveField(user.id, 'email'); if (e.key === 'Escape') cancelEdit() }} className="h-8" autoFocus />
                        <Button size="sm" onClick={() => saveField(user.id, 'email')} className="h-8 px-2">OK</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="h-8 px-2">X</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">{user.email}</span>
                        <button onClick={() => startEditField(user.id, 'email', user.email)} className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Select value={user.role} onValueChange={(role) => updateUserRole(user.id, role as UserRole)}>
                      <SelectTrigger className={'w-[130px] h-9 border-0 ' + getRoleColor(user.role)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        <SelectItem value="dueño" className="px-3">Dueño</SelectItem>
                        <SelectItem value="admin" className="px-3">Admin</SelectItem>
                        <SelectItem value="empleado" className="px-3">Empleado</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={user.is_active} onCheckedChange={() => toggleUserStatus(user.id, user.is_active)} />
                      <span className={'text-sm ' + (user.is_active ? 'text-green-600' : 'text-gray-400')}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setDeleteUserId(user.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); resetForm() } }}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => { setShowModal(false); resetForm() }}>X</button>
            <h2 className="text-2xl font-bold mb-6">Nuevo Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <Input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select value={formData.role} onValueChange={role => setFormData({ ...formData, role: role as UserRole })}>
                    <SelectTrigger className="w-full h-10 border-gray-300 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-white border border-gray-200 shadow-lg">
                      <SelectItem value="dueño" className="px-3">Dueño</SelectItem>
                      <SelectItem value="admin" className="px-3">Admin</SelectItem>
                      <SelectItem value="empleado" className="px-3">Empleado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2 border-t pt-4">
                <Label htmlFor="activo" className="text-sm font-medium">Usuario Activo</Label>
                <Switch id="activo" checked={formData.is_active} onCheckedChange={is_active => setFormData({ ...formData, is_active })} />
                <span className={'text-sm ' + (formData.is_active ? 'text-green-600' : 'text-gray-400')}>
                  {formData.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creando...' : 'Crear'}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowModal(false); resetForm() }}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {deleteUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={(e) => { if (e.target === e.currentTarget) setDeleteUserId(null) }}>
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setDeleteUserId(null)}>X</button>
            <h2 className="text-2xl font-bold mb-4">Eliminar usuario?</h2>
            <p className="text-gray-600 mb-6">
              Seguro que quieres eliminar a <span className="font-bold">{users.find(u => u.id === deleteUserId)?.nombre}</span>? Esta accion no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => deleteMutation.mutate(deleteUserId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white" disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDeleteUserId(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
