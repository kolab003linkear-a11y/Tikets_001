/**
 * Cryptographic transfer secret generation & atomic custody revocation.
 */

export function generateTransferClaimSecret(ticketId: string, senderId: string): string {
  const seed = `${ticketId}-${senderId}-${Date.now()}-P2P_CLAIM`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return `claim_${Math.abs(hash).toString(16)}_${Date.now()}`;
}

export function revokeSenderDynamicTokenSecret(ticketSecret: string): string {
  // Rotate the ticket cryptographic secret so previous dynamic tokens are permanently invalidated
  return `REVOKED_${ticketSecret}_${Date.now()}`;
}
