// ...existing code...
import React from "react";
import Header from "../components/Header";
import { FoosterAlt } from "../components/Fooster";
import Formulario from "../components/Formulario";

const HeroGlamping: React.FC = () => (
  <section className="relative min-h-[80vh] flex flex-col justify-center font-sans bg-[#10141b] overflow-hidden pb-10">
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
  <div className="relative z-20 flex flex-col items-center justify-center text-white px-6 md:px-20 pb-12 pt-32 md:pt-48 gap-6 max-w-5xl mx-auto w-full text-center">
      {/* Título */}
  <h1 className="text-[4.2rem] md:text-[75px] leading-tight font-bold tracking-wider mb-1 flex flex-wrap items-center justify-center gap-2" style={{fontFamily: 'Bebas Neue, sans-serif', color: '#fff', letterSpacing: '0.04em'}}>
        <span className="hidden md:flex items-center justify-center w-full text-center gap-2 leading-[1.05]">
          GLAMPING
          <span className="ml-2">4</span>
          <span className="inline-block align-super text-[2.2rem] text-[#b35427]">★</span>
          BARBATE
        </span>
        <span className="flex md:hidden flex-col items-center w-full text-center leading-[1.05]">
          <span>GLAMPING</span>
          <span className="flex items-center justify-center gap-1 mt-[-0.7rem]">
            <span className="text-[4.2rem]">4</span>
            <span className="inline-block align-super text-[1.6rem] text-[#b35427]">★</span>
            <span className="text-[4.2rem]">BARBATE</span>
          </span>
        </span>
      </h1>
      {/* Descripción */}
      <div className="text-lg md:text-xl font-medium mb-4 -mt-2 px-4" style={{fontFamily: 'Barlow, sans-serif', color: '#e6e6e6'}}>
        <span className="whitespace-normal md:whitespace-nowrap block max-w-xs mx-auto md:max-w-none leading-snug">Proyecto de glamping ecológico de gran escala en primera línea de playa, Cádiz</span>
      </div>
      {/* Tarjetas 2x2 - Diseño Premium */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-fit mx-auto mt-2">
  <div className="group flex items-center justify-start gap-4 bg-white/5 backdrop-blur-md rounded-2xl py-5 px-4 border border-white/10 hover:border-[#b35427]/50 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-[#b35427]/20 min-w-[320px]">
          <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">🏡</span>
          <span className="text-lg font-medium text-white tracking-wide">Alojamiento integrado</span>
        </div>
        <div className="group flex items-center justify-start gap-4 bg-white/5 backdrop-blur-md rounded-2xl py-5 px-6 border border-white/10 hover:border-[#b35427]/50 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-[#b35427]/20">
          <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">🧭</span>
          <span className="text-lg font-medium text-white tracking-wide">Servicios centralizados</span>
        </div>
        <div className="group flex items-center justify-start gap-4 bg-white/5 backdrop-blur-md rounded-2xl py-5 px-6 border border-white/10 hover:border-[#b35427]/50 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-[#b35427]/20">
          <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">🏊</span>
          <span className="text-lg font-medium text-white tracking-wide whitespace-nowrap">Ocio y recreación al aire libre</span>
        </div>
        <div className="group flex items-center justify-start gap-4 bg-white/5 backdrop-blur-md rounded-2xl py-5 px-6 border border-white/10 hover:border-[#b35427]/50 hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-[#b35427]/20">
          <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">🌿</span>
          <span className="text-lg font-medium text-white tracking-wide">Paisajismo sostenible</span>
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
        <div className="max-w-6xl w-full mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Imagen izquierda */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md aspect-[4/3] bg-slate-200 rounded-2xl flex items-center justify-center border border-slate-100 shadow overflow-hidden">
            <video
              src="/assets/videos/Rendervideo.mp4"
              controls
              className="w-full h-full object-cover rounded-2xl"
              poster="/assets/images/01-elproyecto.jpg"
              preload="auto"
            />
          </div>
        </div>
        {/* Texto derecha */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <span className="text-[#b35427] font-bold text-sm uppercase" style={{letterSpacing: '0.05em'}}>01. El Proyecto</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b]" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Un ecosistema turístico integrado</h2>
          <div className="text-[#232b36] space-y-4" style={{fontFamily: 'Barlow, sans-serif', fontSize: '17px'}}>
            <p style={{fontSize: '17px'}}>Glamping 4★ Barbate es un proyecto turístico ecológico de gran escala que integra alojamiento, servicios, ocio y paisaje en un entorno natural cuidadosamente diseñado.</p>
            <ul className="list-none pl-0 mt-2 text-base md:text-lg" style={{color:'#232b36'}}>
              <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span> Arquitectura integrada al entorno</li>
              <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span> Servicios y espacios comunitarios centralizados</li>
              <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span> Experiencia inmersiva en contacto con la naturaleza</li>
            </ul>
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
          <h2 className="text-2xl md:text-3xl font-bold text-[#10141b]" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Diseño adaptado al entorno natural</h2>
          <div className="text-lg text-[#232b36] space-y-4" style={{fontFamily: 'Barlow, sans-serif'}}>
            <div className="mb-2">
              <span className="font-bold text-[#b35427]">Intervención mínima</span>
              <p className="mt-1">Adaptación a la topografía natural y uso de soluciones no invasivas.</p>
            </div>
            <div className="mb-2">
              <span className="font-bold text-[#b35427]">Integración paisajística</span>
              <p className="mt-1">Respeto por la identidad del lugar y empleo de vegetación autóctona.</p>
            </div>
            <div className="mb-2">
              <span className="font-bold text-[#b35427]">Experiencia inmersiva</span>
              <p className="mt-1">Relación directa y visual del usuario con el entorno natural.</p>
            </div>
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
          <p className="text-sm text-[#6b7280] mt-2 text-center" style={{fontFamily:'Barlow, sans-serif'}}>55 bungalós y cabañas integradas en el paisaje</p>
        </div>
        {/* Tarjeta 2: Comunitarios (Edificio) */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3">
            <path d="M3 21V10l9-6 9 6v11" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21v-6h6v6" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="10" y="10" width="4" height="3" stroke="#b35427" strokeWidth="1.2"/>
            <path d="M1 21h22" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="text-xl font-bold text-[#232b36]">Comunitarios</div>
          <p className="text-sm text-[#6b7280] mt-2 text-center" style={{fontFamily:'Barlow, sans-serif'}}>Recepción, restaurante, bar, club social y supermercado</p>
        </div>
        {/* Tarjeta 3: Ocio / Recreación */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3"><path d="M3 17c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/><path d="M3 13c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/><path d="M3 9c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/></svg>
          <div className="text-xl font-bold text-[#232b36]">Ocio / Recreación</div>
          <p className="text-sm text-[#6b7280] mt-2 text-center" style={{fontFamily:'Barlow, sans-serif'}}>Piscinas, solárium, circuito deportivo y parque infantil</p>
        </div>
        {/* Tarjeta 4: Movilidad (Auto) */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3">
            <path d="M3 15.5V14a2 2 0 0 1 2-2h2.5l2-2.5A2 2 0 0 1 11.5 8h3A2 2 0 0 1 16 9.5l1.5 2H19a2 2 0 0 1 2 2v2.5" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6.5" cy="16.5" r="1.5" stroke="#b35427" strokeWidth="1.5"/>
            <circle cx="17.5" cy="16.5" r="1.5" stroke="#b35427" strokeWidth="1.5"/>
          </svg>
          <div className="text-xl font-bold text-[#232b36]">Movilidad</div>
          <p className="text-sm text-[#6b7280] mt-2 text-center" style={{fontFamily:'Barlow, sans-serif'}}>Circulación clara y prioridad peatonal</p>
        </div>
        {/* Tarjeta 5: Reforestación (Hoja) */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3">
            <path d="M4 18C4 10 16 3 20 12C21 15 18 20 10 20C7 20 4 19 4 18Z" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17C9.5 15 13 13 16 14" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div className="text-xl font-bold text-[#232b36]">Reforestación</div>
          <p className="text-sm text-[#6b7280] mt-2 text-center" style={{fontFamily:'Barlow, sans-serif'}}>Zonas verdes continuas y ajardinamiento integrado</p>
        </div>
        {/* Tarjeta 6: Autocaravanas (Camión) */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3">
            <rect x="2" y="8" width="16" height="9" rx="2" stroke="#b35427" strokeWidth="1.5" fill="#fff"/>
            <rect x="18" y="13" width="3" height="4" rx="1" stroke="#b35427" strokeWidth="1.5" fill="#fff"/>
            <circle cx="6" cy="17" r="2" fill="#b35427" stroke="#b35427" strokeWidth="1.2"/>
            <circle cx="16" cy="17" r="2" fill="#b35427" stroke="#b35427" strokeWidth="1.2"/>
            <rect x="4" y="10" width="4" height="3" rx="0.5" fill="#b35427" opacity="0.2" />
            <rect x="10" y="10" width="4" height="3" rx="0.5" fill="#b35427" opacity="0.2" />
            <rect x="10" y="13" width="5" height="2" rx="0.5" fill="#b35427" opacity="0.3" />
            <rect x="14" y="11" width="2" height="2" rx="0.5" fill="#b35427" opacity="0.5" />
            <rect x="17" y="15" width="2" height="1" rx="0.5" fill="#b35427" opacity="0.5" />
          </svg>
          <div className="text-xl font-bold text-[#232b36]">Autocaravanas</div>
          <p className="text-sm text-[#6b7280] mt-2 text-center" style={{fontFamily:'Barlow, sans-serif'}}>Área específica de pernocta y servicios</p>
        </div>
      </div>
    </section>

    {/* Sección 04: Área de Alojamientos */}
  <section className="w-full py-20 px-6 md:px-16 xl:px-32 bg-[#f6f7f9] flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Texto izquierda */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
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
        <ul className="list-none pl-0 text-[#232b36] space-y-1" style={{fontSize: '17px'}}>
          <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Unidades independientes integradas en el entorno</span></li>
          <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Prioridad en privacidad y confort interior</span></li>
          <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Relación directa con el exterior and el paisaje</span></li>
          <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Implantación que minimiza impacto visual y físico</span></li>
        </ul>
      </div>
      {/* Imagen derecha */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="w-full max-w-md aspect-[4/3] bg-slate-100 rounded-2xl border border-slate-100 shadow">
          <div className="flex flex-col gap-4 w-full h-full justify-center items-center">
            <img
              src="/assets/images/04-alojamiento02.png"
              alt="Vista superior de alojamientos"
              className="w-full rounded-2xl border border-slate-200 shadow object-contain bg-white"
              style={{ maxHeight: 220 }}
            />
            <img
              src="/assets/images/04-alojamiento01.png"
              alt="Vista frontal de alojamientos"
              className="w-full rounded-2xl border border-slate-200 shadow object-contain bg-white"
              style={{ maxHeight: 220 }}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
    {/* Sección 05: Servicios centrales y ocio - REDISEÑO */}
    <section className="w-full py-16 px-6 md:px-16 xl:px-32 bg-white flex flex-col items-center">
  <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Imágenes izquierda */}
  <div className="flex flex-col items-center md:items-start gap-6 justify-center h-full order-last md:order-first">
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
            La zona central concentra los servicios y espacios de encuentro, actuando como núcleo social y funcional del glamping.
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Movilidad interna pensada para el peatón</h2>
          <p className="text-lg text-[#232b36] mb-4" style={{fontFamily: 'Barlow, sans-serif', fontSize: '17px'}}>
            La urbanización del complejo ha sido diseñada para garantizar un funcionamiento claro y ordenado, separando los flujos rodados de los recorridos peatonales.
          </p>
          <p className="text-[#232b36] mb-2" style={{fontSize: '17px'}}>El diseño de la movilidad interna se centra en:</p>
          <ul className="list-none pl-0 text-[#232b36] mb-4 space-y-1" style={{fontSize: '17px'}}>
            <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span> Separación de flujos rodados y peatonales</li>
            <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span> Recorridos tranquilos y seguros</li>
            <li className="flex items-center gap-2 mb-1"><span className="text-[#1db489] font-bold text-xl">›</span> Aparcamientos integrados al paisaje</li>
          </ul>
          <p className="text-[#232b36]" style={{fontSize: '17px'}}>Una movilidad eficiente sin perder la sensación de inmersión natural.</p>
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
      <div className="max-w-6xl w-full mx-auto flex flex-col-reverse md:flex-row gap-12 items-start">
        {/* Columna izquierda: imagen */}
        <div className="w-full md:w-1/2 flex justify-center items-start mb-10 md:mb-0">
          <div className="w-full max-w-md aspect-[4/3] bg-slate-100 rounded-2xl border border-slate-100 shadow">
            <img src="/assets/images/08-zonasverdes.png" alt="Zonas verdes y jardines del glamping" className="object-cover w-full h-full rounded-2xl" />
          </div>
        </div>
        {/* Columna derecha: texto */}
        <div className="w-full md:w-1/2 flex flex-col">
          <span className="text-[#b35427] font-bold tracking-widest text-sm uppercase block mb-2" style={{letterSpacing: '0.05em'}}>07. Paisajismo y Reforestación</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px'}}>Un entorno continuo integrado al paisaje de Barbate</h2>
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
            El complejo incorpora un área específica para autocaravanas, integrada sin interferir en la experiencia general del glamping.
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

    {/* Firma del Promotor */}
    <section className="w-full py-12 bg-white flex justify-center items-center px-6">
        <div className="text-center select-none border border-[#b35427]/40 rounded-lg px-10 py-4 bg-white/50">
            <span 
              className="block text-slate-700 text-base md:text-lg font-medium tracking-wide" 
              style={{ fontFamily: 'Barlow, sans-serif' }}
            >
              Promotor del proyecto: <strong className="font-bold text-slate-900">Promotora de Glamping 4★ Gran Lujo</strong>
            </span>
        </div>
    </section>

    {/* Sección 10: Formulario de contacto */}
    <>
  <section id="contacto" className="w-full pt-10 pb-0 px-0 flex flex-col items-center">
        <Formulario />
      </section>
      <FoosterAlt />
    </>
  </main>
  );
}

export default Glamping;
