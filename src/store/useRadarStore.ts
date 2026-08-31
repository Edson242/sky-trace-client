import { create } from 'zustand';
import type { Flight, SystemHealth, Alert } from '../types';

interface RadarState {
  flights: Flight[];
  systemHealth: SystemHealth | null;
  selectedFlightId: string | null;
  activeAlerts: Alert[];
  audioUnlocked: boolean;
  socketConnected: boolean;

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
  addAlert: (alert) => set((state) => ({ activeAlerts: [...state.activeAlerts, alert].slice(-50) }))
}));