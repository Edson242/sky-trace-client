import React from 'react';

interface AirlineLogoProps {
  flightId: string;
  className?: string;
}

export function AirlineLogo({ flightId, className = '' }: AirlineLogoProps) {
  const prefix = flightId.substring(0, 3).toUpperCase();
  
  let logoContent = null;
  let bgClass = 'bg-slate-700';

  if (prefix === 'AZU') {
    bgClass = 'bg-[#004687]'; // Azul dark blue
    logoContent = (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" aria-hidden="true">
        {/* Azul stylized "A" */}
        <path d="M50 15 L85 85 L15 85 Z" fill="#00A0E3" />
        <path d="M50 15 L50 85 L15 85 Z" fill="#FFFFFF" />
      </svg>
    );
  } else if (prefix === 'TAM') {
    bgClass = 'bg-[#1B0088]'; // LATAM indigo
    logoContent = (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" aria-hidden="true">
        {/* LATAM ribbon approximation */}
        <path d="M15 85 Q 50 10 85 85" stroke="#E8114B" strokeWidth="16" fill="transparent" strokeLinecap="round" />
        <path d="M25 85 Q 50 30 75 85" stroke="#FFFFFF" strokeWidth="10" fill="transparent" strokeLinecap="round" />
      </svg>
    );
  } else if (prefix === 'GLO') {
    bgClass = 'bg-[#FF5A00]'; // GOL orange
    logoContent = (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1.5" aria-hidden="true">
        {/* GOL overlapping circles */}
        <text x="50" y="68" fontFamily="sans-serif" fontWeight="900" fontSize="48" fill="white" textAnchor="middle">
          GOL
        </text>
      </svg>
    );
  } else {
    bgClass = 'bg-slate-700';
    logoContent = (
      <span className="text-white font-bold text-xs tracking-wider">{prefix.substring(0,2)}</span>
    );
  }

  return (
    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${bgClass} ${className} shadow-sm border border-white/10`}>
      {logoContent}
    </div>
  );
}
