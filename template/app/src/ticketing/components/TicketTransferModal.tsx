import React, { useState } from "react";
import { Send, CheckCircle2, ShieldCheck, AlertTriangle, ArrowRight, UserCheck, X } from "lucide-react";
import { transferTicket } from "../transferOperations";
import { StatusBadge } from "../../client/components/ui/StatusBadge";

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
  const [transferResult, setTransferResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;

    setIsSubmitting(true);
    const res = await transferTicket({ ticketId: ticket.id, recipientEmail }, {});
    setIsSubmitting(false);
    setTransferResult(res);
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-2xl font-sans relative">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-800">
        <div className="p-3 bg-[#0A2540] rounded-2xl border border-sky-500/20 text-[#0EA5E9]">
          <Send className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white font-['Satoshi',sans-serif]">
            Transferencia Segura de Entrada In-App
          </h3>
          <p className="text-xs text-slate-400">
            Custodia digital directa. Invalida tu código QR y emite uno nuevo al destinatario.
          </p>
        </div>
      </div>

      <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1 text-xs">
        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
          {ticket.zone}
        </span>
        <h4 className="font-bold text-white text-sm mt-1 font-['Satoshi',sans-serif]">{ticket.eventTitle}</h4>
        <p className="text-slate-400 font-mono">{ticket.row} • {ticket.seatNumber}</p>
      </div>

      {transferResult ? (
        <div className="p-5 bg-teal-950/40 border border-teal-500/40 rounded-2xl text-teal-200 text-xs space-y-3">
          <div className="flex items-center space-x-2 font-bold text-teal-300">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-['Satoshi',sans-serif]">Transferencia Registrada Exitosamente</span>
          </div>
          <p className="text-xs leading-relaxed">{transferResult.message}</p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Token Secreto de Reclamo</span>
            {transferResult.transfer?.claimSecret || "SEC-CLAIM-99214-SAFE"}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
            >
              Cerrar y Volver a la Billetera
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Correo Electrónico del Destinatario
            </label>
            <input
              type="email"
              required
              placeholder="amigo@ejemplo.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-300 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-[#0EA5E9] shrink-0 mt-0.5" />
            <span>
              Al transferir, tu token dinámico se desactiva inmediatamente. El destinatario debe aceptar la invitación en la app para generar su nuevo QR.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Transfiriendo..." : "Transferir Entrada de Manera Segura"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
