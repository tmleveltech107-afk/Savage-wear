import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, Sparkles } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  visitorName?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '03295895704',
  visitorName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  // Format international number for wa.me: 03295895704 -> 923295895704
  const formattedWaNumber = phoneNumber.startsWith('0')
    ? `92${phoneNumber.slice(1)}`
    : phoneNumber.replace(/\+/g, '');

  const quickPrompts = [
    'Size & Fit advice',
    'Order status & tracking',
    'Bespoke tailoring inquiry',
    'Flagship appointment',
  ];

  const handleSend = (customText?: string) => {
    const textToSend = customText || userQuery || 'Hello Savage Wear Concierge, I would like assistance.';
    const greeting = visitorName ? `Hello, this is ${visitorName}. ` : '';
    const fullMessage = encodeURIComponent(`${greeting}${textToSend}`);
    const whatsappUrl = `https://wa.me/${formattedWaNumber}?text=${fullMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div id="whatsapp-support-widget" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Floating Concierge Chat Card */}
      {isOpen && (
        <div
          className="w-[calc(100vw-40px)] sm:w-88 md:w-96 max-w-sm bg-[#F7F5F0] text-[#171717] border border-[#DEDAD2] shadow-2xl overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-[#171717] text-[#F7F5F0] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#171717]" />
              </div>
              <div>
                <h4 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#F7F5F0]">
                  SAVAGE CONCIERGE
                </h4>
                <span className="text-[10px] text-[#DEDAD2]/80 font-light flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Available Now • Online
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#F7F5F0]/70 hover:text-white p-1"
              aria-label="Close concierge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <div className="bg-white p-3 border border-[#DEDAD2] text-xs text-[#171717] font-light leading-relaxed">
              <p className="font-normal mb-1">
                {visitorName ? `Good day, ${visitorName}.` : 'Good day.'}
              </p>
              <p className="text-[#77736C] text-[11px]">
                Connect with our flagship stylists & client care advisors on WhatsApp for private sizing, tailored fits, or order updates.
              </p>
            </div>

            {/* Quick Prompts */}
            <div>
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#77736C] block mb-1.5 font-medium">
                QUICK INQUIRIES
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="text-left p-2 text-[9px] tracking-wider uppercase border border-[#DEDAD2] bg-white/60 hover:bg-[#171717] hover:text-[#F7F5F0] hover:border-[#171717] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="flex items-center border border-[#171717] bg-white pl-3 pr-1 py-1">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Type your message..."
                className="w-full text-xs text-[#171717] placeholder:text-[#77736C] focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                className="p-2 bg-[#171717] text-[#F7F5F0] hover:bg-black transition-colors"
                aria-label="Send WhatsApp message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct Connect Action */}
            <button
              type="button"
              onClick={() => handleSend()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] tracking-[0.2em] uppercase font-medium transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>START WHATSAPP CHAT</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button: STRICTLY ICON ONLY, NO NUMBER OR TEXT DISPLAYED */}
      <button
        id="whatsapp-trigger-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="WhatsApp Support Concierge"
        title="WhatsApp Support"
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#171717] text-[#F7F5F0] hover:bg-black border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 stroke-[1.8] group-hover:rotate-6 transition-transform" />
        
        {/* Subtle Online Pulse Indicator */}
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#171717] animate-pulse" />
      </button>
    </div>
  );
};
