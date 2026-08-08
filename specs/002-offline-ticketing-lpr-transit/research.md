# Research: Resilient Offline-First Ticketing, LPR Parking & Real-Time Transit Ecosystem

**Feature**: Resilient Offline-First Ticketing, LPR Parking & Real-Time Transit (`002-offline-ticketing-lpr-transit`)  
**Date**: 2026-08-06  
**Status**: Complete  

## Research Topics & Decisions

### 1. Offline Cryptographic Ticket Storage & Local Gate Verification

- **Decision**: Implement an offline-first PWA / LocalStorage vault storing asymmetric cryptographic tokens (ECDSA / HMAC signed payloads) rendered as dynamic QR codes.
- **Rationale**:
  - Eliminates network reliance in high-density stadium or remote bus terminal environments.
  - Gate validation devices hold the public key directory and scan QR payloads offline, verifying token signature and expiration locally.
  - Driver manifest app keeps a pre-synced local IndexedDB store matching National ID numbers to passenger ticket records for dead-battery scenarios.
- **Alternatives Considered**:
  - *Online API verification per scan*: Fails under cellular congestion at stadiums.

---

### 2. LPR Camera Parking Gate Webhook & Automated Payment Pipeline

- **Decision**: Expose an event-driven LPR webhook listener (`/api/lpr/event`) that matches license plate strings against `VehicleRegistration` records, calculates `ParkingSession` elapsed time, and executes automated background payment collection.
- **Rationale**:
  - Provides a frictionless <2.0s gate opening experience.
  - Ingress logs entry timestamp; egress triggers auto-debit via saved customer payment profile and sends gate activation signal to the barrier relay.
- **Alternatives Considered**:
  - *Manual app-initiated gate opening*: Reintroduces driver friction and phone usage while operating a vehicle.

---

### 3. Real-Time GPS Tracking & Interactive Seat Reservation

- **Decision**: Stream GPS telemetry over Server-Sent Events (SSE) to frontend interactive map components, paired with optimistic concurrency locking on Prisma seat models.
- **Rationale**:
  - SSE provides lightweight, battery-efficient live GPS updates on mobile networks compared to heavy polling loops.
  - Atomic Prisma transactions prevent double-booking during interactive seat selection.
- **Alternatives Considered**:
  - *Short polling (every 2s)*: High battery drain and unnecessary server load.
