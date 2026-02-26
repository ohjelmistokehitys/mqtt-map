import type { LatLngExpression } from "leaflet";
import "./app.css";
import TrafficMap from "./map/TrafficMap";

// The coordinates for the initial center of the map (Haaga-Helia campus).
const haagaHeliaCoordinates: LatLngExpression = [60.201687, 24.933813];

function App() {
    return (
        <div id="map">
            <TrafficMap center={haagaHeliaCoordinates} />
        </div>
    );
}

export default App;
