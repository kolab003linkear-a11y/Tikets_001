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
  findMany: (args?: { orderBy?: { createdAt: "desc" } }) => Promise<Ticket[]>;
  findUnique: (args: { where: { id: string } }) => Promise<Ticket | null>;
}

interface WaspContext {
  entities?: {
    Ticket?: TicketEntity;
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
  let ticketData: Ticket | null =
    mockTickets.find((t) => t.id === ticketId) || null;

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
