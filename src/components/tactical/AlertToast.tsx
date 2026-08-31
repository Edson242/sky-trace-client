import { useEffect, useState } from 'react';
import { useRadarStore } from '../../store/useRadarStore';
import type { Alert } from '../../types';

function ToastItem({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(alert.id), 5000);
    return () => clearTimeout(timer);
  }, [alert.id, onDismiss]);

  const bgColor = alert.level === 'CRITICAL'
    ? 'bg-red-950/90 border border-red-500 text-red-100'
    : 'bg-[#1E293B]/90 border border-amber-500 text-amber-100';
  const glow = alert.level === 'CRITICAL' ? 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' : '';

  return (
    <div className={`flex flex-col p-4 mb-3 border-l-4 rounded-r shadow-lg backdrop-blur-sm animate-fade-in-up ${bgColor} ${glow}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-sm tracking-widest uppercase">
          🚨 ALERTA {alert.level}
        </span>
        <button onClick={() => onDismiss(alert.id)} className="text-gray-400 hover:text-white ml-4 cursor-pointer transition-colors">
          ✕
        </button>
      </div>
      <span className="font-mono text-xs mb-1">Voo ID: {alert.flightId}</span>
      <p className="text-sm">{alert.message}</p>
    </div>
  );
}

export default function AlertToast() {
  const alerts = useRadarStore((state) => state.activeAlerts);

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const visibleAlerts = alerts
    .filter((alert) => !dismissedIds.has(alert.id))
    .slice(-5);

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="absolute bottom-6 right-6 z-[9999] w-80 flex flex-col justify-end pointer-events-none">
      <div className="pointer-events-auto">
        {visibleAlerts.map((alert) => (
          <ToastItem key={alert.id} alert={alert} onDismiss={handleDismiss} />
        ))}
      </div>
    </div>
  );
}