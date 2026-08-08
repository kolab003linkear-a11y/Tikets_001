# Implementation Plan: Resilient Offline-First Ticketing, LPR Parking & Real-Time Transit Ecosystem

**Branch**: `002-offline-ticketing-lpr-transit` | **Date**: 2026-08-06 | **Spec**: [spec.md](file:///C:/Users/angel/OneDrive/Desktop/nombre-del-proyecto/specs/002-offline-ticketing-lpr-transit/spec.md)

**Input**: Feature specification from `specs/002-offline-ticketing-lpr-transit/spec.md`

## Summary

Build an offline-first resilient digital ticketing, LPR parking gate automation, and real-time intercity transit platform. Features offline cryptographically signed QR ticket vaulting, driver fallback National ID verification, automated camera License Plate Recognition parking gate integration with background auto-debit, live GPS bus tracking, interactive seat layout booking, companion ticket transfer, and self-service cancellations.

## Technical Context

**Language/Version**: Node.js (ES Modules), TypeScript 5.9+  
**Primary Dependencies**: Wasp Framework, Prisma ORM, Service Workers, Leaflet / Mapbox, ShadCN UI, Tailwind CSS  
**Storage**: PostgreSQL (Prisma ORM) + LocalStorage / IndexedDB (Offline Vault)  
**Testing**: Playwright (E2E), Vitest  
**Target Platform**: Web application & Mobile PWA  
**Project Type**: Full-stack web application  
**Performance Goals**: Offline QR render < 500ms, LPR gate activation < 2.0s, Ticket transfer < 30s  
**Constraints**: Zero-network reliance for ticket validation, secure background auto-debit  
**Scale/Scope**: High-concurrency event entry & real-time transit telemetry  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Full-Stack Type Safety & Wasp-First Architecture**: ✅ PASSED. All operations defined as Wasp Queries/Actions with Prisma entity typing.
- **II. Modular & Provider-Agnostic Service Integration**: ✅ PASSED. LPR camera gateways and payment adapters decoupled behind clean API webhooks.
- **III. Automated Verification & Test Discipline**: ✅ PASSED. Runnable validation scenarios documented in quickstart.md and covered by Playwright tests.
- **IV. Code Quality & Formatting**: ✅ PASSED. Code formatted via Prettier and linted via ESLint.
- **V. Spec-Driven & AI-Ready Development**: ✅ PASSED. Full `.specify/` artifact suite generated.

## Project Structure

### Documentation (this feature)

```text
specs/002-offline-ticketing-lpr-transit/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
    └── ticketing-lpr-operations.md
```

### Source Code Structure

```text
src/
├── ticketing/
│   ├── vault.ts         # Offline PWA cryptographic ticket vault
│   ├── validation.ts    # Driver National ID & QR signature validator
│   └── components/      # TicketWallet, OfflineQRModal
├── parking/
│   ├── lprWebhook.ts    # LPR Camera event receiver & gate activator
│   └── sessions.ts      # Automated parking fee calculator
└── transit/
    ├── gpsStream.ts     # SSE telemetry provider
    └── seats.ts         # Interactive seat map locking
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | Core design adheres directly to constitution principles |
