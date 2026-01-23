import React from "react";
import { img } from '../lib/assets';

// PROPUESTA ALTERNATIVA DE FOOTER
export const FoosterAlt: React.FC = () => (
  <footer className="w-full bg-black text-white py-12 px-8">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6">
      {/* Sección 1: Logo y descripción */}
      <div className="flex flex-col justify-start items-start md:col-span-2 md:pr-8">
        <a href="/" className="mb-4 block">
          <img src={img("Logo terrahous Blanco.webp")} alt="Terrahaus logo" className="h-16 w-auto" loading="lazy" />
        </a>
        <p className="text-gray-400 text-sm leading-relaxed" style={{fontFamily: 'Barlow, sans-serif', maxWidth: '300px'}}>
          Reformas integrales, construcción de proyectos turísticos y residenciales, y oportunidades de inversión inmobiliaria.
        </p>
      </div>
      
      {/* Columnas de información */}
      <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-6">
        {/* Servicios */}
        <div className="flex flex-col items-start">
          <div className="font-bold mb-3 text-left uppercase text-white" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px'}}>Servicios</div>
          <ul className="space-y-2 text-left text-gray-400 text-sm" style={{fontFamily: 'Barlow, sans-serif'}}>
            <li><span className="text-[#b35427] mr-2">›</span>Reformas integrales</li>
            <li><span className="text-[#b35427] mr-2">›</span>Construcción</li>
            <li><span className="text-[#b35427] mr-2">›</span>Inversión inmobiliaria</li>
            <li><span className="text-[#b35427] mr-2">›</span>Proyectos turísticos</li>
          </ul>
        </div>
        
        {/* Proyectos */}
        <div className="flex flex-col items-start">
          <div className="font-bold mb-3 text-left uppercase text-white" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px'}}>Proyectos</div>
          <ul className="space-y-2 text-left text-gray-400 text-sm" style={{fontFamily: 'Barlow, sans-serif'}}>
            <li><span className="text-[#b35427] mr-2">›</span><a href="/glamping" className="hover:text-white transition">Glamping Barbate</a></li>
            <li><span className="text-[#b35427] mr-2">›</span><a href="/proyectos/alpinablanca" className="hover:text-white transition">Alpina Blanca</a></li>
            <li><span className="text-[#b35427] mr-2">›</span><a href="/proyectos/casacuadrante" className="hover:text-white transition">Casa Cuadrante</a></li>
            <li><span className="text-[#b35427] mr-2">›</span><a href="/proyectos/casahorizonte" className="hover:text-white transition">Casa Horizonte</a></li>
          </ul>
        </div>
        
        {/* Contacto */}
        <div className="flex flex-col items-start">
          <div className="font-bold mb-3 text-left uppercase text-white" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '1px'}}>Contacto</div>
          <ul className="space-y-2 text-left text-gray-400 text-sm" style={{fontFamily: 'Barlow, sans-serif'}}>
            <li className="flex items-center gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#b35427" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a3 3 0 003.22 0L22 8m-19 8V8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
              <a href="mailto:info@terrahaus.es" className="hover:text-white transition">info@terrahaus.es</a>
            </li>
            <li className="flex items-center gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#b35427" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" /></svg>
              <a href="tel:+34642413996" className="hover:text-white transition">+34 642 413 996</a>
            </li>
            <li className="flex items-center gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#b35427" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Lun - Vie: 8:00 a 18:00</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div className="border-t border-gray-800 mt-10 pt-5 flex justify-center text-gray-500 text-xs" style={{fontFamily: 'Barlow, sans-serif'}}>
      <span>Creado por <a href="https://segundacabeza.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">Segunda Cabeza</a> © 2026</span>
    </div>
  </footer>
);

const Fooster: React.FC = () => (
  <footer className="w-full bg-black text-white py-14 px-4 mt-10">
    <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-x-2 items-start text-left">
      {/* Columna 1: Logo y descripción + social */}
      <div className="flex flex-col items-start w-full mb-8 md:mb-0 md:pl-0">
        <div className="flex items-center mb-2">
          <img src={img("Logo terrahous Blanco.webp")} alt="Terrahaus logo" className="h-10 w-auto mr-2" style={{maxWidth: '120px'}} loading="lazy" />
          <span className="font-bold text-lg" style={{fontFamily: 'Barlow, sans-serif'}}>Terrahaus</span>
        </div>
        <p className="mb-3" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: '15px', color: '#e5e7eb', maxWidth: '320px'}}>
          Llevamos adelante tu proyecto de principio a fin con arquitectos especialistas en interiorismo.
        </p>
      </div>
      {/* Columna 2: Proyectos */}
      <div className="flex flex-col items-start w-full mb-8 md:mb-0">
        <div className="font-bold mb-2 text-left" style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px', color: '#fff'}}>PROYECTOS</div>
        <ul className="space-y-1 text-left" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: '15px', color: '#e5e7eb'}}>
          <li><a href="/glamping" className="hover:underline">Glamping</a></li>
          <li><a href="/alpinablanca" className="hover:underline">Alpina Blanca</a></li>
          <li><a href="/casacuadrante" className="hover:underline">Casa Cuadrante</a></li>
          <li><a href="/pequenaandina" className="hover:underline">Pequeña Andina</a></li>
        </ul>
      </div>
      {/* Columna 3: Contacto */}
      <div className="flex flex-col items-start w-full mb-8 md:mb-0">
        <div className="font-bold mb-2 text-left" style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px', color: '#fff'}}>CONTACTO</div>
        <ul className="space-y-1 text-left" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: '15px', color: '#e5e7eb'}}>
          <li><a href="mailto:info@terrahaus.es" className="hover:underline">info@terrahaus.es</a></li>
          <li><a href="tel:+34642413996" className="hover:underline">+34 642413996</a></li>
        </ul>
      </div>
      {/* Columna 4: Horarios */}
      <div className="flex flex-col items-start w-full mb-8 md:mb-0">
        <div className="font-bold mb-2 text-left" style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px', color: '#fff'}}>HORARIOS</div>
        <ul className="space-y-1 text-left" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: '15px', color: '#e5e7eb'}}>
          <li>Lun - Vie: 8:00 a 18:00</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-10 pt-4 flex justify-center text-gray-400 text-xs" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300}}>
      <span>Creado por <a href="https://segundacabeza.com" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-white transition">Segunda Cabeza</a> © 2026.</span>
    </div>
  </footer>
);

export default Fooster;
