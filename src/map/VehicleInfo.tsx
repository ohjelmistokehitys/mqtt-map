import type { VehiclePosition } from '../types';

export function VehicleInfo({ vehicle }: { vehicle: VehiclePosition; }) {
    return <table className="vehicle-info">
        <tbody>
            <tr>
                <td>Route number</td>
                <td>{vehicle.desi}</td>
            </tr>
            <tr>
                <td>Line</td>
                <td>{vehicle.line}</td>
            </tr>
            <tr>
                <td>Operator</td>
                <td>{vehicle.oper}</td>
            </tr>
            <tr>
                <td>Vehicle</td>
                <td>{vehicle.veh}</td>
            </tr>
            <tr>
                <td>Speed</td>
                <td>{displaySpeed(vehicle.spd)}</td>
            </tr>
        </tbody>
    </table>;
}

function displaySpeed(metersPerSecond?: number) {
    const kmh = (metersPerSecond ?? 0) * 3.6;
    return kmh.toFixed(1) + " km/h";
}
