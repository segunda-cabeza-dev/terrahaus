import { useState } from 'react'
import type { ImportProgress, ImportResult } from '@beltrame/shared'
import { WooCommerceService, WPImporterService } from '@beltrame/shared'
import { Button } from '@beltrame/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beltrame/shared/ui/card'
import { Input } from '@beltrame/shared/ui/input'
import { Label } from '@beltrame/shared/ui/label'
import { Alert, AlertDescription } from '@beltrame/shared/ui/alert'
import { Progress } from '@beltrame/shared/ui/progress'
import { CheckCircle2, XCircle, Loader2, Database, AlertCircle, FolderOpen, Image } from 'lucide-react'

type ImportType = 'categories' | 'projects'

export function WPImporter() {
  const [url, setUrl] = useState('')
  const [consumerKey, setConsumerKey] = useState('')
  const [consumerSecret, setConsumerSecret] = useState('')
  
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  
  const [importType, setImportType] = useState<ImportType>('categories')
  const [isImporting, setIsImporting] = useState(false)
  const [progress, setProgress] = useState<ImportProgress | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)

  // Cargar configuración guardada en localStorage
  const loadSavedConfig = () => {
    const saved = localStorage.getItem('wp-importer-config')
    if (saved) {
      try {
        const config = JSON.parse(saved)
        setUrl(config.url || '')
        setConsumerKey(config.consumerKey || '')
        setConsumerSecret(config.consumerSecret || '')
      } catch (e) {
        console.error('Error al cargar configuración guardada:', e)
      }
    }
  }

  // Guardar configuración en localStorage
  const saveConfig = () => {
    localStorage.setItem('wp-importer-config', JSON.stringify({
      url,
      consumerKey,
      consumerSecret
    }))
  }

  // Verificar conexión con WooCommerce
  const testConnection = async () => {
    setIsConnecting(true)
    setConnectionError(null)
    setIsConnected(false)

    try {
      const wooCommerce = new WooCommerceService({ url, consumerKey, consumerSecret })
      const connected = await wooCommerce.testConnection()
      
      if (connected) {
        setIsConnected(true)
        saveConfig()
      } else {
        setConnectionError('No se pudo conectar con WooCommerce. Verifica las credenciales.')
      }
    } catch (error) {
      setConnectionError(
        error instanceof Error 
          ? error.message 
          : 'Error desconocido al conectar con WooCommerce'
      )
    } finally {
      setIsConnecting(false)
    }
  }

  // Ejecutar importación
  const startImport = async () => {
    setIsImporting(true)
    setProgress(null)
    setResult(null)

    try {
      const wooCommerce = new WooCommerceService({ url, consumerKey, consumerSecret })
      const importer = new WPImporterService(wooCommerce)
      
      let importResult: ImportResult
      
      if (importType === 'categories') {
        importResult = await importer.importCategories((prog) => {
          setProgress(prog)
        })
      } else {
        importResult = await importer.importProjects((prog) => {
          setProgress(prog)
        })
      }
      
      setResult(importResult)
    } catch (error) {
      setResult({
        success: false,
        categoriesImported: 0,
        projectsImported: 0,
        imagesUploaded: 0,
        errors: [
          error instanceof Error 
            ? error.message 
            : 'Error desconocido durante la importación'
        ]
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Calcular progreso en porcentaje
  const progressPercent = progress 
    ? (progress.current / progress.total) * 100 
    : 0

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">WP Importer</h1>
        <p className="text-muted-foreground">
          Importa categorías y proyectos de WooCommerce a Supabase
        </p>
      </div>

      {/* Configuración de WooCommerce */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuración de WooCommerce</CardTitle>
          <CardDescription>
            Configura las credenciales de tu tienda WooCommerce
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL de la tienda</Label>
            <Input
              id="url"
              placeholder="https://tutienda.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isConnecting || isImporting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="consumer-key">Consumer Key</Label>
            <Input
              id="consumer-key"
              placeholder="ck_xxxxxxxxxxxxx"
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
              disabled={isConnecting || isImporting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="consumer-secret">Consumer Secret</Label>
            <Input
              id="consumer-secret"
              type="password"
              placeholder="cs_xxxxxxxxxxxxx"
              value={consumerSecret}
              onChange={(e) => setConsumerSecret(e.target.value)}
              disabled={isConnecting || isImporting}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={testConnection}
              disabled={!url || !consumerKey || !consumerSecret || isConnecting || isImporting}
            >
              {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isConnecting ? 'Conectando...' : 'Probar Conexión'}
            </Button>

            <Button
              variant="outline"
              onClick={loadSavedConfig}
              disabled={isConnecting || isImporting}
            >
              Cargar Guardado
            </Button>
          </div>

          {/* Estado de conexión */}
          {isConnected && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Conexión exitosa con WooCommerce
              </AlertDescription>
            </Alert>
          )}

          {connectionError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{connectionError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Importación */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Importar Datos</CardTitle>
          <CardDescription>
            Selecciona qué tipo de datos deseas importar desde WooCommerce
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selector de tipo de importación */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setImportType('categories')}
              disabled={isImporting}
              className={`p-4 rounded-lg border-2 transition-all ${
                importType === 'categories'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground/50'
              } ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FolderOpen className={`h-8 w-8 mx-auto mb-2 ${importType === 'categories' ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="font-medium">Categorías</div>
              <div className="text-xs text-muted-foreground">
                Importa las categorías de productos
              </div>
            </button>
            
            <button
              onClick={() => setImportType('projects')}
              disabled={isImporting}
              className={`p-4 rounded-lg border-2 transition-all ${
                importType === 'projects'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-muted-foreground/50'
              } ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Image className={`h-8 w-8 mx-auto mb-2 ${importType === 'projects' ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="font-medium">Proyectos</div>
              <div className="text-xs text-muted-foreground">
                Importa productos como proyectos
              </div>
            </button>
          </div>

          {importType === 'projects' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Nota:</strong> Los productos se importarán como proyectos. 
                Asegúrate de haber importado las categorías primero.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={startImport}
            disabled={!isConnected || isImporting}
            className="w-full"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando {importType === 'categories' ? 'categorías' : 'proyectos'}...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Importar {importType === 'categories' ? 'Categorías' : 'Proyectos'}
              </>
            )}
          </Button>

          {/* Progreso */}
          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress.status}</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              {progress.category && (
                <p className="text-sm text-muted-foreground">
                  Procesando: {progress.category}
                </p>
              )}
              <Progress value={progressPercent} />
            </div>
          )}

          {/* Resultado */}
          {result && (
            <div className="space-y-4 mt-4">
              <Alert variant={result.success ? 'default' : 'destructive'}>
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {result.success 
                    ? `Importación completada exitosamente` 
                    : 'La importación tuvo errores'}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-semibold">Categorías importadas</div>
                  <div className="text-2xl">{result.categoriesImported}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-semibold">Proyectos importados</div>
                  <div className="text-2xl">{result.projectsImported}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-semibold">Imágenes subidas</div>
                  <div className="text-2xl">{result.imagesUploaded}</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Errores:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.errors.map((error, index) => (
                      <Alert key={index} variant="destructive" className="py-2">
                        <AlertDescription className="text-xs">
                          {error}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle>Cómo obtener las credenciales de WooCommerce</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ol className="list-decimal list-inside space-y-2">
            <li>Ve a tu panel de WordPress</li>
            <li>Navega a <strong>WooCommerce → Ajustes → Avanzado → API REST</strong></li>
            <li>Haz clic en <strong>Añadir clave</strong></li>
            <li>Descripción: "Importador de categorías"</li>
            <li>Usuario: Selecciona un usuario administrador</li>
            <li>Permisos: <strong>Solo lectura</strong></li>
            <li>Haz clic en <strong>Generar clave API</strong></li>
            <li>Copia el <strong>Consumer key</strong> y <strong>Consumer secret</strong></li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
