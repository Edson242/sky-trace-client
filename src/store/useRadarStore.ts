import { create } from 'zustand';
import type { Flight, SystemHealth, Alert } from '../types';

interface RadarState {
  flights: Flight[];
  systemHealth: SystemHealth | null;
  selectedFlightId: string | null;
  activeAlerts: Alert[];
  // Vira true após o primeiro clique/tecla do usuário na página, liberando o
  // navegador a tocar áudio programaticamente (política de autoplay).
  audioUnlocked: boolean;
  // Estado real da conexão socket.io (ver useRadarSocket) — reflete os
  // eventos 'connect'/'disconnect', não é um texto fixo na tela.
  socketConnected: boolean;

  // Ações
  updateRadar: (flights: Flight[], health: SystemHealth) => void;
  selectFlight: (id: string | null) => void;
  addAlert: (alert: Alert) => void;
  setAudioUnlocked: (unlocked: boolean) => void;
  setSocketConnected: (connected: boolean) => void;
}

export const useRadarStore = create<RadarState>((set) => ({
  flights: [],
  systemHealth: null,
  selectedFlightId: null,
  activeAlerts: [],
  audioUnlocked: false,
  socketConnected: false,

  updateRadar: (flights, health) => set({ flights, systemHealth: health }),
  selectFlight: (id) => set({ selectedFlightId: id }),
  setAudioUnlocked: (unlocked) => set({ audioUnlocked: unlocked }),
  setSocketConnected: (connected) => set({ socketConnected: connected }),
  // Mantém só os últimos 50 alertas: a lista crescia para sempre durante a
  // sessão (nunca era limpa), o que vazava memória e deixava o filtro/slice
  // do AlertToast cada vez mais caro em sessões longas.
  addAlert: (alert) => set((state) => ({ activeAlerts: [...state.activeAlerts, alert].slice(-50) }))
}));