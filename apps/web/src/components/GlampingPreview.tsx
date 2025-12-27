import React from 'react';
import { Link } from 'react-router-dom';

const GlampingPreview: React.FC = () => {
  return (
    <section className="py-20 px-6 md:px-16 xl:px-32 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-[#f8fafc] md:bg-white rounded-3xl p-8 md:p-24 text-center border border-slate-200 shadow-sm md:shadow-2xl overflow-hidden group transition-all duration-500 hover:shadow-[#b35427]/10">
          {/* Decorative background element - Desktop only */}
          <div className="hidden md:block absolute inset-0 w-full h-full z-0">
             <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/90 z-10" />
             <img 
               src="/assets/images/Hero-Glamping.jpg" 
               alt="" 
               className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-700 transform group-hover:scale-105" 
             />
          </div>
          
          {/* Top bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#b35427] to-[#1db489] opacity-80 z-20"></div>
          
          {/* Header */}
          <div className="mb-4 md:mb-8 relative z-10 text-left md:text-center">
            <span className="inline-block text-[#b35427] font-bold text-sm uppercase tracking-widest border border-[#b35427]/30 px-4 py-1.5 rounded-full bg-[#b35427]/5 mb-6 md:mb-8 backdrop-blur-sm whitespace-nowrap">
              Proyecto en desarrollo
            </span>
            <h2 className="text-5xl md:text-8xl font-bold text-[#10141b] mb-2 md:mb-6 leading-none tracking-tight" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              Glamping 4<span className="text-[#b35427]">★</span> Barbate
            </h2>
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-12 relative z-10">
            <p className="text-[#232b36] leading-relaxed font-medium text-left md:text-center md:text-2xl md:leading-normal" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '20px' }}>
              Proyecto de glamping ecológico de gran escala en primera línea de playa, planificado como un desarrollo turístico de bajo impacto, donde la organización del conjunto, la movilidad y el paisaje estructuran la experiencia.
            </p>
          </div>

          {/* Features */}
          <div className="mb-14 relative z-10">
            <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 md:gap-4">
              {[
                "Alojamiento premium",
                "Servicios centralizados",
                "Zonas de ocio activo",
                "Movilidad sostenible",
                "Paisajismo ecológico",
                "Área de autocaravanas"
              ].map((feature, index) => (
                <span 
                  key={index}
                  className="px-2 md:px-4 py-2 bg-white md:bg-white/80 md:backdrop-blur border border-slate-200 rounded-full text-[#4b5563] font-medium text-xs md:text-lg shadow-sm hover:border-[#b35427]/30 transition-colors cursor-default flex items-center justify-center text-center"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="relative z-10">
            <Link 
              to="/es/glamping" 
              className="inline-block bg-[#b35427] hover:bg-[#a3471d] text-white py-4 px-12 rounded transition shadow-lg hover:shadow-xl hover:-translate-y-1 uppercase tracking-wide"
              style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, fontSize: '24px'}}
            >
              Conocer el proyecto
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlampingPreview;
