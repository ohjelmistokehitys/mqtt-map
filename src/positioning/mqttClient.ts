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
    // TODO: Implement this function and return a cleanup function that closes the MQTT connection when called.

    return () => { };
}
