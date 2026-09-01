import azulLogo from '../../assets/azul.png';
import latamLogo from '../../assets/latam.png';
import golLogo from '../../assets/gol.png';

interface AirlineLogoProps {
  flightId: string;
  className?: string;
}

export function AirlineLogo({ flightId, className = '' }: AirlineLogoProps) {
  const prefix = flightId.substring(0, 3).toUpperCase();

  if (prefix === 'AZU') {
    return <img src={azulLogo} alt="Azul" className={`w-8 h-8 rounded shrink-0 object-contain bg-white ${className}`} />;
  } else if (prefix === 'TAM') {
    return <img src={latamLogo} alt="LATAM" className={`w-8 h-8 rounded shrink-0 object-contain bg-white ${className}`} />;
  } else if (prefix === 'GLO') {
    return <img src={golLogo} alt="GOL" className={`w-8 h-8 rounded shrink-0 object-contain bg-white ${className}`} />;
  }

  return (
    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 bg-slate-700 ${className} shadow-sm border border-white/10`}>
      <span className="text-white font-bold text-xs tracking-wider">{prefix.substring(0, 2)}</span>
    </div>
  );
}
