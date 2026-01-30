import React, { useRef, useLayoutEffect, useState } from "react";
import { img } from '../lib/assets';


const Header: React.FC = () => {
  const [showProjects, setShowProjects] = useState(false);
  const [showReformas, setShowReformas] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineStyle, setLineStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (logoRef.current && btnRef.current && containerRef.current) {
      const logoRect = logoRef.current.getBoundingClientRect();
      const btnRect = btnRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setLineStyle({
        left: logoRect.left - containerRect.left,
        width: btnRect.right - logoRect.left,
        height: 1,
        background: 'rgba(255,255,255,0.6)',
        position: 'absolute',
        bottom: -18,
        pointerEvents: 'none',
      });
    }
  }, []);

  return (
    <header className="w-full absolute top-0 left-0 z-30 pt-10">
      <div className="max-w-5xl mx-auto px-8 relative" ref={containerRef}>
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <a ref={logoRef} href="/" className="flex items-center" style={{minWidth: 180}}>
            <img
              src={img("Logo terrahous Blanco.webp")}
              alt="Terrahaus Logo"
              className="h-12 w-auto"
            />
          </a>
          {/* Menú y botón: solo visible en desktop */}
          <nav className="flex-1 flex justify-center hidden md:flex">
            <ul className="flex gap-10">
              <li className="relative">
                <button
                  className="flex items-center text-white font-bold text-[20px] uppercase tracking-wide hover:opacity-80"
                  style={{fontFamily: 'Bebas Neue, sans-serif'}}
                  onClick={() => setShowReformas((v) => !v)}
                >
                  Reformas
                  <span className={`ml-2 transition-transform ${showReformas ? 'rotate-180' : ''}`}>
                    <span className="text-base">▼</span>
                  </span>
                </button>
                {showReformas && (
                  <ul className="absolute left-0 mt-2 bg-white rounded shadow-lg text-[#232b36] min-w-[180px] z-50">
                    <li><a href="/reformas-cocina" className="block px-4 py-2 hover:bg-[#f6f7f9]">Cocina</a></li>
                  </ul>
                )}
              </li>
              <li>
                <a href="#contacto" className="text-white font-bold text-[20px] uppercase tracking-wide hover:opacity-80" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Construcción</a>
              </li>
              <li>
                <a href="#contacto" className="text-white font-bold text-[20px] uppercase tracking-wide hover:opacity-80" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Inversión</a>
              </li>
              <li className="relative">
                <button
                  className="flex items-center text-white font-bold text-[20px] uppercase tracking-wide hover:opacity-80"
                  style={{fontFamily: 'Bebas Neue, sans-serif'}}
                  onClick={() => setShowProjects((v) => !v)}
                >
                  Proyectos
                  <span className={`ml-2 transition-transform ${showProjects ? 'rotate-180' : ''}`}>
                    <span className="text-base">▼</span>
                  </span>
                </button>
                {showProjects && (
                  <ul className="absolute left-0 mt-2 bg-white rounded shadow-lg text-[#232b36] min-w-[180px] z-50">
                    <li><a href="/proyectos/alpinablanca" className="block px-4 py-2 hover:bg-[#f6f7f9]">Alpina Blanca</a></li>
                    <li><a href="/proyectos/casacuadrante" className="block px-4 py-2 hover:bg-[#f6f7f9]">Casa Cuadrante</a></li>
                    <li><a href="/proyectos/casahorizonte" className="block px-4 py-2 hover:bg-[#f6f7f9]">Casa Horizonte</a></li>
                    <li><a href="/glamping" className="block px-4 py-2 hover:bg-[#f6f7f9]">Glamping <span className="text-[#b35427]">★</span></a></li>
                    <li><a href="/pequenaandina" className="block px-4 py-2 hover:bg-[#f6f7f9]">Pequeña Andina</a></li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
          {/* Botón derecho: solo visible en desktop */}
          <a ref={btnRef} href="#contacto" className="bg-[#b35427] hover:bg-[#a3471d] text-white font-bold py-2 px-6 rounded transition text-[20px] uppercase shadow-lg min-w-[150px] text-center hidden md:inline-block" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Contáctanos</a>
          {/* Hamburguesa: solo visible en móvil */}
          <button 
            className="md:hidden flex items-center justify-center ml-4 z-50 relative" 
            aria-label="Abrir menú"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
        {/* Línea inferior perfectamente alineada */}
        <div style={lineStyle}></div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#10141b] z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-32 px-8 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="flex flex-col gap-8">
            <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-3xl font-bold uppercase tracking-wide" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Reformas</a>
            <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-3xl font-bold uppercase tracking-wide" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Construcción</a>
            <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)} className="text-white text-3xl font-bold uppercase tracking-wide" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Inversión</a>
            
            <div className="flex flex-col gap-4">
                <span className="text-white text-3xl font-bold uppercase tracking-wide" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Proyectos</span>
                <div className="pl-4 flex flex-col gap-4 border-l-2 border-[#b35427]/50 ml-1">
                    <a href="/proyectos/alpinablanca" className="text-gray-300 text-xl hover:text-white transition-colors">Alpina Blanca</a>
                    <a href="/proyectos/casacuadrante" className="text-gray-300 text-xl hover:text-white transition-colors">Casa Cuadrante</a>
                    <a href="/proyectos/casahorizonte" className="text-gray-300 text-xl hover:text-white transition-colors">Casa Horizonte</a>
                    <a href="/glamping" className="text-gray-300 text-xl hover:text-white transition-colors">Glamping <span className="text-[#b35427]">★</span></a>
                    <a href="/pequenaandina" className="text-gray-300 text-xl hover:text-white transition-colors">Pequeña Andina</a>
                </div>
            </div>

            <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#b35427] text-white text-center py-4 rounded text-2xl font-bold uppercase mt-4 shadow-lg" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Contáctanos</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
