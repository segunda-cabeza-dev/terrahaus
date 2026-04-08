
import { WHATSAPP_NUMBER, WHATSAPP_PHONE_DIGITS } from '../lib/contact';

export function WhatsAppFloat() {
  const link = `https://wa.me/${WHATSAPP_PHONE_DIGITS}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      title={`WhatsApp ${WHATSAPP_NUMBER}`}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: '#25D366',
        borderRadius: '50%',
        width: 60,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'box-shadow 0.2s',
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
        style={{ width: 36, height: 36 }}
      />
    </a>
  );
}
