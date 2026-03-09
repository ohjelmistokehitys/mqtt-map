import type { MqttClient } from "mqtt";
import mqtt from "mqtt";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { VehiclePosition } from "../types";
import { subscribeToVehiclePositions } from "./mqttClient";

// mock the mqtt module, so we can simulate client without making real network connections
vi.mock("mqtt", () => ({
    default: {
        connect: vi.fn(),
        connectAsync: vi.fn()
    },
}));

describe("subscribeToVehiclePositions", () => {
    let mockClient: Partial<MqttClient>;

    // eventHandlers registered by the code under test, so we can simulate events like 'connect' and 'message'
    let eventHandlers: Record<string, (...args: unknown[]) => void>;

    beforeEach(() => {
        eventHandlers = {};

        mockClient = {
            on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
                eventHandlers[event] = handler;
                return mockClient as MqttClient;
            }),
            subscribe: vi.fn(),
            end: vi.fn(),
        };

        // mock mqtt.connect to return our mock client on both sync and async versions
        vi.mocked(mqtt.connect).mockReturnValue(mockClient as MqttClient);
        vi.mocked(mqtt.connectAsync).mockReturnValue(Promise.resolve(mockClient as MqttClient));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("@connect should connect to the MQTT broker", () => {
        const callback = vi.fn();

        subscribeToVehiclePositions(callback);

        expect(mqtt.connect).toHaveBeenCalledOnce();
    });

    test("@subscribe should subscribe to the vehicle position topic on connect", () => {
        const callback = vi.fn();

        subscribeToVehiclePositions(callback);

        eventHandlers.connect?.();

        expect(mockClient.subscribe).toHaveBeenCalled();
    });

    test("@message should call the callback function with vehicle position data when a message is received", () => {
        const callback = vi.fn();

        subscribeToVehiclePositions(callback);

        // Simulate connection
        eventHandlers.connect?.();

        // Make sure that a message handler was registered
        expect(eventHandlers.message).toBeDefined();

        const mockPayload = {
            VP: {
                desi: "550",
                oper: 12,
                veh: 1234,
                lat: 60.1699,
                long: 24.9384,
            },
        };

        const messageBuffer = Buffer.from(JSON.stringify(mockPayload));

        // Simulate receiving a message
        eventHandlers.message("/hfp/v2/journey/ongoing/vp/test", messageBuffer);

        // Verify the callback function was called
        expect(callback).toHaveBeenCalledTimes(1);

        // Verify the vehicle position was passed with the generated id
        const receivedVehicle: VehiclePosition = callback.mock.lastCall![0];
        expect(receivedVehicle).toMatchObject(mockPayload.VP);
    });

    test("@message should handle multiple messages and call callback for each", () => {
        const callback = vi.fn();

        subscribeToVehiclePositions(callback);
        eventHandlers.connect?.();

        // Send three messages
        for (let i = 0; i < 3; i++) {
            const payload = {
                VP: {
                    oper: 12,
                    veh: 1000 + i,
                    desi: "550",
                    dir: "1" as const,
                    tst: "2024-01-15T10:30:00.000Z",
                },
            };
            eventHandlers.message("/hfp/v2/journey/ongoing/vp/test", Buffer.from(JSON.stringify(payload)));
        }

        expect(callback).toHaveBeenCalledTimes(3);
    });

    test("@cleanup should return a cleanup function that closes the MQTT connection", () => {
        const callback = vi.fn();

        const cleanup = subscribeToVehiclePositions(callback);

        expect(typeof cleanup).toBe("function");

        cleanup();

        expect(mockClient.end).toHaveBeenCalledOnce();
    });
});
