# Interface Contracts: Unified Super-App (Ticketing, LPR Parking & Transit)

**Feature**: Unified Super-App for Resilient Ticketing, LPR Parking & Interprovincial Transit  
**Directory**: `specs/003-super-app-ticketing-logistics/contracts`  
**Date**: 2026-08-07

---

## 1. Wasp Operations (Queries & Actions)

### Ticketing & Dynamic Tokens

```typescript
// Query: Fetch all tickets for current authenticated user with decrypted local seeds
query getUserTickets {
  fn: import { getUserTickets } from "@src/ticketing/operations",
  entities: [Ticket, DynamicToken]
}

// Action: Generate next rotating dynamic token signature
action generateDynamicQRToken {
  fn: import { generateDynamicQRToken } from "@src/ticketing/operations",
  entities: [Ticket, DynamicToken]
}

// Action: Scan & Validate Dynamic Ticket (Used by Gate Staff)
action validateTicketEntry {
  fn: import { validateTicketEntry } from "@src/ticketing/operations",
  entities: [Ticket, DynamicToken]
}

// Action: Initiate in-app ticket transfer to recipient
action transferTicket {
  fn: import { transferTicket } from "@src/ticketing/operations",
  entities: [Ticket, TicketTransfer, User]
}
```

### LPR Parking Automation

```typescript
// Query: Get registered vehicles and active parking sessions
query getDriverVehiclesAndSessions {
  fn: import { getDriverVehiclesAndSessions } from "@src/parking/operations",
  entities: [LPRVehicle, ParkingSession, ParkingFacility]
}

// Action: Register new vehicle license plate
action registerVehiclePlate {
  fn: import { registerVehiclePlate } from "@src/parking/operations",
  entities: [LPRVehicle]
}

// Action: Manual fallback parking QR exit scan
action manualExitQRScan {
  fn: import { manualExitQRScan } from "@src/parking/operations",
  entities: [ParkingSession, LPRVehicle, ParkingFacility]
}
```

### Transit GPS & National ID Manifest

```typescript
// Query: Get trip details and public telemetry share info
query getTripDetails {
  fn: import { getTripDetails } from "@src/transit/operations",
  entities: [TransitTrip, TransitRoute, PassengerManifestEntry]
}

// Query: Fetch complete driver offline manifest for trip
query getDriverTripManifest {
  fn: import { getDriverTripManifest } from "@src/transit/operations",
  entities: [TransitTrip, PassengerManifestEntry]
}

// Action: Validate passenger boarding by National ID (Driver fallback)
action validatePassengerBoarding {
  fn: import { validatePassengerBoarding } from "@src/transit/operations",
  entities: [PassengerManifestEntry, TransitTrip]
}

// Action: Driver broadcast GPS coordinate update
action updateBusTelemetry {
  fn: import { updateBusTelemetry } from "@src/transit/operations",
  entities: [TransitTrip]
}
```

### In-Stadium In-Seat Delivery

```typescript
// Query: Fetch venue concession menu and active seat orders
query getSeatConcessionMenuAndOrders {
  fn: import { getSeatConcessionMenuAndOrders } from "@src/concessions/operations",
  entities: [InStadiumVenue, ConcessionOrder, Ticket]
}

// Action: Submit seat-side concession order (supports offline optimistic queueing)
action submitSeatOrder {
  fn: import { submitSeatOrder } from "@src/concessions/operations",
  entities: [ConcessionOrder, Ticket, User]
}

// Action: Concession runner scan and confirm seat delivery
action confirmSeatDelivery {
  fn: import { confirmSeatDelivery } from "@src/concessions/operations",
  entities: [ConcessionOrder]
}
```

---

## 2. External Webhook & Streaming Contracts

### LPR Camera Event Webhook (`POST /api/parking/lpr-webhook`)

**Request**:

```json
{
  "cameraHardwareId": "CAM-NORTH-ENTRY-01",
  "facilityId": "fac_9921",
  "gateId": "GATE-IN-A",
  "eventType": "ENTRY",
  "plateNumber": "PCH-4921",
  "confidenceScore": 0.985,
  "snapshotImageUrl": "https://lpr-camera.internal/snaps/20260807-PCH4921.jpg",
  "timestamp": "2026-08-07T20:30:00Z"
}
```

**Response (Success - Actuate Barrier)**:

```json
{
  "status": "AUTHORIZED",
  "openBarrier": true,
  "barrierRelayPulseMs": 1500,
  "sessionId": "sess_88123",
  "driverName": "Carlos Mendoza",
  "displayMessage": "Bienvenido Carlos - Barrera Abierta"
}
```

---

### Real-Time Transit GPS SSE Stream (`GET /api/transit/live/:shareToken`)

**Event Payload (`event: location_update`)**:

```json
{
  "tripId": "trip_4021",
  "busUnit": "Unidad 14 - Flota Imbabura",
  "driverName": "Raúl Fuentes",
  "latitude": -0.180653,
  "longitude": -78.467834,
  "speedKmh": 78.5,
  "nextWaypoint": "Terminal Terrestre Carcelén",
  "estimatedArrival": "2026-08-07T22:45:00Z",
  "timestamp": "2026-08-07T20:35:12Z"
}
```

---

## 3. Offline Service Worker & IndexedDB Schema

```typescript
export interface OfflineVaultStore {
  tickets: {
    ticketId: string;
    eventTitle: string;
    venueName: string;
    seatZone: string;
    seatRow: string;
    seatNumber: string;
    ticketSecret: string;
    validDate: string;
  }[];
  driverManifests: {
    tripId: string;
    passengers: {
      manifestId: string;
      passengerName: string;
      nationalId: string;
      seatNumber: string;
      boardingStatus: "PENDING" | "BOARDED" | "NO_SHOW";
    }[];
  }[];
  queuedConcessionOrders: {
    clientOrderId: string;
    ticketId: string;
    seatZone: string;
    seatRow: string;
    seatNumber: string;
    items: { itemName: string; quantity: number; price: number }[];
    totalAmount: number;
    queuedAt: string;
  }[];
}
```
