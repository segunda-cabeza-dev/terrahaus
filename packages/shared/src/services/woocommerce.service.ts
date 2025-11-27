/**
 * WooCommerce API Service
 * Conecta con la API REST de WooCommerce para obtener categorías
 */

export interface WooCommerceConfig {
  url: string // URL del sitio WordPress (ej: https://tutienda.com)
  consumerKey: string
  consumerSecret: string
}

export interface WooCommerceCategory {
  id: number
  name: string
  slug: string
  description: string
  image: {
    id: number
    src: string
    alt: string
  } | null
  count: number
}

export interface WooCommerceProductImage {
  id: number
  src: string
  alt: string
}

export interface WooCommerceProductCategory {
  id: number
  name: string
  slug: string
}

export interface WooCommerceProduct {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  images: WooCommerceProductImage[]
  categories: WooCommerceProductCategory[]
  status: string
}

export class WooCommerceService {
  private config: WooCommerceConfig

  constructor(config: WooCommerceConfig) {
    this.config = config
  }

  /**
   * Obtiene todas las categorías de WooCommerce
   */
  async getCategories(): Promise<WooCommerceCategory[]> {
    const url = new URL(`${this.config.url}/wp-json/wc/v3/products/categories`)
    url.searchParams.append('consumer_key', this.config.consumerKey)
    url.searchParams.append('consumer_secret', this.config.consumerSecret)
    url.searchParams.append('per_page', '100') // Máximo por página
    url.searchParams.append('orderby', 'name')
    url.searchParams.append('order', 'asc')

    try {
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`Error de WooCommerce API: ${response.status} ${response.statusText}`)
      }

      const categories: WooCommerceCategory[] = await response.json()
      return categories
    } catch (error) {
      console.error('Error al obtener categorías de WooCommerce:', error)
      throw error
    }
  }

  /**
   * Obtiene una categoría específica por ID
   */
  async getCategory(id: number): Promise<WooCommerceCategory> {
    const url = new URL(`${this.config.url}/wp-json/wc/v3/products/categories/${id}`)
    url.searchParams.append('consumer_key', this.config.consumerKey)
    url.searchParams.append('consumer_secret', this.config.consumerSecret)

    try {
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`Error de WooCommerce API: ${response.status} ${response.statusText}`)
      }

      const category: WooCommerceCategory = await response.json()
      return category
    } catch (error) {
      console.error('Error al obtener categoría de WooCommerce:', error)
      throw error
    }
  }

  /**
   * Verifica la conexión con WooCommerce
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getCategories()
      return true
    } catch {
      return false
    }
  }

  /**
   * Obtiene todos los productos de WooCommerce con paginación
   */
  async getProducts(page: number = 1, perPage: number = 100): Promise<WooCommerceProduct[]> {
    const url = new URL(`${this.config.url}/wp-json/wc/v3/products`)
    url.searchParams.append('consumer_key', this.config.consumerKey)
    url.searchParams.append('consumer_secret', this.config.consumerSecret)
    url.searchParams.append('per_page', perPage.toString())
    url.searchParams.append('page', page.toString())
    url.searchParams.append('orderby', 'date')
    url.searchParams.append('order', 'desc')

    try {
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`Error de WooCommerce API: ${response.status} ${response.statusText}`)
      }

      const products: WooCommerceProduct[] = await response.json()
      return products
    } catch (error) {
      console.error('Error al obtener productos de WooCommerce:', error)
      throw error
    }
  }

  /**
   * Obtiene todos los productos de WooCommerce (todas las páginas)
   */
  async getAllProducts(): Promise<WooCommerceProduct[]> {
    const allProducts: WooCommerceProduct[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const products = await this.getProducts(page, 100)
      allProducts.push(...products)
      
      if (products.length < 100) {
        hasMore = false
      } else {
        page++
      }
    }

    return allProducts
  }

  /**
   * Obtiene un producto específico por ID
   */
  async getProduct(id: number): Promise<WooCommerceProduct> {
    const url = new URL(`${this.config.url}/wp-json/wc/v3/products/${id}`)
    url.searchParams.append('consumer_key', this.config.consumerKey)
    url.searchParams.append('consumer_secret', this.config.consumerSecret)

    try {
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`Error de WooCommerce API: ${response.status} ${response.statusText}`)
      }

      const product: WooCommerceProduct = await response.json()
      return product
    } catch (error) {
      console.error('Error al obtener producto de WooCommerce:', error)
      throw error
    }
  }
}
