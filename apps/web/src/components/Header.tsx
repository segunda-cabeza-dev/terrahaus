import React from "react";


const Header: React.FC = () => {
  return (
    <header className="w-full absolute top-0 left-0 z-30 pt-10">
      <div className="max-w-5xl mx-auto px-8 relative">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <a href="/" className="flex items-center" style={{minWidth: 180}}>
            <img
              src="/assets/images/Logo terrahous Blanco.png"
              alt="Terrahaus Logo"
              className="h-12 w-auto"
            />
          </a>
          {/* Menú centrado */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex gap-14">
              <li>
                <a href="#cost-calculator" className="text-white font-bold text-[20px] uppercase tracking-wide hover:opacity-80" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Calculadora de coste</a>
              </li>
              <li>
                <a href="#metodologia" className="text-white font-bold text-[20px] uppercase tracking-wide hover:opacity-80" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Metodología</a>
              </li>
              <li>
                <a href="#proyectos" className="text-white font-bold text-[20px] uppercase tracking-wide hover:opacity-80" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Proyectos</a>
              </li>
            </ul>
          </nav>
          {/* Botón derecho */}
          <a href="#contacto" className="bg-[#b35427] hover:bg-[#a3471d] text-white font-bold py-2 px-6 rounded transition text-[20px] uppercase shadow-lg min-w-[150px] text-center" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Contáctanos</a>
        </div>
        {/* Línea inferior perfectamente alineada */}
        <div className="absolute left-0 right-0 flex items-center pointer-events-none" style={{bottom: '-18px', height: '1px'}}>
          <div style={{minWidth: 180}}></div>
          <div className="flex-1 h-px bg-white/60"></div>
          <div style={{minWidth: 150}}></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
