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
          <h1 className="font-bold mb-4 text-[40px] md:text-[45px]" style={{ lineHeight: '1.1' }}>
            {t('contact.title')}
          </h1>
        </div>
      </section>

      {/* Contact Info Cards - 4 items en fila */}
      <section className="pb-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Dirección */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-sm mb-1">{t('contact.address')}</h3>
                <p className="text-xs text-gray-700 leading-snug whitespace-pre-line">
                  {t('contact.addressText')}
                </p>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-sm mb-1">{t('contact.hours')}</h3>
                <p className="text-xs text-gray-700 leading-snug whitespace-pre-line">
                  {t('contact.hoursText')}
                </p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-sm mb-1">{t('contact.phone')}</h3>
                <a href="tel:+34688860838" className="text-xs text-gray-700 hover:text-black">
                  +34 688 860 838
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-1">WhatsApp</h3>
                <a href="https://wa.me/34688860838" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-700 hover:text-black">
                  +34 688 860 838
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form - Ancho completo */}
      <section className="pb-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 rounded-xl p-8 md:p-10 border border-gray-200">
            
            {/* Mensaje de éxito */}
            {submitStatus === 'success' && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">¡Mensaje enviado correctamente!</h4>
                  <p className="text-sm text-green-700">
                    Gracias por contactarnos. Te responderemos lo antes posible.
                  </p>
                </div>
              </div>
            )}

            {/* Mensaje de error */}
            {submitStatus === 'error' && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Error al enviar el mensaje</h4>
                  <p className="text-sm text-red-700">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nombre"
                  placeholder={t('contact.name')}
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-700 placeholder:text-gray-500"
                />

                <input
                  type="email"
                  name="email"
                  placeholder={t('contact.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-700 placeholder:text-gray-500"
                />
              </div>

              <input
                type="tel"
                name="telefono"
                placeholder={t('contact.phonePlaceholder')}
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-gray-700 placeholder:text-gray-500"
              />

              <textarea
                name="mensaje"
                placeholder={t('contact.messagePlaceholder')}
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all text-gray-700 placeholder:text-gray-500"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </section>

      {/* Map Section - Ancho completo */}
      <section className="pb-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
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
