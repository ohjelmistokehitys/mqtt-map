import { useEffect, useState } from "react";
import type { VehiclePosition } from "../types";
import { subscribeToVehiclePositions } from "./mqttClient";


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
        vehicles: Object.values(vehicleMap),
        connected
    };
}
