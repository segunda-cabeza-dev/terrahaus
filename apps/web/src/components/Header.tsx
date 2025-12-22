import React, { useRef, useLayoutEffect, useState } from "react";


const Header: React.FC = () => {
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
          <a ref={btnRef} href="#contacto" className="bg-[#b35427] hover:bg-[#a3471d] text-white font-bold py-2 px-6 rounded transition text-[20px] uppercase shadow-lg min-w-[150px] text-center" style={{fontFamily: 'Bebas Neue, sans-serif'}}>Contáctanos</a>
        </div>
        {/* Línea inferior perfectamente alineada */}
        <div style={lineStyle}></div>
      </div>
    </header>
  );
};

export default Header;
