import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SavageLogo } from './SavageLogo';

interface EntranceScreenProps {
  onContinue: (name: string) => void;
}

export const EntranceScreen: React.FC<EntranceScreenProps> = ({ onContinue }) => {
  const [name, setName] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || 'GUEST';
    onContinue(cleanName);
  };

  return (
    <div
      id="brand-entrance"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F5F0] text-[#171717] px-6 select-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        {/* Generous negative space surrounding the centered brand identity */}
        <div className="mb-14 sm:mb-16 transform transition-transform duration-700 hover:scale-[1.02]">
          <SavageLogo size="lg" color="#171717" />
        </div>

        {/* Minimal Understated Name Field */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <div
            className={`group relative flex items-center border-b transition-colors duration-300 pb-2 ${
              isHovered ? 'border-[#171717]' : 'border-[#DEDAD2]'
            }`}
          >
            <input
              id="visitor-name-input"
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
              placeholder="ENTER YOUR NAME"
              className="w-full bg-transparent text-xs tracking-[0.26em] uppercase text-[#171717] placeholder:text-[#77736C] placeholder:text-xs placeholder:tracking-[0.24em] focus:outline-none pr-8 py-1"
            />
            <button
              id="entrance-continue-btn"
              type="submit"
              aria-label="Continue to SAVAGE WEAR"
              className="absolute right-0 p-1 text-[#171717] opacity-60 hover:opacity-100 transition-all duration-300 hover:translate-x-0.5"
            >
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>

          <p className="text-[10px] tracking-[0.2em] text-[#77736C] uppercase text-center mt-4 opacity-50 font-light">
            Press Enter to Enter Flagship
          </p>
        </form>
      </motion.div>
    </div>
  );
};
