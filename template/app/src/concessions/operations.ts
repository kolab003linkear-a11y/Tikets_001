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

export const mockOrders = [
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

export const getSeatConcessionMenuAndOrders = async (
  _args: unknown,
  _context: any,
) => {
  return {
    menu: mockMenu,
    orders: mockOrders,
  };
};

export const submitSeatOrder = async (
  {
    seatZone,
    seatRow,
    seatNumber,
    items,
    totalAmount,
  }: {
    seatZone: string;
    seatRow: string;
    seatNumber: string;
    items: any[];
    totalAmount: number;
  },
  _context: any,
) => {
  const newOrder = {
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

export const confirmSeatDelivery = async (
  { orderId, deliveryPin }: { orderId: string; deliveryPin: string },
  _context: any,
) => {
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
