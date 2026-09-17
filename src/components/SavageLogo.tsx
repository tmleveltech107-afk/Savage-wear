import React from 'react';

interface SavageLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'emblem' | 'wordmark';
  color?: string; // hex or currentColor
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

export const SavageLogo: React.FC<SavageLogoProps> = ({
  className = '',
  variant = 'full',
  color = 'currentColor',
  size = 'md',
}) => {
  // Dimension mappings
  const emblemSizes = {
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    custom: '',
  };

  // The distinctive sharp geometric SW emblem from the brand asset
  const EmblemSvg = (
    <svg
      viewBox="0 0 200 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${size !== 'custom' ? emblemSizes[size] : ''} inline-block transition-transform duration-500`}
    >
      {/* Upper geometric hook of the S / Wing */}
      <path
        d="M 68 38 L 108 38 L 158 48 L 92 68 L 74 68 L 54 84 L 42 74 L 68 38 Z"
        fill={color}
      />
      {/* Top right outer crest accent */}
      <path
        d="M 108 38 L 158 48 L 140 60 L 98 60 Z"
        fill={color}
      />
      {/* Main diagonal core SW nexus with sharp faceted angles */}
      <path
        d="M 44 76 L 86 68 L 158 50 L 126 102 L 158 74 L 142 128 L 102 162 L 66 114 L 88 114 L 104 136 L 120 110 L 94 92 L 62 92 L 44 76 Z"
        fill={color}
      />
      {/* Dynamic left lower notch */}
      <path
        d="M 56 104 L 84 104 L 68 118 L 48 118 Z"
        fill={color}
      />
    </svg>
  );

  // Exact typographic wordmark matching "SAVAGE WEAR"
  const Wordmark = (
    <div className="flex flex-col items-center select-none text-center">
      <span
        style={{ color }}
        className="font-extrabold tracking-[0.28em] text-[1.2em] leading-none uppercase"
      >
        SAVAGE
      </span>
      <div className="flex items-center justify-center gap-2 mt-1.5 w-full">
        <span className="h-[1px] w-5 bg-current opacity-40" style={{ backgroundColor: color }} />
        <span
          style={{ color }}
          className="text-[0.62em] font-medium tracking-[0.38em] uppercase opacity-90 pl-1"
        >
          WEAR
        </span>
        <span className="h-[1px] w-5 bg-current opacity-40" style={{ backgroundColor: color }} />
      </div>
    </div>
  );

  if (variant === 'emblem') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{EmblemSvg}</div>;
  }

  if (variant === 'wordmark') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{Wordmark}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <div className="w-8 h-8 flex-shrink-0">
          <svg viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M 68 38 L 108 38 L 158 48 L 92 68 L 74 68 L 54 84 L 42 74 L 68 38 Z" fill={color} />
            <path d="M 108 38 L 158 48 L 140 60 L 98 60 Z" fill={color} />
            <path d="M 44 76 L 86 68 L 158 50 L 126 102 L 158 74 L 142 128 L 102 162 L 66 114 L 88 114 L 104 136 L 120 110 L 94 92 L 62 92 L 44 76 Z" fill={color} />
            <path d="M 56 104 L 84 104 L 68 118 L 48 118 Z" fill={color} />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span
            style={{ color }}
            className="font-bold tracking-[0.24em] text-sm leading-tight uppercase"
          >
            SAVAGE
          </span>
          <span
            style={{ color }}
            className="text-[9px] font-normal tracking-[0.32em] uppercase opacity-80"
          >
            WEAR
          </span>
        </div>
      </div>
    );
  }

  // Full stacked brand layout with generous negative space
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {EmblemSvg}
      {Wordmark}
    </div>
  );
};
