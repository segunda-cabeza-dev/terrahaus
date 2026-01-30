import React from "react";
import { img } from '../lib/assets';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Hero sin header
const HeroLanding: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] flex flex-col font-sans">
      {/* Fondo Hero con degradado negro */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={img("HeroFondo.webp")}
          alt="Reformas integrales en Alicante"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70" />
      </div>
      {/* Contenido Hero */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-0 flex-1 hero-content-responsive" style={{paddingTop: '60px'}}>
        {/* Logo Terrahaus */}
        <div className="mb-8">
          <img
            src={img("Logo terrahous Blanco.webp")}
            alt="Terrahaus"
            className="h-16 md:h-20 w-auto mx-auto"
            style={{maxWidth: '250px'}}
            loading="eager"
          />
        </div>
        <h1
          className="mb-6 uppercase tracking-tight mx-auto hero-title-responsive"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '85px',
            fontWeight: 400,
            letterSpacing: '2px',
            lineHeight: 1.05,
            maxWidth: '900px',
            background: 'none',
            padding: 0,
            borderRadius: 0
          }}
        >
          <style>{`
            @media (max-width: 640px) {
              .hero-title-responsive {
                font-size: 54px !important;
                line-height: 1 !important;
              }
            }
          `}</style>
          <span className="hero-title-break">
            <span className="hidden sm:inline">REFORMAS INTEGRALES EN ALICANTE Y ALREDEDORES</span>
            <span className="sm:hidden">REFORMAS<br/>INTEGRALES EN<br/>ALICANTE</span>
          </span>
        </h1>
        <div
          className="mb-6 mx-auto text-center hero-desc-responsive"
          style={{
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 400,
            maxWidth: '1200px',
            lineHeight: 1.3,
            fontSize: '19px',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          <style>{`
            @media (max-width: 640px) {
              .hero-desc-responsive {
                font-size: 17px !important;
                padding-left: 14px !important;
                padding-right: 14px !important;
              }
            }
          `}</style>
          <div className="hero-main-title">
            Transformamos tu espacio con un equipo de arquitectos especializados en reformas integrales.
          </div>
          <div className="hero-secondary-text font-bold">
            Presupuesto cerrado y fecha de entrega garantizados por contrato.
          </div>
        </div>
        <a
          href="#contacto"
          className="bg-[#b35427] hover:bg-[#a3471d] text-white py-3 px-10 rounded transition mb-4 shadow-lg text-[23px] uppercase"
          style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, fontSize: '23px'}}>
          SOLICITA TU PRESUPUESTO GRATIS
        </a>
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

// Formulario de contacto optimizado para conversión
const FormularioLanding: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    postalCode: '',
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
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          reformType: 'Reforma Integral',
          message: `CP: ${formData.postalCode}\n${formData.message}`,
          source: 'reformas-integrales',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar');
      }

      window.location.href = '/gracias';
    } catch {
      setError('Hubo un problema al enviar. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="w-full bg-[#ededed] py-0 px-0">
      <div className="w-full flex flex-col md:flex-row rounded-none overflow-hidden shadow-lg">
        {/* Imagen a la izquierda */}
        <div className="md:w-1/2 w-full h-40 md:h-auto md:min-h-[600px]">
          <img
            src={img("Formulario-casa-madera.webp")}
            alt="Reforma integral en Alicante"
            className="object-cover w-full h-full"
            style={{ minHeight: '100%', minWidth: '100%', display: 'block' }}
            loading="lazy"
          />
        </div>
        {/* Formulario a la derecha */}
        <div className="md:w-1/2 w-full bg-[#ededed] flex flex-col justify-center p-6 md:p-24 px-6" style={{alignItems: 'flex-start'}}>
          <span className="text-[#b35427] font-normal uppercase tracking-wider mb-2" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1, fontSize: '22px'}}>
            PRESUPUESTO GRATUITO
          </span>
          <h2 className="text-black mb-3 font-normal w-full text-left" style={{fontFamily: 'Bebas Neue, sans-serif', lineHeight: 1.1, letterSpacing: 1, fontSize: '32px'}}>
            ¡Solicita tu presupuesto sin compromiso!
          </h2>
          <p className="text-gray-700 mb-6 text-left" style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px', fontWeight: 300}}>
            Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas para conocer tu proyecto de reforma integral.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded w-full text-sm">
              {error}
            </div>
          )}
          
          <form
            className="flex flex-col gap-3 w-full"
            style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 300, letterSpacing: 1}}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Nombre completo *"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}}
            />
            <PhoneInput
              country={'es'}
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              inputClass="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              buttonClass=""
              containerClass="w-full"
              placeholder="Teléfono *"
              inputStyle={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1, width: '100%' }}
              dropdownStyle={{ fontFamily: 'Barlow, sans-serif' }}
            />
            <input
              type="email"
              placeholder="Email *"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}}
            />
            <input
              type="text"
              placeholder="Código postal"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}}
            />
            <textarea
              placeholder="Cuéntanos sobre tu proyecto de reforma integral 💭"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              rows={5}
              style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}}
            ></textarea>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#b35427] text-white px-8 py-4 rounded font-bold hover:bg-[#a3471d] transition mt-2 text-base uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, letterSpacing: 1.5, fontSize: '18px'}}
            >
              {isSubmitting ? 'ENVIANDO...' : 'SOLICITAR PRESUPUESTO GRATUITO'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2" style={{fontFamily: 'Barlow, sans-serif'}}>
              Al enviar este formulario aceptas nuestra política de privacidad
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

// Footer minimalista solo con contacto
const FooterContacto: React.FC = () => (
  <footer className="w-full bg-black text-white py-12 px-8">
    <div className="max-w-6xl mx-auto">
      {/* Logo y descripción */}
      <div className="text-center mb-8">
        <a href="/" className="inline-block mb-4">
          <img
            src={img("Logo terrahous Blanco.webp")}
            alt="Terrahaus logo"
            className="max-h-16 w-auto mx-auto"
            style={{maxWidth: '200px', height: 'auto'}}
            loading="lazy"
          />
        </a>
        <p className="text-center mx-auto" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: '16px', color: '#e5e7eb', maxWidth: '500px'}}>
          Especialistas en reformas integrales en Alicante y alrededores.<br />
          Arquitectos profesionales con presupuesto cerrado y fecha garantizada.
        </p>
      </div>

      {/* Información de contacto centrada */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
        {/* Email */}
        <div className="flex items-center gap-3">
          <span className="inline-block">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#b35427]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a3 3 0 003.22 0L22 8m-19 8V8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </span>
          <a href="mailto:info@terrahaus.es" className="hover:text-[#b35427] transition" style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px'}}>
            info@terrahaus.es
          </a>
        </div>

        {/* Teléfono */}
        <div className="flex items-center gap-3">
          <span className="inline-block">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#b35427]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </span>
          <a href="tel:+34642413996" className="hover:text-[#b35427] transition" style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px'}}>
            +34 642 413 996
          </a>
        </div>

        {/* Horario */}
        <div className="flex items-center gap-3">
          <span className="inline-block">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#b35427]">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px', color: '#e5e7eb'}}>
            Lun - Vie: 09:00 - 18:00
          </span>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-gray-700 pt-6">
        <p className="text-center text-gray-400 text-sm" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300}}>
          © 2024 Terrahaus. Reformas integrales en Alicante. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
);

// Componente principal de la landing
const L1ReformasIntegrales: React.FC = () => (
  <>
    <HeroLanding />
    <BeneficiosReformas />
    <TiposReformas />
    <CTAIntermedio />
    <FormularioLanding />
    <FooterContacto />
  </>
);

export default L1ReformasIntegrales;
