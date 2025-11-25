import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export function WhatsAppSidebarLink() {
  return (
    <Link
      to="/whatsapp"
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 hover:text-black transition-colors mt-2 text-gray-800"
      style={{ fontWeight: 500 }}
    >
      <MessageCircle className="w-5 h-5" />
      <span>WhatsApp</span>
    </Link>
  );
}
