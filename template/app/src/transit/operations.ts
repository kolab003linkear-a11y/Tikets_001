export const mockTrip = {
  id: "trip_4021",
  routeTitle: "Quito (Carcelén) ➔ Guayaquil (Terminal Terrestre)",
  busUnitNumber: "Unidad 14 - Cooperativa Flota Imbabura",
  driverName: "Raúl Fuentes",
  departureTime: "Hoy 19:30",
  estimatedArrival: "Mañana 04:15",
  status: "IN_TRANSIT",
  currentGpsLat: -0.180653,
  currentGpsLng: -78.467834,
  currentSpeedKmh: 74.2,
  nextWaypoint: "Santo Domingo de los Tsáchilas",
  shareToken: "share_live_gps_imbabura_4021",
};

export const mockPassengers = [
  {
    id: "man_01",
    passengerName: "Pamela Alarcón",
    nationalId: "1723456789",
    seatNumber: "Asiento 12 (Ventana)",
    boardingStatus: "BOARDED",
    boardedAt: "19:25",
    validatedOffline: true,
  },
  {
    id: "man_02",
    passengerName: "Luis Borja",
    nationalId: "1719882341",
    seatNumber: "Asiento 13 (Pasillo)",
    boardingStatus: "PENDING",
    boardedAt: null,
    validatedOffline: false,
  },
  {
    id: "man_03",
    passengerName: "Ángela Bravo",
    nationalId: "0923847112",
    seatNumber: "Asiento 14 (Ventana)",
    boardingStatus: "PENDING",
    boardedAt: null,
    validatedOffline: false,
  },
  {
    id: "man_04",
    passengerName: "Julián Lopera",
    nationalId: "1104882190",
    seatNumber: "Asiento 15 (Pasillo)",
    boardingStatus: "PENDING",
    boardedAt: null,
    validatedOffline: false,
  },
];

export const getTripDetails = async (_args: unknown, _context: any) => {
  return mockTrip;
};

export const getDriverTripManifest = async (_args: unknown, _context: any) => {
  return {
    trip: mockTrip,
    manifest: mockPassengers,
  };
};

export const validatePassengerBoarding = async (
  { nationalId, tripId }: { nationalId: string; tripId: string },
  _context: any
) => {
  const passenger = mockPassengers.find((p) => p.nationalId === nationalId.trim());
  if (!passenger) {
    return {
      success: false,
      message: `❌ Cédula ${nationalId} no encontrada en el manifiesto de la unidad.`,
    };
  }

  passenger.boardingStatus = "BOARDED";
  passenger.boardedAt = new Date().toLocaleTimeString();
  passenger.validatedOffline = true;

  return {
    success: true,
    passenger,
    message: `✅ Pasajero verificado: ${passenger.passengerName} (${passenger.seatNumber}) abordó con éxito.`,
  };
};

export const updateBusTelemetry = async (
  { lat, lng, speed }: { lat: number; lng: number; speed: number },
  _context: any
) => {
  mockTrip.currentGpsLat = lat;
  mockTrip.currentGpsLng = lng;
  mockTrip.currentSpeedKmh = speed;
  return mockTrip;
};
