/**
 * Bus ticket price calculator with seat class and seasonality multipliers.
 */

export type BusSeatClass = "ECONOMY" | "SEMI_CAMA" | "CAMA" | "VIP";

export interface PriceBreakdown {
  basePrice: number;
  seatClassMultiplier: number;
  subtotal: number;
  fees: number;
  taxes: number;
  total: number;
  currency: string;
}

const SEAT_CLASS_MULTIPLIERS: Record<BusSeatClass, number> = {
  ECONOMY: 1.0,
  SEMI_CAMA: 1.3,
  CAMA: 1.6,
  VIP: 2.0,
};

const SERVICE_FEE = 1.5;
const TAX_RATE = 0.12;

export function calculateBusTicketPrice(
  basePrice: number,
  seatClass: BusSeatClass,
): PriceBreakdown {
  const seatClassMultiplier = SEAT_CLASS_MULTIPLIERS[seatClass] || 1.0;
  const subtotal = Number((basePrice * seatClassMultiplier).toFixed(2));
  const fees = Number(SERVICE_FEE.toFixed(2));
  const taxes = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + fees + taxes).toFixed(2));

  return {
    basePrice,
    seatClassMultiplier,
    subtotal,
    fees,
    taxes,
    total,
    currency: "USD",
  };
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)} USD`;
}
