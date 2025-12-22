import React from "react";

const CTA: React.FC = () => {
  return (
    <section className="bg-black py-16 w-full">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <h2
          className="text-white mb-10"
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '45px',
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: 1.2
          }}
        >
          CALCULA EL PRESUPUESTO DE TU PROYECTO CON <br /> NUESTRA CALCULADORA
        </h2>
        <a
          href="#cost-calculator"
          className="inline-flex items-center gap-2 bg-[#b35427] hover:bg-[#a3471d] px-6 py-2 rounded transition text-white text-2xl"
          style={{ fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, letterSpacing: 1 }}
        >
          CALCULADORA
          <span className="text-2xl ml-1">→</span>
        </a>
      </div>
    </section>
  );
};

export default CTA;
