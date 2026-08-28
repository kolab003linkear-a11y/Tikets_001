/**
 * Offline vault for persistent bus ticket caching in LocalStorage & Cache Storage.
 * Ensures passengers can access their tickets without network connectivity.
 */

export interface CachedBusTicket {
  id: string;
  scheduleId: string;
  routeOrigin: string;
  routeDestination: string;
  departureTime: string;
  arrivalTime: string | null;
  busUnitNumber: string;
  driverName: string | null;
  seatNumber: string;
  seatClass: string;
  passengerName: string;
  passengerId: string | null;
  price: number;
  qrPayload: string;
  status: string;
  purchaseTime: string;
}

const BUS_TICKET_VAULT_KEY = "TICKETSAFE_BUS_TICKETS_VAULT";

export function saveBusTicketsToVault(tickets: CachedBusTicket[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BUS_TICKET_VAULT_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.warn("[BusOfflineVault] Failed saving bus tickets to LocalStorage", e);
    }
  }
}

export function loadBusTicketsFromVault(): CachedBusTicket[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(BUS_TICKET_VAULT_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("[BusOfflineVault] Failed reading bus tickets from LocalStorage", e);
    }
  }
  return [];
}

export function getCachedBusTicketById(ticketId: string): CachedBusTicket | undefined {
  const tickets = loadBusTicketsFromVault();
  return tickets.find((t) => t.id === ticketId);
}

export function saveSingleBusTicket(ticket: CachedBusTicket): void {
  const tickets = loadBusTicketsFromVault();
  const existing = tickets.find((t) => t.id === ticket.id);
  if (existing) {
    const updated = tickets.map((t) => (t.id === ticket.id ? ticket : t));
    saveBusTicketsToVault(updated);
  } else {
    saveBusTicketsToVault([...tickets, ticket]);
  }
}
