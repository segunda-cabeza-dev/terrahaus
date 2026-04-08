import { Phone } from 'lucide-react';
import { DISPLAY_PHONE, PHONE_HREF } from '../lib/contact';

type FloatingCallBarProps = {
  label?: string;
};

export function FloatingCallBar({ label = 'Llamar ahora' }: FloatingCallBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[1000] md:hidden">
      <a
        href={PHONE_HREF}
        aria-label={`${label}: ${DISPLAY_PHONE}`}
        className="flex h-16 w-full items-center justify-center gap-3 bg-[#4caf50] px-4 text-white shadow-[0_-4px_16px_rgba(0,0,0,0.18)]"
      >
        <Phone className="h-5 w-5" strokeWidth={2.5} />
        <span
          className="uppercase tracking-wide opacity-90"
          style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px' }}
        >
          {label}
        </span>
        <span
          className="font-semibold"
          style={{ fontFamily: 'Barlow, sans-serif', fontSize: '18px' }}
        >
          {DISPLAY_PHONE}
        </span>
      </a>
    </div>
  );
}
