# Sistema de Administración - Beltrame Web

Panel de administración completo (CMS) con autenticación, gestión de usuarios, contenido, imágenes y formularios de contacto.

## 🚀 Características

### Sistema de Usuarios y Roles
- **Dueño**: Acceso total al sistema
- **Admin**: Gestión de usuarios y contenido
- **Empleado**: Gestión de contenido y visualización de contactos

### Módulos Principales

1. **Dashboard**: Vista general con acceso rápido a todas las funcionalidades
2. **Gestión de Usuarios**: Crear, editar y eliminar usuarios con diferentes roles
3. **Gestor de Contenido**: Editar textos del sitio web organizados por secciones
4. **Gestor de Imágenes**: Subir, visualizar y eliminar imágenes del sitio
5. **Formularios de Contacto**: Ver y gestionar mensajes recibidos

## 📋 Configuración en Supabase

### 1. Crear las Tablas

Ejecuta el siguiente SQL en el SQL Editor de Supabase:

```sql
-- Tabla de perfiles de usuario con roles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('dueño', 'admin', 'empleado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de contenido del sitio
CREATE TABLE site_content (
  id SERIAL PRIMARY KEY,
  seccion TEXT NOT NULL,
  clave TEXT NOT NULL,
  valor TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('texto', 'imagen', 'html')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(seccion, clave)
);

-- Tabla de formularios de contacto
CREATE TABLE contact_forms (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_site_content_seccion ON site_content(seccion);
CREATE INDEX idx_contact_forms_leido ON contact_forms(leido);
CREATE INDEX idx_contact_forms_created_at ON contact_forms(created_at DESC);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Policy para profiles: solo usuarios autenticados pueden ver perfiles
CREATE POLICY "Users can view profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy para profiles: solo admins y dueños pueden modificar
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('dueño', 'admin')
    )
  );

-- Policy para site_content: todos los autenticados pueden leer
CREATE POLICY "Authenticated users can view content" ON site_content
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy para site_content: autenticados pueden modificar
CREATE POLICY "Authenticated users can modify content" ON site_content
  FOR ALL
  TO authenticated
  USING (true);

-- Policy para contact_forms: todos los autenticados pueden leer
CREATE POLICY "Authenticated users can view contacts" ON contact_forms
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy para contact_forms: todos pueden crear (para el formulario público)
CREATE POLICY "Anyone can create contacts" ON contact_forms
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy para contact_forms: autenticados pueden modificar
CREATE POLICY "Authenticated users can update contacts" ON contact_forms
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy para contact_forms: autenticados pueden eliminar
CREATE POLICY "Authenticated users can delete contacts" ON contact_forms
  FOR DELETE
  TO authenticated
  USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para crear perfil automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'nombre', 'empleado');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Configurar Storage para Imágenes

En Supabase Storage:

1. Ve a **Storage** en el panel de Supabase
2. Crea un nuevo bucket llamado `images`
3. Configura el bucket como **público**
4. Configura las políticas de seguridad:

```sql
-- Policy para permitir subir imágenes a usuarios autenticados
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy para permitir ver imágenes públicamente
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Policy para permitir eliminar imágenes a usuarios autenticados
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

### 3. Crear Usuario Inicial

Después de configurar las tablas, crea tu primer usuario desde el panel de Supabase:

1. Ve a **Authentication** → **Users**
2. Haz clic en **Add user**
3. Ingresa email y contraseña
4. Una vez creado, ve al SQL Editor y ejecuta:

```sql
-- Actualizar el rol del primer usuario a 'dueño'
UPDATE profiles
SET role = 'dueño', nombre = 'Tu Nombre'
WHERE email = 'tu@email.com';
```

### 4. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

Obtén estas credenciales desde:
**Settings** → **API** en tu proyecto de Supabase

## 🔐 Rutas de Administración

### Rutas Públicas
- `/admin/login` - Inicio de sesión

### Rutas Protegidas (requieren autenticación)
- `/admin/dashboard` - Panel principal
- `/admin/usuarios` - Gestión de usuarios (solo dueño y admin)
- `/admin/contenido` - Gestor de contenido
- `/admin/imagenes` - Gestor de imágenes
- `/admin/contactos` - Formularios de contacto

## 🎨 Componentes Creados

```
src/
├── pages/
│   └── admin/
│       ├── Login.tsx           # Página de inicio de sesión
│       ├── Dashboard.tsx       # Dashboard principal
│       ├── Usuarios.tsx        # Gestión de usuarios
│       ├── Contenido.tsx       # Gestión de contenido
│       ├── Imagenes.tsx        # Gestión de imágenes
│       └── Contactos.tsx       # Visualización de contactos
├── components/
│   ├── AdminLayout.tsx         # Layout del admin con sidebar
│   └── ProtectedRoute.tsx      # Protección de rutas por rol
└── lib/
    └── supabase.ts            # Configuración y servicios de Supabase
```

## 📱 Uso del Sistema

### Como Administrador

1. **Iniciar sesión**: Navega a `/admin/login` e ingresa tus credenciales
2. **Dashboard**: Vista general con acceso a todos los módulos
3. **Gestionar usuarios**: Crear, editar roles y eliminar usuarios
4. **Editar contenido**: Modificar textos del sitio organizados por secciones
5. **Subir imágenes**: Administrar el contenido visual del sitio
6. **Ver contactos**: Revisar y gestionar formularios de contacto

### Integrar el Formulario de Contacto

En tu página `Contacto.tsx`, actualiza el envío del formulario:

```typescript
import { supabase } from '../lib/supabase'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const { error } = await supabase
    .from('contact_forms')
    .insert([{
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      mensaje: formData.mensaje,
    }])

  if (!error) {
    toast({ title: 'Mensaje enviado correctamente' })
    // Limpiar formulario
  }
}
```

### Usar Contenido Dinámico

Para usar el contenido editable en tus páginas:

```typescript
import { supabase } from '../lib/supabase'

const [content, setContent] = useState<Record<string, string>>({})

useEffect(() => {
  loadContent()
}, [])

const loadContent = async () => {
  const { data } = await supabase
    .from('site_content')
    .select('*')
    .eq('seccion', 'inicio')
  
  const contentMap = {}
  data?.forEach(item => {
    contentMap[item.clave] = item.valor
  })
  setContent(contentMap)
}

// Usar en el JSX
<h1>{content['titulo-principal'] || 'Título por defecto'}</h1>
```

## 🔒 Seguridad

- **Autenticación**: Manejada por Supabase Auth
- **Row Level Security**: Políticas de seguridad a nivel de base de datos
- **Protected Routes**: Verificación de roles en el frontend
- **Validación**: Validación de tipos y permisos en cada operación

## 🚧 Próximas Mejoras

- [ ] Recuperación de contraseña
- [ ] Edición de perfil de usuario
- [ ] Sistema de notificaciones
- [ ] Historial de cambios en contenido
- [ ] Editor WYSIWYG para contenido HTML
- [ ] Optimización y redimensionado automático de imágenes
- [ ] Exportación de contactos a CSV
- [ ] Dashboard con estadísticas y gráficos

## 📝 Notas Importantes

1. **Crear usuarios**: La función de crear usuarios desde el admin requiere una función de Edge Function en Supabase para crear usuarios en `auth.users`. Por ahora, crea usuarios manualmente desde el panel de Supabase.

2. **Roles**: Los tres roles disponibles son:
   - `dueño`: Acceso completo
   - `admin`: Gestión de usuarios y contenido
   - `empleado`: Solo gestión de contenido y visualización de contactos

3. **Imágenes**: El bucket `images` debe estar configurado como público para que las imágenes sean accesibles desde el sitio web.

## 🆘 Soporte

Si necesitas ayuda con la configuración:
1. Verifica que las credenciales de Supabase estén correctas en `.env`
2. Asegúrate de que todas las tablas y políticas estén creadas correctamente
3. Revisa los logs del navegador para errores específicos
4. Consulta la documentación de Supabase: https://supabase.com/docs
