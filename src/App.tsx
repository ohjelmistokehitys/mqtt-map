import TrafficMap from "./Map";
import "./app.css";

function App() {

    return (
        <div id="map">
            <TrafficMap center={[60.201687, 24.933813]} />
        </div>
    )
}

export default App
