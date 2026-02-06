/*
 * Types for vehicle position messages
 * These types have been generated based on the examples and documentation
 * at https://digitransit.fi/en/developers/apis/5-realtime-api/vehicle-positions/high-frequency-positioning/#the-payload.
 */

/**
 * Wrapper for a vehicle position (VP) message
 */
export type VehiclePositionPayload = {
    VP: VehiclePosition;
}

/**
 * Vehicle position message (example-specific)
 */
export type VehiclePosition = {
    /**
     * Route number visible to passengers.
     */
    desi: string;

    /**
     * Route direction of the trip.
     * Either "1" or "2".
     */
    dir: "1" | "2";

    /**
     * Unique ID of the operator running the trip.
     * No prefix zeroes.
     */
    oper: number;

    /**
     * Vehicle number painted on the side of the vehicle.
     */
    veh: number;

    /**
     * UTC timestamp with millisecond precision (ISO 8601).
     */
    tst: string;

    /**
     * Unix timestamp in seconds.
     */
    tsi: number;

    /**
     * Speed of the vehicle in meters per second (m/s).
     */
    spd: number;

    /**
     * Heading in degrees (0–360), clockwise from geographic north.
     */
    hdg: number;

    /**
     * WGS 84 latitude in degrees.
     */
    lat: number;

    /**
     * WGS 84 longitude in degrees.
     */
    long: number;

    /**
     * Acceleration in meters per second squared (m/s²).
     * Negative values indicate deceleration.
     */
    acc: number;

    /**
     * Offset from scheduled timetable in seconds.
     * Positive = ahead of schedule, negative = behind.
     */
    dl: number;

    /**
     * Odometer reading since start of trip.
     * Unit as provided by the source (example value shown).
     */
    odo: number;

    /**
     * Door status.
     * 0 = all doors closed
     * 1 = at least one door open
     */
    drst: 0 | 1;

    /**
     * Operating day of the trip (YYYY-MM-DD).
     */
    oday: string;

    /**
     * Internal journey descriptor.
     */
    jrn: number;

    /**
     * Internal line descriptor.
     */
    line: number;

    /**
     * Scheduled start time of the trip (HH:mm, local time).
     */
    start: string;

    /**
     * Location source.
     * GPS = received from GPS.
     */
    loc: "GPS" | "ODO" | "MAN" | "DR" | "N/A";

    /**
     * Stop ID related to the event.
     * Null when not related to any stop.
     */
    stop: string | null;

    /**
     * Route ID the vehicle is currently running on.
     */
    route: string;

    /**
     * Passenger occupancy level (0–100).
     * 0 = vehicle has space.
     */
    occu: number;
}
