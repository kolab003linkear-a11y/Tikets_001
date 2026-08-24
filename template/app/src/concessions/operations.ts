import { ConcessionOrderStatus } from "@prisma/client";
import { HttpError } from "wasp/server";
import * as z from "zod";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";

export const mockMenu = [
  {
    id: "item_01",
    name: "Hamburguesa Doble Monumental",
    price: 6.5,
    category: "Comida",
  },
  {
    id: "item_02",
    name: "Cerveza Artesanal Helada",
    price: 4.0,
    category: "Bebidas",
  },
  {
    id: "item_03",
    name: "Papas Fritas Crispy",
    price: 2.5,
    category: "Snacks",
  },
  {
    id: "item_04",
    name: "Camiseta Oficial de Colección",
    price: 35.0,
    category: "Merchandising",
  },
];

export interface MenuItemOrder {
  name: string;
  qty: number;
  price: number;
}

export interface ConcessionOrder {
  id: string;
  seatZone: string;
  seatRow: string;
  seatNumber: string;
  items: MenuItemOrder[];
  totalAmount: number;
  deliveryPin: string;
  status: string;
  runnerName: string;
}

export const mockVenues = [
  {
    id: "venue_01",
    name: "Estadio Monumental Isidro Romero",
    concessionZones: ["Tribuna Occidental", "Palcos", "Generales Norte", "Generales Sur"],
  },
  {
    id: "venue_02",
    name: "Estadio Olímpico Atahualpa",
    concessionZones: ["Tribuna Principal", "Palcos VIP", "Preferencia"],
  },
];

export const mockAdminOrders = [
  {
    id: "ord_101",
    venueId: "venue_01",
    venue: mockVenues[0],
    user: { email: "aficionado1@ejemplo.com", name: "Gabriel Soria" },
    seatZone: "Tribuna Occidental",
    seatRow: "Fila 14",
    seatNumber: "Asiento 22",
    itemsJson: [
      { name: "Hamburguesa Doble Monumental", qty: 2, price: 6.5 },
      { name: "Cerveza Artesanal Helada", qty: 2, price: 4.0 },
    ],
    totalAmount: 21.0,
    deliveryPin: "4921",
    status: "PREPARING",
    runnerName: "Esteban (Runner 04)",
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "ord_102",
    venueId: "venue_02",
    venue: mockVenues[1],
    user: { email: "aficionado2@ejemplo.com", name: "Andrea Pineda" },
    seatZone: "Palcos VIP",
    seatRow: "Fila 3",
    seatNumber: "Asiento 08",
    itemsJson: [
      { name: "Camiseta Oficial de Colección", qty: 1, price: 35.0 },
      { name: "Papas Fritas Crispy", qty: 1, price: 2.5 },
    ],
    totalAmount: 37.5,
    deliveryPin: "8812",
    status: "DELIVERED",
    runnerName: "Mateo (Runner 02)",
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    deliveredAt: new Date(Date.now() - 1000 * 60 * 20),
  },
];

export const mockOrders: ConcessionOrder[] = [
  {
    id: "ord_101",
    seatZone: "Tribuna Occidental",
    seatRow: "Fila 14",
    seatNumber: "Asiento 22",
    items: [
      { name: "Hamburguesa Doble Monumental", qty: 2, price: 6.5 },
      { name: "Cerveza Artesanal Helada", qty: 2, price: 4.0 },
    ],
    totalAmount: 21.0,
    deliveryPin: "4921",
    status: "PREPARING",
    runnerName: "Esteban Runner",
  },
];

export const getSeatConcessionMenuAndOrders = async () => {
  return {
    menu: mockMenu,
    orders: mockOrders,
  };
};

export const submitSeatOrder = async ({
  seatZone,
  seatRow,
  seatNumber,
  items,
  totalAmount,
}: {
  seatZone: string;
  seatRow: string;
  seatNumber: string;
  items: MenuItemOrder[];
  totalAmount: number;
}) => {
  const newOrder: ConcessionOrder = {
    id: `ord_${Date.now()}`,
    seatZone,
    seatRow,
    seatNumber,
    items,
    totalAmount,
    deliveryPin: Math.floor(1000 + Math.random() * 9000).toString(),
    status: "RECEIVED",
    runnerName: "Asignando repartidor...",
  };

  mockOrders.unshift(newOrder);
  return {
    success: true,
    order: newOrder,
    message: `✅ Pedido recibido. Tu PIN de entrega es ${newOrder.deliveryPin}. Te lo llevaremos directo a tu asiento.`,
  };
};

export const confirmSeatDelivery = async ({
  orderId,
  deliveryPin,
}: {
  orderId: string;
  deliveryPin: string;
}) => {
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) return { success: false, message: "Pedido no encontrado" };

  if (order.deliveryPin !== deliveryPin.trim()) {
    return { success: false, message: "❌ PIN de entrega incorrecto." };
  }

  order.status = "DELIVERED";
  return {
    success: true,
    message: "✅ Entrega confirmada con éxito al asiento del usuario.",
  };
};

export const getAdminConcessionsStatsAndOrders = async (_args: unknown, context: any) => {
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

  let dbVenues: any[] = [];
  let dbOrders: any[] = [];

  if (context.entities?.InStadiumVenue) {
    try {
      dbVenues = await context.entities.InStadiumVenue.findMany({
        include: {
          concessionOrders: true,
        },
        orderBy: { name: "asc" },
      });
    } catch {
      dbVenues = [];
    }
  }

  if (context.entities?.ConcessionOrder) {
    try {
      dbOrders = await context.entities.ConcessionOrder.findMany({
        include: {
          venue: true,
          user: {
            select: { id: true, email: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    } catch {
      dbOrders = [];
    }
  }

  const venues = dbVenues.length > 0 ? dbVenues : mockVenues;
  const orders = dbOrders.length > 0 ? dbOrders : mockAdminOrders;

  const totalVenues = venues.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) =>
      o.status === "QUEUED_OFFLINE" ||
      o.status === "RECEIVED" ||
      o.status === "PREPARING" ||
      o.status === "OUT_FOR_DELIVERY",
  ).length;

  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;

  const totalRevenue = orders.reduce((sum, o) => {
    const amount = typeof o.totalAmount === "number" ? o.totalAmount : parseFloat(o.totalAmount || "0");
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  return {
    venues,
    orders,
    menu: mockMenu,
    stats: {
      totalVenues,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
    },
  };
};

const createOrUpdateStadiumVenueInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty(),
  concessionZones: z.array(z.string()),
});

type CreateOrUpdateStadiumVenueInput = z.infer<
  typeof createOrUpdateStadiumVenueInputSchema
>;

export const createOrUpdateStadiumVenue = async (
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

  const { id, name, concessionZones } = ensureArgsSchemaOrThrowHttpError(
    createOrUpdateStadiumVenueInputSchema,
    rawArgs,
  );

  if (context.entities?.InStadiumVenue) {
    if (id) {
      return await context.entities.InStadiumVenue.update({
        where: { id },
        data: {
          name,
          concessionZones,
        },
      });
    } else {
      return await context.entities.InStadiumVenue.create({
        data: {
          name,
          concessionZones,
        },
      });
    }
  }

  if (id) {
    const existing = mockVenues.find((v) => v.id === id);
    if (existing) {
      existing.name = name;
      existing.concessionZones = concessionZones;
      return existing;
    }
  }

  const newVenue = {
    id: `venue_${Date.now()}`,
    name,
    concessionZones,
  };
  mockVenues.push(newVenue);
  return newVenue;
};

const updateConcessionOrderStatusInputSchema = z.object({
  orderId: z.string().nonempty(),
  status: z.nativeEnum(ConcessionOrderStatus),
  runnerName: z.string().optional(),
});

type UpdateConcessionOrderStatusInput = z.infer<
  typeof updateConcessionOrderStatusInputSchema
>;

export const updateConcessionOrderStatus = async (
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

  const { orderId, status, runnerName } = ensureArgsSchemaOrThrowHttpError(
    updateConcessionOrderStatusInputSchema,
    rawArgs,
  );

  if (context.entities?.ConcessionOrder) {
    return await context.entities.ConcessionOrder.update({
      where: { id: orderId },
      data: {
        status,
        ...(runnerName ? { runnerName } : {}),
        ...(status === "DELIVERED" ? { deliveredAt: new Date() } : {}),
      },
    });
  }

  const mockOrd = mockAdminOrders.find((o) => o.id === orderId);
  if (mockOrd) {
    mockOrd.status = status;
    if (runnerName) mockOrd.runnerName = runnerName;
    if (status === "DELIVERED") mockOrd.deliveredAt = new Date();
    return mockOrd;
  }

  return { orderId, status };
};

