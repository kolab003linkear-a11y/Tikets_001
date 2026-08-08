# Data Model: Resilient Offline-First Ticketing, LPR Parking & Real-Time Transit Ecosystem

**Feature**: Resilient Offline-First Ticketing, LPR Parking & Real-Time Transit (`002-offline-ticketing-lpr-transit`)  
**Date**: 2026-08-06  
**Status**: Complete  

## Prisma Schema Extensions

### Enums

```prisma
enum TicketStatus {
  VALID
  USED
  CANCELLED
  TRANSFERRED
}

enum ParkingSessionStatus {
  ACTIVE
  COMPLETED
  FAILED_PAYMENT
}
```

### Models

```prisma
model Ticket {
  id               String       @id @default(uuid())
  userId           String
  eventOrTripTitle String
  seatNumber       String?
  passengerName    String
  nationalId       String
  signaturePayload String       // Encrypted / signed offline JWT token
  status           TicketStatus @default(VALID)
  createdAt        DateTime     @default(now())

  user             User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  transfers        TicketTransfer[]

  @@index([userId])
  @@index([nationalId])
}

model VehicleRegistration {
  id           String   @id @default(uuid())
  userId       String
  licensePlate String   @unique
  stateRegion  String
  isDefault    Boolean  @default(true)
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessions     ParkingSession[]

  @@index([userId])
  @@index([licensePlate])
}

model ParkingSession {
  id                    String               @id @default(uuid())
  vehicleRegistrationId String
  facilityName          String
  entryTime             DateTime             @default(now())
  exitTime              DateTime?
  totalFeeAmount        Float?
  status                ParkingSessionStatus @default(ACTIVE)

  vehicle               VehicleRegistration  @relation(fields: [vehicleRegistrationId], references: [id], onDelete: Cascade)
}

model TransitTrip {
  id            String   @id @default(uuid())
  routeName     String
  busNumber     String
  departureTime DateTime
  currentLat    Float?
  currentLng    Float?
  lastGpsUpdate DateTime?

  seats         BusSeat[]
}

model BusSeat {
  id          String      @id @default(uuid())
  tripId      String
  seatLabel   String
  isAvailable Boolean     @default(true)
  price       Float

  trip        TransitTrip @relation(fields: [tripId], references: [id], onDelete: Cascade)

  @@unique([tripId, seatLabel])
}

model TicketTransfer {
  id             String   @id @default(uuid())
  ticketId       String
  senderUserId   String
  recipientEmail String
  transferToken  String   @unique
  isClaimed      Boolean  @default(false)
  createdAt      DateTime @default(now())

  ticket         Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)
}
```
