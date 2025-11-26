import { USE_MOCK_DATA, mockData, type ImageUsage } from '../lib/supabase'

/**
 * Encuentra dónde se está usando una imagen específica
 * Busca en projects, categories, y cualquier otra tabla que use imágenes
 */
export async function findImageUsage(imageUrl: string): Promise<ImageUsage[]> {
  const usage: ImageUsage[] = []

  if (USE_MOCK_DATA) {
    // Buscar en proyectos mock
    mockData.projects.forEach(project => {
      if (project.imagenes?.includes(imageUrl)) {
        usage.push({
          type: 'project',
          id: project.id,
          name: project.nombre
        })
      }
    })

    // Buscar en categorías mock (imagen de portada)
    mockData.categories.forEach(category => {
      if (category.imagen_portada === imageUrl) {
        usage.push({
          type: 'category',
          id: category.id,
          name: category.nombre
        })
      }
    })

    return usage
  }

  // TODO: Cuando conectemos con Supabase real, hacer queries aquí
  // Ejemplo:
  // const { data: projects } = await supabase
  //   .from('projects')
  //   .select('id, nombre, imagenes')
  //   .contains('imagenes', [imageUrl])
  
  return usage
}

/**
 * Cuenta cuántas veces se usa una imagen
 */
export async function countImageUsage(imageUrl: string): Promise<number> {
  const usage = await findImageUsage(imageUrl)
  return usage.length
}

/**
 * Verifica si una imagen está en uso
 */
export async function isImageInUse(imageUrl: string): Promise<boolean> {
  const count = await countImageUsage(imageUrl)
  return count > 0
}
