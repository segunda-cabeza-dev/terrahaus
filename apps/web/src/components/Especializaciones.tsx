import React from "react";
import styles from "./Especializaciones.module.css";
import { img } from '../lib/assets';

const especializaciones = [
  {
    title: "CASAS DE MADERA",
    img: img("Casa-madera.webp"),
  },
  {
    title: "CASAS DE HORMIGÓN",
    img: img("Casa-hormigon.webp"),
  },
  {
    title: "GLAMPLINGS",
    img: img("Glamplings.webp"),
  },
  {
    title: "CABAÑAS Y BUNGALOS",
    img: img("cabana-bungalo.webp"),
    alt: "Cabañas y Bungalos",
  },
];

const pasos = [
  {
    numero: "01.",
     titulo: "HABLAREMOS A FONDO SOBRE TU PROYECTO Y TODO LO QUE ES IMPORTANTE\nPARA TI EN TORNO A ÉL",
    texto: (
      <>
  Nos enfocaremos en diseñar y construir un espacio optimizado desde el inicio. <b>Entender tu necesidad en la prioridad número 1.</b><br />
  <br />
  Te guiaremos <b>paso a paso en cada etapa</b> para que tengas una <b>comprensión total del proceso</b> y te sientas acompañado en cada decisión.
      </>
    ),
  img: img("Especializaciones1.webp"),
  },
  {
    numero: "02.",
    titulo: "CADA PROYECTO ESTÁ EN MANOS DE NUESTRO EQUIPO EXPERTO DE ARQUITECTOS",
    texto: (
      <>
  Contamos con <b>especialistas en la construcción de viviendas y expertos dedicados a proyectos turísticos</b>, asegurando perfiles adecuados para cada tipo de proyecto.<br />
  <br />
  Nuestro equipo solo quiere una cosa: <b>que estés feliz con el resultado.</b>
      </>
    ),
  img: img("Especializaciones2.webp"),
  },
  {
    numero: "03.",
    titulo: "PRESUPUESTO Y FECHA DE ENTREGA GARANTIZADOS Y CERRADOS POR CONTRATO",
    texto: (
      <>
  Sabemos lo importante que es para ti la <b>tranquilidad y la certeza en tu inversión.</b><br />
  <br />
  Este compromiso te asegura que el proyecto se llevará a cabo en el <b>tiempo</b> y dentro del <b>presupuesto acordado.</b>
      </>
    ),
  img: img("Especializaciones3.webp"),
  },
];

const Especializaciones: React.FC = () => {
  return (
  <section className="bg-white py-20 px-4 pb-32">
  <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="text-[#b35427] uppercase mb-1" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '25px', fontWeight: 400, letterSpacing: '1.2px'}}>CONSTRUCCIÓN Y ARQUITECTURA</div>
          <h2
            className="mb-8 leading-tight section-title-especializaciones"
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
              ESTE EQUIPO DE ARQUITECTOS SE<br className="mobile-break" />ESPECIALIZA EN:
            </span>
            <style>{`
              @media (max-width: 640px) {
                .section-title-especializaciones {
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
            <style>{`
              @media (max-width: 640px) {
                .section-title-especializaciones {
                  font-size: 38px !important;
                }
                .section-title-break-mobile {
                  display: inline;
                }
                .section-title-break-mobile br {
                  display: initial;
                }
              }
              @media (max-width: 640px) {
                .section-title-break-mobile {
                  white-space: pre-line;
                }
              }
            `}</style>
          </h2>
        </div>
        {/* Cards de especializaciones */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {especializaciones.map((item, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden transition-all flex flex-col shadow-md"
              style={{border: '1.5px solid transparent', borderRadius: 0}}
            >
              <img
                src={item.img}
                alt={item.alt || item.title}
                className="w-full group-hover:scale-105 transition-transform duration-300"
                style={{height: 'auto', maxHeight: '420px', objectFit: 'cover', display: 'block'}}
              />
              {/* Overlay solo en la parte inferior */}
              <div className="absolute left-0 right-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <div
                className={`absolute bottom-0 left-0 right-0 text-white py-3 px-2 text-center z-10 ${styles["especializacion-title-mobile"]}`}
                style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1, fontSize: '30px', fontWeight: 400}}
              >
                {item.title}
              </div>
              {/* Borde animado al hacer hover */}
              <div className="pointer-events-none absolute inset-0 border border-[#bdbdbd] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{borderRadius: 0}} />
            </div>
          ))}
        </div>
        {/* Pasos */}
        <div className="flex flex-col gap-0">
          {pasos.map((paso, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <div className="w-full border-t border-gray-300 my-8" />
              )}
              <div className="flex flex-col md:flex-row md:items-center gap-6 pt-8">
                <div className="flex-1 order-2 md:order-1">
                  <div className="text-[#b35427] mb-2" style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, fontSize: '28px'}}>{paso.numero}</div>
                   <h3 
                     className={`mb-2 whitespace-pre-line paso-titulo-${idx}`}
                     style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, fontSize: '33px', lineHeight: 1.1}}
                   >
                     {paso.titulo}
                     {idx === 2 && (
                       <style>{`
                         @media (max-width: 640px) {
                           .paso-titulo-2 {
                             font-size: 38px !important;
                           }
                         }
                       `}</style>
                     )}
                   </h3>
                  <div className="leading-normal" style={{fontFamily: 'Barlow, sans-serif', fontSize: '18px', fontWeight: 300, color: '#000'}}>{paso.texto}</div>
                </div>
                <div className="flex-1 order-1 md:order-2 flex justify-end">
                  <img src={paso.img} alt={paso.titulo} className="w-full max-w-xs md:max-w-sm shadow rounded-xl" style={{marginRight: 0}} />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Especializaciones;
