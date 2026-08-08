# Tasks: Unified Super-App (Ticketing, LPR Parking & Transit)

**Input**: Design documents from `specs/003-super-app-ticketing-logistics/`  
**Prerequisites**: [plan.md](file:///C:/Users/angel/OneDrive/Desktop/nombre-del-proyecto/specs/003-super-app-ticketing-logistics/plan.md), [spec.md](file:///C:/Users/angel/OneDrive/Desktop/nombre-del-proyecto/specs/003-super-app-ticketing-logistics/spec.md), [research.md](file:///C:/Users/angel/OneDrive/Desktop/nombre-del-proyecto/specs/003-super-app-ticketing-logistics/research.md), [data-model.md](file:///C:/Users/angel/OneDrive/Desktop/nombre-del-proyecto/specs/003-super-app-ticketing-logistics/data-model.md), [contracts/](file:///C:/Users/angel/OneDrive/Desktop/nombre-del-proyecto/specs/003-super-app-ticketing-logistics/contracts/super-app-contracts.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, module directory layout, and PWA offline infrastructure.

- [x] T001 Create super-app directory structure and module layout in `template/app/src/`
- [x] T002 [P] Configure PWA web app manifest, icon assets, and offline service worker registration in `template/app/public/manifest.json` and `template/app/src/client/serviceWorker.ts`
- [x] T003 [P] Configure UI icons, status badges, and layout shell navigation in `template/app/src/client/MainLayout.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database schema, Prisma migrations, cryptographic token engines, and Wasp RPC endpoints.

**⚠️ CRITICAL**: No user story work can begin until this foundational phase is complete.

- [x] T004 Define comprehensive Super-App database models (User, Ticket, DynamicToken, LPRVehicle, ParkingFacility, ParkingSession, TransitRoute, TransitTrip, PassengerManifestEntry, InStadiumVenue, ConcessionOrder, TicketTransfer) in `template/app/schema.prisma`
- [x] T005 Run database schema migration and generate Prisma client bindings in `template/app/`
- [x] T006 [P] Implement base cryptographic utilities (HMAC-SHA256 signature generation, windowed hashing, and token seed helpers) in `template/app/src/ticketing/dynamicToken.ts`
- [x] T007 [P] Implement client-side IndexedDB & Cache Storage offline vault in `template/app/src/ticketing/offlineVault.ts`
- [x] T008 [P] Configure Wasp routing and full-stack RPC endpoints for all super-app modules in `template/app/main.wasp.ts`

**Checkpoint**: Foundation ready — all user stories can now be implemented independently.

---

## Phase 3: User Story 1 - Anti-Fraud Dynamic QR Codes & Offline Gate Access (Priority: P1) 🎯 MVP

**Goal**: Deliver 30-second rotating cryptographic QR tickets with 100% offline Service Worker cached presentation, lock-screen widget, and turnstile validator scanner.

**Independent Test**: Put device in Airplane Mode, verify dynamic QR rotates locally on lock-screen widget simulator and in ticket modal, and scan offline using gate turnstile scanner with local manifest.

- [x] T009 [P] [US1] Implement Wasp ticket operations (`getUserTickets`, `generateDynamicQRToken`, `validateTicketEntry`) in `template/app/src/ticketing/operations.ts`
- [x] T010 [P] [US1] Build interactive mobile ticket wallet UI with 30s rotating dynamic QR, offline indicator, and lock-screen widget simulator in `template/app/src/ticketing/components/TicketWallet.tsx`
- [x] T011 [US1] Build offline gate scanner operator turnstile UI with camera scanner, local manifest cache, and nonce replay rejection in `template/app/src/ticketing/components/GateScanner.tsx`
- [x] T012 [US1] Implement monotonic nonce invalidation and offline sync relay for gate scanners in `template/app/src/ticketing/gateSync.ts`
- [x] T013 [US1] Integrate lock-screen Web Notification / Live Activity bridge in `template/app/src/ticketing/lockScreenWidget.ts`

**Checkpoint**: User Story 1 is fully functional and independently testable as the core MVP.

---

## Phase 4: User Story 2 - Automated Contactless LPR Parking Entry, Exit & Invisible Payment (Priority: P1)

**Goal**: Deliver frictionless parking with optical License Plate Recognition (LPR) camera webhook integration, sub-2s barrier opening, duration billing, and digital exit receipts.

**Independent Test**: Register vehicle plate, simulate entry/exit LPR camera triggers via API, and confirm automatic barrier actuation and duration-based payment settlement without paper tickets.

- [x] T014 [P] [US2] Implement parking operations (`getDriverVehiclesAndSessions`, `registerVehiclePlate`, `manualExitQRScan`) in `template/app/src/parking/operations.ts`
- [x] T015 [P] [US2] Implement optical LPR camera webhook receiver with plate normalization, facility validation, and barrier relay pulses in `template/app/src/parking/lprWebhook.ts`
- [x] T016 [P] [US2] Implement parking tariff calculation engine with grace periods, duration rates, and automated receipt generation in `template/app/src/parking/tariffCalculator.ts`
- [x] T017 [US2] Build Driver Parking Dashboard UI with vehicle plate management, active parking session timers, optical QR fallback, and digital receipts in `template/app/src/parking/components/ParkingDashboard.tsx`
- [x] T018 [US2] Build Parking Facility Operator Gate Monitor UI with live LPR camera feeds, simulated plate scanner, and manual barrier overrides in `template/app/src/parking/components/FacilityGateMonitor.tsx`

**Checkpoint**: User Stories 1 and 2 work independently and provide complete venue & parking access automation.

---

## Phase 5: User Story 3 - Real-Time Intercity Transit GPS Sharing & National ID Emergency Boarding (Priority: P2)

**Goal**: Deliver live intercity bus GPS route tracking with public family share links, alongside an offline driver manifest allowing dead-battery passenger boarding via National ID lookup.

**Independent Test**: Initiate bus trip, open live tracking map via share token to verify real-time SSE telemetry, and simulate dead-phone passenger boarding using National ID lookup on driver terminal.

- [x] T019 [P] [US3] Implement transit operations (`getTripDetails`, `getDriverTripManifest`, `validatePassengerBoarding`, `updateBusTelemetry`) in `template/app/src/transit/operations.ts`
- [x] T020 [P] [US3] Implement Server-Sent Events (SSE) live GPS telemetry stream endpoint and broadcaster in `template/app/src/transit/telemetryStream.ts`
- [x] T021 [P] [US3] Build Public Family Share Live GPS Map component with Leaflet/SVG route tracking, vehicle speed, and live ETA in `template/app/src/transit/components/LiveTrackingMap.tsx`
- [x] T022 [US3] Build Driver Manifest Terminal UI with offline IndexedDB passenger cache, National ID instant lookup, and offline boarding stamp sync in `template/app/src/transit/components/DriverTerminal.tsx`
- [x] T023 [US3] Implement offline trip manifest caching and background sync reconciler in `template/app/src/transit/driverManifest.ts`

**Checkpoint**: User Stories 1, 2, and 3 are fully operational across events, parking, and transit.

---

## Phase 6: User Story 4 - In-Stadium Seat-Side Food, Beverage & Merchandise Delivery (Priority: P2)

**Goal**: Allow stadium attendees to order concessions directly to their seat coordinates (Zone, Row, Seat) with an offline-resilient wallet and runner PIN verification.

**Independent Test**: Open seat order modal from an active ticket, place concession order, verify runner receives coordinate routing, and complete delivery using attendee PIN.

- [x] T024 [P] [US4] Implement concession operations (`getSeatConcessionMenuAndOrders`, `submitSeatOrder`, `confirmSeatDelivery`) in `template/app/src/concessions/operations.ts`
- [x] T025 [P] [US4] Build Seat-Side Concession Ordering Modal UI with menu catalog, automatic ticket seat coordinate pre-population, and offline order queueing in `template/app/src/concessions/components/SeatOrderModal.tsx`
- [x] T026 [US4] Build Concession Runner Dispatch UI with zone filtering, order preparation queues, seat routing guides, and PIN verification scanner in `template/app/src/concessions/components/RunnerDispatch.tsx`
- [x] T027 [US4] Implement Service Worker background sync queue for offline concession orders in `template/app/src/concessions/offlineOrderQueue.ts`

**Checkpoint**: Concession delivery operates smoothly inside venues with zero concourse queuing.

---

## Phase 7: User Story 5 - Secure Peer-to-Peer In-App Ticket Transfer (Priority: P3)

**Goal**: Enable secure in-app ticket custody transfer that instantly revokes the sender's dynamic QR code and mints a fresh dynamic token for the recipient.

**Independent Test**: Initiate ticket transfer to a recipient email, verify sender's token is locked, accept claim as recipient, and verify new dynamic token generation.

- [x] T028 [P] [US5] Implement ticket transfer action and claim operations in `template/app/src/ticketing/transferOperations.ts`
- [x] T029 [US5] Build In-App Ticket Transfer Modal and Claim Acceptance UI in `template/app/src/ticketing/components/TicketTransferModal.tsx`
- [x] T030 [US5] Implement cryptographic transfer secret generation and atomic ticket custody revocation in `template/app/src/ticketing/transferSecurity.ts`

**Checkpoint**: All 5 user stories are complete, secure, and independently verifiable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Super-App unified navigation shell, theme polish, and end-to-end verification.

- [x] T031 [P] Implement unified Super-App navigation bar, role switching (Attendee, Driver, Transit Driver, Gate Staff, Runner), and offline banner in `template/app/src/client/SuperAppNav.tsx`
- [x] T032 [P] Configure responsive ShadCN / Tailwind dark mode styling, animations, and glassmorphic badges in `template/app/src/client/index.css`
- [x] T033 Verify end-to-end scenarios documented in `specs/003-super-app-ticketing-logistics/quickstart.md`
- [x] T034 Run ESLint and Prettier formatting checks across all newly created super-app modules
