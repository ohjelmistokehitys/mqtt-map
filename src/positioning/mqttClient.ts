import mqtt from "mqtt";
import type { VehiclePosition } from "../types";

// The type for the function that is passed to the subscribeToVehiclePositions function.
type LocationUpdater = (vp: VehiclePosition) => void;

// The subscribe function needs to return a cleanup function, that takes no arguments and returns no value.
type CleanupFunction = () => void;


/**
 * Your task is to implement this function according to the requirements specified in the readme file.
 * 
 * The function should connect to the Digitransit HFP MQTT broker, subscribe to the topic for vehicle positions,
 * and call the provided `update` function whenever a new vehicle position is received. The function 
 * should also return a cleanup function that can be used to close the MQTT connection when it is no longer needed.
 * 
 * @param update A function that is called whenever a new vehicle position is received.
 * @returns A cleanup function that can be used to close the MQTT connection.
 */
export function subscribeToVehiclePositions(update: LocationUpdater): CleanupFunction {

    const client = mqtt.connect("wss://mqtt.hsl.fi:443/");

    client.on("connect", () => {
        client.subscribe("/hfp/v2/journey/ongoing/vp/#", (err) => {
            if (err) {
                console.error("Failed to subscribe to topic:", err);
            }
        });
    });

    client.on("message", (_topic, message) => {
        const payload = JSON.parse(message.toString());
        if (payload.VP) {
            update(payload.VP);
        }
    });

    return () => client.end();
}
