
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  // Using the WhatsApp number from the footer
  // wa.me needs the full international number: without the leading 1 this
  // opened a chat with +7 138 261 087 instead of our US number.
  const whatsappNumber = "17138261087";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};

export default WhatsAppButton;
