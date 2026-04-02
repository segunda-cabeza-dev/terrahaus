import React from "react";
import LandingFooter from '../components/LandingFooter';
import FormularioLanding from "../components/FormularioLanding";
import { img } from '../lib/assets';
import { ArrowRight, CheckCircle2, Ruler, PenTool, Hammer, Clock } from "lucide-react";

const SectionTitle: React.FC<{ subtitle: string; title: React.ReactNode; light?: boolean }> = ({ subtitle, title, light = false }) => (
  <div className="mb-12">
    <div
      className="uppercase mb-2 tracking-widest"
      style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: '#b35427' }}
    >
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

const HeroLanding: React.FC = () => {
  return (
    <section className="relative h-[80vh] min-h-[460px] flex flex-col overflow-hidden md:h-[85vh] md:min-h-[560px]">
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/assets/images/aire-acondicionado-hero.jpg"
          alt="Instalación de aire acondicionado"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/80" />
      </div>

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
            className="text-white mb-4 uppercase tracking-tight text-[44px] leading-[0.92] md:leading-[0.95]"
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: 'clamp(44px,7.6vw,78px)',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}
          >
            AIRE ACONDICIONADO
            <br className="md:hidden" />
            <span className="hidden md:inline"> </span>
            EN ALICANTE
            <br />
            <span className="text-[#b35427] text-[0.82em] leading-[0.95]">
              <span className="md:hidden">INSTALACIÓN, REPARACIÓN</span>
              <span className="hidden md:inline">INSTALACIÓN, REPARACIÓN Y MANTENIMIENTO</span>
            </span>
            <br className="md:hidden" />
            <span className="text-[#b35427] text-[0.82em] leading-[0.95] md:hidden">Y MANTENIMIENTO</span>
          </h1>
          <p
            className="text-gray-200 mb-8 max-w-md md:max-w-2xl font-light leading-relaxed"
            style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}
          >
            Instalamos aire acondicionado en viviendas y negocios con una propuesta clara, montaje limpio y equipos pensados para rendir bien desde el primer día.
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
};

const ServiciosClimatizacion: React.FC = () => {
  const servicios = [
    {
      titulo: "Instalación de Split y Multisplit",
      descripcion: "Instalamos equipos 1x1 y multisplit con la potencia adecuada y la mejor ubicación para rendir bien y consumir menos."
    },
    {
      titulo: "Sustitución de Equipos Antiguos",
      descripcion: "Retiramos tu equipo antiguo y lo sustituimos por uno más eficiente, silencioso y fiable."
    },
    {
      titulo: "Aire Acondicionado por Conductos",
      descripcion: "Soluciones por conductos para viviendas en reforma o espacios donde buscas una instalación más limpia y discreta."
    },
    {
      titulo: "Mantenimiento Preventivo",
      descripcion: "Revisamos filtros, drenajes y funcionamiento general para prevenir averías y alargar la vida útil del equipo."
    },
    {
      titulo: "Puesta en Marcha y Ajustes",
      descripcion: "Dejamos el sistema ajustado y funcionando correctamente para que enfríe bien desde el primer uso."
    },
    {
      titulo: "Climatización para Vivienda y Negocio",
      descripcion: "Trabajamos tanto en viviendas como en despachos, oficinas y pequeños locales comerciales."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-left md:text-center mb-16">
          <h3 className="text-[#b35427] mb-2 uppercase tracking-widest" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px' }}>
            Qué Hacemos
          </h3>
          <h2 className="uppercase leading-[0.95] text-black mt-0" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '50px' }}>
            Servicios de Climatización
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((servicio, idx) => (
            <div key={idx} className="group p-8 border border-gray-200 hover:border-[#b35427] transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 bg-[#b35427] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h4 className="mb-3 text-black font-bold" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '22px', lineHeight: '1.2' }}>
                {servicio.titulo}
              </h4>
              <p className="text-gray-600 font-light leading-relaxed" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
                {servicio.descripcion}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contacto"
            className="inline-flex h-12 items-center justify-center bg-[#b35427] px-8 font-medium text-white transition-colors hover:bg-[#9a4620] uppercase tracking-wide"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px' }}
          >
            Solicitar Presupuesto
          </a>
        </div>
      </div>
    </section>
  );
};

const ConceptoTecnico: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <SectionTitle
              subtitle="NUESTRO ENFOQUE"
              title={<>NO SOLO INSTALAMOS,<br />TE AYUDAMOS A ACERTAR</>}
            />
            <div className="space-y-6 text-gray-700 font-light" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
              <p>
                En <strong>Terrahaus</strong> revisamos el espacio, el uso real y las condiciones de la instalación antes de recomendarte un equipo. Así evitamos soluciones improvisadas o máquinas mal dimensionadas.
              </p>
              <p>
                El objetivo es simple: que el aire acondicionado enfríe bien, haga poco ruido y quede instalado de forma limpia y ordenada.
              </p>
              <div className="pt-4 border-l-4 border-[#b35427] pl-6 italic text-gray-900">
                "Una instalación bien pensada se nota en el confort, en el consumo y en el acabado final."
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden relative z-10">
              <img
                src="/assets/images/l1-aire-acondicionado-1.jpg"
                alt="Revisión técnica de instalación de climatización"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
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
      title: "1. EVALUACIÓN DEL ESPACIO",
      desc: "Analizamos tu vivienda o local para definir la mejor opción."
    },
    {
      icon: <PenTool strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "2. PROPUESTA PERSONALIZADA",
      desc: "Te recomendamos el sistema más adecuado según uso y necesidades."
    },
    {
      icon: <Hammer strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "3. INSTALACIÓN CUIDADA",
      desc: "Realizamos la instalación de forma limpia, precisa y ordenada."
    },
    {
      icon: <Clock strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "4. COMPROBACIÓN FINAL",
      desc: "Verificamos el funcionamiento y ajustamos el sistema para un rendimiento óptimo."
    },
  ];

  return (
    <section className="py-20 bg-[#111] text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="text-left md:text-center mb-16">
          <h2 className="text-[#b35427] text-xl tracking-widest uppercase mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            ASÍ TRABAJAMOS
          </h2>
          <p className="text-4xl md:text-5xl leading-[0.95]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            Un proceso claro para que tomes la mejor decisión desde el principio.
          </p>
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

const VentajasCompetitivas: React.FC = () => {
  return (
    <section className="py-20 bg-[#f4f4f4]">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative w-full min-h-[340px]">
              <img
                src="/assets/images/l1-aire-acondicionado-2.jpg"
                alt="Detalle técnico de instalación"
                className="w-full min-h-[340px] max-h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500 relative z-10"
                style={{ height: '100%' }}
              />
              <div className="absolute -bottom-6 -left-6 w-2/3 h-2/3 border-2 border-[#b35427] z-0 hidden md:block"></div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <SectionTitle
              subtitle="RIGOR Y GARANTÍA"
              title={<>TRABAJO LIMPIO,<br />CLARO Y BIEN EJECUTADO</>}
            />
            <div className="space-y-6">
              {[
                { title: "Asesoramiento Real", desc: "Te ayudamos a elegir el equipo adecuado según metros, uso y tipo de espacio." },
                { title: "Instalación Cuidada", desc: "Nos ocupamos de que el montaje quede limpio, ordenado y con buenos remates." },
                { title: "Presupuesto Claro", desc: "Te explicamos qué incluye la instalación para que sepas exactamente qué estás contratando." },
                { title: "Pensado para Durar", desc: "Buscamos soluciones fiables, eficientes y fáciles de mantener con el paso del tiempo." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#b35427]" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', lineHeight: 1.1 }}>
                      {item.title}
                    </h4>
                    <p className="text-gray-600 font-light" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px', lineHeight: 1.4 }}>
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

const EspecificacionesTecnicas: React.FC = () => {
  return (
    <section className="py-20 bg-[#1a1a1a] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-[#b35427] text-2xl mb-6 uppercase" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              Qué Revisamos
            </h3>
            <h2 className="text-4xl md:text-5xl mb-8 uppercase leading-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              Qué tenemos en cuenta
              <br />
              en cada instalación
            </h2>
            <p className="text-gray-400 font-light text-lg mb-8" style={{ fontFamily: 'Barlow, sans-serif' }}>
              No todas las viviendas ni todos los locales necesitan lo mismo. Revisamos los puntos clave para proponerte una instalación que funcione bien y no dé problemas.
            </p>
            <a
              href="#contacto"
              className="inline-flex h-12 items-center justify-center bg-[#b35427] px-8 font-medium text-white transition-colors hover:bg-[#9a4620] uppercase tracking-wide"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px' }}
            >
              Solicitar Estudio Técnico
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {[
              { title: "Potencia adecuada", details: ["Metros y distribución del espacio", "Orientación y exposición al sol", "Uso real de la estancia"] },
              { title: "Montaje bien resuelto", details: ["Recorridos limpios y discretos", "Ubicación correcta de las unidades", "Desagües y remates bien ejecutados"] },
              { title: "Confort y consumo", details: ["Buen rendimiento del equipo", "Menor nivel de ruido", "Funcionamiento eficiente"] },
              { title: "Mantenimiento sencillo", details: ["Acceso razonable para revisión", "Limpieza y cuidado del sistema", "Prevención de averías comunes"] }
            ].map((item, idx) => (
              <div key={idx} className="border-t border-gray-700 pt-4">
                <h4 className="text-xl mb-3 text-white uppercase" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {item.title}
                </h4>
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

const L2AireAcondicionado: React.FC = () => {
  return (
    <>
      <HeroLanding />
      <ServiciosClimatizacion />
      <ConceptoTecnico />
      <ProcesoTrabajo />
      <VentajasCompetitivas />
      <EspecificacionesTecnicas />
      <FormularioLanding
        reformType="Aire acondicionado"
        source="aire-acondicionado"
        image="/assets/images/l1-aire-acondicionado-3.jpg"
        imageAlt="Instalación de aire acondicionado"
        description="Completa el formulario y te contactaremos en menos de 24 horas para valorar tu instalación o sustitución de aire acondicionado."
        messagePlaceholder="Cuéntanos qué necesitas: tipo de espacio, metros, equipo actual y ubicación 💭"
      />
      <LandingFooter />
    </>
  );
};

export default L2AireAcondicionado;
