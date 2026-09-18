/*
 * This file contains a simple demo script that subscribes to the vehicle position topic and logs the received data to the console.
 * This can be used to test your MQTT client implementation without needing to run the full React application.
 *
 * You are allowed but not expected to modify this file in the exercise. Instead, make your changes in the mqttClient.ts file.
 */

import { subscribeToVehiclePositions } from "./positioning/mqttClient.ts";
import type { VehiclePosition } from "./types.js";

/** Receives a vehicle position and logs it to the console in a human-readable format. */
function logVehicleLocation(vehicle: VehiclePosition) {
    console.log(`Vehicle ${vehicle.oper}/${vehicle.veh} is at latitude ${vehicle.lat} and longitude ${vehicle.long} going ${vehicle.spd} m/s.`);
}

function main() {
    console.log("Subscribing to vehicle position updates...");

    // Subscribe to vehicle position updates and receive them through the `receiveVehiclePosition` callback function.
    const unsubscribe = subscribeToVehiclePositions(logVehicleLocation);

    // For demonstration purposes, we will unsubscribe after 10 seconds to stop receiving updates:
    setTimeout(() => {
        console.log("Unsubscribing from vehicle position updates.");
        unsubscribe();
    }, 10_000);
}

main();
