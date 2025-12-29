import React from "react";
import { FoosterAlt } from "../components/Fooster";
import Header from "../components/Header";

const Gracias: React.FC = () => (
  <main className="bg-white min-h-screen flex flex-col">
    <Header />
    <section className="relative min-h-[80vh] flex flex-col justify-center items-center font-sans bg-[#10141b] overflow-hidden pb-10">
      {/* Fondo Hero */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/assets/images/HeroFondo.jpg"
          alt="Gracias Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70" />
      </div>
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-6 pt-44 pb-20 gap-4 max-w-3xl mx-auto w-full">
        <h1 className="text-5xl md:text-7xl font-bold tracking-wide mb-2" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.04em'}}>
          GRACIAS POR CONTACTARNOS
        </h1>
        <p className="text-xl md:text-2xl font-medium mb-2" style={{fontFamily: 'Barlow, sans-serif', color: '#e6e6e6'}}>
          Te llamaremos a la brevedad
        </p>
        <a
          href="/es"
          className="mt-10 inline-block bg-[#b35427] hover:bg-[#a3471d] text-white font-bold py-3 px-8 rounded transition text-xl uppercase shadow-lg"
          style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.04em'}}
        >
          Volver a la Home
        </a>
      </div>
    </section>
    <FoosterAlt />
  </main>
);
export default Gracias;
