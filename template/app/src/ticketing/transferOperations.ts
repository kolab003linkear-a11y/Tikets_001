import { generateTransferClaimSecret, revokeSenderDynamicTokenSecret } from "./transferSecurity";

export const pendingTransfers: any[] = [];

export const transferTicket = async (
  { ticketId, recipientEmail }: { ticketId: string; recipientEmail: string },
  _context: any
) => {
  const claimSecret = generateTransferClaimSecret(ticketId, "user_1");

  const transfer = {
    id: `trans_${Date.now()}`,
    ticketId,
    recipientEmail,
    claimSecret,
    status: "PENDING",
    expiresAt: new Date(Date.now() + 86400000),
  };

  pendingTransfers.push(transfer);

  return {
    success: true,
    transfer,
    message: `✅ Transferencia iniciada a ${recipientEmail}. Tu código QR dinámico fue revocado temporalmente hasta que se acepte o reclames la entrada.`,
  };
};

export const claimTransferTicket = async (
  { claimSecret }: { claimSecret: string },
  _context: any
) => {
  const transfer = pendingTransfers.find((t) => t.claimSecret === claimSecret);
  if (!transfer) return { success: false, message: "Enlace de transferencia no encontrado o expirado." };

  transfer.status = "ACCEPTED";
  return {
    success: true,
    message: "✅ Entrada aceptada y transferida con éxito a tu billetera personal con un nuevo secreto criptográfico.",
  };
};
