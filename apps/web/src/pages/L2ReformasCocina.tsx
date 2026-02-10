import React from "react";
import Header from '../components/Header';
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

const HeroLanding: React.FC = () => {
  return (
  <section className="relative h-[85vh] min-h-[480px] flex flex-col justify-center md:justify-center overflow-hidden md:h-screen md:min-h-[600px]">
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

      <Header />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-start text-left px-4 md:px-8 pt-20 md:pt-32 md:items-center md:text-center">
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

// Formulario de estilo arquitectónico / limpio
const FormularioConstruccion: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    reformType: 'Cocina Integral',
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
          source: 'reformas-cocina',
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
        <div className="text-center mb-12">
           <h2 className="text-5xl uppercase mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>Cuéntanos tu Cocina</h2>
           <p className="text-gray-600 font-light text-xl" style={{ fontFamily: 'Barlow, sans-serif' }}>
             Cuéntanos cómo la usas y qué necesitas. Te contacta el equipo técnico para preparar una propuesta y, si encaja, agendar una visita gratuita.
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
               <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Tipo de Reforma</label>
               <select 
                 value={formData.reformType}
                 onChange={(e) => setFormData({ ...formData, reformType: e.target.value })}
                 className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#b35427] transition-colors rounded-none appearance-none cursor-pointer" 
                 style={{ fontFamily: 'Barlow, sans-serif' }}
               >
                 <option>Cocina Integral</option>
                 <option>Cocina + Reforma Parcial</option>
                 <option>Obra Nueva</option>
                 <option>Otro</option>
               </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Detalles del Proyecto</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Metros aproximados, distribución actual, estilo, ubicación, y si es para vivir o para invertir..."
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

const FooterSimple: React.FC = () => (
  <footer className="bg-black text-white py-12 border-t border-gray-800">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
       <div className="flex flex-col items-center md:items-start">
         <img src={img("Logo terrahous Blanco.webp")} alt="Terrahaus" className="h-10 w-auto mb-4 opacity-70" />
         <p className="text-gray-500 text-sm">Empresa de reformas integrales y construcción.</p>
       </div>
       <div className="flex flex-col md:flex-row gap-8 text-center md:text-right">
          <div>
            <span className="block text-[#b35427] uppercase text-xs tracking-wider mb-1">Contacto</span>
            <a href="tel:+34642413996" className="block text-lg hover:text-gray-300 transition-colors">+34 642 413 996</a>
          </div>
           <div>
            <span className="block text-[#b35427] uppercase text-xs tracking-wider mb-1">Email</span>
            <a href="mailto:info@terrahaus.es" className="block text-lg hover:text-gray-300 transition-colors">info@terrahaus.es</a>
          </div>
       </div>
    </div>
  </footer>
);

const L2ReformasCocina: React.FC = () => {
  return (
    <>
      <HeroLanding />
      <ConceptoArquitectonico />
      <ProcesoTrabajo />
      <VentajasCompetitivas />
      <EspecificacionesTecnicas />
      <GaleriaEstilos />
      <FormularioConstruccion />
      <FooterSimple />
    </>
  );
};

export default L2ReformasCocina;
