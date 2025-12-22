import React from "react";
import Header from './Header';

const Hero: React.FC = () => {
  return (
  <section className="relative min-h-[92vh] flex flex-col font-sans">
      {/* Fondo Hero con degradado negro */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/assets/images/HeroFondo.jpg"
          alt="Casa Terrahaus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70" />
      </div>
      {/* Header Terrahaus */}
      <Header />
      {/* Contenido Hero */}
  <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-0 flex-1" style={{paddingTop: '120px'}}>
        <h1
          className="mb-6 uppercase tracking-tight mx-auto"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '78px',
            fontWeight: 400,
            letterSpacing: '2px',
            lineHeight: 1.05,
            maxWidth: '820px',
            background: 'none',
            padding: 0,
            borderRadius: 0
          }}
        >
          CONSTRUIMOS LUGARES UNICOS EN TODO ALICANTE
        </h1>
        <div className="mb-6 mx-auto" style={{fontFamily: 'Inter Tight, Inter, sans-serif', fontSize: '20px', fontWeight: 400, maxWidth: '700px', lineHeight: 1.3}}>
          <div>Casas, bungalows y glampings diseñadas y dirigidas por arquitectos detallistas.</div>
          <div><span className="font-bold">Muy detallistas.</span></div>
        </div>
        <a
          href="#cost-calculator"
          className="bg-[#b35427] hover:bg-[#a3471d] text-white py-3 px-8 rounded transition mb-4 shadow-lg text-[20px] uppercase"
          style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400}}
        >
          CALCULA EL COSTO DE TU PROYECTO
        </a>
      </div>
      {/* Botón WhatsApp flotante */}
      <a
        href="https://wa.me/34600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-30 bg-green-500 hover:bg-green-600 rounded-full p-4 shadow-lg"
        aria-label="WhatsApp"
        style={{fontWeight: 400}}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="32" height="32">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.85.504 3.584 1.382 5.08L2 22l5.08-1.382A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.952 7.952 0 01-4.065-1.13l-.29-.17-3.02.822.822-3.02-.17-.29A7.952 7.952 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.406-5.341c-.242-.121-1.434-.707-1.655-.788-.222-.081-.384-.121-.546.121-.161.242-.626.788-.768.95-.141.161-.283.181-.525.06-.242-.121-1.022-.377-1.947-1.202-.72-.642-1.207-1.433-1.35-1.675-.141-.242-.015-.373.106-.494.109-.108.242-.282.363-.423.121-.141.161-.242.242-.404.081-.161.04-.303-.02-.424-.06-.121-.546-1.318-.748-1.807-.197-.474-.398-.41-.546-.418l-.464-.008c-.161 0-.424.06-.646.303-.222.242-.848.828-.848 2.02 0 1.192.868 2.345.988 2.507.121.161 1.71 2.613 4.15 3.562.58.199 1.032.318 1.384.406.581.147 1.11.126 1.528.077.466-.056 1.434-.586 1.637-1.152.202-.566.202-1.051.142-1.152-.06-.101-.22-.161-.462-.282z" />
        </svg>
      </a>
    </section>
  );
};

export default Hero;
