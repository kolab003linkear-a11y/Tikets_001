import { TicketStatus } from "@prisma/client";
import { HttpError } from "wasp/server";
import * as z from "zod";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";
import { generateDynamicToken, verifyDynamicToken } from "./dynamicToken";

// In-memory fallback / sample ticket store for instant rich demo experience
const mockTickets = [
  {
    id: "tkt_stadium_01",
    userId: "user_1",
    eventTitle: "Gran Final: Liga de Campeones - Estadio Monumental",
    venueName: "Estadio Monumental Isidro Romero",
    eventDate: new Date(Date.now() + 86400000 * 2),
    zone: "Tribuna Occidental",
    row: "Fila 14",
    seatNumber: "Asiento 22",
    ticketSecret: "SEC_MONUMENTAL_TKT_88921_SECRET",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "tkt_concert_02",
    userId: "user_1",
    eventTitle: "Coldplay: Music of the Spheres World Tour",
    venueName: "Estadio Olímpico Atahualpa",
    eventDate: new Date(Date.now() + 86400000 * 5),
    zone: "Cancha VIP",
    row: "Acceso Puerta 3",
    seatNumber: "Pase 104",
    ticketSecret: "SEC_COLDPLAY_VIP_44012_SECRET",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export interface Ticket {
  id: string;
  userId: string;
  eventTitle: string;
  venueName: string;
  eventDate: Date;
  zone: string;
  row: string;
  seatNumber: string;
  ticketSecret: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketEntity {
  findMany: (args?: any) => Promise<Ticket[]>;
  findUnique: (args: { where: { id: string } }) => Promise<Ticket | null>;
  create: (args: any) => Promise<Ticket>;
  update: (args: any) => Promise<Ticket>;
}

interface WaspContext {
  user?: any;
  entities?: {
    Ticket?: TicketEntity;
    User?: any;
  };
}

export const getUserTickets = async (_args: unknown, context: WaspContext) => {
  if (context.entities?.Ticket) {
    try {
      const tickets = await context.entities.Ticket.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (tickets.length > 0) return tickets;
    } catch {
      // Return mock tickets if database empty
    }
  }
  return mockTickets;
};

export const generateDynamicQRToken = async (
  { ticketId }: { ticketId: string },
  context: WaspContext,
) => {
  let secret = "DEFAULT_TICKET_CRYPT_SEED";

  if (context.entities?.Ticket) {
    try {
      const ticket = await context.entities.Ticket.findUnique({
        where: { id: ticketId },
      });
      if (ticket) {
        secret = ticket.ticketSecret;
      }
    } catch {
      // Fallback
    }
  }

  const mock = mockTickets.find((t) => t.id === ticketId);
  if (mock) {
    secret = mock.ticketSecret;
  }

  const dynamicData = generateDynamicToken(secret, 30);
  return {
    ticketId,
    tokenPayload: dynamicData.token,
    windowEpoch: dynamicData.windowEpoch,
    secondsRemaining: dynamicData.secondsRemaining,
  };
};

export const validateTicketEntry = async (
  {
    ticketId,
    tokenPayload,
    gateId = "GATE-TURNSTILE-01",
  }: {
    ticketId: string;
    tokenPayload: string;
    gateId?: string;
  },
  context: WaspContext,
) => {
  let secret = "DEFAULT_TICKET_CRYPT_SEED";
  let ticketData: Ticket | null = mockTickets.find((t) => t.id === ticketId) || null;

  if (context.entities?.Ticket) {
    try {
      const ticket = await context.entities.Ticket.findUnique({
        where: { id: ticketId },
      });
      if (ticket) {
        ticketData = ticket;
        secret = ticket.ticketSecret;
      }
    } catch {
      // Use fallback
    }
  }

  if (ticketData?.status === "USED") {
    return {
      isValid: false,
      reason: "ALREADY_USED",
      message: "❌ Boleto ya fue utilizado en puerta previamente.",
    };
  }

  const isValidToken = verifyDynamicToken(secret, tokenPayload, 30, 1);

  if (!isValidToken) {
    return {
      isValid: false,
      reason: "EXPIRED_OR_CLONED",
      message: "⚠️ Token dinámico vencido o captura estática inválida.",
    };
  }

  return {
    isValid: true,
    ticketId,
    attendeeZone: ticketData?.zone || "General",
    seatNumber: ticketData?.seatNumber || "Acceso",
    scannedAt: new Date().toISOString(),
    gateId,
    message: "✅ Acceso Concedido: Token criptográfico válido.",
  };
};

export const getAdminTicketsAndStats = async (_args: unknown, context: WaspContext) => {
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

  let dbTickets: any[] = [];
  if (context.entities?.Ticket) {
    try {
      dbTickets = await context.entities.Ticket.findMany({
        include: {
          user: {
            select: { id: true, email: true, name: true, username: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      dbTickets = [];
    }
  }

  const allTickets =
    dbTickets.length > 0
      ? dbTickets
      : mockTickets.map((t) => ({
          ...t,
          user: { id: t.userId, email: "asistente@ejemplo.com", name: "Usuario Demo" },
        }));

  const totalTickets = allTickets.length;
  const activeCount = allTickets.filter((t) => t.status === "ACTIVE").length;
  const usedCount = allTickets.filter((t) => t.status === "USED").length;
  const transferredCount = allTickets.filter((t) => t.status === "TRANSFERRED").length;
  const cancelledCount = allTickets.filter((t) => t.status === "CANCELLED").length;

  const eventsMap = new Map<
    string,
    { eventTitle: string; venueName: string; eventDate: Date; ticketCount: number; usedCount: number }
  >();

  allTickets.forEach((t) => {
    const key = `${t.eventTitle}_${t.venueName}`;
    const existing = eventsMap.get(key);
    if (existing) {
      existing.ticketCount += 1;
      if (t.status === "USED") existing.usedCount += 1;
    } else {
      eventsMap.set(key, {
        eventTitle: t.eventTitle,
        venueName: t.venueName,
        eventDate: new Date(t.eventDate),
        ticketCount: 1,
        usedCount: t.status === "USED" ? 1 : 0,
      });
    }
  });

  const eventSummaries = Array.from(eventsMap.values());

  return {
    tickets: allTickets,
    stats: {
      totalTickets,
      activeCount,
      usedCount,
      transferredCount,
      cancelledCount,
      totalEvents: eventSummaries.length,
    },
    events: eventSummaries,
  };
};

const createAdminTicketInputSchema = z.object({
  eventTitle: z.string().nonempty(),
  venueName: z.string().nonempty(),
  eventDate: z.string().nonempty(),
  zone: z.string().nonempty(),
  row: z.string().nonempty(),
  seatNumber: z.string().nonempty(),
  userEmail: z.string().optional(),
});

type CreateAdminTicketInput = z.infer<typeof createAdminTicketInputSchema>;

export const createAdminTicket = async (rawArgs: unknown, context: WaspContext) => {
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

  const {
    eventTitle,
    venueName,
    eventDate,
    zone,
    row,
    seatNumber,
    userEmail,
  } = ensureArgsSchemaOrThrowHttpError(createAdminTicketInputSchema, rawArgs);

  let targetUserId = context.user.id;
  if (userEmail && context.entities?.User) {
    const targetUser = await context.entities.User.findUnique({
      where: { email: userEmail },
    });
    if (targetUser) {
      targetUserId = targetUser.id;
    }
  }

  const randomSecret = `SEC_${eventTitle.replace(/[^A-Z0-9]/gi, "").toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}_SECRET`;

  if (context.entities?.Ticket) {
    return await context.entities.Ticket.create({
      data: {
        userId: targetUserId,
        eventTitle,
        venueName,
        eventDate: new Date(eventDate),
        zone,
        row,
        seatNumber,
        ticketSecret: randomSecret,
        status: "ACTIVE",
      },
    });
  }

  return {
    id: `tkt_${Date.now()}`,
    userId: targetUserId,
    eventTitle,
    venueName,
    eventDate: new Date(eventDate),
    zone,
    row,
    seatNumber,
    ticketSecret: randomSecret,
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const updateAdminTicketStatusInputSchema = z.object({
  ticketId: z.string().nonempty(),
  status: z.nativeEnum(TicketStatus),
});

type UpdateAdminTicketStatusInput = z.infer<typeof updateAdminTicketStatusInputSchema>;

export const updateAdminTicketStatus = async (
  rawArgs: unknown,
  context: WaspContext,
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

  const { ticketId, status } = ensureArgsSchemaOrThrowHttpError(
    updateAdminTicketStatusInputSchema,
    rawArgs,
  );

  if (context.entities?.Ticket) {
    return await context.entities.Ticket.update({
      where: { id: ticketId },
      data: {
        status,
        ...(status === "USED" ? { entryTimestamp: new Date() } : {}),
      },
    });
  }

  return { ticketId, status };
};

