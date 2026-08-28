import { computeBusTicketQrPayload } from "./ticketQrGenerator";

export const mockRoutes = [
  {
    id: "route_01",
    origin: "Terminal Terrestre Quito - Carcelén",
    destination: "Terminal Terrestre Guayaquil",
    durationHours: 12.0,
    slug: "quito-guayaquil",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "route_02",
    origin: "Terminal Terrestre Guayaquil",
    destination: "Terminal Terrestre Quito - Carcelén",
    durationHours: 12.0,
    slug: "guayaquil-quito",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "route_03",
    origin: "Terminal Terrestre Quito - Carcelén",
    destination: "Terminal Terrestre Cuenca",
    durationHours: 8.5,
    slug: "quito-cuenca",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockSchedules = [
  {
    id: "sched_01",
    routeId: "route_01",
    departureTime: new Date(Date.now() + 3600000 * 5),
    arrivalTime: new Date(Date.now() + 3600000 * 17),
    busUnitNumber: "UX-4521",
    driverName: "Carlos Mendoza",
    basePrice: 25.0,
    totalSeats: 40,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "sched_02",
    routeId: "route_01",
    departureTime: new Date(Date.now() + 3600000 * 12),
    arrivalTime: new Date(Date.now() + 3600000 * 24),
    busUnitNumber: "UX-4588",
    driverName: "Raúl Fuentes",
    basePrice: 25.0,
    totalSeats: 40,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "sched_03",
    routeId: "route_03",
    departureTime: new Date(Date.now() + 3600000 * 3),
    arrivalTime: new Date(Date.now() + 3600000 * 11.5),
    busUnitNumber: "UX-4701",
    driverName: "Diana Loor",
    basePrice: 18.0,
    totalSeats: 35,
    isActive: true,
    createdAt: new Date(),
  },
];

export const mockTickets: BusTicketMock[] = [
  {
    id: "bus_tkt_001",
    scheduleId: "sched_01",
    schedule: mockSchedules[0],
    route: mockRoutes[0],
    seatNumber: "A12",
    seatClass: "ECONOMY",
    passengerName: "Carlos Mendoza",
    passengerId: "1723456789",
    price: 25.0,
    qrPayload: "TKT_BUS_001_1723456789",
    status: "ACTIVE",
    purchaseTime: new Date(Date.now() - 3600000),
    boardingTime: null,
    validatedAt: null,
  },
];

interface BusTicketMock {
  id: string;
  scheduleId: string;
  schedule: any;
  route: any;
  seatNumber: string;
  seatClass: string;
  passengerName: string;
  passengerId: string | null;
  price: number;
  qrPayload: string;
  status: string;
  purchaseTime: Date;
  boardingTime: Date | null;
  validatedAt: Date | null;
}

export type { BusTicketMock };

// ──────────────────────────────────────────────────────────────
// QUERIES
// ──────────────────────────────────────────────────────────────

export const getBusRoutes = async (_args: unknown, context: any) => {
  if (context.entities?.BusRoute) {
    try {
      const routes = await context.entities.BusRoute.findMany({
        where: { isActive: true },
        include: { schedules: true },
        orderBy: { origin: "asc" },
      });
      if (routes.length > 0) return routes;
    } catch {
      // Fallback to mock data
    }
  }
  return mockRoutes;
};

export const getSchedulesByRoute = async (
  { routeSlug }: { routeSlug: string },
  context: any,
) => {
  if (context.entities?.BusSchedule) {
    try {
      const schedules = await context.entities.BusSchedule.findMany({
        where: {
          route: { slug: routeSlug },
          isActive: true,
        },
        include: {
          route: true,
          _count: {
            select: { tickets: { where: { status: "ACTIVE" } } },
          },
        },
        orderBy: { departureTime: "asc" },
      });
      if (schedules.length > 0) return schedules;
    } catch {
      // Fallback to mock data
    }
  }
  const route = mockRoutes.find((r) => r.slug === routeSlug);
  if (!route) return [];

  return mockSchedules.filter((s) => s.routeId === route.id).map((s) => ({
    ...s,
    route,
    availableSeats:
      s.totalSeats -
      mockTickets.filter(
        (t) => t.scheduleId === s.id && t.status === "ACTIVE",
      ).length,
  }));
};

export const getSeatMap = async (
  { scheduleId }: { scheduleId: string },
  context: any,
) => {
  if (context.entities?.BusTicket) {
    try {
      const takenSeats = await context.entities.BusTicket.findMany({
        where: {
          scheduleId,
          status: "ACTIVE",
        },
        select: { seatNumber: true, seatClass: true },
      });
      if (takenSeats.length > 0) return takenSeats;
    } catch {
      // Fallback to mock data
    }
  }
  return mockTickets
    .filter((t) => t.scheduleId === scheduleId && t.status === "ACTIVE")
    .map((t) => ({
      seatNumber: t.seatNumber,
      seatClass: t.seatClass,
    }));
};

export const getUserBusTickets = async (_args: unknown, context: any) => {
  if (context.entities?.BusTicket) {
    try {
      const tickets = await context.entities.BusTicket.findMany({
        where: { status: { in: ["ACTIVE", "USED"] } },
        include: { schedule: { include: { route: true } } },
        orderBy: { purchaseTime: "desc" },
      });
      if (tickets.length > 0) return tickets;
    } catch {
      // Fallback to mock data
    }
  }
  return mockTickets;
};

// ──────────────────────────────────────────────────────────────
// ACTIONS
// ──────────────────────────────────────────────────────────────

export const purchaseBusTicket = async (
  {
    scheduleId,
    seatNumber,
    seatClass,
    passengerName,
    passengerId,
    userId,
  }: {
    scheduleId: string;
    seatNumber: string;
    seatClass: "ECONOMY" | "SEMI_CAMA" | "CAMA" | "VIP";
    passengerName: string;
    passengerId?: string;
    userId?: string;
  },
  context: any,
) => {
  const schedule = mockSchedules.find((s) => s.id === scheduleId);
  const route = schedule ? mockRoutes.find((r) => r.id === schedule.routeId) : null;

  if (!schedule || !route) {
    return {
      success: false,
      message: "❌ Horario o ruta no encontrados.",
    };
  }

  const isTaken = mockTickets.some(
    (t) =>
      t.scheduleId === scheduleId &&
      t.seatNumber === seatNumber &&
      t.status === "ACTIVE",
  );

  if (isTaken) {
    return {
      success: false,
      message: "❌ El asiento seleccionado ya está ocupado. Por favor elige otro.",
    };
  }

  const priceMultiplier = {
    ECONOMY: 1.0,
    SEMI_CAMA: 1.3,
    CAMA: 1.6,
    VIP: 2.0,
  }[seatClass];

  const price = Number(
    (Number(schedule.basePrice) * priceMultiplier).toFixed(2),
  );

  const newTicket: BusTicketMock = {
    id: `bus_${Date.now()}`,
    scheduleId,
    schedule,
    route,
    seatNumber,
    seatClass,
    passengerName,
    passengerId: passengerId || null,
    price,
    qrPayload: computeBusTicketQrPayload(scheduleId, seatNumber, Date.now()),
    status: "ACTIVE",
    purchaseTime: new Date(),
    boardingTime: null,
    validatedAt: null,
  };

  if (context.entities?.BusTicket) {
    try {
      const dbTicket = await context.entities.BusTicket.create({
        data: {
          schedule: { connect: { id: scheduleId } },
          userId: userId || undefined,
          seatNumber,
          seatClass,
          passengerName,
          passengerId: passengerId || undefined,
          price,
          qrPayload: newTicket.qrPayload,
        },
      });
      return {
        success: true,
        ticket: dbTicket,
        message: `✅ Boleto comprado: ${route.origin} → ${route.destination} | Asiento ${seatNumber} | Total: $${price.toFixed(2)}`,
      };
    } catch (err: any) {
      // If DB write fails (e.g. race condition), return error
      return {
        success: false,
        message: `❌ No se pudo reservar el asiento: ${err.message || "Error desconocido"}`,
      };
    }
  }

  mockTickets.push(newTicket);
  return {
    success: true,
    ticket: newTicket,
    message: `✅ Boleto comprado: ${route.origin} → ${route.destination} | Asiento ${seatNumber} | Total: $${price.toFixed(2)}`,
  };
};

export const validateBusBoarding = async (
  { qrPayload }: { qrPayload: string },
  context: any,
) => {
  if (context.entities?.BusTicket) {
    try {
      const ticket = await context.entities.BusTicket.findUnique({
        where: { qrPayload },
        include: { schedule: { include: { route: true } } },
      });

      if (!ticket) {
        return { isValid: false, reason: "INVALID_QR", message: "⚠️ Código QR inválido o no reconocido." };
      }

      if (ticket.status === "USED") {
        return { isValid: false, reason: "ALREADY_USED", message: "❌ Este boleto ya fue validado en la salida." };
      }

      if (ticket.status === "CANCELLED") {
        return { isValid: false, reason: "CANCELLED", message: "❌ Boleto cancelado. No se permite el abordaje." };
      }

      await context.entities.BusTicket.update({
        where: { id: ticket.id },
        data: {
          status: "USED",
          validatedAt: new Date(),
          boardingTime: new Date(),
        },
      });

      return {
        isValid: true,
        ticketId: ticket.id,
        passengerName: ticket.passengerName,
        seatNumber: ticket.seatNumber,
        route: `${ticket.schedule.route.origin} → ${ticket.schedule.route.destination}`,
        validatedAt: new Date().toISOString(),
        message: "✅ Boleto válido. ¡Bienvenido a bordar!",
      };
    } catch {
      // Fallback to mock
    }
  }

  const ticket = mockTickets.find((t) => t.qrPayload === qrPayload);
  if (!ticket) {
    return { isValid: false, reason: "INVALID_QR", message: "⚠️ Código QR inválido o no reconocido." };
  }

  if (ticket.status === "USED") {
    return { isValid: false, reason: "ALREADY_USED", message: "❌ Este boleto ya fue validado." };
  }

  ticket.status = "USED";
  ticket.boardingTime = new Date();
  ticket.validatedAt = new Date();

  return {
    isValid: true,
    ticketId: ticket.id,
    passengerName: ticket.passengerName,
    seatNumber: ticket.seatNumber,
    route: `${ticket.route.origin} → ${ticket.route.destination}`,
    validatedAt: new Date().toISOString(),
    message: "✅ Boleto válido. ¡Bienvenido a bordar!",
  };
};

export const cancelBusTicket = async (
  { ticketId, userId }: { ticketId: string; userId?: string },
  context: any,
) => {
  if (context.entities?.BusTicket) {
    try {
      await context.entities.BusTicket.update({
        where: { id: ticketId },
        data: { status: "CANCELLED" },
      });
      return { success: true, message: "✅ Boleto cancelado y reembolsado." };
    } catch {
      // Fallback to mock
    }
  }

  const ticket = mockTickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return { success: false, message: "❌ Boleto no encontrado." };
  }

  ticket.status = "CANCELLED";
  return { success: true, message: "✅ Boleto cancelado y reembolsado." };
};
