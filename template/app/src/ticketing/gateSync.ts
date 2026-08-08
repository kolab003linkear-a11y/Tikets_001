/**
 * Nonce sync relay for offline turnstiles and gate scanners.
 */

export interface InvalidationNonce {
  ticketId: string;
  tokenPayload: string;
  consumedAt: string;
  gateId: string;
}

const CONSUMED_NONCES_KEY = "SUPER_APP_CONSUMED_NONCES";

export function recordConsumedNonce(nonce: InvalidationNonce): void {
  if (typeof window !== "undefined") {
    try {
      const existing = getConsumedNonces();
      existing.push(nonce);
      localStorage.setItem(CONSUMED_NONCES_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn("[GateSync] Failed saving consumed nonce", e);
    }
  }
}

export function getConsumedNonces(): InvalidationNonce[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CONSUMED_NONCES_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }
  }
  return [];
}
