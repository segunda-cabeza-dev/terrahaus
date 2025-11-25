import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Switch } from '@/shared/components/ui/switch'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Progress } from '@/shared/components/ui/progress'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/shared/components/ui/alert-dialog'
import { useToast } from '@/shared/hooks/use-toast'
import { Toaster } from '@/shared/components/ui/toaster'

export default function ComponentsShowcase() {
  const [progress, setProgress] = useState(33)
  const { toast } = useToast()

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">shadcn/ui Components Showcase</h1>
        <p className="text-muted-foreground">Todos los componentes de shadcn/ui en una sola página</p>
      </div>

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Diferentes variantes de botones</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">⚡</Button>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>Inputs, labels y otros elementos de formulario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Acepto términos y condiciones</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Modo avión</Label>
          </div>
        </CardContent>
      </Card>

      {/* Select */}
      <Card>
        <CardHeader>
          <CardTitle>Select</CardTitle>
          <CardDescription>Menú desplegable de selección</CardDescription>
        </CardHeader>
        <CardContent>
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecciona una fruta" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Frutas</SelectLabel>
                <SelectItem value="apple">Manzana</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Naranja</SelectItem>
                <SelectItem value="grape">Uva</SelectItem>
                <SelectItem value="pineapple">Piña</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Pestañas para organizar contenido</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">Cuenta</TabsTrigger>
              <TabsTrigger value="password">Contraseña</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Gestiona la configuración de tu cuenta aquí.
              </p>
            </TabsContent>
            <TabsContent value="password" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Cambia tu contraseña aquí.
              </p>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ajusta tus preferencias aquí.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Accordion</CardTitle>
          <CardDescription>Contenido expandible y colapsable</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>¿Qué es shadcn/ui?</AccordionTrigger>
              <AccordionContent>
                shadcn/ui es una colección de componentes reutilizables construidos con Radix UI y Tailwind CSS.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>¿Es accesible?</AccordionTrigger>
              <AccordionContent>
                Sí, todos los componentes están construidos con accesibilidad en mente usando Radix UI.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>¿Es personalizable?</AccordionTrigger>
              <AccordionContent>
                Totalmente. Los componentes son tuyos para modificar como necesites.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Avatar & Badge */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar & Badge</CardTitle>
          <CardDescription>Avatares de usuario y badges informativos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>Barra de progreso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <div className="flex gap-2">
            <Button onClick={() => setProgress(Math.max(0, progress - 10))} size="sm">
              - 10%
            </Button>
            <Button onClick={() => setProgress(Math.min(100, progress + 10))} size="sm">
              + 10%
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert Dialog & Toast */}
      <Card>
        <CardHeader>
          <CardTitle>Dialogs & Toasts</CardTitle>
          <CardDescription>Diálogos de alerta y notificaciones toast</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Abrir Alert Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta
                  y removerá tus datos de nuestros servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Notificación Toast",
                description: "Este es un mensaje de ejemplo usando el componente Toast.",
              })
            }}
          >
            Mostrar Toast
          </Button>
        </CardContent>
      </Card>

      {/* Cards Examples */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Card Simple</CardTitle>
            <CardDescription>Una tarjeta básica</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Contenido de la tarjeta aquí.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card con Footer</CardTitle>
            <CardDescription>Incluye footer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Contenido principal.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Acción</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Completa</CardTitle>
            <CardDescription>Con todos los elementos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Texto de ejemplo con badge <Badge variant="secondary">Nuevo</Badge></p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost">Cancelar</Button>
            <Button>Guardar</Button>
          </CardFooter>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}
