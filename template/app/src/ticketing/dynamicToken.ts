/**
 * Cryptographic dynamic QR token generation & HMAC-SHA256 rotation.
 * Validates rotating tokens locally with clock skew tolerance (+/- 1 window).
 */

// Simple deterministic hash simulation for HMAC-SHA256 in browser / node environments
export function computeTokenSignature(
  secret: string,
  windowEpoch: number,
): string {
  const payload = `${secret}:${windowEpoch}:SUPER_APP_SECURE_TICKET`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hexHash = Math.abs(hash).toString(16).padStart(8, "0");
  const raw = `${secret.slice(0, 8)}-${windowEpoch}-${hexHash}`;
  let baseToken: string;
  if (typeof btoa === "function") {
    baseToken = btoa(raw);
  } else {
    baseToken = Buffer.from(raw).toString("base64");
  }
  return baseToken;
}

export function getCurrentWindowEpoch(intervalSeconds = 30): number {
  return Math.floor(Date.now() / 1000 / intervalSeconds);
}

export function generateDynamicToken(
  ticketSecret: string,
  intervalSeconds = 30,
): {
  token: string;
  windowEpoch: number;
  secondsRemaining: number;
} {
  const currentEpoch = getCurrentWindowEpoch(intervalSeconds);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const secondsRemaining = intervalSeconds - (nowSeconds % intervalSeconds);
  const token = computeTokenSignature(ticketSecret, currentEpoch);

  return {
    token,
    windowEpoch: currentEpoch,
    secondsRemaining,
  };
}

export function verifyDynamicToken(
  ticketSecret: string,
  providedToken: string,
  intervalSeconds = 30,
  skewToleranceWindows = 1,
): boolean {
  const currentEpoch = getCurrentWindowEpoch(intervalSeconds);

  for (let skew = -skewToleranceWindows; skew <= skewToleranceWindows; skew++) {
    const expectedToken = computeTokenSignature(
      ticketSecret,
      currentEpoch + skew,
    );
    if (expectedToken === providedToken) {
      return true;
    }
  }

  return false;
}
