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
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-0 flex-1 hero-content-responsive" style={{paddingTop: '120px'}}>
        <h1
          className="mb-6 uppercase tracking-tight mx-auto hero-title-responsive"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '85px',
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
                line-height: 1 !important;
              }
            }
          `}</style>
          <span className="hero-title-break">
            <span className="hidden sm:inline">CONSTRUIMOS LUGARES ÚNICOS EN TODO ALICANTE</span>
            <span className="sm:hidden">CONSTRUIMOS<br/>LUGARES UNICOS<br/>EN TODO ALICANTE</span>
          </span>
          <style>{`
            @media (max-width: 640px) {
              .hero-title-responsive {
                font-size: 48px !important;
                line-height: 1.08 !important;
              }
              .hero-title-break br {
                display: initial;
              }
            }
          `}</style>
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
            Casas, bungalows y glampings diseñadas y dirigidas por arquitectos detallistas.
          </div>
          <div className="hero-secondary-text font-bold">
            Muy detallistas.
          </div>
        </div>
        <a
          href="#contacto"
          className="bg-[#b35427] hover:bg-[#a3471d] text-white py-3 px-10 rounded transition mb-4 shadow-lg text-[23px] uppercase"
          style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, fontSize: '23px'}}>
          PONTE EN CONTACTO AHORA
        </a>
      </div>
    </section>
  );
}

export default Hero;
