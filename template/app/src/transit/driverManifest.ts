/**
 * Local offline manifest store for transit bus drivers.
 */

export interface OfflinePassenger {
  manifestId: string;
  passengerName: string;
  nationalId: string;
  seatNumber: string;
  boardingStatus: "PENDING" | "BOARDED" | "NO_SHOW";
}

const DRIVER_MANIFEST_KEY = "SUPER_APP_DRIVER_MANIFEST_CACHE";

export function saveDriverManifestToLocal(manifest: OfflinePassenger[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(DRIVER_MANIFEST_KEY, JSON.stringify(manifest));
    } catch (e) {
      console.warn("[DriverManifest] Failed caching manifest", e);
    }
  }
}

export function loadDriverManifestFromLocal(): OfflinePassenger[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(DRIVER_MANIFEST_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }
  }
  return [];
}
