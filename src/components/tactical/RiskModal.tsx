import { useState } from 'react';
import { useRadarStore } from '../../store/useRadarStore';
import { socket } from '../../hooks/useRadarSocket';
import { Plane, AlertTriangle, Satellite, CheckCircle2, Info, Megaphone, X, Navigation } from 'lucide-react';
import { AirlineLogo } from './AirlineLogo';

export default function RiskModal() {
  const { selectedFlightId, flights, selectFlight } = useRadarStore();
  const [deviationSentAt, setDeviationSentAt] = useState<string | null>(null);
  const deviationSent = deviationSentAt !== null;
  const [trackedFlightId, setTrackedFlightId] = useState(selectedFlightId);
  if (selectedFlightId !== trackedFlightId) {
    setTrackedFlightId(selectedFlightId);
    setDeviationSentAt(null);
  }

  if (!selectedFlightId) return null;
  const flight = flights.find((f) => f.id === selectedFlightId);
  if (!flight) {
    selectFlight(null);
    return null;
  }

  const isCritical = flight.threatLevel === 'CRITICAL';
  const headerColor = isCritical ? 'text-red-500' : 'text-green-500';

  const altitudeFeet = Math.floor(flight.altitude * 3.28084);
  const velocityKnots = Math.floor(flight.velocity * 1.94384);

  const {
    windSpeed: wind = 0,
    windGust: gusts = 0,
    precipitation: rain = 0,
    visibility: vis = 10,
    turbulenceIndex
  } = flight.environment || {};

  const turbulenceText =
    turbulenceIndex ||
    (flight.threatLevel === 'CRITICAL' ? 'PERIGOSO' :
      flight.threatLevel === 'WARNING' ? 'MODERADO' : 'SEGURO');
  const turbulenceColor =
    flight.threatLevel === 'CRITICAL' ? 'text-red-500' :
      flight.threatLevel === 'WARNING' ? 'text-amber-500' : 'text-green-500';

  return (
    <div className="absolute inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-700/50 shadow-sm w-full max-w-3xl p-8 font-sans">

        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-4 mb-1">
              <AirlineLogo flightId={flight.id} className="w-10 h-10" />
              <h2 className={`text-4xl font-black tracking-tighter ${headerColor}`}>
                {flight.id}
              </h2>
              {isCritical && (
                <span className="border border-red-500/50 bg-red-500/10 text-red-400 text-[10px] font-mono px-3 py-1 tracking-widest uppercase flex items-center gap-2">
                  <AlertTriangle size={14} /> Em Voo - Desvio Recomendado
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm font-mono flex items-center gap-2">
              <Plane size={14} /> Categoria da Aeronave: {flight.category} | Origem: {flight.originCountry}
            </p>
          </div>
          <button onClick={() => selectFlight(null)} className="text-slate-500 hover:text-white cursor-pointer transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1E293B] p-5 flex justify-between items-end border border-slate-700/50 shadow-sm">
            <div>
              <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block mb-1">Altitude</span>
              <span className="text-3xl font-bold text-white font-mono">{altitudeFeet.toLocaleString('pt-BR')}</span> <span className="text-slate-500 text-sm">pés</span>
            </div>
            <div className="flex gap-1 h-8 items-end">
              <div className="w-2 h-2 bg-green-500/40"></div>
              <div className="w-2 h-4 bg-green-500/60"></div>
              <div className="w-2 h-6 bg-green-500/80"></div>
              <div className="w-2 h-8 bg-green-500"></div>
            </div>
          </div>

          <div className="bg-[#1E293B] p-5 border border-slate-700/50 shadow-sm">
            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block mb-1">Velocidade de Solo</span>
            <span className="text-3xl font-bold text-white font-mono">{velocityKnots}</span> <span className="text-slate-500 text-sm">nós</span>
          </div>

          <div className="bg-[#1E293B] p-5 border border-slate-700/50 shadow-sm">
            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block mb-1">Proa</span>
            <span className="text-3xl font-bold text-white font-mono flex items-center gap-2">
              <span style={{ transform: `rotate(${flight.heading}deg)` }}><Navigation size={24} /></span>
              {Math.floor(flight.heading)}°
            </span>
          </div>

          <div className="bg-[#1E293B] p-5 border border-slate-700/50 shadow-sm">
            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block mb-1">ETA Próximo Waypoint</span>
            <span className="text-3xl font-bold text-white font-mono">14:22</span> <span className="text-slate-500 text-sm">UTC</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 border border-slate-700/50 mb-8 relative overflow-hidden shadow-sm">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Satellite className="text-amber-500" size={20} /> Análise Ambiental Ao Vivo
          </h3>

          <div className="grid grid-cols-2 gap-8 w-2/3">
            <div>
              <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block mb-1">Velocidade do Vento</span>
              <span className="text-lg font-bold text-white font-mono">{wind} <span className="text-xs text-slate-500">km/h</span></span>
            </div>
            <div>
              <span className={`${gusts > 80 ? 'text-red-400' : 'text-slate-400'} text-[10px] font-bold tracking-widest uppercase block mb-1`}>Rajadas de Vento</span>
              <span className={`text-lg font-bold font-mono ${gusts > 80 ? 'text-red-400' : 'text-white'}`}>{gusts} <span className="text-xs opacity-50">km/h</span></span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block mb-1">Precipitação</span>
              <span className="text-lg font-bold text-white font-mono">{rain} <span className="text-xs text-slate-500">mm/h</span></span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block mb-1">Visibilidade</span>
              <span className="text-lg font-bold text-white font-mono">{vis} <span className="text-xs text-slate-500">km</span></span>
            </div>
          </div>

          <div className="absolute right-6 bottom-6 bg-[#0B1120] p-4 border border-slate-800 text-center w-64 shadow-sm">
            <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase block mb-4">Índice de Turbulência</span>
            <div className="h-1 w-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 mb-2 relative">
              <div className={`absolute top-[-6px] w-3 h-3 bg-white shadow-[0_0_10px_white] transition-all duration-700 ${flight.threatLevel === 'CRITICAL' ? 'right-2' :
                  flight.threatLevel === 'WARNING' ? 'right-[50%]' : 'left-2'
                }`}></div>
            </div>
            <span className={`font-black tracking-widest ${turbulenceColor}`}>{turbulenceText}</span>
          </div>
        </div>

        {!isCritical && !deviationSent && (
          <div className="mb-4 text-right text-xs font-mono text-slate-500 flex items-center justify-end gap-1">
            <Info size={14} /> Desvio de rota só pode ser emitido para voos em estado CRÍTICO
          </div>
        )}

        <div className="flex justify-end gap-4 h-12">
          <button
            onClick={() => selectFlight(null)}
            className="px-6 py-3 text-sm font-bold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <X size={16} /> Dispensar Alerta
          </button>

          {deviationSent ? (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/40 text-green-400 text-xs font-mono px-6 py-3 animate-fade-in-up shadow-sm">
              <CheckCircle2 size={16} /> Cockpit notificado às {deviationSentAt}
            </div>
          ) : (
            <button
              onClick={() => {
                socket.emit('issue_route_deviation', { flightId: flight.id, reason: 'SEVERE_WEATHER' });
                setDeviationSentAt(new Date().toLocaleTimeString('pt-BR'));
              }}
              className={`px-6 py-3 text-sm font-bold transition-colors flex items-center gap-2 shadow-sm ${
                  isCritical ? 'bg-red-400/90 text-red-950 hover:bg-red-400 shadow-[0_0_15px_rgba(248,113,113,0.3)] cursor-pointer'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              disabled={!isCritical}
            >
              <Megaphone size={16} /> Emitir Desvio de Rota
            </button>
          )}
        </div>
      </div>
    </div>
  );
}