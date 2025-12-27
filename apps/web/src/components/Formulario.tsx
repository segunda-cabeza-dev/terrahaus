import React from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Formulario: React.FC<{ image?: string }> = ({ image }) => {
  return (
    <section className="w-full bg-[#ededed] py-0 px-0">
      <div className="w-full flex flex-col md:flex-row rounded-none overflow-hidden shadow-lg">
        {/* Imagen a la izquierda, pegada al borde */}
        <div className="md:w-1/2 w-full h-40 md:h-auto md:min-h-[500px]">
          <img 
            src="/assets/images/Formulario-casa-madera.jpg" 
            alt="Casa madera formulario" 
            className="object-cover w-full h-full" 
            style={{ minHeight: '100%', minWidth: '100%', display: 'block' }}
          />
        </div>
        {/* Formulario a la derecha, alineado a la izquierda */}
  <div className="md:w-1/2 w-full bg-[#ededed] flex flex-col justify-center p-6 md:p-24 px-6" style={{alignItems: 'flex-start'}}>
          <span className="text-[#b35427] font-normal uppercase tracking-wider mb-2" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1, fontSize: '22px'}}>¿Tienes preguntas?</span>
          <h2 className="text-black mb-6 font-normal w-full text-left" style={{fontFamily: 'Bebas Neue, sans-serif', lineHeight: 1.1, letterSpacing: 1, fontSize: '28px'}}>¡Ponte en contacto con nosotros!</h2>
          <form className="flex flex-col gap-3 w-full" style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 300, letterSpacing: 1}}>
            <input type="text" placeholder="Nombre" className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}} />
            <PhoneInput
              country={'es'}
              inputClass="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              buttonClass=""
              containerClass="w-full"
              placeholder="Teléfono"
              inputStyle={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1, width: '100%' }}
              dropdownStyle={{ fontFamily: 'Barlow, sans-serif' }}
            />
            <input type="email" placeholder="Email" className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}} />
            <input type="text" placeholder="Código postal" className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}} />
            <textarea placeholder="Cuéntanos que tienes en mente 💭" className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base" rows={4} style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}}></textarea>
            <button type="submit" className="bg-[#b35427] text-white px-8 py-3 rounded font-bold hover:bg-[#a3471d] transition mt-2 text-base" style={{fontFamily: 'Barlow, sans-serif', fontWeight: 700, letterSpacing: 1, fontSize: '16px'}}>Enviar</button>
          </form>
        </div>
      </div>
    </section>
  );
};


export default Formulario;
