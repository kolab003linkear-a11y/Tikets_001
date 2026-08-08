import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  QrCode, 
  RefreshCw, 
  Smartphone, 
  Lock, 
  Send, 
  UtensilsCrossed, 
  WifiOff, 
  Clock, 
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { generateDynamicToken } from "../dynamicToken";
import { saveTicketsToOfflineVault, loadTicketsFromOfflineVault } from "../offlineVault";

interface TicketData {
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

const DEFAULT_TICKETS: TicketData[] = [
  {
    id: "tkt_stadium_01",
    eventTitle: "Gran Final: Liga de Campeones - Estadio Monumental",
    venueName: "Estadio Monumental Isidro Romero",
    eventDate: "Sábado 15 de Agosto, 18:00",
    zone: "Tribuna Occidental",
    row: "Fila 14",
    seatNumber: "Asiento 22",
    ticketSecret: "SEC_MONUMENTAL_TKT_88921_SECRET",
    status: "ACTIVE",
  },
  {
    id: "tkt_concert_02",
    eventTitle: "Coldplay: Music of the Spheres World Tour",
    venueName: "Estadio Olímpico Atahualpa",
    eventDate: "Viernes 28 de Agosto, 20:00",
    zone: "Cancha VIP",
    row: "Acceso Puerta 3",
    seatNumber: "Pase 104",
    ticketSecret: "SEC_COLDPLAY_VIP_44012_SECRET",
    status: "ACTIVE",
  },
];

export function TicketWallet({
  isOffline,
  onOpenConcessions,
  onOpenTransfer,
}: {
  isOffline: boolean;
  onOpenConcessions?: (ticket: TicketData) => void;
  onOpenTransfer?: (ticket: TicketData) => void;
}) {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [dynamicToken, setDynamicToken] = useState<string>("");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [showLockScreenSimulator, setShowLockScreenSimulator] = useState<boolean>(false);

  useEffect(() => {
    // Load from local storage vault or initialize defaults
    const cached = loadTicketsFromOfflineVault();
    if (cached && cached.length > 0) {
      setTickets(cached);
      setSelectedTicket(cached[0]);
    } else {
      setTickets(DEFAULT_TICKETS);
      setSelectedTicket(DEFAULT_TICKETS[0]);
      saveTicketsToOfflineVault(DEFAULT_TICKETS);
    }
  }, []);

  // 30-Second cryptographic token rotation loop
  useEffect(() => {
    if (!selectedTicket) return;

    const updateToken = () => {
      const result = generateDynamicToken(selectedTicket.ticketSecret, 30);
      setDynamicToken(result.token);
      setSecondsRemaining(result.secondsRemaining);
    };

    updateToken();
    const interval = setInterval(updateToken, 1000);
    return () => clearInterval(interval);
  }, [selectedTicket]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Anti-Fraud & Offline Guarantee */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 text-indigo-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Billetera Digital Anti-Fraude & Caché 100% Offline
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  QR Dinámico Activo
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Los tokens rotan cada 30 segundos localmente. Puedes entrar al estadio en Modo Avión sin depender de señal celular.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLockScreenSimulator(!showLockScreenSimulator)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all shadow-md"
          >
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span>{showLockScreenSimulator ? "Ocultar Widget" : "Simular Widget Pantalla Bloqueada"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Mis Entradas Disponibles ({tickets.length})
          </h3>

          {tickets.map((tkt) => {
            const isSelected = selectedTicket?.id === tkt.id;
            return (
              <div
                key={tkt.id}
                onClick={() => setSelectedTicket(tkt)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
                      {tkt.zone}
                    </span>
                    <h4 className="font-bold text-sm text-white">{tkt.eventTitle}</h4>
                    <p className="text-xs text-slate-400 mt-1">{tkt.venueName}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>{tkt.eventDate}</span>
                  <span className="font-mono text-indigo-300 font-semibold">{tkt.row} • {tkt.seatNumber}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Rotating Dynamic Ticket Presentation */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-white">{selectedTicket.eventTitle}</h3>
                  <p className="text-xs text-slate-400">{selectedTicket.venueName}</p>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Autenticado</span>
                </div>
              </div>

              {/* Dynamic QR Presentation Box */}
              <div className="my-6 flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
                {/* Visual QR Simulator */}
                <div className="relative p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  <QrCode className="w-48 h-48 text-slate-950" />
                  {/* Subtle rotating glow / refresh line */}
                  <div className="absolute inset-0 border-2 border-indigo-500/40 rounded-2xl pointer-events-none animate-pulse" />
                </div>

                {/* Progress bar countdown */}
                <div className="w-64 mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" /> Token Dinámico
                    </span>
                    <span className="font-mono text-indigo-300">{secondsRemaining}s</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 font-mono text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-slate-800">
                  Payload: <span className="text-indigo-400">{dynamicToken.slice(0, 16)}...</span>
                </div>
              </div>

              {/* Seat Coordinates & Actions */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Zona</span>
                  <p className="font-bold text-slate-200 mt-0.5">{selectedTicket.zone}</p>
                </div>
                <div className="border-x border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Fila</span>
                  <p className="font-bold text-slate-200 mt-0.5">{selectedTicket.row}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Asiento</span>
                  <p className="font-bold text-indigo-400 mt-0.5">{selectedTicket.seatNumber}</p>
                </div>
              </div>

              {/* Action Buttons: In-Seat Food & In-App Transfer */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onOpenConcessions && onOpenConcessions(selectedTicket)}
                  className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-all shadow-sm"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Pedir Comida al Asiento</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenTransfer && onOpenTransfer(selectedTicket)}
                  className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all shadow-sm"
                >
                  <Send className="w-4 h-4 text-indigo-400" />
                  <span>Transferir Entrada</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Lock-Screen Widget Simulator Modal / Drawer */}
      {showLockScreenSimulator && selectedTicket && (
        <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/40 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Widget de Pantalla Bloqueada (Live Activity)</span>
            </div>
            <span className="text-[10px] text-slate-400">Acceso en 0 toques sin abrir app</span>
          </div>

          <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white rounded-xl">
                <QrCode className="w-16 h-16 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded">
                  {selectedTicket.zone}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">{selectedTicket.eventTitle}</h4>
                <p className="text-xs text-slate-300">{selectedTicket.row} • {selectedTicket.seatNumber}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1 justify-end">
                <RefreshCw className="w-3 h-3 animate-spin" /> {secondsRemaining}s para refresco
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Listo para escaneo en molinete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
