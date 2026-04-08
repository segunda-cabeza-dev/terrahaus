import React from "react";
import LandingFooter from '../components/LandingFooter';
import { FloatingCallBar } from '../components/FloatingCallBar';
import FormularioLanding from "../components/FormularioLanding";
import { img } from '../lib/assets';
import { CheckCircle2, Ruler, PenTool, Hammer, Clock } from "lucide-react";
import { PHONE_HREF } from '../lib/contact';

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
          src="/assets/images/l2-fontaneria-hero.jpg"
          alt="Servicio de fontanería en vivienda"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/80" />
      </div>

      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center text-center px-4 md:px-8 py-8 md:py-10">
          <div className="mb-7 md:mb-5 -mt-8 md:-mt-12">
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
            FONTANERÍA DE
            <br />
            <span className="text-[#b35427]">URGENCIA EN ALICANTE 24H</span>
          </h1>
          <div className="mt-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-5 text-white text-center">
            <p className="flex items-center gap-2" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
              <span className="text-[#b35427]">✔</span> Atención 24/7
            </p>
            <p className="flex items-center gap-2" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
              <span className="text-[#b35427]">✔</span> Diagnóstico profesional
            </p>
            <p className="flex items-center gap-2" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
              <span className="text-[#b35427]">✔</span> Presupuesto sin compromiso
            </p>
          </div>
          <div className="mt-6 flex flex-row flex-wrap items-center justify-center gap-4">
            <a
              href={PHONE_HREF}
              className="bg-white text-black hover:bg-[#b35427] hover:text-white transition-all duration-300 py-3 px-6 font-bold uppercase tracking-wider text-base md:text-[20px]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              LLAMAR AHORA
            </a>
            <a
              href="#contacto"
              className="border border-white text-white hover:bg-white hover:text-black transition-all duration-300 py-3 px-6 font-bold uppercase tracking-wider text-base md:text-[20px]"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              SOLICITAR PRESUPUESTO
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiciosFontaneria: React.FC = () => {
  const servicios = [
    {
      titulo: "Fugas de agua",
      descripcion: "Detectamos y reparamos fugas rápidamente para evitar daños mayores."
    },
    {
      titulo: "Atascos y desagües",
      descripcion: "Eliminamos atascos en fregaderos, duchas y tuberías."
    },
    {
      titulo: "Sustitución de tuberías",
      descripcion: "Renovamos instalaciones antiguas para mayor seguridad."
    },
    {
      titulo: "Sanitarios y grifería",
      descripcion: "Reparamos o instalamos grifos, cisternas e inodoros."
    },
    {
      titulo: "Reformas de fontanería",
      descripcion: "Adaptamos instalaciones en baños y cocinas."
    },
    {
      titulo: "Mantenimiento y revisión",
      descripcion: "Prevenimos averías antes de que aparezcan."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-left md:text-center mb-16">
          <h2 className="uppercase leading-[0.95] text-black mt-0 text-[40px] md:text-[50px]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
            ¿EN QUÉ PODEMOS AYUDARTE AHORA MISMO?
          </h2>
          <p className="text-gray-600 mt-6 max-w-3xl mx-auto font-light" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '18px', lineHeight: 1.5 }}>
            Solucionamos averías de fontanería de forma rápida y profesional, tanto urgentes como programadas.
          </p>
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
          <p className="text-gray-800 mb-6 font-light" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '18px' }}>
            ⚡ Servicio urgente 24h disponible
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex h-12 items-center justify-center bg-[#b35427] px-8 font-medium text-white transition-colors hover:bg-[#9a4620] uppercase tracking-wide"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px' }}
          >
            LLAMAR AHORA
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
              title={<>NO SOLO REPARAMOS,<br />BUSCAMOS LA CAUSA REAL</>}
            />
            <div className="space-y-6 text-gray-700 font-light" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}>
              <p>
                En <strong>Terrahaus</strong> no nos limitamos a reparar lo visible. Analizamos qué está provocando la avería para evitar que vuelva a ocurrir.
              </p>
              <p>
                Cada intervención se realiza con criterio, buscando una solución duradera y bien ejecutada.
              </p>
              <p>
                Te explicamos de forma clara qué sucede, qué vamos a hacer y por qué.
              </p>
              <div className="pt-4 border-l-4 border-[#b35427] pl-6 italic text-gray-900">
                "Porque cuando se hace bien, no tienes que preocuparte dos veces."
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden relative z-10">
              <img
                src="/assets/images/l2-fontaneria-enfoque.jpg.jpg"
                alt="Intervención técnica de fontanería"
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
      title: "1. CONTACTO",
      desc: "Nos llamas o nos escribes y nos explicas tu problema."
    },
    {
      icon: <PenTool strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "2. EVALUACIÓN",
      desc: "Analizamos la situación y te damos una solución clara."
    },
    {
      icon: <Hammer strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "3. INTERVENCIÓN",
      desc: "Realizamos el trabajo de forma profesional y cuidadosa."
    },
    {
      icon: <Clock strokeWidth={1.5} className="w-10 h-10 text-white" />,
      title: "4. COMPROBACIÓN FINAL",
      desc: "Verificamos que todo funcione correctamente antes de finalizar."
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
            Un proceso claro, rápido y sin complicaciones.
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
                src="/assets/images/l2-fontaneria-rigor.jpg"
                alt="Trabajo profesional de fontanería"
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
                { title: "Diagnóstico antes de actuar", desc: "Detectamos el origen del problema para evitar errores." },
                { title: "Instalación cuidada", desc: "Trabajamos con precisión y materiales adecuados." },
                { title: "Presupuesto claro", desc: "Sabrás lo que incluye el servicio desde el principio." },
                { title: "Soluciones duraderas", desc: "Buscamos que no tengas que preocuparte de nuevo." }
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
              en cada intervención
            </h2>
            <p className="text-gray-400 font-light text-lg mb-8" style={{ fontFamily: 'Barlow, sans-serif' }}>
              No todas las averías o instalaciones tienen el mismo origen. Revisamos los puntos clave para aplicar una solución que funcione bien y dure.
            </p>
            <a
              href="#contacto"
              className="inline-flex h-12 items-center justify-center bg-[#b35427] px-8 font-medium text-white transition-colors hover:bg-[#9a4620] uppercase tracking-wide"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px' }}
            >
              Solicitar presupuesto
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {[
              { title: "Origen del problema", details: ["Fugas visibles u ocultas", "Presión insuficiente o irregular", "Estado general de la instalación"] },
              { title: "Montaje bien resuelto", details: ["Tuberías y conexiones seguras", "Desagües correctamente ejecutados", "Accesos y remates ordenados"] },
              { title: "Funcionamiento diario", details: ["Caudal y presión adecuados", "Evacuación sin retornos ni olores", "Uso cómodo y fiable"] },
              { title: "Durabilidad", details: ["Materiales adecuados", "Facilidad de mantenimiento", "Prevención de averías recurrentes"] }
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

const L2Fontaneria: React.FC = () => {
  return (
    <div className="pb-16 md:pb-0">
      <HeroLanding />
      <ServiciosFontaneria />
      <ConceptoTecnico />
      <ProcesoTrabajo />
      <VentajasCompetitivas />
      <EspecificacionesTecnicas />
      <FormularioLanding
        reformType="Fontanería"
        source="fontaneria"
        image="/assets/images/l2-fontaneria-formulario.jpg"
        imageAlt="Servicio profesional de fontanería"
        description="Completa el formulario y te contactaremos en menos de 24 horas para valorar tu reparación o instalación de fontanería."
        messagePlaceholder="Cuéntanos qué necesitas: fuga, reforma, sustitución de tuberías, baño, cocina o ubicación 💭"
      />
      <LandingFooter />
      <FloatingCallBar label="Llamar ahora" />
    </div>
  );
};

export default L2Fontaneria;
