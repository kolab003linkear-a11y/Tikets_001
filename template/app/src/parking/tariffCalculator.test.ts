import { describe, it, expect } from "vitest";
import { calculateParkingFee } from "./tariffCalculator";

describe("TicketSafe LPR Parking Tariff Calculator", () => {
  it("should waive parking fees during the 15-minute grace period", () => {
    const entry = new Date("2026-08-07T14:00:00Z");
    const exit = new Date("2026-08-07T14:12:00Z"); // 12 minutes

    const result = calculateParkingFee(entry, exit, 2.5, 15);

    expect(result.durationMinutes).toBe(12);
    expect(result.totalCharged).toBe(0.0);
    expect(result.isGracePeriod).toBe(true);
  });

  it("should charge 1 hour rate for stays between 16 and 60 minutes", () => {
    const entry = new Date("2026-08-07T14:00:00Z");
    const exit = new Date("2026-08-07T14:45:00Z"); // 45 minutes

    const result = calculateParkingFee(entry, exit, 2.5, 15);

    expect(result.durationMinutes).toBe(45);
    expect(result.totalCharged).toBe(2.5);
    expect(result.isGracePeriod).toBe(false);
  });

  it("should compute multi-hour billing accurately", () => {
    const entry = new Date("2026-08-07T14:00:00Z");
    const exit = new Date("2026-08-07T16:30:00Z"); // 2.5 hours -> 3 billable hours

    const result = calculateParkingFee(entry, exit, 2.5, 15);

    expect(result.durationMinutes).toBe(150);
    expect(result.totalCharged).toBe(7.5); // 3 * 2.5
    expect(result.isGracePeriod).toBe(false);
  });
});
