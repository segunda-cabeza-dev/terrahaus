import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Privacidad() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="privacidad-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            {t('common.home')}
          </button>
          <span className="separator">›</span>
          <span className="current">{t('common.privacyPolicy')}</span>
        </div>
      </div>

      {/* Header */}
      <div className="header-section">
        <div className="container">
          <h1 className="title">{t('common.privacyPolicy')}</h1>
        </div>
      </div>

      {/* Content Section */}
      <section className="pb-20 bg-white">
        <div className="container space-y-8">
          
          {/* Compromiso con su privacidad */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">Compromiso con su privacidad</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              En <strong>BELTRAME SOLUCIONES EN HIERRO SL</strong> tratamos los datos personales de nuestros clientes con la máxima confidencialidad y conforme a la legislación vigente, especialmente el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales.
            </p>
          </div>

          {/* 1. Responsable del tratamiento */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">1. Responsable del tratamiento</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              <strong>BELTRAME SOLUCIONES EN HIERRO SL</strong><br />
              CIF: B42726802<br />
              Calle Río Arno 17, Polígono Can Bufí, 07840, Santa Eulalia del Río, Illes Balears<br />
              Correo electrónico: <a href="mailto:beltramehierro@hotmail.com" className="text-black font-semibold hover:underline">beltramehierro@hotmail.com</a><br />
              Teléfono: <a href="tel:+34634112480" className="text-black font-semibold hover:underline">634 112 480</a>
            </p>
          </div>

          {/* 2. Finalidad del tratamiento */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">2. Finalidad del tratamiento</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Gestionar pedidos, presupuestos, comunicaciones sobre trabajos, y el envío de información técnica, comercial o promocional relacionada con nuestros servicios.
            </p>
          </div>

          {/* 3. Base legal */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">3. Base legal</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Consentimiento explícito, ejecución de un contrato o precontrato, e interés legítimo en mantener la relación comercial.
            </p>
          </div>

          {/* 4. Conservación de datos */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">4. Conservación de datos</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Los datos se conservarán durante la relación comercial y, tras su finalización, el tiempo legalmente requerido.
            </p>
          </div>

          {/* 5. Seguridad de la información */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">5. Seguridad de la información</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Se aplican medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales.
            </p>
          </div>

          {/* 6. Comunicación de datos a terceros */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">6. Comunicación de datos a terceros</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              No compartimos datos salvo obligación legal o necesidad operativa específica para cumplir con el encargo.
            </p>
          </div>

          {/* 7. Derechos del interesado */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">7. Derechos del interesado</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Puede ejercer derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a <a href="mailto:beltramehierro@hotmail.com" className="text-black font-semibold hover:underline">beltramehierro@hotmail.com</a>. También puede presentar una reclamación ante la Agencia Española de Protección de Datos.
            </p>
          </div>

          {/* 8. Confidencialidad */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">8. Confidencialidad</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Toda la información intercambiada será tratada con estricta confidencialidad. Si recibe información por error, elimínela y comuníquelo a la mayor brevedad.
            </p>
          </div>

          {/* Contacto */}
          <div className="pt-8 border-t border-gray-200 mt-12">
            <p className="text-[17px] text-gray-700">
              Para cualquier consulta sobre esta política de privacidad, puede contactarnos en:
            </p>
            <p className="text-[17px] font-semibold mt-2">
              <a href="mailto:beltramehierro@hotmail.com" className="text-black hover:underline">beltramehierro@hotmail.com</a><br />
              <a href="tel:+34634112480" className="text-black hover:underline">634 112 480</a>
            </p>
          </div>

        </div>
      </section>

      <style>{`
        .privacidad-page {
          min-height: 100vh;
          background: white;
          padding-top: 0;
          padding-bottom: 80px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Breadcrumb */
        .breadcrumb {
          background: white;
          padding: 16px 0;
          padding-top: 96px;
          border-bottom: 1px solid #e5e7eb;
        }

        .breadcrumb .container {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .breadcrumb-link {
          background: none;
          border: none;
          color: #000;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.2s;
          padding: 0;
          font-size: 14px;
        }

        .breadcrumb-link:hover {
          opacity: 0.6;
        }

        .separator {
          color: #9ca3af;
          font-weight: 400;
        }

        .current {
          color: #9ca3af;
          font-weight: 400;
        }

        /* Header */
        .header-section {
          padding: 30px 0 30px;
          background: white;
        }

        .title {
          font-size: 36px;
          font-weight: 700;
          color: #000;
          line-height: 1.2;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 0 24px;
          }

          .title {
            font-size: 28px;
          }

          .header-section {
            padding: 40px 0 30px;
          }
        }
      `}</style>
    </div>
  );
}
