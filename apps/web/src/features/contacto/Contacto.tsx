import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@beltrame/shared/lib/supabase';

export default function Contacto() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono || null,
            mensaje: formData.mensaje
          }
        ]);

      if (error) throw error;

      // Éxito - limpiar formulario y mostrar mensaje
      setSubmitStatus('success');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error: any) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contacto-page">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-medium tracking-wider uppercase mb-4 text-black" style={{ fontSize: '16px' }}>
            {t('contact.subtitle')}
          </p>
          <h1 className="font-bold mb-4 text-[35px] md:text-[50px]" style={{ lineHeight: '1.1' }}>
            {t('contact.title')}
          </h1>
        </div>
      </section>

      {/* Contact Info and Form Section - Side by side */}
      <section className="pb-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
            
            {/* Left side - Contact Info Cards en grid 2x2 */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Dirección - Dirección en dos líneas */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-2">{t('contact.address')}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Carrer Riu Arno, 17<br />
                        Santa Eulalia del Río, Illes Balears
                      </p>
                    </div>
                  </div>
                </div>

                {/* Horario */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-2">{t('contact.hours')}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Lunes a Viernes<br />9:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-2">{t('contact.phone')}</h3>
                      <a href="tel:+34688860838" className="text-sm text-gray-700 hover:text-black">
                        +34 688 860 838
                      </a>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base mb-2">WhatsApp</h3>
                      <a href="https://wa.me/34688860838" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-black">
                        +34 688 860 838
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-sm text-gray-700">Redes Sociales</span>
                <div className="flex gap-3">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right side - Contact Form - Más angosto */}
            <div className="bg-gray-100 rounded-xl p-6 border border-gray-200 max-w-md mx-auto w-full">
              
              {/* Mensaje de éxito */}
              {submitStatus === 'success' && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900 text-sm mb-1">¡Mensaje enviado correctamente!</h4>
                    <p className="text-xs text-green-700">
                      Gracias por contactarnos. Te responderemos lo antes posible.
                    </p>
                  </div>
                </div>
              )}

              {/* Mensaje de error */}
              {submitStatus === 'error' && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm mb-1">Error al enviar el mensaje</h4>
                    <p className="text-xs text-red-700">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="nombre"
                  placeholder={t('contact.name')}
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-700 placeholder:text-gray-500 text-sm"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    name="email"
                    placeholder={t('contact.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-700 placeholder:text-gray-500 text-sm"
                  />

                  <input
                    type="tel"
                    name="telefono"
                    placeholder={t('contact.phonePlaceholder')}
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-700 placeholder:text-gray-500 text-sm"
                  />
                </div>

                <textarea
                  name="mensaje"
                  placeholder={t('contact.messagePlaceholder')}
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all text-gray-700 placeholder:text-gray-500 text-sm"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('contact.send')}
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section - Full width below */}
      <section className="pb-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.0147893857695!2d1.5380893!3d38.9839167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1299444444444444%3A0x5555555555555555!2sCarrer%20Riu%20Arno%2C%2017%2C%2007800%20Santa%20Eul%C3%A0ria%20des%20Riu%2C%20Illes%20Balears%2C%20Spain!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación BELTRAME"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
