import { useEffect, useState } from "react";
import type { VehiclePosition } from "../types";
import { subscribeToVehiclePositions } from "./mqttClient";

const POSITION_DATA_EXPIRATION_SECONDS = 60;

export function useVehiclePositions() {
    const [vehicleMap, setVehicleMap] = useState<Record<string, VehiclePosition>>({});
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        return subscribeToVehiclePositions((vehicle) => {
            setConnected(true);
            setVehicleMap((prev) => ({
                ...prev,
                [vehicle.id]: vehicle
            }));
        });
    }, []);

    return {
        vehicles: filterVehiclesForDisplay(Object.values(vehicleMap)),
        connected
    };
}


function filterVehiclesForDisplay(vehicles: VehiclePosition[]): VehiclePosition[] {
    const now = Date.now() / 1000; // current time in seconds

    return vehicles
        .filter(vehicle => vehicle.tsi > now - POSITION_DATA_EXPIRATION_SECONDS) // only include vehicles with data from the last 60 seconds
        .filter(vehicle => vehicle.lat && vehicle.long); // only include vehicles with valid coordinates
}
