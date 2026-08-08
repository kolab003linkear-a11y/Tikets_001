/**
 * Parking tariff & duration calculator with grace period support.
 */

export interface ParkingTariffResult {
  durationMinutes: number;
  totalCharged: number;
  isGracePeriod: boolean;
  rateApplied: number;
}

export function calculateParkingFee(
  entryTime: Date,
  exitTime: Date = new Date(),
  hourlyTariff = 2.5,
  gracePeriodMins = 15
): ParkingTariffResult {
  const diffMs = exitTime.getTime() - entryTime.getTime();
  const durationMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

  if (durationMinutes <= gracePeriodMins) {
    return {
      durationMinutes,
      totalCharged: 0.0,
      isGracePeriod: true,
      rateApplied: hourlyTariff,
    };
  }

  // Calculate billable hours (rounded up to nearest fraction/hour)
  const billableHours = Math.ceil(durationMinutes / 60);
  const totalCharged = Number((billableHours * hourlyTariff).toFixed(2));

  return {
    durationMinutes,
    totalCharged,
    isGracePeriod: false,
    rateApplied: hourlyTariff,
  };
}
