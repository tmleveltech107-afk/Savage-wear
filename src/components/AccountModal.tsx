import React, { useState } from 'react';
import { X, User, Crown, Film, Check, Edit2 } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitorName: string;
  onUpdateName: (newName: string) => void;
  onReplayFilm: () => void;
  onRestartEntrance: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  visitorName,
  onUpdateName,
  onReplayFilm,
  onRestartEntrance,
}) => {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(visitorName);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
    }
    setEditing(false);
  };

  return (
    <div
      id="account-modal"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#F7F5F0] text-[#171717] border border-[#DEDAD2] shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#DEDAD2] pb-4 mb-6">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#77736C]">
            SAVAGE WEAR // CLIENT PRIVILEGES
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#171717] hover:opacity-60"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-[#EAE6DF]/60 p-6 mb-6 border border-[#DEDAD2]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#171717] text-[#F7F5F0] flex items-center justify-center font-bold">
              <User className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="flex-1">
              <span className="text-[9px] tracking-[0.2em] uppercase text-[#77736C] block">
                FLAGSHIP GUEST
              </span>
              {editing ? (
                <form onSubmit={handleSave} className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="border-b border-[#171717] bg-transparent text-sm uppercase tracking-wider text-[#171717] focus:outline-none"
                    autoFocus
                  />
                  <button type="submit" className="p-1 text-[#171717]">
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-sm tracking-[0.16em] uppercase font-medium text-[#171717]">
                    {visitorName || 'VIP GUEST'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(visitorName);
                      setEditing(true);
                    }}
                    className="text-[#77736C] hover:text-[#171717]"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#171717] pt-3 border-t border-[#DEDAD2]/80">
            <Crown className="w-3.5 h-3.5 text-[#171717]" />
            <span>VIP TIER 01 // COMPLIMENTARY CONCIERGE</span>
          </div>
        </div>

        {/* Privileges */}
        <div className="space-y-3 mb-6 text-xs text-[#77736C] font-light">
          <div className="flex items-center justify-between py-1 border-b border-[#DEDAD2]/50">
            <span>FLAGSHIP BOUTIQUE ACCESS</span>
            <span className="text-[#171717] font-normal">UNRESTRICTED</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#DEDAD2]/50">
            <span>EXPRESS COURIER SERVICE</span>
            <span className="text-[#171717] font-normal">COMPLIMENTARY</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#DEDAD2]/50">
            <span>TAILORING CONCIERGE</span>
            <span className="text-[#171717] font-normal">INCLUDED</span>
          </div>
        </div>

        {/* Brand Experience Actions */}
        <div className="space-y-2 pt-2 border-t border-[#DEDAD2]">
          <button
            type="button"
            onClick={() => {
              onClose();
              onReplayFilm();
            }}
            className="w-full py-3 border border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-[#F7F5F0] text-[11px] tracking-[0.24em] uppercase transition-colors flex items-center justify-center gap-2"
          >
            <Film className="w-3.5 h-3.5" />
            <span>REPLAY FLAGSHIP FILM</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onRestartEntrance();
            }}
            className="w-full py-2.5 text-[10px] tracking-[0.2em] uppercase text-[#77736C] hover:text-[#171717] transition-colors"
          >
            RETURN TO BRAND ENTRANCE
          </button>
        </div>
      </div>
    </div>
  );
};
