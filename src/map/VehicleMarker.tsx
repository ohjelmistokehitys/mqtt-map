import { Marker, Popup } from 'react-leaflet';
import type { VehiclePosition } from '../types';
import { VehicleInfo } from './VehicleInfo';

export function VehicleMarker({ vehicle }: { vehicle: VehiclePosition }) {

    if (!vehicle.lat || !vehicle.long) {
        console.warn(`Vehicle ${vehicle.id} has invalid coordinates: lat=${vehicle.lat}, long=${vehicle.long}`);
        return null;
    }

    return <Marker position={[vehicle.lat, vehicle.long]}>
        <Popup>
            <VehicleInfo vehicle={vehicle} />
        </Popup>
    </Marker>;
}
