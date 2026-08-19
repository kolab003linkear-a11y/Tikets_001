import { describe, expect, it } from "vitest";
import { processLprCameraEvent } from "./lprWebhook";

describe("TicketSafe LPR Camera Webhook & Barrier Relay Engine", () => {
  it("should authorize ENTRY event and trigger barrier pulse in <2.0s without dispensing paper", () => {
    const payload = {
      cameraHardwareId: "ANPR-OPTICAL-CAM-01",
      facilityId: "fac_quicentro_01",
      gateId: "GATE-NORTH-IN",
      eventType: "ENTRY" as const,
      plateNumber: "pch 4921",
      confidenceScore: 0.985,
      timestamp: new Date().toISOString(),
    };

    const result = processLprCameraEvent(payload);

    expect(result.status).toBe("AUTHORIZED");
    expect(result.openBarrier).toBe(true);
    expect(result.plateNumber).toBe("PCH4921"); // Normalized
    expect(result.barrierRelayPulseMs).toBeLessThanOrEqual(2000);
    expect(result.displayMessage).toContain("Bienvenido [PCH4921]");
  });

  it("should process EXIT event, calculate duration fee, and open barrier for invisible billing", () => {
    const payload = {
      cameraHardwareId: "ANPR-OPTICAL-CAM-02",
      facilityId: "fac_quicentro_01",
      gateId: "GATE-SOUTH-OUT",
      eventType: "EXIT" as const,
      plateNumber: "PCH-4921",
      confidenceScore: 0.992,
      timestamp: new Date().toISOString(),
    };

    const result = processLprCameraEvent(payload);

    expect(result.status).toBe("AUTHORIZED");
    expect(result.openBarrier).toBe(true);
    expect(result.plateNumber).toBe("PCH-4921");
    expect(result.totalCharged).toBeGreaterThan(0);
    expect(result.receiptUrl).toBeDefined();
    expect(result.displayMessage).toContain("Cobro automático");
  });
});
