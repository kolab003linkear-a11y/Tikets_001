/**
 * QR payload generator for bus tickets.
 *
 * Format: TKT|<scheduleId>|<seatNumber>|<base36_timestamp>
 *
 * Uses `|` as the field delimiter so that schedule IDs containing underscores
 * (e.g. "sched_01") are parsed correctly.
 */

export function computeBusTicketQrPayload(
  scheduleId: string,
  seatNumber: string,
  timestamp: number,
): string {
  const ts = Math.floor(timestamp / 1000).toString(36).toUpperCase();
  return `TKT|${scheduleId}|${seatNumber}|${ts}`;
}

export interface DecodedBusTicketPayload {
  scheduleId: string;
  seatNumber: string;
  timestamp: number;
}

export function decodeBusTicketPayload(
  payload: string,
): DecodedBusTicketPayload | null {
  if (!payload || !payload.startsWith("TKT|")) return null;

  const parts = payload.split("|");
  if (parts.length !== 4) return null;

  const [_, scheduleId, seatNumber, tsStr] = parts;
  const timestamp = parseInt(tsStr, 36) * 1000;

  if (isNaN(timestamp)) return null;

  return { scheduleId, seatNumber, timestamp };
}

export function getCurrentWindowEpoch(intervalSeconds = 30): number {
  return Math.floor(Date.now() / 1000 / intervalSeconds);
}

export function isBusTicketPayloadValid(
  payload: string,
  maxAgeMs: number = 48 * 60 * 60 * 1000,
): boolean {
  const decoded = decodeBusTicketPayload(payload);
  if (!decoded) return false;

  const age = Date.now() - decoded.timestamp;
  return age >= 0 && age <= maxAgeMs;
}
