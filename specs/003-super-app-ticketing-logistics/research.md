# Technical Research & Architecture Decisions: Unified Super-App (Ticketing, LPR Parking & Transit)

**Feature**: Unified Super-App for Resilient Ticketing, LPR Parking & Interprovincial Transit  
**Directory**: `specs/003-super-app-ticketing-logistics`  
**Date**: 2026-08-07  

---

## 1. Dynamic Rotating QR Codes & Offline Cryptographic Verification

### Decision
Implement a time-based HMAC-SHA256 rotating cryptographic token system (similar to RFC 6238 TOTP with signed digital signature envelopes) combined with an offline manifest cache.

### Rationale
- **Anti-Scalping & Anti-Screenshot**: Every 30 seconds, the client application re-computes a rotating cryptographic token: `HMAC_SHA256(ticket_secret, timestamp_window)`. A static screenshot or screen recording will expire within 30 to 60 seconds, preventing scalpers from taking a screenshot and forwarding it over WhatsApp to multiple buyers.
- **100% Offline Turnstile Verification**: Gate scanners download the event manifest prior to gate opening (encrypted locally in SQLite / IndexedDB). The scanner validates the signature using the event public key and verifies that `HMAC_SHA256(ticket_secret, window)` matches one of the valid tolerance windows (+/- 1 window, 60s window) and records the entry timestamp to prevent double scanning.
- **Monotonic Nonce Revocation**: When a ticket is scanned, the local scanner marks the ticket UUID as consumed. Scanner mesh relays sync consumed nonces via local Wi-Fi / Bluetooth LE gateway mesh without requiring public cloud roundtrips.

### Alternatives Considered
- *Static Encrypted QR*: Vulnerable to instant cloning and duplicate entry via forwarded screenshots.
- *Online WebSocket Auth*: Fails completely in crowded stadiums with cellular saturation ("blank screen effect").
- *NFC-Only (Apple/Google Wallet VAS)*: High hardware barrier for local transit drivers and small parking facilities. Dynamic QR is universally readable by commodity smartphone cameras.

---

## 2. Lock-Screen Widget & Offline PWA Caching Strategy

### Decision
Utilize a Progressive Web App (PWA) architecture with Service Worker Cache Storage API, IndexedDB for persistent encrypted ticket storage, and lock-screen integration using the Web Notifications / Live Activity bridge patterns.

### Rationale
- **Zero-Network Bootstrapping**: Service Worker caches all core app assets, stylesheets, ticket rendering views, and seat coordinates. Once loaded, the user can place their phone in Airplane Mode and view all tickets, QR codes, and parking sessions.
- **Lock-Screen Quick Access**: For mobile browsers and installed PWAs, persistent notifications with action buttons and media/live display metadata allow users to bring the ticket QR code directly onto the lock screen or status bar, bypassing the need to open the browser or unlock apps in crowded turnstile queues.

### Alternatives Considered
- *Native-Only Mobile Builds*: Slower iteration velocity and incompatible with web-first SaaS distributions.
- *Standard Web Application (No Service Worker)*: Results in blank white error screens when cellular signal drops in dense crowds.

---

## 3. Contactless LPR Parking Gate Automation & Background Auto-Billing

### Decision
Implement an event-driven webhook gateway that ingests optical License Plate Recognition (ANPR/LPR) camera triggers, manages stateful parking sessions in PostgreSQL, and debits the user's default payment method asynchronously upon vehicle exit.

### Rationale
- **Frictionless Entry/Exit (<2.0s barrier actuation)**: On vehicle approach, LPR camera captures the license plate and sends an HTTP POST webhook to `/api/parking/lpr-webhook` with `{ plateNumber, facilityId, gateId, eventType: "ENTRY" | "EXIT" }`.
- **Plate Normalization & Matching**: The system strips whitespace/special characters, matches the active `LPRVehicle` entity, verifies account standing, and immediately returns a signed JSON response `{ status: "AUTHORIZED", openBarrier: true }`.
- **Invisible Exit Settlement**: On EXIT, the duration is computed according to the parking facility's tariff tiers (e.g., first 15 mins free, hourly rate). The transaction is debited via the configured payment adapter, emitting an immediate digital receipt via push notification and email.
- **Optical Obscuration Fallback**: If a plate is covered in dirt or unreadable, the entry gate displays a dynamic QR code on an LCD screen that the driver can scan from their phone window in under 2 seconds.

### Alternatives Considered
- *Physical Paper Ticket Dispensers (OPEX)*: Constant maintenance, paper jams, lost ticket disputes, and cashier queues.
- *RFID Windshield Tags*: Requires physical tag shipping, installation, and dedicated RFID hardware readers.

---

## 4. Real-Time Interprovincial Transit GPS & National ID Offline Boarding

### Decision
Implement a dual-layer transit logistics architecture featuring Server-Sent Events (SSE) for real-time live passenger GPS tracking and an offline driver manifest capable of National Civil Identity Number verification.

### Rationale
- **Real-Time Family Journey Sharing**: Passenger trips emit live GPS coordinates from the driver app / on-board vehicle telemetry via SSE stream `/api/transit/trip/:id/telemetry`. Passengers generate an authenticated share token that allows family members to view the vehicle's live map position, current speed, and updated arrival ETA without logging in.
- **Dead-Battery National ID Verification**: If a passenger's phone runs out of battery before boarding, the driver's device possesses the complete offline booking manifest stored in local IndexedDB. The driver inputs the passenger's National ID number, verifies their name and seat number, and marks them as boarded in under 15 seconds.
- **Offline Sync Reconciliation**: Boarding actions taken without internet connectivity are appended to an offline mutation queue and synced to the cloud upon signal restoration.

### Alternatives Considered
- *SMS-Based Tracking Updates*: High per-message cost and provides no live interactive map visualization.
- *Paper Printed Bus Manifests*: Prone to last-minute booking omissions, damage, and lack of real-time seat status visibility.

---

## 5. In-Stadium In-Seat Delivery & Offline Resilient Concession Wallet

### Decision
Establish an in-venue concession ordering pipeline mapped directly to venue seat coordinates (Section, Row, Seat) with an offline-resilient digital wallet supporting optimistic order queueing.

### Rationale
- **Zero Concourse Waiting**: Attendees order food, beverages, or club merchandise from their seats. Orders automatically inherit the seat location from the active digital ticket.
- **Optimistic Wallet Signing**: In poor network conditions, the order is signed with the user's local wallet signature and queued in the Service Worker background sync. As soon as connectivity flickers or local venue Wi-Fi pings, the order dispatches to the nearest concession kitchen runner dispatch screen.
- **Runner QR Delivery Receipt**: When the runner delivers items to the seat, they scan the attendee's seat receipt code, closing the fulfillment cycle with zero cash handling.

### Alternatives Considered
- *Physical Concession Lines Only*: Causes 15-20 minute wait times during halftime, resulting in lost concession revenue.
- *Cash-on-Delivery*: Slows down runners and creates internal theft/loss risks.

---

## 6. Peer-to-Peer In-App Ticket Transfer & Custody Security

### Decision
Design an atomic ticket transfer protocol that creates a cryptographic transfer claim, invalidates the sender's active dynamic QR token, and mints a newly signed token for the recipient upon acceptance.

### Rationale
- **Eliminating Informal PDF Sharing**: Instead of sending vulnerable static PDF files over WhatsApp, the ticket owner clicks "Transfer", enters the recipient's email or phone number.
- **Cryptographic Invalidation**: The sender's dynamic token secret is revoked immediately. If the recipient has not yet accepted, the sender can cancel the transfer and reclaim the ticket.
- **Full Chain-of-Custody Audit**: The system maintains an immutable audit trail of ticket owners, ensuring venue organizers know the exact identity of every attendee occupying a seat.
