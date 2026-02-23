import React from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { img } from '../lib/assets';

const Formulario: React.FC<{ image?: string }> = ({ image }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    postalCode: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `CP: ${formData.postalCode}\n${formData.message}`,
          source: 'home',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar');
      }

      window.location.href = '/gracias';
    } catch {
      setError('Hubo un problema al enviar. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  const imageSrc =
    image && (image.startsWith('http') || image.startsWith('/')) ? image : img(image || 'Formulario-casa-madera.webp');

  return (
    <section className="w-full bg-[#ededed] py-0 px-0">
      <div className="w-full flex flex-col md:flex-row rounded-none overflow-hidden shadow-lg">
        {/* Imagen a la izquierda, pegada al borde */}
        <div className="md:w-1/2 w-full h-40 md:h-auto md:min-h-[500px]">
          <img 
            src={imageSrc} 
            alt="Casa madera formulario" 
            className="object-cover w-full h-full" 
            style={{ minHeight: '100%', minWidth: '100%', display: 'block' }}
            loading="lazy"
          />
        </div>
        {/* Formulario a la derecha, alineado a la izquierda */}
  <div className="md:w-1/2 w-full bg-[#ededed] flex flex-col justify-center p-6 md:p-24 px-6" style={{alignItems: 'flex-start'}}>
          <span className="text-[#b35427] font-normal uppercase tracking-wider mb-2" style={{fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1, fontSize: '22px'}}>¿Tienes preguntas?</span>
          <h2 className="text-black mb-6 font-normal w-full text-left" style={{fontFamily: 'Bebas Neue, sans-serif', lineHeight: 1.1, letterSpacing: 1, fontSize: '28px'}}>¡Ponte en contacto con nosotros!</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded w-full text-sm">
              {error}
            </div>
          )}
          
          <form 
            className="flex flex-col gap-3 w-full" 
            style={{fontFamily: 'Bebas Neue, sans-serif', fontWeight: 300, letterSpacing: 1}}
            onSubmit={handleSubmit}
          >
            <input 
              type="text" 
              placeholder="Nombre" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base" 
              style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}} 
            />
            <PhoneInput
              country={'es'}
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              inputClass="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              buttonClass=""
              containerClass="w-full"
              placeholder="Teléfono"
              inputStyle={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1, width: '100%' }}
              dropdownStyle={{ fontFamily: 'Barlow, sans-serif' }}
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base" 
              style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}} 
            />
            <input 
              type="text" 
              placeholder="Código postal" 
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base" 
              style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}} 
            />
            <textarea 
              placeholder="Cuéntanos que tienes en mente 💭" 
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base" 
              rows={4} 
              style={{fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1}}
            ></textarea>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#b35427] text-white px-8 py-3 rounded font-bold hover:bg-[#a3471d] transition mt-2 text-base disabled:opacity-50 disabled:cursor-not-allowed" 
              style={{fontFamily: 'Barlow, sans-serif', fontWeight: 700, letterSpacing: 1, fontSize: '16px'}}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};


export default Formulario;
