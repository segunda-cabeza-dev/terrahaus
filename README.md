# Beltrame Web

Proyecto React + TypeScript + Vite con Supabase y shadcn/ui

## 🚀 Stack Tecnológico

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Backend**: Supabase (configurado con datos hardcodeados inicialmente)
- **Icons**: Lucide React

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar el archivo de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de Supabase (opcional por ahora)
```

## 🏃 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El proyecto estará disponible en http://localhost:5173
```

## 🎨 Componentes Disponibles

El proyecto incluye una página de demostración con todos los componentes de shadcn/ui:

- **Buttons**: Variantes (default, secondary, destructive, outline, ghost, link)
- **Form Elements**: Input, Label, Checkbox, Switch
- **Select**: Menús desplegables
- **Tabs**: Pestañas para organizar contenido
- **Accordion**: Contenido expandible
- **Card**: Tarjetas para mostrar contenido
- **Avatar**: Avatares de usuario
- **Badge**: Etiquetas informativas
- **Progress**: Barras de progreso
- **Alert Dialog**: Diálogos de alerta
- **Toast**: Notificaciones toast

## 📁 Estructura del Proyecto

```
src/
├── components/
│   └── ui/           # Componentes de shadcn/ui
├── hooks/            # Custom hooks (useToast)
├── lib/              # Utilidades y configuraciones
│   ├── utils.ts      # Funciones helper
│   └── supabase.ts   # Cliente de Supabase + datos mock
├── pages/            # Páginas de la aplicación
│   └── ComponentsShowcase.tsx
├── App.tsx           # Componente principal
└── main.tsx          # Entry point
```

## 🗄️ Datos Mock

Actualmente el proyecto usa datos hardcodeados definidos en `src/lib/supabase.ts`:

- **users**: Usuarios de ejemplo
- **products**: Productos de ejemplo
- **tasks**: Tareas de ejemplo

## 🔧 Configuración de Supabase

Para conectar con una base de datos real de Supabase:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Copia tus credenciales
3. Actualiza el archivo `.env`:

```env
VITE_SUPABASE_URL=tu-proyecto-url.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Ejecutar ESLint
```

## 📝 Próximos Pasos

- [ ] Integrar con base de datos real de Supabase
- [ ] Crear modelos de datos
- [ ] Implementar autenticación
- [ ] Agregar más páginas
- [ ] Configurar rutas con React Router

## 🤝 Contribuir

Este es un proyecto en desarrollo. Las contribuciones son bienvenidas.

## 📄 Licencia

MIT
