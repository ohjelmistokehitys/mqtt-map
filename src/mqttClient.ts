import mqtt from "mqtt";
import type { VehiclePosition } from "./types";

type LocationUpdater = (vp: VehiclePosition) => void;


export function subscribeToVehiclePositions(update: LocationUpdater): () => void {
    const client = mqtt.connect("wss://mqtt.hsl.fi");

    client.on("connect", () => {
        console.log("Connected to MQTT broker");
        client.subscribe("/hfp/v2/journey/ongoing/vp/+/+/+/+/+/+/+/+/5/#")
    });

    client.on("message", (_topic, message) => {
        const data = JSON.parse(message.toString());
        const position: VehiclePosition = data.VP;

        if (position.loc === "GPS" && position.lat && position.long) {
            update(position);
        }
    });

    // returns an unsubscribe function, which the caller can use to clean up
    return () => { client.end() };
}

