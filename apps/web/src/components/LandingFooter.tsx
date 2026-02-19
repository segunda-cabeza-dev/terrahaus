import React from 'react'
import { img } from '../lib/assets'

const LandingFooter: React.FC = () => (
  <footer className="w-full bg-black text-white py-12 px-8">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <a href="/" className="inline-block mb-4">
          <img
            src={img('Logo terrahous Blanco.webp')}
            alt="Terrahaus logo"
            className="max-h-16 w-auto mx-auto"
            style={{ maxWidth: '200px', height: 'auto' }}
            loading="lazy"
          />
        </a>
        <p
          className="text-center mx-auto"
          style={{
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 300,
            fontSize: '16px',
            color: '#e5e7eb',
            maxWidth: '500px',
          }}
        >
          Especialistas en reformas integrales en Alicante y alrededores.
          <br />
          Arquitectos profesionales con presupuesto cerrado y fecha garantizada.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-block">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-[#b35427]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a3 3 0 003.22 0L22 8m-19 8V8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </span>
          <a
            href="mailto:info@terrahaus.es"
            className="hover:text-[#b35427] transition"
            style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}
          >
            info@terrahaus.es
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-block">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-[#b35427]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </span>
          <a
            href="tel:+34642413996"
            className="hover:text-[#b35427] transition"
            style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px' }}
          >
            +34 642 413 996
          </a>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-block">
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-[#b35427]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: '16px', color: '#e5e7eb' }}>
            Lun - Vie: 08:00 - 18:00
          </span>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <p className="text-center text-gray-400 text-sm" style={{ fontFamily: 'Barlow, sans-serif', fontWeight: 300 }}>
          © 2024 Terrahaus. Reformas integrales en Alicante. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
)

export default LandingFooter

