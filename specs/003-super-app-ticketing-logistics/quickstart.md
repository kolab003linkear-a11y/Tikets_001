# Quickstart & Verification Guide: Unified Super-App (Ticketing, LPR Parking & Transit)

**Feature**: Unified Super-App for Resilient Ticketing, LPR Parking & Interprovincial Transit  
**Directory**: `specs/003-super-app-ticketing-logistics`  
**Date**: 2026-08-07  

---

## 1. Prerequisites & Environment Setup

Ensure the development environment has Node.js v20+, npm, and PostgreSQL active:

```bash
# Navigate to the app directory
cd template/app

# Ensure database schema is migrated
wasp db migrate-dev

# Start local full-stack development server
wasp start
```

---

## 2. End-to-End Validation Scenarios

### Scenario A: Offline Dynamic QR Code Presentation & Scanning
1. **Purchase/Generate Ticket**:
   - Log in as an attendee and navigate to `/tickets`.
   - Verify that an active ticket appears with seat details (e.g., Section North, Row 14, Seat 2).
2. **Simulate 100% Offline State**:
   - Open browser DevTools -> **Network** tab -> select **Offline** (or enable Airplane Mode on a mobile device).
   - Refresh the page or view the ticket modal.
   - **Expected Outcome**: The ticket view loads immediately from the Service Worker cache, and the dynamic QR rotates every 30 seconds without network errors.
3. **Turnstile Scan Validation**:
   - Open a secondary window as Gate Staff (`/gate-scanner`).
   - Scan the attendee's dynamic QR code.
   - **Expected Outcome**: The scanner validates the cryptographic timestamp signature locally and confirms entry in under 1 second. Attempting to scan a 2-minute-old static screenshot fails with `TOKEN_EXPIRED`.

---

### Scenario B: Contactless LPR Parking Entry & Invisible Exit Billing
1. **Register License Plate**:
   - Navigate to `/parking` and register vehicle plate `PCH-4921`.
2. **Simulate Entry Gate Trigger**:
   - Trigger LPR entry webhook via curl:
     ```bash
     curl -X POST http://localhost:3001/api/parking/lpr-webhook \
       -H "Content-Type: application/json" \
       -d '{"cameraHardwareId":"CAM-01","facilityId":"fac_1","gateId":"GATE-IN-1","eventType":"ENTRY","plateNumber":"PCH-4921"}'
     ```
   - **Expected Outcome**: Returns `{ status: "AUTHORIZED", openBarrier: true }` and creates an active `ParkingSession`.
3. **Simulate Exit Gate Trigger**:
   - Trigger LPR exit webhook:
     ```bash
     curl -X POST http://localhost:3001/api/parking/lpr-webhook \
       -H "Content-Type: application/json" \
       -d '{"cameraHardwareId":"CAM-02","facilityId":"fac_1","gateId":"GATE-OUT-1","eventType":"EXIT","plateNumber":"PCH-4921"}'
     ```
   - **Expected Outcome**: Calculates elapsed duration, debits the fee against the user's payment method, closes the session, and sends a digital receipt.

---

### Scenario C: Transit Live GPS Sharing & Dead-Battery National ID Verification
1. **Live GPS Telemetry Broadcast**:
   - Open `/transit/driver-terminal` and start trip `trip_001`.
   - In passenger view, click **Share Trip Tracking** and open the public live link in an incognito window.
   - **Expected Outcome**: Real-time GPS coordinates stream smoothly via Server-Sent Events (SSE) updating the live route marker without login.
2. **National ID Passenger Lookup (Phone Dead)**:
   - On the driver manifest terminal, switch to offline mode.
   - Enter the passenger's National ID (`1723456789`).
   - **Expected Outcome**: Passenger record surfaces instantly with seat allocation; clicking **Board** marks the passenger as boarded with `validatedOffline: true`.

---

### Scenario D: In-Stadium Concession In-Seat Delivery
1. **Place In-Seat Order**:
   - Open ticket view and click **Order to My Seat**.
   - Select food/merchandise items and submit order with PIN `4921`.
2. **Runner Fulfillment**:
   - Open `/concessions/runner-dispatch`.
   - Accept the order, locate section/row/seat coordinate, and input attendee PIN upon delivery.
   - **Expected Outcome**: Order transitions to `DELIVERED`, completing fulfillment with zero line queuing.

---

### Scenario E: Secure In-App Ticket Transfer
1. **Initiate Transfer**:
   - Click **Transfer Ticket**, input recipient email `friend@example.com`.
2. **Accept Transfer**:
   - Log in as `friend@example.com`, accept the incoming claim.
   - **Expected Outcome**: Sender's dynamic token is revoked immediately, and the recipient receives an active ticket with their own rotating cryptographic seed.
