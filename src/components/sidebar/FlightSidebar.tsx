import { useRadarStore } from '../../store/useRadarStore';

export default function FlightSidebar() {
  const { flights, selectFlight } = useRadarStore((state) => state);

  return (
    <div className="h-full flex flex-col pointer-events-auto">
      <div className="mb-4 bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-slate-700 shadow-xl">
        <h2 className="text-white font-bold text-lg">Voos Ativos</h2>
        <p className="text-slate-400 text-xs font-mono mb-4">Monitoramento do Setor 76</p>
        
        <div className="flex flex-col gap-3 h-[calc(100vh-280px)] overflow-y-auto no-scrollbar pb-10">
          {flights.map((flight) => {
            const isCritical = flight.threatLevel === 'CRITICAL';
            const isWarning = flight.threatLevel === 'WARNING';
            const statusColor = isCritical ? 'text-red-400 border-red-500/50 bg-red-500/10' : 
                                isWarning ? 'text-amber-400 border-amber-500/50 bg-amber-500/10' : 
                                'text-green-400 border-slate-700 bg-slate-800/50';

            return (
              <div 
                key={flight.id}
                onClick={() => selectFlight(flight.id)}
                className={`p-4 rounded-lg border cursor-pointer hover:bg-slate-700/50 transition-colors backdrop-blur-md ${statusColor}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white tracking-wider">{flight.id}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${isCritical ? 'border-red-500 text-red-500' : isWarning ? 'border-amber-500 text-amber-500' : 'border-green-500 text-green-500'}`}>
                    {flight.threatLevel === 'SAFE' ? 'SEGURO' : flight.threatLevel === 'WARNING' ? 'ALERTA' : 'CRÍTICO'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">ALTITUDE</span>
                    <span className="text-slate-200">{Math.floor(flight.altitude * 3.28084).toLocaleString('pt-BR')} ft</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">VELOCIDADE</span>
                    <span className="text-slate-200">{Math.floor(flight.velocity * 1.94384)} kts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}