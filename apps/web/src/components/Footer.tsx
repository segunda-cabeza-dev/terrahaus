import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black text-white pt-14 pb-6 px-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Columna 1: Logo y descripción */}
        <div className="flex flex-col items-start">
          <img src="/assets/images/Logo%20terrahous%20Blanco.png" alt="Terrahaus logo" className="h-12 w-auto mb-4" style={{maxWidth: '220px'}} />
          <p className="text-gray-300 mb-2 text-base whitespace-pre-line" style={{fontFamily: 'Inter Tight, sans-serif', fontWeight: 300}}>
            Llevamos adelante tu proyecto
            {"\n"}de principio a fin con
            {"\n"}<span className="font-bold">arquitectos especialistas en interiorismo.</span>
          </p>
        </div>
        {/* Columna 2: Contacto */}
        <div>
          <div className="text-lg font-bold mb-4" style={{fontFamily: 'Inter Tight, sans-serif', letterSpacing: 1}}>Ponte en contacto</div>
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
        <div>
          <div className="text-lg font-bold mb-4" style={{fontFamily: 'Inter Tight, sans-serif', letterSpacing: 1}}>Obra nueva y reformas de:</div>
          <ul className="text-gray-300 space-y-2 text-base" style={{fontFamily: 'Inter Tight, sans-serif', fontWeight: 300}}>
            <li>Casas de hormigón</li>
            <li>Casas de madera</li>
            <li>Cabañas y bungalows</li>
            <li>Glampings</li>
            <li>Oficinas y locales comerciales</li>
          </ul>
        </div>
      </div>
  <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-400 text-sm flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-8" style={{fontFamily: 'Inter Tight, sans-serif', fontWeight: 300}}>
        <span>Creado por <span className="font-bold">REFORMARKETING</span> <span className="text-lg">©</span> Copyright 2024.</span>
      </div>
    </footer>
  );
};

export default Footer;
