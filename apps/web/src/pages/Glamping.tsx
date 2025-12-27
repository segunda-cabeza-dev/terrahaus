    // ...existing code...
import React from "react";
import Header from "../components/Header";
import { FoosterAlt } from "../components/Fooster";
import Formulario from "../components/Formulario";

const HeroGlamping: React.FC = () => (
  <section className="relative min-h-screen flex flex-col justify-center font-sans bg-[#10141b] overflow-hidden py-10">
    {/* Fondo */}
    <div className="absolute inset-0 w-full h-full z-0">
      <img
        src="/assets/images/Hero-Glamping.jpg"
        alt="Glamping Hero"
        className="w-full h-full object-cover object-center opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#10141b]/95 via-[#10141b]/80 to-[#1e2d2f]/90" />
    </div>
    <Header />
  <div className="relative z-20 flex flex-col items-center justify-center text-white px-6 md:px-20 py-24 pt-32 gap-6 max-w-3xl mx-auto w-full text-center min-h-[70vh]">
      {/* Badge y logo */}
      <div className="flex items-center justify-center mb-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 text-[#1db489] font-semibold text-xs uppercase tracking-wide shadow-sm border border-[#1db489]/20" style={{letterSpacing: '0.08em'}}>
          En ejecución
        </span>
      </div>
      {/* Título */}
      <h1 className="text-[3.5rem] md:text-[4.5rem] leading-tight font-bold tracking-tight mb-1 flex flex-wrap items-center justify-center gap-2" style={{fontFamily: 'Bebas Neue, sans-serif', color: '#fff'}}>
        <span className="hidden md:flex items-center justify-center w-full text-center gap-2 leading-[1.05]">
          GLAMPING
          <span className="ml-2">4</span>
          <span className="inline-block align-super text-[2.2rem] text-[#b35427]">★</span>
          BARBATE
        </span>
        <span className="flex md:hidden flex-col items-center w-full text-center leading-[1.05]">
          <span>GLAMPING</span>
          <span className="flex items-center justify-center gap-1 mt-[-0.7rem]">
            <span className="text-[3.5rem]">4</span>
            <span className="inline-block align-super text-[1.4rem] text-[#b35427]">★</span>
            <span className="text-[3.5rem]">BARBATE</span>
          </span>
        </span>
      </h1>
      {/* Descripción */}
      <div className="text-lg md:text-xl font-medium mb-4 -mt-2" style={{fontFamily: 'Barlow, sans-serif', color: '#e6e6e6'}}>
        Complejo turístico ecológico de gran escala en primera línea de costa. Integra 55 alojamientos, servicios centralizados y áreas de recreación, con un diseño de bajo impacto ambiental.
      </div>
      {/* Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 w-full max-w-2xl mx-auto mb-2">
        {/* Ubicación */}
        <div className="flex flex-row items-center justify-start bg-white/90 rounded-xl py-3 px-4 shadow border border-[#b35427]/10 min-h-[60px] gap-3 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <span className="text-[#b35427] flex items-center justify-center">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.05 10.74 7.36 10.97a1 1 0 0 0 1.28 0C13.95 21.74 21 16.25 21 11c0-4.97-4.03-9-9-9Zm0 17.88C9.14 17.07 5 13.61 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7c0 2.61-4.14 6.07-7 8.88ZM12 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="#b35427"/></svg>
          </span>
          <div className="flex flex-col items-start justify-center">
            <div className="text-base text-[#232b36]">Barbate, Cádiz</div>
          </div>
        </div>
        {/* Escala */}
        <div className="flex flex-row items-center justify-start bg-white/90 rounded-xl py-3 px-4 shadow border border-[#b35427]/10 min-h-[60px] gap-3 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <span className="text-[#b35427] flex items-center justify-center">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M4 17v2h16v-2H4Zm0-5v2h16v-2H4Zm0-5v2h16V7H4Z" fill="#b35427"/></svg>
          </span>
          <div className="flex flex-col items-start justify-center">
            <div className="text-base text-[#232b36]">55 Aloj. / 1.500m²</div>
          </div>
        </div>
        {/* Tipo */}
        <div className="flex flex-row items-center justify-start bg-white/90 rounded-xl py-3 px-4 shadow border border-[#b35427]/10 min-h-[60px] gap-3 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <span className="text-[#b35427] flex items-center justify-center">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 17.93V20h-2v-.07A8.001 8.001 0 0 1 4.07 13H6v-2H4.07A8.001 8.001 0 0 1 11 4.07V4h2v.07A8.001 8.001 0 0 1 19.93 11H18v2h1.93A8.001 8.001 0 0 1 13 19.93ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" fill="#b35427"/></svg>
          </span>
          <div className="flex flex-col items-start justify-center">
            <div className="text-base text-[#232b36]">Eco-Sostenible</div>
          </div>
        </div>
        {/* Estado */}
        <div className="flex flex-row items-center justify-start bg-white/90 rounded-xl py-3 px-4 shadow border border-[#b35427]/10 min-h-[60px] gap-3 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
          <span className="text-[#b35427] flex items-center justify-center">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM7 7h10v2H7V7Zm0 4h7v2H7v-2Zm0 4h10v2H7v-2Z" fill="#b35427"/></svg>
          </span>
          <div className="flex flex-col items-start justify-center">
            <div className="text-base text-[#232b36]">Fase de Inicio</div>
          </div>
        </div>
      </div>
      {/* Botón eliminado */}
    </div>
    </section>
);


function Glamping() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <HeroGlamping />

      {/* Sección 01: El Proyecto */}
      <section className="w-full py-20 px-6 md:px-16 xl:px-32 bg-white flex flex-col items-center">
        <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Imagen izquierda */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md aspect-[4/3] bg-slate-200 rounded-2xl flex items-center justify-center border border-slate-100 shadow overflow-hidden">
            <img
              src="/assets/images/01-elproyecto.jpg"
              alt="El Proyecto Glamping"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
        {/* Texto derecha */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <span className="text-[#b35427] font-bold text-sm uppercase" style={{letterSpacing: '0.05em'}}>01. El Proyecto</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b]" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Un ecosistema turístico completo</h2>
          <div className="text-[#232b36] space-y-4" style={{fontFamily: 'Barlow, sans-serif', fontSize: '17px'}}>
            <p style={{fontSize: '17px'}}>El Glamping 4★ Barbate es un proyecto turístico de gran envergadura que nace con el objetivo de ofrecer una nueva forma de alojamiento en entornos naturales.</p>
            <p style={{fontSize: '17px'}}>El proyecto combina arquitectura, paisaje y sostenibilidad, apostando por un modelo de desarrollo respetuoso con el entorno, de bajo impacto sobre el terreno y con una clara vocación regenerativa.</p>
            <p style={{fontSize: '17px'}}>No se trata únicamente de alojamiento, sino de crear un ecosistema turístico completo, donde el visitante pueda disfrutar de confort, naturaleza y servicios de calidad en un entorno cuidado e integrado.</p>
          </div>
        </div>
      </div>
    </section>


    {/* Sección 02: Concepto y Enfoque */}
  <section className="w-full py-20 px-6 md:px-16 xl:px-32 bg-[#f6f7f9] flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Texto izquierda */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <span className="text-[#b35427] font-bold text-sm uppercase mb-2" style={{letterSpacing: '0.05em'}}>02. Concepto y Enfoque</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#10141b]" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Adaptación estética y técnica al entorno</h2>
          <div className="text-lg text-[#232b36] space-y-4" style={{fontFamily: 'Barlow, sans-serif'}}>
            <p>El diseño del Glamping 4★ Barbate se inspira en la estética y el espíritu de los glampings tailandeses, adaptados a los sistemas constructivos y normativos europeos.</p>
            <ul className="space-y-3 mt-4">
              <li><span className="font-bold text-[#b35427]">Intervención mínima:</span> Adaptándose a la topografía natural, utilizando cimentación no invasiva.</li>
              <li><span className="font-bold text-[#b35427]">Integración paisajística:</span> Respetando la identidad del lugar y utilizando vegetación autóctona.</li>
              <li><span className="font-bold text-[#b35427]">Experiencia inmersiva:</span> Priorizando el contacto directo y visual con la naturaleza.</li>
            </ul>
            <p>El resultado es un complejo que prioriza el equilibrio entre desarrollo, entorno y experiencia del usuario.</p>
          </div>
        </div>
        {/* Imagen derecha */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md aspect-[4/3] bg-slate-200 rounded-2xl flex items-center justify-center border border-slate-100 shadow">
            <img
              src="/assets/images/02-concepto.png"
              alt="Concepto y Enfoque Glamping"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Sección 03: Organización General del Conjunto */}
  <section className="w-full py-20 px-6 md:px-16 xl:px-32 bg-white flex flex-col items-center">
      <div className="max-w-4xl mx-auto text-center mb-12">
  <span className="text-[#b35427] font-bold text-sm uppercase mb-4" style={{letterSpacing: '0.05em'}}>03. Organización General del Conjunto</span>
  <h2 className="text-2xl md:text-3xl font-bold text-[#10141b] mb-4 mt-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Distribución funcional y bajo impacto</h2>
        <p className="text-lg text-[#232b36]" style={{fontFamily: 'Barlow, sans-serif'}}>
          <span style={{fontSize: '17px'}}>El complejo se organiza en distintas áreas funcionales claramente diferenciadas, permitiendo un funcionamiento eficiente y una experiencia fluida para los usuarios.</span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        {/* Tarjeta 1: Alojamiento */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3"><path d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10.5Z" stroke="#b35427" strokeWidth="1.5"/><path d="M9 21V12h6v9" stroke="#b35427" strokeWidth="1.5"/></svg>
          <div className="text-xl font-bold text-[#232b36]">Alojamiento</div>
        </div>
        {/* Tarjeta 2: Comunitarios (Edificio) */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="mb-3">
            <rect x="8" y="20" width="32" height="20" rx="0" stroke="#b35427" strokeWidth="2"/>
            <rect x="16" y="12" width="16" height="28" rx="0" stroke="#b35427" strokeWidth="2"/>
            <rect x="12" y="40" width="24" height="4" rx="0" stroke="#b35427" strokeWidth="2"/>
            <rect x="20" y="20" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="24" y="20" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="28" y="20" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="20" y="24" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="24" y="24" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="28" y="24" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="20" y="28" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="24" y="28" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="28" y="28" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="20" y="32" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="24" y="32" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
            <rect x="28" y="32" width="4" height="4" stroke="#b35427" strokeWidth="2"/>
          </svg>
          <div className="text-xl font-bold text-[#232b36]">Comunitarios</div>
        </div>
        {/* Tarjeta 3: Ocio / Recreación */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3"><path d="M3 17c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/><path d="M3 13c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/><path d="M3 9c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/></svg>
          <div className="text-xl font-bold text-[#232b36]">Ocio / Recreación</div>
        </div>
        {/* Tarjeta 4: Movilidad (Auto) */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3">
            <path d="M3 15.5V14a2 2 0 0 1 2-2h2.5l2-2.5A2 2 0 0 1 11.5 8h3A2 2 0 0 1 16 9.5l1.5 2H19a2 2 0 0 1 2 2v2.5" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6.5" cy="16.5" r="1.5" stroke="#b35427" strokeWidth="1.5"/>
            <circle cx="17.5" cy="16.5" r="1.5" stroke="#b35427" strokeWidth="1.5"/>
          </svg>
          <div className="text-xl font-bold text-[#232b36]">Movilidad</div>
        </div>
        {/* Tarjeta 5: Reforestación (Hoja) */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3">
            <path d="M4 18C4 10 16 3 20 12C21 15 18 20 10 20C7 20 4 19 4 18Z" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17C9.5 15 13 13 16 14" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="text-xl font-bold text-[#232b36]">Reforestación</div>
        </div>
        {/* Tarjeta 6: Autocaravanas (Camión) */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="mb-3">
            <rect x="8" y="20" width="32" height="12" rx="2" stroke="#b35427" strokeWidth="2"/>
            <rect x="12" y="24" width="8" height="6" stroke="#b35427" strokeWidth="2"/>
            <rect x="20" y="24" width="8" height="6" stroke="#b35427" strokeWidth="2"/>
            <rect x="28" y="24" width="8" height="6" stroke="#b35427" strokeWidth="2"/>
            <rect x="36" y="24" width="4" height="6" stroke="#b35427" strokeWidth="2"/>
            <circle cx="16" cy="36" r="3" stroke="#b35427" strokeWidth="2"/>
            <circle cx="32" cy="36" r="3" stroke="#b35427" strokeWidth="2"/>
            <path d="M8 32h32" stroke="#b35427" strokeWidth="2"/>
            <path d="M12 20v-2a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v2" stroke="#b35427" strokeWidth="2"/>
          </svg>
          <div className="text-xl font-bold text-[#232b36]">Autocaravanas</div>
        </div>
      </div>
    </section>

    {/* Sección 04: Área de Alojamientos */}
  <section className="w-full py-20 px-6 md:px-16 xl:px-32 bg-[#f6f7f9] flex flex-col items-center">
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Texto izquierda */}
        <div className="w-full md:w-3/5 flex flex-col gap-6">
          <span className="text-[#b35427] font-bold text-sm uppercase" style={{letterSpacing: '0.05em'}}>04. Área de Alojamientos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] leading-tight" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Bungalós y cabañas prefabricadas</h2>
          <p className="text-lg text-[#232b36]" style={{fontFamily: 'Barlow, sans-serif'}}>
            <span style={{fontSize: '17px'}}>El proyecto contempla la ejecución de 55 alojamientos prefabricados tipo bungaló-cabaña, concebidos como unidades independientes e integradas en el entorno natural.</span>
          </p>
          {/* Tarjeta de Datos Técnicos (Fuente: Planos) */}
          <div className="p-0 mb-4 max-w-xl w-full flex flex-col gap-2 items-start">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-extrabold text-xl text-[#232b36]">Datos Técnicos</span>
              <span className="text-[#7a7a7a] text-sm font-medium">(Fuente: Planos)</span>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full">
              {/* Tarjeta 1 */}
              <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col items-start w-full md:w-1/3">
                <span className="text-xl font-extrabold text-[#b35427] leading-tight mb-1">55</span>
                <span className="uppercase text-[10px] md:text-[11px] lg:text-[10px] text-[#7a7a7a] font-semibold tracking-wider whitespace-nowrap">Unidades Totales</span>
              </div>
              {/* Tarjeta 2 */}
              <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col items-start w-full md:w-1/3">
                <span className="text-xl font-extrabold text-[#b35427] leading-tight mb-1">1.500,70<span className="align-top text-base">m²</span></span>
                <span className="uppercase text-[10px] md:text-[11px] lg:text-[10px] text-[#7a7a7a] font-semibold tracking-wider whitespace-nowrap">Superficie Construida</span>
              </div>
              {/* Tarjeta 3 */}
              <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-col items-start w-full md:w-1/3">
                <span className="text-xl font-extrabold text-[#b35427] leading-tight mb-1">4 Tipos</span>
                <span className="text-[10px] md:text-[11px] lg:text-[10px] text-[#7a7a7a] font-medium whitespace-nowrap">A, A AD, B, B AD</span>
              </div>
            </div>
          </div>
        {/* Lista de ventajas */}
        <ul className="list-disc pl-6 text-[#232b36] space-y-1" style={{fontSize: '17px'}}>
          <li className="flex items-start gap-2"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f3edea"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#b35427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Prioriza la privacidad del huésped y el confort interior.</span></li>
          <li className="flex items-start gap-2"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f3edea"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#b35427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Fomenta la relación directa con el exterior y el paisaje.</span></li>
          <li className="flex items-start gap-2"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f3edea"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#b35427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Disposición que minimiza el impacto visual y físico sobre el terreno.</span></li>
        </ul>
      </div>
      {/* Imagen derecha */}
      <div className="w-full md:w-2/5 flex justify-center mt-10 md:mt-0">
        <div className="w-full max-w-lg aspect-[4/3] bg-slate-100 rounded-2xl border border-slate-100 shadow">
          <img
            src="/assets/images/04-alojamientos.png"
            alt="Área de Alojamientos Glamping"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  </section>
    {/* Sección 05: Servicios centrales y ocio - REDISEÑO */}
    <section className="w-full py-16 px-6 md:px-16 xl:px-32 bg-white flex flex-col items-center">
  <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Imágenes izquierda */}
  <div className="flex flex-col items-center md:items-start gap-6 justify-center h-full">
          <div className="aspect-[4/3] bg-slate-200 rounded-2xl flex items-center justify-center border border-slate-100 shadow overflow-hidden w-full max-w-md md:ml-12">
            <img
              src="/assets/images/05-comunitarios.png"
              alt="Vista del restaurante, solárium y piscina central"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <div className="aspect-[4/3] bg-slate-200 rounded-2xl flex items-center justify-center border border-slate-100 shadow overflow-hidden w-full max-w-md md:ml-12">
            <img
              src="/assets/images/06-2exteriores.png"
              alt="Piscina central y áreas deportivas"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
        {/* Contenido alineado derecha */}
  <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
          <span className="text-[#b35427] font-bold text-sm uppercase tracking-widest" style={{letterSpacing: '0.05em'}}>05. Servicios centrales y ocio</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b]" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>
            EL CORAZÓN DEL COMPLEJO: RESTAURACIÓN Y RECREACIÓN
          </h2>
          <p className="text-lg text-[#232b36]" style={{fontFamily: 'Barlow, sans-serif'}}>
            Los edificios comunitarios y las zonas de ocio se agrupan en un área centralizada, diseñados para ser el punto de encuentro y la columna vertebral de los servicios del glamping.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-2">
            <div className="bg-white rounded-2xl p-5 shadow border border-[#e6e8ec] flex flex-col items-start">
              <span className="text-2xl md:text-3xl font-extrabold text-[#b35427] mb-1" style={{fontFamily: 'Bebas Neue, sans-serif'}}>
                477,00m<sup>2</sup>
              </span>
              <span className="font-bold text-[#232b36] uppercase text-xs mb-1 tracking-widest leading-tight whitespace-nowrap">Superficie total edificios</span>
              <span className="text-xs text-[#232b36]">
                Recepción, Restaurante, Supermercado<span className="hidden md:inline"><br /></span> Aseos, Club Social.
              </span>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow border border-[#e6e8ec] flex flex-col items-start">
              <span className="text-2xl md:text-3xl font-extrabold text-[#b35427] mb-1" style={{fontFamily: 'Bebas Neue, sans-serif'}}>
                219,85m<sup>2</sup>
              </span>
              <span className="font-bold text-[#232b36] uppercase text-xs mb-1 tracking-widest">Edificio F - Restaurante</span>
              <span className="text-xs text-[#232b36]">La edificación más extensa, punto de encuentro y gastronomía central.</span>
            </div>
          </div>
          <span className="font-bold text-[#232b36] text-lg mt-2 mb-1 block">Instalaciones de Ocio</span>
          <ul className="space-y-4 mt-0">
            <li className="flex items-center gap-3">
              <span className="text-[#1db489]">
                {/* Icono piscina */}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 17c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#1db489" strokeWidth="2"/><path d="M3 13c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#1db489" strokeWidth="2"/><path d="M3 9c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#1db489" strokeWidth="2"/></svg>
              </span>
              <span className="font-medium text-base text-[#232b36]">Piscina de adultos y solárium</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#1db489]">
                {/* Icono piscina */}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 17c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#1db489" strokeWidth="2"/><path d="M3 13c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#1db489" strokeWidth="2"/><path d="M3 9c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#1db489" strokeWidth="2"/></svg>
              </span>
              <span className="font-medium text-base text-[#232b36]">Piscina infantil</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#1db489]">
                {/* Icono pista deportiva */}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><g><circle cx="12" cy="12" r="10" stroke="#1db489" strokeWidth="2"/><path d="M7 12h10M12 7v10" stroke="#1db489" strokeWidth="2"/></g></svg>
              </span>
              <span className="font-medium text-base text-[#232b36]">Pista deportiva y circuito</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#1db489]">
                {/* Icono parque infantil */}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2v20" stroke="#1db489" strokeWidth="2"/><circle cx="12" cy="17" r="5" stroke="#1db489" strokeWidth="2"/></svg>
              </span>
              <span className="font-medium text-base text-[#232b36]">Parque infantil</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#1db489]">
                {/* Icono zonas ajardinadas */}
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M5 20c0-7 14-14 14-5 1 3-2 8-10 8-3 0-6-1-6-2z" stroke="#1db489" strokeWidth="2"/><path d="M9 19c1.5-2 5-4 8-3" stroke="#1db489" strokeWidth="2"/></svg>
              </span>
              <span className="font-medium text-base text-[#232b36]">Zonas ajardinadas y descanso</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    {/* Sección 06: Espacios Exteriores y Zonas de Ocio */}

    {/* Sección 06: Movilidad interna */}
  <section className="w-full py-20 px-6 md:px-16 xl:px-32 bg-white flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Columna izquierda: texto */}
        <div className="w-full md:w-1/2 flex flex-col">
          <span className="text-[#b35427] font-bold tracking-widest text-sm uppercase block mb-2" style={{letterSpacing: '0.05em'}}>06. Urbanización y Accesos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Movilidad interna: priorizando al peatón</h2>
          <p className="text-lg text-[#232b36] mb-4" style={{fontFamily: 'Barlow, sans-serif', fontSize: '17px'}}>
            La urbanización del complejo ha sido diseñada para garantizar un funcionamiento claro y ordenado, separando los flujos rodados de los recorridos peatonales.
          </p>
          <p className="text-[#232b36] mb-2" style={{fontSize: '17px'}}>El diseño de la movilidad interna se centra en:</p>
          <ul className="list-disc pl-6 text-[#232b36] mb-4 space-y-1" style={{fontSize: '17px'}}>
            <li>Priorizar el tránsito peatonal y el movimiento no motorizado.</li>
            <li>Favorecer recorridos tranquilos y seguros dentro del complejo.</li>
            <li>Integrar los accesos y aparcamientos sin alterar el paisaje natural.</li>
          </ul>
          <p className="text-[#232b36]" style={{fontSize: '17px'}}>El objetivo es facilitar la movilidad interna de manera eficiente sin perder la sensación de inmersión en un entorno natural y cuidado.</p>
        </div>
        {/* Columna derecha: imagen */}
        <div className="w-full md:w-1/2 flex justify-center items-start mt-10 md:mt-0">
          <div className="w-full max-w-md aspect-[4/3] bg-slate-100 rounded-2xl border border-slate-100 shadow">
            <img src="/assets/images/07-urbanización.jpg" alt="Viales interiores y accesos con bajo impacto" className="object-cover w-full h-full rounded-2xl" />
          </div>
        </div>
      </div>
    </section>

    {/* Sección 08: Paisajismo y Reforestación */}
  <section className="w-full py-20 px-6 md:px-16 xl:px-32 bg-[#f6f7f9] flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Columna izquierda: imagen */}
        <div className="w-full md:w-1/2 flex justify-center items-start mb-10 md:mb-0">
          <div className="w-full max-w-md aspect-[4/3] bg-slate-100 rounded-2xl border border-slate-100 shadow">
            <img src="/assets/images/08-zonasverdes.png" alt="Zonas verdes y jardines del glamping" className="object-cover w-full h-full rounded-2xl" />
          </div>
        </div>
        {/* Columna derecha: texto */}
        <div className="w-full md:w-1/2 flex flex-col">
          <span className="text-[#b35427] font-bold tracking-widest text-sm uppercase block mb-2" style={{letterSpacing: '0.05em'}}>07. Paisajismo y Reforestación</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Regeneración ambiental y entorno continuo</h2>
          <p className="text-lg text-[#232b36] mb-4" style={{fontFamily: 'Barlow, sans-serif', fontSize: '17px'}}>
            El proyecto incorpora una extensa superficie destinada a ajardinamiento y reforestación, entendida como una herramienta clave para la integración paisajística y la regeneración ambiental.
          </p>
          <p className="text-[#232b36] mb-4" style={{fontSize: '17px'}}>Las zonas verdes configuran un entorno continuo, natural y cuidado, reforzando la experiencia inmersiva del glamping y su relación intrínseca con el paisaje de Barbate.</p>
          <p className="italic text-[#b35427]" style={{fontSize: '17px'}}>Se emplearán especies autóctonas que requieren un bajo consumo hídrico y que se integran naturalmente con el ecosistema local.</p>
        </div>
      </div>
    </section>
    {/* Sección 09: Servicio y pernocta de Autocaravanas */}
  <section className="w-full py-20 px-6 md:px-16 xl:px-32 bg-white flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Columna izquierda: texto */}
        <div className="w-full md:w-1/2 flex flex-col">
          <span className="text-[#b35427] font-bold tracking-widest text-sm uppercase block mb-2" style={{letterSpacing: '0.05em'}}>08. Áreas Específicas</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Servicio y pernocta de Autocaravanas</h2>
          <p className="text-lg text-[#232b36] mb-4" style={{fontFamily: 'Barlow, sans-serif', fontSize: '17px'}}>
            El proyecto contempla áreas específicas para la pernocta y servicio de autocaravanas, integradas de manera ordenada dentro del conjunto sin interferir en la experiencia general del complejo de glamping.
          </p>
          <div className="mb-2 font-bold text-[#232b36]" style={{fontSize: '17px'}}>Servicios Incluidos:</div>
          <ul className="list-disc pl-6 text-[#232b36] space-y-1" style={{fontSize: '17px'}}>
            <li>Parcelas delimitadas para autocaravanas.</li>
            <li>Muelle de servicios para abastecimiento y vaciado.</li>
            <li>Punto limpio integrado.</li>
          </ul>
        </div>
        {/* Columna derecha: imagen */}
        <div className="w-full md:w-1/2 flex justify-center items-start mt-10 md:mt-0">
          <div className="w-full max-w-md aspect-[4/3] bg-slate-100 rounded-2xl border border-slate-100 shadow">
            <img src="/assets/images/08-edificacionclave.jpg" alt="Edificación clave del conjunto" className="object-cover w-full h-full rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
    {/* Sección 10: Formulario de contacto */}
    <>
      <section id="contacto" className="w-full pt-10 pb-2 px-0 flex flex-col items-center">
        <Formulario />
      </section>
      <FoosterAlt />
    </>
  </main>
  );
}

export default Glamping;
