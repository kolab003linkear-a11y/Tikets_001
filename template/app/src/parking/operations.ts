import { ParkingSessionStatus } from "@prisma/client";
import { HttpError } from "wasp/server";
import * as z from "zod";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";
import { calculateParkingFee } from "./tariffCalculator";

export const mockVehicles = [
  {
    id: "veh_1",
    plateNumber: "PCH-4921",
    make: "Toyota",
    model: "Corolla Cross",
    color: "Gris Grafito",
    isPrimary: true,
    createdAt: new Date(),
  },
  {
    id: "veh_2",
    plateNumber: "PBJ-8812",
    make: "Hyundai",
    model: "Tucson",
    color: "Blanco Perla",
    isPrimary: false,
    createdAt: new Date(),
  },
];

export const mockFacilities = [
  {
    id: "fac_01",
    name: "Parqueadero Inteligente Quicentro Norte",
    location: "Av. Naciones Unidas y 6 de Diciembre, Quito",
    hourlyTariff: 2.5,
    gracePeriodMins: 15,
    totalBays: 350,
    activeVehicles: 142,
  },
  {
    id: "fac_02",
    name: "Estacionamiento Mall del Sol LPR",
    location: "Av. Joaquín Orrantia, Guayaquil",
    hourlyTariff: 2.0,
    gracePeriodMins: 10,
    totalBays: 500,
    activeVehicles: 280,
  },
  {
    id: "fac_03",
    name: "Parking Estadio Monumental ANPR",
    location: "Av. Barcelona, Guayaquil",
    hourlyTariff: 3.0,
    gracePeriodMins: 20,
    totalBays: 200,
    activeVehicles: 45,
  },
];

export const mockSessions = [
  {
    id: "sess_parking_101",
    facilityId: "fac_01",
    facility: mockFacilities[0],
    plateNumber: "PCH-4921",
    vehicle: mockVehicles[0],
    user: { email: "conductor1@ejemplo.com" },
    entryTime: new Date(Date.now() - 1000 * 60 * 85), // 85 mins ago
    exitTime: null,
    status: "ACTIVE",
    totalBilled: 0.0,
    entryGateId: "GATE-NORTH-IN",
  },
  {
    id: "sess_parking_102",
    facilityId: "fac_02",
    facility: mockFacilities[1],
    plateNumber: "PBJ-8812",
    vehicle: mockVehicles[1],
    user: { email: "conductor2@ejemplo.com" },
    entryTime: new Date(Date.now() - 1000 * 60 * 210), // 210 mins ago
    exitTime: new Date(Date.now() - 1000 * 60 * 30),
    status: "COMPLETED",
    totalBilled: 7.0,
    entryGateId: "GATE-SOUTH-IN",
    exitGateId: "GATE-SOUTH-OUT",
  },
];

export const getDriverVehiclesAndSessions = async () => {
  return {
    vehicles: mockVehicles,
    activeSessions: mockSessions,
  };
};

export const registerVehiclePlate = async ({
  plateNumber,
  make,
  model,
  color,
}: {
  plateNumber: string;
  make?: string;
  model?: string;
  color?: string;
}) => {
  const normalized = plateNumber.toUpperCase().replace(/\s+/g, "");
  const newVehicle = {
    id: `veh_${Date.now()}`,
    plateNumber: normalized,
    make: make || "Marca Genérica",
    model: model || "Modelo",
    color: color || "Color",
    isPrimary: false,
    createdAt: new Date(),
  };
  mockVehicles.push(newVehicle);
  return newVehicle;
};

export const manualExitQRScan = async ({
  sessionId,
}: {
  sessionId: string;
}) => {
  const session = mockSessions.find((s) => s.id === sessionId);
  if (!session) {
    return { success: false, message: "Sesión de parqueo no encontrada" };
  }
  const feeResult = calculateParkingFee(session.entryTime, new Date(), 2.5, 15);
  session.status = "COMPLETED";
  session.exitTime = new Date();
  session.totalBilled = feeResult.totalCharged;

  return {
    success: true,
    totalBilled: feeResult.totalCharged,
    durationMinutes: feeResult.durationMinutes,
    message: `✅ Salida manual autorizada. Total debitado: $${feeResult.totalCharged.toFixed(2)}`,
  };
};

export const getAdminParkingStatsAndFacilities = async (_args: unknown, context: any) => {
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

  let dbFacilities: any[] = [];
  let dbSessions: any[] = [];

  if (context.entities?.ParkingFacility) {
    try {
      dbFacilities = await context.entities.ParkingFacility.findMany({
        include: {
          sessions: {
            where: { status: "ACTIVE" },
          },
        },
        orderBy: { name: "asc" },
      });
    } catch {
      dbFacilities = [];
    }
  }

  if (context.entities?.ParkingSession) {
    try {
      dbSessions = await context.entities.ParkingSession.findMany({
        include: {
          facility: true,
          vehicle: true,
          user: {
            select: { id: true, email: true, name: true },
          },
        },
        orderBy: { entryTime: "desc" },
        take: 50,
      });
    } catch {
      dbSessions = [];
    }
  }

  const facilities = dbFacilities.length > 0 ? dbFacilities : mockFacilities;
  const sessions = dbSessions.length > 0 ? dbSessions : mockSessions;

  const totalFacilities = facilities.length;
  const totalBays = facilities.reduce((sum, f) => sum + (f.totalBays || 0), 0);
  const totalActiveVehicles = facilities.reduce(
    (sum, f) => sum + (f.activeVehicles || f.sessions?.length || 0),
    0,
  );

  const totalRevenue = sessions.reduce((sum, s) => {
    const amount = typeof s.totalBilled === "number" ? s.totalBilled : parseFloat(s.totalBilled || "0");
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const occupiedPercentage = totalBays > 0 ? Math.round((totalActiveVehicles / totalBays) * 100) : 0;

  return {
    facilities,
    sessions,
    stats: {
      totalFacilities,
      totalBays,
      totalActiveVehicles,
      totalRevenue,
      occupiedPercentage,
    },
  };
};

const createOrUpdateParkingFacilityInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty(),
  location: z.string().nonempty(),
  hourlyTariff: z.number().positive(),
  gracePeriodMins: z.number().nonnegative(),
  totalBays: z.number().positive(),
});

type CreateOrUpdateParkingFacilityInput = z.infer<
  typeof createOrUpdateParkingFacilityInputSchema
>;

export const createOrUpdateParkingFacility = async (
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

  const { id, name, location, hourlyTariff, gracePeriodMins, totalBays } =
    ensureArgsSchemaOrThrowHttpError(
      createOrUpdateParkingFacilityInputSchema,
      rawArgs,
    );

  if (context.entities?.ParkingFacility) {
    if (id) {
      return await context.entities.ParkingFacility.update({
        where: { id },
        data: {
          name,
          location,
          hourlyTariff,
          gracePeriodMins,
          totalBays,
        },
      });
    } else {
      return await context.entities.ParkingFacility.create({
        data: {
          name,
          location,
          hourlyTariff,
          gracePeriodMins,
          totalBays,
          activeVehicles: 0,
        },
      });
    }
  }

  if (id) {
    const existing = mockFacilities.find((f) => f.id === id);
    if (existing) {
      existing.name = name;
      existing.location = location;
      existing.hourlyTariff = hourlyTariff;
      existing.gracePeriodMins = gracePeriodMins;
      existing.totalBays = totalBays;
      return existing;
    }
  }

  const newFac = {
    id: `fac_${Date.now()}`,
    name,
    location,
    hourlyTariff,
    gracePeriodMins,
    totalBays,
    activeVehicles: 0,
  };
  mockFacilities.push(newFac);
  return newFac;
};

const manualCloseParkingSessionInputSchema = z.object({
  sessionId: z.string().nonempty(),
  status: z.nativeEnum(ParkingSessionStatus),
});

type ManualCloseParkingSessionInput = z.infer<
  typeof manualCloseParkingSessionInputSchema
>;

export const manualCloseParkingSession = async (
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

  const { sessionId, status } = ensureArgsSchemaOrThrowHttpError(
    manualCloseParkingSessionInputSchema,
    rawArgs,
  );

  if (context.entities?.ParkingSession) {
    const session = await context.entities.ParkingSession.findUnique({
      where: { id: sessionId },
      include: { facility: true },
    });

    if (session) {
      const exitTime = new Date();
      const feeResult = calculateParkingFee(
        session.entryTime,
        exitTime,
        session.facility?.hourlyTariff ? Number(session.facility.hourlyTariff) : 2.5,
        session.facility?.gracePeriodMins || 15,
      );

      return await context.entities.ParkingSession.update({
        where: { id: sessionId },
        data: {
          status,
          exitTime: status === "COMPLETED" ? exitTime : session.exitTime,
          durationMinutes: feeResult.durationMinutes,
          totalBilled: feeResult.totalCharged,
        },
      });
    }
  }

  const mockSess = mockSessions.find((s) => s.id === sessionId);
  if (mockSess) {
    mockSess.status = status;
    if (status === "COMPLETED") {
      mockSess.exitTime = new Date();
      mockSess.totalBilled = 5.0;
    }
    return mockSess;
  }

  return { sessionId, status };
};

