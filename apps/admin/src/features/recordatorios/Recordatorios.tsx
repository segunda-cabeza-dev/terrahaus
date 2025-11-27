import { useEffect, useState } from 'react'
import { USE_MOCK_DATA } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@beltrame/shared/ui/select'
import { useToast } from '@beltrame/shared'
import { Trash2, Pencil, Plus, Search, Calendar, AlertCircle } from 'lucide-react'
import { PageHeader } from '../../shared'

type RecordatorioCategoria = 'hosting' | 'dominio' | 'internet' | 'telefonia' | 'software' | 'otro'
type RecordatorioEstado = 'vigente' | 'proximo' | 'vencido'

interface Recordatorio {
  id: string
  titulo: string
  descripcion: string
  categoria: RecordatorioCategoria
  fecha_vencimiento: string
  monto?: number
  proveedor?: string
  estado: RecordatorioEstado
  created_at: string
  updated_at: string
}

const CATEGORIAS: { value: RecordatorioCategoria; label: string }[] = [
  { value: 'hosting', label: 'Hosting' },
  { value: 'dominio', label: 'Dominio' },
  { value: 'internet', label: 'Internet' },
  { value: 'telefonia', label: 'Telefonía' },
  { value: 'software', label: 'Software' },
  { value: 'otro', label: 'Otro' }
]

const mockRecordatorios: Recordatorio[] = [
  {
    id: '1',
    titulo: 'Renovación Hostinger',
    descripcion: 'Renovación anual del hosting principal',
    categoria: 'hosting',
    fecha_vencimiento: '2025-12-15',
    monto: 89.99,
    proveedor: 'Hostinger',
    estado: 'vigente',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    titulo: 'Internet Móvil - Empresa',
    descripcion: 'Plan de datos empresarial',
    categoria: 'internet',
    fecha_vencimiento: '2025-12-05',
    monto: 45.00,
    proveedor: 'Vodafone',
    estado: 'proximo',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    titulo: 'Dominio beltrame.com',
    descripcion: 'Renovación dominio principal',
    categoria: 'dominio',
    fecha_vencimiento: '2026-03-20',
    monto: 12.99,
    proveedor: 'GoDaddy',
    estado: 'vigente',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export default function Recordatorios() {
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([])
  const [filteredRecordatorios, setFilteredRecordatorios] = useState<Recordatorio[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState<string>('todas')
  const [filterEstado, setFilterEstado] = useState<string>('todos')
  const [formData, setFormData] = useState<Omit<Recordatorio, 'id' | 'created_at' | 'updated_at' | 'estado'>>({
    titulo: '',
    descripcion: '',
    categoria: 'hosting',
    fecha_vencimiento: '',
    monto: undefined,
    proveedor: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    const data = USE_MOCK_DATA ? mockRecordatorios : []
    setRecordatorios(data)
    setFilteredRecordatorios(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = recordatorios

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.proveedor?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por categoría
    if (filterCategoria !== 'todas') {
      filtered = filtered.filter(r => r.categoria === filterCategoria)
    }

    // Filtro por estado
    if (filterEstado !== 'todos') {
      filtered = filtered.filter(r => r.estado === filterEstado)
    }

    setFilteredRecordatorios(filtered)
  }, [searchTerm, filterCategoria, filterEstado, recordatorios])

  function calcularEstado(fechaVencimiento: string): RecordatorioEstado {
    const hoy = new Date()
    const vencimiento = new Date(fechaVencimiento)
    const diffDias = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDias < 0) return 'vencido'
    if (diffDias <= 30) return 'proximo'
    return 'vigente'
  }

  function resetForm() {
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: 'hosting',
      fecha_vencimiento: '',
      monto: undefined,
      proveedor: ''
    })
    setEditingId(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const estado = calcularEstado(formData.fecha_vencimiento)

    if (editingId) {
      // Editar
      setRecordatorios(recordatorios.map(r => 
        r.id === editingId 
          ? { ...r, ...formData, estado, updated_at: new Date().toISOString() }
          : r
      ))
      toast({ title: 'Recordatorio actualizado' })
    } else {
      // Crear
      const nuevo: Recordatorio = {
        id: `rec-${Date.now()}`,
        ...formData,
        estado,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setRecordatorios([nuevo, ...recordatorios])
      toast({ title: 'Recordatorio creado' })
    }

    setShowModal(false)
    resetForm()
  }

  function handleEdit(recordatorio: Recordatorio) {
    setEditingId(recordatorio.id)
    setFormData({
      titulo: recordatorio.titulo,
      descripcion: recordatorio.descripcion,
      categoria: recordatorio.categoria,
      fecha_vencimiento: recordatorio.fecha_vencimiento,
      monto: recordatorio.monto,
      proveedor: recordatorio.proveedor
    })
    setShowModal(true)
  }

  function handleDelete(id: string) {
    setRecordatorios(recordatorios.filter(r => r.id !== id))
    setDeleteId(null)
    toast({ title: 'Recordatorio eliminado' })
  }

  function getEstadoBadge(estado: RecordatorioEstado) {
    const badges = {
      vigente: 'bg-green-100 text-green-800',
      proximo: 'bg-yellow-100 text-yellow-800',
      vencido: 'bg-red-100 text-red-800'
    }
    const labels = {
      vigente: 'Vigente',
      proximo: 'Próximo a vencer',
      vencido: 'Vencido'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[estado]}`}>
        {labels[estado]}
      </span>
    )
  }

  function getDiasRestantes(fecha: string): string {
    const hoy = new Date()
    const vencimiento = new Date(fecha)
    const diffDias = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDias < 0) return `Venció hace ${Math.abs(diffDias)} días`
    if (diffDias === 0) return 'Vence hoy'
    if (diffDias === 1) return 'Vence mañana'
    return `Faltan ${diffDias} días`
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recordatorios y Vencimientos"
        description="Gestiona los pagos recurrentes y vencimientos importantes"
        actions={
          <Button onClick={() => { resetForm(); setShowModal(true) }} className="bg-black text-white px-6 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Recordatorio
          </Button>
        }
      />

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar recordatorios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="todas" className="px-3">Todas las categorías</SelectItem>
              {CATEGORIAS.map(cat => (
                <SelectItem key={cat.value} value={cat.value} className="px-3">
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="todos" className="px-3">Todos los estados</SelectItem>
              <SelectItem value="vigente" className="px-3">Vigentes</SelectItem>
              <SelectItem value="proximo" className="px-3">Próximos a vencer</SelectItem>
              <SelectItem value="vencido" className="px-3">Vencidos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Título</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Categoría</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Proveedor</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Vencimiento</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Monto</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecordatorios.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  {searchTerm || filterCategoria !== 'todas' || filterEstado !== 'todos' 
                    ? 'No se encontraron recordatorios con los filtros aplicados'
                    : 'No hay recordatorios. Crea uno nuevo para empezar.'}
                </td>
              </tr>
            ) : (
              filteredRecordatorios.map(rec => (
                <tr key={rec.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{rec.titulo}</div>
                      <div className="text-sm text-gray-500">{rec.descripcion}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 capitalize">
                      {CATEGORIAS.find(c => c.value === rec.categoria)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{rec.proveedor || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(rec.fecha_vencimiento).toLocaleDateString('es-ES', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="text-xs text-gray-500">{getDiasRestantes(rec.fecha_vencimiento)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getEstadoBadge(rec.estado)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {rec.monto ? `€${rec.monto.toFixed(2)}` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(rec)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteId(rec.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Resumen de alertas */}
      {recordatorios.filter(r => r.estado === 'vencido' || r.estado === 'proximo').length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900">Atención requerida</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Tienes {recordatorios.filter(r => r.estado === 'vencido').length} recordatorios vencidos y{' '}
                {recordatorios.filter(r => r.estado === 'proximo').length} próximos a vencer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar */}
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
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" 
              onClick={() => { setShowModal(false); resetForm() }}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Título *</Label>
                <Input 
                  value={formData.titulo} 
                  onChange={e => setFormData({ ...formData, titulo: e.target.value })} 
                  placeholder="ej: Renovación Hostinger"
                  required 
                />
              </div>

              <div>
                <Label>Descripción</Label>
                <Input 
                  value={formData.descripcion} 
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })} 
                  placeholder="Detalles adicionales"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoría *</Label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(value) => setFormData({ ...formData, categoria: value as RecordatorioCategoria })}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg">
                      {CATEGORIAS.map(cat => (
                        <SelectItem key={cat.value} value={cat.value} className="px-3">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fecha de Vencimiento *</Label>
                  <Input 
                    type="date"
                    value={formData.fecha_vencimiento} 
                    onChange={e => setFormData({ ...formData, fecha_vencimiento: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Proveedor</Label>
                  <Input 
                    value={formData.proveedor} 
                    onChange={e => setFormData({ ...formData, proveedor: e.target.value })} 
                    placeholder="ej: Hostinger, Vodafone"
                  />
                </div>

                <div>
                  <Label>Monto (€)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={formData.monto || ''} 
                    onChange={e => setFormData({ ...formData, monto: e.target.value ? parseFloat(e.target.value) : undefined })} 
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800">
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setShowModal(false); resetForm() }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteId(null)
            }
          }}
        >
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl" 
              onClick={() => setDeleteId(null)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">¿Eliminar recordatorio?</h2>
            <p className="text-gray-600 mb-6">
              ¿Seguro que quieres eliminar el recordatorio{' '}
              <span className="font-bold">{recordatorios.find(r => r.id === deleteId)?.titulo}</span>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => handleDelete(deleteId)} 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDeleteId(null)}
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
