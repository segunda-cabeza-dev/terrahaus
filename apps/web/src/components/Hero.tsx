import React from "react";
import Header from './Header';
import { img } from '../lib/assets';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex flex-col font-sans">
      {/* Fondo Hero con degradado negro */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={img("HeroFondo.webp")}
          alt="Casa Terrahaus"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70" />
      </div>
      {/* Header Terrahaus */}
      <Header />
      {/* Contenido Hero */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-4 flex-1 hero-content-responsive" style={{paddingTop: '120px'}}>
        <h1
          className="mb-6 uppercase tracking-tight mx-auto hero-title-responsive"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '75px',
            fontWeight: 400,
            letterSpacing: '2px',
            lineHeight: 1.05,
            maxWidth: '100%',
            background: 'none',
            padding: 0,
            borderRadius: 0,
            whiteSpace: 'nowrap'
          }}
        >
          <style>{`
            @media (max-width: 768px) {
              .hero-title-responsive {
                font-size: 42px !important;
                white-space: normal !important;
              }
            }
          `}</style>
          CONSTRUIMOS LUGARES ÚNICOS
        </h1>
        <div 
          className="mb-8 mx-auto text-center hero-desc-responsive"
          style={{
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 400,
            maxWidth: '700px',
            lineHeight: 1.6,
            fontSize: '21px',
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
          <div className="text-gray-100" style={{fontWeight: 300}}>
            Reformas integrales, construcción de proyectos turísticos y residenciales, y oportunidades de inversión inmobiliaria.
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <a
            href="#contacto"
            className="bg-[#b35427] hover:bg-[#a3471d] text-white py-3 px-10 rounded transition shadow-lg text-[23px] uppercase"
            style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, fontSize: '23px'}}>
            PONTE EN CONTACTO
          </a>
          <a
            href="#proyectos"
            className="border-2 border-white hover:bg-white/10 text-white py-3 px-10 rounded transition text-[23px] uppercase"
            style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, fontSize: '23px'}}>
            VER PROYECTOS
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
