import { HttpError } from "wasp/server";

type EventContext = {
  user?: { id: string };
  entities: {
    Event: {
      findMany: (args: object) => Promise<unknown>;
      create: (args: object) => Promise<unknown>;
      update: (args: object) => Promise<unknown>;
    };
    EventTicketType: {
      findUnique: (args: object) => Promise<{
        event: { organizerId: string };
      } | null>;
      update: (args: object) => Promise<unknown>;
    };
  };
};

function getEventContext(context: unknown): EventContext {
  return context as EventContext;
}

function requireUser(context: unknown) {
  const eventContext = getEventContext(context);
  if (!eventContext.user) throw new HttpError(401, "Debes iniciar sesión");
  return eventContext.user;
}

export const getEvents = async (_args: unknown, context: unknown) => {
  const eventContext = getEventContext(context);
  const user = requireUser(context);
  return eventContext.entities.Event.findMany({
    where: { organizerId: user.id },
    include: { ticketTypes: { orderBy: { createdAt: "asc" } } },
    orderBy: { startsAt: "asc" },
  });
};

export const createEvent = async (
  args: {
    title: string;
    startsAt: string;
    category: string;
    ticketTypes?: Array<{ name: string; price: number; capacity: number }>;
  },
  context: unknown,
) => {
  const eventContext = getEventContext(context);
  const user = requireUser(context);
  if (!args.title?.trim() || !args.startsAt || !args.category?.trim()) {
    throw new HttpError(400, "Título, fecha y categoría son obligatorios");
  }

  return eventContext.entities.Event.create({
    data: {
      organizer: { connect: { id: user.id } },
      title: args.title.trim(),
      startsAt: new Date(args.startsAt),
      category: args.category.trim(),
      venueName: "OchoyMedio",
      venueAddress: "La Floresta, Quito",
      ticketTypes: {
        create: (args.ticketTypes?.length
          ? args.ticketTypes
          : [{ name: "General", price: 6, capacity: 100 }]
        ).map((ticket) => ({
          name: ticket.name.trim(),
          price: Math.max(0, ticket.price),
          capacity: Math.max(0, Math.floor(ticket.capacity)),
        })),
      },
    },
    include: { ticketTypes: true },
  });
};

export const toggleEventPublication = async (
  { eventId, publish }: { eventId: string; publish: boolean },
  context: unknown,
) => {
  const eventContext = getEventContext(context);
  const user = requireUser(context);
  return eventContext.entities.Event.update({
    where: { id: eventId, organizerId: user.id },
    data: { status: publish ? "PUBLISHED" : "DRAFT" },
  });
};

export const updateTicketCapacity = async (
  { ticketTypeId, capacity }: { ticketTypeId: string; capacity: number },
  context: unknown,
) => {
  const eventContext = getEventContext(context);
  const user = requireUser(context);
  if (!Number.isInteger(capacity) || capacity < 0) {
    throw new HttpError(400, "El cupo debe ser un entero positivo");
  }

  const ticketType = await eventContext.entities.EventTicketType.findUnique({
    where: { id: ticketTypeId },
    include: { event: { select: { organizerId: true } } },
  });
  if (!ticketType || ticketType.event.organizerId !== user.id) {
    throw new HttpError(404, "Tipo de entrada no encontrado");
  }

  return eventContext.entities.EventTicketType.update({
    where: { id: ticketTypeId },
    data: { capacity },
  });
};
