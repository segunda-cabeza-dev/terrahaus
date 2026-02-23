import React from "react";
import LandingFooter from '../components/LandingFooter';
import FormularioLanding from "../components/FormularioLanding";
import { img } from '../lib/assets';
import { ArrowRight, CheckCircle2, Ruler, PenTool, Hammer, Clock } from "lucide-react";

// --- Components Helpers ---

const SectionTitle: React.FC<{ subtitle: string; title: React.ReactNode; light?: boolean }> = ({ subtitle, title, light = false }) => (
  <div className="mb-12">
    <div className={`text-[${light ? '#b35427' : '#b35427'}] uppercase mb-2 tracking-widest`} style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#b35427' }}>
      {subtitle}
    </div>
    <h2
      className={`${light ? 'text-white' : 'text-black'} leading-[0.95]`}
      style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 'clamp(40px, 5vw, 64px)',
        fontWeight: 400,
      }}
    >
      {title}
    </h2>
  </div>
);

// --- Sections ---

const HeroLanding: React.FC = () => {
  return (
  <section className="relative h-[80vh] min-h-[460px] flex flex-col overflow-hidden md:h-[85vh] md:min-h-[560px]">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={img("reformas-integrales-cocina.webp")}
          alt="Reformas de cocina exclusivas"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center text-center px-4 md:px-8 py-10 md:py-12">
        <div className="mb-6">
          <img
            src={img("Logo terrahous Blanco.webp")}
            alt="Terrahaus"
            className="h-10 md:h-12 w-auto mx-auto opacity-90"
            style={{ maxWidth: '180px' }}
            loading="eager"
          />
        </div>
        <h1
          className="text-white mb-4 uppercase leading-[0.95] tracking-tight"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(48px,9vw,78px)',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          REFORMAS DE COCINA<br />
          <span className="text-[#b35427]">PREMIUM A PRECIOS INSUPERABLES</span>
        </h1>
        <p
          className="text-gray-200 mb-8 max-w-md md:max-w-2xl font-light leading-relaxed"
          style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}
        >
          Reforma integral con un solo equipo coordinando todo: medición, proyecto, obra y montaje.
        </p>
        <a
          href="#contacto"
          className="group bg-white text-black hover:bg-[#b35427] hover:text-white transition-all duration-300 py-3 px-6 font-bold uppercase tracking-wider flex items-center gap-3 text-base md:text-[20px]"
          style={{ fontFamily: 'Bebas Neue, sans-serif' }}
        >
          SOLICITAR ESTUDIO GRATUITO
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      </div>
    </section>
  );
}

const ConceptoArquitectonico: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <SectionTitle 
              subtitle="NUESTRA FILOSOFÍA" 
              title={<>MÁS QUE UNA REFORMA,<br/>UN PROYECTO DE ARQUITECTURA</>} 
            />
            <div className="space-y-6 text-lg text-gray-700 font-light" style={{ fontFamily: 'Barlow, sans-serif' }}>
              <p>
                La cocina es el espacio donde pasa la vida: desayunos rápidos, cenas largas y conversaciones que se alargan. En <strong>Terrahaus</strong> tratamos cada reforma como un proyecto integral, pensado para el uso real.
              </p>
              <p>
                No se trata solo de cambiar muebles. Definimos distribución, luz, recorridos, almacenamiento y puntos de trabajo para que cocinar, ordenar y moverse sea fácil.
              </p>
              <p>
                Y si tu objetivo es <strong>revalorizar</strong> o preparar la vivienda para <strong>alquiler</strong>, priorizamos soluciones resistentes, de mantenimiento sencillo y una estética que funciona en mercado.
              </p>
              <div className="pt-4 border-l-4 border-[#b35427] pl-6 italic text-gray-900">
                "Mobiliario directo de fábrica, coordinación de obra y un presupuesto por partidas desde el inicio."
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden relative z-10">
               <img 
                src={img("Especializaciones1.webp")} 
                alt="Diseño de cocina minimalista" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 border-2 border-[#b35427] z-0 hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProcesoTrabajo: React.FC = () => {
  const steps = [
    {
      icon: <Ruler strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "1. DIAGNÓSTICO Y MEDICIÓN",
      desc: "Visitamos la vivienda, medimos y definimos el objetivo (uso diario, familia, alquiler o venta) para acertar desde el principio."
    },
    {
      icon: <PenTool strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "2. PROYECTO Y DISEÑO 3D",
      desc: "Nuestro equipo de arquitectos elabora una propuesta de distribución y diseño con visualización 3D fotorrealista."
    },
    {
      icon: <Hammer strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "3. EJECUCIÓN TÉCNICA",
      desc: "Coordinación total de gremios. Fontanería, electricidad, albañilería y montaje de mobiliario bajo estricta supervisión."
    },
    {
      icon: <Clock strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "4. ENTREGA LLAVE EN MANO",
      desc: "Limpieza final, revisión de calidad y entrega de tu cocina lista para usar. Sin remates pendientes."
    },
  ];

  return (
    <section className="py-20 bg-[#111] text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-left md:text-center mb-16">
          <h2 className="text-[#b35427] text-xl tracking-widest uppercase mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Metodología Terrahaus</h2>
          <p className="text-4xl md:text-5xl uppercase leading-[0.95]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Tu cocina lista en 4 pasos</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 text-center">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="group flex flex-col items-center flex-1 min-w-[180px] max-w-[260px]">
                <div className="mb-6 flex flex-col items-center relative w-full">
                  <div className="w-14 h-14 bg-[#222] rounded-full flex items-center justify-center group-hover:bg-[#b35427] transition-colors duration-300 mx-auto">
                    {React.cloneElement(step.icon, { className: 'w-8 h-8 text-white' })}
                  </div>
                </div>
                <h3 className="text-2xl mb-4 text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{step.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
                  {step.desc}
                </p>
              </div>
              {/* Línea solo entre los pasos, centrada verticalmente */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block h-0.5 bg-[#333]" style={{ width: '60px', alignSelf: 'center' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

// Sección "Por qué Terrahaus" con enfoque técnico/construcción
const VentajasCompetitivas: React.FC = () => {
  return (
    <section className="py-20 bg-[#f4f4f4]">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
             <div className="grid grid-cols-2 gap-4">
                <img src={img("Especializaciones2.webp")} alt="Detalle constructivo" className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                <img src={img("Especializaciones3.webp")} alt="Acabados premium" className="w-full h-64 object-cover mt-8 grayscale hover:grayscale-0 transition-all duration-500" />
             </div>
          </div>
          <div className="order-1 md:order-2">
            <SectionTitle 
              subtitle="RIGOR Y GARANTÍA" 
              title={<>SOMOS CONSTRUCTORA,<br/>NO SOLO TIENDA DE MUEBLES</>} 
            />
            <div className="space-y-6">
              {[
                { title: "Un Responsable de Referencia", desc: "Un técnico contigo desde la primera visita. Coordinación de gremios y seguimiento real de la obra." },
                { title: "Directo de Fábrica", desc: "Mobiliario y componentes sin intermediarios. Mejor coste y control de calidades." },
                { title: "Presupuesto Cerrado y por Partidas", desc: "Alcance definido por contrato, con partidas claras. Evitamos sorpresas y extras improvisados." },
                { title: "Plazo Planificado", desc: "Calendario realista y compromiso de fecha de entrega. Ideal si necesitas alquilar o entrar a vivir pronto." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#b35427]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold uppercase mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{item.title}</h4>
                    <p className="text-gray-600 font-light text-sm md:text-base" style={{ fontFamily: 'Barlow, sans-serif' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GaleriaEstilos: React.FC = () => {
  const styles = [
    { name: "CONTEMPORÁNEO", img: "reformas-integrales-cocina.webp", desc: "Líneas puras y funcionalidad" },
    { name: "NÓRDICO / MADERA", img: "Especializaciones1.webp", desc: "Calidez y materiales naturales" },
    { name: "INDUSTRIAL", img: "Especializaciones2.webp", desc: "Carácter y texturas robustas" },
    { name: "CLÁSICO RENOVADO", img: "Especializaciones3.webp", desc: "Elegancia atemporal" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-16">
          <SectionTitle 
              subtitle="PROYECTOS" 
              title="DIVERSIDAD DE ESTILOS, MISMA CALIDAD" 
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {styles.map((style, idx) => (
            <div key={idx} className="group relative h-[500px] overflow-hidden cursor-pointer">
              <img 
                src={img(style.img)} 
                alt={style.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 className="text-white text-3xl mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{style.name}</h3>
                <p className="text-gray-300 font-light border-t border-gray-500 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ fontFamily: 'Barlow, sans-serif' }}>
                  {style.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-gray-500 mb-6 font-light" style={{ fontFamily: 'Barlow, sans-serif' }}>
             Más de 600 acabados y combinaciones para ver y tocar en showroom. Te ayudamos a elegir lo que encaja con tu uso y tu presupuesto.
           </p>
           <a href="#contacto" className="inline-block border-b-2 border-black pb-1 uppercase tracking-widest hover:text-[#b35427] hover:border-[#b35427] transition-colors" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px' }}>
             VER CATÁLOGO COMPLETO
           </a>
        </div>
      </div>
    </section>
  );
};

const EspecificacionesTecnicas: React.FC = () => {
    return (
        <section className="py-20 bg-[#1a1a1a] text-white">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h3 className="text-[#b35427] text-2xl mb-6 uppercase" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Memoria de Calidades</h3>
                        <h2 className="text-4xl md:text-5xl mb-8 uppercase leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                            Todo lo que incluye<br/>tu reforma integral
                        </h2>
                        <p className="text-gray-400 font-light text-lg mb-8" style={{ fontFamily: 'Barlow, sans-serif' }}>
                          Presupuesto "llave en mano" y por partidas: incluye lo necesario para ejecutar sin depender de terceros. Si es para vivienda habitual o inversión, ajustamos materiales y soluciones a tu objetivo.
                        </p>
                        <a href="#contacto" className="inline-flex h-12 items-center justify-center bg-[#b35427] px-8 font-medium text-white transition-colors hover:bg-[#9a4620] uppercase tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px' }}>
                            Solicitar Ficha Técnica
                        </a>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                        {[
                            { title: "Mobiliario Europeo", details: ["Tableros hidrófugos de alta densidad", "Herrajes Blum/Hettich", "Sistemas de cierre soft-close"] },
                            { title: "Encimeras Premium", details: ["Porcelánicos de gran formato", "Cuarzo compacto (Silestone/Compac)", "Granito natural de importación"] },
                            { title: "Instalaciones", details: ["Renovación completa de fontanería", "Nuevos circuitos eléctricos", "Iluminación LED integrada"] },
                            { title: "Electrodomésticos", details: ["Suministro e instalación", "Primeras marcas (Bosch, Siemens, Balay)", "Integración total en mobiliario"] }
                        ].map((item, idx) => (
                            <div key={idx} className="border-t border-gray-700 pt-4">
                                <h4 className="text-xl mb-3 text-white uppercase" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{item.title}</h4>
                                <ul className="space-y-2">
                                    {item.details.map((detail, dIdx) => (
                                        <li key={dIdx} className="flex items-start gap-2 text-gray-400 text-sm font-light" style={{ fontFamily: 'Barlow, sans-serif' }}>
                                            <span className="mt-1.5 w-1 h-1 bg-[#b35427] rounded-full flex-shrink-0"></span>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const L2ReformasCocina: React.FC = () => {
  return (
    <>
      <HeroLanding />
      <ConceptoArquitectonico />
      <ProcesoTrabajo />
      <VentajasCompetitivas />
      <EspecificacionesTecnicas />
      <GaleriaEstilos />
      <FormularioLanding
        reformType="Reforma de Cocina"
        source="reformas-cocina"
        image="reformas-integrales-cocina.webp"
        imageAlt="Cocina reformada"
        description="Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas para conocer tu proyecto de reforma de cocina."
        messagePlaceholder="Cuéntanos sobre tu cocina (metros, distribución, estilo, ubicación) 💭"
      />
      <LandingFooter />
    </>
  );
};

export default L2ReformasCocina;
