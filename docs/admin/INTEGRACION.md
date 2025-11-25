# 🔗 Guía de Integración del Sistema de Administración

Esta guía te muestra cómo conectar las páginas públicas de tu sitio web con el contenido gestionado desde el panel de administración.

## 📝 Usar Contenido Dinámico en tus Páginas

### Ejemplo 1: Editar el título de la página de Inicio

```tsx
// src/pages/Inicio.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Inicio() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('seccion', 'inicio')
    
    const contentMap: Record<string, string> = {}
    data?.forEach(item => {
      contentMap[item.clave] = item.valor
    })
    setContent(contentMap)
    setLoading(false)
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <h1>{content['titulo-principal'] || 'Bienvenido'}</h1>
      <p>{content['subtitulo'] || 'Subtítulo por defecto'}</p>
      <div dangerouslySetInnerHTML={{ 
        __html: content['descripcion'] || '' 
      }} />
    </div>
  )
}
```

### Ejemplo 2: Crear un Hook Reutilizable

```tsx
// src/hooks/use-content.ts
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useContent(seccion: string) {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [seccion])

  const loadContent = async () => {
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('seccion', seccion)
    
    const contentMap: Record<string, string> = {}
    data?.forEach(item => {
      contentMap[item.clave] = item.valor
    })
    setContent(contentMap)
    setLoading(false)
  }

  const get = (clave: string, fallback: string = '') => {
    return content[clave] || fallback
  }

  return { content, loading, get }
}
```

**Uso del hook:**

```tsx
// src/pages/QuienesSomos.tsx
import { useContent } from '../hooks/use-content'

export default function QuienesSomos() {
  const { get, loading } = useContent('quienes-somos')

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <h1>{get('titulo', 'Quiénes Somos')}</h1>
      <p>{get('descripcion')}</p>
      <div dangerouslySetInnerHTML={{ 
        __html: get('contenido-html') 
      }} />
    </div>
  )
}
```

## 📧 Integrar el Formulario de Contacto

### Ejemplo: Guardar mensajes en Supabase

```tsx
// src/pages/Contacto.tsx
import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from '../hooks/use-toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('contact_forms')
        .insert([{
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono || null,
          mensaje: formData.mensaje,
        }])

      if (error) throw error

      toast({
        title: 'Mensaje enviado',
        description: 'Gracias por contactarnos. Te responderemos pronto.',
      })

      // Limpiar formulario
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje. Intenta nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contáctanos</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre completo *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="mensaje">Mensaje *</Label>
          <textarea
            id="mensaje"
            className="w-full min-h-[150px] p-2 border rounded-md"
            value={formData.mensaje}
            onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Mensaje'}
        </Button>
      </form>
    </div>
  )
}
```

## 🖼️ Usar Imágenes del Storage

### Ejemplo 1: Mostrar una imagen desde el storage

```tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Galeria() {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    const { data } = await supabase
      .storage
      .from('images')
      .list('galeria/', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    const imageUrls = data?.map(file => {
      const { data: urlData } = supabase
        .storage
        .from('images')
        .getPublicUrl(`galeria/${file.name}`)
      return urlData.publicUrl
    }) || []

    setImages(imageUrls)
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Imagen ${index + 1}`}
          className="w-full h-64 object-cover rounded-lg"
        />
      ))}
    </div>
  )
}
```

### Ejemplo 2: Imagen desde contenido editable

```tsx
import { useContent } from '../hooks/use-content'

export default function Hero() {
  const { get } = useContent('inicio')

  return (
    <div className="relative h-screen">
      <img
        src={get('imagen-hero', '/default-hero.jpg')}
        alt="Hero"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-white">
          {get('titulo-hero', 'Bienvenido')}
        </h1>
      </div>
    </div>
  )
}
```

## 🎨 Componente de Contenido Editable

Crea un componente reutilizable para contenido editable:

```tsx
// src/components/EditableContent.tsx
import { useContent } from '../hooks/use-content'

interface EditableContentProps {
  seccion: string
  clave: string
  fallback?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  html?: boolean
  className?: string
}

export default function EditableContent({
  seccion,
  clave,
  fallback = '',
  as: Component = 'div',
  html = false,
  className = '',
}: EditableContentProps) {
  const { get, loading } = useContent(seccion)

  if (loading) return <div className={className}>...</div>

  const content = get(clave, fallback)

  if (html) {
    return (
      <Component
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return <Component className={className}>{content}</Component>
}
```

**Uso:**

```tsx
// Cualquier página
import EditableContent from '../components/EditableContent'

export default function MiPagina() {
  return (
    <div>
      <EditableContent
        seccion="inicio"
        clave="titulo-principal"
        fallback="Título por defecto"
        as="h1"
        className="text-4xl font-bold"
      />
      
      <EditableContent
        seccion="inicio"
        clave="descripcion"
        fallback="Descripción por defecto"
        as="p"
        className="text-gray-600"
      />
      
      <EditableContent
        seccion="inicio"
        clave="contenido-html"
        html
        className="prose"
      />
    </div>
  )
}
```

## 🔔 Notificaciones en Tiempo Real

Para recibir notificaciones cuando lleguen nuevos contactos:

```tsx
// src/hooks/use-realtime-contacts.ts
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from './use-toast'

export function useRealtimeContacts() {
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Cargar contador inicial
    loadUnreadCount()

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel('contact_forms_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_forms',
        },
        (payload) => {
          toast({
            title: 'Nuevo mensaje',
            description: `${payload.new.nombre} ha enviado un mensaje`,
          })
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadUnreadCount = async () => {
    const { count } = await supabase
      .from('contact_forms')
      .select('*', { count: 'exact', head: true })
      .eq('leido', false)
    
    setUnreadCount(count || 0)
  }

  return { unreadCount }
}
```

**Uso en AdminLayout:**

```tsx
// En AdminLayout.tsx
import { useRealtimeContacts } from '../hooks/use-realtime-contacts'

export default function AdminLayout() {
  const { unreadCount } = useRealtimeContacts()

  return (
    <nav>
      <Link to="/admin/contactos">
        Contactos
        {unreadCount > 0 && (
          <Badge className="ml-2">{unreadCount}</Badge>
        )}
      </Link>
    </nav>
  )
}
```

## 📊 Datos desde el Admin

### Crear contenido desde el panel:

1. Ve a `/admin/contenido`
2. Haz clic en "Nuevo Contenido"
3. Llena:
   - **Sección**: `inicio` (nombre de tu página)
   - **Clave**: `titulo-principal` (identificador del contenido)
   - **Valor**: `Bienvenido a Beltrame` (el texto que verán los usuarios)
4. Guarda

### En tu página de Inicio:

```tsx
const { get } = useContent('inicio')
<h1>{get('titulo-principal')}</h1>
```

## 🎯 Mejores Prácticas

1. **Secciones claras**: Usa nombres de sección que coincidan con tus páginas
   - `inicio`, `quienes-somos`, `servicios`, `contacto`

2. **Claves descriptivas**: Usa guiones para separar palabras
   - `titulo-principal`, `subtitulo-hero`, `descripcion-servicios`

3. **Fallbacks siempre**: Proporciona valores por defecto
   ```tsx
   get('titulo', 'Título por defecto')
   ```

4. **Tipos de contenido**:
   - `texto`: Para textos simples
   - `html`: Para contenido con formato
   - `imagen`: Para URLs de imágenes

5. **Caché de contenido**: Considera usar React Query o SWR para mejor rendimiento
   ```tsx
   import { useQuery } from '@tanstack/react-query'
   
   const { data: content } = useQuery({
     queryKey: ['content', seccion],
     queryFn: () => loadContent(seccion),
   })
   ```

## 🚀 Ejemplo Completo: Página "Quiénes Somos"

```tsx
import { useContent } from '../hooks/use-content'

export default function QuienesSomos() {
  const { get, loading } = useContent('quienes-somos')

  if (loading) {
    return <div className="animate-pulse">Cargando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Sección Hero */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">
          {get('titulo', 'Quiénes Somos')}
        </h1>
        <p className="text-xl text-gray-600">
          {get('subtitulo', 'Conoce nuestra historia')}
        </p>
      </div>

      {/* Imagen principal */}
      <img
        src={get('imagen-principal', '/default-team.jpg')}
        alt="Nuestro equipo"
        className="w-full h-96 object-cover rounded-lg mb-12"
      />

      {/* Contenido HTML editable */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: get('contenido-principal') }}
      />

      {/* Misión y Visión */}
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            {get('titulo-mision', 'Nuestra Misión')}
          </h2>
          <p>{get('texto-mision')}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            {get('titulo-vision', 'Nuestra Visión')}
          </h2>
          <p>{get('texto-vision')}</p>
        </div>
      </div>
    </div>
  )
}
```

Ahora, desde el panel de administración (`/admin/contenido`), puedes editar todos estos textos sin tocar el código! 🎉
