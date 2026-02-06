import { divIcon } from 'leaflet';
import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { VehiclePosition } from '../types';
import { VehicleInfo } from './VehicleInfo';

export function VehicleMarker({ vehicle }: { vehicle: VehiclePosition }) {
    const heading = Number.isFinite(vehicle.hdg) ? vehicle.hdg : 0;

    const icon = useMemo(() => divIcon({
        className: 'vehicle-marker',
        html: `
            <div class="icon-wrapper">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" style="transform: rotate(${heading}deg);">
                    <path d="M12 2l6 18-6-4-6 4 6-18z" />
                </svg>
                <span>${vehicle.desi}</span>
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    }), [heading, vehicle.desi]);

    if (!vehicle.lat || !vehicle.long) {
        console.warn(`Vehicle ${vehicle.id} has invalid coordinates: lat=${vehicle.lat}, long=${vehicle.long}`);
        return null;
    }

    return <Marker position={[vehicle.lat, vehicle.long]} icon={icon}>
        <Popup>
            <VehicleInfo vehicle={vehicle} />
        </Popup>
    </Marker>;
}
