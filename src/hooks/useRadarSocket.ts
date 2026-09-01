import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useRadarStore } from '../store/useRadarStore';
import type { Alert, Flight, SystemHealth } from '../types';

import alarmSound from '../assets/alarm.mp3';

interface RadarUpdatePayload {
  activeFlights: Flight[];
  systemHealth: SystemHealth;
}

export const socket = io(import.meta.env.VITE_URL_API);

const SILENT_WAV = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

function playAlarmSound() {
  if (!useRadarStore.getState().audioUnlocked) return;

  const audio1 = new Audio(alarmSound);
  
  audio1.addEventListener('ended', () => {
    const audio2 = new Audio(alarmSound);
    audio2.play().catch(console.warn);
  });

  audio1.play().catch((err) => {
    console.warn('Falha ao tocar o alarme sonoro.', err);
  });
}

function useAudioUnlock() {
  const setAudioUnlocked = useRadarStore((state) => state.setAudioUnlocked);

  useEffect(() => {
    if (useRadarStore.getState().audioUnlocked) return;

    const unlock = () => {
      const primer = new Audio(SILENT_WAV);
      primer.play()
        .then(() => {
          setAudioUnlocked(true);
          window.removeEventListener('pointerdown', unlock);
          window.removeEventListener('keydown', unlock);

          const alreadyCritical = useRadarStore
            .getState()
            .flights.some((flight) => flight.threatLevel === 'CRITICAL');
          if (alreadyCritical) {
            playAlarmSound();
          }
        })
        .catch(() => {
        });
    };

    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, [setAudioUnlocked]);
}

export function useRadarSocket() {
  const { updateRadar, addAlert, setSocketConnected } = useRadarStore();

  useAudioUnlock();

  const criticalFlightIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const reminderInterval = setInterval(() => {
      const state = useRadarStore.getState();
      const hasCritical = state.flights.some((f) => f.threatLevel === 'CRITICAL');
      if (hasCritical) {
        playAlarmSound();
      }
    }, 120000); // 2 minutes

    return () => clearInterval(reminderInterval);
  }, []);

  useEffect(() => {
    setSocketConnected(socket.connected);
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('radar_update', (data: RadarUpdatePayload) => {
      updateRadar(data.activeFlights, data.systemHealth);

      const previousCritical = criticalFlightIdsRef.current;
      const currentCritical = new Set<string>();
      let hasNewCritical = false;

      for (const flight of data.activeFlights) {
        if (flight.threatLevel === 'CRITICAL') {
          currentCritical.add(flight.id);
          if (!previousCritical.has(flight.id)) {
            hasNewCritical = true;
          }
        }
      }

      if (hasNewCritical) {
        playAlarmSound();
      }

      criticalFlightIdsRef.current = currentCritical;
    });

    socket.on('critical_alert', (alert: Alert) => {
      addAlert(alert);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('radar_update');
      socket.off('critical_alert');
    };
  }, [updateRadar, addAlert, setSocketConnected]);

  const issueDeviation = (flightId: string) => {
    socket.emit('issue_route_deviation', { flightId, reason: 'SEVERE_WEATHER' });
  };

  return { issueDeviation };
}