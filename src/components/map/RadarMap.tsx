import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useRadarStore } from '../../store/useRadarStore';
import type { ThreatLevel } from '../../types';

// Cache de ícones: evita recriar a divIcon (e o setIcon do Leaflet) a cada
// atualização de socket quando o rumo/estado da aeronave não mudou de fato.
const iconCache = new Map<string, L.DivIcon>();

const getPlaneIcon = (heading: number, threatLevel: ThreatLevel) => {
  const roundedHeading = Math.round(heading);
  const cacheKey = `${threatLevel}-${roundedHeading}`;

  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const color =
    threatLevel === 'CRITICAL' ? '#EF4444' :
    threatLevel === 'WARNING' ? '#F59E0B' :
    '#3B82F6';

  const blinkClass = threatLevel === 'CRITICAL' ? 'plane-blink-critical' : '';

  const svgString = `
    <div class="plane-icon-wrapper ${blinkClass}">
      <svg
        style="transform: rotate(${roundedHeading}deg); transition: transform 1s linear;"
        width="24" height="24"
        viewBox="0 0 24 24"
        fill="${color}"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    </div>
  `;

  const icon = L.divIcon({
    html: svgString,
    className: 'plane-marker-transparent',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  iconCache.set(cacheKey, icon);
  return icon;
};

export default function RadarMap() {
  const { flights, selectFlight } = useRadarStore((state) => state);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[-15.7801, -47.9292]}
        zoom={4}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {flights.map((flight) => (
          <Marker
            key={flight.id}
            position={[flight.lat, flight.lng]}
            icon={getPlaneIcon(flight.heading, flight.threatLevel)}
            eventHandlers={{
              click: () => selectFlight(flight.id),
            }}
          >
            {/* Tooltip permanente posicionado logo acima do eixo do avião */}
            <Tooltip
              direction="top"
              offset={[0, -12]}
              opacity={1}
              permanent
              className="tactical-callsign"
            >
              {flight.id}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Efeito de varredura de radar: puramente decorativo, não intercepta cliques */}
      <div className="radar-sweep-overlay" aria-hidden="true" />
    </div>
  );
}