import { describe, expect, it } from "vitest";
import { calculateBusTicketPrice, formatPrice } from "./busPriceCalculator";

describe("TicketSafe Interprovincial Bus Price Calculator", () => {
  it("should calculate ECONOMY class price with no multiplier", () => {
    const result = calculateBusTicketPrice(25.0, "ECONOMY");

    expect(result.basePrice).toBe(25.0);
    expect(result.seatClassMultiplier).toBe(1.0);
    expect(result.subtotal).toBe(25.0);
    expect(result.fees).toBe(1.5);
    expect(result.taxes).toBe(Number((25.0 * 0.12).toFixed(2)));
    expect(result.total).toBe(Number((25.0 + 1.5 + 3.0).toFixed(2)));
  });

  it("should apply correct multiplier for SEMI_CAMA class", () => {
    const result = calculateBusTicketPrice(25.0, "SEMI_CAMA");

    expect(result.seatClassMultiplier).toBe(1.3);
    expect(result.subtotal).toBe(32.5);
  });

  it("should apply correct multiplier for CAMA class", () => {
    const result = calculateBusTicketPrice(18.0, "CAMA");

    expect(result.seatClassMultiplier).toBe(1.6);
    expect(result.subtotal).toBe(28.8);
  });

  it("should apply correct multiplier for VIP class", () => {
    const result = calculateBusTicketPrice(25.0, "VIP");

    expect(result.seatClassMultiplier).toBe(2.0);
    expect(result.subtotal).toBe(50.0);
  });

  it("should include 12% taxes and $1.50 service fee in total", () => {
    const result = calculateBusTicketPrice(25.0, "ECONOMY");

    const expectedTotal = Number((25.0 + 1.5 + 25.0 * 0.12).toFixed(2));
    expect(result.total).toBe(expectedTotal);
  });

  it("should format price as USD string", () => {
    expect(formatPrice(25.99)).toBe("$25.99 USD");
    expect(formatPrice(0)).toBe("$0.00 USD");
  });
});
