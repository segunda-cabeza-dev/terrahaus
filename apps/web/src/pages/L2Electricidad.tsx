import React from "react";
import LandingFooter from '../components/LandingFooter';
import { img } from '../lib/assets';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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

// 1️⃣ HERO
const HeroLanding: React.FC = () => {
  return (
  <section className="relative h-[80vh] min-h-[460px] flex flex-col overflow-hidden md:h-[85vh] md:min-h-[560px]">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={img("landing-electricidad-hero.jpg")}
          alt="Instalaciones eléctricas profesionales"
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
          ELECTRICISTA EN ALICANTE<br />
          <span className="text-[#b35427]">PARA HOGARES Y COMUNIDADES</span>
        </h1>
        <p
          className="text-gray-200 mb-8 max-w-md md:max-w-2xl font-light leading-relaxed"
          style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}
        >
          Instalaciones de enlace, línea general de alimentación, derivación individual y puesta a tierra.
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

// 2️⃣ BLOQUE SERVICIOS
const ServiciosElectricidad: React.FC = () => {
  const servicios = [
    {
      titulo: "Puesta a Tierra de Comunidades",
      descripcion: "Medición, verificación y renovación del sistema de puesta a tierra para garantizar la seguridad de las personas y los bienes."
    },
    {
      titulo: "Instalaciones de Enlace",
      descripcion: "Adaptación y renovación de instalaciones de enlace según normativa vigente."
    },
    {
      titulo: "Centralización de Contadores",
      descripcion: "Actualización de cuartos de contadores para mayor seguridad y accesibilidad."
    },
    {
      titulo: "Línea General de Alimentación",
      descripcion: "Sustitución o refuerzo de la LGA, revisión de secciones y corrección de recalentamientos."
    },
    {
      titulo: "Derivación Individual",
      descripcion: "Renovación de derivaciones individuales y adaptación por aumento de potencia."
    },
    {
      titulo: "Puesta a Tierra Eléctrica",
      descripcion: "Instalación y mantenimiento de sistemas de puesta a tierra para protección de las personas y los bienes."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-left md:text-center mb-16">
          <h3 className="text-[#b35427] mb-2 uppercase tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px' }}>Alcance de la Intervención</h3>
          <h2 className="uppercase leading-[0.95] text-black mt-0" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '50px' }}>
            Qué Contempla Nuestra Intervención
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio, idx) => (
            <div key={idx} className="group p-8 border border-gray-200 hover:border-[#b35427] transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-[#b35427] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="mb-3 text-black font-bold" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '22px', lineHeight: '1.2' }}>{servicio.titulo}</h4>
              <p className="text-gray-600 font-light leading-relaxed" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
                {servicio.descripcion}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#contacto" className="inline-flex h-12 items-center justify-center bg-[#b35427] px-8 font-medium text-white transition-colors hover:bg-[#9a4620] uppercase tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px' }}>
            Solicitar Presupuesto
          </a>
        </div>
      </div>
    </section>
  );
};

// 3️⃣ BLOQUE "TIPOS DE ACTUACIÓN"
const TiposActuacion: React.FC = () => {
  const actuaciones = [
    { name: "COMUNIDADES ANTIGUAS", img: "1-comunidades-antiguas.webp", desc: "Actualización de instrucciones de enlace deterioradas" },
    { name: "REFORMA DE CUARTO DE CONTADORES", img: "2-cuarto-contadores.webp", desc: "Orden, seguridad y accesibilidad" },
    { name: "ADECUACIÓN POR AUMENTO DE POTENCIA", img: "3-aumento-potencia.webp", desc: "Preparado para nuevas demandas energéticas" },
    { name: "REVISIÓN Y MEJORA DE PUESTA A TIERRA", img: "4-puesta-tierra.webp", desc: "Prevención de derivaciones y riesgos" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-left md:text-center mb-16">
          <h3 className="text-[#b35427] mb-2 uppercase tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px' }}>Proyectos</h3>
          <h2 className="uppercase leading-[0.95] text-black mt-0" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '50px' }}>
            Intervenciones en Edificios y Comunidades
          </h2>
        </div>
        
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actuaciones.map((item, idx) => {
              // Acortar el título para el card de "ADECUACIÓN POR AUMENTO DE POTENCIA"
              let displayName = item.name;
              if (item.name === "ADECUACIÓN POR AUMENTO DE POTENCIA") {
                displayName = "ADECUACIÓN DE POTENCIA";
              }
              return (
                <div key={idx} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
                  <div className="h-[320px] w-full overflow-hidden">
                    <img src={img(item.img)} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-center">
                    <h3 className="text-[#b35427] text-2xl font-bold mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{displayName}</h3>
                    <p className="text-gray-700" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Enlace eliminado por solicitud del usuario */}
      </div>
    </section>
  );
};

// 4️⃣ BLOQUE FILOSOFÍA
const ConceptoArquitectonico: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <div className="mb-12">
              <div className="text-[#b35427] uppercase mb-2 tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px' }}>
                NUESTRA FILOSOFÍA
              </div>
              <h2 className="text-black leading-[0.95]" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '50px', fontWeight: 400 }}>
                MÁS QUE UNA REPARACIÓN,<br/>UNA INTERVENCIÓN TÉCNICA COMPLETA
              </h2>
            </div>
            <div className="space-y-6 text-gray-700 font-light" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
              <p>
                La instalación eléctrica es la estructura invisible que sostiene el edificio. En <strong>Terrahaus</strong> no se trata solo de sustituir cables: analizamos cargas, recorridos, secciones y puntos críticos para garantizar seguridad y estabilidad a largo plazo.
              </p>
              <p>
                Si el edificio es antiguo o ha sufrido ampliaciones, planteamos soluciones técnicas coherentes y escalables.
              </p>
              <div className="pt-4 border-l-4 border-[#b35427] pl-6 italic text-gray-900">
                "Instalación ordenada, documentada y ejecutada con criterio técnico desde el inicio."
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden relative z-10">
               <img 
                src={img("arquitecto-electricidad.webp")} 
                alt="Instalación eléctrica profesional" 
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

// 5️⃣ METODOLOGÍA (4 pasos)
const ProcesoTrabajo: React.FC = () => {
  const steps = [
    {
      icon: <Ruler strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "1. DIAGNÓSTICO Y MEDICIÓN",
      desc: "Inspección visual y comprobaciones técnicas."
    },
    {
      icon: <PenTool strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "2. PROPUESTA TÉCNICA",
      desc: "Alcance definido, partidas claras y planificación."
    },
    {
      icon: <Hammer strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "3. EJECUCIÓN COORDINADA",
      desc: "Intervención segura minimizando cortes."
    },
    {
      icon: <Clock strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "4. VERIFICACIÓN Y ENTREGA",
      desc: "Comprobaciones finales y documentación."
    },
  ];

  return (
    <section className="py-20 bg-[#111] text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-left md:text-center mb-16">
          <h2 className="text-[#b35427] text-xl tracking-widest uppercase mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Metodología Terrahaus</h2>
          <p className="text-4xl md:text-5xl uppercase leading-[0.95]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Tu instalación en 4 pasos</p>
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

// 6️⃣ BLOQUE "SOMOS CONSTRUCTORA"
const VentajasCompetitivas: React.FC = () => {
  return (
    <section className="py-20 bg-[#f4f4f4]">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
         <div className="relative w-full min-h-[340px]">
           <img src={img("Detalle-constructivo.webp", true)} alt="Detalle constructivo" className="w-full min-h-[340px] max-h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500 relative z-10" style={{height: '100%'}} />
           {/* Recuadro decorativo alineado a la izquierda */}
           <div className="absolute -bottom-6 -left-6 w-2/3 h-2/3 border-2 border-[#b35427] z-0 hidden md:block"></div>
         </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="mb-12">
              <div className="text-[#b35427] uppercase mb-2 tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px' }}>
                RIGOR Y GARANTÍA
              </div>
              <h2 className="text-black leading-[0.95]" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '50px', fontWeight: 400 }}>
                NO SOMOS SOLO ELECTRICISTAS,<br/>SOMOS CONSTRUCTORA
              </h2>
            </div>
            <div className="space-y-6">
              {[
                { title: "Responsable Técnico de Referencia", desc: "Un técnico contigo desde la primera visita. Coordinación de gremios y seguimiento real de la obra." },
                { title: "Coordinación Real con Otros Gremios", desc: "Trabajamos de forma integrada con albañilería, fontanería y otros oficios cuando es necesario." },
                { title: "Presupuesto Cerrado por Partidas", desc: "Alcance definido por contrato, con partidas claras. Evitamos sorpresas y extras improvisados." },
                { title: "Intervenciones Pensadas a Largo Plazo", desc: "Soluciones técnicas escalables y preparadas para futuras necesidades del edificio." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#b35427]" />
                  </div>
                  <div>
                    <h4
                      className="font-bold mb-1"
                      style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', lineHeight: 1.1 }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-gray-600 font-light"
                      style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px', lineHeight: 1.4 }}
                    >
                      {item.desc}
                    </p>
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

// 7️⃣ FORMULARIO
const FormularioConstruccion: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    reformType: 'Puesta a tierra',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'electricidad',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el formulario');
      }

      window.location.href = '/gracias';
    } catch {
      setError('Hubo un problema al enviar. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-left md:text-center mb-12">
           <h2 className="text-5xl uppercase mb-2 leading-[0.95]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Cuéntanos tu Proyecto</h2>
           <p className="text-gray-600 font-light" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
             Cuéntanos qué necesitas. Te contacta el equipo técnico para preparar una propuesta y, si encaja, agendar una visita gratuita.
           </p>
        </div>

        <div className="bg-[#f9f9f9] p-8 md:p-12 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#b35427]"></div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
          >
            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Nombre</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#b35427] transition-colors rounded-none"
                style={{ fontFamily: 'Barlow, sans-serif' }}
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#b35427] transition-colors rounded-none"
                style={{ fontFamily: 'Barlow, sans-serif' }}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Teléfono</label>
              <div className="phone-input-architect">
                <PhoneInput
                  country={'es'}
                  value={formData.phone}
                  onChange={(phone) => setFormData({ ...formData, phone })}
                  inputClass="!w-full !bg-white !border-b-2 !border-gray-200 !border-t-0 !border-l-0 !border-r-0 !rounded-none !h-[49px] !pl-12 focus:!border-[#b35427]"
                  buttonClass="!bg-transparent !border-none !rounded-none"
                  containerClass="!w-full"
                  inputStyle={{ fontFamily: 'Barlow, sans-serif' }}
                />
              </div>
            </div>

            <div className="md:col-span-1">
               <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Tipo de Intervención</label>
               <select 
                 value={formData.reformType}
                 onChange={(e) => setFormData({ ...formData, reformType: e.target.value })}
                 className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#b35427] transition-colors rounded-none appearance-none cursor-pointer" 
                 style={{ fontFamily: 'Barlow, sans-serif' }}
               >
                 <option>Puesta a tierra</option>
                 <option>Instalación de enlace</option>
                 <option>Línea general de alimentación</option>
                 <option>Derivación individual</option>
                 <option>Cuarto de contadores</option>
                 <option>Otro</option>
               </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Detalles del Proyecto</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tipo de edificio, número de viviendas, antigüedad, problemas detectados, ubicación..."
                className="w-full bg-white border-2 border-gray-200 p-4 focus:outline-none focus:border-[#b35427] transition-colors rounded-none resize-none"
                style={{ fontFamily: 'Barlow, sans-serif' }}
              ></textarea>
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white p-5 uppercase tracking-[2px] hover:bg-[#b35427] transition-colors duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px' }}
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Presupuesto'}
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">
                Protegemos tus datos. Al enviar aceptas nuestra política de privacidad.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const L2Electricidad: React.FC = () => {
  return (
    <>
      <HeroLanding />
      <ServiciosElectricidad />
      <TiposActuacion />
      <ConceptoArquitectonico />
      <ProcesoTrabajo />
      <VentajasCompetitivas />
      <FormularioConstruccion />
      <LandingFooter />
    </>
  );
};

export default L2Electricidad;
