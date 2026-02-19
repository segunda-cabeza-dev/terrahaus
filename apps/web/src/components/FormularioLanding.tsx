import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { img } from '../lib/assets';

type FormularioLandingProps = {
  reformType: string;
  source: string;
  subtitle?: string;
  title?: string;
  description?: string;
  messagePlaceholder?: string;
};

const FormularioLanding: React.FC<FormularioLandingProps> = ({
  reformType,
  source,
  subtitle = 'PRESUPUESTO GRATUITO',
  title = '¡Solicita tu presupuesto sin compromiso!',
  description = 'Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.',
  messagePlaceholder = 'Cuéntanos sobre tu proyecto 💭',
}) => {
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
          reformType,
          message: `CP: ${formData.postalCode}\n${formData.message}`,
          source,
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

  return (
    <section id="contacto" className="w-full bg-[#ededed] py-0 px-0">
      <div className="w-full flex flex-col md:flex-row rounded-none overflow-hidden shadow-lg">
        <div className="md:w-1/2 w-full h-40 md:h-auto md:min-h-[600px]">
          <img
            src={img('Formulario-casa-madera.webp')}
            alt={reformType}
            className="object-cover w-full h-full"
            style={{ minHeight: '100%', minWidth: '100%', display: 'block' }}
            loading="lazy"
          />
        </div>

        <div className="md:w-1/2 w-full bg-[#ededed] flex flex-col justify-center p-6 md:p-24 px-6" style={{ alignItems: 'flex-start' }}>
          <span className="text-[#b35427] font-normal uppercase tracking-wider mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: 1, fontSize: '22px' }}>
            {subtitle}
          </span>
          <h2 className="text-black mb-3 font-normal w-full text-left" style={{ fontFamily: 'Bebas Neue, sans-serif', lineHeight: 1.1, letterSpacing: 1, fontSize: '32px' }}>
            {title}
          </h2>
          <p className="text-gray-700 mb-6 text-left" style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px', fontWeight: 300 }}>
            {description}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded w-full text-sm">
              {error}
            </div>
          )}

          <form
            className="flex flex-col gap-3 w-full"
            style={{ fontFamily: 'Bebas Neue, sans-serif', fontWeight: 300, letterSpacing: 1 }}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Nombre completo *"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1 }}
            />
            <PhoneInput
              country={'es'}
              value={formData.phone}
              onChange={(phone) => setFormData({ ...formData, phone })}
              inputClass="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              buttonClass=""
              containerClass="w-full"
              placeholder="Teléfono *"
              inputStyle={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1, width: '100%' }}
              dropdownStyle={{ fontFamily: 'Barlow, sans-serif' }}
            />
            <input
              type="email"
              placeholder="Email *"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1 }}
            />
            <input
              type="text"
              placeholder="Código postal"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1 }}
            />
            <textarea
              placeholder={messagePlaceholder}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b35427] text-black placeholder:font-barlow text-base"
              rows={5}
              style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300, letterSpacing: 1 }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#b35427] text-white px-8 py-4 rounded font-bold hover:bg-[#a3471d] transition mt-2 text-base uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Bebas Neue, sans-serif', fontWeight: 400, letterSpacing: 1.5, fontSize: '18px' }}
            >
              {isSubmitting ? 'ENVIANDO...' : 'SOLICITAR PRESUPUESTO GRATUITO'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2" style={{ fontFamily: 'Barlow, sans-serif' }}>
              Al enviar este formulario aceptas nuestra política de privacidad
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormularioLanding;

