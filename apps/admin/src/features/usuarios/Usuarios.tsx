import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  usersService,
  type CreateUserData,
  type UpdateUserData,
  type UserRole,
  type UserProfile
} from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { Switch } from '@beltrame/shared/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@beltrame/shared/ui/select'
import { useToast } from '@beltrame/shared'
import {
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  UserCheck,
  UserX,
  Users
} from 'lucide-react'

import { PageHeader } from '../../shared'

type EditingField = {
  userId: string
  field: 'full_name' | 'email'
}

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Dueno',
  admin: 'Admin',
  employee: 'Empleado'
}

const ROLE_OPTIONS: UserRole[] = ['owner', 'admin', 'employee']

const DEFAULT_FORM: CreateUserData = {
  full_name: '',
  email: '',
  password: '',
  role: 'employee',
  is_active: true
}

export default function Usuarios() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [showModal, setShowModal] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<EditingField | null>(null)
  const [editValue, setEditValue] = useState('')
  const [formData, setFormData] = useState<CreateUserData>({ ...DEFAULT_FORM })

  const { data: users = [], isLoading, isFetching, refetch } = useQuery<UserProfile[]>({
    queryKey: ['users'],
    queryFn: () => usersService.getUsers()
  })

  const statusColumnEnabled =
    usersService.hasStatusColumn() || users.some(user => user.is_active !== undefined)

  const stats = useMemo(() => {
    const total = users.length
    const adminCount = users.filter(user => user.role === 'admin' || user.role === 'owner').length
    const active = users.filter(user => user.is_active ?? true).length
    const inactive = total - active

    return {
      total,
      adminCount,
      activeDisplay: statusColumnEnabled ? String(active) : '--',
      inactiveDisplay: statusColumnEnabled ? String(inactive) : '--',
      showStatus: statusColumnEnabled
    }
  }, [users, statusColumnEnabled])

  const createMutation = useMutation<UserProfile, Error, CreateUserData>({
    mutationFn: payload => usersService.createUser(payload),
    onSuccess: createdUser => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: 'Usuario creado', description: createdUser.full_name })
      setShowModal(false)
      resetForm()
    },
    onError: error => {
      toast({ title: 'Error al crear usuario', description: error.message, variant: 'destructive' })
    }
  })

  const updateMutation = useMutation<UserProfile, Error, { id: string; data: UpdateUserData }>({
    mutationFn: ({ id, data }) => usersService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: 'Usuario actualizado' })
      setEditingField(null)
      setEditValue('')
    },
    onError: error => {
      toast({ title: 'Error al actualizar usuario', description: error.message, variant: 'destructive' })
    }
  })

  const deleteMutation = useMutation<boolean, Error, string>({
    mutationFn: id => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({ title: 'Usuario eliminado' })
      setDeleteUserId(null)
    },
    onError: error => {
      toast({ title: 'Error al eliminar usuario', description: error.message, variant: 'destructive' })
    }
  })

  function resetForm() {
    setFormData({ ...DEFAULT_FORM })
  }

  function startEditField(userId: string, field: EditingField['field'], currentValue: string) {
    setEditingField({ userId, field })
    setEditValue(currentValue)
  }

  function saveField(userId: string, field: EditingField['field']) {
    const trimmedValue = editValue.trim()

    if (!trimmedValue) {
      toast({
        title: 'Dato requerido',
        description: 'El campo no puede estar vacio',
        variant: 'destructive'
      })
      return
    }

    const payload: UpdateUserData =
      field === 'full_name' ? { full_name: trimmedValue } : { email: trimmedValue }

    updateMutation.mutate({ id: userId, data: payload })
  }

  function cancelEdit() {
    setEditingField(null)
    setEditValue('')
  }

  function updateUserRole(userId: string, role: UserRole) {
    updateMutation.mutate({ id: userId, data: { role } })
  }

  function toggleUserStatus(userId: string, newStatus: boolean) {
    if (!statusColumnEnabled) return
    updateMutation.mutate({ id: userId, data: { is_active: newStatus } })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createMutation.mutate({
      ...formData,
      email: formData.email.trim(),
      full_name: formData.full_name.trim()
    })
  }

  function getRoleColor(role: UserRole) {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800'
      case 'admin':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <span className="ml-3 text-gray-500">Cargando usuarios...</span>
      </div>
    )
  }

  const userPendingDeletion = deleteUserId
    ? users.find(user => user.id === deleteUserId)
    : null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion de Usuarios"
        description="Visualiza, crea y administra los perfiles del equipo"
        actions={
          <Button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="bg-black text-white px-6 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-gray-100 p-2">
              <Users className="h-5 w-5 text-gray-500" />
            </span>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total usuarios</p>
              <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-green-50 p-2">
              <UserCheck className="h-5 w-5 text-green-500" />
            </span>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Activos</p>
              <p className={`text-xl font-semibold ${stats.showStatus ? 'text-green-600' : 'text-gray-400'}`}>
                {stats.activeDisplay}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-red-50 p-2">
              <UserX className="h-5 w-5 text-red-500" />
            </span>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Inactivos</p>
              <p className={`text-xl font-semibold ${stats.showStatus ? 'text-red-600' : 'text-gray-400'}`}>
                {stats.inactiveDisplay}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-purple-50 p-2">
              <Shield className="h-5 w-5 text-purple-500" />
            </span>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Administradores</p>
              <p className="text-xl font-semibold text-purple-600">{stats.adminCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Usuarios
            {isFetching && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
          </h2>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Rol</th>
              {statusColumnEnabled && (
                <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Estado
                </th>
              )}
              <th className="hidden sm:table-cell px-6 py-4 text-left text-sm font-medium text-gray-700">
                Creado
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={statusColumnEnabled ? 6 : 5} className="text-center py-10 text-gray-400">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              users.map(user => {
                const createdAt = user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'N/A'
                const isActive = user.is_active ?? true

                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {editingField?.userId === user.id && editingField.field === 'full_name' ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editValue}
                            onChange={event => setEditValue(event.target.value)}
                            onKeyDown={event => {
                              if (event.key === 'Enter') saveField(user.id, 'full_name')
                              if (event.key === 'Escape') cancelEdit()
                            }}
                            className="h-8 text-sm"
                            autoFocus
                          />
                          <Button size="sm" onClick={() => saveField(user.id, 'full_name')}>
                            OK
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{user.full_name}</span>
                          <button
                            onClick={() => startEditField(user.id, 'full_name', user.full_name)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Editar nombre"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <div className="md:hidden text-xs text-gray-500 mt-1">{user.email}</div>
                    </td>

                    <td className="hidden md:table-cell px-6 py-4">
                      {editingField?.userId === user.id && editingField.field === 'email' ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="email"
                            value={editValue}
                            onChange={event => setEditValue(event.target.value)}
                            onKeyDown={event => {
                              if (event.key === 'Enter') saveField(user.id, 'email')
                              if (event.key === 'Escape') cancelEdit()
                            }}
                            className="h-8"
                            autoFocus
                          />
                          <Button size="sm" onClick={() => saveField(user.id, 'email')}>
                            OK
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">{user.email}</span>
                          <button
                            onClick={() => startEditField(user.id, 'email', user.email)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Editar email"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <Select
                        value={user.role}
                        onValueChange={role => updateUserRole(user.id, role as UserRole)}
                      >
                        <SelectTrigger className={`w-[140px] h-9 border-0 ${getRoleColor(user.role)}`}>
                          <SelectValue placeholder={ROLE_LABELS[user.role]} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          {ROLE_OPTIONS.map(role => (
                            <SelectItem key={role} value={role} className="px-3">
                              {ROLE_LABELS[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>

                    {statusColumnEnabled && (
                      <td className="hidden lg:table-cell px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={isActive}
                            onCheckedChange={checked => toggleUserStatus(user.id, checked)}
                            disabled={updateMutation.isPending}
                          />
                          <span className={`text-sm ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                            {isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </td>
                    )}

                    <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-500">
                      {createdAt}
                    </td>

                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteUserId(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={event => {
            if (event.target === event.currentTarget) {
              setShowModal(false)
              resetForm()
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-6">Nuevo Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.full_name}
                    onChange={event => setFormData({ ...formData, full_name: event.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={event => setFormData({ ...formData, email: event.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Contrasena</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={event => setFormData({ ...formData, password: event.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select
                    value={formData.role}
                    onValueChange={role => setFormData({ ...formData, role: role as UserRole })}
                  >
                    <SelectTrigger className="w-full h-10 border-gray-300 bg-white">
                      <SelectValue placeholder={ROLE_LABELS[formData.role]} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      {ROLE_OPTIONS.map(role => (
                        <SelectItem key={role} value={role} className="px-3">
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {statusColumnEnabled && (
                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <Label htmlFor="activo" className="text-sm font-medium">
                      Usuario activo
                    </Label>
                    <p className="text-xs text-gray-500">
                      Desactiva para revocar el acceso sin eliminar la cuenta.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="activo"
                      checked={formData.is_active ?? true}
                      onCheckedChange={is_active => setFormData({ ...formData, is_active })}
                    />
                    <span
                      className={`text-sm ${
                        (formData.is_active ?? true) ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {(formData.is_active ?? true) ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-gray-900"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creando...' : 'Crear'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteUserId && userPendingDeletion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={event => {
            if (event.target === event.currentTarget) {
              setDeleteUserId(null)
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setDeleteUserId(null)}
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4">Eliminar usuario</h2>
            <p className="text-gray-600 mb-6">
              Estas seguro que quieres eliminar a{' '}
              <span className="font-semibold">{userPendingDeletion.full_name}</span>? Esta accion no se
              puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => deleteMutation.mutate(deleteUserId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </Button>
              <Button variant="outline" onClick={() => setDeleteUserId(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
