import { img } from "../lib/assets";

import React from "react";
import Header from "../components/Header";
import { FoosterAlt } from "../components/Fooster";
import Formulario from "../components/Formulario";

const HeroCasaHorizonte: React.FC = () => (
  <section className="relative min-h-[80vh] flex flex-col font-sans">
    <div className="absolute inset-0 w-full h-full z-0">
      <img
        src={img("la-casa-horizonte- formulario.webp")}
        alt="Casa Horizonte Hero"
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/70" />
    </div>
    <Header />
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-0 flex-1 hero-content-responsive" style={{paddingTop: '120px'}}>
        <h1
          className="mb-6 uppercase tracking-tight mx-auto hero-title-responsive"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '68px',
            fontWeight: 400,
            letterSpacing: '2px',
            lineHeight: 1.05,
            maxWidth: '820px',
            background: 'none',
            padding: 0,
            borderRadius: 0
          }}
        >
          <style>{`
            @media (max-width: 640px) {
              .hero-title-responsive {
                font-size: 54px !important;
                line-height: 1.08 !important;
              }
            }
          `}</style>
          CASA HORIZONTE
        </h1>
        <div 
          className="mb-6 mx-auto text-center hero-desc-responsive"
          style={{
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 400,
            maxWidth: '900px',
            lineHeight: 1.3,
            fontSize: '20px',
          }}
        >
          <style>{`
            @media (max-width: 640px) {
              .hero-desc-responsive {
                font-size: 17px !important;
                line-height: 1.25 !important;
                padding-left: 14px !important;
                padding-right: 14px !important;
              }
            }
          `}</style>
          Exclusiva vivienda destaca por sus muros de piedra iluminados, amplios ventanales que conectan interior y exterior, y espacios diseñados para disfrutar del confort y la naturaleza. Con una piscina, terrazas y áreas sociales integradas, es perfecta para reuniones o momentos de tranquilidad.
        </div>
      </div>
  </section>
);

const CasaHorizonte: React.FC = () => (
  <>
    <HeroCasaHorizonte />
      <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 
            className="mb-8 text-center section-title-responsive"
            style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1, fontWeight: 700, fontSize: '45px', lineHeight: 1.08}}
          >
            <style>{`
              @media (max-width: 640px) {
                .section-title-responsive {
                  font-size: 30px !important;
                  line-height: 1.13 !important;
                }
              }
            `}</style>
            Descripción del proyecto
          </h2>
          <div 
            className="text-base mb-6 section-desc-responsive"
            style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, color: '#222', fontSize: '18px', paddingLeft: '24px', paddingRight: '24px'}}
          >
            <style>{`
              @media (max-width: 640px) {
                .section-desc-responsive {
                  padding-left: 14px !important;
                  padding-right: 14px !important;
                }
              }
            `}</style>
          <p className="mb-4">
            <span style={{color: '#b35427', fontWeight: 700, fontSize: '18px', display: 'inline-block', marginBottom: '6px'}}>Descripción técnica inicial:</span><br/>
            La Casa Horizonte es una vivienda unifamiliar contemporánea que combina materiales como piedra natural, vidrio y madera, con un diseño enfocado en la funcionalidad y la integración con el entorno. La iluminación estratégica resalta la textura de los materiales y crea un ambiente cálido en las áreas exteriores.
          </p>
          <p className="mb-4">
            El diseño prioriza espacios amplios y conectados, con ventanales que maximizan la entrada de luz natural y permiten una transición fluida entre interior y exterior. Las áreas sociales, como la cocina abierta y el quincho, se integran con la piscina y el jardín, creando un espacio ideal para el descanso y la convivencia.
          </p>
          <p className="mb-4">
            <span style={{color: '#b35427', fontWeight: 700, fontSize: '18px', display: 'inline-block', marginBottom: '6px'}}>Objetivo del proyecto:</span><br/>
            Crear un hogar funcional y acogedor que aproveche al máximo la relación entre los espacios interiores y exteriores, utilizando materiales naturales y un diseño que realce la conexión con el entorno.
          </p>
          <p className="mb-4">
            <span style={{color: '#b35427', fontWeight: 700, fontSize: '18px'}}>Aspectos destacados del diseño:</span>
            <ul className="list-disc pl-6 mt-2">
              <li><b>Materialidad natural:</b> Uso de piedra, madera y vidrio para lograr una estética elegante y cálida que se mimetiza con el paisaje.</li>
              <li><b>Espacios conectados:</b> Amplios ventanales y terrazas que generan una transición perfecta entre interior y exterior.</li>
              <li><b>Diseño funcional:</b> Integración de áreas sociales, como la cocina abierta, con espacios exteriores para maximizar la convivencia y el confort.</li>
              <li><b>Iluminación estratégica:</b> Resalta la textura de los materiales y crea ambientes acogedores tanto en el interior como en el exterior.</li>
            </ul>
          </p>
          <p>
            La Casa Horizonte representa un equilibrio entre diseño moderno y materiales naturales, ofreciendo un hogar que destaca por su conexión con el entorno y su capacidad de adaptarse a la vida contemporánea.
          </p>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {[1,2,3,4,5,6,7].map(num => (
            <img 
              key={num}
              src={img(`la-casa-horizonte-${num}.webp`)}
              alt={`Casa Horizonte ${num}`}
              className="w-full h-64 object-cover rounded shadow"
              style={{fontFamily: 'Barlow, sans-serif'}}
              loading="lazy"
            />
          ))}
        </div>
      </section>
  <section id="contacto">
    <Formulario />
  </section>
  <FoosterAlt />
  </>
);

export default CasaHorizonte;
