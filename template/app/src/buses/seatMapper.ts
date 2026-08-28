/**
 * Bus seat layout generator. Creates a seat map based on common
 * interprovincial bus configurations (2-2, 2-1, 3-1, etc.).
 */

export type BusSeatClass = "ECONOMY" | "SEMI_CAMA" | "CAMA" | "VIP";

export interface SeatInfo {
  seatNumber: string;
  seatClass: BusSeatClass;
  x: number;
  y: number;
  row: string;
  isAisle: boolean;
  isBlocked: boolean;
}

export interface SeatMapConfig {
  totalRows: number;
  seatsPerRowLeft: number;
  seatsPerRowRight: number;
  aisle?: boolean;
  seatClasses?: { [seatNumber: string]: BusSeatClass };
  blockedSeats?: string[];
}

export function generateSeatMap(config: SeatMapConfig): SeatInfo[] {
  const {
    totalRows,
    seatsPerRowLeft,
    seatsPerRowRight,
    aisle = true,
    seatClasses = {},
    blockedSeats = [],
  } = config;

  const seats: SeatInfo[] = [];
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let row = 0; row < totalRows; row++) {
    const rowLetter = rowLabels[row] || String.fromCharCode(65 + row);
    let x = 0;
    let leftSeatNumber = 1;

    // Left side seats
    for (let i = 0; i < seatsPerRowLeft; i++) {
      const seatNumber = `${rowLetter}${leftSeatNumber}`;
      seats.push({
        seatNumber,
        seatClass: seatClasses[seatNumber] || "ECONOMY",
        x,
        y: row,
        row: rowLetter,
        isAisle: false,
        isBlocked: blockedSeats.includes(seatNumber),
      });
      leftSeatNumber++;
      x++;
    }

    // Aisle marker (virtual seat for layout spacing)
    if (aisle) {
      seats.push({
        seatNumber: "",
        seatClass: "ECONOMY",
        x,
        y: row,
        row: rowLetter,
        isAisle: true,
        isBlocked: false,
      });
      x++;
    }

    // Right side seats (continuing numbering from left side)
    for (let i = 0; i < seatsPerRowRight; i++) {
      const seatNumber = `${rowLetter}${leftSeatNumber}`;
      seats.push({
        seatNumber,
        seatClass: seatClasses[seatNumber] || "ECONOMY",
        x,
        y: row,
        row: rowLetter,
        isAisle: false,
        isBlocked: blockedSeats.includes(seatNumber),
      });
      leftSeatNumber++;
      x++;
    }
  }

  return seats;
}

export const STANDARD_BUS_LAYOUT: Record<string, SeatMapConfig> = {
  ECONOMY_40_SEAT: {
    totalRows: 10,
    seatsPerRowLeft: 2,
    seatsPerRowRight: 2,
    aisle: true,
  },
  SEMI_CAMA_35_SEAT: {
    totalRows: 7,
    seatsPerRowLeft: 2,
    seatsPerRowRight: 2,
    aisle: true,
  },
  CAMA_28_SEAT: {
    totalRows: 7,
    seatsPerRowLeft: 2,
    seatsPerRowRight: 2,
    aisle: true,
  },
  VIP_20_SEAT: {
    totalRows: 5,
    seatsPerRowLeft: 1,
    seatsPerRowRight: 1,
    aisle: true,
  },
};

export function getLayoutForClass(seatClass: BusSeatClass): string {
  const map: Record<BusSeatClass, string> = {
    ECONOMY: "ECONOMY_40_SEAT",
    SEMI_CAMA: "SEMI_CAMA_35_SEAT",
    CAMA: "CAMA_28_SEAT",
    VIP: "VIP_20_SEAT",
  };
  return map[seatClass] || "ECONOMY_40_SEAT";
}

export function getSeatClassPriceMultiplier(seatClass: BusSeatClass): number {
  const multipliers: Record<BusSeatClass, number> = {
    ECONOMY: 1.0,
    SEMI_CAMA: 1.3,
    CAMA: 1.6,
    VIP: 2.0,
  };
  return multipliers[seatClass] || 1.0;
}
