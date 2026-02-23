import React from "react";
import LandingFooter from "../components/LandingFooter";
import { img } from "../lib/assets";
import FormularioLanding from "../components/FormularioLanding";
import { ArrowRight, CheckCircle2, PenTool, Ruler, Hammer, Clock, Shield, Sparkles, MessageCircle } from "lucide-react";

const SectionTitle: React.FC<{ subtitle: string; title: React.ReactNode; light?: boolean }> = ({
  subtitle,
  title,
  light = false,
}) => (
  <div className="mb-12">
    <div
      className="uppercase mb-2 tracking-widest"
      style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "24px", color: "#b35427" }}
    >
      {subtitle}
    </div>
    <h2
      className={`${light ? "text-white" : "text-black"} leading-[0.95]`}
      style={{
        fontFamily: "Bebas Neue, sans-serif",
        fontSize: "45px",
        fontWeight: 400,
      }}
    >
      {title}
    </h2>
  </div>
);

const HeroLanding: React.FC = () => {
  const fallbackHero = img("reformas-integrales-vivienda.webp", true);
  return (
    <section className="relative h-[80vh] min-h-[460px] flex flex-col overflow-hidden md:h-[85vh] md:min-h-[560px]">
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/assets/images/pintura-alisado/Pintura-alisado-4.jpg"
          alt="Pintura en Alicante"
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
        <div className="mb-6">
          <img
            src={img("Logo terrahous Blanco.webp")}
            alt="Terrahaus"
            className="h-10 md:h-12 w-auto mx-auto opacity-90"
            style={{ maxWidth: "180px" }}
            loading="eager"
          />
        </div>
        <h1
          className="text-white mb-4 uppercase leading-[0.95] tracking-tight"
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "clamp(48px,9vw,78px)",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          PINTURA Y ALISADO EN ALICANTE
          <br />
          <span className="text-[#b35427]">ACABADO FINO, SIN SORPRESAS</span>
        </h1>
        <p
          className="text-gray-200 mb-8 max-w-md md:max-w-2xl font-light leading-relaxed"
          style={{ fontFamily: "Barlow, sans-serif", fontSize: "16px" }}
        >
          <span className="font-semibold">
            Pintura y alisado profesional para casas, pisos, oficinas y locales comerciales.
          </span>{" "}
          Protegemos tu espacio, cuidamos los detalles y cumplimos plazos.
        </p>
        <a
          href="#contacto"
          className="group bg-white text-black hover:bg-[#b35427] hover:text-white transition-all duration-300 py-3 px-6 font-bold uppercase tracking-wider flex items-center gap-3 text-base md:text-[20px]"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          SOLICITAR PRESUPUESTO
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
        </div>
      </div>
    </section>
  );
};

const ServiciosPintura: React.FC = () => {
  const items = [
    {
      icon: <Ruler className="w-6 h-6" />,
      title: "PINTURA INTERIOR",
      text: "Paredes y techos con pinturas lavables, mate/satinadas, y colores bien calibrados.",
    },
    {
      icon: <Hammer className="w-6 h-6" />,
      title: "PINTURA EXTERIOR Y FACHADAS",
      text: "Tratamientos para humedad, preparación del soporte y acabados resistentes al clima.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "CASAS · PISOS · OFICINAS · LOCALES",
      text: "Planificamos por estancia/zonas para reducir molestias y entregar en tiempos claros.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "PLAZOS Y LIMPIEZA",
      text: "Protección de suelos y muebles, obra ordenada y limpieza final para entregar listo para usar.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionTitle subtitle="SERVICIOS DE PINTURA" title="INTERIOR, EXTERIOR Y FACHADAS" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.title} className="border border-gray-200 bg-white p-8 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-[#b35427] mt-1">{item.icon}</div>
                <div>
                  <h3 className="uppercase mb-2" style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "24px" }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "Barlow, sans-serif" }}>
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiciosAlisado: React.FC = () => {
  const items = [
    {
      icon: <PenTool className="w-6 h-6" />,
      title: "ELIMINACIÓN DE GOTELÉ",
      text: "Raspado/regularización según soporte, para dejar una base lista para alisar.",
    },
    {
      icon: <Hammer className="w-6 h-6" />,
      title: "REPARACIÓN Y NIVELADO",
      text: "Arreglamos grietas, golpes y juntas. Enlucido y nivelado para un acabado fino.",
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      title: "LIJADO Y CONTROL DE POLVO",
      text: "Lijado por fases y aspiración para reducir polvo y mejorar la calidad del acabado.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "LISTO PARA PINTAR",
      text: "Dejamos la superficie preparada para imprimación y pintura uniforme.",
    },
  ];

  return (
    <section className="py-16 bg-[#f7f7f7]">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionTitle subtitle="SERVICIOS DE ALISADO" title="DE GOTELÉ A LISO FINO" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.title} className="border border-gray-200 bg-white p-8 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-[#b35427] mt-1">{item.icon}</div>
                <div>
                  <h3 className="uppercase mb-2" style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "24px" }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "Barlow, sans-serif" }}>
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcesoTrabajo: React.FC = () => {
  const steps = [
    {
      title: "VISITA Y PRESUPUESTO",
      text: "Medimos, revisamos el estado de las paredes y definimos el alcance: alisado, reparaciones y pintura.",
    },
    {
      title: "PROTECCIÓN Y PREPARACIÓN",
      text: "Cubrimos suelos y mobiliario. Sellamos, reparamos y dejamos el soporte listo para trabajar.",
    },
    {
      title: "ALISADO Y LIJADO",
      text: "Aplicamos pastas/enlucidos, nivelamos y lijamos con control de polvo para un acabado fino.",
    },
    {
      title: "PINTURA Y ACABADOS",
      text: "Imprimación y manos necesarias según material y color. Cortes limpios y remates cuidados.",
    },
    {
      title: "LIMPIEZA Y ENTREGA",
      text: "Retiramos protecciones, repasamos detalles y entregamos el espacio listo para habitar.",
    },
  ];

  return (
    <section className="py-20 bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionTitle
          subtitle="CÓMO TRABAJAMOS"
          title={
            <span>
              UN PROCESO CLARO PARA <span style={{ color: "#b35427" }}>RESULTADOS PROFESIONALES</span>
            </span>
          }
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div key={s.title} className="border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors">
              <div className="text-[#b35427] mb-3" style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "28px" }}>
                0{idx + 1}
              </div>
              <h3 className="uppercase mb-3" style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "26px" }}>
                {s.title}
              </h3>
              <p className="text-gray-200/90 leading-relaxed" style={{ fontFamily: "Barlow, sans-serif" }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Garantias: React.FC = () => {
  const items = [
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Protección de suelos, puertas y mobiliario durante todo el trabajo.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Acabados lisos y cortes limpios: repasos incluidos al final de la obra.",
    },
    {
      icon: <Ruler className="w-5 h-5" />,
      text: "Materiales y sistemas adecuados según humedad, uso y tipo de pared.",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      text: "Equipo coordinado y comunicación clara de plazos y tiempos de secado.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionTitle
          subtitle="GARANTÍA"
          title={
            <span>
              CALIDAD EN CADA <span style={{ color: "#b35427" }}>DETALLE</span>
            </span>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.text} className="border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#b35427]/10 text-[#b35427]">
                {item.icon}
              </div>
              <p className="text-gray-800 leading-snug" style={{ fontFamily: "Barlow, sans-serif" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GaleriaTrabajos: React.FC = () => {
  const images = [
    "/assets/images/pintura-alisado/Pintura-alisado-1.jpg",
    "/assets/images/pintura-alisado/Pintura-alisado-2.jpg",
    "/assets/images/pintura-alisado/Pintura-alisado-3.jpg",
    "/assets/images/pintura-alisado/Pintura-alisado-4.jpg",
  ];
  const videos = [
    "/assets/videos/pintura-alisado/Pintura-alisado-1.mp4",
    "/assets/videos/pintura-alisado/Pintura-alisado-2.mp4",
  ];

  const media = [
    { type: "image" as const, src: images[0] },
    { type: "video" as const, src: videos[0] },
    { type: "image" as const, src: images[1] },
    { type: "video" as const, src: videos[1] },
    { type: "image" as const, src: images[2] },
    { type: "image" as const, src: images[3] },
  ];

  const fallbackImg = img("Detalle-constructivo.webp", true);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2
          className="text-center uppercase mb-8"
          style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "45px", fontWeight: 400 }}
        >
          GALERÍA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {media.map((m) => (
            <div
              key={m.src}
              className="group relative h-[240px] sm:h-[260px] md:h-[280px] overflow-hidden bg-black"
            >
              {m.type === "image" ? (
                <img
                  src={m.src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImg;
                  }}
                />
              ) : (
                <video
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  onMouseEnter={(e) => {
                    void e.currentTarget.play();
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                >
                  <source src={m.src} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const L1PinturaAlisado: React.FC = () => {
  return (
    <>
      <HeroLanding />
      <ServiciosPintura />
      <ServiciosAlisado />
      <ProcesoTrabajo />
      <Garantias />
      <GaleriaTrabajos />
      <FormularioLanding
        reformType="Pintura y Alisado"
        source="l1-pintura-alisado"
        image="/assets/images/Pintura-alisado1.jpg"
        imageAlt="Pintura y alisado terminado"
        description="Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas para conocer tu proyecto de pintura y alisado."
        messagePlaceholder="Cuéntanos sobre tu proyecto de pintura y alisado 💭"
      />
      <LandingFooter />
    </>
  );
};

export default L1PinturaAlisado;
