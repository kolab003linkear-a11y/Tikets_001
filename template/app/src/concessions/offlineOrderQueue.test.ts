import { describe, it, expect, beforeEach } from "vitest";
import {
  enqueueConcessionOrder,
  getQueuedConcessionOrders,
  QueuedConcessionOrder,
} from "./offlineOrderQueue";

describe("TicketSafe Offline Concession Queue & Seat-Side Delivery", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  it("should queue order with exact seat coordinates in local storage during degraded network", () => {
    const order: QueuedConcessionOrder = {
      clientOrderId: "ord_seat_01",
      seatZone: "Tribuna Occidental",
      seatRow: "Fila 14",
      seatNumber: "Asiento 22",
      items: [{ name: "Combo Hamburguesa + Bebida", qty: 2, price: 8.5 }],
      totalAmount: 17.0,
      deliveryPin: "PIN-4921",
      queuedAt: new Date().toISOString(),
    };

    enqueueConcessionOrder(order);
    const queue = getQueuedConcessionOrders();

    expect(queue.length).toBe(1);
    expect(queue[0].clientOrderId).toBe("ord_seat_01");
    expect(queue[0].seatZone).toBe("Tribuna Occidental");
    expect(queue[0].seatNumber).toBe("Asiento 22");
    expect(queue[0].totalAmount).toBe(17.0);
    expect(queue[0].deliveryPin).toBe("PIN-4921");
  });
});
