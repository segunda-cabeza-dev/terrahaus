/**
 * WP Importer Service
 * Importa categorías de WooCommerce a Supabase
 */

import { supabase } from '../lib/supabase'
import { WooCommerceService } from './woocommerce.service'

export interface ImportResult {
  success: boolean
  categoriesImported: number
  projectsImported: number
  imagesUploaded: number
  errors: string[]
}

export interface ImportProgress {
  total: number
  current: number
  status: string
  category?: string
}

export class WPImporterService {
  private wooCommerce: WooCommerceService

  constructor(wooCommerce: WooCommerceService) {
    this.wooCommerce = wooCommerce
  }

  /**
   * Descarga una imagen desde una URL y la convierte a Blob
   * Usa un enfoque que maneja CORS descargando la imagen como data URL
   */
  private async downloadImage(url: string): Promise<{ blob: Blob; ext: string }> {
    // Extraer extensión de la URL
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const extMatch = pathname.match(/\.([a-zA-Z0-9]+)$/)
    const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg'

    try {
      // Intentar usar proxy local si es una URL de WordPress
      // Esto evita problemas de CORS en desarrollo al redirigir la petición a través del servidor de Vite
      let fetchUrl = url;
      if (url.includes('/wp-content/')) {
        const urlParts = url.split('/wp-content/');
        if (urlParts.length > 1) {
          fetchUrl = `/wp-content/${urlParts[1]}`;
        }
      }

      // Método 1: Intentar fetch directo
      const response = await fetch(fetchUrl, {
        headers: {
          'Accept': 'image/*'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const blob = await response.blob()
      return { blob, ext }
    } catch (corsError) {
      // Método 2: Usar Image API del navegador para cargar la imagen
      // y convertirla a blob usando canvas
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
          try {
            // Crear canvas para convertir imagen a blob
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              throw new Error('No se pudo obtener contexto del canvas')
            }
            
            ctx.drawImage(img, 0, 0)
            
            // Convertir canvas a blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve({ blob, ext })
                } else {
                  reject(new Error('No se pudo crear blob desde canvas'))
                }
              },
              `image/${ext}`,
              0.95
            )
          } catch (error) {
            reject(error)
          }
        }
        
        img.onerror = () => {
          reject(new Error(`No se pudo cargar la imagen: ${url}`))
        }
        
        // Intentar cargar imagen
        img.src = url
      })
    }
  }

  /**
   * Sube una imagen al bucket de Supabase
   */
  private async uploadImageToSupabase(
    blob: Blob,
    filename: string,
    ext: string
  ): Promise<string> {
    const bucketName = 'categories'
    const path = `${filename}.${ext}`

    // Subir al storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, blob, {
        contentType: blob.type,
        upsert: true // Sobrescribir si existe
      })

    if (uploadError) {
      throw new Error(`Error al subir imagen: ${uploadError.message}`)
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path)

    return urlData.publicUrl
  }

  /**
   * Guarda una categoría en Supabase
   */
  private async saveCategoryToSupabase(
    slug: string,
    name: string,
    description: string,
    imageUrl: string | null
  ): Promise<void> {
    // 1. Insertar/actualizar la categoría
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .upsert({
        slug,
        cover_image_url: imageUrl, // URL de Supabase Storage o WordPress
        is_active: true,
        display_order: 0
      }, {
        onConflict: 'slug'
      })
      .select()
      .single()

    if (categoryError) {
      throw new Error(`Error al guardar categoría: ${categoryError.message}`)
    }

    const categoryId = categoryData.id

    // 2. Guardar traducción en español (es)
    const { error: translationError } = await supabase
      .from('translations')
      .upsert({
        entity_type: 'category',
        entity_id: categoryId,
        field_name: 'name',
        language_code: 'es',
        value: name
      }, {
        onConflict: 'entity_type,entity_id,field_name,language_code'
      })

    if (translationError) {
      throw new Error(`Error al guardar traducción del nombre: ${translationError.message}`)
    }

    // 3. Guardar descripción en español si existe
    if (description) {
      const { error: descError } = await supabase
        .from('translations')
        .upsert({
          entity_type: 'category',
          entity_id: categoryId,
          field_name: 'description',
          language_code: 'es',
          value: description
        }, {
          onConflict: 'entity_type,entity_id,field_name,language_code'
        })

      if (descError) {
        throw new Error(`Error al guardar traducción de la descripción: ${descError.message}`)
      }
    }
  }

  /**
   * Importa todas las categorías de WooCommerce a Supabase
   */
  async importCategories(
    onProgress?: (progress: ImportProgress) => void
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      categoriesImported: 0,
      projectsImported: 0,
      imagesUploaded: 0,
      errors: []
    }

    try {
      // 1. Obtener todas las categorías de WooCommerce
      onProgress?.({ total: 0, current: 0, status: 'Obteniendo categorías de WooCommerce...' })
      const categories = await this.wooCommerce.getCategories()

      if (categories.length === 0) {
        result.errors.push('No se encontraron categorías en WooCommerce')
        return result
      }

      // 2. Procesar cada categoría
      const total = categories.length
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i]
        
        onProgress?.({
          total,
          current: i + 1,
          status: `Importando categoría ${i + 1} de ${total}`,
          category: category.name
        })

        try {
          let imageUrl: string | null = null

          // 3. Descargar y subir imagen si existe
          if (category.image && category.image.src) {
            try {
              const { blob, ext } = await this.downloadImage(category.image.src)
              imageUrl = await this.uploadImageToSupabase(
                blob,
                category.slug,
                ext
              )
              result.imagesUploaded++
            } catch (imgError) {
              result.errors.push(
                `Error al procesar imagen de "${category.name}": ${imgError instanceof Error ? imgError.message : 'Error desconocido'}`
              )
              // Si falla la descarga, usar URL original de WordPress
              imageUrl = category.image.src
            }
          }

          // 4. Guardar categoría en Supabase
          await this.saveCategoryToSupabase(
            category.slug,
            category.name,
            category.description || '',
            imageUrl
          )

          result.categoriesImported++
        } catch (error) {
          result.errors.push(
            `Error al importar "${category.name}": ${error instanceof Error ? error.message : 'Error desconocido'}`
          )
        }
      }

      onProgress?.({ total, current: total, status: 'Importación completada' })
      result.success = result.categoriesImported > 0

    } catch (error) {
      result.errors.push(
        `Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`
      )
    }

    return result
  }

  /**
   * Sube una imagen al bucket de proyectos de Supabase
   */
  private async uploadProjectImageToSupabase(
    blob: Blob,
    projectSlug: string,
    imageIndex: number,
    ext: string
  ): Promise<string> {
    const bucketName = 'projects'
    const path = `${projectSlug}/${imageIndex}.${ext}`

    // Subir al storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, blob, {
        contentType: blob.type,
        upsert: true // Sobrescribir si existe
      })

    if (uploadError) {
      throw new Error(`Error al subir imagen: ${uploadError.message}`)
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path)

    return urlData.publicUrl
  }

  /**
   * Obtiene el ID de una categoría por su slug
   */
  private async getCategoryIdBySlug(slug: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return null
    }

    return data.id
  }

  /**
   * Guarda un proyecto en Supabase
   */
  private async saveProjectToSupabase(
    slug: string,
    name: string,
    categoryId: number,
    imageUrls: string[]
  ): Promise<void> {
    // 1. Insertar/actualizar el proyecto
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .upsert({
        slug,
        category_id: categoryId,
        image_urls: imageUrls,
        is_active: true,
        display_order: 0
      }, {
        onConflict: 'slug'
      })
      .select()
      .single()

    if (projectError) {
      throw new Error(`Error al guardar proyecto: ${projectError.message}`)
    }

    const projectId = projectData.id

    // 2. Guardar traducción del nombre en español (es)
    const { error: translationError } = await supabase
      .from('translations')
      .upsert({
        entity_type: 'project',
        entity_id: projectId,
        field_name: 'name',
        language_code: 'es',
        value: name
      }, {
        onConflict: 'entity_type,entity_id,field_name,language_code'
      })

    if (translationError) {
      throw new Error(`Error al guardar traducción del nombre: ${translationError.message}`)
    }
  }

  /**
   * Importa productos de WooCommerce como proyectos en Supabase
   * Los productos se asignan a su categoría correspondiente
   */
  async importProjects(
    onProgress?: (progress: ImportProgress) => void
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      categoriesImported: 0,
      projectsImported: 0,
      imagesUploaded: 0,
      errors: []
    }

    try {
      // 1. Obtener todos los productos de WooCommerce
      onProgress?.({ total: 0, current: 0, status: 'Obteniendo productos de WooCommerce...' })
      const products = await this.wooCommerce.getAllProducts()

      if (products.length === 0) {
        result.errors.push('No se encontraron productos en WooCommerce')
        return result
      }

      // 2. Procesar cada producto
      const total = products.length
      for (let i = 0; i < products.length; i++) {
        const product = products[i]
        
        onProgress?.({
          total,
          current: i + 1,
          status: `Importando proyecto ${i + 1} de ${total}`,
          category: product.name
        })

        try {
          // 3. Obtener la categoría del producto
          // Usamos la primera categoría del producto
          const productCategory = product.categories[0]
          if (!productCategory) {
            result.errors.push(`Producto "${product.name}" no tiene categoría asignada`)
            continue
          }

          // 4. Buscar el ID de la categoría en Supabase
          const categoryId = await this.getCategoryIdBySlug(productCategory.slug)
          if (!categoryId) {
            result.errors.push(`Categoría "${productCategory.name}" (${productCategory.slug}) no encontrada en Supabase para "${product.name}"`)
            continue
          }

          // 5. Procesar imágenes del producto
          const imageUrls: string[] = []
          
          if (product.images && product.images.length > 0) {
            for (let imgIndex = 0; imgIndex < product.images.length; imgIndex++) {
              const image = product.images[imgIndex]
              
              try {
                const { blob, ext } = await this.downloadImage(image.src)
                const uploadedUrl = await this.uploadProjectImageToSupabase(
                  blob,
                  product.slug,
                  imgIndex,
                  ext
                )
                imageUrls.push(uploadedUrl)
                result.imagesUploaded++
              } catch (imgError) {
                result.errors.push(
                  `Error al procesar imagen ${imgIndex + 1} de "${product.name}": ${imgError instanceof Error ? imgError.message : 'Error desconocido'}`
                )
                // Si falla, usar URL original de WordPress
                imageUrls.push(image.src)
              }
            }
          }

          // 6. Guardar proyecto en Supabase
          await this.saveProjectToSupabase(
            product.slug,
            product.name,
            categoryId,
            imageUrls
          )

          result.projectsImported++
        } catch (error) {
          result.errors.push(
            `Error al importar proyecto "${product.name}": ${error instanceof Error ? error.message : 'Error desconocido'}`
          )
        }
      }

      onProgress?.({ total, current: total, status: 'Importación de proyectos completada' })
      result.success = result.projectsImported > 0

    } catch (error) {
      result.errors.push(
        `Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`
      )
    }

    return result
  }
}
