import { img } from "../lib/assets";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white pt-14 pb-6 px-0">
  <div className="max-w-7xl mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-10 items-start justify-center text-center md:text-left">
        {/* Columna 1: Logo y descripción */}
        <div className="flex flex-col items-center md:items-start w-full mb-8 md:mb-0">
          <div className="flex flex-col items-center md:items-start w-full">
            <img src={img("logo-terrahaus-blanco.webp")} alt="Terrahaus logo" className="h-16 w-auto mb-2 mx-auto md:ml-[-12px]" style={{maxWidth: '300px'}} />
            <p className="text-gray-300 text-base mt-2 md:mt-0 mx-auto md:mx-0" style={{fontFamily: 'Inter Tight, sans-serif', fontWeight: 300, maxWidth: '320px'}}>
              Llevamos adelante tu proyecto de principio a fin con arquitectos especialistas en interiorismo.
            </p>
          </div>
        </div>
        {/* Columna 2: Contacto */}
        <div className="flex flex-col items-center md:items-start w-full mb-8 md:mb-0">
          <div className="text-lg font-bold mb-4 self-center md:self-start" style={{fontFamily: 'Inter Tight, sans-serif'}}>Ponte en contacto</div>
          <ul className="text-gray-300 space-y-2 text-base" style={{fontFamily: 'Inter Tight, sans-serif', fontWeight: 300}}>
            <li className="flex items-center gap-3">
              <span className="inline-block text-[#b35427]">
                {/* Icono teléfono clásico SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" stroke="#b35427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              LLámanos: <a href="tel:+34642413996" className="hover:text-[#b35427] transition">+34 642413996</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-block text-[#b35427]">
                {/* Email SVG */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a3 3 0 003.22 0L22 8m-19 8V8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
              </span>
              <a href="mailto:info@terrahaus.es" className="hover:text-[#b35427] transition">info@terrahaus.es</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-block text-[#b35427]">
                {/* Horario SVG */}
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              Lun - Vie: 09:00 a 18:00 / Sáb: 9:00 a 14:00
            </li>
          </ul>
        </div>
        {/* Columna 3: Servicios */}
        <div className="flex flex-col items-center md:items-start w-full mb-4 md:mb-0 justify-start">
          <div className="text-lg font-bold mb-4 self-center md:self-start" style={{fontFamily: 'Inter Tight, sans-serif', textAlign: 'left', width: '100%', marginTop: 0, paddingTop: 0}}>Proyectos</div>
          <ul className="text-gray-300 space-y-2 text-base" style={{fontFamily: 'Inter Tight, sans-serif', fontWeight: 300}}>
            <li><span style={{color:'#b35427', fontWeight:700, fontSize:'18px', marginRight:'8px'}}>&#10095;</span><a href="/glamping" className="hover:text-[#b35427] transition">Glamping</a></li>
            <li><span style={{color:'#b35427', fontWeight:700, fontSize:'18px', marginRight:'8px'}}>&#10095;</span><a href="/AlpinaBlanca" className="hover:text-[#b35427] transition">Alpina Blanca</a></li>
            <li><span style={{color:'#b35427', fontWeight:700, fontSize:'18px', marginRight:'8px'}}>&#10095;</span><a href="/CasaCuadrante" className="hover:text-[#b35427] transition">Casa Cuadrante</a></li>
            <li><span style={{color:'#b35427', fontWeight:700, fontSize:'18px', marginRight:'8px'}}>&#10095;</span><a href="/PequenaAndina" className="hover:text-[#b35427] transition">Pequeña Andina</a></li>
          </ul>
        </div>
      </div>
  <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-400 text-sm flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-16" style={{fontFamily: 'Inter Tight, sans-serif', fontWeight: 300}}>
        <span>Creado por <span className="font-bold">REFORMARKETING</span> <span className="text-lg">©</span> Copyright 2024.</span>
      </div>
    </footer>
  );
};

export default Footer;
