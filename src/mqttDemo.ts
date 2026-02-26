import { subscribeToVehiclePositions } from "./positioning/mqttClient.js";

subscribeToVehiclePositions((vehiclePosition) => {
    console.log(`Vehicle ${vehiclePosition.id} is at latitude ${vehiclePosition.lat} and longitude ${vehiclePosition.long} going ${vehiclePosition.spd} m/s.`);
});
