/**
 * Service Worker background sync queue for offline concession orders.
 */

export interface QueuedConcessionOrder {
  clientOrderId: string;
  ticketId?: string;
  seatZone: string;
  seatRow: string;
  seatNumber: string;
  items: { name: string; qty: number; price: number }[];
  totalAmount: number;
  deliveryPin: string;
  queuedAt: string;
}

const CONCESSION_QUEUE_KEY = "SUPER_APP_CONCESSION_QUEUE";

export function enqueueConcessionOrder(order: QueuedConcessionOrder): void {
  if (typeof window !== "undefined") {
    try {
      const existing = getQueuedConcessionOrders();
      existing.push(order);
      localStorage.setItem(CONCESSION_QUEUE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn("[ConcessionsQueue] Failed saving queued order", e);
    }
  }
}

export function getQueuedConcessionOrders(): QueuedConcessionOrder[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CONCESSION_QUEUE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }
  }
  return [];
}
