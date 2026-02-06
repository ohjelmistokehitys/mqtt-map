import { useEffect, useState } from "react";
import { subscribeToVehiclePositions } from "./mqttClient";
import type { VehiclePosition } from "./types";


export function useVehiclePositions() {
    const [vehicleMap, setVehicleMap] = useState<Record<string, VehiclePosition>>({});
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        return subscribeToVehiclePositions((pos) => {
            setConnected(true);
            setVehicleMap((prev) => ({ ...prev, [vehicleKey(pos)]: pos }));
        });
    }, []);

    return {
        vehicles: Object.values(vehicleMap),
        connected
    };
}

const vehicleKey = (vp: VehiclePosition) => `${vp.oper}/${vp.veh}`;
