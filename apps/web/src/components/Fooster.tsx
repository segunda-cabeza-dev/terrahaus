// PROPUESTA ALTERNATIVA DE FOOTER
export const FoosterAlt: React.FC = () => (
  <footer className="w-full bg-black text-white py-10 px-3 sm:px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-start md:items-start gap-8 md:gap-x-12">
      {/* Columna 1: Logo y descripción */}
  <div className="flex flex-col items-start w-full md:w-1/4 mb-6 md:mb-0">
        <div className="flex items-center mb-3">
          <img src="/assets/images/Logo%20terrahous%20Blanco.png" alt="Terrahaus logo" className="max-h-20 w-auto mr-4" style={{maxWidth: '220px', height: 'auto'}} />
        </div>
        <p className="mb-4" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: '15px', color: '#e5e7eb', maxWidth: '320px'}}>
          Llevamos adelante tu proyecto de principio a fin con arquitectos especialistas en interiorismo.
        </p>
      </div>
      {/* Agrupador de columnas derechas */}
  <div className="flex flex-col sm:flex-row gap-6 md:gap-x-12 ml-0 md:ml-32 w-full md:w-auto">
        {/* Columna 2: Proyectos */}
  <div className="flex flex-col items-start pt-2 w-full sm:w-auto min-w-[160px]">
          <div className="font-bold mb-2 text-left" style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px', color: '#fff'}}>PROYECTOS</div>
          <ul className="space-y-1 text-left" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: '15px', color: '#e5e7eb'}}>
            <li><span className="text-[#b35427] font-bold mr-2">&gt;</span><a href="/es/glamping" className="hover:text-[#b35427] transition">Glamping</a></li>
            <li><span className="text-[#b35427] font-bold mr-2">&gt;</span><a href="/es/proyectos/alpinablanca" className="hover:text-[#b35427] transition">Alpina Blanca</a></li>
             <li><span className="text-[#b35427] font-bold mr-2">&gt;</span><a href="/es/proyectos/casacuadrante" className="hover:text-[#b35427] transition">Casa Cuadrante</a></li>
             <li><span className="text-[#b35427] font-bold mr-2">&gt;</span><a href="/es/proyectos/casahorizonte" className="hover:text-[#b35427] transition">Casa Horizonte</a></li>
            <li><span className="text-[#b35427] font-bold mr-2">&gt;</span><a href="/es/pequenaandina" className="hover:text-[#b35427] transition">Pequeña Andina</a></li>
          </ul>
        </div>
        {/* Columna 3: Contacto */}
  <div className="flex flex-col items-start pt-2 w-full sm:w-auto min-w-[160px] mt-4 sm:mt-0">
          <div className="font-bold mb-2 text-left" style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px', color: '#fff'}}>CONTACTO</div>
          <ul className="space-y-1 text-left" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: '15px', color: '#e5e7eb'}}>
            <li className="flex items-center gap-2">
              <span className="inline-block align-middle">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#b35427]"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a3 3 0 003.22 0L22 8m-19 8V8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
              </span>
              <a href="mailto:info@terrahaus.es" className="hover:underline">info@terrahaus.es</a>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block align-middle">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#b35427]"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" /></svg>
              </span>
              <a href="tel:+34642413996" className="hover:underline">+34 642413996</a>
            </li>
          </ul>
        </div>
        {/* Columna 4: Horarios */}
  <div className="flex flex-col items-start pt-2 w-full sm:w-auto min-w-[160px] mt-4 sm:mt-0">
          <div className="font-bold mb-2 text-left" style={{fontFamily: 'Barlow, sans-serif', fontSize: '16px', color: '#fff'}}>HORARIOS</div>
          <ul className="space-y-1 text-left" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, fontSize: '15px', color: '#e5e7eb'}}>
            <li className="flex items-center gap-2">
              <span className="inline-block align-middle">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#b35427]"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              Lun - Vie: 09:00 a 18:00
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block align-middle">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#b35427]"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              Sáb: 9:00 a 14:00
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-10 pt-4 flex justify-center text-gray-400 text-xs" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300}}>
      <span>Creado por <span className="font-bold">REFORMARKETING</span> © 2024.</span>
    </div>
  </footer>
);
import React from "react";

const Fooster: React.FC = () => (
  <footer className="w-full bg-black text-white py-14 px-4 mt-10">
    <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-x-2 items-start text-left">
      {/* Columna 1: Logo y descripción + social */}
      <div className="flex flex-col items-start w-full mb-8 md:mb-0 md:pl-0">
        <div className="flex items-center mb-2">
          <img src="/assets/images/Logo%20terrahous%20Blanco.png" alt="Terrahaus logo" className="h-10 w-auto mr-2" style={{maxWidth: '120px'}} />
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
          <li><a href="/es/glamping" className="hover:underline">Glamping</a></li>
          <li><a href="/es/alpinablanca" className="hover:underline">Alpina Blanca</a></li>
          <li><a href="/es/casacuadrante" className="hover:underline">Casa Cuadrante</a></li>
          <li><a href="/es/pequenaandina" className="hover:underline">Pequeña Andina</a></li>
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
          <li>Lun - Vie: 09:00 a 18:00</li>
          <li>Sáb: 9:00 a 14:00</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-10 pt-4 flex justify-center text-gray-400 text-xs" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300}}>
      <span>Creado por <span className="font-bold">REFORMARKETING</span> © 2024.</span>
    </div>
  </footer>
);

export default Fooster;
