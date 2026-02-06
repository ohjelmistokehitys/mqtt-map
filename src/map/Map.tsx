import { type LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useVehiclePositions } from '../positioning/useVehiclePositions.js';
import { VehicleMarker } from './VehicleMarker.js';


type MapProps = {
    center: LatLngExpression,
    zoom?: number
};

export default function TrafficMap({ center, zoom = 13 }: MapProps) {
    const { vehicles } = useVehiclePositions();

    return (
        <MapContainer center={center} zoom={zoom}>
            <TileConfig />

            {vehicles.map(vp =>
                <VehicleMarker key={vp.id} vehicle={vp} />
            )}
        </MapContainer>
    );
}

function TileConfig() {
    return <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Digitransit (CC BY)'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />;
}
