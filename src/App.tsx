import { useState, useEffect } from 'react';
import { useRadarSocket, socket } from './hooks/useRadarSocket';
import { useRadarStore } from './store/useRadarStore';
import RadarMap from './components/map/RadarMap';
import FlightSidebar from './components/sidebar/FlightSidebar';
import AlertToast from './components/tactical/AlertToast';
import RiskModal from './components/tactical/RiskModal';

export default function App() {
  useRadarSocket();
  const audioUnlocked = useRadarStore((state) => state.audioUnlocked);
  const socketConnected = useRadarStore((state) => state.socketConnected);

  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR'));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col font-sans overflow-hidden bg-[#020617]">
      <div className="relative flex-1 overflow-hidden shadow-sm">
        <div className="absolute inset-0 z-0">
          <RadarMap />
        </div>
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
          <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-md pointer-events-auto">
            Sky<span className="text-green-500">Trace</span>
          </h1>

          <div className="flex gap-4 items-center pointer-events-auto">
            {!audioUnlocked && (
              <div className="flex items-center gap-2 bg-amber-950/80 backdrop-blur border border-amber-600 px-4 py-1.5 text-xs font-mono text-amber-300 shadow-sm">
                🔈 Clique na tela para ativar o alarme sonoro
              </div>
            )}
            <div 
              onClick={() => socketConnected ? socket.disconnect() : socket.connect()}
              className={`cursor-pointer hover:bg-slate-800/80 transition-colors flex items-center gap-2 bg-slate-900/80 backdrop-blur border px-4 py-1.5 text-xs font-mono shadow-sm ${socketConnected ? 'border-slate-700 text-green-400' : 'border-red-700 text-red-400'
              }`}>
              <span className={`w-2 h-2 ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              WebSocket: {socketConnected ? 'Conectado' : 'Desconectado'}
            </div>
            <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-4 py-1.5 text-sm font-mono text-white shadow-sm">
              {time} BRT
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-6 bottom-6 w-96 z-[1001] pointer-events-none">
          <FlightSidebar />
        </div>

      </div>

      <RiskModal />
      <AlertToast />
    </div>
  );
}