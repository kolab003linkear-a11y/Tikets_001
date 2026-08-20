import { CheckCircle2, Send, ShieldCheck, X } from "lucide-react";
import React, { useState } from "react";
import { transferTicket } from "../transferOperations";

interface TransferResult {
  success: boolean;
  message: string;
  transfer?: {
    id: string;
    claimSecret: string;
  };
}

export function TicketTransferModal({
  ticket,
  onClose,
}: {
  ticket: {
    id: string;
    eventTitle: string;
    zone: string;
    row: string;
    seatNumber: string;
  };
  onClose?: () => void;
}) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferResult, setTransferResult] = useState<TransferResult | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;

    setIsSubmitting(true);
    const res = await transferTicket(
      { ticketId: ticket.id, recipientEmail },
      {},
    );
    setIsSubmitting(false);
    setTransferResult(res);
  };

  return (
    <div className="relative space-y-6 rounded-3xl border border-slate-800 bg-slate-900/95 p-6 font-sans shadow-2xl backdrop-blur-2xl sm:p-8">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full bg-slate-800/80 p-2 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-center space-x-3.5 border-b border-slate-800 pb-4">
        <div className="rounded-2xl border border-sky-500/20 bg-[#0A2540] p-3 text-[#0EA5E9]">
          <Send className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-['Satoshi',sans-serif] text-base font-bold text-white">
            Transferencia Segura de Entrada In-App
          </h3>
          <p className="text-xs text-slate-400">
            Custodia digital directa. Invalida tu código QR y emite uno nuevo al
            destinatario.
          </p>
        </div>
      </div>

      <div className="space-y-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs">
        <span className="rounded border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-400">
          {ticket.zone}
        </span>
        <h4 className="mt-1 font-['Satoshi',sans-serif] text-sm font-bold text-white">
          {ticket.eventTitle}
        </h4>
        <p className="font-mono text-slate-400">
          {ticket.row} • {ticket.seatNumber}
        </p>
      </div>

      {transferResult ? (
        <div className="space-y-3 rounded-2xl border border-teal-500/40 bg-teal-950/40 p-5 text-xs text-teal-200">
          <div className="flex items-center space-x-2 font-bold text-teal-300">
            <CheckCircle2 className="h-5 w-5 text-teal-400" />
            <span className="font-['Satoshi',sans-serif] text-sm">
              Transferencia Registrada Exitosamente
            </span>
          </div>
          <p className="text-xs leading-relaxed">{transferResult.message}</p>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300">
            <span className="block text-[10px] font-bold uppercase text-slate-500">
              Token Secreto de Reclamo
            </span>
            {transferResult.transfer?.claimSecret || "SEC-CLAIM-99214-SAFE"}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
            >
              Cerrar y Volver a la Billetera
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">
              Correo Electrónico del Destinatario
            </label>
            <input
              type="email"
              required
              placeholder="amigo@ejemplo.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-start space-x-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 text-xs leading-relaxed text-slate-300">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0EA5E9]" />
            <span>
              Al transferir, tu token dinámico se desactiva inmediatamente. El
              destinatario debe aceptar la invitación en la app para generar su
              nuevo QR.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="active:scale-98 flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 py-3.5 text-xs font-bold text-slate-950 shadow-lg shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-teal-400 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>
              {isSubmitting
                ? "Transfiriendo..."
                : "Transferir Entrada de Manera Segura"}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
