import mqtt from "mqtt";
import type { VehiclePosition } from "../types";

const mqttServer = "wss://mqtt.hsl.fi";
const vehiclePositionTopic = "/hfp/v2/journey/ongoing/vp/+/+/+/+/+/+/+/+/5/#";

type LocationUpdater = (vp: VehiclePosition) => void;

export function subscribeToVehiclePositions(update: LocationUpdater): () => void {
    const client = mqtt.connect(mqttServer);

    client.on("connect", () => {
        console.log("Connected to MQTT broker");
        client.subscribe(vehiclePositionTopic)
    });

    client.on("message", (_topic, message) => {
        const data = JSON.parse(message.toString());
        const vehicle: VehiclePosition = data.VP;

        // Create a unique ID for the vehicle based on its operator and vehicle number
        vehicle.id = `${vehicle.oper}/${vehicle.veh}`;

        if (vehicle.loc === "GPS" && vehicle.lat && vehicle.long) {
            update(vehicle);
        }
    });

    client.on("error", (error) => {
        console.error("MQTT error:", error);
    });

    // returns an unsubscribe function, which the caller can use to close the connection
    return () => { client.end() };
}

