import { describe, expect, it } from "vitest";
import {
  computeBusTicketQrPayload,
  decodeBusTicketPayload,
  isBusTicketPayloadValid,
} from "./ticketQrGenerator";

describe("TicketSafe Bus Ticket QR Payload Engine", () => {
  const scheduleId = "sched_01";
  const seatNumber = "A12";

  it("should generate deterministic payload for identical timestamps", () => {
    const timestamp = 1723000000000;
    const payloadA = computeBusTicketQrPayload(scheduleId, seatNumber, timestamp);
    const payloadB = computeBusTicketQrPayload(scheduleId, seatNumber, timestamp);

    expect(payloadA).toBe(payloadB);
    expect(payloadA).toContain("TKT");
    expect(payloadA).toContain(scheduleId);
    expect(payloadA).toContain(seatNumber);
  });

  it("should generate distinct payloads for different timestamps", () => {
    const base = 1723000000000;
    const payloadA = computeBusTicketQrPayload(scheduleId, seatNumber, base);
    const payloadB = computeBusTicketQrPayload(scheduleId, seatNumber, base + 86400000);

    expect(payloadA).not.toBe(payloadB);
  });

  it("should decode a valid payload back to schedule, seat, and timestamp", () => {
    const timestamp = 1723000000000;
    const payload = computeBusTicketQrPayload(scheduleId, seatNumber, timestamp);

    const decoded = decodeBusTicketPayload(payload);
    expect(decoded).not.toBeNull();
    expect(decoded!.scheduleId).toBe("sched_01");
    expect(decoded!.seatNumber).toBe("A12");
    expect(decoded!.timestamp).toBe(timestamp);
  });

  it("should return null for malformed payloads", () => {
    expect(decodeBusTicketPayload("INVALID_PAYLOAD")).toBeNull();
    expect(decodeBusTicketPayload("TKT|sched_01|A12")).toBeNull();
    expect(decodeBusTicketPayload("")).toBeNull();
    expect(decodeBusTicketPayload("TKT|bad|payload|!")).toBeNull();
  });

  it("should validate payload within the max age window", () => {
    const payload = computeBusTicketQrPayload(
      scheduleId,
      seatNumber,
      Date.now() - 1000 * 60 * 30, // 30 minutes ago
    );
    expect(isBusTicketPayloadValid(payload, 48 * 60 * 60 * 1000)).toBe(true);
  });

  it("should reject payload older than max age", () => {
    const payload = computeBusTicketQrPayload(
      scheduleId,
      seatNumber,
      Date.now() - 1000 * 60 * 60 * 72, // 72 hours ago
    );
    expect(isBusTicketPayloadValid(payload, 48 * 60 * 60 * 1000)).toBe(false);
  });
});
