import { beforeEach, describe, expect, it } from "vitest";
import {
  generateSeatMap,
  getSeatClassPriceMultiplier,
  getLayoutForClass,
  STANDARD_BUS_LAYOUT,
} from "./seatMapper";

describe("TicketSafe Interprovincial Bus Seat Map Engine", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("should generate correct number of seats for 2-2 layout with aisle", () => {
    const seats = generateSeatMap({
      totalRows: 10,
      seatsPerRowLeft: 2,
      seatsPerRowRight: 2,
      aisle: true,
      seatClasses: {},
      blockedSeats: [],
    });

    // 10 rows * 4 seats + 10 aisle markers = 50 total (40 real seats + 10 aisles)
    expect(seats.length).toBe(50);
    expect(seats.filter((s) => !s.isAisle).length).toBe(40);
  });

  it("should mark blocked seats correctly", () => {
    const seats = generateSeatMap({
      totalRows: 2,
      seatsPerRowLeft: 2,
      seatsPerRowRight: 2,
      aisle: true,
      seatClasses: {},
      blockedSeats: ["A1"],
    });

    const seatA1 = seats.find((s) => s.seatNumber === "A1" && !s.isAisle);
    expect(seatA1).toBeDefined();
    expect(seatA1!.isBlocked).toBe(true);

    const seatA2 = seats.find((s) => s.seatNumber === "A2" && !s.isAisle);
    expect(seatA2).toBeDefined();
    expect(seatA2!.isBlocked).toBe(false);
  });

  it("should assign seat classes from the seatClasses map", () => {
    const seats = generateSeatMap({
      totalRows: 2,
      seatsPerRowLeft: 2,
      seatsPerRowRight: 2,
      aisle: true,
      seatClasses: { A1: "VIP", B1: "CAMA" },
      blockedSeats: [],
    });

    const seatA1 = seats.find((s) => s.seatNumber === "A1" && !s.isAisle);
    const seatB1 = seats.find((s) => s.seatNumber === "B1" && !s.isAisle);

    expect(seatA1!.seatClass).toBe("VIP");
    expect(seatB1!.seatClass).toBe("CAMA");
  });

  it("should provide layout presets for standard bus configurations", () => {
    expect(STANDARD_BUS_LAYOUT.ECONOMY_40_SEAT).toBeDefined();
    expect(STANDARD_BUS_LAYOUT.ECONOMY_40_SEAT.totalRows).toBe(10);
    expect(STANDARD_BUS_LAYOUT.VIP_20_SEAT.seatsPerRowLeft).toBe(1);
  });

  it("should return correct price multiplier for each seat class", () => {
    expect(getSeatClassPriceMultiplier("ECONOMY")).toBe(1.0);
    expect(getSeatClassPriceMultiplier("SEMI_CAMA")).toBe(1.3);
    expect(getSeatClassPriceMultiplier("CAMA")).toBe(1.6);
    expect(getSeatClassPriceMultiplier("VIP")).toBe(2.0);
  });

  it("should return layout name for each seat class", () => {
    expect(getLayoutForClass("ECONOMY")).toBe("ECONOMY_40_SEAT");
    expect(getLayoutForClass("VIP")).toBe("VIP_20_SEAT");
  });
});
