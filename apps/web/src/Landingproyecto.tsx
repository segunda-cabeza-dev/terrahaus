import React, { useState, useEffect } from 'react';
import { 
  TreePine, 
  Waves, 
  Map, 
  Home, 
  Utensils, 
  Dumbbell, 
  Car, 
  Leaf, 
  ChevronDown, 
  Calendar,
  CheckCircle2,
  Menu,
  X,
  HardHat,
  Ruler,
  Building2,
  ExternalLink
} from 'lucide-react';

// Ficha Técnica rápida para el portafolio
const ProjectBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200">
    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className={`flex items-center gap-2 text-xl font-bold tracking-tighter ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white">E</div>
          <span>ESTUDIO <span className="font-light">PROYECTOS</span></span>
        </div>
        
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#" className={`text-sm font-medium ${isScrolled ? 'text-slate-600' : 'text-white/80'}`}>Volver a Proyectos</a>
          <button className="border-2 border-emerald-600 text-emerald-600 px-5 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all">
            Contactar
          </button>
        </div>
      </div>
    </nav>
  );
};

const Section = ({ id, title, subtitle, children, image, imageAlt, reverse = false }) => (
  <section id={id} className={`py-24 px-6 md:px-12 lg:px-24 bg-white`}>
    <div className={`max-w-7xl mx-auto flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}>
      <div className="w-full md:w-1/2 space-y-6">
        <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase">{subtitle}</span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight">
          {title}
        </h2>
        <div className="text-lg text-slate-600 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <img src={image} alt={imageAlt} className="rounded-2xl shadow-xl w-full aspect-video object-cover" />
      </div>
    </div>
  </section>
);

const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100">
      <Navbar />

      {/* HERO SECTION - Portafolio Style */}
      <header className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="Proyecto Barbate"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600 rounded-full text-xs font-bold mb-6">
              <HardHat size={14} /> EN EJECUCIÓN
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tight">
              Glamping 4★ <br /><span className="text-emerald-400">Barbate</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-slate-300 mb-8">
              Gestión y ejecución de complejo turístico ecológico a gran escala.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <ProjectBadge icon={Map} label="Ubicación" value="Barbate, Cádiz" />
              <ProjectBadge icon={Building2} label="Escala" value="55 Aloj. / 1.500m²" />
              <ProjectBadge icon={Leaf} label="Tipo" value="Eco-Sostenible" />
              <ProjectBadge icon={Calendar} label="Estado" value="Fase de Inicio" />
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20">
               <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80" className="rounded-xl" alt="Render" />
            </div>
          </div>
        </div>
      </header>

      {/* 1. EL PROYECTO (Resumen de ejecución) */}
      <Section 
        subtitle="Descripción del Encargo"
        title="Un ecosistema turístico integrado"
        image="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80"
        imageAlt="Entorno natural"
      >
        <p>Como responsables de la <strong>ejecución del Glamping 4★ Barbate</strong>, nuestro objetivo es materializar un proyecto turístico de gran envergadura que nace para ofrecer una nueva forma de alojamiento en entornos naturales.</p>
        <p>El proyecto combina arquitectura, paisaje y sostenibilidad. Nuestra labor se centra en asegurar un modelo de desarrollo respetuoso con el entorno, minimizando el impacto sobre el terreno mediante sistemas constructivos avanzados.</p>
      </Section>

      {/* 2. CONCEPTO TÉCNICO */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80" className="rounded-2xl shadow-lg" alt="Concepto" />
                <div className="absolute -bottom-6 -right-6 p-6 bg-emerald-900 text-white rounded-xl shadow-xl hidden md:block max-w-xs">
                  <p className="text-sm italic">"La ejecución técnica respeta el espíritu tailandés adaptándolo a la normativa europea de construcción sostenible."</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              <span className="text-emerald-700 font-bold text-sm uppercase tracking-widest">02. Concepto y Enfoque</span>
              <h2 className="text-4xl font-serif font-bold text-slate-900">Adaptación Técnica y Paisajística</h2>
              <p className="text-lg text-slate-600">Nuestro enfoque en la ejecución se basa en tres pilares fundamentales para garantizar el éxito del proyecto:</p>
              
              <ul className="space-y-4">
                {[
                  { t: "Intervención mínima", d: "Ejecución adaptada a la topografía natural." },
                  { t: "Integración de identidad", d: "Respeto absoluto por el entorno de Barbate." },
                  { t: "Arquitectura inmersiva", d: "Sistemas que favorecen el contacto con la naturaleza." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.t}</h4>
                      <p className="text-slate-600">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ORGANIZACIÓN Y ALCANCE */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900">Alcance de la Obra</h2>
            <div className="w-20 h-1 bg-emerald-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Alojamientos", val: "55 Cabañas", icon: <Home /> },
              { title: "Área Comunitaria", val: "Restaurante/Club", icon: <Utensils /> },
              { title: "Ocio", val: "Piscinas/Deporte", icon: <Waves /> },
              { title: "Urbanización", val: "Movilidad Verde", icon: <Map /> }
            ].map((item, idx) => (
              <div key={idx} className="p-6 border border-slate-100 bg-slate-50 rounded-xl hover:shadow-md transition-all">
                <div className="text-emerald-600 mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-800">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.val}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 rounded-2xl p-10 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-serif mb-4">Detalle de Alojamiento</h3>
              <p className="text-slate-300 mb-6">Ejecutamos 55 unidades prefabricadas independientes concebidas para minimizar la huella física. El proceso se realiza mediante ensamblaje in-situ para evitar grandes movimientos de tierra.</p>
              <div className="flex gap-8">
                <div><p className="text-2xl font-bold text-emerald-400">55</p><p className="text-xs uppercase opacity-60">Unidades</p></div>
                <div><p className="text-2xl font-bold text-emerald-400">1.500m²</p><p className="text-xs uppercase opacity-60">Construidos</p></div>
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1533577116850-9cc66acd8a94?auto=format&fit=crop&q=80" className="rounded-2xl h-80 object-cover" alt="Bungalós" />
          </div>
        </div>
      </section>

      {/* 4. SERVICIOS Y ÁREAS TÉCNICAS */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80" className="rounded-xl aspect-square object-cover" alt="Restauración" />
               <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80" className="rounded-xl aspect-square object-cover mt-8" alt="Piscina" />
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2 space-y-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Edificaciones y Equipamiento</h2>
            <p className="text-lg text-slate-600">El complejo incorpora una serie de edificaciones clave que estamos ejecutando para garantizar la operatividad total:</p>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Recepción y Administración",
                "Restaurante y Club Social con vistas al paisaje",
                "Supermercado y áreas de servicios",
                "Complejo de piscinas y pistas deportivas",
                "Urbanización de viales de tránsito tranquilo",
                "Zonas específicas para Autocaravanas"
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span className="text-slate-700 text-sm font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PAISAJISMO Y MOVILIDAD (Rol del estudio) */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
           <div className="space-y-4">
              <div className="p-3 bg-slate-100 inline-block rounded-lg"><Car size={24} className="text-slate-700" /></div>
              <h4 className="text-xl font-bold">Movilidad Interna</h4>
              <p className="text-slate-600 text-sm">Diseño y ejecución de circuitos que priorizan al peatón, integrando accesos y aparcamientos sin alterar la visual del paisaje natural.</p>
           </div>
           <div className="space-y-4">
              <div className="p-3 bg-slate-100 inline-block rounded-lg"><Leaf size={24} className="text-slate-700" /></div>
              <h4 className="text-xl font-bold">Paisajismo y Reforestación</h4>
              <p className="text-slate-600 text-sm">Utilizamos la vegetación como herramienta técnica para la integración paisajística y la regeneración ambiental de la parcela.</p>
           </div>
           <div className="space-y-4">
              <div className="p-3 bg-slate-100 inline-block rounded-lg"><Building2 size={24} className="text-slate-700" /></div>
              <h4 className="text-xl font-bold">Gestión de Residuos</h4>
              <p className="text-slate-600 text-sm">Implementación de muelle de servicios y puntos limpios integrados para la operativa sostenible del camping y caravanas.</p>
           </div>
        </div>
      </section>

      {/* ESTADO DE LA OBRA (Timeline) */}
      <section className="py-24 bg-emerald-900 text-white px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold">Estado del Proyecto</h2>
            <p className="text-emerald-200 mt-4 italic">Seguimiento de hitos en la ejecución</p>
          </div>
          
          <div className="relative border-l-2 border-emerald-700 ml-4 md:ml-0 space-y-12">
            {[
              { date: "Enero 2024", title: "Planificación y Licitación", status: "Completado" },
              { date: "Mayo 2024", title: "Fase de Inicio: Movimiento de Tierras", status: "En progreso", current: true },
              { date: "Septiembre 2024", title: "Instalación de Unidades Prefabricadas", status: "Pendiente" },
              { date: "Diciembre 2024", title: "Finalización de Urbanización", status: "Pendiente" }
            ].map((step, i) => (
              <div key={i} className="relative pl-8">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${step.current ? 'bg-emerald-400 border-white animate-pulse' : 'bg-emerald-900 border-emerald-700'}`}></div>
                <div className={`${step.current ? 'bg-white/10 p-6 rounded-xl border border-white/20' : 'opacity-50'}`}>
                  <span className="text-xs font-bold text-emerald-400 block mb-1 uppercase tracking-tighter">{step.date}</span>
                  <h4 className="text-xl font-bold">{step.title}</h4>
                  <p className="text-emerald-100/70 text-sm">{step.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER - Professional Studio Style */}
      <footer className="bg-slate-900 text-slate-400 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold text-white mb-2">ESTUDIO PROYECTOS</div>
            <p className="text-sm max-w-xs">Especialistas en la ejecución de proyectos turísticos y residenciales de bajo impacto.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="text-center md:text-right">
              <p className="text-white font-bold mb-1">¿Tienes un proyecto?</p>
              <p className="text-sm">Hablemos sobre ejecución y gestión.</p>
            </div>
            <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-emerald-500 hover:text-white transition-all">
              Contactar con el Equipo
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 flex justify-between text-xs">
          <p>&copy; 2024 Estudio Proyectos. Ejecución Glamping Barbate.</p>
          <div className="flex gap-4">
             <a href="#" className="hover:text-white">Dossier de Empresa</a>
             <a href="#" className="hover:text-white">Proyectos</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;