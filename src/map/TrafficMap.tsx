import { type LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useVehiclePositions } from '../positioning/useVehiclePositions.js';
import { VehicleMarker } from './VehicleMarker.js';

type MapProps = {
    center: LatLngExpression,
    zoom?: number
};

/**
 * A React component that renders a map with real-time vehicle positions. The component uses the react-leaflet
 * library to render the map and the `useVehiclePositions` hook to get the current vehicle positions.
 * 
 * The map is centered at the specified coordinates and zoom level, and each vehicle is represented by a marker on the map.
 */
export default function TrafficMap({ center, zoom = 13 }: MapProps) {

    // the `useVehiclePositions` hook maintains the vehicle positions and updates them in real-time
    const { vehicles } = useVehiclePositions();

    return (
        <MapContainer center={center} zoom={zoom}>
            <TileConfig />

            {vehicles.map(vp =>
                <VehicleMarker key={`${vp.oper}/${vp.veh}`} vehicle={vp} />
            )}
        </MapContainer>
    );
}

/**
 * A React component that renders a TileLayer for the map. The TileLayer is configured to use OpenStreetMap tiles and includes 
 * attribution for the tile source. This component is used within the TrafficMap component to display the map tiles.
 */
function TileConfig() {
    return <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Digitransit (CC BY)'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />;
}
