import { divIcon } from 'leaflet';
import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import type { VehiclePosition } from '../types';
import { VehicleInfo } from './VehicleInfo';


/**
 * A component that wraps a Leaflet Marker to display a single vehicle on the map. 
 */
export function VehicleMarker({ vehicle }: { vehicle: VehiclePosition }) {
    const heading = vehicle.hdg ?? 0;

    // useMemo reduces unnecessary recalculations when the icon stays the same across renders.
    const icon = useMemo(() => generateVehicleIcon(heading, vehicle.desi), [heading, vehicle.desi]);

    return <Marker position={[vehicle.lat, vehicle.long]} icon={icon}>
        <Popup>
            <VehicleInfo vehicle={vehicle} />
        </Popup>
    </Marker>;
}


/**
 * Generates a custom Leaflet icon for a vehicle marker. The icon turns to the direction 
 * of the vehicle's heading and displays the route number.
 */
function generateVehicleIcon(heading: number, routeNumber: string) {
    return divIcon({
        className: 'vehicle-marker',
        html: `
            <div class="icon-wrapper">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" style="transform: rotate(${heading}deg);">
                    <path d="M12 2l6 18-6-4-6 4 6-18z" />
                </svg>
                <span>${routeNumber}</span>
            </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
}

