import { subscribeToVehiclePositions } from "./positioning/mqttClient.js";
import type { VehiclePosition } from "./types.js";

// Receives a vehicle position and logs it to the console in a human-readable format.
function receiveVehiclePosition(position: VehiclePosition) {
    console.log(`Vehicle ${position.id} is at latitude ${position.lat} and longitude ${position.long} going ${position.spd} m/s.`);
}

function main() {
    console.log("Subscribing to vehicle position updates...");

    // Subscribe to vehicle position updates and receive them through the `receiveVehiclePosition` callback function.
    const unsubscribe = subscribeToVehiclePositions(receiveVehiclePosition);

    // For demonstration purposes, we will unsubscribe after 10 seconds to stop receiving updates:
    setTimeout(() => {
        console.log("Unsubscribing from vehicle position updates.");
        unsubscribe();
    }, 10_000);
}

main();
