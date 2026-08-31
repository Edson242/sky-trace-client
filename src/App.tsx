import { useState, useEffect } from 'react';
import { useRadarSocket } from './hooks/useRadarSocket';
import { useRadarStore } from './store/useRadarStore';
import RadarMap from './components/map/RadarMap';
import FlightSidebar from './components/sidebar/FlightSidebar';
import AlertToast from './components/tactical/AlertToast';
import RiskModal from './components/tactical/RiskModal';

export default function App() {
  useRadarSocket();
  const audioUnlocked = useRadarStore((state) => state.audioUnlocked);
  const socketConnected = useRadarStore((state) => state.socketConnected);

  // Estado para fazer o relógio rodar em tempo real usando a hora local
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-screen p-4 flex flex-col font-sans overflow-hidden">
      {/* Container principal arredondado contendo o mapa */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl">
        
        {/* Mapa no Fundo */}
        <div className="absolute inset-0 z-0">
          <RadarMap />
        </div>

        {/* Topbar Flutuante */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
          <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-md pointer-events-auto">
            Sky<span className="text-green-500">Trace</span>
          </h1>
          
          <div className="flex gap-4 items-center pointer-events-auto">
            {!audioUnlocked && (
              <div className="flex items-center gap-2 bg-amber-950/80 backdrop-blur border border-amber-600 rounded-full px-4 py-1.5 text-xs font-mono text-amber-300">
                🔈 Clique na tela para ativar o alarme sonoro
              </div>
            )}
            <div className={`flex items-center gap-2 bg-slate-900/80 backdrop-blur border rounded-full px-4 py-1.5 text-xs font-mono ${
              socketConnected ? 'border-slate-700 text-green-400' : 'border-red-700 text-red-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              WebSocket: {socketConnected ? 'Conectado' : 'Desconectado'}
            </div>
            <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-md px-4 py-1.5 text-sm font-mono text-white">
              {time} BRT
            </div>
          </div>
        </div>

        {/* Sidebar Flutuante na Direita */}
        <div className="absolute top-20 right-6 bottom-6 w-96 z-10 pointer-events-none">
          <FlightSidebar />
        </div>

      </div>

      <RiskModal />
      <AlertToast />
    </div>
  );
}