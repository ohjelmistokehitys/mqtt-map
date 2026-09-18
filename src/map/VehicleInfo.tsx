import type { VehiclePosition } from '../types';

/**
 * React component for displaying more detailed information about a single vehicle.
 */
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
            <tr>
                <td>Timetable</td>
                <td>{timetableInfo(vehicle.dl)}</td>
            </tr>
        </tbody>
    </table>;
}

/**
 * Utility function for displaying the speed of a vehicle in km/h.
 */
function displaySpeed(metersPerSecond?: number) {
    const kmh = (metersPerSecond ?? 0) * 3.6;
    return kmh.toFixed(1) + " km/h";
}

/**
 * Formats a textual representation of the late / early status of the vehicle.
 */
function timetableInfo(dl: number) {
    if (dl === null) {
        return "unkown";
    }

    return dl >= 0 ? `${dl} seconds early` : `${-dl} seconds late`;
}
