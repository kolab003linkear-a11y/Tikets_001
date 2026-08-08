# Interface Contract: Ticketing, LPR Parking & Transit Operations

**Feature**: Resilient Offline-First Ticketing, LPR Parking & Real-Time Transit (`002-offline-ticketing-lpr-transit`)  
**Date**: 2026-08-06  

## Operations Overview

Defined as Wasp Actions, Queries, and API Webhook Endpoints.

---

### 1. `getOfflineTicketVault` (Query)

Retrieves encrypted cryptographic offline payload items for local caching.

- **Input**: `void`
- **Output**:
  ```ts
  type OfflineTicketVaultItem = {
    ticketId: string;
    eventOrTripTitle: string;
    passengerName: string;
    nationalId: string;
    seatNumber?: string;
    qrPayload: string; // Crypto signed payload string
  }[]
  ```

---

### 2. `processLprCameraEvent` (API Webhook Endpoint)

Received when an LPR camera detects a license plate at parking ingress or egress gates.

- **Endpoint**: `POST /api/lpr/event`
- **Input**:
  ```json
  {
    "cameraId": "GATE_ENTRY_01",
    "licensePlate": "ABC1234",
    "eventTime": "2026-08-06T23:00:00Z",
    "gateType": "ENTRY" | "EXIT"
  }
  ```
- **Output**:
  ```json
  {
    "action": "OPEN_GATE" | "DENY_ACCESS",
    "sessionId": "sess_99812",
    "reason": "Registered vehicle matched"
  }
  ```

---

### 3. `getTransitTripStatus` (Query / SSE)

Retrieves real-time GPS coordinates and seat matrix for a transit trip.

- **Input**: `{ tripId: string }`
- **Output**:
  ```ts
  type TransitTripStatusPayload = {
    tripId: string;
    currentLat: number;
    currentLng: number;
    lastGpsUpdate: string;
    seats: {
      id: string;
      label: string;
      isAvailable: boolean;
      price: number;
    }[];
  }
  ```

---

### 4. `transferTicket` (Action)

Generates a secure claim token link to transfer a ticket to a companion.

- **Input**: `{ ticketId: string, recipientEmail: string }`
- **Output**: `{ transferToken: string, claimUrl: string }`
