import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function TerminosCondiciones() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="terminos-condiciones-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            {t('common.home')}
          </button>
          <span className="separator">›</span>
          <span className="current">{t('common.termsConditions')}</span>
        </div>
      </div>

      {/* Header */}
      <div className="header-section">
        <div className="container">
          <h1 className="title">{t('common.termsConditions')}</h1>
        </div>
      </div>

      {/* Content Section */}
      <section className="pb-20 bg-white">
        <div className="container space-y-8">
          
          {/* Introducción */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">Introducción</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Al realizar un encargo con <strong>BELTRAME SOLUCIONES EN HIERRO SL</strong>, con CIF B42726802 y sede en Calle Río Arno 17, Can Bufí, Ibiza, usted acepta los siguientes Términos y Condiciones que regulan la relación entre ambas partes y garantizan un uso responsable del contenido proporcionado, así como una producción eficiente, respetuosa de la legalidad vigente.
            </p>
          </div>

          {/* 1. Aceptación de los Términos */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">1. Aceptación de los Términos</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Todo cliente que solicita un trabajo acepta automáticamente los presentes Términos. Es importante leerlos detenidamente antes de realizar el pedido, ya que la aceptación implica conformidad plena y sin reservas.
            </p>
          </div>

          {/* 2. Contenido proporcionado */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">2. Contenido proporcionado</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Usted puede facilitar imágenes, textos, logotipos, dibujos, medidas o ideas para la fabricación. Usted declara ser titular de los derechos o contar con autorización expresa. El contenido no debe ser ofensivo, ilegal ni infringir derechos de terceros.
            </p>
          </div>

          {/* 3. Licencia limitada sobre sus materiales */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">3. Licencia limitada sobre sus materiales</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Usted otorga a Beltrame una licencia limitada, no exclusiva, gratuita y transferible para reproducir, adaptar o transformar el contenido exclusivamente con fines de fabricación. Esta licencia será válida solo durante el proceso productivo.
            </p>
          </div>

          {/* 4. Restricciones de contenido */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">4. Restricciones de contenido</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Nos reservamos el derecho de rechazar encargos que incumplan nuestras normas internas, presenten dudas legales o no sean viables técnicamente.
            </p>
          </div>

          {/* 5. Derechos de propiedad */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">5. Derechos de propiedad</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              El encargo no otorga derechos sobre diseños, estructuras o imágenes propiedad de Beltrame, salvo las partes personalizadas creadas desde el contenido del cliente.
            </p>
          </div>

          {/* 6. Devoluciones y cancelaciones */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">6. Devoluciones y cancelaciones</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Los productos personalizados están exentos de derecho de desistimiento. Solo se aceptarán devoluciones por defectos demostrables. Cada caso se revisará individualmente.
            </p>
          </div>

          {/* 7. Responsabilidad e indemnización */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">7. Responsabilidad e indemnización</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Usted se compromete a mantener indemne a Beltrame frente a cualquier reclamación que derive del uso no autorizado de contenido protegido o de cualquier incumplimiento de estos términos.
            </p>
          </div>

          {/* 8. Modificaciones */}
          <div>
            <h2 className="font-bold text-[22px] mb-4">8. Modificaciones</h2>
            <p className="text-[17px] leading-relaxed text-gray-700">
              Beltrame puede modificar estos términos sin afectar encargos ya confirmados. Las nuevas condiciones estarán disponibles antes de futuros pedidos.
            </p>
          </div>

          {/* Contacto */}
          <div className="pt-8 border-t border-gray-200 mt-12">
            <p className="text-[17px] text-gray-700">
              Para cualquier consulta sobre estos términos, puede contactarnos en:
            </p>
            <p className="text-[17px] font-semibold mt-2">
              BELTRAME SOLUCIONES EN HIERRO SL<br />
              CIF: B42726802<br />
              Calle Río Arno 17, Can Bufí, Ibiza
            </p>
          </div>

        </div>
      </section>

      <style>{`
        .terminos-condiciones-page {
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
