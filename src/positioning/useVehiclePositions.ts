import { useEffect, useState } from "react";
import type { VehiclePosition } from "../types";
import { subscribeToVehiclePositions } from "./mqttClient";

// The number of seconds after which a vehicle position is considered outdated and should not be displayed on the map.
const POSITION_DATA_EXPIRATION_SECONDS = 60;

/**
 * This hook manages the state of vehicle positions by subscribing to real-time updates from an MQTT broker. 
 * It maintains a map of vehicle IDs to their latest positions and provides an array of vehicles.
 */
export function useVehiclePositions() {
    // `vehiclePositions` is a state variable that holds the latest position data for each vehicle, indexed by a unique vehicle ID.
    const [vehiclePositions, setVehiclePositions] = useState<Record<string, VehiclePosition>>({});

    useEffect(() => {
        return subscribeToVehiclePositions((vehicle) => {
            // create a unique ID for the vehicle based on its operator and vehicle number
            const id = `${vehicle.oper}/${vehicle.veh}`;

            // copy previous state and update the position of the vehicle that was received
            setVehiclePositions((prev) => ({ ...prev, [id]: vehicle }));
        });
    }, []);

    return {
        vehicles: filterVehiclesForDisplay(Object.values(vehiclePositions))
    };
}

/**
 * Utility function for filtering the list of vehicles to include only those that have recent position data and valid coordinates.
 */
function filterVehiclesForDisplay(vehicles: VehiclePosition[]): VehiclePosition[] {
    const now = Date.now() / 1000; // current time in seconds

    return vehicles
        .filter(vehicle => vehicle.tsi > now - POSITION_DATA_EXPIRATION_SECONDS) // only include vehicles with data from the last 60 seconds
        .filter(vehicle => vehicle.lat && vehicle.long); // only include vehicles with valid coordinates
}
