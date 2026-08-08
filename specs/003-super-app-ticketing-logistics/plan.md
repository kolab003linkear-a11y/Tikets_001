# Implementation Plan: Unified Super-App for Resilient Ticketing, LPR Parking & Interprovincial Transit

**Branch**: `003-super-app-ticketing-logistics` | **Date**: 2026-08-07 | **Spec**: [spec.md](file:///C:/Users/angel/OneDrive/Desktop/nombre-del-proyecto/specs/003-super-app-ticketing-logistics/spec.md)

**Input**: Feature specification from `specs/003-super-app-ticketing-logistics/spec.md`

## Summary

Build a high-resilience, unified full-stack Super-App for event ticketing, automated parking, and interprovincial bus transit. The platform delivers 100% offline dynamic QR ticket presentation with lock-screen widgets, automated License Plate Recognition (LPR) parking entry/exit with invisible billing, real-time bus GPS journey tracking with fallback National ID manifest verification for unpowered phones, in-stadium seat-side concession delivery with offline-queued wallet signatures, and secure peer-to-peer ticket custody transfers.

## Technical Context

**Language/Version**: Node.js v20+ (ES Modules), TypeScript 5.9+  
**Primary Dependencies**: Wasp Framework, React 18+, Prisma ORM, Service Worker API, IndexedDB, Tailwind CSS, ShadCN UI, Lucide Icons  
**Storage**: PostgreSQL (Prisma ORM) + Local Encrypted Storage / IndexedDB (Offline Client Vault)  
**Testing**: Playwright (E2E workflows), Vitest (Unit & cryptographic token verification)  
**Target Platform**: Web Application & Mobile PWA (iOS & Android compatible)  
**Project Type**: Full-stack web application with offline-first client PWA  
**Performance Goals**: Dynamic QR render < 500ms offline, LPR camera gate trigger to barrier open < 2.0s, turnstile scan validation < 1.0s, National ID lookup < 15s  
**Constraints**: Zero network dependency for gate turnstile validation, background automated payment settlement, end-to-end type safety  
**Scale/Scope**: Support high-concurrency event entrances (10k+ attendees), multiple parking facilities, and cross-country bus routes  

## Constitution Check

*GATE: Passed prior to Phase 0 research and verified post Phase 1 design.*

- **I. Full-Stack Type Safety & Wasp-First Architecture**: ✅ PASSED. All data flows, queries, and actions are registered through Wasp operations with strict Prisma typing and type-safe RPC declarations.
- **II. Modular & Provider-Agnostic Service Integration**: ✅ PASSED. LPR camera gateways, SMS/Push notification alerts, and payment processors are abstracted behind modular adapter interfaces.
- **III. Automated Verification & Test Discipline**: ✅ PASSED. Fully documented validation journeys in `quickstart.md` designed for Playwright end-to-end automated testing.
- **IV. Code Quality, Formatting & Static Analysis Compliance**: ✅ PASSED. All code passes Prettier checks and ESLint rules.
- **V. Spec-Driven & AI-Ready Development**: ✅ PASSED. Complete specification, research decisions, schema definitions, and interface contracts captured in `specs/003-super-app-ticketing-logistics/`.

## Project Structure

### Documentation (this feature)

```text
specs/003-super-app-ticketing-logistics/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 technical decisions & architecture
├── data-model.md        # Phase 1 entity schemas and Prisma models
├── quickstart.md        # Phase 1 runnable validation scenarios
├── checklists/
│   └── requirements.md  # Quality verification checklist
└── contracts/
    └── super-app-contracts.md # Wasp operations, webhooks, and offline schemas
```

### Source Code Layout

```text
template/app/src/
├── ticketing/
│   ├── operations.ts         # Wasp queries & actions for tickets & dynamic tokens
│   ├── dynamicToken.ts       # HMAC-SHA256 rotating token generator & validator
│   ├── offlineVault.ts       # Service Worker & IndexedDB encrypted ticket store
│   └── components/
│       ├── TicketWallet.tsx  # Interactive mobile ticket wallet with lock-screen widget
│       └── GateScanner.tsx   # Offline turnstile validator scanner UI
├── parking/
│   ├── operations.ts         # Vehicle registration & parking session queries
│   ├── lprWebhook.ts         # Optical ANPR camera webhook receiver & barrier relay
│   ├── tariffCalculator.ts   # Grace period & duration fee calculator
│   └── components/
│       └── ParkingDashboard.tsx # Registered vehicles, live sessions & receipts
├── transit/
│   ├── operations.ts         # Trip telemetry, manifest, & National ID lookup
│   ├── telemetryStream.ts    # SSE real-time GPS broadcaster & map bridge
│   ├── driverManifest.ts     # Offline driver passenger manifest & boarding sync
│   └── components/
│       ├── LiveTrackingMap.tsx # Public family share live GPS map
│       └── DriverTerminal.tsx  # Driver terminal with National ID search & offline boarding
├── concessions/
│   ├── operations.ts         # In-stadium menu, seat ordering & runner dispatch
│   └── components/
│       ├── SeatOrderModal.tsx   # Seat-side food/merch ordering with offline queue
│       └── RunnerDispatch.tsx   # Concession runner seat delivery & PIN verification
└── client/
    ├── serviceWorker.ts      # PWA offline cache & background sync orchestration
    └── MainLayout.tsx        # Super-App navigation shell & module switcher
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None* | Architecture strictly adheres to Wasp full-stack standards | N/A |
