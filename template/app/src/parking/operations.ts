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

export interface ParkingSession {
  id: string;
  facilityName: string;
  plateNumber: string;
  entryTime: Date;
  exitTime: Date | null;
  status: string;
  totalBilled: number;
  entryGateId: string;
}

export const mockSessions: ParkingSession[] = [
  {
    id: "sess_parking_101",
    facilityName: "Parqueadero Inteligente Quicentro Norte",
    plateNumber: "PCH-4921",
    entryTime: new Date(Date.now() - 1000 * 60 * 85), // 85 mins ago
    exitTime: null,
    status: "ACTIVE",
    totalBilled: 0.0,
    entryGateId: "GATE-NORTH-IN",
  },
];

export const getDriverVehiclesAndSessions = async (
  _args: unknown,
  _context: any,
) => {
  return {
    vehicles: mockVehicles,
    activeSessions: mockSessions,
  };
};

export const registerVehiclePlate = async (
  {
    plateNumber,
    make,
    model,
    color,
  }: { plateNumber: string; make?: string; model?: string; color?: string },
  _context: any,
) => {
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

export const manualExitQRScan = async (
  { sessionId }: { sessionId: string },
  _context: any,
) => {
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
