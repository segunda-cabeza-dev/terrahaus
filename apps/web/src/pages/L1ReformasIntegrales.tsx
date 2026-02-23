import React from "react";
import { img } from '../lib/assets';
import LandingFooter from '../components/LandingFooter';
import FormularioLanding from '../components/FormularioLanding';
import { ArrowRight } from "lucide-react";

// Hero sin header
const HeroLanding: React.FC = () => {
  const fallbackHero = img("HeroFondo.webp", true);
  return (
    <section className="relative h-[80vh] min-h-[460px] flex flex-col overflow-hidden md:h-[85vh] md:min-h-[560px]">
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={img("reformas-integrales-vivienda.webp")}
          alt="Reformas integrales en Alicante"
          className="w-full h-full object-cover scale-105"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = fallbackHero;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/80" />
      </div>

      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center justify-center text-center px-4 md:px-8 py-10 md:py-12">
          {/* Logo Terrahaus */}
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
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
            }}
          >
            REFORMAS INTEGRALES EN ALICANTE
            <br />
            <span className="text-[#b35427]">Y ALREDEDORES</span>
          </h1>

          <p
            className="text-gray-200 mb-8 max-w-md md:max-w-2xl font-light leading-relaxed"
            style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}
          >
            Transformamos tu espacio con un equipo de arquitectos especializados.
            <span className="font-semibold"> Presupuesto cerrado y fecha de entrega garantizados por contrato.</span>
          </p>

          <a
            href="#contacto"
            className="group bg-white text-black hover:bg-[#b35427] hover:text-white transition-all duration-300 py-3 px-6 font-bold uppercase tracking-wider flex items-center gap-3 text-base md:text-[20px]"
            style={{ fontFamily: 'Bebas Neue, sans-serif' }}
          >
            SOLICITAR PRESUPUESTO
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Sección de beneficios persuasivos
const BeneficiosReformas: React.FC = () => {
  const beneficios = [
    {
      numero: "01.",
      titulo: "DISEÑO PERSONALIZADO PARA TU REFORMA INTEGRAL",
      texto: (
        <>
          Nuestros arquitectos especializados <b>estudian cada detalle de tu espacio</b> para crear una reforma que se adapte perfectamente a tus necesidades y estilo de vida.<br />
          <br />
          <b>No trabajamos con plantillas</b>, cada reforma es única y está diseñada específicamente para ti.
        </>
      ),
      img: img("Especializaciones1.webp"),
    },
    {
      numero: "02.",
      titulo: "EXPERIENCIA EN REFORMAS INTEGRALES DE VIVIENDAS Y LOCALES EN ALICANTE",
      texto: (
        <>
          Llevamos años transformando espacios en <b>Alicante y alrededores</b>. Conocemos a fondo las normativas locales, los mejores proveedores y las soluciones más eficientes.<br />
          <br />
          Desde <b>reformas de viviendas completas hasta locales comerciales</b>, nuestro equipo tiene la experiencia necesaria para garantizar resultados excepcionales.
        </>
      ),
      img: img("Especializaciones2.webp"),
    },
    {
      numero: "03.",
      titulo: "PRESUPUESTO CERRADO Y FECHA DE ENTREGA GARANTIZADOS",
      texto: (
        <>
          <b>Sin sorpresas, sin excusas.</b> Te damos un presupuesto cerrado por contrato y una fecha de entrega garantizada.<br />
          <br />
          Sabemos lo importante que es para ti la <b>tranquilidad y certeza en tu inversión</b>. Por eso nos comprometemos legalmente con el precio y los plazos acordados.
        </>
      ),
      img: img("Especializaciones3.webp"),
    },
  ];

  return (
    <section className="bg-white py-20 px-4 pb-32">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="text-[#b35427] uppercase mb-1" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '25px', fontWeight: 400, letterSpacing: '1.2px'}}>
            TU REFORMA INTEGRAL EN LAS MEJORES MANOS
          </div>
          <h2
            className="mb-8 leading-tight section-title-beneficios"
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontWeight: 400,
              fontSize: '48px',
              lineHeight: 1.1,
              whiteSpace: 'normal',
              letterSpacing: 1
            }}
          >
            <span className="section-title-break-mobile">
              ¿POR QUÉ ELEGIRNOS PARA TU REFORMA<br className="mobile-break" />EN ALICANTE?
            </span>
            <style>{`
              @media (max-width: 640px) {
                .section-title-beneficios {
                  font-size: 38px !important;
                }
                .section-title-break-mobile {
                  display: inline;
                  white-space: normal;
                }
                .section-title-break-mobile .mobile-break {
                  display: initial;
                }
              }
              @media (min-width: 641px) {
                .section-title-break-mobile .mobile-break {
                  display: none;
                }
              }
            `}</style>
          </h2>
        </div>

        {/* Beneficios */}
        <div className="flex flex-col gap-0">
          {beneficios.map((beneficio, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div className="w-full border-t border-gray-300 my-8" />
              )}
              <div className="flex flex-col md:flex-row md:items-center gap-6 pt-8">
                <div className="flex-1 order-2 md:order-1">
                  <div className="text-[#b35427] mb-2" style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, fontSize: '28px'}}>{beneficio.numero}</div>
                  <h3
                    className="mb-2 whitespace-pre-line"
                    style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, fontSize: '33px', lineHeight: 1.1}}
                  >
                    {beneficio.titulo}
                  </h3>
                  <div className="leading-normal" style={{fontFamily: 'Barlow, sans-serif', fontSize: '18px', fontWeight: 300, color: '#000'}}>{beneficio.texto}</div>
                </div>
                <div className="flex-1 order-1 md:order-2 flex justify-end">
                  <img src={beneficio.img} alt={beneficio.titulo} className="w-full max-w-xs md:max-w-sm shadow rounded-xl" style={{marginRight: 0}} loading="lazy" />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

// Tipos de reformas que realizamos
const TiposReformas: React.FC = () => {
  const tipos = [
    {
      title: "REFORMAS DE VIVIENDAS",
      img: img("reformas-integrales-vivienda.webp"),
    },
    {
      title: "REFORMAS DE COCINAS",
      img: img("reformas-integrales-cocina.webp"),
    },
    {
      title: "REFORMAS DE BAÑOS",
      img: img("reformas-integrales-bano.webp"),
    },
    {
      title: "REFORMAS DE LOCALES",
      img: img("reformas-integrales-local.webp"),
    },
  ];

  return (
    <section className="bg-[#f8f8f8] py-20 px-4">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="text-[#b35427] uppercase mb-1" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '25px', fontWeight: 400, letterSpacing: '1.2px'}}>
            NUESTROS SERVICIOS
          </div>
          <h2
            className="mb-8 leading-tight"
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontWeight: 400,
              fontSize: '48px',
              lineHeight: 1.1,
              letterSpacing: 1
            }}
          >
            ESPECIALISTAS EN TODO TIPO DE REFORMAS
          </h2>
        </div>

        {/* Cards de tipos de reformas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tipos.map((item, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden transition-all flex flex-col shadow-md"
              style={{border: '1.5px solid transparent', borderRadius: 0}}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full group-hover:scale-105 transition-transform duration-300"
                style={{height: 'auto', maxHeight: '420px', objectFit: 'cover', display: 'block'}}
                loading="lazy"
              />
              {/* Overlay solo en la parte inferior */}
              <div className="absolute left-0 right-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <div
                className="absolute bottom-0 left-0 right-0 text-white py-3 px-2 text-center z-10"
                style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1, fontSize: '30px', fontWeight: 400}}
              >
                {item.title}
              </div>
              {/* Borde animado al hacer hover */}
              <div className="pointer-events-none absolute inset-0 border border-[#bdbdbd] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{borderRadius: 0}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA intermedio
const CTAIntermedio: React.FC = () => {
  return (
    <section className="bg-black py-16 w-full">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <h2
          className="text-white mb-6"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '45px',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: 1.2
          }}
        >
          ¿LISTO PARA TRANSFORMAR TU ESPACIO?
        </h2>
        <p
          className="text-white mb-10 max-w-2xl"
          style={{
            fontFamily: 'Barlow, sans-serif',
            fontSize: '18px',
            fontWeight: 300,
            lineHeight: 1.5
          }}
        >
          Solicita tu presupuesto gratuito y sin compromiso. Te contactaremos en menos de 24 horas para conocer tu proyecto y ofrecerte la mejor solución.
        </p>
        <a
          href="#contacto"
          className="inline-flex items-center gap-2 bg-[#b35427] hover:bg-[#a3471d] px-8 py-3 rounded transition text-white text-2xl"
          style={{ fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, letterSpacing: 1 }}
        >
          SOLICITAR PRESUPUESTO
          <span className="text-2xl ml-1">→</span>
        </a>
      </div>
    </section>
  );
};

// Componente principal de la landing
const L1ReformasIntegrales: React.FC = () => (
  <>
    <HeroLanding />
    <BeneficiosReformas />
    <TiposReformas />
    <CTAIntermedio />
    <FormularioLanding
      reformType="Reforma Integral"
      source="reformas-integrales"
      image="reformas-integrales-vivienda.webp"
      imageAlt="Reforma integral de vivienda"
      description="Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas para conocer tu proyecto de reforma integral."
      messagePlaceholder="Cuéntanos sobre tu proyecto de reforma integral 💭"
    />
    <LandingFooter />
  </>
);

export default L1ReformasIntegrales;
