import React from "react";
import Header from "../components/Header";
import { img } from "../lib/assets";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
  return (
    <section className="relative h-[85vh] min-h-[480px] flex flex-col justify-center overflow-hidden md:h-screen md:min-h-[600px]">
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/assets/images/pintura-alisado/Pintura-alisado-4.jpg"
          alt="Pintura en Alicante"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/80" />
      </div>

      <Header />

      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-start text-left px-4 md:px-8 pt-20 md:pt-32 md:items-center md:text-center">
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

  const fallbackImg = img("Detalle-constructivo.webp");

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

const Formulario: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    service: "Pintura y Alisado",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${apiUrl}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "l1-pintura-alisado",
        }),
      });

      if (!response.ok) throw new Error("Error al enviar el formulario");
      window.location.href = "/gracias";
    } catch {
      setError("Hubo un problema al enviar. Por favor, inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl uppercase mb-4" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            CUÉNTANOS TU PROYECTO
          </h2>
          <p className="text-gray-600 font-light text-xl" style={{ fontFamily: "Barlow, sans-serif" }}>
            Dinos metros aproximados, estado actual (gotelé/imperfecciones), zona y fechas. Te respondemos con una
            propuesta clara.
          </p>
        </div>

        <div className="bg-[#f9f9f9] p-8 md:p-12 border border-gray-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#b35427]" />

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Nombre</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#b35427] transition-colors rounded-none"
                style={{ fontFamily: "Barlow, sans-serif" }}
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
                style={{ fontFamily: "Barlow, sans-serif" }}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Teléfono</label>
              <div className="phone-input-architect">
                <PhoneInput
                  country={"es"}
                  value={formData.phone}
                  onChange={(phone) => setFormData({ ...formData, phone })}
                  inputClass="!w-full !bg-white !border-b-2 !border-gray-200 !border-t-0 !border-l-0 !border-r-0 !rounded-none !h-[49px] !pl-12 focus:!border-[#b35427]"
                  buttonClass="!bg-transparent !border-none !rounded-none"
                  containerClass="!w-full"
                  inputStyle={{ fontFamily: "Barlow, sans-serif" }}
                />
              </div>
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Servicio</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#b35427] transition-colors rounded-none appearance-none cursor-pointer"
                style={{ fontFamily: "Barlow, sans-serif" }}
              >
                <option>Pintura y Alisado</option>
                <option>Solo Alisado</option>
                <option>Solo Pintura</option>
                <option>Fachada / Exterior</option>
                <option>Otro</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
                Detalles del Proyecto
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Metros, habitaciones, si hay gotelé, altura de techos, estado actual, y cualquier detalle importante..."
                className="w-full bg-white border-2 border-gray-200 p-4 focus:outline-none focus:border-[#b35427] transition-colors rounded-none resize-none"
                style={{ fontFamily: "Barlow, sans-serif" }}
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white p-5 uppercase tracking-[2px] hover:bg-[#b35427] transition-colors duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "20px" }}
              >
                {isSubmitting ? "Enviando..." : "Solicitar Presupuesto"}
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
          <a href="tel:+34642413996" className="block text-lg hover:text-gray-300 transition-colors">
            +34 642 413 996
          </a>
        </div>
        <div>
          <span className="block text-[#b35427] uppercase text-xs tracking-wider mb-1">Email</span>
          <a href="mailto:info@terrahaus.es" className="block text-lg hover:text-gray-300 transition-colors">
            info@terrahaus.es
          </a>
        </div>
      </div>
    </div>
  </footer>
);

const L1PinturaAlisado: React.FC = () => {
  return (
    <>
      <HeroLanding />
      <ServiciosPintura />
      <ServiciosAlisado />
      <ProcesoTrabajo />
      <Garantias />
      <GaleriaTrabajos />
      <Formulario />
      <FooterSimple />
    </>
  );
};

export default L1PinturaAlisado;
