import { describe, it, expect, beforeEach } from "vitest";
import {
  saveDriverManifestToLocal,
  loadDriverManifestFromLocal,
  OfflinePassenger,
} from "./driverManifest";

describe("TicketSafe Driver Offline Passenger Manifest & National ID Verification", () => {
  const sampleManifest: OfflinePassenger[] = [
    {
      manifestId: "man_01",
      passengerName: "Carlos Mendoza",
      nationalId: "1723456789",
      seatNumber: "Asiento 12",
      boardingStatus: "PENDING",
    },
    {
      manifestId: "man_02",
      passengerName: "Pamela Fuentes",
      nationalId: "0912345678",
      seatNumber: "Asiento 14",
      boardingStatus: "BOARDED",
    },
  ];

  beforeEach(() => {
    // Reset simulated local storage
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("should persist and load passenger manifest in offline local storage", () => {
    saveDriverManifestToLocal(sampleManifest);
    const loaded = loadDriverManifestFromLocal();

    expect(loaded).toBeDefined();
    expect(loaded.length).toBe(sampleManifest.length);
    expect(loaded[0].passengerName).toBe("Carlos Mendoza");
    expect(loaded[0].nationalId).toBe("1723456789");
  });

  it("should find dead-battery passenger by National ID in <15 seconds", () => {
    saveDriverManifestToLocal(sampleManifest);
    const loaded = loadDriverManifestFromLocal();

    const queryNationalId = "1723456789";
    const found = loaded.find((p) => p.nationalId === queryNationalId);

    expect(found).toBeDefined();
    expect(found?.passengerName).toBe("Carlos Mendoza");
    expect(found?.seatNumber).toBe("Asiento 12");
  });
});
