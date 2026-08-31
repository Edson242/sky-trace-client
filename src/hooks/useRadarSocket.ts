import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useRadarStore } from '../store/useRadarStore';
import type { Alert, Flight, SystemHealth } from '../types';

// 1. Importa o arquivo de áudio da pasta assets
import alarmSound from '../assets/alarm.mp3';

interface RadarUpdatePayload {
  activeFlights: Flight[];
  systemHealth: SystemHealth;
}

export const socket = io('http://localhost:3000');

// WAV silencioso de 1 amostra, usado só para "destravar" o autoplay de áudio
// no navegador a partir de um gesto real do usuário (ver useAudioUnlock).
const SILENT_WAV = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

function playAlarmSound() {
  // Sem o desbloqueio (ver useAudioUnlock), o navegador rejeitaria a chamada
  // de qualquer forma; evitamos a tentativa fadada e o warning correspondente.
  if (!useRadarStore.getState().audioUnlocked) return;

  const audio = new Audio(alarmSound);
  audio.play().catch((err) => {
    console.warn('Falha ao tocar o alarme sonoro.', err);
  });
}

// Navegadores bloqueiam audio.play() até o usuário interagir com a página ao
// menos uma vez. Sem isso, o alarme de emergência simplesmente falhava em
// silêncio (NotAllowedError) e ninguém percebia. Aqui, o primeiro clique/tecla
// toca um áudio inaudível só para conquistar essa permissão; depois disso os
// alarmes reais tocam normalmente.
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

          // Se algum voo já estava em CRITICAL antes deste desbloqueio (ex:
          // emergência em curso ao carregar a página), o alarme daquela
          // transição foi perdido por falta de permissão — dispara agora.
          const alreadyCritical = useRadarStore
            .getState()
            .flights.some((flight) => flight.threatLevel === 'CRITICAL');
          if (alreadyCritical) {
            playAlarmSound();
          }
        })
        .catch(() => {
          // Ainda bloqueado; o listener continua ativo para tentar de novo.
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

  // Guarda quais voos já estavam em CRITICAL na última atualização, para tocar
  // o alarme apenas quando um voo ENTRA em emergência/tempestade (borda de
  // subida), e não a cada tick de socket enquanto ele permanece crítico.
  const criticalFlightIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Estado real da conexão: o texto "Conectado" na topbar antes era fixo
    // no JSX e aparecia mesmo sem nenhum backend rodando.
    setSocketConnected(socket.connected);
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('radar_update', (data: RadarUpdatePayload) => {
      updateRadar(data.activeFlights, data.systemHealth);

      const previousCritical = criticalFlightIdsRef.current;
      const currentCritical = new Set<string>();

      for (const flight of data.activeFlights) {
        if (flight.threatLevel === 'CRITICAL') {
          currentCritical.add(flight.id);
          if (!previousCritical.has(flight.id)) {
            playAlarmSound();
          }
        }
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