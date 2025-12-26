    // ...existing code...
import React from "react";
import Header from "../components/Header";
import { FoosterAlt } from "../components/Fooster";
import Formulario from "../components/Formulario";
import { Link } from "react-router-dom";

const HeroGlamping: React.FC = () => (
  <section className="relative min-h-[90vh] flex flex-col font-sans bg-[#10141b] overflow-hidden pt-[120px] md:pt-[140px] pb-[80px] md:pb-[100px]">
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
  <div className="relative z-20 flex flex-col items-center justify-center text-white px-6 md:px-20 py-12 gap-6 max-w-3xl mx-auto w-full text-center">
      {/* Badge y logo */}
      <div className="flex items-center justify-center mb-1">
        <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white text-[#b35427] font-bold text-sm uppercase tracking-wide shadow-md" style={{marginBottom: '-0.5rem'}}>
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2a1 1 0 0 1 .894.553l1.382 2.803 3.09.45a1 1 0 0 1 .554 1.707l-2.236 2.18.528 3.08a1 1 0 0 1-1.451 1.054L10 12.347l-2.771 1.46A1 1 0 0 1 5.778 12.76l.528-3.08-2.236-2.18a1 1 0 0 1 .554-1.707l3.09-.45L9.106 2.553A1 1 0 0 1 10 2Z" fill="#b35427"/></svg>
          EN EJECUCIÓN
        </span>
      </div>
      {/* Título */}
      <h1 className="text-[2.7rem] md:text-[3.5rem] leading-tight font-bold tracking-tight mb-0 flex flex-wrap items-center justify-center gap-2" style={{fontFamily: 'Bebas Neue, sans-serif', color: '#fff'}}>
        GLAMPING 4<span className="inline-block align-super text-[2.2rem] md:text-[2.7rem] text-[#b35427]">★</span> <span style={{color: '#b35427'}}>&nbsp;BARBATE</span>
      </h1>
      {/* Descripción */}
      <div className="text-lg md:text-xl font-medium mb-2" style={{fontFamily: 'Barlow, sans-serif', color: '#e6e6e6'}}>
        Gestión y ejecución de complejo turístico ecológico a gran escala.
      </div>
      {/* Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl mx-auto mb-2">
        {/* Ubicación */}
  <div className="flex flex-col items-center justify-center bg-[#19212b] rounded-2xl py-6 shadow border border-[#1ec28b]/20">
          <span className="text-[#1ec28b] mb-3 flex items-center justify-center">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.05 10.74 7.36 10.97a1 1 0 0 0 1.28 0C13.95 21.74 21 16.25 21 11c0-4.97-4.03-9-9-9Zm0 17.88C9.14 17.07 5 13.61 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7c0 2.61-4.14 6.07-7 8.88ZM12 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="#1ec28b"/></svg>
          </span>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs text-[#b6c7c7] font-semibold uppercase">Ubicación</div>
            <div className="text-base text-white font-bold">Barbate, Cádiz</div>
          </div>
        </div>
  {/* Escala */}
  <div className="flex flex-col items-center justify-center bg-[#19212b] rounded-2xl py-6 px-6 shadow border border-[#1ec28b]/20">
          <span className="text-[#1ec28b] mb-3 flex items-center justify-center">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M4 17v2h16v-2H4Zm0-5v2h16v-2H4Zm0-5v2h16V7H4Z" fill="#1ec28b"/></svg>
          </span>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs text-[#b6c7c7] font-semibold uppercase">Escala</div>
            <div className="text-base text-white font-bold whitespace-nowrap">55 Aloj. / 1.500m²</div>
          </div>
        </div>
        {/* Tipo */}
  <div className="flex flex-col items-center justify-center bg-[#19212b] rounded-2xl py-6 shadow border border-[#1ec28b]/20">
          <span className="text-[#1ec28b] mb-3 flex items-center justify-center">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 17.93V20h-2v-.07A8.001 8.001 0 0 1 4.07 13H6v-2H4.07A8.001 8.001 0 0 1 11 4.07V4h2v.07A8.001 8.001 0 0 1 19.93 11H18v2h1.93A8.001 8.001 0 0 1 13 19.93ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" fill="#1ec28b"/></svg>
          </span>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs text-[#b6c7c7] font-semibold uppercase">Tipo</div>
            <div className="text-base text-white font-bold">Eco-Sostenible</div>
          </div>
        </div>
        {/* Estado */}
  <div className="flex flex-col items-center justify-center bg-[#19212b] rounded-2xl py-6 shadow border border-[#1ec28b]/20">
          <span className="text-[#1ec28b] mb-3 flex items-center justify-center">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V5h14v14ZM7 7h10v2H7V7Zm0 4h7v2H7v-2Zm0 4h10v2H7v-2Z" fill="#1ec28b"/></svg>
          </span>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs text-[#b6c7c7] font-semibold uppercase">Estado</div>
            <div className="text-base text-white font-bold">Fase de Inicio</div>
          </div>
        </div>
      </div>
      {/* Botón */}
      <Link to="/es/contacto">
        <button className="px-8 py-3 rounded bg-[#b35427] text-white font-bold text-lg uppercase tracking-wide hover:bg-[#a3471d] transition" style={{fontFamily: 'Barlow, sans-serif', letterSpacing: '0.08em'}}>
          Contáctanos
        </button>
      </Link>
    </div>
  </section>
);


const Glamping: React.FC = () => (
  <main className="bg-white min-h-screen flex flex-col">
    <HeroGlamping />

    {/* Sección 01: El Proyecto */}
    <section className="w-full py-20 px-4 md:px-0 bg-white flex flex-col items-center">
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b]" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '35px'}}>Un ecosistema turístico completo</h2>
          <div className="text-[#232b36] space-y-4" style={{fontFamily: 'Barlow, sans-serif', fontSize: '17px'}}>
            <p style={{fontSize: '17px'}}>El Glamping 4★ Barbate es un proyecto turístico de gran envergadura que nace con el objetivo de ofrecer una nueva forma de alojamiento en entornos naturales.</p>
            <p style={{fontSize: '17px'}}>El proyecto combina arquitectura, paisaje y sostenibilidad, apostando por un modelo de desarrollo respetuoso con el entorno, de bajo impacto sobre el terreno y con una clara vocación regenerativa.</p>
            <p style={{fontSize: '17px'}}>No se trata únicamente de alojamiento, sino de crear un ecosistema turístico completo, donde el visitante pueda disfrutar de confort, naturaleza y servicios de calidad en un entorno cuidado e integrado.</p>
          </div>
        </div>
      </div>
    </section>


    {/* Sección 02: Concepto y Enfoque */}
    <section className="w-full py-20 px-4 md:px-0 bg-[#f6f7f9] flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Texto izquierda */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <span className="text-[#b35427] font-bold text-sm uppercase" style={{letterSpacing: '0.05em'}}>02. Concepto y Enfoque</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#10141b]" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '35px'}}>Adaptación estética y técnica al entorno</h2>
          <div className="text-lg text-[#232b36] space-y-4" style={{fontFamily: 'Barlow, sans-serif'}}>
            <p>El diseño del Glamping 4★ Barbate se inspira en la estética y el espíritu de los glampings tailandeses, adaptados a los sistemas constructivos y normativos europeos.</p>
            <ul className="space-y-3 mt-4">
              <li><span className="font-bold text-[#10141b]">Intervención mínima:</span> Adaptándose a la topografía natural, utilizando cimentación no invasiva.</li>
              <li><span className="font-bold text-[#10141b]">Integración paisajística:</span> Respetando la identidad del lugar y utilizando vegetación autóctona.</li>
              <li><span className="font-bold text-[#10141b]">Experiencia inmersiva:</span> Priorizando el contacto directo y visual con la naturaleza.</li>
            </ul>
            <p>El resultado es un complejo que prioriza el equilibrio entre desarrollo, entorno y experiencia del usuario.</p>
          </div>
        </div>
        {/* Imagen derecha (placeholder) */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md aspect-[4/3] bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xl font-bold border border-slate-100">
            Imagen aquí
          </div>
        </div>
      </div>
    </section>

    {/* Sección 03: Organización General del Conjunto */}
    <section className="w-full py-20 px-4 bg-white flex flex-col items-center">
      <div className="max-w-4xl mx-auto text-center mb-12">
  <span className="text-[#b35427] font-bold text-sm uppercase" style={{letterSpacing: '0.05em'}}>03. Organización General del Conjunto</span>
  <h2 className="text-2xl md:text-3xl font-bold text-[#10141b] mt-2 mb-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '35px'}}>Distribución funcional y bajo impacto</h2>
        <p className="text-lg text-[#232b36]" style={{fontFamily: 'Barlow, sans-serif'}}>
          <span style={{fontSize: '17px'}}>El complejo se organiza en distintas áreas funcionales claramente diferenciadas, permitiendo un funcionamiento eficiente y una experiencia fluida para los usuarios.</span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        {/* Tarjeta 1: Alojamiento */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all">
          {/* Casa */}
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3"><path d="M3 11.5L12 5l9 6.5V19a2 2 0 0 1-2 2h-2v-5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v5H5a2 2 0 0 1-2-2V11.5Z" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="text-xl font-bold text-[#232b36]">Alojamiento</div>
        </div>
        {/* Tarjeta 2: Comunitarios */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all">
          {/* Edificio */}
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#b35427" strokeWidth="1.5"/><rect x="7" y="3" width="10" height="4" rx="1" stroke="#b35427" strokeWidth="1.5"/></svg>
          <div className="text-xl font-bold text-[#232b36]">Comunitarios</div>
        </div>
        {/* Tarjeta 3: Ocio / Recreación */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all">
          {/* Olas */}
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3"><path d="M4 16c1.333-2 2.667-2 4 0s2.667 2 4 0 2.667-2 4 0 2.667 2 4 0" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <div className="text-xl font-bold text-[#232b36]">Ocio / Recreación</div>
        </div>
        {/* Tarjeta 4: Movilidad */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all">
          {/* Auto */}
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3"><path d="M3 17v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2M7 17v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="text-xl font-bold text-[#232b36]">Movilidad</div>
        </div>
        {/* Tarjeta 5: Reforestación */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all">
          {/* Hoja */}
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3"><path d="M5 21c2-6 7-10 14-10a1 1 0 0 1 1 1c0 7-5 11-11 11a1 1 0 0 1-1-1Z" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 21c0-7 5-11 11-11" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <div className="text-xl font-bold text-[#232b36]">Reforestación</div>
        </div>
        {/* Tarjeta 6: Autocaravanas */}
        <div className="flex flex-col items-center justify-center bg-[#f6f7f9] rounded-2xl py-10 px-4 shadow-sm border border-[#e6e8ec] transition-all">
          {/* Mapa */}
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-3"><path d="M9 20l-5-2.5V5l5 2.5M9 20l6-3M9 20V7.5M15 17V4l5-2.5v12.5l-5 3ZM9 7.5l6-3" stroke="#b35427" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="text-xl font-bold text-[#232b36]">Autocaravanas</div>
        </div>
      </div>
    </section>

    {/* Sección 04: Área de Alojamientos */}
    <section className="w-full py-20 px-4 md:px-0 bg-[#f6f7f9] flex flex-col items-center">
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Texto izquierda */}
        <div className="w-full md:w-3/5 flex flex-col gap-6">
          <span className="text-[#b35427] font-bold text-sm uppercase" style={{letterSpacing: '0.05em'}}>04. Área de Alojamientos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] leading-tight" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '35px'}}>Bungalós y cabañas prefabricadas</h2>
          <p className="text-lg text-[#232b36]" style={{fontFamily: 'Barlow, sans-serif'}}>
            <span style={{fontSize: '17px'}}>El proyecto contempla la ejecución de 55 alojamientos prefabricados tipo bungaló-cabaña, concebidos como unidades independientes e integradas en el entorno natural.</span>
          </p>
          {/* Datos Técnicos */}
          <div className="bg-white rounded-2xl p-6 mt-2 mb-4 shadow border border-[#e6e8ec] flex flex-col gap-4">
            <div className="font-bold text-xl text-[#232b36] mb-2">Datos Técnicos</div>
            <div className="flex gap-8 flex-wrap">
              <div className="flex flex-col items-start">
                <span className="text-3xl md:text-4xl font-bold text-[#b35427]">55</span>
                <span className="uppercase text-xs text-[#7a7a7a] font-semibold tracking-wider">Unidades</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-3xl md:text-4xl font-bold text-[#b35427]">1.500m²</span>
                <span className="uppercase text-xs text-[#7a7a7a] font-semibold tracking-wider">Construidos</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-3xl md:text-4xl font-bold text-[#b35427]">70m²</span>
                <span className="uppercase text-xs text-[#7a7a7a] font-semibold tracking-wider">Media/aloj.</span>
              </div>
            </div>
          </div>
          {/* Lista de ventajas */}
          <ul className="space-y-3 mt-2">
            <li className="flex items-start gap-2"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f3edea"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#b35427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Prioriza la privacidad del huésped y el confort interior.</span></li>
            <li className="flex items-start gap-2"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f3edea"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#b35427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Fomenta la relación directa con el exterior y el paisaje.</span></li>
            <li className="flex items-start gap-2"><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#f3edea"/><path d="M8 12.5l2.5 2.5L16 9" stroke="#b35427" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="text-[#232b36] text-base" style={{fontSize: '17px'}}>Disposición que minimiza el impacto visual y físico sobre el terreno.</span></li>
          </ul>
        </div>
        {/* Imagen derecha */}
        <div className="w-full md:w-2/5 flex justify-center mt-10 md:mt-0">
          <img
            src="/assets/images/04-alojamientos.jpg"
            alt="Área de Alojamientos Glamping"
            className="w-full max-w-[320px] aspect-[4/3] object-cover rounded-2xl border border-slate-100 shadow"
          />
        </div>
      </div>
    </section>
    {/* Sección 05: Edificios Comunitarios y Servicios */}
    <section className="w-full py-20 px-4 bg-white flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Columna izquierda: lista de edificaciones */}
        <div className="w-full md:w-1/2">
          <span className="text-[#b35427] font-bold text-sm uppercase block mb-2" style={{letterSpacing: '0.05em'}}>05. Edificios Comunitarios y Servicios</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-2" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '35px'}}>El corazón funcional del complejo</h2>
          <p className="text-lg text-[#232b36] mb-8" style={{fontFamily: 'Barlow, sans-serif'}}>
            <span style={{fontSize: '17px'}}>El complejo incorpora una serie de edificaciones destinadas a garantizar el correcto funcionamiento y ofrecer una experiencia completa a los usuarios.</span>
          </p>
          <div className="mb-4">
            <div className="font-bold text-lg text-[#232b36] mb-2">Edificaciones Clave</div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 bg-[#f6f7f9] rounded-xl p-4 border border-[#e6e8ec]">
                <span className="mt-1"><svg width='22' height='22' fill='none' viewBox='0 0 24 24'><rect x='3' y='7' width='18' height='13' rx='2' stroke='#b35427' strokeWidth='1.5'/><rect x='7' y='3' width='10' height='4' rx='1' stroke='#b35427' strokeWidth='1.5'/></svg></span>
                <div><span className="font-bold text-[#232b36]">Recepción y Administración</span><br /><span className="text-[#7a7a7a] text-sm">Edificio de acceso, recepción y administración centralizada.</span></div>
              </li>
              <li className="flex items-start gap-3 bg-[#f6f7f9] rounded-xl p-4 border border-[#e6e8ec]">
                <span className="mt-1"><svg width='22' height='22' fill='none' viewBox='0 0 24 24'><rect x='4' y='11' width='16' height='7' rx='2' stroke='#b35427' strokeWidth='1.5'/><rect x='7' y='6' width='10' height='5' rx='1' stroke='#b35427' strokeWidth='1.5'/></svg></span>
                <div><span className="font-bold text-[#232b36]">Logística y Almacén</span><br /><span className="text-[#7a7a7a] text-sm">Almacén y cuartos de instalaciones técnicas necesarias.</span></div>
              </li>
              <li className="flex items-start gap-3 bg-[#f6f7f9] rounded-xl p-4 border border-[#e6e8ec]">
                <span className="mt-1"><svg width='22' height='22' fill='none' viewBox='0 0 24 24'><circle cx='12' cy='12' r='8' stroke='#b35427' strokeWidth='1.5'/><rect x='9' y='9' width='6' height='6' rx='1' stroke='#b35427' strokeWidth='1.5'/></svg></span>
                <div><span className="font-bold text-[#232b36]">Aseos Generales</span><br /><span className="text-[#7a7a7a] text-sm">Aseos generales colectivos distribuidos estratégicamente.</span></div>
              </li>
              <li className="flex items-start gap-3 bg-[#f6f7f9] rounded-xl p-4 border border-[#e6e8ec]">
                <span className="mt-1"><svg width='22' height='22' fill='none' viewBox='0 0 24 24'><rect x='4' y='11' width='16' height='7' rx='2' stroke='#b35427' strokeWidth='1.5'/><path d='M8 11V7a4 4 0 1 1 8 0v4' stroke='#b35427' strokeWidth='1.5'/></svg></span>
                <div><span className="font-bold text-[#232b36]">Bar y Supermercado</span><br /><span className="text-[#7a7a7a] text-sm">Servicios de Bar y Supermercado integrados.</span></div>
              </li>
              <li className="flex items-start gap-3 bg-[#f6f7f9] rounded-xl p-4 border border-[#e6e8ec]">
                <span className="mt-1"><svg width='22' height='22' fill='none' viewBox='0 0 24 24'><rect x='4' y='11' width='16' height='7' rx='2' stroke='#b35427' strokeWidth='1.5'/><path d='M12 11V7a4 4 0 0 1 8 0v4' stroke='#b35427' strokeWidth='1.5'/></svg></span>
                <div><span className="font-bold text-[#232b36]">Club Social y Juegos</span><br /><span className="text-[#7a7a7a] text-sm">Salón de juegos y club social para el encuentro.</span></div>
              </li>
            </ul>
          </div>
        </div>
        {/* Columna derecha: solo bloque destacado centrado */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-10 md:mt-0">
          <div className="bg-[#10141b] text-white rounded-xl p-5 shadow-lg max-w-md w-full text-center">
            <div className="font-bold text-[#1ec28b] mb-1">El Restaurante</div>
            <div className="text-sm">Se concibe como uno de los elementos centrales, con fuerte conexión visual y funcional con el entorno natural.</div>
          </div>
        </div>
      </div>
    </section>

    {/* Sección 06: Espacios Exteriores y Zonas de Ocio */}
    <section className="w-full py-20 px-4 bg-[#f6f7f9] flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Columna izquierda: imagen y título */}
        <div className="w-full md:w-2/3 flex flex-col">
          <span className="text-[#b35427] font-bold text-sm uppercase block mb-2" style={{letterSpacing: '0.05em'}}>06. Espacios Exteriores y Zonas de Ocio</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-2" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '35px'}}>Disfrute, actividad y descanso en la naturaleza</h2>
          <p className="text-lg text-[#232b36] mb-8" style={{fontFamily: 'Barlow, sans-serif', fontSize: '17px'}}>
            Una parte fundamental del proyecto se destina a espacios exteriores pensados para el disfrute, la actividad y el descanso, reforzando el carácter vacacional del complejo.
          </p>
          <div className="bg-white rounded-2xl shadow-md p-6 flex items-center min-h-[220px]">
            <img src="/assets/images/06-exteriores.jpg" alt="Piscina central y áreas deportivas" className="rounded-xl w-40 h-32 object-cover mr-6" />
            <span className="text-[#232b36] text-lg font-medium">Piscina central y áreas deportivas</span>
          </div>
        </div>
        {/* Columna derecha: lista de espacios */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 mt-10 md:mt-24">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <span><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 17c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/><path d="M3 13c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/><path d="M3 9c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/></svg></span>
            <span className="font-bold text-[#232b36]" style={{fontSize: '17px'}}>Piscina de adultos y solárium</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <span><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 17c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/><path d="M3 13c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/><path d="M3 9c1.5-1 4.5-3 9-3s7.5 2 9 3" stroke="#b35427" strokeWidth="1.5"/></svg></span>
            <span className="font-bold text-[#232b36]" style={{fontSize: '17px'}}>Piscina infantil</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <span><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="#b35427" strokeWidth="1.5"/><path d="M8 16l8-8M8 8l8 8" stroke="#b35427" strokeWidth="1.5"/></svg></span>
            <span className="font-bold text-[#232b36]" style={{fontSize: '17px'}}>Pista deportiva y circuito</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <span><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2v20" stroke="#b35427" strokeWidth="1.5"/><circle cx="12" cy="17" r="5" stroke="#b35427" strokeWidth="1.5"/></svg></span>
            <span className="font-bold text-[#232b36]" style={{fontSize: '17px'}}>Parque infantil</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <span><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.5 11 9 11s9-5.75 9-11c0-4.97-4.03-9-9-9z" stroke="#b35427" strokeWidth="1.5"/><path d="M12 7v4l3 3" stroke="#b35427" strokeWidth="1.5"/></svg></span>
            <span className="font-bold text-[#232b36]" style={{fontSize: '17px'}}>Zonas ajardinadas y descanso</span>
          </div>
        </div>
      </div>
    </section>

    {/* Sección 07: Movilidad interna */}
    <section className="w-full py-20 px-4 bg-white flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Columna izquierda: texto */}
        <div className="w-full md:w-1/2 flex flex-col">
          <span className="text-[#b35427] font-bold tracking-widest text-sm uppercase block mb-2" style={{letterSpacing: '0.05em'}}>07. Urbanización y Accesos</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '35px'}}>Movilidad interna: priorizando al peatón</h2>
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
          <div className="w-full max-w-md aspect-[4/3] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-base font-medium border border-slate-100 shadow">
            <img src="/assets/images/viales-placeholder.jpg" alt="Viales interiores y accesos con bajo impacto" className="object-cover w-full h-full rounded-2xl" />
            Viales interiores y accesos con bajo impacto
          </div>
        </div>
      </div>
    </section>

    {/* Sección 08: Paisajismo y Reforestación */}
    <section className="w-full py-20 px-4 bg-[#f6f7f9] flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Columna izquierda: imagen */}
        <div className="w-full md:w-1/2 flex justify-center items-start mb-10 md:mb-0">
          <div className="w-full max-w-md aspect-[4/3] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-base font-medium border border-slate-100 shadow">
            <img src="/assets/images/jardines-placeholder.jpg" alt="Zonas verdes y jardines del glamping" className="object-cover w-full h-full rounded-2xl" />
            Zonas verdes y jardines del glamping
          </div>
        </div>
        {/* Columna derecha: texto */}
        <div className="w-full md:w-1/2 flex flex-col">
          <span className="text-[#b35427] font-bold tracking-widest text-sm uppercase block mb-2" style={{letterSpacing: '0.05em'}}>08. Paisajismo y Reforestación</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '35px'}}>Regeneración ambiental y entorno continuo</h2>
          <p className="text-lg text-[#232b36] mb-4" style={{fontFamily: 'Barlow, sans-serif', fontSize: '17px'}}>
            El proyecto incorpora una extensa superficie destinada a ajardinamiento y reforestación, entendida como una herramienta clave para la integración paisajística y la regeneración ambiental.
          </p>
          <p className="text-[#232b36] mb-4" style={{fontSize: '17px'}}>Las zonas verdes configuran un entorno continuo, natural y cuidado, reforzando la experiencia inmersiva del glamping y su relación intrínseca con el paisaje de Barbate.</p>
          <p className="italic text-[#b35427]" style={{fontSize: '17px'}}>Se emplearán especies autóctonas que requieren un bajo consumo hídrico y que se integran naturalmente con el ecosistema local.</p>
        </div>
      </div>
    </section>
    {/* Sección 09: Servicio y pernocta de Autocaravanas */}
    <section className="w-full py-20 px-4 bg-white flex flex-col items-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Columna izquierda: texto */}
        <div className="w-full md:w-1/2 flex flex-col">
          <span className="text-[#b35427] font-bold tracking-widest text-sm uppercase block mb-2" style={{letterSpacing: '0.05em'}}>09. Áreas Específicas</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#10141b] mb-4" style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: '35px'}}>Servicio y pernocta de Autocaravanas</h2>
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
          <div className="w-full max-w-md aspect-[4/3] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-base font-medium border border-slate-100 shadow">
            <img src="/assets/images/autocaravanas-placeholder.jpg" alt="Zona de aparcamiento y servicio para autocaravanas" className="object-cover w-full h-full rounded-2xl" />
            Zona de aparcamiento y servicio para autocaravanas
          </div>
        </div>
      </div>
    </section>
    {/* Sección 10: Formulario de contacto */}
    <section className="w-full py-20 px-4 bg-[#f6f7f9] flex flex-col items-center">
      <Formulario />
    </section>
    <FoosterAlt />
  </main>
);

export default Glamping;
