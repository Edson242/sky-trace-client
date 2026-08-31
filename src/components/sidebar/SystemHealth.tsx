import { useRadarStore } from '../../store/useRadarStore';

export default function SystemHealth() {
  const health = useRadarStore((state) => state.systemHealth);

  if (!health) return null;

  const usagePercent = (health.weatherQuotaUsed / health.weatherQuotaMax) * 100;
  
  // Muda a cor da barra dependendo do consumo
  const barColor = 
    usagePercent > 90 ? 'bg-red-500' : 
    usagePercent > 70 ? 'bg-yellow-500' : 
    'bg-green-500';

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 border border-gray-700">
      <h3 className="text-lg font-bold text-gray-200 mb-3 uppercase tracking-wider text-sm">
        Telemetria do Motor
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Cota OpenWeather</span>
          <span>{health.weatherQuotaUsed} / {health.weatherQuotaMax}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`} 
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Fonte de Dados:</span>
        <span className="font-mono text-blue-400">{health.dataSource}</span>
      </div>
      
      <div className="flex justify-between text-sm mt-2">
        <span className="text-gray-400">Clientes Conectados:</span>
        <span className="font-mono text-green-400">{health.connectedClients}</span>
      </div>
    </div>
  );
}