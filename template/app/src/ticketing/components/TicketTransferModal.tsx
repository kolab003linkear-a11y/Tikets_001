import React, { useState } from "react";
import { Send, CheckCircle2, ShieldCheck, AlertTriangle, ArrowRight, UserCheck } from "lucide-react";
import { transferTicket } from "../transferOperations";

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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Transferencia Segura de Entrada In-App</h3>
            <p className="text-xs text-slate-400">Evita enviar PDFs informales por WhatsApp. Garantiza custodia digital real.</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-xs">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{ticket.zone}</span>
        <h4 className="font-bold text-white text-sm">{ticket.eventTitle}</h4>
        <p className="text-slate-400">{ticket.row} • {ticket.seatNumber}</p>
      </div>

      {transferResult ? (
        <div className="p-5 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Transferencia Iniciada</span>
          </div>
          <p className="text-[11px]">{transferResult.message}</p>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-400">
            Secreto de Reclamo: {transferResult.transfer?.claimSecret}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-400">Correo Electrónico del Destinatario</label>
            <input
              type="email"
              required
              placeholder="amigo@ejemplo.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>Al transferir, tu código QR dinámico actual se invalida inmediatamente y el destinatario recibe un secreto criptográfico exclusivo.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Transfiriendo..." : "Transferir Entrada de Manera Segura"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
