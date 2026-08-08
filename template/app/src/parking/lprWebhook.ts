/**
 * Optical ANPR/LPR Camera Webhook Receiver & Gate Barrier Relay Actuator.
 * Processes sub-2-second vehicle recognition and invisible background settlement.
 */

import { calculateParkingFee } from "./tariffCalculator";

export interface LprWebhookPayload {
  cameraHardwareId: string;
  facilityId: string;
  gateId: string;
  eventType: "ENTRY" | "EXIT";
  plateNumber: string;
  confidenceScore: number;
  snapshotImageUrl?: string;
  timestamp: string;
}

export function processLprCameraEvent(payload: LprWebhookPayload) {
  const normalizedPlate = payload.plateNumber.toUpperCase().replace(/\s+/g, "");

  if (payload.eventType === "ENTRY") {
    return {
      status: "AUTHORIZED",
      openBarrier: true,
      barrierRelayPulseMs: 1500,
      plateNumber: normalizedPlate,
      entryTime: new Date().toISOString(),
      displayMessage: `Bienvenido [${normalizedPlate}] - Barrera Abierta`,
    };
  }

  // EXIT Event: Compute duration and auto-debit
  const simulatedEntryTime = new Date(Date.now() - 1000 * 60 * 75); // 75 mins
  const fee = calculateParkingFee(simulatedEntryTime, new Date(), 2.5, 15);

  return {
    status: "AUTHORIZED",
    openBarrier: true,
    barrierRelayPulseMs: 1800,
    plateNumber: normalizedPlate,
    durationMinutes: fee.durationMinutes,
    totalCharged: fee.totalCharged,
    receiptUrl: `/receipts/lpr-${normalizedPlate}-${Date.now()}.pdf`,
    displayMessage: `Hasta pronto [${normalizedPlate}] - Cobro automático: $${fee.totalCharged.toFixed(2)}`,
  };
}
