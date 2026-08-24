import { TripStatus } from "@prisma/client";
import { HttpError } from "wasp/server";
import * as z from "zod";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";

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

export const mockRoutes = [
  {
    id: "route_01",
    routeName: "Quito (Carcelén) ➔ Guayaquil (Terminal Terrestre)",
    originCity: "Quito",
    destinationCity: "Guayaquil",
    estimatedHours: 8.5,
  },
  {
    id: "route_02",
    routeName: "Cuenca (Terminal Terrestre) ➔ Guayaquil",
    originCity: "Cuenca",
    destinationCity: "Guayaquil",
    estimatedHours: 3.5,
  },
  {
    id: "route_03",
    routeName: "Quito ➔ Manta (Ruta Spondylus)",
    originCity: "Quito",
    destinationCity: "Manta",
    estimatedHours: 7.0,
  },
];

export const mockTrips = [
  {
    id: "trip_4021",
    routeId: "route_01",
    route: mockRoutes[0],
    busUnitNumber: "Unidad 14 - Cooperativa Flota Imbabura",
    driverName: "Raúl Fuentes",
    departureTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
    arrivalTime: null,
    status: "IN_TRANSIT",
    currentGpsLat: -0.180653,
    currentGpsLng: -78.467834,
    currentSpeedKmh: 74.2,
    shareToken: "share_live_gps_imbabura_4021",
    manifestEntries: mockPassengers,
  },
  {
    id: "trip_4022",
    routeId: "route_02",
    route: mockRoutes[1],
    busUnitNumber: "Unidad 08 - Transportes Ecuador",
    driverName: "Carlos Mendoza",
    departureTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // in 3h
    arrivalTime: null,
    status: "SCHEDULED",
    shareToken: "share_live_gps_ecuador_4022",
    manifestEntries: [],
  },
];

export const getTripDetails = async () => {
  return mockTrip;
};

export const getDriverTripManifest = async () => {
  return {
    trip: mockTrip,
    manifest: mockPassengers,
  };
};

export const validatePassengerBoarding = async ({
  nationalId,
}: {
  nationalId: string;
  tripId: string;
}) => {
  const passenger = mockPassengers.find(
    (p) => p.nationalId === nationalId.trim(),
  );
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

export const updateBusTelemetry = async ({
  lat,
  lng,
  speed,
}: {
  lat: number;
  lng: number;
  speed: number;
}) => {
  mockTrip.currentGpsLat = lat;
  mockTrip.currentGpsLng = lng;
  mockTrip.currentSpeedKmh = speed;
  return mockTrip;
};

export const getAdminTransitStatsAndRoutes = async (_args: unknown, context: any) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  let dbRoutes: any[] = [];
  let dbTrips: any[] = [];

  if (context.entities?.TransitRoute) {
    try {
      dbRoutes = await context.entities.TransitRoute.findMany({
        include: {
          trips: true,
        },
        orderBy: { routeName: "asc" },
      });
    } catch {
      dbRoutes = [];
    }
  }

  if (context.entities?.TransitTrip) {
    try {
      dbTrips = await context.entities.TransitTrip.findMany({
        include: {
          route: true,
          manifestEntries: true,
        },
        orderBy: { departureTime: "desc" },
        take: 50,
      });
    } catch {
      dbTrips = [];
    }
  }

  const routes = dbRoutes.length > 0 ? dbRoutes : mockRoutes;
  const trips = dbTrips.length > 0 ? dbTrips : mockTrips;

  const totalRoutes = routes.length;
  const totalTrips = trips.length;
  const inTransitCount = trips.filter((t) => t.status === "IN_TRANSIT").length;
  const scheduledCount = trips.filter((t) => t.status === "SCHEDULED" || t.status === "BOARDING").length;

  let totalBoarded = 0;
  trips.forEach((t) => {
    if (t.manifestEntries && Array.isArray(t.manifestEntries)) {
      totalBoarded += t.manifestEntries.filter((m: any) => m.boardingStatus === "BOARDED").length;
    }
  });

  return {
    routes,
    trips,
    stats: {
      totalRoutes,
      totalTrips,
      inTransitCount,
      scheduledCount,
      totalBoarded,
    },
  };
};

const createOrUpdateTransitRouteInputSchema = z.object({
  id: z.string().optional(),
  routeName: z.string().nonempty(),
  originCity: z.string().nonempty(),
  destinationCity: z.string().nonempty(),
  estimatedHours: z.number().positive(),
});

type CreateOrUpdateTransitRouteInput = z.infer<
  typeof createOrUpdateTransitRouteInputSchema
>;

export const createOrUpdateTransitRoute = async (
  rawArgs: unknown,
  context: any,
) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  const { id, routeName, originCity, destinationCity, estimatedHours } =
    ensureArgsSchemaOrThrowHttpError(
      createOrUpdateTransitRouteInputSchema,
      rawArgs,
    );

  if (context.entities?.TransitRoute) {
    if (id) {
      return await context.entities.TransitRoute.update({
        where: { id },
        data: {
          routeName,
          originCity,
          destinationCity,
          estimatedHours,
        },
      });
    } else {
      return await context.entities.TransitRoute.create({
        data: {
          routeName,
          originCity,
          destinationCity,
          estimatedHours,
        },
      });
    }
  }

  if (id) {
    const existing = mockRoutes.find((r) => r.id === id);
    if (existing) {
      existing.routeName = routeName;
      existing.originCity = originCity;
      existing.destinationCity = destinationCity;
      existing.estimatedHours = estimatedHours;
      return existing;
    }
  }

  const newRoute = {
    id: `route_${Date.now()}`,
    routeName,
    originCity,
    destinationCity,
    estimatedHours,
  };
  mockRoutes.push(newRoute);
  return newRoute;
};

const createAdminTransitTripInputSchema = z.object({
  routeId: z.string().nonempty(),
  busUnitNumber: z.string().nonempty(),
  driverName: z.string().nonempty(),
  departureTime: z.string().nonempty(),
});

type CreateAdminTransitTripInput = z.infer<
  typeof createAdminTransitTripInputSchema
>;

export const createAdminTransitTrip = async (
  rawArgs: unknown,
  context: any,
) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  const { routeId, busUnitNumber, driverName, departureTime } =
    ensureArgsSchemaOrThrowHttpError(
      createAdminTransitTripInputSchema,
      rawArgs,
    );

  const shareToken = `share_live_gps_${Date.now()}`;

  if (context.entities?.TransitTrip) {
    return await context.entities.TransitTrip.create({
      data: {
        routeId,
        busUnitNumber,
        driverName,
        departureTime: new Date(departureTime),
        status: "SCHEDULED",
        shareToken,
      },
    });
  }

  const routeObj = mockRoutes.find((r) => r.id === routeId) || mockRoutes[0];
  const newTrip = {
    id: `trip_${Date.now()}`,
    routeId,
    route: routeObj,
    busUnitNumber,
    driverName,
    departureTime: new Date(departureTime),
    arrivalTime: null,
    status: "SCHEDULED",
    currentGpsLat: null,
    currentGpsLng: null,
    currentSpeedKmh: null,
    shareToken,
    manifestEntries: [],
  };
  mockTrips.push(newTrip);
  return newTrip;
};

const updateTransitTripStatusInputSchema = z.object({
  tripId: z.string().nonempty(),
  status: z.nativeEnum(TripStatus),
});

type UpdateTransitTripStatusInput = z.infer<
  typeof updateTransitTripStatusInputSchema
>;

export const updateTransitTripStatus = async (
  rawArgs: unknown,
  context: any,
) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  const { tripId, status } = ensureArgsSchemaOrThrowHttpError(
    updateTransitTripStatusInputSchema,
    rawArgs,
  );

  if (context.entities?.TransitTrip) {
    return await context.entities.TransitTrip.update({
      where: { id: tripId },
      data: {
        status,
        ...(status === "COMPLETED" ? { arrivalTime: new Date() } : {}),
      },
    });
  }

  const mockTripObj = mockTrips.find((t) => t.id === tripId);
  if (mockTripObj) {
    mockTripObj.status = status;
    return mockTripObj;
  }

  return { tripId, status };
};

