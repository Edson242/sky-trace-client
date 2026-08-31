export type ThreatLevel = 'SAFE' | 'WARNING' | 'CRITICAL';

export interface Flight {
  id: string;
  originCountry: string;
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  heading: number;
  threatLevel: ThreatLevel;
  category: number;
  windSpeed?: number;
  windGust?: number;
  precipitation?: number;
  visibility?: number;
}

export interface SystemHealth {
  weatherQuotaUsed: number;
  weatherQuotaMax: number;
  dataSource: string;
  connectedClients: number;
}

export interface Alert {
  id: string;
  flightId: string;
  message: string;
  level: ThreatLevel;
  timestamp: number;
}