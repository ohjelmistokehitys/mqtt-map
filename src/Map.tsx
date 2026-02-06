import { type LatLngExpression, type Map, icon } from 'leaflet';
import { useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import type { VehiclePosition } from './types';
import { useVehiclePositions } from './useVehiclePositions';

const ico = icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

type MapProps = {
    center: LatLngExpression,
    zoom?: number
};

export default function TrafficMap({ center, zoom = 13 }: MapProps) {
    const { vehicles } = useVehiclePositions();
    const mapRef = useRef<Map>(null);

    return <MapContainer center={center} zoom={zoom} ref={mapRef}>
        <TileConfig />
        {vehicles.map(vp => <VehicleMarker key={`${vp.oper}/${vp.veh}`} vehicle={vp} />)}
    </MapContainer>;
}

function VehicleMarker({ vehicle }: { vehicle: VehiclePosition }) {
    return <Marker position={[vehicle.lat!, vehicle.long!]}>
        <Popup>
            <VehicleInfo vehicle={vehicle} />
        </Popup>
    </Marker>;

}

function VehicleInfo({ vehicle }: { vehicle: VehiclePosition }) {
    return <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
            <tr>
                <td>Line</td>
                <td>{vehicle.line}</td>
            </tr>
            <tr>
                <td>Operator</td>
                <td>{vehicle.oper}</td>
            </tr>
            <tr>
                <td>Vehicle</td>
                <td>{vehicle.veh}</td>
            </tr>
            <tr>
                <td>Speed</td>
                <td>{convertSpeed(vehicle.spd).toFixed(1)} km/h</td>
            </tr>
        </tbody>
    </table>;
}

function TileConfig() {
    return <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Digitransit (CC BY)'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />;
}

function convertSpeed(metersPerSecond?: number): number {
    return (metersPerSecond ?? 0) * 3.6; // Convert m/s to km/h
}
