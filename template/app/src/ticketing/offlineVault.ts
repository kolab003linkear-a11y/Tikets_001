/**
 * Offline vault for persistent IndexedDB & LocalStorage ticket caching.
 * Ensures turnstiles, drivers, and attendees operate seamlessly without internet.
 */

export interface CachedTicket {
  id: string;
  eventTitle: string;
  venueName: string;
  eventDate: string;
  zone: string;
  row: string;
  seatNumber: string;
  ticketSecret: string;
  status: string;
}

const VAULT_STORAGE_KEY = "SUPER_APP_OFFLINE_TICKETS_VAULT";

export function saveTicketsToOfflineVault(tickets: CachedTicket[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(tickets));
    } catch (e) {
      console.warn(
        "[OfflineVault] Failed saving tickets to LocalStorage vault",
        e,
      );
    }
  }
}

export function loadTicketsFromOfflineVault(): CachedTicket[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(VAULT_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn(
        "[OfflineVault] Failed reading tickets from LocalStorage vault",
        e,
      );
    }
  }
  return [];
}

export function getCachedTicketById(
  ticketId: string,
): CachedTicket | undefined {
  const tickets = loadTicketsFromOfflineVault();
  return tickets.find((t) => t.id === ticketId);
}
