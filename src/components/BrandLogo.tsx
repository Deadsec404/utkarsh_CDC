import React from 'react';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'full' | 'compact' | 'symbol-only' | 'badge';
  lightText?: boolean;
  size?: 'sm' | 'md' | 'navbar' | 'lg' | 'footer' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showTagline = false,
  variant = 'full',
  lightText = false,
  size = 'navbar'
}) => {
  const isSm = size === 'sm' || variant === 'compact';
  const isFooter = size === 'footer' || size === 'xl';
  const isLg = size === 'lg';

  // Responsive sizing presets: significantly increased size for navbar and footer
  let imgContainerClass = 'w-13 h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-2xl p-1';
  let titleClass = 'text-2xl sm:text-2xl md:text-[26px]';
  let subClass = 'text-xs sm:text-[12.5px] md:text-[13px]';
  let dotClass = 'w-2 h-2';

  if (isSm) {
    imgContainerClass = 'w-10 h-10 rounded-xl p-0.5';
    titleClass = 'text-lg';
    subClass = 'text-[10px] md:text-[11px]';
    dotClass = 'w-1.5 h-1.5';
  } else if (isFooter) {
    imgContainerClass = 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl p-1.5';
    titleClass = 'text-2xl sm:text-3xl md:text-[32px]';
    subClass = 'text-xs sm:text-sm';
    dotClass = 'w-2.5 h-2.5';
  } else if (isLg) {
    imgContainerClass = 'w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-1';
    titleClass = 'text-2xl sm:text-[28px]';
    subClass = 'text-xs sm:text-sm';
    dotClass = 'w-2 h-2';
  }

  return (
    <div className={`inline-flex items-center gap-3 sm:gap-3.5 group ${className}`}>
      {/* Official Utrkarsh_logo.jpeg */}
      <div
        className={`relative shrink-0 flex items-center justify-center bg-white shadow-xs border ${
          lightText ? 'border-white/20 shadow-md' : 'border-slate-200/90'
        } group-hover:shadow-md transition-all duration-300 overflow-hidden ${imgContainerClass}`}
      >
        <img
          src="/Utrkarsh_logo.jpeg"
          alt="Utkarsh Child Development Centre Logo"
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="eager"
        />
      </div>

      {variant !== 'symbol-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight leading-none uppercase ${titleClass} ${
                lightText
                  ? 'text-white'
                  : 'text-[#0f3460] group-hover:text-teal-700 transition-colors'
              }`}
            >
              Utkarsh
            </span>
            <span className={`inline-block rounded-full bg-rose-500 animate-pulse ${dotClass}`} />
          </div>
          <span
            className={`font-bold tracking-wider uppercase mt-1 leading-tight ${subClass} ${
              lightText ? 'text-teal-200' : 'text-teal-700'
            }`}
          >
            Child Development Centre
          </span>
          {showTagline && (
            <span
              className={`font-medium tracking-normal mt-1 leading-snug ${
                isFooter ? 'text-xs sm:text-sm text-slate-300' : 'text-[10px] md:text-xs text-slate-500'
              }`}
            >
              Empowering Abilities · Enriching Lives
            </span>
          )}
        </div>
      )}
    </div>
  );
};

