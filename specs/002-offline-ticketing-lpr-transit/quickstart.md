# Quickstart & Validation Guide: Resilient Offline-First Ticketing, LPR Parking & Real-Time Transit Ecosystem

**Feature**: Resilient Offline-First Ticketing, LPR Parking & Real-Time Transit (`002-offline-ticketing-lpr-transit`)  
**Date**: 2026-08-06  

## Runnable Validation Scenarios

### Scenario 1: Offline QR Rendering & National ID Lookup Fallback

1. Purchase a bus/stadium ticket using **User A**.
2. Turn device networking off (Airplane Mode).
3. Open the app ticket wallet -> Verify QR code renders offline.
4. Scan offline QR code with validation device -> Verify gate validation passes offline.
5. Simulate unpowered battery -> Input User A's National ID number into driver validator app -> Verify passenger ticket details display.

---

### Scenario 2: LPR Contactless Parking Ingress & Egress

1. Register license plate `ABC1234` under User A account.
2. Send simulated LPR Entry webhook (`POST /api/lpr/event`, `gateType: ENTRY`).
3. Verify gate response is `OPEN_GATE` and active `ParkingSession` is created.
4. Send simulated LPR Exit webhook (`gateType: EXIT`).
5. Verify fee is computed, auto-debit executed, and gate response is `OPEN_GATE`.
